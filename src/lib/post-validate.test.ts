import { describe, expect, it } from 'vitest';
import { toPostInput, validatePost } from './post-validate';

const valid = toPostInput({
  title: 'Mất tai nghe màu đen', kind: 'Thất lạc', category: 'Khác',
  place: 'Thư viện', date: '2020-01-01', description: 'Tai nghe màu đen để trong hộp nhỏ.',
  contact: '0912345678',
});

describe('Kiểm tra dữ liệu tin đăng', () => {
  it('chấp nhận tin hợp lệ', () => {
    expect(validatePost(valid)).toEqual({});
  });
  it('báo đủ lỗi ở các trường khi gửi form trống', () => {
    expect(validatePost(toPostInput(new FormData()))).toEqual({
      title: 'Tiêu đề tối thiểu 5 ký tự',
      kind: 'Hãy chọn loại tin',
      category: 'Hãy chọn danh mục',
      place: 'Hãy chọn địa điểm',
      date: 'Hãy chọn ngày',
      description: 'Mô tả tối thiểu 20 ký tự',
      contact: 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0',
    });
  });
  it('từ chối ngày trong tương lai', () => {
    expect(validatePost({ ...valid, date: '2999-12-31' }).date).toBe('Ngày không được ở tương lai');
  });
  it('từ chối ngày không tồn tại trong lịch', () => {
    expect(validatePost({ ...valid, date: '2020-02-31' }).date).toBe('Hãy chọn ngày');
  });
  it('bỏ khoảng trắng trước khi tính độ dài tiêu đề', () => {
    expect(validatePost({ ...valid, title: '   Ví   ' }).title).toBe('Tiêu đề tối thiểu 5 ký tự');
  });
  it('từ chối tiêu đề dài quá 80 ký tự', () => {
    expect(validatePost({ ...valid, title: 'a'.repeat(81) }).title).toBe('Tiêu đề tối đa 80 ký tự');
  });
  it('từ chối loại tin ngoài danh sách', () => {
    expect(validatePost({ ...valid, kind: 'Trao đổi' }).kind).toBe('Hãy chọn loại tin');
  });
  it('báo lỗi ở ô liên hệ khi email sai định dạng', () => {
    expect(validatePost({ ...valid, contactType: 'Email', contact: 'abc' }).contact).toBe('Email không hợp lệ');
  });
  it('chấp nhận địa chỉ email đúng định dạng', () => {
    expect(validatePost({ ...valid, contactType: 'Email', contact: 'an@ptit.edu.vn' })).toEqual({});
  });
  it('từ chối số điện thoại thiếu chữ số', () => {
    expect(validatePost({ ...valid, contactType: 'SĐT', contact: '0912' }).contact)
      .toBe('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0');
  });
  it('báo lỗi ở ô liên hệ khi loại liên hệ không tồn tại', () => {
    expect(validatePost({ ...valid, contactType: 'Thư tay' }).contact).toBe('Hãy chọn loại liên hệ');
  });
});
