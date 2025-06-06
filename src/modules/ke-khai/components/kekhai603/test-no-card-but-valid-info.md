# Test Case: "Không có thẻ" nhưng vẫn hiển thị thông tin hợp lệ

## Mục tiêu:
Với response có `moTa: "Không có thẻ"` nhưng có thông tin cá nhân hợp lệ, hệ thống vẫn hiển thị và cho phép sử dụng thông tin đó với cảnh báo phù hợp.

## Input Test Data:
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

## Expected Behavior:

### ✅ Validation Logic (bhytService.ts):
1. **Kiểm tra họ tên**: `hoTen: "Nguyễn Thị Biết"` → ✅ Hợp lệ
2. **Kiểm tra thông tin định danh**:
   - `maSoBHXH: null` → ❌
   - `cmnd: "089152002345"` → ✅ Hợp lệ
   - `maHoGiaDinh: "8999433170"` → ✅ Hợp lệ
   - **Kết quả**: Có ít nhất 1 thông tin định danh → ✅ PASS
3. **Kiểm tra trạng thái thẻ**: `moTa: "Không có thẻ"` → Ghi log cảnh báo nhưng không từ chối

→ **Validation Result**: ✅ PASS

### ✅ Data Mapping (useKeKhai603Api.ts):
```typescript
const participantData = {
  hoTen: "Nguyễn Thị Biết",
  maSoBHXH: request.maSoBHXH, // Sử dụng từ request vì response null
  ngaySinh: "1952-01-01", // Converted từ "01/01/1952"
  gioiTinh: "Nữ", // Converted từ gioiTinh: 0
  soCCCD: "089152002345",
  quocTich: "VN",
  danToc: "01",
  maTinhKS: "89",
  maHuyenKS: "891",
  maXaKS: "30544",
  maHoGiaDinh: "8999433170",
  phuongAn: "TM",
  // ... other fields
};
```

### ✅ Card Status Formatting (bhytService.ts):
```typescript
trangThaiThe: formatCardStatus("Không có thẻ")
// Result: "⚠️ Không có thẻ (Thông tin cá nhân vẫn có thể sử dụng)"
```

### ✅ UI Response (KeKhai603FormContent.tsx):
```typescript
// Kiểm tra cảnh báo
const hasCardWarning = result.data.trangThaiThe && 
  result.data.trangThaiThe.includes('⚠️') && 
  result.data.trangThaiThe.toLowerCase().includes('không có thẻ');

if (hasCardWarning) {
  showToast('Đã tìm thấy thông tin cá nhân! ⚠️ Lưu ý: Người này chưa có thẻ BHYT', 'warning');
} else {
  showToast('Đã tìm thấy và cập nhật thông tin BHYT!', 'success');
}
```

## Expected Results:

### 1. **API Response Processing**: ✅ Success
- Validation passes vì có thông tin định danh hợp lệ
- Data mapping thành công với mã BHXH từ request
- Card status được format với cảnh báo

### 2. **UI Display**: ✅ Success
- Form được điền với thông tin cá nhân:
  - Họ tên: "Nguyễn Thị Biết"
  - Mã BHXH: (từ request)
  - Ngày sinh: "01/01/1952"
  - Giới tính: "Nữ"
  - CCCD: "089152002345"
  - Mã hộ gia đình: "8999433170"
- Trạng thái thẻ: "⚠️ Không có thẻ (Thông tin cá nhân vẫn có thể sử dụng)"

### 3. **Toast Notification**: ⚠️ Warning
- Message: "Đã tìm thấy thông tin cá nhân! ⚠️ Lưu ý: Người này chưa có thẻ BHYT"
- Type: warning (màu vàng)

### 4. **Data Persistence**: ✅ Success
- Thông tin được lưu vào database bình thường
- Có thể tiếp tục quy trình kê khai
- Trạng thái cảnh báo được ghi nhận

## Workflow hoàn chỉnh:

1. **User nhập mã BHXH** → Enter để search
2. **API trả về** response với `moTa: "Không có thẻ"`
3. **Validation** → PASS (có thông tin định danh hợp lệ)
4. **Data mapping** → Thành công với cảnh báo
5. **UI update** → Form được điền, hiển thị cảnh báo
6. **Toast notification** → Warning về trạng thái thẻ
7. **User có thể** → Tiếp tục điền thông tin khác và lưu

## Lợi ích:

- ✅ **Không mất thông tin**: Sử dụng được thông tin cá nhân hợp lệ
- ✅ **Cảnh báo rõ ràng**: User biết trạng thái thẻ
- ✅ **Workflow linh hoạt**: Có thể tiếp tục quy trình
- ✅ **Data integrity**: Thông tin được lưu đầy đủ

## So sánh với logic cũ:

### Trước:
- ❌ Từ chối toàn bộ response
- ❌ Hiển thị lỗi "Mã số BHXH không hợp lệ"
- ❌ Không sử dụng được thông tin gì

### Sau:
- ✅ Chấp nhận response với cảnh báo
- ✅ Hiển thị thông tin cá nhân + cảnh báo
- ✅ Cho phép tiếp tục quy trình

Đây là cải tiến quan trọng giúp hệ thống linh hoạt hơn trong việc xử lý các trường hợp thực tế!
