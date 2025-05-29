# Phân tích Response API Kê khai BHYT

## Tổng quan

API kê khai BHYT trả về thông tin chi tiết về người tham gia bảo hiểm y tế, bao gồm thông tin cá nhân, địa chỉ, thông tin thẻ BHYT và các thông số đóng phí.

## Cấu trúc Response

```json
{
    "data": {
        // Dữ liệu chi tiết BHYT
    },
    "success": true,
    "message": null,
    "errors": null,
    "status": 200,
    "traceId": "00-1ee3c5ac-ecf5-422d-9fd1-9ecf1c242a04-00"
}
```

## Phân tích chi tiết các trường dữ liệu

### 1. Thông tin cá nhân cơ bản

| Trường | Giá trị mẫu | Ý nghĩa |
|--------|-------------|---------|
| `maSoBHXH` | "0123456789" | Mã số bảo hiểm xã hội |
| `hoTen` | "Trần Đình Liệu" | Họ và tên đầy đủ |
| `soDienThoai` | "0978060666" | Số điện thoại liên lạc |
| `ccns` | "0" | Căn cước công dân số (có thể là flag) |
| `ngaySinh` | "12/05/1966" | Ngày sinh (format DD/MM/YYYY) |
| `gioiTinh` | 1 | Giới tính (1=Nam, 0=Nữ) |
| `quocTich` | "VN" | Mã quốc tịch (VN = Việt Nam) |
| `danToc` | "01" | Mã dân tộc (01 = Kinh) |
| `cmnd` | "030066000049" | Số CMND/CCCD |

### 2. Địa chỉ khai sinh (KS)

| Trường | Giá trị mẫu | Ý nghĩa |
|--------|-------------|---------|
| `maTinhKS` | "30" | Mã tỉnh nơi khai sinh |
| `maHuyenKS` | "288" | Mã huyện nơi khai sinh |
| `maXaKS` | "10516" | Mã xã/phường nơi khai sinh |

### 3. Địa chỉ nhận kết quả (NKQ)

| Trường | Giá trị mẫu | Ý nghĩa |
|--------|-------------|---------|
| `maTinhNkq` | "01" | Mã tỉnh nhận kết quả |
| `maHuyenNkq` | "001" | Mã huyện nhận kết quả |
| `maXaNkq` | "00028" | Mã xã/phường nhận kết quả |

### 4. Thông tin BHYT

| Trường | Giá trị mẫu | Ý nghĩa |
|--------|-------------|---------|
| `soTheBHYT` | "HC4010123456789" | Số thẻ bảo hiểm y tế |
| `tuNgayTheCu` | "01/01/2025" | Ngày bắt đầu hiệu lực thẻ cũ |
| `denNgayTheCu` | "31/12/2025" | Ngày hết hạn thẻ cũ |
| `typeId` | "HC" | Loại đối tượng BHYT |
| `phuongAn` | "ON" | Phương án tham gia (ON/OFF) |
| `tinhKCB` | "01" | Mã tỉnh khám chữa bệnh ban đầu |
| `maBenhVien` | "075" | Mã bệnh viện đăng ký KCB |
| `noiNhanHoSo` | "68" | Mã nơi nhận hồ sơ |
| `maHoGiaDinh` | "3099313370" | Mã hộ gia đình |

### 5. Thông tin đóng phí

| Trường | Giá trị mẫu | Ý nghĩa |
|--------|-------------|---------|
| `mucLuongNsTw` | 0.0 | Mức lương ngân sách trung ương |
| `tyLeNsdp` | 0.0 | Tỷ lệ đóng ngân sách địa phương (%) |
| `tienNsdp` | 0.0 | Số tiền ngân sách địa phương |
| `tyLeNsKhac` | 0.0 | Tỷ lệ đóng nguồn khác (%) |
| `tienNsKhac` | 0.0 | Số tiền nguồn khác |
| `tyLeNsnn` | 0.0 | Tỷ lệ đóng ngân sách nhà nước (%) |
| `tyLeNsTw` | 0.0 | Tỷ lệ đóng ngân sách trung ương (%) |

### 6. Trạng thái và thông báo

| Trường | Giá trị mẫu | Ý nghĩa |
|--------|-------------|---------|
| `trangThai` | "00" | Mã trạng thái (00 = hợp lệ) |
| `maLoi` | "17" | Mã thông báo/lỗi (17 = thành công) |
| `moTa` | "Thẻ hợp lệ" | Mô tả trạng thái bằng tiếng Việt |
| `giaHanThe` | 1 | Có thể gia hạn thẻ (1=có, 0=không) |
| `isThamGiaBb` | 1 | Đang tham gia bảo hiểm (1=có, 0=không) |

## Các loại đối tượng BHYT (typeId)

| Mã | Ý nghĩa |
|----|---------|
| HC | Hộ gia đình |
| GD | Gia đình |
| HS | Học sinh |
| SV | Sinh viên |
| TE | Trẻ em |
| ... | Các loại khác |

## Mã trạng thái thường gặp

| Mã | Ý nghĩa |
|----|---------|
| 00 | Thẻ hợp lệ |
| 01 | Thẻ hết hạn |
| 02 | Thẻ chưa có hiệu lực |
| 03 | Thẻ bị khóa |
| ... | Các trạng thái khác |

## Xử lý dữ liệu trong code

### 1. Chuyển đổi format ngày tháng
```typescript
// API trả về: "12/05/1966" (DD/MM/YYYY)
// Cần convert sang: "1966-05-12" (YYYY-MM-DD) cho date input
convertDateFormat(apiDate: string): string {
  const [day, month, year] = apiDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
```

### 2. Chuyển đổi giới tính
```typescript
// API trả về: 1 (number)
// Hiển thị: "Nam" (string)
gioiTinh: apiResponse.data.gioiTinh === 1 ? 'Nam' : 'Nữ'
```

### 3. Xây dựng địa chỉ
```typescript
buildAddress(data: BhytDeclarationApiData): string {
  // Có thể kết hợp các mã tỉnh/huyện/xã để tạo địa chỉ đầy đủ
  return `${data.maTinhKS}-${data.maHuyenKS}-${data.maXaKS}`;
}
```

## Lưu ý quan trọng

1. **Format dữ liệu**: API trả về ngày tháng theo format DD/MM/YYYY, cần convert khi sử dụng
2. **Giá trị số**: Nhiều trường tỷ lệ và tiền = 0.0 có thể do loại đối tượng đặc biệt
3. **Mã địa danh**: Cần có bảng mapping để convert mã tỉnh/huyện/xã sang tên
4. **Validation**: Kiểm tra `success`, `maLoi`, và `moTa` để xác định trạng thái
5. **TraceId**: Sử dụng để tracking và debug khi có vấn đề

## Ví dụ response thành công

```json
{
    "data": {
        "maSoBHXH": "0123456789",
        "hoTen": "Trần Đình Liệu",
        "soDienThoai": "0978060666",
        "ngaySinh": "12/05/1966",
        "gioiTinh": 1,
        "soTheBHYT": "HC4010123456789",
        "tuNgayTheCu": "01/01/2025",
        "denNgayTheCu": "31/12/2025",
        "typeId": "HC",
        "trangThai": "00",
        "maLoi": "17",
        "moTa": "Thẻ hợp lệ"
    },
    "success": true,
    "status": 200,
    "traceId": "00-1ee3c5ac-ecf5-422d-9fd1-9ecf1c242a04-00"
}
```
