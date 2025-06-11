# Manual Test Script - Submit với Payment Logic

## Chuẩn bị test

### 1. Kiểm tra console logs
Mở Developer Tools (F12) và theo dõi console để xem các log messages:
- `🚀 Starting unified submit with payment process...`
- `✅ Unified submit with payment completed:`
- `🎉 Payment confirmed! Processing post-payment actions...`

### 2. Kiểm tra database trước test
```sql
-- Kiểm tra trạng thái ban đầu
SELECT id, ma_ke_khai, trang_thai, payment_status FROM danh_sach_ke_khai WHERE id = [KE_KHAI_ID];
SELECT id, ho_ten, participant_status, payment_status, payment_id FROM danh_sach_nguoi_tham_gia WHERE ke_khai_id = [KE_KHAI_ID];
SELECT id, ma_thanh_toan, trang_thai, so_tien FROM thanh_toan WHERE ke_khai_id = [KE_KHAI_ID];
```

## Test Case 1: Submit toàn bộ kê khai với payment

### Bước 1: Chuẩn bị
- [ ] Có kê khai với trạng thái 'draft'
- [ ] Có ít nhất 1 người tham gia với trạng thái 'draft'
- [ ] Tổng tiền > 0

### Bước 2: Thực hiện submit
1. [ ] Click nút "Nộp & Thanh toán" (màu tím)
2. [ ] Kiểm tra modal xác nhận hiển thị
3. [ ] Click "Xác nhận" trong modal
4. [ ] Kiểm tra console logs:
   ```
   🚀 Starting unified submit with payment process...
   ✅ Payment created successfully: [PAYMENT_ID]
   ✅ Unified submit with payment completed:
   ```

### Bước 3: Kiểm tra payment modal
1. [ ] PaymentQRModal hiển thị
2. [ ] QR code hiển thị (nếu có)
3. [ ] Thông tin thanh toán đúng (số tiền, mã thanh toán)
4. [ ] Button "Tôi đã thanh toán" hiển thị

### Bước 4: Xác nhận thanh toán
1. [ ] Click "Tôi đã thanh toán"
2. [ ] Modal xác nhận thanh toán hiển thị
3. [ ] Nhập thông tin (tùy chọn) và click "Xác nhận"
4. [ ] Kiểm tra console logs:
   ```
   🚀 Starting payment confirmation process...
   ✅ Payment confirmation completed successfully
   🎉 Payment confirmed! Processing post-payment actions...
   ✅ Regular submit completed - status updates handled by confirmPayment service
   ```

### Bước 5: Kiểm tra kết quả
1. [ ] Toast success hiển thị: "Thanh toán đã được xác nhận thành công! Trạng thái đã được cập nhật."
2. [ ] Modal đóng
3. [ ] Participants list refresh

### Bước 6: Kiểm tra database
```sql
-- Kiểm tra payment
SELECT id, ma_thanh_toan, trang_thai, so_tien, paid_at FROM thanh_toan WHERE ke_khai_id = [KE_KHAI_ID];
-- Expected: trang_thai = 'completed', paid_at IS NOT NULL

-- Kiểm tra kê khai
SELECT id, ma_ke_khai, trang_thai, payment_status, payment_completed_at FROM danh_sach_ke_khai WHERE id = [KE_KHAI_ID];
-- Expected: trang_thai = 'processing', payment_status = 'completed'

-- Kiểm tra participants
SELECT id, ho_ten, participant_status, payment_status, payment_id, submitted_at, submitted_by FROM danh_sach_nguoi_tham_gia WHERE ke_khai_id = [KE_KHAI_ID];
-- Expected: participant_status = 'submitted', payment_status = 'completed', payment_id IS NOT NULL
```

## Test Case 2: Error Handling

### Test lỗi khi không có participants
1. [ ] Tạo kê khai mới không có participants
2. [ ] Click "Nộp & Thanh toán"
3. [ ] Kiểm tra error message: "Chưa có người tham gia nào trong kê khai..."

### Test lỗi khi tổng tiền = 0
1. [ ] Có participants nhưng tất cả có tienDong = 0
2. [ ] Click "Nộp & Thanh toán"
3. [ ] Kiểm tra error message: "Tổng số tiền thanh toán phải lớn hơn 0..."

### Test lỗi network
1. [ ] Disconnect internet
2. [ ] Thực hiện submit
3. [ ] Kiểm tra error handling và user feedback

## Test Case 3: UI States

### Loading states
1. [ ] Button "Nộp & Thanh toán" disabled khi đang submit
2. [ ] Loading spinner hiển thị
3. [ ] Text thay đổi thành "Đang xử lý..."

### Button states
1. [ ] Button disabled khi `submittingWithPayment = true`
2. [ ] Button disabled khi `saving = true`
3. [ ] Button disabled khi `savingData = true`
4. [ ] Button disabled khi `householdProcessing = true`

## Validation Checklist

### ✅ Functional Requirements
- [ ] Payment được tạo với đúng thông tin
- [ ] QR code hiển thị (nếu có)
- [ ] Xác nhận thanh toán cập nhật đúng trạng thái
- [ ] Database consistency được đảm bảo
- [ ] Event emitter hoạt động đúng

### ✅ Non-Functional Requirements
- [ ] Performance: Không có duplicate API calls
- [ ] UX: Loading states rõ ràng
- [ ] Error handling: Messages có ý nghĩa
- [ ] Logging: Console logs đầy đủ cho debugging

### ✅ Edge Cases
- [ ] Xử lý khi user đóng modal giữa chừng
- [ ] Xử lý khi network bị disconnect
- [ ] Xử lý khi payment service trả về lỗi
- [ ] Xử lý khi confirmPayment service trả về lỗi

## Rollback Test

Nếu có lỗi, kiểm tra:
1. [ ] Database không bị corrupt
2. [ ] Partial updates được handle đúng
3. [ ] User có thể retry operation
4. [ ] Error messages hướng dẫn user cách fix
