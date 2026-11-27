import type { Metadata } from 'next';
import { KINDS, PLACES } from '@/data/posts';
import { PublicTable } from '@/components/PublicTable';
import { formatTime } from '@/lib/format';
import { getPublicPosts, parsePostFilters } from '@/lib/posts';
import type { SearchValues } from '@/lib/posts';

export const metadata: Metadata = { title: 'Tin đăng' };

export default async function PostsPage({ searchParams }: { searchParams: Promise<SearchValues> }) {
  const filters = parsePostFilters(await searchParams);
  const posts = await getPublicPosts(filters);
  return (
    <div className="container page-space">
      <p className="eyebrow">Bảng tin trong trường</p>
      <h1>Tin đang hiển thị</h1>
      <form action="/posts" method="GET" className="filter-form">
        <div className="field search-field">
          <label htmlFor="q">Tìm kiếm</label>
          <input id="q" name="q" defaultValue={filters.q} placeholder="Nhập tên đồ vật" />
        </div>
        <div className="field">
          <label htmlFor="kind">Loại tin</label>
          <select id="kind" name="kind" defaultValue={filters.kind ?? ''}>
            <option value="">Tất cả</option>
            {KINDS.map((kind) => <option key={kind}>{kind}</option>)}
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
      </form>
      <div className="results-heading">
        <p>Có <strong>{posts.length}</strong> tin đang hiển thị</p>
        <span className="muted">Render lúc: {formatTime()}</span>
      </div>
      <PublicTable posts={posts} />
    </div>
  );
}
