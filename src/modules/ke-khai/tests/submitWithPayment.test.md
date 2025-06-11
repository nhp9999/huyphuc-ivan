# Test Plan: Submit với Payment Logic

## Mục tiêu
Kiểm tra logic nút "Nộp & Thanh toán" đã được đồng bộ hoàn toàn với hệ thống.

## Test Cases

### 1. Test Submit với Payment - Toàn bộ kê khai

**Điều kiện tiên quyết:**
- Có kê khai với ít nhất 1 người tham gia
- Tất cả người tham gia có trạng thái 'draft'
- Tổng tiền > 0

**Các bước:**
1. Click nút "Nộp & Thanh toán"
2. Xác nhận trong modal
3. Kiểm tra payment được tạo
4. Xác nhận thanh toán trong QR modal
5. Kiểm tra trạng thái sau khi xác nhận

**Kết quả mong đợi:**
- Payment: `pending` → `completed`
- Kê khai: `draft` → `pending_payment` → `processing`
- Participants: `draft` → `submitted` (đã nộp lên công ty)
- payment_status của participants: `unpaid` → `pending` → `completed`

### 2. Test Submit với Payment - Bulk participants

**Điều kiện tiên quyết:**
- Có kê khai với nhiều người tham gia
- Chọn một số người tham gia để nộp

**Các bước:**
1. Chọn checkbox một số participants
2. Click "Nộp hàng loạt với thanh toán"
3. Nhập ghi chú và xác nhận
4. Xác nhận thanh toán
5. Kiểm tra kê khai mới được tạo

**Kết quả mong đợi:**
- Tạo kê khai mới với participants được chọn
- Participants chuyển sang kê khai mới với trạng thái 'submitted'
- Payment completed cho kê khai mới

### 3. Test Submit với Payment - Individual participant

**Điều kiện tiên quyết:**
- Có participant với trạng thái 'draft'
- Participant có tổng tiền > 0

**Các bước:**
1. Click menu context cho participant
2. Chọn "Nộp với thanh toán"
3. Xác nhận thanh toán
4. Kiểm tra trạng thái

**Kết quả mong đợi:**
- Participant: `draft` → `submitted`
- Payment được tạo và completed
- payment_status: `unpaid` → `completed`

## Validation Points

### Database Consistency
- [ ] payment.trang_thai = 'completed'
- [ ] payment.paid_at được set
- [ ] ke_khai.trang_thai = 'processing' (cho full submit)
- [ ] ke_khai.payment_status = 'completed'
- [ ] participant.participant_status = 'submitted'
- [ ] participant.payment_status = 'completed'
- [ ] participant.payment_id được set đúng
- [ ] participant.submitted_at được set
- [ ] participant.submitted_by được set

### UI Consistency
- [ ] Toast messages hiển thị đúng
- [ ] Loading states hoạt động
- [ ] Modal đóng mở đúng
- [ ] Participants list refresh sau khi submit
- [ ] Status badges hiển thị đúng màu sắc

### Error Handling
- [ ] Xử lý lỗi khi tạo payment
- [ ] Xử lý lỗi khi confirm payment
- [ ] Rollback khi có lỗi
- [ ] Toast error messages rõ ràng

## Performance Checks
- [ ] Không có duplicate API calls
- [ ] Event listeners được cleanup đúng
- [ ] Memory leaks được tránh
- [ ] Loading states không bị stuck

## Integration Points
- [ ] Event emitter hoạt động đúng
- [ ] PaymentQRModal sync với parent
- [ ] KeKhai603Header buttons disabled đúng lúc
- [ ] Navigation sau submit hoạt động

## Regression Tests
- [ ] Các chức năng khác không bị ảnh hưởng
- [ ] Save data vẫn hoạt động bình thường
- [ ] Edit participant vẫn hoạt động
- [ ] Remove participant vẫn hoạt động
