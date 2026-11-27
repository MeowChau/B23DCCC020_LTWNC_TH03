'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { revalidatePublicPost } from '@/lib/revalidate-post';

export async function moderatePost(id: number, status: 'approved' | 'hidden') {
  const session = await auth();
  if (!can(session?.user.role, 'post:moderate')) throw new Error('Không có quyền');
  if (status !== 'approved' && status !== 'hidden') return;
  const post = db.posts.find((entry) => entry.id === id && entry.status === 'pending');
  if (!post) return;
  post.status = status;
  revalidatePath('/admin');
  revalidatePublicPost(id);
}
