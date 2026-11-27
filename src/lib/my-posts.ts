import { db } from './db';
import type { PostInput } from './post-validate';
import type { Category, Kind, Place, Post, PostStatus } from '@/types';

export const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  approved: 'Đang hiển thị',
  hidden: 'Đã ẩn',
} satisfies Record<PostStatus, string>;

export function parseStatus(value: string | undefined): PostStatus | undefined {
  return value === 'pending' || value === 'approved' || value === 'hidden' ? value : undefined;
}

export function listMine(email: string, status?: PostStatus, cursor = 0, size = 8) {
  const matches = db.posts.filter((post) => post.authorEmail === email && (!status || post.status === status));
  const end = cursor + size;
  return { items: matches.slice(cursor, end), nextCursor: end < matches.length ? end : null, total: matches.length };
}

// The caller validates the form before storing it.
export function submitPost(email: string, input: PostInput): Post {
  const post: Post = {
    id: db.nextPostId++,
    title: input.title.trim(),
    kind: input.kind as Kind,
    category: input.category as Category,
    place: input.place as Place,
    date: input.date,
    description: `${input.description.trim()}\nLiên hệ: ${input.contactType} ${input.contact.trim()}`,
    authorEmail: email,
    status: 'pending',
    resolved: false,
  };
  db.posts.unshift(post);
  return post;
}

export function resolvePost(email: string, id: number): 'not-found' | 'forbidden' | 'not-approved' | 'ok' {
  const post = db.posts.find((entry) => entry.id === id);
  if (!post) return 'not-found';
  if (post.authorEmail !== email) return 'forbidden';
  if (post.status !== 'approved') return 'not-approved';
  post.resolved = true;
  return 'ok';
}
