# TMTech PVGAS - Quản lý kho và kiểm kê tài sản

Ứng dụng web/mobile hỗ trợ quản lý tài sản, công cụ dụng cụ (CCDC), vật tư,
nghiệp vụ kho và kiểm kê bằng mã RFID. Giao diện được xây dựng bằng React,
Ant Design và có thể đóng gói thành ứng dụng Android thông qua Capacitor.

> **Lưu ý về phạm vi hiện tại:** đây là frontend của hệ thống. Một số màn hình
> đã kết nối API backend, trong khi một số chức năng quản trị và báo cáo vẫn
> đang sử dụng dữ liệu mẫu hoặc mô phỏng trên trình duyệt. Chi tiết được nêu
> trong [Bảng trạng thái chức năng](#bảng-trạng-thái-chức-năng).

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Cấu hình biến môi trường](#cấu-hình-biến-môi-trường)
- [Các màn hình và nghiệp vụ](#các-màn-hình-và-nghiệp-vụ)
- [Bảng trạng thái chức năng](#bảng-trạng-thái-chức-năng)
- [API backend được frontend sử dụng](#api-backend-được-frontend-sử-dụng)
- [Build và triển khai web](#build-và-triển-khai-web)
- [Đóng gói Android bằng Capacitor](#đóng-gói-android-bằng-capacitor)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Kiểm thử và xử lý lỗi thường gặp](#kiểm-thử-và-xử-lý-lỗi-thường-gặp)
- [Ghi chú bảo mật](#ghi-chú-bảo-mật)

## Tính năng

- Đăng nhập và bảo vệ các route nội bộ.
- Dashboard tổng quan:
  - Tổng số thiết bị.
  - Thiết bị sẵn sàng.
  - Thiết bị đang bảo trì/điều chuyển.
  - Thiết bị hỏng hóc/cần chú ý.
  - Biểu đồ trạng thái và các sự kiện gần đây.
- Quản lý danh mục:
  - Tài sản/thiết bị, CCDC và vật tư.
  - Phòng ban, kho và vị trí quản lý.
- Nghiệp vụ kho:
  - Theo dõi phiếu nhập kho.
  - Theo dõi phiếu xuất kho.
  - Theo dõi phiếu điều chuyển.
  - Xem chi tiết phiếu, tiến độ quét và in phiếu.
- Quản lý RFID:
  - Lọc tài sản chưa được gán thẻ.
  - Nhập hoặc quét mã EPC/RFID và gán vào tài sản.
  - Chọn nhiều tài sản để tạo tem nhãn.
  - In tem có mã tài sản, QR và mã RFID.
  - Cấu hình máy in Zebra theo IP, port và độ phân giải.
- Kiểm kê:
  - Tạo kỳ kiểm kê theo ngày chốt tồn và khu vực.
  - Theo dõi số lượng theo sổ sách/thực tế.
  - Xem chênh lệch thiếu, thừa hoặc khớp.
  - Xuất/in báo cáo tổng hợp (giao diện hiện tại).
- Hệ thống:
  - Quản lý người dùng, vai trò và trạng thái.
  - Reset mật khẩu người dùng.
  - Quản lý máy in và kiểm tra kết nối.
  - Báo cáo thống kê theo khoảng thời gian.

## Công nghệ sử dụng

| Nhóm | Công nghệ |
| --- | --- |
| Frontend | React 19, React Router 7 |
| UI | Ant Design 6, Ant Design Icons, Ant Design Plots |
| HTTP/API | Axios |
| Thông báo | React Hot Toast |
| Ngày tháng | Day.js |
| Web build | Create React App / `react-scripts` 5 |
| Mobile | Capacitor 6, Android |
| Web server mẫu | Nginx |
| Package manager | pnpm (có `pnpm-lock.yaml`) |

## Yêu cầu môi trường

- Node.js 18 trở lên; khuyến nghị dùng phiên bản LTS.
- pnpm 8 trở lên.
- Trình duyệt hiện đại: Chrome, Firefox hoặc Safari.
- Backend API chạy tại `http://localhost:1811` hoặc một URL được cấu hình
  qua `REACT_APP_API_URL`.
- Nếu build Android:
  - Android Studio.
  - Android SDK và JDK phù hợp với Capacitor 6.
  - Thiết bị Android hoặc emulator.

## Cài đặt và chạy dự án

### 1. Cài dependency

```bash
pnpm install
```

Có thể dùng npm nếu môi trường không có pnpm:

```bash
npm install
```

### 2. Cấu hình API

Tạo file `.env.local` ở thư mục gốc:

```env
REACT_APP_API_URL=http://localhost:1811/api
```

Nếu không tạo biến này, frontend tự dùng giá trị mặc định:
`http://localhost:1811/api`.

Sau khi thay đổi biến môi trường, cần khởi động lại dev server.

### 3. Chạy development

```bash
pnpm start
```

Mở [http://localhost:3000](http://localhost:3000). Ứng dụng tự reload khi
thay đổi mã nguồn và hiển thị lỗi lint trong terminal/trình duyệt.

### 4. Tài khoản đăng nhập khi phát triển

Màn hình đăng nhập hiện tại chỉ kiểm tra form bắt buộc và lưu cờ
`isAuthenticated=true` vào `localStorage`; username/password chưa được gửi
đến backend để xác thực. Vì vậy có thể dùng bất kỳ username và password không
trống nào trong môi trường development.

Đây **không phải** cơ chế xác thực phù hợp cho production. Xem thêm
[Ghi chú bảo mật](#ghi-chú-bảo-mật).

## Cấu hình biến môi trường

| Biến | Bắt buộc | Mặc định | Mô tả |
| --- | --- | --- | --- |
| `REACT_APP_API_URL` | Không | `http://localhost:1811/api` | Base URL của backend API |
| `ENABLE_OBFUSCATION` | Không | `false` | Đặt `true` để obfuscate JavaScript sau khi build |

Ví dụ:

```env
REACT_APP_API_URL=https://api.example.com/api
ENABLE_OBFUSCATION=false
```

Chỉ các biến bắt đầu bằng `REACT_APP_` được Create React App đưa vào bundle.
Không đặt secret, mật khẩu database hoặc private key trong các biến này.

## Các màn hình và nghiệp vụ

### Đăng nhập

Route: `/login`

- Nhập tên đăng nhập và mật khẩu.
- Có tùy chọn ghi nhớ đăng nhập.
- Sau khi submit, chuyển về Dashboard.
- Đăng xuất xóa cờ xác thực trong `localStorage` và chuyển về màn hình
  đăng nhập.

### Dashboard

Route: `/`

Dashboard gọi `GET /dashboard/stats` và hiển thị các thẻ thống kê, biểu đồ
trạng thái thiết bị cùng bảng sự kiện gần đây. Nếu API lỗi, giao diện hiển
thị thông báo không thể tải dữ liệu.

### Danh mục tài sản/CCDC/vật tư

Route: `/danh-muc/tai-san`

- Tải danh sách từ `GET /assets`.
- Tìm kiếm theo mã, tên thiết bị hoặc RFID.
- Tạo mới tài sản.
- Chỉnh sửa tài sản.
- Xóa tài sản.
- Chuyển sang màn hình in tem cho các tài sản được chọn.
- Các trường chính gồm tiền tố/mã tài sản, tên, phân loại, RFID, đơn vị
  tính, số lượng, trạng thái và vị trí.

### Danh mục phòng ban - kho

Route: `/danh-muc/phong-ban`

- Tải dữ liệu từ `GET /departments`.
- Tìm kiếm theo mã hoặc tên.
- Thêm, sửa, xóa phòng ban/kho.
- Quản lý tên, mã, ghi chú/người phụ trách và trạng thái hoạt động.

### Nhập kho

Route: `/kho/nhap`

- Tải danh sách phiên/phiếu từ `GET /import/sessions`.
- Tìm kiếm theo mã chứng từ hoặc người tạo.
- Theo dõi tiến độ số lượng đã quét trên tổng số lượng.
- Xem chi tiết bằng `GET /import?sessionId=<id>`.
- Hiển thị mã tài sản, tên, số lượng, EPC/RFID và trạng thái đã quét.
- In phiếu bằng chức năng in của trình duyệt.

### Xuất kho

Route: `/kho/xuat`

Hoạt động tương tự Nhập kho, sử dụng:

- `GET /export/sessions` để lấy danh sách phiếu.
- `GET /export?sessionId=<id>` để lấy chi tiết.

### Điều chuyển

Route: `/kho/dieu-chuyen`

- Tải danh sách phiếu điều chuyển.
- Tìm kiếm theo mã chứng từ.
- Xem chi tiết tài sản trong phiếu.
- In phiếu điều chuyển.

### Phát hành/gán RFID

Route: `/rfid/phat-hanh`

- Tải tài sản từ `GET /assets`.
- Chỉ hiển thị tài sản chưa có RFID.
- Chọn một tài sản để nhập mã EPC hoặc nhận dữ liệu từ máy quét PDA.
- Lưu mã bằng `PUT /assets/<keyId>`.
- Sau khi lưu, danh sách được tải lại và tài sản không còn nằm trong danh
  sách chờ gán.

### In tem nhãn

Route: `/rfid/in-the`

- Tải và tìm kiếm danh sách tài sản.
- Chọn một hoặc nhiều tài sản.
- Chọn máy in, mẫu tem và số bản sao.
- Tạo vùng in có kích thước tem 8 x 4 cm.
- Tem hiển thị mã tài sản, tên, QR và một phần mã RFID nếu đã có.
- Lệnh in hiện dùng `window.print()`; QR được tạo qua dịch vụ
  `api.qrserver.com`.

### Kiểm kê tài sản

Route: `/kiem-ke/thuc-hien`

- Tải các kỳ kiểm kê từ `GET /inventory/sessions`.
- Tạo kỳ kiểm kê bằng `POST /inventory/sessions`.
- Nhập tên đợt, ngày chốt tồn và kho/phòng ban.
- Xem chi tiết bằng `GET /inventory?sessionId=<id>`.
- Theo dõi tổng tồn sổ sách, số đã quét và chênh lệch.
- Xóa kỳ kiểm kê bằng `DELETE /inventory/sessions/<id>`.

### Tổng hợp kiểm kê

Route: `/kiem-ke/tong-hop`

Hiển thị bảng tổng hợp gồm kỳ kiểm kê, mã tài sản, vị trí, số theo sổ,
số thực tế và trạng thái khớp/thiếu/thừa. Dữ liệu và nút xuất Excel/in trong
phiên bản hiện tại đang được dựng ở frontend để hoàn thiện giao diện.

### Người dùng và phân quyền

Route: `/he-thong/user`

- Xem, tìm kiếm, thêm, sửa và xóa tài khoản.
- Chọn phòng ban, vai trò và trạng thái.
- Có các vai trò mẫu: Quản trị hệ thống, Thủ kho, Nhân viên kiểm kê và
  Người dùng xem.
- Reset mật khẩu về giá trị mặc định mô phỏng.

Màn hình hiện đang dùng state và dữ liệu mẫu trong trình duyệt, chưa gọi API
quản lý người dùng và chưa thực thi phân quyền backend.

### Cấu hình máy in Zebra

Route: `/he-thong/may-in`

- Thêm, sửa và xóa máy in.
- Lưu tên/vị trí, IP, port và độ phân giải.
- Hỗ trợ thông tin máy in Zebra qua mạng LAN/Wi-Fi, mặc định port ZPL là
  `9100`.
- Nút Test IP hiện mô phỏng kiểm tra kết nối bằng timeout.

### Báo cáo - thống kê

Route: `/he-thong/bao-cao`

- Chọn khoảng thời gian.
- Xem tổng tài sản, số đã gắn RFID, số phiếu nhập/xuất.
- Xem biểu đồ cơ cấu tài sản và biểu đồ nhập/xuất theo tháng.
- Xem các giao dịch gần đây.
- Các nút tải Excel/in hiện là giao diện; số liệu biểu đồ hiện dùng dữ liệu
  mẫu.

## Bảng trạng thái chức năng

| Chức năng | Trạng thái hiện tại | Nguồn dữ liệu |
| --- | --- | --- |
| Đăng nhập/đăng xuất | Có giao diện, xác thực tạm thời | `localStorage` |
| Dashboard | Đã nối API | Backend |
| Tài sản/CCDC/vật tư | Đã nối CRUD API | Backend |
| Phòng ban/kho | Đã nối CRUD API | Backend |
| Nhập kho | Đã nối API đọc danh sách/chi tiết | Backend |
| Xuất kho | Đã nối API đọc danh sách/chi tiết | Backend |
| Điều chuyển | Đã nối API đọc danh sách/chi tiết | Backend |
| Gán RFID | Đã nối đọc/cập nhật tài sản | Backend |
| In tem RFID | Giao diện và lệnh in trình duyệt | Frontend + QR service |
| Tạo kỳ kiểm kê | Đã nối API tạo/xóa/đọc | Backend |
| Tổng hợp kiểm kê | Giao diện mẫu | Frontend |
| Người dùng/phân quyền | Giao diện mẫu | Frontend |
| Máy in Zebra | Giao diện mô phỏng | Frontend |
| Báo cáo thống kê | Giao diện và dữ liệu mẫu | Frontend |

## API backend được frontend sử dụng

Frontend tạo Axios client tại `src/services/apiClient.js` với:

- Base URL: `REACT_APP_API_URL` hoặc `http://localhost:1811/api`.
- Timeout: 10 giây.
- Header mặc định: `Content-Type: application/json`.
- Log lỗi response ra console và reject lại promise để từng màn hình xử lý.

Các endpoint đang được gọi:

| Method | Endpoint | Mục đích |
| --- | --- | --- |
| GET | `/dashboard/stats` | Thống kê Dashboard |
| GET | `/assets` | Danh sách tài sản |
| POST | `/assets` | Tạo tài sản |
| PUT | `/assets/<keyId>` | Cập nhật tài sản/gán RFID |
| DELETE | `/assets/<keyId>` | Xóa tài sản |
| GET | `/departments` | Danh sách phòng ban/kho |
| POST | `/departments` | Tạo phòng ban/kho |
| PUT | `/departments/<keyId>` | Cập nhật phòng ban/kho |
| DELETE | `/departments/<keyId>` | Xóa phòng ban/kho |
| GET | `/import/sessions` | Danh sách phiên nhập |
| GET | `/import?sessionId=<id>` | Chi tiết phiên nhập |
| GET | `/export/sessions` | Danh sách phiên xuất |
| GET | `/export?sessionId=<id>` | Chi tiết phiên xuất |
| GET | `/transfer/sessions` | Danh sách phiên điều chuyển |
| GET | `/transfer?sessionId=<id>` | Chi tiết phiên điều chuyển |
| GET | `/inventory/sessions` | Danh sách kỳ kiểm kê |
| POST | `/inventory/sessions` | Tạo kỳ kiểm kê |
| DELETE | `/inventory/sessions/<id>` | Xóa kỳ kiểm kê |
| GET | `/inventory?sessionId=<id>` | Chi tiết kỳ kiểm kê |

Frontend kỳ vọng response thành công có dạng tổng quát:

```json
{
  "success": true,
  "data": []
}
```

Tên thuộc tính chi tiết của dữ liệu phiếu hiện cần khớp với backend, ví dụ
`MaChungTuNhap`, `NgayLapPhieu`, `NguoiTao`, `totalItems`, `scannedItems`,
`MaTaiSan`, `TenThietBi`, `SoLuong`, `SoThe`, `DaXacNhan`.

## Build và triển khai web

### Build production

```bash
pnpm build
```

Lệnh build:

1. Tạo bundle production vào thư mục `build`.
2. Tắt source map bằng `GENERATE_SOURCEMAP=false`.
3. Chạy script `postbuild`.
4. Mặc định bỏ qua obfuscation và in thông báo.

Bật obfuscation sau build:

```bash
ENABLE_OBFUSCATION=true pnpm build
```

Obfuscation chỉ nên bật sau khi đã kiểm tra kỹ bundle production vì có thể
làm khó debug và tăng thời gian build.

### Nginx

File `nginx.conf` cung cấp cấu hình mẫu:

- Serve static files từ `/usr/share/nginx/html`.
- Fallback mọi route frontend về `index.html`, cần thiết cho React Router.
- Cache asset tĩnh trong một năm.

Ví dụ triển khai thủ công:

```bash
pnpm build
# Copy nội dung thư mục build/ vào thư mục web root của Nginx
```

Khi deploy sau reverse proxy, cần đảm bảo backend API được trỏ đúng qua
`REACT_APP_API_URL` tại thời điểm build và server hỗ trợ fallback
`/index.html`.

## Đóng gói Android bằng Capacitor

Ứng dụng được cấu hình trong `capacitor.config.ts`:

- App ID: `vn.id.dinhtrung.warehousemanagement`
- Tên ứng dụng: `Quản lý kho`
- Thư mục web: `build`

Sau khi build web, đồng bộ sang Android:

```bash
pnpm build
npx cap sync android
npx cap open android
```

Hoặc chạy trực tiếp trên thiết bị/emulator:

```bash
npx cap run android
```

Để build APK bằng Android Studio, mở thư mục `android/`, chọn variant mong
muốn và thực hiện Build APK. Khi backend chạy trên máy phát triển, Android
emulator thường cần dùng địa chỉ `10.0.2.2` thay cho `localhost`; thiết bị
thật cần dùng IP LAN của máy chạy backend và cho phép kết nối từ mạng nội bộ.

## Cấu trúc thư mục

```text
.
├── public/                 # index.html, logo, manifest, service worker
├── src/
│   ├── components/Layout/  # Layout chính, menu và header
│   ├── pages/              # Các màn hình nghiệp vụ
│   ├── services/           # Axios API client
│   ├── utils/              # Hàm tiện ích dùng chung
│   ├── App.js              # Router và route bảo vệ
│   └── index.js            # Điểm khởi động React
├── android/                # Project Android của Capacitor
├── scripts/                # Script sau build
├── capacitor.config.ts     # Cấu hình Capacitor
├── nginx.conf              # Cấu hình Nginx mẫu
├── package.json            # Scripts và dependencies
└── pnpm-lock.yaml          # Khóa phiên bản dependency
```

## Kiểm thử và xử lý lỗi thường gặp

### Chạy test

```bash
pnpm test
```

Create React App sẽ mở test runner ở chế độ watch. Chạy một lần trong CI:

```bash
CI=true pnpm test
```

### API không tải được dữ liệu

Kiểm tra lần lượt:

1. Backend có đang chạy tại đúng host/port không.
2. `REACT_APP_API_URL` có đúng và có hậu tố `/api` không.
3. Có lỗi CORS giữa frontend và backend không.
4. Mở DevTools, kiểm tra tab Network và Console.
5. Khởi động lại frontend sau khi sửa `.env.local`.

### Refresh route bị 404 sau khi deploy

Nginx/web server phải fallback các route không phải file tĩnh về
`/index.html`. Có thể tham khảo `nginx.conf` và `public/.htaccess`.

### Không in được tem

Lệnh in hiện dựa trên hộp thoại in của trình duyệt (`window.print()`), chưa
gửi ZPL trực tiếp tới máy in. Kiểm tra:

- Đã chọn ít nhất một tài sản.
- Trình duyệt không chặn popup/hộp thoại in.
- Driver và máy in mặc định của hệ điều hành hoạt động.
- Khi cần in mạng trực tiếp, cần bổ sung backend/printing service.

## Ghi chú bảo mật

- Không dùng cơ chế `localStorage.isAuthenticated` hiện tại làm xác thực
  production: người dùng có thể tự sửa giá trị này trong DevTools.
- Không lưu mật khẩu hoặc token bí mật trong source code, `.env` được commit,
  `localStorage` hoặc bundle frontend.
- Backend cần tự xác thực người dùng, quản lý session/JWT, kiểm tra quyền trên
  từng endpoint và validate toàn bộ input.
- Cấu hình CORS chỉ cho phép các origin cần thiết.
- Nếu QR service bên ngoài không phù hợp với chính sách dữ liệu, hãy thay bằng
  thư viện tạo QR nội bộ hoặc endpoint được kiểm soát.
- Không công khai địa chỉ IP máy in nội bộ trong môi trường public nếu không
  cần thiết.

## Định hướng phát triển

- Kết nối đăng nhập với backend và bổ sung phân quyền thực tế.
- Thay dữ liệu mẫu ở người dùng, máy in, báo cáo và tổng hợp kiểm kê bằng API.
- Hoàn thiện thao tác tạo và cập nhật phiếu nhập/xuất/điều chuyển.
- Tích hợp SDK/PDA RFID hoặc WebSocket để nhận dữ liệu quét theo thời gian
  thực.
- Gửi ZPL trực tiếp tới máy in Zebra và quản lý template tem từ backend.
- Bổ sung xuất Excel/PDF thật, audit log và lịch sử thay đổi.
- Thêm test cho các nghiệp vụ CRUD, xác thực route và xử lý lỗi API.
