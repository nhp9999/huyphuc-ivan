# Hướng dẫn sử dụng tính năng tra cứu hàng loạt BHYT

## Tổng quan

Tính năng tra cứu hàng loạt cho phép bạn tra cứu thông tin BHYT của nhiều mã số cùng lúc, tiết kiệm thời gian và công sức.

## Cách sử dụng

### 1. Truy cập tính năng
- Đăng nhập vào hệ thống
- Click menu "Tra cứu BHYT"
- Chuyển sang tab "Tra cứu hàng loạt"

### 2. Nhập dữ liệu

#### Cách 1: Nhập thủ công
```
0123456789
0123456788
0123456787
1234567890
```

#### Cách 2: Sử dụng dấu phẩy
```
0123456789, 0123456788, 0123456787, 1234567890
```

#### Cách 3: Sử dụng dữ liệu mẫu
- Click nút "Dữ liệu mẫu" để tự động điền

### 3. Thực hiện tra cứu
- Click "Tra cứu hàng loạt"
- Theo dõi progress bar
- Chờ kết quả

## Tính năng

### ✅ Nhập linh hoạt
- Hỗ trợ xuống dòng, dấu phẩy, chấm phẩy, khoảng trắng
- Tự động lọc và validate mã số
- Tối đa 100 mã số mỗi lần

### ✅ Progress tracking
- Hiển thị tiến trình real-time
- Hiển thị mã số đang được tra cứu
- Phần trăm hoàn thành

### ✅ Kết quả chi tiết
- Bảng kết quả với đầy đủ thông tin
- Thống kê tổng quan (tổng số, thành công, thất bại)
- Trạng thái từng mã số

### ✅ Export & Copy
- Xuất kết quả ra file CSV
- Copy kết quả vào clipboard
- Định dạng dễ đọc

## Giới hạn

- **Số lượng**: Tối đa 100 mã số mỗi lần tra cứu
- **Định dạng**: Chỉ chấp nhận mã số 10 chữ số
- **Tốc độ**: Có delay 0.5s giữa các request để tránh rate limiting

## Mã số test

Để test tính năng, sử dụng các mã số sau:

### Có dữ liệu (thành công)
- `0123456789` - NGUYỄN VĂN A
- `0123456788` - TRẦN THỊ B  
- `0123456787` - LÊ VĂN C

### Không có dữ liệu (thất bại)
- `1234567890`
- `9876543210`
- `5555555555`

## Định dạng file CSV xuất ra

```csv
"Mã số BHXH","Trạng thái","Họ tên","Ngày sinh","Giới tính","Địa chỉ","Nơi đăng ký KCB","Trạng thái thẻ","Mức hưởng","Ghi chú"
"0123456789","Thành công","NGUYỄN VĂN A","01/01/1990","Nam","123 Đường ABC...","Bệnh viện Chợ Rẫy","Còn hiệu lực","80%","Tra cứu thành công"
"1234567890","Thất bại","","","","","","","","Không tìm thấy thông tin thẻ BHYT với mã số này"
```

## Tips sử dụng

### 1. Chuẩn bị dữ liệu
- Sắp xếp mã số theo thứ tự
- Loại bỏ mã số trùng lặp
- Kiểm tra định dạng trước khi nhập

### 2. Tối ưu hiệu suất
- Chia nhỏ nếu có quá nhiều mã số
- Tra cứu vào giờ ít tải
- Kiểm tra kết nối internet

### 3. Xử lý kết quả
- Xuất CSV để lưu trữ lâu dài
- Copy để dán vào Excel/Google Sheets
- Kiểm tra các mã số thất bại

## Xử lý lỗi

### Lỗi thường gặp

#### "Không tìm thấy mã số BHXH hợp lệ nào"
- Kiểm tra định dạng mã số (10 chữ số)
- Loại bỏ ký tự đặc biệt
- Đảm bảo có ít nhất 1 mã số hợp lệ

#### "Tối đa 100 mã số mỗi lần tra cứu"
- Chia nhỏ danh sách
- Tra cứu từng batch

#### "Có lỗi xảy ra khi tra cứu"
- Kiểm tra kết nối internet
- Thử lại sau vài phút
- Liên hệ admin nếu lỗi tiếp tục

## API Integration

Khi chuyển sang API thật, cần lưu ý:

### Rate Limiting
- API có thể giới hạn số request/phút
- Tăng delay giữa các request nếu cần
- Monitor response time

### Error Handling
- Xử lý timeout
- Retry logic cho failed requests
- Logging chi tiết

### Performance
- Batch requests nếu API hỗ trợ
- Caching kết quả
- Parallel processing (nếu cho phép)

## Troubleshooting

### Performance Issues
1. Giảm số lượng mã số mỗi batch
2. Tăng delay giữa requests
3. Kiểm tra network latency

### Memory Issues
1. Clear kết quả cũ trước khi tra cứu mới
2. Không giữ quá nhiều kết quả trong memory
3. Export và clear định kỳ

### UI Issues
1. Refresh trang nếu UI bị lag
2. Kiểm tra browser console cho errors
3. Disable browser extensions nếu cần

## Best Practices

1. **Backup dữ liệu**: Luôn backup danh sách mã số trước khi tra cứu
2. **Validate input**: Kiểm tra dữ liệu trước khi submit
3. **Monitor progress**: Theo dõi progress để phát hiện issues sớm
4. **Save results**: Export kết quả ngay sau khi hoàn thành
5. **Error handling**: Ghi chú các mã số lỗi để tra cứu lại sau
