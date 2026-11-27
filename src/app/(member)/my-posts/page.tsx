import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const metadata: Metadata = { title: 'Tin đăng của tôi', robots: { index: false } };

export default async function MyPostsPage() {
  if (!(await auth())?.user) redirect('/login?callbackUrl=%2Fmy-posts');
  return <div className="container page-space"><h1>Tin đăng của tôi</h1></div>;
}
