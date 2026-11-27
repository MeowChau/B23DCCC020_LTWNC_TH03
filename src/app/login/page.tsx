import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoginForm } from '@/components/LoginForm';
import { safeCallbackUrl } from '@/lib/callback-url';
import { firstValue } from '@/lib/posts';
import type { SearchValues } from '@/lib/posts';

export const metadata: Metadata = { title: 'Đăng nhập' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchValues> }) {
  if (await auth()) redirect('/');
  const callbackUrl = safeCallbackUrl(firstValue((await searchParams).callbackUrl));
  return <div className="container page-space auth-page">
    <section className="auth-panel">
      <div className="auth-mark" aria-hidden="true">PTIT <strong>Found</strong></div>
      <h1>Đăng nhập</h1>
      <p className="muted">Đăng nhập để đăng tin hoặc xem lại tin của bạn.</p>
      <LoginForm callbackUrl={callbackUrl} />
      <details className="demo-accounts">
        <summary>Tài khoản thực hành</summary>
        <p>Thành viên: sv01@ptit.edu.vn hoặc sv02@ptit.edu.vn · sv123456</p>
        <p>Quản trị: admin@ptit.edu.vn · admin123</p>
      </details>
      <Link href="/" className="text-link back-link">Về trang chủ</Link>
    </section>
  </div>;
}
