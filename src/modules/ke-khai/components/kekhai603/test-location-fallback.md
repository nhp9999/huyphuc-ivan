# Test Case: Fallback từ Nơi khai quyết sang Khẩu sử

## Mục tiêu:
Khi thông tin nơi khai quyết (tinhNkq, huyenNkq, xaNkq) bị null, hệ thống sử dụng thông tin khẩu sử (tinhKS, huyenKS, xaKS) làm fallback.

## Input Test Data:
```json
{
    "data": {
        "maSoBHXH": null,
        "hoTen": "Nguyễn Thị Biết",
        "ngaySinh": "01/01/1952",
        "gioiTinh": 0,
        "cmnd": "089152002345",
        
        // Thông tin khẩu sử (có dữ liệu)
        "maTinhKS": "89",
        "maHuyenKS": "891", 
        "maXaKS": "30544",
        
        // Thông tin nơi khai quyết (null)
        "maTinhNkq": null,
        "maHuyenNkq": null,
        "maXaNkq": null,
        
        "maHoGiaDinh": "8999433170",
        "phuongAn": "TM",
        "moTa": "Không có thẻ"
    },
    "success": true
}
```

## Expected Behavior:

### ✅ Logic Fallback trong useKeKhai603Api.ts:
```typescript
// Location data (Nơi khai quyết) - fallback to khẩu sử if null
maTinhNkq: response.data.maTinhNkq || response.data.maTinhKS || '',
maHuyenNkq: response.data.maHuyenNkq || response.data.maHuyenKS || '',
maXaNkq: response.data.maXaNkq || response.data.maXaKS || '',
```

### ✅ Logic Fallback trong bhytService.ts:
```typescript
// Cả hai methods: lookupKeKhai603 và lookupBhytForDeclaration
maTinhNkq: apiResponse.data.maTinhNkq || apiResponse.data.maTinhKS || '',
maHuyenNkq: apiResponse.data.maHuyenNkq || apiResponse.data.maHuyenKS || '',
maXaNkq: apiResponse.data.maXaNkq || apiResponse.data.maXaKS || '',
```

## Expected Results:

### 1. **Data Mapping với Fallback**:
```typescript
const participantData = {
  hoTen: "Nguyễn Thị Biết",
  maSoBHXH: request.maSoBHXH, // Từ request
  ngaySinh: "1952-01-01",
  gioiTinh: "Nữ",
  soCCCD: "089152002345",
  
  // Location data (Khẩu sử) - giữ nguyên
  maTinhKS: "89",
  maHuyenKS: "891", 
  maXaKS: "30544",
  
  // Location data (Nơi khai quyết) - fallback từ khẩu sử
  maTinhNkq: "89",    // từ maTinhKS
  maHuyenNkq: "891",  // từ maHuyenKS
  maXaNkq: "30544",   // từ maXaKS
  
  maHoGiaDinh: "8999433170",
  phuongAn: "TM"
};
```

### 2. **UI Display**:
- **Form Khẩu sử**: 
  - Tỉnh: "89" (Tỉnh An Giang)
  - Huyện: "891" 
  - Xã: "30544"

- **Form Nơi khai quyết**: 
  - Tỉnh: "89" (fallback từ khẩu sử)
  - Huyện: "891" (fallback từ khẩu sử)
  - Xã: "30544" (fallback từ khẩu sử)

### 3. **Database Storage**:
```sql
INSERT INTO participants (
  ho_ten,
  ma_so_bhxh,
  ma_tinh_ks,
  ma_huyen_ks, 
  ma_xa_ks,
  ma_tinh_nkq,    -- "89" (fallback)
  ma_huyen_nkq,   -- "891" (fallback)
  ma_xa_nkq,      -- "30544" (fallback)
  ma_ho_gia_dinh,
  phuong_an
) VALUES (
  'Nguyễn Thị Biết',
  '...',
  '89',
  '891',
  '30544',
  '89',     -- Fallback value
  '891',    -- Fallback value  
  '30544',  -- Fallback value
  '8999433170',
  'TM'
);
```

## Test Scenarios:

### Scenario 1: Tất cả Nkq đều null
```json
{
  "maTinhKS": "89", "maTinhNkq": null,
  "maHuyenKS": "891", "maHuyenNkq": null,
  "maXaKS": "30544", "maXaNkq": null
}
```
**Expected**: Nkq = KS values

### Scenario 2: Một số Nkq null, một số có giá trị
```json
{
  "maTinhKS": "89", "maTinhNkq": "01",
  "maHuyenKS": "891", "maHuyenNkq": null,
  "maXaKS": "30544", "maXaNkq": null
}
```
**Expected**: 
- maTinhNkq = "01" (giữ nguyên)
- maHuyenNkq = "891" (fallback)
- maXaNkq = "30544" (fallback)

### Scenario 3: Cả KS và Nkq đều null
```json
{
  "maTinhKS": null, "maTinhNkq": null,
  "maHuyenKS": null, "maHuyenNkq": null,
  "maXaKS": null, "maXaNkq": null
}
```
**Expected**: Tất cả = "" (empty string)

### Scenario 4: Nkq có giá trị (không fallback)
```json
{
  "maTinhKS": "89", "maTinhNkq": "01",
  "maHuyenKS": "891", "maHuyenNkq": "001",
  "maXaKS": "30544", "maXaNkq": "00001"
}
```
**Expected**: Sử dụng Nkq values, không fallback

## Logic Flow:

```typescript
// Pseudo code
function mapLocationData(apiData) {
  return {
    // Khẩu sử - giữ nguyên
    maTinhKS: apiData.maTinhKS || '',
    maHuyenKS: apiData.maHuyenKS || '',
    maXaKS: apiData.maXaKS || '',
    
    // Nơi khai quyết - fallback logic
    maTinhNkq: apiData.maTinhNkq || apiData.maTinhKS || '',
    maHuyenNkq: apiData.maHuyenNkq || apiData.maHuyenKS || '',
    maXaNkq: apiData.maXaNkq || apiData.maXaKS || ''
  };
}
```

## Lợi ích:

### 1. **User Experience**:
- ✅ Không cần nhập lại thông tin địa chỉ
- ✅ Form được điền tự động với thông tin hợp lý
- ✅ Giảm thiểu lỗi nhập liệu

### 2. **Data Consistency**:
- ✅ Đảm bảo có thông tin địa chỉ để xử lý
- ✅ Fallback logic rõ ràng và nhất quán
- ✅ Không mất dữ liệu quan trọng

### 3. **Business Logic**:
- ✅ Phù hợp với thực tế: Nơi khai quyết thường trùng với khẩu sử
- ✅ Giảm thiểu trường hợp thiếu thông tin địa chỉ
- ✅ Hỗ trợ quy trình kê khai liền mạch

## Validation:

Sau khi implement, cần test:
1. ✅ Form hiển thị đúng thông tin fallback
2. ✅ Dropdown địa chỉ load đúng options
3. ✅ Dữ liệu được lưu chính xác vào database
4. ✅ Export Excel có thông tin địa chỉ đầy đủ

Đây là cải tiến quan trọng giúp tối ưu trải nghiệm người dùng khi làm việc với dữ liệu BHXH thực tế!
