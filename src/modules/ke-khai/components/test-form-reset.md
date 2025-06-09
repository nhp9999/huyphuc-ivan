# Test Form Reset Issue

## Vấn đề
1. Khi nhập mã số BHXH khác nhau và bấm "Ghi dữ liệu", tất cả participants đều có cùng mã số BHXH
2. Khi tìm kiếm mã số BHXH thứ 2, thông tin của người tham gia thứ 1 bị thay đổi theo

## Nguyên nhân
1. **Form Reset Issue**: `resetForm()` trong `useKeKhai603FormData` sử dụng reference đến cùng một object `initialFormData`
2. **Participant Update Issue**: Hàm `handleSearch()` tự động cập nhật thông tin của participant đầu tiên (index 0) khi tìm kiếm từ form chính

## Giải pháp đã áp dụng
1. **Sửa `resetForm()` function**: Tạo object mới mỗi lần reset thay vì sử dụng reference cũ
2. **Loại bỏ auto-update participant**: Xóa code tự động cập nhật participant đầu tiên trong `handleSearch()`
3. **Thêm debug logging**: Theo dõi việc reset form và thay đổi maSoBHXH

## Cách test
1. Nhập mã số BHXH đầu tiên (ví dụ: 0123456789)
2. Bấm tìm kiếm
3. Bấm "Ghi dữ liệu"
4. Kiểm tra console logs để xem form có được reset không
5. Nhập mã số BHXH thứ hai (ví dụ: 9874561230)
6. Bấm tìm kiếm
7. Bấm "Ghi dữ liệu"
8. Kiểm tra trong bảng participants - hai người phải có mã số BHXH khác nhau

## Debug logs cần chú ý
- `🔄 Resetting form after successful save...`
- `🔍 DEBUG: Form data before reset:`
- `🔍 DEBUG: Form data after reset (async check):`
- `🔍 DEBUG: maSoBHXH change detected:`
- `✅ Form reset completed with fresh data`

## Kết quả mong đợi
1. Mỗi participant sẽ có mã số BHXH riêng biệt theo đúng thứ tự nhập
2. Khi tìm kiếm mã số BHXH từ form chính, chỉ form được cập nhật, không ảnh hưởng đến participants đã có trong bảng
3. Form được reset hoàn toàn sau mỗi lần lưu thành công

## Thay đổi chính
- **File**: `frontend/src/modules/ke-khai/hooks/useKeKhai603FormData.ts`
  - Sửa hàm `resetForm()` để tạo object mới thay vì dùng reference cũ
- **File**: `frontend/src/modules/ke-khai/components/KeKhai603FormContent.tsx`
  - Loại bỏ code tự động cập nhật participant đầu tiên trong `handleSearch()`
