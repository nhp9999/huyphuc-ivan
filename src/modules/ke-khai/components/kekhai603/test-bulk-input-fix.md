# Fix cho vấn đề Bulk Input không hiển thị mã BHXH

## Vấn đề đã được xác định:

Khi sử dụng tính năng "Nhập hàng loạt", các mã BHXH không hiển thị trong bảng sau khi thêm. Nguyên nhân:

1. **Timing Issue**: Logic cũ cố gắng cập nhật dữ liệu ngay sau khi gọi `handleAddParticipant()`, nhưng React state chưa được cập nhật kịp thời.

2. **Index Calculation**: Việc tính toán index của participant mới không chính xác do `participants.length` chưa được cập nhật.

## Giải pháp đã triển khai:

### 1. **State Management cho Bulk Input**
```typescript
// State for bulk input processing
const [bulkInputData, setBulkInputData] = useState<any[]>([]);
const [bulkInputStartIndex, setBulkInputStartIndex] = useState(-1);
```

### 2. **Logic Bulk Input mới**
```typescript
const handleBulkInput = async (data: any[]) => {
  try {
    // Store the data and starting index for processing
    setBulkInputData(data);
    setBulkInputStartIndex(participants.length);
    
    // Add participants sequentially
    for (let i = 0; i < data.length; i++) {
      await handleAddParticipant();
    }
  } catch (error) {
    console.error('Error in bulk input:', error);
    // Reset bulk input state on error
    setBulkInputData([]);
    setBulkInputStartIndex(-1);
  }
};
```

### 3. **useEffect để xử lý cập nhật dữ liệu**
```typescript
useEffect(() => {
  if (bulkInputData.length > 0 && bulkInputStartIndex >= 0) {
    // Check if all participants have been added
    const expectedLength = bulkInputStartIndex + bulkInputData.length;
    if (participants.length >= expectedLength) {
      // Update each participant with the bulk input data
      bulkInputData.forEach((item, i) => {
        const participantIndex = bulkInputStartIndex + i;
        
        // Set the data for each participant
        setTimeout(() => {
          handleParticipantChange(participantIndex, 'maSoBHXH', item.maSoBHXH);
          
          // Set optional fields if provided
          if (item.soThangDong) {
            handleParticipantChange(participantIndex, 'soThangDong', item.soThangDong);
          }
          if (item.sttHo) {
            // For DS type, always set to "1", otherwise use provided value
            const sttHoValue = doiTuongThamGia && doiTuongThamGia.includes('DS') ? '1' : item.sttHo;
            handleParticipantChange(participantIndex, 'sttHo', sttHoValue);
          }
        }, 100 * (i + 1)); // Stagger updates to avoid race conditions
      });
      
      // Reset bulk input state
      setBulkInputData([]);
      setBulkInputStartIndex(-1);
    }
  }
}, [participants.length, bulkInputData, bulkInputStartIndex, handleParticipantChange, doiTuongThamGia]);
```

## Cách hoạt động:

1. **Lưu trữ dữ liệu**: Khi người dùng submit bulk input, dữ liệu được lưu vào state `bulkInputData` và index bắt đầu vào `bulkInputStartIndex`.

2. **Thêm participants**: Gọi `handleAddParticipant()` tuần tự để thêm từng participant vào database và state.

3. **Theo dõi thay đổi**: `useEffect` theo dõi sự thay đổi của `participants.length`.

4. **Cập nhật dữ liệu**: Khi đủ số lượng participants đã được thêm, `useEffect` sẽ cập nhật dữ liệu cho từng participant.

5. **Staggered Updates**: Sử dụng `setTimeout` với delay tăng dần để tránh race conditions.

6. **Cleanup**: Reset state sau khi hoàn thành.

## Lợi ích:

- ✅ **Đảm bảo timing**: Chờ đến khi tất cả participants được thêm mới bắt đầu cập nhật dữ liệu
- ✅ **Index chính xác**: Sử dụng `bulkInputStartIndex` để tính toán index chính xác
- ✅ **Error handling**: Reset state khi có lỗi
- ✅ **Race condition prevention**: Stagger updates để tránh xung đột
- ✅ **Type safety**: Sửa lỗi TypeScript cho disabled prop

## Test Case:

Với dữ liệu Excel:
```
8924992285	12	1
8923440017	12	4
8923461385	12	4
8923514024	12	2
7413266839	12	3
7928325728	12	2
```

Kết quả mong đợi:
- 6 participants được thêm vào bảng
- Mỗi participant có đầy đủ: mã BHXH, số tháng đóng, STT hộ
- Dữ liệu hiển thị ngay trong các ô input

## Cải tiến thêm có thể làm:

1. **Loading indicator**: Hiển thị progress khi đang xử lý bulk input
2. **Batch updates**: Gom nhóm các updates để giảm số lần re-render
3. **Validation**: Kiểm tra dữ liệu trước khi cập nhật
4. **Undo functionality**: Cho phép hoàn tác bulk input nếu cần
