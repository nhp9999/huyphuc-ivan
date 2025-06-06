# Tính năng Điền nhanh Mã số BHXH

## Tổng quan
Đã thêm tính năng điền nhanh mã số BHXH vào chức năng "Điền nhanh dữ liệu" trong KeKhai603ParticipantTable. Tính năng này giúp người dùng điền cùng một mã số BHXH cho nhiều người tham gia một cách nhanh chóng.

## Tính năng mới

### **Điền nhanh Mã số BHXH**
- Điền cùng một mã số BHXH cho tất cả hoặc một số người được chọn
- Validation tự động: chỉ cho phép số, tối đa 10 ký tự
- Preview mã BHXH trước khi áp dụng
- Tích hợp với hệ thống phạm vi áp dụng (tất cả/được chọn)

## Cách sử dụng

### Bước 1: Mở Điền nhanh dữ liệu
1. Trong bảng danh sách người tham gia, click nút **"Điền nhanh"** (⚡)
2. Modal "Điền nhanh dữ liệu" sẽ hiển thị

### Bước 2: Chọn trường Mã số BHXH
1. Trong phần "Chọn trường cần điền", click vào **"Mã số BHXH"** (icon #)
2. Giao diện sẽ chuyển sang chế độ nhập mã BHXH

### Bước 3: Nhập mã số BHXH
1. Nhập mã số BHXH vào ô input (tối đa 10 số)
2. Hệ thống tự động lọc chỉ cho phép số
3. Preview mã BHXH sẽ hiển thị bên dưới

### Bước 4: Chọn phạm vi áp dụng
1. **Tất cả người tham gia**: Áp dụng cho toàn bộ danh sách
2. **Chỉ những người được chọn**: Áp dụng cho những người được chọn cụ thể

### Bước 5: Áp dụng
1. Click **"Điền mã BHXH"** để áp dụng
2. Mã BHXH sẽ được điền vào tất cả người được chọn

## Giao diện người dùng

### Chọn trường
```
┌─────────────────────────────────────────┐
│ [📅] Số tháng đóng  [#] Mã số BHXH     │
│ [👥] STT hộ                             │
└─────────────────────────────────────────┘
```

### Input mã BHXH
```
┌─────────────────────────────────────────┐
│ Nhập mã số BHXH                         │
│ ┌─────────────────────────────────────┐ │
│ │ 1234567890                      [#] │ │
│ └─────────────────────────────────────┘ │
│ 💡 Mã BHXH sẽ được điền cho tất cả      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ # Mã BHXH: 1234567890               │ │
│ │ 10/10 ký tự                         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Validation và Quy tắc

### Input Validation
- **Chỉ cho phép số**: Tự động loại bỏ ký tự không phải số
- **Tối đa 10 ký tự**: Giới hạn độ dài theo quy định BHXH
- **Real-time validation**: Validation ngay khi người dùng nhập

### Quy tắc áp dụng
- **Tất cả**: Áp dụng cho toàn bộ danh sách người tham gia
- **Được chọn**: Chỉ áp dụng cho những người được chọn cụ thể
- **Ghi đè**: Mã BHXH mới sẽ ghi đè lên mã cũ (nếu có)

## Ví dụ sử dụng

### Ví dụ 1: Điền cho tất cả (5 người)
**Input:** Mã BHXH = "1234567890"
**Kết quả:**
- Người 1 → maSoBHXH: "1234567890"
- Người 2 → maSoBHXH: "1234567890"
- Người 3 → maSoBHXH: "1234567890"
- Người 4 → maSoBHXH: "1234567890"
- Người 5 → maSoBHXH: "1234567890"

### Ví dụ 2: Điền cho người được chọn (chọn người 2, 4)
**Input:** Mã BHXH = "9876543210", chọn người 2 và 4
**Kết quả:**
- Người 1 → maSoBHXH: (không thay đổi)
- Người 2 → maSoBHXH: "9876543210"
- Người 3 → maSoBHXH: (không thay đổi)
- Người 4 → maSoBHXH: "9876543210"
- Người 5 → maSoBHXH: (không thay đổi)

### Ví dụ 3: Validation input
**Input:** "abc123def456ghi789"
**Kết quả:** "1234567890" (chỉ giữ lại số, tối đa 10 ký tự)

## Tích hợp với các tính năng khác

### Với STT hộ và Số tháng đóng
- Có thể sử dụng kết hợp với điền nhanh STT hộ và số tháng đóng
- Mỗi lần chỉ điền được một loại field
- Có thể thực hiện nhiều lần điền nhanh liên tiếp

### Với Nhập hộ gia đình
- Tính năng "Nhập hộ gia đình" đã tự động điền mã BHXH
- Tính năng "Điền nhanh" có thể dùng để điều chỉnh lại sau khi nhập

### Với BHXH API
- Sau khi điền mã BHXH, có thể sử dụng Enter để tra cứu thông tin
- API sẽ tự động điền các thông tin khác (họ tên, ngày sinh, v.v.)

## Lợi ích

### Tiết kiệm thời gian
- Không cần điền từng mã BHXH một cách thủ công
- Đặc biệt hữu ích khi có nhiều người cùng mã BHXH (gia đình)

### Giảm lỗi
- Validation tự động tránh nhập sai format
- Giảm thiểu lỗi đánh máy

### Linh hoạt
- Có thể áp dụng cho tất cả hoặc chỉ những người được chọn
- Tích hợp tốt với workflow hiện tại

## Technical Implementation

### Files đã thay đổi
1. **`QuickFillModal.tsx`**
   - Thêm field selection cho mã BHXH
   - Thêm input component với validation
   - Cập nhật logic apply

2. **`KeKhai603ParticipantTable.tsx`**
   - Cập nhật type cho handleQuickFill
   - Support mã BHXH trong quick fill handler

3. **`BulkInput.test.tsx`**
   - Thêm test cases cho tính năng mã BHXH

### Key Components
```typescript
// Input validation
const handleBhxhInputChange = (value: string) => {
  const formattedValue = value.replace(/\D/g, '').slice(0, 10);
  setBhxhInput(formattedValue);
};

// Apply logic
const valueToApply = selectedField === 'maSoBHXH' ? bhxhInput : selectedValue;
onApply(selectedField, valueToApply, indices);
```

## Testing

### Test Cases
1. **Render test**: Verify mã BHXH option appears
2. **Input validation**: Test number-only and length limit
3. **Apply functionality**: Test onApply is called with correct parameters
4. **UI interaction**: Test field selection and input display

### Manual Testing
1. Mở modal điền nhanh
2. Chọn "Mã số BHXH"
3. Nhập mã BHXH với ký tự hỗn hợp
4. Verify chỉ số được giữ lại
5. Chọn phạm vi áp dụng
6. Click "Điền mã BHXH"
7. Verify mã được điền đúng vào các participant

## Troubleshooting

### Vấn đề thường gặp
1. **Mã BHXH không hiển thị**: Kiểm tra console log để debug
2. **Validation không hoạt động**: Verify handleBhxhInputChange function
3. **Apply không hoạt động**: Kiểm tra onApply callback

### Debug
- Mở Console để xem log quá trình điền mã BHXH
- Kiểm tra state của participants sau khi áp dụng
- Verify input validation logic

## Future Enhancements

### Tính năng có thể thêm
1. **Bulk BHXH input**: Nhập nhiều mã BHXH cùng lúc (mỗi dòng một mã)
2. **BHXH history**: Lưu lại các mã BHXH đã sử dụng gần đây
3. **Auto-complete**: Gợi ý mã BHXH dựa trên lịch sử
4. **Validation nâng cao**: Kiểm tra format mã BHXH theo quy định

### Performance
- Debounce input validation để giảm re-renders
- Optimize cho danh sách lớn (>100 người)

Tính năng **"Điền nhanh Mã số BHXH"** đã sẵn sàng sử dụng! 🎉
