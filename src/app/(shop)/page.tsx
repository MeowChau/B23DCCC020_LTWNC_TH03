import Link from 'next/link';
import { FoundIllustration } from '@/components/FoundIllustration';
import { PublicTable } from '@/components/PublicTable';
import { getPublicPosts } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getPublicPosts({ sort: 'date-desc' });
  const lost = posts.filter((post) => post.kind === 'Thất lạc').length;
  return (
    <div className="container home-page">
      <section className="hero">
        <div>
          <p className="eyebrow">Bảng tin sinh viên · PTIT</p>
          <h1>PTIT Found – <span>Tìm đồ thất lạc</span></h1>
          <p className="hero-copy">Tra cứu đồ thất lạc hoặc báo tin khi bạn nhặt được đồ trong trường.</p>
          <form action="/posts" method="GET" className="hero-search">
            <label className="sr-only" htmlFor="home-q">Tìm kiếm đồ thất lạc</label>
            <input id="home-q" name="q" placeholder="Thẻ sinh viên, ví, chìa khóa…" />
            <button type="submit" className="button">Tìm đồ</button>
          </form>
          <Link href="/posts" className="text-link">Xem tất cả tin</Link>
        </div>
        <div className="hero-art"><FoundIllustration /></div>
      </section>
      <section className="notice-strip" aria-label="Thống kê tin đăng">
        <p className="notice-main"><strong>{posts.length}</strong> tin đang hiển thị</p>
        <div className="notice-kinds">
          <span><strong>{lost}</strong> tin thất lạc</span>
          <span><strong>{posts.length - lost}</strong> tin nhặt được</span>
        </div>
      </section>
      <section className="recent-section">
        <div className="section-heading">
          <h2>Tin mới trên bảng</h2>
          <Link href="/posts" className="text-link">Mở bảng tin</Link>
        </div>
        <PublicTable posts={posts.slice(0, 4)} />
      </section>
    </div>
  );
}
