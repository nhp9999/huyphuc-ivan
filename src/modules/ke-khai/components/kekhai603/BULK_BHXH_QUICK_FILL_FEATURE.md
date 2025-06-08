# Tính năng Điền nhanh Danh sách Mã số BHXH

## Tổng quan
Đã thêm tính năng điền nhanh danh sách mã số BHXH vào QuickFillModal, cho phép người dùng nhập nhiều mã BHXH cùng lúc (mỗi dòng một mã) và tự động phân bổ cho các người tham gia theo thứ tự.

## Tính năng mới

### **Điền nhanh Danh sách Mã BHXH**
- Nhập nhiều mã BHXH cùng lúc (mỗi dòng một mã)
- Tự động phân bổ mã BHXH theo thứ tự cho người tham gia
- Validation tự động: chỉ cho phép số, tối thiểu 8 ký tự, tối đa 10 ký tự
- Preview số lượng mã BHXH hợp lệ được phát hiện
- Scrollable textarea với giới hạn chiều cao

## Cách sử dụng

### Bước 1: Mở Điền nhanh dữ liệu
1. Trong bảng danh sách người tham gia, click nút **"Điền nhanh"** (⚡)
2. Modal "Điền nhanh dữ liệu" sẽ hiển thị

### Bước 2: Chọn trường Mã số BHXH
1. Trong phần "Chọn trường cần điền", click vào **"Mã số BHXH"** (icon #)
2. Giao diện sẽ hiển thị chế độ điền mã BHXH

### Bước 3: Chọn chế độ Danh sách mã
1. Trong phần "Chế độ điền mã BHXH", click vào **"Danh sách mã"** (icon 📋)
2. Giao diện sẽ chuyển sang textarea để nhập nhiều mã

### Bước 4: Nhập danh sách mã BHXH
1. Nhập danh sách mã BHXH vào textarea (mỗi dòng một mã)
2. Hệ thống tự động validate và hiển thị số lượng mã hợp lệ
3. Preview hiển thị các mã đã được phát hiện

### Bước 5: Chọn phạm vi áp dụng
1. **Tất cả người tham gia**: Áp dụng theo thứ tự từ người đầu tiên
2. **Chỉ người chưa có thông tin**: Chỉ điền cho người chưa có mã BHXH
3. **Chỉ những người được chọn**: Áp dụng cho những người được chọn cụ thể

### Bước 6: Áp dụng
1. Click **"Điền X mã BHXH"** (X là số lượng mã hợp lệ)
2. Mã BHXH sẽ được phân bổ theo thứ tự

## Giao diện người dùng

### Chế độ selection
```
┌─────────────────────────────────────────┐
│ [#] Mã đơn lẻ        [📋] Danh sách mã  │
│     Điền cùng một mã      Nhiều mã khác │
└─────────────────────────────────────────┘
```

### Textarea input
```
┌─────────────────────────────────────────┐
│ Nhập danh sách mã số BHXH               │
│ ┌─────────────────────────────────────┐ │
│ │ 8923487321                      [📋]│ │
│ │ 8922622809                          │ │
│ │ 8923468288                          │ │
│ │ 8923406406                          │ │
│ │ 8923440017                          │ │
│ └─────────────────────────────────────┘ │
│ 💡 Mỗi dòng một mã BHXH, sẽ được phân bổ│
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📋 Đã phát hiện 5 mã BHXH hợp lệ    │ │
│ │ 8923487321, 8922622809, 8923468288  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Validation và Quy tắc

### Input Validation
- **Chỉ cho phép số**: Tự động loại bỏ ký tự không phải số
- **Tối thiểu 8 ký tự**: Mã BHXH phải có ít nhất 8 số
- **Tối đa 10 ký tự**: Giới hạn độ dài theo quy định BHXH
- **Mỗi dòng một mã**: Tách mã theo dòng mới

### Quy tắc phân bổ
- **Theo thứ tự**: Mã đầu tiên → Người đầu tiên được chọn
- **Giới hạn số lượng**: Chỉ phân bổ tối đa số mã có sẵn
- **Ưu tiên người tham gia**: Nếu có nhiều mã hơn người, chỉ dùng số mã cần thiết

## Ví dụ sử dụng

### Ví dụ 1: Điền cho tất cả (5 người, 3 mã)
**Input:**
```
8923487321
8922622809
8923468288
```
**Kết quả:**
- Người 1 → maSoBHXH: "8923487321"
- Người 2 → maSoBHXH: "8922622809"
- Người 3 → maSoBHXH: "8923468288"
- Người 4, 5 → không thay đổi

### Ví dụ 2: Điền cho người được chọn (chọn người 2, 4, 6)
**Input:** 3 mã BHXH, chọn người 2, 4, 6
**Kết quả:**
- Người 2 → maSoBHXH: mã đầu tiên
- Người 4 → maSoBHXH: mã thứ hai
- Người 6 → maSoBHXH: mã thứ ba

### Ví dụ 3: Validation input
**Input:**
```
abc8923487321def
8922622809
invalid
8923468288xyz
```
**Kết quả:** 3 mã hợp lệ: "8923487321", "8922622809", "8923468288"

## Modal Layout Improvements

### Responsive Design
- **Fixed Header**: Header luôn hiển thị ở trên
- **Scrollable Content**: Nội dung có thể cuộn khi quá dài
- **Fixed Footer**: Nút bấm luôn hiển thị ở dưới
- **Max Height**: Modal tối đa 90% viewport height

### Textarea Enhancements
- **Scrollable**: Có thanh cuộn khi nội dung dài
- **Resizable**: Có thể resize theo chiều dọc
- **Min/Max Height**: Giới hạn chiều cao 100px - 150px
- **Auto-focus**: Tự động focus khi chuyển sang bulk mode

## Technical Implementation

### Files đã thay đổi
1. **`QuickFillModal.tsx`**
   - Thêm `bhxhMode` state (single/bulk)
   - Thêm `bhxhBulkInput` state
   - Thêm `parseBulkBhxhInput` function
   - Cải thiện modal layout (fixed header/footer)
   - Thêm bulk BHXH UI components

2. **`KeKhai603ParticipantTable.tsx`** (REMOVED)
   - Component đã bị xóa khỏi codebase

### Key Functions
```typescript
// Parse bulk BHXH input
const parseBulkBhxhInput = (input: string): string[] => {
  const lines = input.split('\n').map(line => line.trim()).filter(line => line);
  const validCodes: string[] = [];
  
  for (const line of lines) {
    const cleanCode = line.replace(/\D/g, '').slice(0, 10);
    if (cleanCode.length >= 8) {
      validCodes.push(cleanCode);
    }
  }
  
  return validCodes;
};

// Handle bulk BHXH fill
const handleQuickFillBulkBHXH = (bhxhCodes: string[], selectedIndices?: number[]) => {
  const indicesToUpdate = selectedIndices || Array.from({ length: participants.length }, (_, i) => i);
  const maxUpdates = Math.min(bhxhCodes.length, indicesToUpdate.length);
  
  for (let i = 0; i < maxUpdates; i++) {
    const participantIndex = indicesToUpdate[i];
    const bhxhCode = bhxhCodes[i];
    
    if (participantIndex < participants.length && bhxhCode) {
      handleParticipantChange(participantIndex, 'maSoBHXH', bhxhCode);
    }
  }
};
```

## Lợi ích

### Hiệu quả
- Điền nhiều mã BHXH cùng lúc thay vì từng mã một
- Tự động phân bổ theo thứ tự, không cần chọn thủ công
- Copy-paste trực tiếp từ Excel hoặc file text

### Chính xác
- Validation tự động đảm bảo format đúng
- Preview trước khi áp dụng
- Không ghi đè nếu chọn "chỉ người chưa có thông tin"

### Linh hoạt
- Hỗ trợ cả single và bulk mode
- Áp dụng cho tất cả, người được chọn, hoặc người chưa có thông tin
- Responsive design phù hợp mọi kích thước màn hình

## Tích hợp với workflow

### Với tính năng hiện có
- ✅ Tương thích với "Điền nhanh STT hộ"
- ✅ Tương thích với "Điền nhanh Số tháng đóng"
- ✅ Hoạt động với "Nhập hộ gia đình"
- ✅ Tích hợp với BHXH API lookup

### Workflow đề xuất
1. **Bulk BHXH**: Điền danh sách mã BHXH
2. **API Lookup**: Enter để tra cứu thông tin từng mã
3. **STT hộ**: Điền nhanh STT hộ tự động tăng dần
4. **Số tháng**: Điền nhanh số tháng đóng

## Testing

### Manual Testing
1. Mở modal điền nhanh
2. Chọn "Mã số BHXH" → "Danh sách mã"
3. Nhập danh sách mã BHXH với format khác nhau
4. Verify validation và preview
5. Test với các phạm vi áp dụng khác nhau
6. Verify modal scrolling và responsive

### Edge Cases
- Textarea rỗng
- Chỉ có mã không hợp lệ
- Nhiều mã hơn số người tham gia
- Ít mã hơn số người tham gia
- Modal quá cao (test scrolling)

Tính năng **"Điền nhanh Danh sách Mã số BHXH"** đã sẵn sàng sử dụng với UI responsive và user-friendly! 🎉
