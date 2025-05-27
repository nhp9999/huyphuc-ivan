# Tích hợp API tra cứu thông tin BHYT

## Tổng quan

Tính năng tra cứu thông tin Bảo hiểm Y tế (BHYT) đã được tích hợp vào ứng dụng dashboard, sử dụng API của VNPost tại endpoint `https://ssm.vnpost.vn/connect/tracuu/thongtinthe`.

## Cấu trúc files đã thêm

### 1. Types
- `src/types/bhyt.ts` - Định nghĩa interface cho dữ liệu BHYT

### 2. Services
- `src/services/api.ts` - HTTP client chung
- `src/services/bhytService.ts` - Service chuyên biệt cho API BHYT

### 3. Components
- `src/pages/BhytLookup.tsx` - Trang tra cứu BHYT với tabs đơn lẻ/hàng loạt
- `src/components/BulkLookup.tsx` - Component tra cứu hàng loạt
- `src/components/ApiInstructions.tsx` - Hướng dẫn cấu hình API

### 4. Navigation
- Đã cập nhật `NavigationContext` để thêm route 'bhyt-lookup'
- Đã thêm menu item trong `Sidebar`
- Đã thêm route trong `App.tsx`

## Cách sử dụng

### 1. API thật (hiện tại)
- ✅ Ứng dụng đang kết nối trực tiếp với API VNPost
- ✅ Tra cứu thông tin BHYT thực từ cơ sở dữ liệu chính thức
- ✅ Hỗ trợ cả tra cứu đơn lẻ và hàng loạt

### 2. Cấu hình API

#### Token hiện tại
```typescript
private authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

#### Cập nhật token mới (khi hết hạn)
Trong file `src/services/bhytService.ts`, thay đổi:

```typescript
private authToken = 'YOUR_NEW_TOKEN_HERE';
```

#### Quay lại mock data (nếu cần test)
Trong `src/pages/BhytLookup.tsx` và `src/components/BulkLookup.tsx`:

```typescript
// Thay đổi từ:
const response = await bhytService.lookupBhytInfo(maSoBHXH);

// Thành:
const response = await bhytService.mockLookupBhytInfo(maSoBHXH);
```

## API Endpoint

```
GET https://ssm.vnpost.vn/connect/tracuu/thongtinthe?maSoBHXH={maSoBHXH}
```

### Headers yêu cầu:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json, text/plain, */*
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
sec-ch-ua-platform: "Windows"
sec-ch-ua: "Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"
sec-ch-ua-mobile: ?0
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
host: ssm.vnpost.vn
```

## Dữ liệu trả về

```typescript
interface BhytInfo {
  maSoBHXH: string;        // Mã số BHXH
  hoTen: string;           // Họ và tên
  ngaySinh: string;        // Ngày sinh
  gioiTinh: string;        // Giới tính
  diaChi: string;          // Địa chỉ
  noiDangKyKCB: string;    // Nơi đăng ký khám chữa bệnh
  trangThaiThe: string;    // Trạng thái thẻ
  ngayHieuLuc: string;     // Ngày hiệu lực
  ngayHetHan: string;      // Ngày hết hạn
  mucHuong: string;        // Mức hưởng
  donViCongTac: string;    // Đơn vị công tác
  maKV: string;            // Mã khu vực
  tenKV: string;           // Tên khu vực
}
```

## Lưu ý quan trọng

1. **Token expiration**: Token có thể hết hạn, cần cập nhật định kỳ
2. **CORS**: API có thể yêu cầu cấu hình CORS
3. **Rate limiting**: Cần kiểm tra giới hạn số lượng request
4. **Error handling**: Đã implement xử lý lỗi cơ bản
5. **Security**: Không lưu trữ token trong localStorage, chỉ hardcode trong code

## Tính năng

### Tra cứu đơn lẻ
- ✅ Form nhập mã số BHXH với validation
- ✅ Hiển thị loading state
- ✅ Hiển thị kết quả tra cứu với UI đẹp
- ✅ Xử lý lỗi và hiển thị thông báo

### Tra cứu hàng loạt
- ✅ Nhập nhiều mã số BHXH (tối đa 100)
- ✅ Progress bar hiển thị tiến trình
- ✅ **Card-based layout** với chi tiết đầy đủ
- ✅ **Click to expand/collapse** từng kết quả
- ✅ **Mở/Đóng tất cả** cards cùng lúc
- ✅ Hiển thị **12 trường thông tin** như tra cứu đơn lẻ
- ✅ Export kết quả ra CSV
- ✅ Copy kết quả
- ✅ Dữ liệu mẫu để test

### Chung
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Mock data cho testing
- ✅ Hướng dẫn sử dụng
- ✅ Tab navigation

## Cách test

### Tra cứu đơn lẻ
1. Chạy ứng dụng: `npm run dev`
2. Đăng nhập với: `admin@example.com` / `password`
3. Click vào menu "Tra cứu BHYT"
4. Nhập mã số BHXH thực (10 chữ số)
5. Click "Tra cứu"

### Tra cứu hàng loạt
1. Chuyển sang tab "Tra cứu hàng loạt"
2. Nhập danh sách mã số BHXH thực
3. Click "Tra cứu hàng loạt"
4. Xem progress bar và kết quả
5. **Click vào từng card** để xem chi tiết đầy đủ
6. Sử dụng **"Mở tất cả"/"Đóng tất cả"** để điều khiển
7. Thử "Xuất CSV" hoặc "Copy" kết quả

**Lưu ý**: Hiện đang sử dụng API thật, cần nhập mã số BHXH thực để có kết quả.

## Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS khi gọi API thật, có thể cần:
1. Cấu hình proxy trong `vite.config.ts`
2. Hoặc sử dụng browser extension để disable CORS
3. Hoặc gọi API từ backend thay vì frontend

### Token hết hạn
Nếu API trả về lỗi 401/403:
1. Lấy token mới từ VNPost
2. Cập nhật trong `bhytService.ts`

### API không phản hồi
1. Kiểm tra network connectivity
2. Kiểm tra endpoint URL
3. Kiểm tra headers
