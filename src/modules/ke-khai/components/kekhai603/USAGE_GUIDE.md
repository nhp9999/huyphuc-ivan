# Hướng dẫn sử dụng Danh sách người tham gia KeKhai603

## Tổng quan

Tính năng "Danh sách người tham gia" đã được thêm vào form KeKhai603 để giúp bạn quản lý danh sách người tham gia một cách hiệu quả. Bây giờ bạn có thể:

- ✅ **Xem danh sách** tất cả người tham gia trong một bảng dễ đọc
- ✅ **Thêm người mới** từ form hoặc trực tiếp trong bảng
- ✅ **Chỉnh sửa thông tin** trực tiếp trong bảng
- ✅ **Tìm kiếm BHXH** để tự động điền thông tin
- ✅ **Lưu từng người** hoặc lưu tất cả cùng lúc
- ✅ **Xóa người tham gia** đơn lẻ hoặc hàng loạt

## Cách sử dụng

### 1. Thêm người tham gia mới

#### Cách 1: Từ form chính
1. **Nhập thông tin** vào form ở phần trên:
   - Mã số BHXH (bắt buộc)
   - Họ và tên (bắt buộc)
   - Nơi đăng ký KCB (bắt buộc)
   - Các thông tin khác

2. **Tìm kiếm BHXH** (tùy chọn):
   - Nhập mã số BHXH
   - Nhấn nút 🔍 hoặc phím Enter
   - Hệ thống sẽ tự động điền thông tin

3. **Lưu người tham gia**:
   - Nhấn nút **"Lưu người tham gia"** (màu tím)
   - Người mới sẽ xuất hiện trong danh sách bên dưới
   - Form sẽ được reset để nhập người tiếp theo

#### Cách 2: Từ bảng danh sách
1. Nhấn nút **"Thêm người tham gia"** (màu xanh lá) trong bảng
2. Một dòng trống sẽ được thêm vào bảng
3. Chỉnh sửa thông tin trực tiếp trong bảng
4. Nhấn nút **"Lưu"** (biểu tượng ↑) để lưu

### 2. Chỉnh sửa thông tin

1. **Chỉnh sửa trực tiếp** trong bảng:
   - Click vào ô cần sửa
   - Nhập thông tin mới
   - Thông tin sẽ được cập nhật tự động

2. **Tìm kiếm BHXH** trong bảng:
   - Nhập mã số BHXH vào cột "Mã số BHXH"
   - Nhấn nút 🔍 hoặc phím Enter
   - Thông tin sẽ được tự động điền

3. **Lưu thay đổi**:
   - Nhấn nút **"Lưu"** (biểu tượng ↑) ở cột "Thao tác"
   - Hoặc nhấn nút **"Ghi dữ liệu"** ở cuối form để lưu tất cả

### 3. Xóa người tham gia

#### Xóa từng người
1. Nhấn nút **"Xóa"** (biểu tượng 🗑️) ở cột "Thao tác"
2. Người đó sẽ bị xóa khỏi danh sách và database

#### Xóa hàng loạt
1. **Chọn người cần xóa**:
   - Tick vào checkbox ở đầu mỗi dòng
   - Hoặc tick "Select All" để chọn tất cả

2. **Xóa đã chọn**:
   - Nhấn nút **"Xóa đã chọn"** (màu đỏ)
   - Tất cả người được chọn sẽ bị xóa

### 4. Lưu dữ liệu

#### Lưu từng người
- Nhấn nút **"Lưu"** ở cột "Thao tác" của từng người

#### Lưu tất cả
- Nhấn nút **"Ghi dữ liệu"** ở cuối form
- Tất cả thay đổi sẽ được lưu vào database

## Các tính năng đặc biệt

### 1. Tự động tính toán
- **Tiền đóng**: Tự động tính khi nhập STT hộ và số tháng
- **Ngày thẻ mới**: Tự động tính dựa trên số tháng và ngày biên lai

### 2. Validation thông minh
- **Mã BHXH**: Chỉ cho phép số, tối đa 10 ký tự
- **Trường bắt buộc**: Hiển thị dấu * đỏ
- **Thông báo lỗi**: Hiển thị toast khi có lỗi

### 3. Responsive design
- **Cuộn ngang**: Bảng có thể cuộn ngang trên màn hình nhỏ
- **Cột cố định**: Độ rộng cột được tối ưu
- **Mobile friendly**: Hoạt động tốt trên điện thoại

## Lưu ý quan trọng

### ⚠️ Dữ liệu được lưu tự động
- Khi bạn nhấn **"Lưu người tham gia"** hoặc **"Lưu"**, dữ liệu sẽ được lưu ngay vào database
- Danh sách sẽ tự động refresh để hiển thị dữ liệu mới nhất

### ⚠️ STT hộ cho đối tượng DS
- Với đối tượng DS (Dân số), STT hộ sẽ tự động được set = 1
- Bạn không thể thay đổi STT hộ cho đối tượng này

### ⚠️ Tìm kiếm BHXH
- Tính năng tìm kiếm sẽ tự động điền thông tin từ hệ thống BHYT
- Thông tin cơ sở KCB sẽ được tự động match với danh sách có sẵn
- Nếu không tìm thấy, bạn cần nhập thủ công

## Khắc phục sự cố

### Vấn đề: Không thấy người vừa thêm trong danh sách
**Giải pháp**: 
- Đảm bảo đã nhấn **"Lưu người tham gia"** hoặc **"Lưu"**
- Refresh trang nếu cần thiết
- Kiểm tra console để xem có lỗi không

### Vấn đề: Tìm kiếm BHXH không hoạt động
**Giải pháp**:
- Kiểm tra kết nối internet
- Đảm bảo mã BHXH đúng định dạng (10 số)
- Kiểm tra token xác thực trong hệ thống

### Vấn đề: Không lưu được dữ liệu
**Giải pháp**:
- Kiểm tra các trường bắt buộc đã điền đầy đủ
- Đảm bảo có thông tin kê khai (tạo kê khai mới nếu cần)
- Kiểm tra quyền truy cập

## Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser (F12) để xem lỗi chi tiết
2. Thử refresh trang
3. Liên hệ team phát triển với thông tin lỗi cụ thể
