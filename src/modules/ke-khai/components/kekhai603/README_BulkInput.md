# Tính năng Nhập hàng loạt và Điền nhanh (KeKhai603ParticipantTable - REMOVED)

## Tổng quan

Đã thêm hai tính năng mới để cải thiện trải nghiệm nhập liệu:

1. **Nhập hàng loạt (Bulk Input)**: Cho phép nhập nhiều mã BHXH cùng lúc
2. **Điền nhanh (Quick Fill)**: Cho phép điền nhanh số tháng đóng hoặc STT hộ cho nhiều người

## Tính năng Nhập hàng loạt

### Cách sử dụng:
1. Nhấn nút "Nhập hàng loạt" (màu tím) trong header của bảng
2. **Copy từ Excel** hoặc nhập dữ liệu thủ công

#### 🔥 Hỗ trợ Copy trực tiếp từ Excel:
- **Chuẩn bị Excel**: Cột A: Mã BHXH, Cột B: Số tháng, Cột C: STT hộ
- **Copy & Paste**: Chọn vùng dữ liệu trong Excel → Ctrl+C → Paste vào modal
- **Tự động phát hiện**: Hệ thống tự động nhận diện định dạng Excel (Tab-separated)

#### Định dạng hỗ trợ:
- **Excel (Tab-separated)**: `0123456789	12	1` (khuyến nghị)
- **Comma-separated**: `0123456789,12,1`
- **Space-separated**: `0123456789 12 1`
- **Chỉ mã BHXH**: `0123456789`

#### Ví dụ dữ liệu Excel:
| Mã BHXH | Số tháng | STT hộ |
|---------|----------|--------|
| 0123456789 | 12 | 1 |
| 0123456788 | 6 | 2 |
| 0123456787 | 3 | 1 |

#### Ví dụ dữ liệu nhập thủ công:
```
0123456789	12	1
0123456788	6	2
0123456787	3	1
1234567890	12
9876543210	6	3
```

#### Quy tắc:
- Mã BHXH phải có đúng 10 chữ số
- Số tháng hợp lệ: 3, 6, 12
- STT hộ hợp lệ: 1, 2, 3, 4, 5+
- Đối với đối tượng DS (dân tộc), STT hộ sẽ tự động được đặt là "1" và không cho phép chỉnh sửa
- Ngăn cách bằng dấu phẩy, khoảng trắng hoặc tab
- Mỗi dòng một bản ghi

### Tính năng:
- ✅ **Copy trực tiếp từ Excel** - Hỗ trợ Tab-separated format
- ✅ **Tự động phát hiện định dạng** - Hiển thị loại định dạng được nhận diện
- ✅ **Xem trước dữ liệu** trước khi thêm
- ✅ **Validation thông minh** - Kiểm tra và hiển thị lỗi chi tiết
- ✅ **Hỗ trợ dữ liệu mẫu** - Định dạng Excel chuẩn
- ✅ **Tự động điều chỉnh** theo đối tượng tham gia (DS/không DS)
- ✅ **Xử lý linh hoạt** - Loại bỏ ký tự thừa, dòng trống

## Tính năng Điền nhanh

### Cách sử dụng:
1. Nhấn nút "Điền nhanh" (màu xanh lá) trong header của bảng
2. Chọn trường cần điền: "Số tháng đóng" hoặc "STT hộ"
3. Chọn giá trị muốn điền
4. Chọn áp dụng cho: "Tất cả người tham gia" hoặc "Chỉ những người được chọn"

### Tính năng:
- ✅ Điền nhanh số tháng đóng (3, 6, 12 tháng)
- ✅ Điền nhanh STT hộ (1, 2, 3, 4, 5+)
- ✅ Áp dụng cho tất cả hoặc chọn lọc người tham gia
- ✅ Giao diện chọn người tham gia trực quan
- ✅ Tự động vô hiệu hóa STT hộ cho đối tượng DS

## Cải tiến giao diện

### Header mới:
- **Thêm người** (màu xanh dương): Thêm từng người một
- **Nhập hàng loạt** (màu tím): Nhập nhiều mã BHXH cùng lúc  
- **Điền nhanh** (màu xanh lá): Điền nhanh dữ liệu cho nhiều người

### Responsive design:
- Các nút được sắp xếp hợp lý trên desktop
- Tự động điều chỉnh trên mobile
- Tooltip hướng dẫn cho từng nút

## Lưu ý kỹ thuật

### Components mới:
- `BulkInputModal.tsx`: Modal nhập hàng loạt
- `QuickFillModal.tsx`: Modal điền nhanh

### Props mới:
- `onBulkAdd?: (participants: any[]) => void`: Callback cho bulk add

### State mới:
- `showBulkInputModal`: Điều khiển hiển thị modal nhập hàng loạt
- `showQuickFillModal`: Điều khiển hiển thị modal điền nhanh

### Functions mới:
- `handleBulkInput()`: Xử lý dữ liệu nhập hàng loạt
- `handleQuickFill()`: Xử lý điền nhanh dữ liệu

## Tương thích

- ✅ Tương thích với logic hiện tại
- ✅ Không ảnh hưởng đến các tính năng cũ
- ✅ Hỗ trợ cả đối tượng DS và không DS
- ✅ Tích hợp với validation và auto-save hiện có

## Hướng dẫn sử dụng cho người dùng cuối

### Nhập hàng loạt:
1. Chuẩn bị danh sách mã BHXH trong Excel hoặc text file
2. Copy dữ liệu và paste vào modal "Nhập hàng loạt"
3. Xem trước và xác nhận
4. Hệ thống sẽ tự động thêm các người tham gia mới

### Điền nhanh:
1. Sau khi đã có danh sách người tham gia
2. Sử dụng "Điền nhanh" để đặt số tháng đóng hoặc STT hộ cho nhiều người cùng lúc
3. Tiết kiệm thời gian so với việc điền từng ô một

## Ví dụ workflow hoàn chỉnh:

### Workflow 1: Copy từ Excel (Khuyến nghị)
1. **Chuẩn bị Excel**:
   | Mã BHXH | Số tháng | STT hộ |
   |---------|----------|--------|
   | 0123456789 | 12 | 1 |
   | 0123456788 | 6 | 2 |
   | 0123456787 | 3 | 1 |

2. **Copy & Paste**: Chọn vùng dữ liệu → Ctrl+C → Paste vào modal
3. **Kiểm tra**: Xem thông báo "Đã phát hiện định dạng: Excel (Tab-separated)"
4. **Xem trước**: Nhấn "Xem trước" để kiểm tra dữ liệu
5. **Submit**: Nhấn "Thêm X người tham gia"

### Workflow 2: Nhập thủ công + Điền nhanh
1. **Nhập hàng loạt mã BHXH**:
   ```
   0123456789
   0123456788
   0123456787
   ```

2. **Điền nhanh số tháng** cho tất cả thành 12 tháng
3. **Điền nhanh STT hộ** cho một số người được chọn
4. **Lưu dữ liệu** như bình thường

## Lưu ý quan trọng
- 📋 **Excel là cách nhanh nhất**: Copy trực tiếp từ Excel tiết kiệm thời gian nhất
- 🔍 **Luôn xem trước**: Đảm bảo dữ liệu đúng trước khi submit
- 📊 **Chuẩn bị Excel tốt**: Định dạng cột đúng sẽ giảm thiểu lỗi
- 🎯 **Kết hợp với Điền nhanh**: Sử dụng cả hai tính năng để tối ưu workflow
