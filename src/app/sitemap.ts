import type { MetadataRoute } from 'next';
import { getPublicPosts } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'http://localhost:3000';
  const posts = await getPublicPosts();
  return [
    { url: base }, { url: `${base}/posts` },
    ...posts.map((post) => ({ url: `${base}/posts/${post.id}` })),
  ];
}
