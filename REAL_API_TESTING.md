# Hướng dẫn test với API thật VNPost

## ✅ Trạng thái hiện tại

Ứng dụng đã được cập nhật để xử lý đúng format response từ API VNPost thật.

### Cập nhật mới nhất:

1. **Thêm VnPostBhytData interface** - Định nghĩa đúng cấu trúc response từ API
2. **Thêm VnPostApiResponse interface** - Wrapper response từ VNPost
3. **Thêm convertVnPostToBhytInfo()** - Convert từ format VNPost sang format UI
4. **Cập nhật lookupBhytInfo()** - Xử lý response mới

## 📊 Sample Response từ VNPost API

```json
{
    "data": {
        "tuNgayDt": "2025-01-01T00:00:00",
        "denNgayDt": "2025-12-31T00:00:00",
        "ngaySinhHienThi": "12/05/1966",
        "maKCB": "HC",
        "gioiTinhHienThi": "Nam",
        "quocTichHienThi": "Việt Nam",
        "danTocHienThi": "Kinh",
        "trangThaiThe": "Thẻ hợp lệ",
        "tenTinhKCB": "Thành phố Hà Nội",
        "coSoKCB": "075 - Bệnh viện Tim Hà Nội (Cơ sở 2)",
        "maSoBhxh": "0123456789",
        "soTheBhyt": "HC4010123456789",
        "hoTen": "Trần Đình Liệu",
        "tyLeBhyt": 4.5,
        "mucLuongTt": 2340000.0,
        "tenDvi": "Bảo hiểm xã hội Việt Nam",
        "tenBenhVien": "Bệnh viện Tim Hà Nội (Cơ sở 2)"
    },
    "success": true,
    "message": null,
    "status": 200
}
```

## 🔄 Data Mapping

Ứng dụng sẽ convert từ format VNPost sang format UI như sau:

| VNPost Field | UI Field | Conversion |
|--------------|----------|------------|
| `maSoBhxh` | `maSoBHXH` | Direct |
| `hoTen` | `hoTen` | Direct |
| `ngaySinhHienThi` | `ngaySinh` | Direct (đã format DD/MM/YYYY) |
| `gioiTinhHienThi` | `gioiTinh` | Direct |
| `diaChiLh + tenTinhKCB` | `diaChi` | Concatenate |
| `coSoKCB` | `noiDangKyKCB` | Direct |
| `trangThaiThe` | `trangThaiThe` | Direct |
| `tuNgay` | `ngayHieuLuc` | Format YYYYMMDD → DD/MM/YYYY |
| `denNgay` | `ngayHetHan` | Format YYYYMMDD → DD/MM/YYYY |
| `tyLeBhyt` | `mucHuong` | Calculate: `tyLeBhyt * 20%` |
| `tenDvi` | `donViCongTac` | Direct |
| `maTinhKcb` | `maKV` | Direct |
| `tenTinhKCB` | `tenKV` | Direct |

## 🧪 Cách test

### 1. Tra cứu đơn lẻ
1. Mở http://localhost:5173/
2. Đăng nhập: `admin@example.com` / `password`
3. Click "Tra cứu BHYT" → tab "Tra cứu đơn lẻ"
4. Nhập mã số BHXH thực (ví dụ: `0123456789`)
5. Click "Tra cứu"
6. Kiểm tra kết quả hiển thị

### 2. Tra cứu hàng loạt
1. Chuyển sang tab "Tra cứu hàng loạt"
2. Nhập danh sách mã số BHXH thực:
   ```
   0123456789
   0987654321
   1234567890
   ```
3. Click "Tra cứu hàng loạt"
4. Xem progress bar
5. Kiểm tra bảng kết quả
6. Test "Xuất CSV" và "Copy"

## 🔍 Kiểm tra dữ liệu

### Thông tin cơ bản
- ✅ Mã số BHXH hiển thị đúng
- ✅ Họ tên hiển thị đúng
- ✅ Ngày sinh format DD/MM/YYYY
- ✅ Giới tính hiển thị đúng

### Thông tin thẻ
- ✅ Trạng thái thẻ (Thẻ hợp lệ/Hết hạn)
- ✅ Ngày hiệu lực format DD/MM/YYYY
- ✅ Ngày hết hạn format DD/MM/YYYY
- ✅ Mức hưởng tính từ tyLeBhyt

### Thông tin địa chỉ & đơn vị
- ✅ Địa chỉ kết hợp từ diaChiLh + tenTinhKCB
- ✅ Nơi đăng ký KCB từ coSoKCB
- ✅ Đơn vị công tác từ tenDvi
- ✅ Khu vực từ tenTinhKCB

## ⚠️ Lưu ý khi test

### 1. CORS Issues
Nếu gặp lỗi CORS:
```
Access to fetch at 'https://ssm.vnpost.vn/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Giải pháp:**
- Sử dụng browser extension để disable CORS
- Hoặc test trên production server
- Hoặc cấu hình proxy trong vite.config.ts

### 2. Token Expiration
Nếu gặp lỗi 401/403:
```json
{
  "success": false,
  "message": "Unauthorized",
  "status": 401
}
```

**Giải pháp:**
- Cập nhật token mới trong `src/services/bhytService.ts`
- Liên hệ VNPost để lấy token mới

### 3. Rate Limiting
Nếu gặp lỗi 429:
```json
{
  "success": false,
  "message": "Too Many Requests",
  "status": 429
}
```

**Giải pháp:**
- Tăng delay trong bulk lookup
- Giảm số lượng request đồng thời

## 🐛 Debug

### Console Logs
Mở Developer Tools → Console để xem:
- Request URL và headers
- Response data từ API
- Error messages nếu có

### Network Tab
Kiểm tra Network tab để xem:
- HTTP status codes
- Request/response headers
- Response body

### Typical Errors

#### Network Error
```
TypeError: Failed to fetch
```
- Kiểm tra internet connection
- Kiểm tra CORS settings
- Thử với VPN khác

#### JSON Parse Error
```
SyntaxError: Unexpected token < in JSON
```
- API trả về HTML thay vì JSON
- Có thể do authentication issues
- Kiểm tra response trong Network tab

#### Empty Response
```json
{
  "data": null,
  "success": false,
  "message": "Không tìm thấy thông tin"
}
```
- Mã số BHXH không tồn tại
- Mã số không đúng format
- Thử với mã số khác

## 📈 Performance Monitoring

### Metrics to watch:
- **Response time**: < 5 seconds per request
- **Success rate**: > 80% for valid BHXH codes
- **Error rate**: < 20%
- **CORS errors**: Should be 0

### Bulk lookup performance:
- **Progress updates**: Smooth, real-time
- **Memory usage**: Stable, no leaks
- **UI responsiveness**: No freezing

## 🎯 Success Criteria

### ✅ Single Lookup
- [ ] API call successful
- [ ] Data mapping correct
- [ ] UI displays all fields
- [ ] Date formatting correct
- [ ] Error handling works

### ✅ Bulk Lookup
- [ ] Progress bar works
- [ ] All requests processed
- [ ] Results table populated
- [ ] CSV export works
- [ ] Copy function works

### ✅ Error Handling
- [ ] Network errors handled
- [ ] Invalid BHXH codes handled
- [ ] Token expiration handled
- [ ] Rate limiting handled

---

**Status**: ✅ Ready for testing with real VNPost API
**Last Updated**: 2024-01-27
**Version**: 2.0.0
