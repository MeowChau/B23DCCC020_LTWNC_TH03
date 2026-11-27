import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicPost, getPublicPosts } from '@/lib/posts';
import { formatDate, formatTime } from '@/lib/format';
import { ItemIcon } from '@/components/ItemIcon';
import { KindBadge } from '@/components/StatusBadge';

export const dynamic = 'force-static';
export const revalidate = 30;
type DetailProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const posts = await getPublicPosts();
  return posts.slice(0, 10).map((post) => ({ id: String(post.id) }));
}

async function findPost(params: DetailProps['params']) {
  const { id } = await params;
  const post = /^[1-9]\d*$/.test(id) ? await getPublicPost(Number(id)) : undefined;
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const post = await findPost(params);
  const title = `${post.title} – ${post.place}`;
  return { title, description: post.description, openGraph: { title, description: post.description } };
}

export default async function PostDetail({ params }: DetailProps) {
  const post = await findPost(params);
  const base = 'http://localhost:3000';
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: base },
      { '@type': 'ListItem', position: 2, name: 'Tin đăng', item: `${base}/posts` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${base}/posts/${post.id}` },
    ],
  };
  return (
    <div className="container page-space">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link><span aria-hidden="true">/</span>
        <Link href="/posts">Tin đăng</Link><span aria-hidden="true">/</span><span>Tin #{post.id}</span>
      </nav>
      <article className="detail-card">
        <div className="detail-main">
          <KindBadge kind={post.kind} />
          <h1>{post.title}</h1>
          <p className="detail-description">{post.description}</p>
          <dl className="detail-facts">
            <div><dt>Loại tin:</dt><dd>{post.kind}</dd></div>
            <div><dt>Danh mục:</dt><dd>{post.category}</dd></div>
            <div><dt>Địa điểm:</dt><dd>{post.place}</dd></div>
            <div><dt>Ngày:</dt><dd>{formatDate(post.date)}</dd></div>
            <div><dt>Người đăng:</dt><dd><a href={`mailto:${post.authorEmail}`}>{post.authorEmail}</a></dd></div>
          </dl>
          <p className="muted">Cập nhật lúc: {formatTime()}</p>
        </div>
        <aside className="detail-aside">
          <ItemIcon category={post.category} />
          <p>Khi liên hệ, hãy mô tả đặc điểm riêng của món đồ để xác nhận đúng chủ.</p>
          <a className="button" href={`mailto:${post.authorEmail}`}>Liên hệ người đăng</a>
        </aside>
      </article>
      <Link href="/posts" className="text-link back-link">Về bảng tin</Link>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
    </div>
  );
}
