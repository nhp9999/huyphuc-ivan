# Tính năng Thanh toán Bổ sung (Additional Payment Feature)

## Tổng quan

Tính năng này cho phép người dùng thêm thanh toán bổ sung cho một kê khai đã tồn tại. Điều này hữu ích trong trường hợp:
- Kê khai có tổng số tiền 20 VND nhưng chỉ thanh toán được 18 VND ban đầu
- Sau đó cần thanh toán thêm 2 VND còn thiếu
- Có thể upload nhiều hóa đơn chứng minh cho cùng một kê khai

## Các thành phần đã thêm/cập nhật

### 1. PaymentService (paymentService.ts)
**Các function mới:**
- `getAllPaymentsByKeKhaiId(keKhaiId)`: Lấy tất cả thanh toán của một kê khai
- `createAdditionalPayment(data)`: Tạo thanh toán bổ sung
- `getTotalPaidAmount(keKhaiId)`: Tính tổng số tiền đã thanh toán

### 2. AdditionalPaymentModal Component
**Chức năng:**
- Hiển thị thông tin tổng quan về thanh toán (tổng cần trả, đã trả, còn thiếu)
- Cho phép nhập số tiền thanh toán bổ sung
- Upload ảnh chứng minh thanh toán (tùy chọn)
- Tạo QR code cho thanh toán bổ sung
- Validation số tiền không vượt quá số tiền còn thiếu

### 3. PaymentHistoryModal Component
**Chức năng:**
- Hiển thị lịch sử tất cả thanh toán của một kê khai
- Thống kê tổng quan (tổng cần trả, đã trả, còn thiếu)
- Xem chi tiết từng thanh toán
- Xem ảnh chứng minh của từng thanh toán

### 4. AllPaymentProofsModal Component
**Chức năng:**
- Hiển thị TẤT CẢ ảnh chứng minh thanh toán của một kê khai
- Danh sách thumbnail các ảnh chứng minh ở sidebar
- Viewer ảnh với zoom, xoay, download
- Thông tin chi tiết của từng thanh toán
- Giải quyết vấn đề "chỉ thấy 1 ảnh chứng minh"

### 5. MyPayments Page (Cập nhật)
**Tính năng mới:**
- Hiển thị thông tin chi tiết về số tiền (tổng, đã trả, còn thiếu)
- Nút "Tất cả ảnh chứng minh" (biểu tượng Images - màu emerald) cho kê khai có nhiều ảnh
- Nút "Lịch sử thanh toán" (biểu tượng History - màu indigo) cho các kê khai có nhiều thanh toán
- Nút "Thanh toán bổ sung" (biểu tượng + - màu purple) cho các kê khai cần thanh toán thêm
- Tự động tải thông tin tổng quan thanh toán cho mỗi kê khai

## Cách sử dụng

### 1. Xem thông tin thanh toán chi tiết
1. Vào trang "Thanh toán của tôi"
2. Trong cột "Số tiền", bạn sẽ thấy:
   - **Tổng**: Tổng số tiền cần thanh toán
   - **Đã trả**: Số tiền đã thanh toán thành công
   - **Còn thiếu**: Số tiền còn phải thanh toán

### 2. Thực hiện thanh toán bổ sung
1. Tìm kê khai cần thanh toán thêm (có hiển thị "Còn thiếu" > 0)
2. Nhấn nút **+** (màu tím) trong cột "Thao tác"
3. Trong modal "Thanh toán bổ sung":
   - Nhập số tiền cần thanh toán thêm
   - Thêm ghi chú (tùy chọn)
   - Upload ảnh chứng minh (tùy chọn)
   - Nhấn "Tạo thanh toán"
4. Hệ thống sẽ tạo QR code mới cho thanh toán bổ sung

### 3. Xem tất cả ảnh chứng minh thanh toán
1. Tìm kê khai có nhiều ảnh chứng minh (có nút **Images** màu emerald)
2. Nhấn nút **Images** trong cột "Thao tác"
3. Xem tất cả ảnh chứng minh của kê khai trong một modal:
   - Sidebar bên trái: Danh sách thumbnail các ảnh
   - Bên phải: Viewer ảnh với zoom, xoay, download
   - Click vào thumbnail để chuyển đổi giữa các ảnh

### 4. Xem lịch sử thanh toán
1. Tìm kê khai có nhiều thanh toán
2. Nhấn nút **History** (màu indigo) trong cột "Thao tác"
3. Xem danh sách tất cả thanh toán của kê khai đó
4. Có thể xem chi tiết hoặc ảnh chứng minh của từng thanh toán

## Luồng xử lý

### Tạo thanh toán bổ sung:
1. Validate số tiền > 0 và <= số tiền còn thiếu
2. Tạo mã thanh toán mới
3. Tạo QR code cho thanh toán bổ sung
4. Lưu vào database với trạng thái 'pending'
5. Upload ảnh chứng minh (nếu có)
6. Cập nhật trạng thái thanh toán

### Hiển thị thông tin:
1. Tính tổng số tiền cần thanh toán từ participants
2. Tính tổng số tiền đã thanh toán thành công
3. Hiển thị số tiền còn thiếu
4. Hiển thị nút thanh toán bổ sung nếu còn thiếu > 0

## Database Schema

### Bảng thanh_toan
Các trường quan trọng:
- `ke_khai_id`: ID của kê khai
- `so_tien`: Số tiền của thanh toán này
- `trang_thai`: Trạng thái thanh toán
- `ghi_chu`: Ghi chú (dùng để phân biệt thanh toán bổ sung)
- `proof_image_url`: URL ảnh chứng minh

### Quan hệ:
- Một kê khai có thể có nhiều thanh toán (1:n)
- Mỗi thanh toán có thể có một ảnh chứng minh

## Validation và Business Rules

1. **Số tiền thanh toán bổ sung:**
   - Phải > 0
   - Không được vượt quá số tiền còn thiếu
   - Được format theo định dạng tiền tệ Việt Nam

2. **Ảnh chứng minh:**
   - Tùy chọn (không bắt buộc)
   - Chỉ chấp nhận file ảnh (PNG, JPG, GIF)
   - Tối đa 10MB

3. **Hiển thị nút thanh toán bổ sung:**
   - Chỉ hiển thị khi: `tổng_cần_trả > tổng_đã_trả` và `tổng_đã_trả > 0`
   - Ẩn nút khi đã thanh toán đủ

4. **Hiển thị nút lịch sử:**
   - Chỉ hiển thị khi kê khai có > 1 thanh toán

## Lưu ý kỹ thuật

1. **Performance:** Sử dụng Promise.all để tải song song thông tin thanh toán
2. **Error Handling:** Có xử lý lỗi cho tất cả API calls
3. **UI/UX:** Sử dụng loading states và toast notifications
4. **Responsive:** Tất cả modal đều responsive trên mobile
5. **Accessibility:** Có title tooltips cho các nút action

## Testing

Để test tính năng:
1. Tạo một kê khai với tổng số tiền 100,000 VND
2. Thanh toán 70,000 VND đầu tiên
3. Kiểm tra hiển thị "Còn thiếu: 30,000 VND"
4. Nhấn nút + để thanh toán bổ sung 30,000 VND
5. Kiểm tra lịch sử thanh toán hiển thị 2 thanh toán
