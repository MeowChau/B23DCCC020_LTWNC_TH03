import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: { default: 'PTIT Found', template: '%s | PTIT Found' },
  description: 'Tìm đồ thất lạc trong trường PTIT',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <a href="#main-content" className="skip-link">Đến nội dung chính</a>
        <Providers>
          <Header />
          <main id="main-content">{children}</main>
        </Providers>
        <footer className="site-footer">
          <div className="container footer-inner">
            <strong>PTIT Found</strong>
            <Link href="/posts">Bảng tin đồ thất lạc trong trường PTIT</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
