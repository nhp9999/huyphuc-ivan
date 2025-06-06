# STT Hộ Debug Test Instructions

## How to Test the Fix

### 1. Open Browser Console
- Open the KeKhai603 form page
- Open browser Developer Tools (F12)
- Go to Console tab

### 2. Test Household Bulk Input
1. Click "Nhập hộ gia đình" button
2. Enter test BHXH codes:
   ```
   0123456789
   0123456788
   0123456787
   ```
3. Select "12 tháng"
4. Click "Xem trước" then "Thêm hộ gia đình"

### 3. Watch Console Logs
Look for these debug messages in order:

#### Initial Setup
```
🏠 Starting household bulk input for 3 participants
🔍 Before bulk input - All participants: [...]
```

#### Adding Participants
```
🏠 Adding participant 1/3
🔍 After adding participant 1
🏠 Adding participant 2/3
🔍 After adding participant 2
🏠 Adding participant 3/3
🔍 After adding participant 3
🏠 Waiting for all participants to be added...
🔍 After all participants added
```

#### Setting Data
```
🏠 Setting data for participant 1: BHXH=0123456789, STT hộ=1
🔍 Before setting data for participant 1
🏠 Setting maSoBHXH = "0123456789" for participant 1
📝 handleParticipantChange: Setting maSoBHXH = "0123456789" for participant 1
📝 State update: Participant 1 maSoBHXH changed from "" to "0123456789"
📝 State updated: Participant 1 now has maSoBHXH = "0123456789"
🔍 After setting maSoBHXH for participant 1

🏠 Setting soThangDong = "12" for participant 1
📝 handleParticipantChange: Setting soThangDong = "12" for participant 1
📝 State update: Participant 1 soThangDong changed from "" to "12"
📝 State updated: Participant 1 now has soThangDong = "12"
🔍 After setting soThangDong for participant 1

🏠 Setting STT hộ = "1" for participant 1
📝 handleParticipantChange: Setting sttHo = "1" for participant 1
📝 State update: Participant 1 sttHo changed from "" to "1"
📝 State updated: Participant 1 now has sttHo = "1"
🔍 After setting sttHo for participant 1
```

#### API Search
```
🔍 Starting API search for participant 1 (BHXH: 0123456789)
🔍 Before API search for participant 1
🔄 updateParticipantWithApiData: Updating participant 1 with API data
🔄 Before API update - STT hộ: "1", Months: "12"
🔄 After API update - STT hộ: "1", Months: "12"
🔍 After API search for participant 1
```

#### Final State
```
🏠 Household bulk input completed successfully
🔍 Final state after household bulk input - All participants: [
  { index: 1, sttHo: "1", soThangDong: "12", maSoBHXH: "0123456789", hoTen: "..." },
  { index: 2, sttHo: "2", soThangDong: "12", maSoBHXH: "0123456788", hoTen: "..." },
  { index: 3, sttHo: "3", soThangDong: "12", maSoBHXH: "0123456787", hoTen: "..." }
]
```

### 4. Check UI Table
After the process completes, verify in the participant table:
- **STT hộ column** should show: 1, 2, 3
- **Số tháng column** should show: 12, 12, 12
- **Mã BHXH column** should show the entered codes

### 5. Test DS Type (Ethnic Minority)
1. Change declaration type to DS (ethnic minority)
2. Repeat the household bulk input test
3. **Expected Result**: All participants should have STT hộ = "1"

### 6. Troubleshooting

#### If STT hộ is still empty:
1. Check console for error messages
2. Look for missing debug logs (indicates where the process failed)
3. Check if `updateParticipantWithApiData` is preserving the `sttHo` field

#### If debug logs show correct values but UI doesn't:
1. Check React DevTools for component state
2. Verify the table rendering logic
3. Check if there are any React re-renders clearing the state

#### If API search is overwriting values:
1. Look for the "Before API update" and "After API update" logs
2. Verify that `sttHo` and `soThangDong` are preserved
3. Check if the `updateParticipantWithApiData` function is working correctly

### 7. Manual State Inspection

You can also manually inspect the state by running this in the console:
```javascript
// This will show the current participants state
console.log('Current participants:', window.participants);
```

### 8. Expected Behavior Summary

✅ **Working correctly:**
- STT hộ shows 1, 2, 3 for regular types
- STT hộ shows 1, 1, 1 for DS types
- Values persist after API lookup
- Console logs show proper state transitions

❌ **Still broken:**
- STT hộ shows empty/blank values
- Values disappear after API lookup
- Console logs show state being lost
- Error messages in console

### 9. Common Issues and Solutions

#### Issue: State updates not happening
**Solution:** Check if `handleParticipantChange` is being called correctly

#### Issue: API overwriting manual values
**Solution:** Verify `updateParticipantWithApiData` preserves `sttHo` and `soThangDong`

#### Issue: React re-renders clearing state
**Solution:** Check for unnecessary component re-mounts or state resets

#### Issue: Timing problems
**Solution:** Increase delays between operations or use proper async/await

### 10. Performance Notes

The current implementation includes delays to ensure proper state updates:
- 100ms between field updates
- 100ms between participants
- 200ms after API calls
- 600ms between API calls

These delays ensure data integrity but may slow down large household processing.
