# Debug Guide: Mã số BHXH không hiển thị trong Nhập hộ gia đình

## Vấn đề
Khi sử dụng tính năng "Nhập hộ gia đình", mã số BHXH không hiển thị trong cột mã số BHXH của bảng người tham gia.

## Nguyên nhân có thể
1. **React State Closure**: `handleParticipantChange` có thể bị closure issue khi gọi liên tiếp
2. **Timing Issue**: State updates không kịp thời để reflect trong UI
3. **Validation Logic**: Mã BHXH bị filter hoặc validate không đúng
4. **UI Rendering**: Input field không bind đúng với participant data

## Các cải tiến đã thực hiện

### 1. **Thêm Debug Logging**
```typescript
// Trong useKeKhai603Participants.ts
if (field === 'sttHo' || field === 'soThangDong' || field === 'maSoBHXH') {
  console.log(`📝 handleParticipantChange: Setting ${field} = "${value}" for participant ${index + 1}`);
}
```

### 2. **Cải thiện Debug Function**
```typescript
// Trong KeKhai603FormContent.tsx
const debugParticipantState = (label: string, participantIndex?: number) => {
  setTimeout(() => {
    const currentParticipants = participants;
    // ... debug logic với fresh state
  }, 50);
};
```

### 3. **Tăng Delay giữa các State Updates**
```typescript
// Tăng delay từ 100ms lên 200ms
await new Promise(resolve => setTimeout(resolve, 200));
```

### 4. **Cải thiện Household Bulk Input Logic**
```typescript
// Set mã BHXH trước, sau đó set các field khác
await handleParticipantChange(participantIndex, 'maSoBHXH', bhxhCode);
await new Promise(resolve => setTimeout(resolve, 200));

await handleParticipantChange(participantIndex, 'soThangDong', soThangDong);
await new Promise(resolve => setTimeout(resolve, 200));

await handleParticipantChange(participantIndex, 'sttHo', finalSttHo);
await new Promise(resolve => setTimeout(resolve, 200));
```

## Cách Debug

### 1. **Mở Console**
- Mở Developer Tools (F12)
- Chuyển đến tab Console
- Thực hiện tính năng "Nhập hộ gia đình"

### 2. **Kiểm tra Logs**
Tìm các log sau:
```
🏠 Starting household bulk input for X participants
🏠 Adding participant 1/X
🏠 Setting data for participant X: BHXH=XXXXXXXXXX, STT hộ=X
📝 handleParticipantChange: Setting maSoBHXH = "XXXXXXXXXX" for participant X
📝 State update: Participant X maSoBHXH changed from "" to "XXXXXXXXXX"
📝 State updated: Participant X now has maSoBHXH = "XXXXXXXXXX"
🔍 After setting maSoBHXH for participant X - Participant X: {exists: true, maSoBHXH: "XXXXXXXXXX", ...}
```

### 3. **Kiểm tra UI**
- Sau khi hoàn thành bulk input, kiểm tra bảng
- Mã BHXH phải hiển thị trong cột "Mã BHXH"
- Nếu không hiển thị, kiểm tra console logs

### 4. **Kiểm tra State**
```javascript
// Trong console, kiểm tra state hiện tại
console.log('Current participants:', participants);
```

## Test Cases

### Test Case 1: Nhập 3 mã BHXH
**Input:**
```
1234567890
2345678901
3456789012
```

**Expected Output:**
- Participant 1: maSoBHXH = "1234567890", sttHo = "1"
- Participant 2: maSoBHXH = "2345678901", sttHo = "2"  
- Participant 3: maSoBHXH = "3456789012", sttHo = "3"

### Test Case 2: Đối tượng DS
**Input:** 3 mã BHXH cho đối tượng DS

**Expected Output:**
- Tất cả participants: sttHo = "1"
- Mã BHXH vẫn hiển thị đúng

### Test Case 3: Với Medical Facility
**Input:** 3 mã BHXH + chọn cơ sở KCB

**Expected Output:**
- Mã BHXH hiển thị đúng
- Medical facility được set đúng

## Troubleshooting

### Vấn đề 1: Mã BHXH không hiển thị
**Nguyên nhân:** State update bị delay hoặc closure issue
**Giải pháp:** 
- Kiểm tra console logs
- Tăng delay giữa các state updates
- Verify `handleParticipantChange` được gọi đúng

### Vấn đề 2: Chỉ participant cuối cùng có mã BHXH
**Nguyên nhân:** State closure - tất cả updates đều reference cùng một state
**Giải pháp:**
- Sử dụng functional state updates
- Tăng delay giữa các operations

### Vấn đề 3: UI không update sau khi set state
**Nguyên nhân:** React không re-render hoặc input không bind đúng
**Giải pháp:**
- Kiểm tra input value binding: `value={participant.maSoBHXH || ''}`
- Force re-render bằng cách thay đổi key

### Vấn đề 4: Validation loại bỏ mã BHXH
**Nguyên nhân:** Validation logic trong `handleParticipantChange`
**Giải pháp:**
```typescript
// Kiểm tra validation logic
if (field === 'maSoBHXH') {
  value = value.replace(/\D/g, '').slice(0, 10); // Chỉ cho phép số, tối đa 10 ký tự
}
```

## Monitoring

### Performance Metrics
- Thời gian hoàn thành bulk input
- Số lượng state updates
- Memory usage

### Success Criteria
- ✅ Tất cả mã BHXH hiển thị đúng trong UI
- ✅ STT hộ được set đúng (auto-increment hoặc "1" cho DS)
- ✅ Không có lỗi trong console
- ✅ UI responsive trong quá trình bulk input

## Next Steps

### Nếu vấn đề vẫn tồn tại:
1. **Implement Batch Updates**: Thay vì gọi `handleParticipantChange` nhiều lần, tạo một function để update nhiều fields cùng lúc
2. **Use useCallback**: Wrap `handleParticipantChange` trong useCallback để tránh closure issues
3. **State Management**: Xem xét sử dụng useReducer thay vì useState cho complex state updates
4. **UI Optimization**: Implement virtual scrolling cho danh sách lớn

### Cải tiến dài hạn:
1. **Error Handling**: Thêm error boundaries và retry logic
2. **User Feedback**: Progress indicators chi tiết hơn
3. **Validation**: Real-time validation cho mã BHXH
4. **Performance**: Debounce state updates để giảm re-renders
