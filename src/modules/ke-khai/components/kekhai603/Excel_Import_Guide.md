# Hướng dẫn Copy dữ liệu từ Excel vào tính năng Nhập hàng loạt

## Tổng quan
Tính năng nhập hàng loạt đã được cải tiến để hỗ trợ tốt nhất việc copy dữ liệu từ Excel. Bạn có thể copy trực tiếp từ Excel và paste vào modal mà không cần chỉnh sửa gì thêm.

## Cách chuẩn bị dữ liệu trong Excel

### Định dạng cột được khuyến nghị:
| Cột A | Cột B | Cột C |
|-------|-------|-------|
| Mã BHXH | Số tháng | STT hộ |
| 0123456789 | 12 | 1 |
| 0123456788 | 6 | 2 |
| 0123456787 | 3 | 1 |

### Quy tắc dữ liệu:
- **Cột A (Mã BHXH)**: Bắt buộc, đúng 10 chữ số
- **Cột B (Số tháng)**: Tùy chọn, chỉ chấp nhận 3, 6, hoặc 12
- **Cột C (STT hộ)**: Tùy chọn, chỉ chấp nhận 1, 2, 3, 4, hoặc 5+
- **Lưu ý**: Đối với đối tượng DS (dân tộc), STT hộ sẽ tự động được đặt là "1"

## Các cách copy từ Excel

### Cách 1: Copy toàn bộ vùng dữ liệu
1. Trong Excel, chọn vùng dữ liệu từ A1 đến C4 (bao gồm cả header nếu có)
2. Nhấn `Ctrl + C` để copy
3. Mở modal "Nhập hàng loạt" trong hệ thống
4. Nhấn `Ctrl + V` vào ô textarea
5. Hệ thống sẽ tự động phát hiện định dạng "Excel (Tab-separated)"

### Cách 2: Copy từng cột
1. **Chỉ copy cột mã BHXH**: Chọn cột A, copy và paste
2. **Copy 2 cột**: Chọn cột A và B, copy và paste
3. **Copy 3 cột**: Chọn cột A, B và C, copy và paste

### Cách 3: Copy từng dòng
1. Chọn một hoặc nhiều dòng dữ liệu
2. Copy và paste vào hệ thống

## Các định dạng được hỗ trợ

### 1. Tab-separated (Excel mặc định)
```
0123456789	12	1
0123456788	6	2
0123456787	3	1
```

### 2. Comma-separated
```
0123456789,12,1
0123456788,6,2
0123456787,3,1
```

### 3. Space-separated
```
0123456789 12 1
0123456788 6 2
0123456787 3 1
```

### 4. Mixed format
```
0123456789, 12, 1
0123456788 6 2
0123456787	3	1
```

### 5. Chỉ mã BHXH
```
0123456789
0123456788
0123456787
```

## Tính năng thông minh

### Tự động phát hiện định dạng
- Hệ thống sẽ tự động phát hiện và hiển thị định dạng dữ liệu
- Thông báo màu xanh sẽ xuất hiện: "Đã phát hiện định dạng: Excel (Tab-separated)"

### Xử lý dữ liệu linh hoạt
- Tự động loại bỏ ký tự không phải số trong mã BHXH
- Bỏ qua các dòng trống
- Xử lý các ký tự khoảng trắng thừa

### Validation thông minh
- Kiểm tra mã BHXH có đúng 10 chữ số
- Kiểm tra số tháng hợp lệ (3, 6, 12)
- Kiểm tra STT hộ hợp lệ (1, 2, 3, 4, 5+)
- Hiển thị lỗi chi tiết với số dòng cụ thể

## Ví dụ thực tế

### Ví dụ 1: Dữ liệu hoàn chỉnh từ Excel
```
Mã BHXH	Số tháng	STT hộ
0123456789	12	1
0123456788	6	2
0123456787	3	1
```

### Ví dụ 2: Chỉ có mã BHXH và số tháng
```
0123456789	12
0123456788	6
0123456787	3
```

### Ví dụ 3: Chỉ có mã BHXH
```
0123456789
0123456788
0123456787
```

## Xử lý lỗi thường gặp

### Lỗi: "Mã BHXH không hợp lệ"
- **Nguyên nhân**: Mã BHXH không đúng 10 chữ số
- **Giải pháp**: Kiểm tra lại dữ liệu trong Excel, đảm bảo mã BHXH có đúng 10 chữ số

### Lỗi: "Số tháng không hợp lệ"
- **Nguyên nhân**: Số tháng không phải 3, 6, hoặc 12
- **Giải pháp**: Chỉnh sửa dữ liệu trong Excel trước khi copy

### Lỗi: "STT hộ không hợp lệ"
- **Nguyên nhân**: STT hộ không phải 1, 2, 3, 4, hoặc 5+
- **Giải pháp**: Chỉnh sửa dữ liệu trong Excel

## Tips và Tricks

### 1. Sử dụng dữ liệu mẫu
- Nhấn nút "Dữ liệu mẫu" để xem định dạng chuẩn
- Copy định dạng này vào Excel để tạo template

### 2. Xem trước trước khi submit
- Luôn sử dụng tính năng "Xem trước" để kiểm tra dữ liệu
- Đảm bảo số lượng bản ghi và dữ liệu đúng như mong muốn

### 3. Xử lý dữ liệu lớn
- Có thể nhập tối đa 100 mã BHXH mỗi lần
- Nếu có nhiều hơn, chia thành nhiều lần nhập

### 4. Backup dữ liệu
- Lưu file Excel gốc để backup
- Có thể sử dụng lại cho các lần nhập sau

## Workflow khuyến nghị

1. **Chuẩn bị dữ liệu trong Excel** theo định dạng chuẩn
2. **Copy dữ liệu** từ Excel (Ctrl+C)
3. **Mở modal nhập hàng loạt** trong hệ thống
4. **Paste dữ liệu** (Ctrl+V) vào textarea
5. **Kiểm tra thông báo định dạng** được phát hiện
6. **Nhấn "Xem trước"** để kiểm tra dữ liệu
7. **Xác nhận và submit** nếu dữ liệu đúng
8. **Sử dụng "Điền nhanh"** nếu cần điều chỉnh thêm

Với hướng dẫn này, bạn có thể dễ dàng import dữ liệu từ Excel vào hệ thống một cách nhanh chóng và chính xác!
