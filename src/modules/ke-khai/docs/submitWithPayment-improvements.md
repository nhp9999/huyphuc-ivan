# Submit với Payment - Cải thiện đồng bộ hệ thống

## Tổng quan
Đã cải thiện logic nút "Nộp & Thanh toán" để đảm bảo đồng bộ hoàn toàn giữa các trạng thái trong hệ thống.

## Các thay đổi chính

### 1. keKhaiService.ts

#### Thêm method mới: `updateParticipantStatusByPaymentId`
```typescript
async updateParticipantStatusByPaymentId(
  paymentId: number,
  participantStatus: string,
  userId: string,
  notes?: string
): Promise<{ success: boolean; message: string; count: number }>
```

**Chức năng:** Cập nhật participant_status cho tất cả participants có payment_id cụ thể.

#### Cải thiện method: `confirmPayment`
- Thêm logging chi tiết
- Gọi `updateParticipantStatusByPaymentId` để cập nhật participant_status
- Đảm bảo đồng bộ: payment_status + participant_status + ke_khai status

#### Thêm method mới: `submitKeKhaiWithPayment`
```typescript
async submitKeKhaiWithPayment(
  keKhaiId: number,
  userId: string,
  participantIds?: number[]
): Promise<{
  success: boolean;
  message: string;
  payment?: ThanhToan;
  keKhai?: DanhSachKeKhai;
}>
```

**Chức năng:** Quy trình tổng hợp submit kê khai và tạo thanh toán.

### 2. KeKhai603FormContent.tsx

#### Cải thiện method: `executeSubmitWithPayment`
- Sử dụng `submitKeKhaiWithPayment` thay vì logic phân tán
- Giảm code duplication
- Cải thiện error handling

#### Cải thiện method: `handlePaymentConfirmed`
- Loại bỏ logic submit redundant
- Dựa vào `confirmPayment` service để xử lý status updates
- Cải thiện logging và error messages

### 3. PaymentQRModal.tsx

#### Cải thiện method: `handlePaymentConfirm`
- Thêm logging chi tiết
- Cải thiện error messages
- Đảm bảo user feedback rõ ràng

## Quy trình mới

### Submit toàn bộ kê khai với payment:

1. **executeSubmitWithPayment()** 
   - Gọi `keKhaiService.submitKeKhaiWithPayment()`
   - Tạo payment và cập nhật payment_id cho participants
   - Cập nhật ke_khai status nếu cần

2. **User xác nhận thanh toán**
   - PaymentQRModal gọi `keKhaiService.confirmPayment()`

3. **confirmPayment() xử lý đồng bộ:**
   - Cập nhật payment.trang_thai = 'completed'
   - Cập nhật participant.payment_status = 'completed'
   - **MỚI:** Cập nhật participant.participant_status = 'submitted'
   - Cập nhật ke_khai.trang_thai = 'processing'
   - Emit events

4. **handlePaymentConfirmed() cleanup:**
   - Đóng modal
   - Refresh UI
   - Hiển thị success message

## Lợi ích

### 1. Tính nhất quán
- Tất cả status updates được xử lý tại một nơi
- Không còn logic phân tán
- Đảm bảo data consistency

### 2. Maintainability
- Code dễ đọc và maintain hơn
- Ít duplicate logic
- Centralized error handling

### 3. Reliability
- Atomic operations
- Better error recovery
- Comprehensive logging

### 4. User Experience
- Feedback rõ ràng hơn
- Loading states chính xác
- Error messages có ý nghĩa

## Breaking Changes
Không có breaking changes. Tất cả APIs hiện tại vẫn hoạt động.

## Migration Guide
Không cần migration. Các thay đổi backward compatible.

## Testing
Xem file `submitWithPayment.test.md` để biết chi tiết test plan.

## Future Improvements
1. Thêm transaction support cho atomic operations
2. Implement retry mechanism cho failed operations
3. Add audit trail cho status changes
4. Optimize database queries với batch operations
