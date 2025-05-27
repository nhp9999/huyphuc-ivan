# Tích hợp API thật VNPost - Hoàn thành

## ✅ Trạng thái hiện tại

Ứng dụng đã được cập nhật để **sử dụng API thật** của VNPost thay vì mock data.

### Thay đổi đã thực hiện:

#### 1. **Tra cứu đơn lẻ** (`src/pages/BhytLookup.tsx`)
```typescript
// ✅ Đang sử dụng API thật
const lookupResponse = await bhytService.lookupBhytInfo(maSoBHXH);

// ❌ Mock data (đã comment)
// const lookupResponse = await bhytService.mockLookupBhytInfo(maSoBHXH);
```

#### 2. **Tra cứu hàng loạt** (`src/components/BulkLookup.tsx`)
```typescript
// ✅ Đang sử dụng API thật
const response = await bhytService.bulkLookupBhytInfo(maSoList, setProgress);

// ❌ Mock data (đã comment)
// const response = await bhytService.mockBulkLookupBhytInfo(maSoList, setProgress);
```

#### 3. **Cập nhật UI** (`src/components/ApiInstructions.tsx`)
- Thay đổi màu sắc từ amber (cảnh báo) sang green (thành công)
- Cập nhật nội dung hiển thị trạng thái "Đang sử dụng API thật"
- Thêm hướng dẫn quay lại mock data nếu cần

#### 4. **Cập nhật hướng dẫn**
- `BHYT_INTEGRATION.md`: Cập nhật phần hướng dẫn sử dụng
- `src/pages/BhytLookup.tsx`: Cập nhật instructions

## 🔧 Cấu hình API

### Endpoint
```
GET https://ssm.vnpost.vn/connect/tracuu/thongtinthe?maSoBHXH={maSoBHXH}
```

### Headers
```javascript
{
  'sec-ch-ua-platform': '"Windows"',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
  'Accept': 'application/json, text/plain, */*',
  'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
  'Content-Type': 'application/json',
  'sec-ch-ua-mobile': '?0',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'host': 'ssm.vnpost.vn'
}
```

### Rate Limiting
- Delay 0.5s giữa các request trong bulk lookup
- Tránh spam API server

## 🚀 Cách sử dụng

### 1. Tra cứu đơn lẻ
1. Mở http://localhost:5173/
2. Đăng nhập: `admin@example.com` / `password`
3. Click "Tra cứu BHYT" → tab "Tra cứu đơn lẻ"
4. Nhập mã số BHXH thực (10 chữ số)
5. Click "Tra cứu"

### 2. Tra cứu hàng loạt
1. Chuyển sang tab "Tra cứu hàng loạt"
2. Nhập danh sách mã số BHXH thực
3. Click "Tra cứu hàng loạt"
4. Xem progress bar và kết quả
5. Export CSV hoặc Copy kết quả

## ⚠️ Lưu ý quan trọng

### 1. **Token expiration**
- Token hiện tại có thể hết hạn
- Cần cập nhật token mới trong `src/services/bhytService.ts`
- Dấu hiệu: API trả về lỗi 401/403

### 2. **CORS Issues**
- Có thể gặp lỗi CORS khi gọi từ browser
- Giải pháp:
  - Sử dụng browser extension để disable CORS
  - Cấu hình proxy trong `vite.config.ts`
  - Gọi API từ backend thay vì frontend

### 3. **Rate Limiting**
- API có thể giới hạn số request/phút
- Đã implement delay 0.5s giữa requests
- Có thể cần tăng delay nếu gặp lỗi 429

### 4. **Network Issues**
- Kiểm tra kết nối internet
- Kiểm tra firewall/proxy settings
- VPN có thể ảnh hưởng đến kết nối

## 🔄 Quay lại Mock Data

Nếu cần test với mock data:

### Tra cứu đơn lẻ
Trong `src/pages/BhytLookup.tsx`:
```typescript
// Comment dòng này:
// const lookupResponse = await bhytService.lookupBhytInfo(maSoBHXH);

// Bỏ comment dòng này:
const lookupResponse = await bhytService.mockLookupBhytInfo(maSoBHXH);
```

### Tra cứu hàng loạt
Trong `src/components/BulkLookup.tsx`:
```typescript
// Comment dòng này:
// const response = await bhytService.bulkLookupBhytInfo(maSoList, setProgress);

// Bỏ comment dòng này:
const response = await bhytService.mockBulkLookupBhytInfo(maSoList, setProgress);
```

## 🐛 Troubleshooting

### Lỗi "Network Error"
```
Nguyên nhân: CORS, network issues, hoặc API down
Giải pháp: Kiểm tra network, thử với VPN khác, hoặc quay lại mock data
```

### Lỗi "401 Unauthorized"
```
Nguyên nhân: Token hết hạn
Giải pháp: Cập nhật token mới trong bhytService.ts
```

### Lỗi "429 Too Many Requests"
```
Nguyên nhân: Rate limiting
Giải pháp: Tăng delay giữa requests hoặc giảm số lượng request
```

### Lỗi "Không tìm thấy thông tin"
```
Nguyên nhân: Mã số BHXH không tồn tại hoặc không hợp lệ
Giải pháp: Kiểm tra lại mã số, thử với mã số khác
```

## 📊 Monitoring

### Success Indicators
- ✅ API response time < 5s
- ✅ Success rate > 80%
- ✅ No CORS errors
- ✅ Progress bar hoạt động smooth

### Failure Indicators
- ❌ Timeout errors
- ❌ CORS errors
- ❌ 401/403 errors
- ❌ Network errors

## 🎯 Next Steps

1. **Monitor API performance** trong production
2. **Implement retry logic** cho failed requests
3. **Add caching** để giảm API calls
4. **Setup error tracking** (Sentry, LogRocket)
5. **Consider backend proxy** để tránh CORS issues

## 🔄 Data Conversion

Ứng dụng đã được cập nhật để xử lý đúng format response từ VNPost API:

### VNPost Response Format:
```json
{
  "data": {
    "maSoBhxh": "0123456789",
    "hoTen": "Trần Đình Liệu",
    "ngaySinhHienThi": "12/05/1966",
    "gioiTinhHienThi": "Nam",
    "trangThaiThe": "Thẻ hợp lệ",
    "coSoKCB": "075 - Bệnh viện Tim Hà Nội",
    "tyLeBhyt": 4.5,
    "tuNgay": "20250101",
    "denNgay": "20251231"
  },
  "success": true,
  "status": 200
}
```

### Conversion Logic:
- **Dates**: YYYYMMDD → DD/MM/YYYY
- **Coverage**: tyLeBhyt * 20 = percentage
- **Address**: Combine diaChiLh + tenTinhKCB
- **Gender**: Use gioiTinhHienThi (already formatted)

---

**Trạng thái**: ✅ **HOÀN THÀNH** - Đang sử dụng API thật của VNPost với data conversion
**Ngày cập nhật**: 2024-01-27
**Version**: 2.0.0
