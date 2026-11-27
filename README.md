# PTIT Found · B23DCCC020

Bảng tin đồ thất lạc trong trường PTIT. Khách có thể tìm kiếm và xem tin. Thành viên đăng tin và đánh dấu tin của mình đã nhận lại. Quản trị viên duyệt hoặc ẩn tin chờ duyệt.

## Chạy trên máy

Cần Node.js 22.12 trở lên. Tại thư mục gốc của repo:

```sh
npm ci
node -e "require('fs').writeFileSync('.env.local', 'AUTH_SECRET='+require('crypto').randomBytes(32).toString('base64')+'\n', {flag:'wx'})"
npm run build
npm start
```

Lệnh tạo khóa chỉ cần chạy lần đầu. Mở [localhost:3000](http://localhost:3000). Dùng bản production để quan sát ISR và làm mới cache. Các thay đổi lưu trong bộ nhớ của tiến trình server, nên dữ liệu quay về bộ mẫu khi khởi động lại.

| Vai trò | Email | Mật khẩu thực hành |
| --- | --- | --- |
| Thành viên | sv01@ptit.edu.vn | sv123456 |
| Thành viên | sv02@ptit.edu.vn | sv123456 |
| Quản trị viên | admin@ptit.edu.vn | admin123 |

## Kiểm tra

```sh
npm test
npm run coverage
```

Ảnh bảng coverage được lưu trong [coverage.png](coverage.png).

- `/` tạo HTML tĩnh. `/posts` render theo bộ lọc trên URL.
- `/posts/[id]` dựng sẵn 10 tin công khai đầu tiên và tái tạo sau 30 giây. Duyệt, ẩn và đánh dấu đã nhận lại làm mới các trang liên quan theo yêu cầu.
- `/my-posts` và `/admin` kiểm tra phiên đăng nhập trên server. Server Action kiểm tra lại quyền trước khi thay đổi dữ liệu.
