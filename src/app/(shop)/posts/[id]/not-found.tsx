import Link from 'next/link';

export default function PostNotFound() {
  return <div className="container page-space message-page">
    <h1>Không tìm thấy tin đăng</h1>
    <p>Tin có thể chưa được duyệt, đã được nhận lại hoặc không tồn tại.</p>
    <Link href="/posts" className="button">Về bảng tin</Link>
  </div>;
}
