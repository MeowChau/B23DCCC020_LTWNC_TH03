'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const path = usePathname();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="PTIT Found – Trang chủ">
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span>PTIT <strong>Found</strong><small>Bảng tin đồ thất lạc</small></span>
        </Link>
        <nav aria-label="Điều hướng chính">
          <Link href="/" aria-current={path === '/' ? 'page' : undefined}>Trang chủ</Link>
          <Link href="/posts" aria-current={path.startsWith('/posts') ? 'page' : undefined}>Tin đăng</Link>
        </nav>
      </div>
    </header>
  );
}
