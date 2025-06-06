# Tính năng Điền nhanh STT hộ

## Tổng quan
Đã thêm tính năng điền STT hộ tự động tăng dần vào chức năng "Điền nhanh dữ liệu" trong KeKhai603ParticipantTable. Tính năng này giúp người dùng điền STT hộ một cách nhanh chóng và chính xác.

## Các chế độ điền STT hộ

### 1. **Giá trị cố định** (Chế độ hiện tại)
- Điền cùng một giá trị STT hộ cho tất cả người được chọn
- Các tùy chọn: 1, 2, 3, 4, 5+
- Phù hợp khi muốn đặt tất cả người tham gia có cùng STT hộ

### 2. **Tự động tăng dần** (Tính năng mới)
- Tự động điền STT hộ theo thứ tự tăng dần: 1, 2, 3, 4, 5+
- Người đầu tiên được gán STT hộ = 1, người thứ hai = 2, v.v.
- Từ người thứ 5 trở đi sẽ được gán STT hộ = "5+"

## Cách sử dụng

### Bước 1: Mở Điền nhanh dữ liệu
1. Trong bảng danh sách người tham gia, click nút **"Điền nhanh"** (⚡)
2. Modal "Điền nhanh dữ liệu" sẽ hiển thị

### Bước 2: Chọn trường STT hộ
1. Trong phần "Chọn trường cần điền", click vào **"STT hộ"**
2. Nếu là đối tượng DS (dân tộc thiểu số), tính năng sẽ bị vô hiệu hóa

### Bước 3: Chọn chế độ điền
1. **Giá trị cố định**: Điền cùng một giá trị cho tất cả
2. **Tự động tăng dần**: Điền STT hộ theo thứ tự 1, 2, 3, 4, 5+

### Bước 4: Chọn phạm vi áp dụng
1. **Tất cả người tham gia**: Áp dụng cho toàn bộ danh sách
2. **Chỉ những người được chọn**: Áp dụng cho những người được chọn cụ thể

### Bước 5: Xem trước và áp dụng
1. Với chế độ tự động, sẽ hiển thị preview STT hộ sẽ được gán
2. Click **"Điền STT hộ tự động"** để áp dụng

## Ví dụ sử dụng

### Ví dụ 1: Điền tự động cho tất cả (5 người)
**Kết quả:**
- Người 1 → STT hộ: 1
- Người 2 → STT hộ: 2  
- Người 3 → STT hộ: 3
- Người 4 → STT hộ: 4
- Người 5 → STT hộ: 5+

### Ví dụ 2: Điền tự động cho người được chọn (chọn người 2, 4, 6)
**Kết quả:**
- Người 2 → STT hộ: 1 (người đầu tiên được chọn)
- Người 4 → STT hộ: 2 (người thứ hai được chọn)
- Người 6 → STT hộ: 3 (người thứ ba được chọn)

### Ví dụ 3: Đối tượng DS (dân tộc thiểu số)
**Kết quả:** Tính năng bị vô hiệu hóa, tất cả người DS luôn có STT hộ = "1"

## Quy tắc nghiệp vụ

### STT hộ tự động
- **Thứ tự gán**: 1, 2, 3, 4, 5+
- **Giới hạn**: Từ người thứ 5 trở đi đều được gán "5+"
- **Đối tượng DS**: Luôn được gán STT hộ = "1" (không áp dụng tự động)

### Phạm vi áp dụng
- **Tất cả**: Áp dụng theo thứ tự trong danh sách
- **Được chọn**: Áp dụng theo thứ tự được chọn (không theo thứ tự trong danh sách)

## Giao diện người dùng

### Chế độ selection
```
┌─────────────────────────────────────────┐
│ Chế độ điền STT hộ                      │
├─────────────────────────────────────────┤
│ [👥] Giá trị cố định                    │
│     Điền cùng một giá trị               │
│                                         │
│ [↕️] Tự động tăng dần                   │
│     1, 2, 3, 4, 5+...                   │
└─────────────────────────────────────────┘
```

### Preview tự động
```
┌─────────────────────────────────────────┐
│ ↕️ STT hộ sẽ được điền tự động:         │
│ Người 1 → STT hộ: 1, Người 2 → STT hộ: 2│
│ 💡 STT hộ sẽ được gán theo thứ tự: 1,2,3│
└─────────────────────────────────────────┘
```

## Lợi ích

### Tiết kiệm thời gian
- Không cần điền từng STT hộ một cách thủ công
- Tự động gán theo quy tắc nghiệp vụ

### Giảm lỗi
- Tránh nhầm lẫn thứ tự STT hộ
- Đảm bảo tuân thủ quy tắc (tối đa 5+)

### Linh hoạt
- Có thể áp dụng cho tất cả hoặc chỉ những người được chọn
- Hỗ trợ cả chế độ cố định và tự động

## Tích hợp với các tính năng khác

### Nhập hộ gia đình
- Tính năng "Nhập hộ gia đình" đã tự động gán STT hộ tăng dần
- Tính năng "Điền nhanh" có thể dùng để điều chỉnh lại sau khi nhập

### Validation
- STT hộ được validate theo quy tắc nghiệp vụ
- Đối tượng DS luôn được kiểm tra và gán đúng giá trị

### Lưu dữ liệu
- STT hộ được lưu vào database với field `stt_ho`
- Tương thích với tất cả chức năng export và báo cáo

## Cải tiến trong tương lai

### Tính năng có thể thêm
1. **Custom pattern**: Cho phép người dùng tự định nghĩa pattern (ví dụ: 2, 4, 6, 8...)
2. **Bulk edit**: Chỉnh sửa hàng loạt STT hộ với drag & drop
3. **Smart detection**: Tự động phát hiện pattern hiện tại và đề xuất

### Performance
- Optimize cho danh sách lớn (>100 người)
- Batch update để giảm số lần re-render

## Troubleshooting

### Vấn đề thường gặp
1. **STT hộ không hiển thị**: Kiểm tra console log để debug
2. **Đối tượng DS không hoạt động**: Đây là behavior đúng theo quy tắc
3. **Thứ tự không đúng**: Kiểm tra phạm vi áp dụng (tất cả vs được chọn)

### Debug
- Mở Console để xem log quá trình điền STT hộ
- Kiểm tra state của participants sau khi áp dụng
- Verify database update thông qua network tab
