import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Không có quyền truy cập', robots: { index: false } };

export default function ForbiddenPage() {
  return <div className="container page-space message-page">
    <h1>Bạn không có quyền truy cập trang này</h1>
    <Link href="/" className="button">Về trang chủ</Link>
  </div>;
}
