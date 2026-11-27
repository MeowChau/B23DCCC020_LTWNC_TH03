import Link from 'next/link';
import { FoundIllustration } from '@/components/FoundIllustration';
import { ItemIcon } from '@/components/ItemIcon';
import { PublicTable } from '@/components/PublicTable';
import { CATEGORIES, KINDS, PLACES } from '@/data/posts';
import { getPublicPosts } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getPublicPosts({ sort: 'date-desc' });
  const lost = posts.filter((post) => post.kind === 'Thất lạc').length;
  const categoryCounts = new Map<string, number>();
  for (const { category } of posts) {
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  return (
    <div className="container home-page">
      <div className="hero">
        <section className="hero-intro" aria-labelledby="home-heading">
          <p className="eyebrow">Bảng tin sinh viên PTIT</p>
          <h1 id="home-heading">PTIT Found – <span>Tìm đồ thất lạc</span></h1>
          <p className="hero-copy">Tìm đồ bạn đánh mất hoặc giúp món đồ nhặt được trở về đúng chủ trong khuôn viên trường.</p>
          <div className="hero-links">
            <Link href="/posts" className="button">Xem tất cả tin</Link>
            <Link href="/my-posts#new-post" className="button button-quiet">Đăng tin mới</Link>
          </div>
        </section>
        <section className="hero-overview" aria-labelledby="overview-heading">
          <h2 id="overview-heading">Tình hình bảng tin</h2>
          <div className="overview-main">
            <p className="notice-main"><strong>{posts.length}</strong> tin đang hiển thị</p>
            <div className="hero-art"><FoundIllustration /></div>
          </div>
          <div className="notice-kinds">
            <p><strong>{lost}</strong> tin thất lạc</p>
            <p><strong>{posts.length - lost}</strong> tin nhặt được</p>
          </div>
        </section>
      </div>

      <form action="/posts" method="GET" className="filter-form home-search">
        <div className="field search-field">
          <label htmlFor="home-q">Tìm kiếm đồ thất lạc</label>
          <div className="search-control">
            <span className="search-icon" aria-hidden="true" />
            <input id="home-q" name="q" type="search" placeholder="Thẻ sinh viên, ví, chìa khóa…" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="home-place">Địa điểm</label>
          <select id="home-place" name="place">
            <option value="">Tất cả địa điểm</option>
            {PLACES.map((place) => <option key={place}>{place}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="home-kind">Loại tin</label>
          <select id="home-kind" name="kind">
            <option value="">Tất cả loại tin</option>
            {KINDS.map((kind) => <option key={kind}>{kind}</option>)}
          </select>
        </div>
        <button type="submit" className="button">Tìm kiếm</button>
      </form>

      <section className="home-section" aria-labelledby="categories-heading">
        <div className="section-heading"><h2 id="categories-heading">Danh mục đồ thường gặp</h2></div>
        <ul className="category-grid">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <Link href={{ pathname: '/posts', query: { category } }} className="category-card">
                <span className="item-icon"><ItemIcon category={category} /></span>
                <strong>{category}</strong>
                <span className="category-count">{categoryCounts.get(category) ?? 0} tin đang hiển thị</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="recent-heading">
        <div className="section-heading">
          <h2 id="recent-heading">Tin mới trên bảng</h2>
          <Link href={{ pathname: '/posts', query: { sort: 'date-desc' } }} className="text-link">Xem tin mới nhất</Link>
        </div>
        <PublicTable posts={posts.slice(0, 4)} />
      </section>

      <section className="home-section handover" aria-labelledby="handover-heading">
        <h2 id="handover-heading">Cách tìm và trao trả đồ</h2>
        <ol>
          <li><strong>Tìm hoặc đăng tin</strong><p>Tra theo đồ vật và địa điểm. Nếu chưa thấy tin phù hợp, hãy đăng tin mới.</p></li>
          <li><strong>Xác nhận đúng chủ</strong><p>Khi liên hệ, mô tả đặc điểm riêng của món đồ và hẹn gặp ở nơi công cộng trong trường.</p></li>
          <li><strong>Đánh dấu đã nhận lại</strong><p>Sau khi trao trả, người đăng cập nhật tin trong mục Tin của tôi.</p></li>
        </ol>
      </section>
    </div>
  );
}
