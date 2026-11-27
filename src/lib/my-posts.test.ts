import { beforeEach, describe, expect, it } from 'vitest';
import { generatePosts } from '@/data/posts';
import { db } from './db';
import { listMine, parseStatus, resolvePost, submitPost } from './my-posts';
import { toPostInput } from './post-validate';

const an = 'sv01@ptit.edu.vn';
const binh = 'sv02@ptit.edu.vn';

beforeEach(() => {
  db.posts.splice(0, db.posts.length, ...generatePosts(36));
  db.nextPostId = 37;
});

describe('Tin đăng cá nhân', () => {
  it('trang đầu của An có 8 trong 27 tin và con trỏ tiếp theo là 8', () => {
    const page = listMine(an, undefined);
    expect(page.items).toHaveLength(8);
    expect(page.total).toBe(27);
    expect(page.nextCursor).toBe(8);
  });
  it('trang cuối của An có 3 tin và không còn trang sau', () => {
    const page = listMine(an, undefined, 24);
    expect(page.items).toHaveLength(3);
    expect(page.nextCursor).toBeNull();
  });
  it('lọc đúng 3 tin chờ duyệt và bỏ qua trạng thái lạ', () => {
    const page = listMine(an, parseStatus('pending'));
    expect(page.items).toHaveLength(3);
    expect(page.items.every((post) => post.status === 'pending')).toBe(true);
    expect(parseStatus('khác')).toBeUndefined();
  });
  it('Bình chỉ thấy 9 tin thuộc về mình', () => {
    const page = listMine(binh, undefined, 0, 9);
    expect(page.total).toBe(9);
    expect(page.items.every((post) => post.authorEmail === binh)).toBe(true);
  });
  it('thêm tin chờ duyệt lên đầu danh sách và lưu liên hệ trong mô tả', () => {
    const post = submitPost(an, toPostInput({
      title: ' Mất tai nghe ', kind: 'Thất lạc', category: 'Khác', place: 'Thư viện',
      date: '2020-01-01', description: 'Mình đánh rơi tai nghe màu đen.', contact: '0912345678',
    }));
    expect(post).toMatchObject({ id: 37, title: 'Mất tai nghe', status: 'pending', resolved: false, authorEmail: an });
    expect(post.description).toBe('Mình đánh rơi tai nghe màu đen.\nLiên hệ: Zalo 0912345678');
    expect(listMine(an).items[0]).toBe(post);
  });
  it('từ chối đánh dấu tin của người khác', () => {
    expect(resolvePost(binh, 2)).toBe('forbidden');
    expect(db.posts.find((post) => post.id === 2)?.resolved).toBe(false);
  });
  it('báo tin không tồn tại khi mã tin sai', () => {
    expect(resolvePost(an, 999)).toBe('not-found');
  });
  it('cho chủ tin đánh dấu đã nhận lại với tin đã duyệt', () => {
    expect(resolvePost(an, 2)).toBe('ok');
    expect(listMine(an).items.find((post) => post.id === 2)?.resolved).toBe(true);
  });
  it('từ chối đánh dấu tin chưa được duyệt', () => {
    expect(resolvePost(binh, 5)).toBe('not-approved');
  });
});
