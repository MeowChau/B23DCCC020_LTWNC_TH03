'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { safeCallbackUrl } from '@/lib/callback-url';

export async function loginAction(_previous: { error?: string }, formData: FormData) {
  const target = formData.get('callbackUrl');
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: safeCallbackUrl(typeof target === 'string' ? target : ''),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') return { error: 'Email hoặc mật khẩu không đúng' };
      return { error: 'Chưa thể đăng nhập. Vui lòng thử lại.' };
    }
    throw error;
  }
  return {};
}
