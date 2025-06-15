# Tính năng Xuất Excel D03-TK1 trong HoSoDaXuLy

## Tổng quan
Tính năng xuất Excel D03-TK1 đã được tích hợp vào trang "Hồ sơ đã xử lý" để cho phép xuất dữ liệu người tham gia ra file Excel theo mẫu D03-TK1 chuẩn.

## Tính năng chính

### 1. Xuất tất cả dữ liệu hiện tại
- **Nút**: "Xuất D03-TK1" (màu xanh lá)
- **Chức năng**: Xuất tất cả người tham gia đang hiển thị trên trang hiện tại
- **File đầu ra**: `D03_TK1_HoSoDaXuLy_YYYY-MM-DD.xlsx`
- **Template**: Sử dụng file mẫu `/public/templates/FileMau_D03_TS.xlsx`

### 2. Xuất dữ liệu đã chọn
- **Nút**: "Xuất đã chọn (X)" (màu tím) - chỉ hiện khi có dữ liệu được chọn
- **Chức năng**: Xuất chỉ những người tham gia đã được chọn bằng checkbox
- **File đầu ra**: `D03_TK1_DaChon_YYYY-MM-DD.xlsx`
- **Template**: Sử dụng file mẫu `/public/templates/FileMau_D03_TS.xlsx`

## Cách sử dụng

### Xuất tất cả dữ liệu
1. Sử dụng các bộ lọc để tìm kiếm dữ liệu cần xuất
2. Nhấn nút "Xuất D03-TK1"
3. File Excel sẽ được tự động tải về

### Xuất dữ liệu đã chọn
1. Sử dụng checkbox để chọn những người tham gia cần xuất
2. Nhấn nút "Xuất đã chọn (X)" (X là số lượng đã chọn)
3. File Excel sẽ được tự động tải về

## Cấu trúc dữ liệu xuất

### Mapping dữ liệu vào template Excel:
- **Cột A**: STT (số thứ tự)
- **Cột B**: Họ tên
- **Cột C**: Mã BHXH
- **Cột D**: Số CCCD/CNTND/ĐDCN/hộ chiếu
- **Cột E**: Ngày sinh
- **Cột F**: Giới tính (Nam/Nữ)
- **Cột G**: Địa chỉ (dia_chi)
- **Cột H**: Nơi đăng ký KCB (Bệnh viện)
- **Cột I**: Số tháng (mặc định: 12)
- **Cột J**: Từ ngày (ngày nộp)
- **Cột K**: Đến ngày
- **Cột L**: Số tiền (tien_dong_thuc_te hoặc tien_dong)
- **Cột M**: Ghi chú
- **Cột N**: Mã nhân viên thu (email người dùng)
- **Cột O**: Ngày lập (ngày nộp)

## Xử lý lỗi

### Các trường hợp lỗi thường gặp:
1. **"Không có dữ liệu để xuất Excel"**: Không có người tham gia nào trong danh sách
2. **"Vui lòng chọn ít nhất một người tham gia"**: Chưa chọn người tham gia nào khi dùng tính năng xuất đã chọn
3. **"Không thể tải file mẫu Excel"**: File template không tồn tại hoặc không thể truy cập
4. **"Không thể xuất file Excel với template"**: Lỗi trong quá trình xử lý dữ liệu

### Khắc phục:
- Kiểm tra kết nối mạng
- Đảm bảo file template tồn tại tại `/public/templates/FileMau_D03_TS.xlsx`
- Thử lại sau vài giây
- Liên hệ admin nếu lỗi vẫn tiếp tục

## Kỹ thuật

### Files liên quan:
- `src/modules/ke-khai/pages/HoSoDaXuLy.tsx`: Component chính
- `src/shared/utils/excelExport.ts`: Logic xuất Excel
- `public/templates/FileMau_D03_TS.xlsx`: File template

### Functions chính:
- `handleExportD03TK1Excel()`: Xuất tất cả dữ liệu
- `handleExportSelectedParticipants()`: Xuất dữ liệu đã chọn
- `exportD03TK1WithTemplate()`: Logic xuất Excel với template
- `convertProcessedParticipantToD03TK1Format()`: Convert dữ liệu

### Dependencies:
- `exceljs`: Thư viện xử lý Excel
- Template Excel có sẵn

## Lưu ý quan trọng

1. **Template Excel**: Dữ liệu sẽ được chèn vào template có sẵn, tạo dòng mới từ vị trí 15 trở đi
2. **Bảo toàn dữ liệu mẫu**: Dữ liệu mẫu từ dòng 1-14 được giữ nguyên, dữ liệu thực được chèn từ dòng 15 (không ghi đè)
3. **Định dạng dữ liệu**: Tự động format ngày tháng và số tiền theo chuẩn Việt Nam
4. **Performance**: Với dữ liệu lớn (>1000 bản ghi), quá trình xuất có thể mất vài giây
5. **Browser compatibility**: Hỗ trợ tất cả browser hiện đại
6. **File size**: File Excel đầu ra thường nhỏ hơn 1MB cho 1000 bản ghi

## Cập nhật và bảo trì

### Để cập nhật template:
1. Thay thế file `/public/templates/FileMau_D03_TS.xlsx`
2. Cập nhật mapping trong `convertProcessedParticipantToD03TK1Format()` nếu cần
3. Test lại tính năng

### Để thêm cột mới:
1. Cập nhật interface `ProcessedParticipantExport`
2. Cập nhật function `convertProcessedParticipantToD03TK1Format()`
3. Cập nhật mapping trong `exportD03TK1WithTemplate()`
