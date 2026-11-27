import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PostForm } from '@/components/PostForm';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/format';
import { listMine, parseStatus, STATUS_LABELS } from '@/lib/my-posts';
import { can } from '@/lib/permissions';
import { firstValue } from '@/lib/posts';
import type { SearchValues } from '@/lib/posts';
import { createPostAction, resolvePostAction } from './actions';

export const metadata: Metadata = { title: 'Tin đăng của tôi', robots: { index: false } };
const PAGE_SIZE = 8;

function parseLimit(raw: string): number {
  const value = Number(raw);
  return /^\d+$/.test(raw) && Number.isSafeInteger(value) && value > 0 ? value : PAGE_SIZE;
}

export default async function MyPostsPage({ searchParams }: { searchParams: Promise<SearchValues> }) {
  const user = (await auth())?.user;
  if (!user?.email) redirect('/login?callbackUrl=%2Fmy-posts');
  const params = await searchParams;
  const status = parseStatus(firstValue(params.status));
  const limit = parseLimit(firstValue(params.limit));
  const { items, nextCursor, total } = listMine(user.email, status, 0, limit);
  const canResolve = can(user.role, 'post:resolve');
  const nextQuery = new URLSearchParams();
  if (status) nextQuery.set('status', status);
  nextQuery.set('limit', String(limit + PAGE_SIZE));

  return (
    <div className="container page-space">
      <h1>Tin đăng của tôi</h1>
      <section className="form-panel" aria-labelledby="new-post">
        <div className="panel-heading">
          <h2 id="new-post">Đăng tin mới</h2>
          <p className="muted">Tin sẽ xuất hiện trên bảng sau khi được kiểm duyệt.</p>
        </div>
        <PostForm action={createPostAction} />
      </section>
      <section aria-labelledby="my-list">
        <h2 id="my-list">Danh sách tin của bạn</h2>
        <form action="/my-posts" method="GET" className="filter-form my-filter">
          <div className="field">
            <label htmlFor="status">Trạng thái</label>
            <select id="status" name="status" defaultValue={status ?? ''}>
              <option value="">Tất cả</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <button className="button" type="submit">Lọc</button>
        </form>
        <div className="results-heading"><p>Hiển thị <strong>{items.length} / {total}</strong> tin</p></div>
        {items.length ? <div className="table-scroll">
          <table>
            <caption className="sr-only">Tin đăng của tôi</caption>
            <thead><tr><th scope="col">Tiêu đề</th><th scope="col">Ngày</th><th scope="col">Trạng thái</th><th scope="col">Thao tác</th></tr></thead>
            <tbody>{items.map((post) => {
              const visible = post.status === 'approved' && !post.resolved;
              return <tr key={post.id}>
                <td>{visible ? <Link className="post-link" href={`/posts/${post.id}`}>{post.title}</Link> : post.title}</td>
                <td className="nowrap">{formatDate(post.date)}</td>
                <td><StatusBadge post={post} /></td>
                <td>{visible && canResolve && <form action={resolvePostAction.bind(null, post.id)}>
                  <button className="button button-quiet button-small" type="submit">Đánh dấu đã nhận lại</button>
                </form>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div> : <p className="empty-state">Chưa có tin phù hợp với bộ lọc.</p>}
        <div className="table-bottom">
          {nextCursor === null ? <p className="muted">Đã hiển thị hết tin</p> :
            <Link className="button button-quiet" href={`/my-posts?${nextQuery}`}>Xem thêm</Link>}
        </div>
      </section>
    </div>
  );
}
