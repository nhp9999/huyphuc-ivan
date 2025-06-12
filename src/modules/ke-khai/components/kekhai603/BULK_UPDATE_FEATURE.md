# Tính năng Cập nhật Hàng loạt (Bulk Update)

## Tổng quan

Tính năng cập nhật hàng loạt cho phép người dùng cập nhật thông tin cho nhiều người tham gia cùng lúc trong form KeKhai603. Điều này giúp tiết kiệm thời gian khi cần thay đổi thông tin chung như bệnh viện, số tháng đóng, địa chỉ, v.v.

## Các thành phần chính

### 1. BulkUpdateModal.tsx
- **Mô tả**: Modal component cho phép người dùng chọn các trường cần cập nhật và nhập giá trị mới
- **Tính năng**:
  - Checkbox để chọn các trường cần cập nhật
  - Form inputs cho từng loại dữ liệu
  - Preview trước khi thực hiện cập nhật
  - Validation dữ liệu đầu vào
  - Hỗ trợ cascading dropdowns cho địa chỉ

### 2. Hook useKeKhai603Participants
- **Function mới**: `bulkUpdateParticipants`
- **Chức năng**:
  - Nhận danh sách indices của participants được chọn
  - Nhận dữ liệu cập nhật với các trường được chọn
  - Thực hiện cập nhật database cho từng participant
  - Tự động tính toán lại số tiền và ngày thẻ khi cần
  - Cập nhật local state sau khi thành công

### 3. KeKhai603ParticipantTable.tsx
- **Thêm nút**: "Cập nhật hàng loạt" trong phần header
- **Điều kiện hiển thị**: Chỉ hiện khi có ít nhất 1 participant được chọn
- **Prop mới**: `onBulkUpdateParticipants`

### 4. KeKhai603FormContent.tsx
- **State mới**:
  - `showBulkUpdateModal`: Điều khiển hiển thị modal
  - `bulkUpdateSelectedIndices`: Lưu danh sách indices được chọn
  - `bulkUpdating`: Trạng thái đang cập nhật
- **Handlers mới**:
  - `handleBulkUpdateParticipants`: Mở modal với indices được chọn
  - `handleBulkUpdateSubmit`: Xử lý submit form cập nhật
  - `handleBulkUpdateModalClose`: Đóng modal

## Các trường hỗ trợ cập nhật

1. **Bệnh viện/Nơi KCB**
   - Dropdown với danh sách bệnh viện
   - Tự động cập nhật tên bệnh viện và mã tỉnh

2. **Số tháng đóng**
   - Dropdown: 3, 6, 12 tháng
   - Tự động tính lại số tiền đóng và ngày thẻ

3. **Địa chỉ nơi cư trú**
   - Tỉnh, Huyện, Xã
   - Cascading dropdowns (chọn tỉnh → load huyện → load xã)

4. **Thông tin cá nhân**
   - Giới tính: Nam/Nữ
   - Quốc tịch: Text input

## Quy trình sử dụng

1. **Chọn participants**: Tick checkbox các người tham gia cần cập nhật
2. **Mở modal**: Click nút "Cập nhật hàng loạt"
3. **Chọn trường**: Tick checkbox các trường muốn cập nhật
4. **Nhập giá trị**: Điền giá trị mới cho các trường đã chọn
5. **Xem trước**: Click "Xem trước" để kiểm tra
6. **Thực hiện**: Click "Cập nhật X người" để áp dụng

## Validation và Error Handling

### Validation
- Phải chọn ít nhất 1 trường để cập nhật
- Phải chọn ít nhất 1 participant
- Cascading validation cho địa chỉ (phải chọn tỉnh trước khi chọn huyện)

### Error Handling
- Hiển thị lỗi chi tiết cho từng participant nếu cập nhật thất bại
- Thống kê số lượng thành công/thất bại
- Rollback local state nếu có lỗi

## Tính năng nâng cao

### Auto-calculation
- **Số tiền đóng**: Tự động tính lại khi thay đổi số tháng đóng
- **Ngày thẻ**: Tự động tính lại thời hạn thẻ mới

### Performance
- Batch update trong database
- Optimistic UI updates
- Loading states cho UX tốt hơn

### UX/UI
- Preview trước khi thực hiện
- Progress indication
- Clear error messages
- Responsive design

## Cấu trúc dữ liệu

```typescript
interface BulkUpdateData {
  updateFields: {
    maBenhVien?: boolean;
    soThangDong?: boolean;
    maTinhNkq?: boolean;
    maHuyenNkq?: boolean;
    maXaNkq?: boolean;
    gioiTinh?: boolean;
    quocTich?: boolean;
  };
  values: {
    maBenhVien?: string;
    tenBenhVien?: string;
    maTinh?: string;
    soThangDong?: string;
    maTinhNkq?: string;
    maHuyenNkq?: string;
    maXaNkq?: string;
    gioiTinh?: string;
    quocTich?: string;
  };
}
```

## Testing

### Test Cases
1. Cập nhật 1 trường cho nhiều người
2. Cập nhật nhiều trường cho nhiều người
3. Validation errors
4. Database errors
5. Cascading dropdown behavior
6. Auto-calculation accuracy

### Manual Testing
1. Chọn 2-3 participants
2. Thử cập nhật bệnh viện → kiểm tra tên bệnh viện được cập nhật
3. Thử cập nhật số tháng → kiểm tra số tiền được tính lại
4. Thử cập nhật địa chỉ → kiểm tra cascading dropdowns
5. Test validation errors
6. Test với dữ liệu edge cases

## Lưu ý kỹ thuật

- Component sử dụng React hooks và functional components
- State management với useState
- Error boundaries để handle unexpected errors
- TypeScript interfaces cho type safety
- Responsive design với Tailwind CSS
- Accessibility support với proper ARIA labels

## Tương lai

Có thể mở rộng thêm:
- Cập nhật từ file Excel
- Undo/Redo functionality
- Bulk validation rules
- Advanced filtering
- Export/Import templates
