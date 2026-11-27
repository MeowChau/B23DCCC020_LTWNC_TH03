import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/format';
import { moderatePost } from './actions';

export const metadata: Metadata = { title: 'Kiểm duyệt tin đăng', robots: { index: false } };

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user.role, 'post:moderate')) redirect('/forbidden');
  const pending = db.posts.filter((post) => post.status === 'pending');
  const visible = db.posts.filter((post) => post.status === 'approved' && !post.resolved).length;
  const hidden = db.posts.filter((post) => post.status === 'hidden').length;
  return (
    <div className="container page-space">
      <div className="page-heading"><h1>Kiểm duyệt tin đăng</h1></div>
      <p className="admin-stats">
        <span>Chờ duyệt: <strong>{pending.length}</strong></span><span className="sr-only"> | </span>
        <span>Đang hiển thị: <strong>{visible}</strong></span><span className="sr-only"> | </span>
        <span>Đã ẩn: <strong>{hidden}</strong></span>
      </p>
      {pending.length ? <div className="table-scroll">
        <table>
          <caption className="sr-only">Tin chờ duyệt</caption>
          <thead><tr><th scope="col">Tiêu đề</th><th scope="col">Ngày</th><th scope="col">Người đăng</th><th scope="col">Kiểm duyệt</th></tr></thead>
          <tbody>{pending.map((post) => <tr key={post.id}>
            <td><strong>{post.title}</strong></td><td className="nowrap">{formatDate(post.date)}</td><td>{post.authorEmail}</td>
            <td><div className="row-actions">
              <form action={moderatePost.bind(null, post.id, 'approved')}><button className="button button-small" type="submit">Duyệt</button></form>
              <form action={moderatePost.bind(null, post.id, 'hidden')}><button className="button button-quiet button-small" type="submit">Ẩn</button></form>
            </div></td>
          </tr>)}</tbody>
        </table>
      </div> : <p className="empty-state">Hiện không có tin chờ duyệt.</p>}
    </div>
  );
}
