export default function LoadingPosts() {
  return <div className="container page-space" role="status">
    <h1>Đang tải tin đăng...</h1>
    <div className="loading-lines" aria-hidden="true"><div /><div /><div /></div>
  </div>;
}
