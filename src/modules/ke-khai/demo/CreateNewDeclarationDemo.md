# Demo: Option 1 - Giữ 2 nút chính

## **Tính năng đã implement**

### **1. Service Methods (keKhaiService.ts)**

#### `createNewDeclarationWithParticipants()`
- Tạo kê khai mới với thông tin sao chép từ kê khai gốc
- Validate participants thuộc kê khai gốc
- Tự động tạo tên kê khai mới: `"[Tên gốc] - Tách X người"`

#### `moveParticipantsToNewDeclaration()`
- Di chuyển participants sang kê khai mới
- Reset trạng thái submission và payment về `draft`/`unpaid`
- Cập nhật `ke_khai_id` trong database

#### `createDeclarationAndMoveParticipants()`
- Workflow hoàn chỉnh: tạo kê khai + di chuyển participants
- Trả về thông tin kê khai mới và participants đã di chuyển

### **2. Simplified UI Components**

#### **KeKhai603FormContent**
- Direct handler `handleBulkSubmitParticipantsWithPayment()`
- Confirmation dialog đơn giản với window.confirm()
- Handler `handleCreateNewDeclarationAndSubmitWithPayment()`
- Workflow trực tiếp: tạo kê khai → nộp → thanh toán

#### **KeKhai603ParticipantTable**
- Nút "Tạo kê khai mới & Nộp" (màu xanh lá)
- Workflow đơn giản, không có lựa chọn phức tạp
- Trực tiếp thực hiện tạo kê khai mới và nộp thanh toán

## **Simplified Workflow sử dụng**

### **Bước 1: Chọn participants**
```
1. Vào form kê khai có 10 người tham gia
2. Tick checkbox chọn 2 người cần tạo kê khai mới
3. Thấy xuất hiện bulk actions bar với:
   - Nút "Tạo kê khai mới & Nộp" (màu xanh lá)
   - Nút "Xóa đã chọn" (màu đỏ)
   - (Đã xóa nút "Nộp đã chọn")
```

### **Bước 2: Click "Tạo kê khai mới & Nộp"**
```
1. Click nút "Tạo kê khai mới & Nộp" (màu xanh lá)
2. Hiện confirmation dialog đơn giản:
   - "Bạn có muốn tạo kê khai mới và nộp thanh toán cho 2 người được chọn không?"
   - "Danh sách: Nguyễn Văn A, Trần Thị B"
   - "Lưu ý: Những người này sẽ được di chuyển sang kê khai mới và nộp thanh toán ngay lập tức."
3. Click "OK" để xác nhận hoặc "Cancel" để hủy
```

### **Bước 3: Xử lý tự động**
```
1. Tạo kê khai mới: "Kê khai gốc - Tách 2 người"
2. Di chuyển 2 người sang kê khai mới
3. Tự động nộp 2 người trong kê khai mới
4. Tạo payment cho kê khai mới
5. Hiển thị QR code thanh toán ngay lập tức
6. Refresh danh sách: kê khai gốc còn 8 người
```

### **Bước 4: Thanh toán**
```
1. Hiển thị PaymentQRModal với QR code
2. Người dùng quét mã QR để thanh toán
3. Xác nhận thanh toán thành công
4. Cập nhật trạng thái participants thành "paid"
```

## **Kết quả**

### **Kê khai gốc:**
- Còn lại 8 người ở trạng thái `draft`
- Không bị ảnh hưởng bởi việc tạo kê khai mới
- Có thể tiếp tục thêm người hoặc xử lý bình thường

### **Kê khai mới:**
- Tên: "[Tên gốc] - Tách 2 người"
- 2 người ở trạng thái `submitted`/`pending_payment` (hoặc `paid` sau khi thanh toán)
- Thông tin kê khai sao chép từ gốc
- Payment record riêng biệt
- Có thể xử lý độc lập hoàn toàn

## **Ưu điểm của giải pháp đơn giản**

✅ **Đơn giản**: Một nút duy nhất, một hành động rõ ràng
✅ **Rõ ràng**: Tên nút "Tạo kê khai mới & Nộp" thể hiện chính xác chức năng
✅ **Workflow liền mạch**: Từ chọn → tạo → nộp → thanh toán trong một luồng
✅ **Không confusion**: Loại bỏ nút "Nộp đã chọn" để tránh nhầm lẫn
✅ **Hiệu quả**: Thực hiện đúng mục đích - tách nhóm người ra kê khai riêng
✅ **Tích hợp hoàn chỉnh**: Kết thúc bằng thanh toán ngay lập tức
✅ **UI sạch sẽ**: Chỉ còn 2 nút chính: "Tạo kê khai mới & Nộp" và "Xóa đã chọn"

## **Lưu ý kỹ thuật**

- Participants được **di chuyển** (không sao chép)
- Database relationship được cập nhật chính xác
- Trạng thái submission/payment được reset
- Validation đầy đủ trước khi thực hiện
- Error handling cho các trường hợp edge case

## **Test Cases**

### **Test 1: Tạo kê khai mới thành công**
```
Input: Kê khai có 10 người, chọn 2 người
Expected: 
- Kê khai mới có 2 người
- Kê khai gốc còn 8 người
- Thông báo thành công
```

### **Test 2: Validation lỗi**
```
Input: Chọn 0 người
Expected: Thông báo "Chưa chọn người tham gia nào"
```

### **Test 3: Database consistency**
```
Input: Tạo kê khai mới
Expected:
- ke_khai_id được cập nhật đúng
- Không có participants bị mất
- Tổng số participants không đổi
```

### **Test 4: UI simplification**
```
Input: Chọn participants và xem bulk actions
Expected:
- Chỉ hiển thị 2 nút: "Tạo kê khai mới & Nộp" và "Xóa đã chọn"
- Không có nút "Nộp đã chọn"
- Nút "Tạo kê khai mới & Nộp" có màu xanh lá
```

## **Kết luận**

Chức năng đã được đơn giản hóa hoàn toàn:
- ❌ Loại bỏ nút "Nộp đã chọn"
- ✅ Chỉ giữ nút "Tạo kê khai mới & Nộp"
- ✅ Workflow rõ ràng: chọn → tạo kê khai mới → nộp → thanh toán
- ✅ UI sạch sẽ, không gây nhầm lẫn

Chức năng đã sẵn sàng để test và sử dụng! 🎉
