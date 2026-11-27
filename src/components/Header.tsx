'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const path = usePathname();
  const { data: session, status, update } = useSession();
  const previousPath = useRef(path);
  const user = session?.user;

  useEffect(() => {
    if (path !== '/login' && status === 'loading') return;
    const leftLogin = previousPath.current === '/login' && path !== '/login';
    previousPath.current = path;
    if (leftLogin && status === 'unauthenticated') void update();
  }, [path, status, update]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="PTIT Found – Trang chủ">
          <span className="brand-mark" aria-hidden="true">f.</span>
          <span><strong>PTIT</strong> Found<small>Bảng tin đồ thất lạc</small></span>
        </Link>
        <nav aria-label="Điều hướng chính">
          <Link href="/" aria-current={path === '/' ? 'page' : undefined}>Trang chủ</Link>
          <Link href="/posts" aria-current={path.startsWith('/posts') ? 'page' : undefined}>Tin đăng</Link>
          {user && <Link href="/my-posts" aria-current={path === '/my-posts' ? 'page' : undefined}>Tin của tôi</Link>}
          {user?.role === 'admin' && <Link href="/admin" aria-current={path === '/admin' ? 'page' : undefined}>Quản trị</Link>}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {user ? <>
            <span className="session-info">Xin chào, {user.name} ({user.role})</span>
            <button type="button" className="button button-quiet button-small" onClick={() => void signOut({ redirectTo: '/' })}>Đăng xuất</button>
          </> : <Link href="/login" className="button button-quiet button-small">Đăng nhập</Link>}
        </div>
      </div>
    </header>
  );
}
