import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, KINDS, PLACES } from '@/data/posts';
import { PublicTable } from '@/components/PublicTable';
import { formatTime } from '@/lib/format';
import { getPublicPosts, parsePostFilters } from '@/lib/posts';
import type { SearchValues } from '@/lib/posts';

export const metadata: Metadata = { title: 'Tin đăng' };

export default async function PostsPage({ searchParams }: { searchParams: Promise<SearchValues> }) {
  const filters = parsePostFilters(await searchParams);
  const posts = await getPublicPosts(filters);
  const filtered = Object.values(filters).some(Boolean);

  return (
    <div className="container page-space">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link href="/">Trang chủ</Link><span aria-hidden="true">/</span><span aria-current="page">Tin đăng</span>
      </nav>
      <div className="page-heading">
        <div><h1>Tin đang hiển thị</h1><p>Tìm theo tên đồ vật, danh mục hoặc địa điểm.</p></div>
        <Link href="/my-posts#new-post" className="button">Đăng tin mới</Link>
      </div>
      <form key={JSON.stringify(filters)} action="/posts" method="GET" className="filter-form posts-filter">
        <div className="field search-field">
          <label htmlFor="q">Tìm kiếm</label>
          <div className="search-control">
            <span className="search-icon" aria-hidden="true" />
            <input id="q" name="q" type="search" defaultValue={filters.q} placeholder="Nhập tên đồ vật" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="kind">Loại tin</label>
          <select id="kind" name="kind" defaultValue={filters.kind ?? ''}>
            <option value="">Tất cả loại tin</option>
            {KINDS.map((kind) => <option key={kind}>{kind}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="category">Danh mục</label>
          <select id="category" name="category" defaultValue={filters.category ?? ''}>
            <option value="">Tất cả danh mục</option>
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="place">Địa điểm</label>
          <select id="place" name="place" defaultValue={filters.place ?? ''}>
            <option value="">Tất cả địa điểm</option>
            {PLACES.map((place) => <option key={place}>{place}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sắp xếp</label>
          <select id="sort" name="sort" defaultValue={filters.sort ?? ''}>
            <option value="">Mặc định</option>
            <option value="date-desc">Mới nhất</option>
            <option value="date-asc">Cũ nhất</option>
          </select>
        </div>
        <button type="submit" className="button">Lọc</button>
        {filtered && <Link href="/posts" className="button button-quiet">Bỏ lọc</Link>}
      </form>
      <div className="results-heading">
        <p>Có <strong>{posts.length}</strong> tin đang hiển thị</p>
        <span className="muted render-time">Render lúc: {formatTime()}</span>
      </div>
      <PublicTable posts={posts} />
    </div>
  );
}
