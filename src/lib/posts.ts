import { db } from './db';
import { CATEGORIES, KINDS, PLACES } from '@/data/posts';
import type { Category, Kind, Place, Post } from '@/types';

export interface PostFilters {
  q?: string;
  kind?: Kind;
  category?: Category;
  place?: Place;
  sort?: 'date-desc' | 'date-asc';
}

export type SearchValues = Record<string, string | string[] | undefined>;
export const firstValue = (value: string | string[] | undefined): string =>
  typeof value === 'string' ? value : value?.[0] ?? '';

export function parsePostFilters(params: SearchValues): PostFilters {
  const kind = firstValue(params.kind);
  const category = firstValue(params.category);
  const place = firstValue(params.place);
  const sort = firstValue(params.sort);
  return {
    q: firstValue(params.q).trim(),
    kind: KINDS.find((value) => value === kind),
    category: CATEGORIES.find((value) => value === category),
    place: PLACES.find((value) => value === place),
    sort: sort === 'date-desc' || sort === 'date-asc' ? sort : undefined,
  };
}

export async function getPublicPosts(filters: PostFilters = {}): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const query = filters.q?.toLocaleLowerCase('vi');
  const posts = db.posts.filter((post) =>
    post.status === 'approved' && !post.resolved &&
    (!query || post.title.toLocaleLowerCase('vi').includes(query)) &&
    (!filters.kind || post.kind === filters.kind) &&
    (!filters.category || post.category === filters.category) &&
    (!filters.place || post.place === filters.place),
  );
  if (filters.sort) {
    posts.sort((a, b) => filters.sort === 'date-desc'
      ? b.date.localeCompare(a.date)
      : a.date.localeCompare(b.date));
  }
  return posts;
}

export async function getPublicPost(id: number): Promise<Post | undefined> {
  return db.posts.find((post) => post.id === id && post.status === 'approved' && !post.resolved);
}
