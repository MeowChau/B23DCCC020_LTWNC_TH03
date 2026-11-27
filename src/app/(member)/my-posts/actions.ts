'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { resolvePost, submitPost } from '@/lib/my-posts';
import { can } from '@/lib/permissions';
import { toPostInput, validatePost } from '@/lib/post-validate';
import type { PostFormState } from '@/lib/post-validate';
import { revalidatePublicPost } from '@/lib/revalidate-post';

export async function createPostAction(_previous: PostFormState, formData: FormData): Promise<PostFormState> {
  const values = toPostInput(formData);
  const user = (await auth())?.user;
  if (!user?.email || !can(user.role, 'post:create')) return { errors: {}, values, message: 'Không có quyền' };
  const errors = validatePost(values);
  if (Object.keys(errors).length > 0) return { errors, values };
  submitPost(user.email, values);
  revalidatePath('/my-posts');
  return { errors: {}, values: {}, ok: true, message: 'Đã gửi tin, chờ kiểm duyệt' };
}

export async function resolvePostAction(id: number) {
  const user = (await auth())?.user;
  if (!user?.email || !can(user.role, 'post:resolve')) throw new Error('Không có quyền');
  const result = resolvePost(user.email, id);
  if (result === 'forbidden') throw new Error('Không có quyền');
  if (result !== 'ok') return;
  revalidatePath('/my-posts');
  revalidatePath('/admin');
  revalidatePublicPost(id);
}
