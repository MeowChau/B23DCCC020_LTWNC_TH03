export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <>
    <div className="member-banner"><div className="container">Khu vực thành viên</div></div>
    {children}
  </>;
}
