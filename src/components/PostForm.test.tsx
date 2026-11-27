import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PostFormState } from '@/lib/post-validate';
import { PostForm } from './PostForm';

type TestAction = (prev: PostFormState, data: FormData) => Promise<PostFormState>;
const success: PostFormState = { errors: {}, values: {}, ok: true, message: 'Đã gửi tin, chờ kiểm duyệt' };

describe('Form đăng tin', () => {
  it('hiển thị lỗi dưới đúng ô và nối lỗi với trường nhập', async () => {
    const action = vi.fn<TestAction>().mockResolvedValue({
      errors: { title: 'Tiêu đề tối thiểu 5 ký tự' }, values: { title: 'Ví' },
    });
    const user = userEvent.setup();
    render(<PostForm action={action} />);
    await user.type(screen.getByLabelText('Tiêu đề'), 'Ví');
    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Tiêu đề tối thiểu 5 ký tự');
    expect(screen.getByLabelText('Tiêu đề')).toHaveAccessibleDescription('Tiêu đề tối thiểu 5 ký tự');
    expect(screen.getByLabelText('Tiêu đề')).toHaveValue('Ví');
  });
  it('gửi đúng loại tin và thông tin liên hệ rồi xóa form khi thành công', async () => {
    const action = vi.fn<TestAction>().mockResolvedValue(success);
    const user = userEvent.setup();
    render(<PostForm action={action} />);
    await user.type(screen.getByLabelText('Tiêu đề'), 'Mất ví da');
    await user.selectOptions(screen.getByLabelText('Loại tin'), 'Thất lạc');
    await user.selectOptions(screen.getByLabelText('Danh mục'), 'Ví – giấy tờ');
    await user.selectOptions(screen.getByLabelText('Địa điểm'), 'Thư viện');
    fireEvent.change(screen.getByLabelText('Ngày'), { target: { value: '2020-01-01' } });
    await user.type(screen.getByLabelText('Mô tả'), 'Mình làm mất một ví da màu nâu.');
    await user.selectOptions(screen.getByLabelText('Loại liên hệ'), 'Email');
    await user.type(screen.getByLabelText('Thông tin liên hệ'), 'an@ptit.edu.vn');
    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Đã gửi tin, chờ kiểm duyệt');
    expect(action).toHaveBeenCalledTimes(1);
    const [, data] = action.mock.calls[0];
    expect(data.get('kind')).toBe('Thất lạc');
    expect(data.get('contactType')).toBe('Email');
    expect(data.get('contact')).toBe('an@ptit.edu.vn');
    await waitFor(() => expect(screen.getByLabelText('Tiêu đề')).toHaveValue(''));
  });
  it('giữ tiêu đề đã nhập khi server báo không có quyền', async () => {
    const action = vi.fn<TestAction>().mockResolvedValue({
      errors: {}, values: { title: 'Mất ví da' }, message: 'Không có quyền',
    });
    const user = userEvent.setup();
    render(<PostForm action={action} />);
    await user.type(screen.getByLabelText('Tiêu đề'), 'Mất ví da');
    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Không có quyền');
    expect(screen.getByLabelText('Tiêu đề')).toHaveValue('Mất ví da');
  });
  it('chọn Zalo làm loại liên hệ mặc định', () => {
    render(<PostForm action={vi.fn<TestAction>()} />);
    expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Zalo');
  });
});
