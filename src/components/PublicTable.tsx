import Link from 'next/link';
import { formatDate } from '@/lib/format';
import type { Post } from '@/types';
import { ItemIcon } from './ItemIcon';
import { KindBadge } from './StatusBadge';

export function PublicTable({ posts }: { posts: Post[] }) {
  if (!posts.length) return <div className="empty-state"><strong>Không có tin nào phù hợp</strong><p>Thử một từ khóa khác hoặc bỏ bớt bộ lọc.</p><Link href="/posts" className="text-link">Xem tất cả tin</Link></div>;
  return (
    <div className="table-scroll">
      <table>
        <caption className="sr-only">Danh sách tin đang hiển thị</caption>
        <thead><tr><th scope="col">Đồ vật cần tìm chủ</th><th scope="col">Loại tin</th><th scope="col">Địa điểm</th><th scope="col">Ngày</th></tr></thead>
        <tbody>{posts.map((post) => <tr key={post.id}>
          <td><div className="post-title-cell"><span className="item-icon"><ItemIcon category={post.category} /></span><div><Link href={`/posts/${post.id}`} className="post-link">{post.title}</Link><span className="cell-subtext">{post.category}</span></div></div></td>
          <td><KindBadge kind={post.kind} /></td><td>{post.place}</td><td className="nowrap">{formatDate(post.date)}</td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}
