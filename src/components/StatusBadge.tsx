import type { Kind, Post } from '@/types';

export function KindBadge({ kind }: { kind: Kind }) {
  return <span className={`badge ${kind === 'Thất lạc' ? 'badge-lost' : 'badge-found'}`}>{kind}</span>;
}

export function StatusBadge({ post }: { post: Post }) {
  const labels = { pending: 'Chờ duyệt', approved: 'Đang hiển thị', hidden: 'Đã ẩn' };
  return <span className={`badge badge-${post.resolved ? 'resolved' : post.status}`}>{post.resolved ? 'Đã nhận lại' : labels[post.status]}</span>;
}
