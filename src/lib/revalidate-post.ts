import { revalidatePath } from 'next/cache';

export function revalidatePublicPost(id: number) {
  revalidatePath('/');
  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
  revalidatePath('/sitemap.xml');
}
