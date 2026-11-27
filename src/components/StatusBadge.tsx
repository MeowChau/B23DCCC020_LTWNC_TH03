import type { Kind, Post } from '@/types';
import { STATUS_LABELS } from '@/lib/my-posts';

export function KindBadge({ kind }: { kind: Kind }) {
  return <span className={`badge ${kind === 'Thất lạc' ? 'badge-lost' : 'badge-found'}`}>{kind}</span>;
}

export function StatusBadge({ post }: { post: Post }) {
  return <span className={`badge badge-${post.resolved ? 'resolved' : post.status}`}>{post.resolved ? 'Đã nhận lại' : STATUS_LABELS[post.status]}</span>;
}
