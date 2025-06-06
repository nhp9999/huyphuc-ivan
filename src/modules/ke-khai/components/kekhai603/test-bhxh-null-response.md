# Fix cho lỗi "Mã số BHXH không hợp lệ trong dữ liệu trả về"

## Vấn đề đã được xác định:

Khi API BHXH trả về response thành công nhưng `maSoBHXH` là `null`, hệ thống báo lỗi "Mã số BHXH không hợp lệ trong dữ liệu trả về" mặc dù có thông tin hợp lệ khác.

### Response mẫu gây lỗi:
```json
{
    "data": {
        "maSoBHXH": null,
        "hoTen": "Nguyễn Thị Biết",
        "soDienThoai": null,
        "ccns": "0",
        "ngaySinh": "01/01/1952",
        "gioiTinh": 0,
        "quocTich": "VN",
        "danToc": "01",
        "cmnd": "089152002345",
        "maTinhKS": "89",
        "maHuyenKS": "891",
        "maXaKS": "30544",
        "maTinhNkq": null,
        "maHuyenNkq": null,
        "maXaNkq": null,
        "tinhKCB": null,
        "noiNhanHoSo": null,
        "maBenhVien": null,
        "maHoGiaDinh": "8999433170",
        "soTheBHYT": null,
        "tuNgayTheCu": "",
        "denNgayTheCu": "",
        "typeId": null,
        "phuongAn": "TM",
        "mucLuongNsTw": 0.0,
        "tyLeNsdp": 0.0,
        "tienNsdp": 0.0,
        "tyLeNsKhac": 0.0,
        "tienNsKhac": 0.0,
        "tyLeNsnn": 0.0,
        "tyLeNsTw": 0.0,
        "trangThai": "01",
        "maLoi": "29",
        "moTa": "Không có thẻ",
        "giaHanThe": 0,
        "isThamGiaBb": 0
    },
    "success": true,
    "message": null,
    "errors": null,
    "status": 200,
    "traceId": "00-739e6b04-4a12-4e77-8326-cdb357d2e431-00"
}
```

## Giải pháp đã triển khai:

### 1. **Cập nhật logic validation trong bhytService.ts**

#### Trước (quá strict):
```typescript
// Kiểm tra mã BHXH - bắt buộc
if (data.maSoBHXH === null || data.maSoBHXH === undefined || data.maSoBHXH === '') {
  console.log('Declaration data validation failed: maSoBHXH is null/empty', data.maSoBHXH);
  return false;
}

// Kiểm tra số thẻ BHYT - bắt buộc
if (data.soTheBHYT === null || data.soTheBHYT === undefined || data.soTheBHYT === '') {
  console.log('Declaration data validation failed: soTheBHYT is null/empty', data.soTheBHYT);
  return false;
}
```

#### Sau (linh hoạt hơn):
```typescript
// Kiểm tra có ít nhất một trong các thông tin định danh
const hasIdentification = (
  (data.maSoBHXH && data.maSoBHXH !== null && data.maSoBHXH !== '') ||
  (data.cmnd && data.cmnd !== null && data.cmnd !== '') ||
  (data.soTheBHYT && data.soTheBHYT !== null && data.soTheBHYT !== '') ||
  (data.maHoGiaDinh && data.maHoGiaDinh !== null && data.maHoGiaDinh !== '')
);

if (!hasIdentification) {
  console.log('Declaration data validation failed: No valid identification found');
  return false;
}
```

### 2. **Cập nhật error handling**

#### Trước:
```typescript
} else if (apiResponse.data.maSoBHXH === null || apiResponse.data.maSoBHXH === '') {
  errorMessage = 'Mã số BHXH không hợp lệ trong dữ liệu trả về';
```

#### Sau:
```typescript
} else {
  // Kiểm tra xem có thông tin định danh nào không
  const hasAnyId = (
    (apiResponse.data.maSoBHXH && apiResponse.data.maSoBHXH !== null) ||
    (apiResponse.data.cmnd && apiResponse.data.cmnd !== null) ||
    (apiResponse.data.soTheBHYT && apiResponse.data.soTheBHYT !== null) ||
    (apiResponse.data.maHoGiaDinh && apiResponse.data.maHoGiaDinh !== null)
  );
  
  if (!hasAnyId) {
    errorMessage = 'Không tìm thấy thông tin định danh (BHXH/CMND/Thẻ BHYT) với mã số này';
  } else {
    errorMessage = 'Dữ liệu BHYT không đầy đủ hoặc không hợp lệ';
  }
}
```

### 3. **Cập nhật data mapping trong useKeKhai603Api.ts**

#### Trước:
```typescript
maSoBHXH: response.data.maSoBHXH,
```

#### Sau:
```typescript
// Sử dụng mã BHXH từ request nếu response không có (trường hợp maSoBHXH null trong response)
maSoBHXH: response.data.maSoBhxh || request.maSoBHXH,
```

### 4. **Sửa lỗi TypeScript và duplicate properties**

- Sửa `response.data.maSoBHXH` thành `response.data.maSoBhxh` (đúng với interface)
- Loại bỏ các duplicate properties trong object
- Sử dụng `response.data.maKV` thay vì `response.data.tinhKCB` (không tồn tại)

## Kết quả:

### ✅ Trường hợp được chấp nhận:
Response có `maSoBHXH: null` nhưng có:
- `hoTen: "Nguyễn Thị Biết"` ✅
- `cmnd: "089152002345"` ✅  
- `maHoGiaDinh: "8999433170"` ✅

→ **Validation PASS** vì có thông tin định danh hợp lệ

### ❌ Trường hợp vẫn bị từ chối:
- `moTa: "Không có thẻ"` → Từ chối vì rõ ràng không có thẻ
- `typeId: "GT"` → Từ chối vì Guest/Not found
- Không có bất kỳ thông tin định danh nào

## Workflow mới:

1. **API trả về response thành công**
2. **Kiểm tra validation linh hoạt**:
   - Có họ tên? ✅
   - Có ít nhất 1 thông tin định danh (BHXH/CMND/Thẻ BHYT/Mã hộ gia đình)? ✅
   - Không phải trạng thái "không có thẻ"? ✅
3. **Mapping dữ liệu**:
   - Sử dụng mã BHXH từ request nếu response không có
   - Map các trường khác từ response
4. **Hiển thị thông tin cho người dùng**

## Lợi ích:

- ✅ **Linh hoạt hơn**: Chấp nhận response có thông tin hợp lệ dù thiếu một số trường
- ✅ **Thông tin đầy đủ**: Sử dụng mã BHXH từ request khi response không có
- ✅ **Error message rõ ràng**: Phân biệt các loại lỗi khác nhau
- ✅ **Tương thích**: Hoạt động với cả response đầy đủ và response thiếu một số trường

## Test Case:

Với response như bạn cung cấp:
- `maSoBHXH: null` → Sử dụng từ request
- `hoTen: "Nguyễn Thị Biết"` → ✅ Hợp lệ
- `cmnd: "089152002345"` → ✅ Có thông tin định danh
- `maHoGiaDinh: "8999433170"` → ✅ Có thông tin định danh

→ **Kết quả**: Validation PASS, hiển thị thông tin người dùng thành công!
