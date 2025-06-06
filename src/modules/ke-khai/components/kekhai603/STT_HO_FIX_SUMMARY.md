# STT Hộ Field Fix for Household Bulk Input

## Problem Description
When using the "Nhập hộ gia đình" (household bulk input) functionality, the STT hộ (household number) field appeared empty in the participant table after the bulk input process completed, even though the auto-increment logic was correctly setting values (1, 2, 3, etc.).

## Root Cause Analysis
The issue was identified in the `updateParticipantWithApiData` function in `useKeKhai603Participants.ts`. When the BHXH API search was performed for each participant, this function was overwriting participant data and **not preserving** the manually set fields including:

1. **`sttHo`** - The STT hộ field (main issue)
2. **`soThangDong`** - Number of months
3. **`tenBenhVien`** - Medical facility name
4. **`ngayBienLai`** - Receipt date
5. Other manually set fields

## Solution Implemented

### 1. Fixed `updateParticipantWithApiData` Function
**File:** `frontend/src/modules/ke-khai/hooks/useKeKhai603Participants.ts`

**Changes:**
- Modified the function to **preserve manually set fields** when updating with API data
- Added explicit preservation of `sttHo`, `soThangDong`, `tenBenhVien`, and other critical fields
- Changed from overwriting to fallback logic: use existing value if available, otherwise use API value

**Key Fix:**
```typescript
// BEFORE (problematic):
{
  ...p,
  hoTen: apiData.hoTen,
  // ... other fields
  // sttHo was missing - got overwritten!
}

// AFTER (fixed):
{
  ...p,
  hoTen: apiData.hoTen || p.hoTen,
  // ... other fields
  sttHo: p.sttHo, // IMPORTANT: Always preserve STT hộ
  soThangDong: p.soThangDong, // IMPORTANT: Always preserve number of months
  tenBenhVien: p.tenBenhVien, // IMPORTANT: Preserve medical facility name
  // ... other preserved fields
}
```

### 2. Improved Timing in Bulk Input Process
**File:** `frontend/src/modules/ke-khai/components/KeKhai603FormContent.tsx`

**Changes:**
- Added proper `await` for `handleParticipantChange` calls to ensure sequential processing
- Increased delays between operations to allow state updates to complete
- Added comprehensive debugging logs to trace the process

**Key Improvements:**
```typescript
// Sequential processing with proper awaits
await handleParticipantChange(participantIndex, 'maSoBHXH', bhxhCode);
await new Promise(resolve => setTimeout(resolve, 50));

await handleParticipantChange(participantIndex, 'soThangDong', soThangDong);
await new Promise(resolve => setTimeout(resolve, 50));

await handleParticipantChange(participantIndex, 'sttHo', sttHo);
await new Promise(resolve => setTimeout(resolve, 50));
```

### 3. Added Comprehensive Debugging
**Files:** Multiple files

**Changes:**
- Added debug logs in `handleParticipantChange` for STT hộ and months fields
- Added debug logs in `updateParticipantWithApiData` to track before/after states
- Added debug logs in `handleHouseholdBulkAdd` to trace the entire process

## Testing Instructions

### 1. Basic Household Input Test
1. Open the KeKhai603 form in list mode
2. Click "Nhập hộ gia đình" button
3. Enter test BHXH codes:
   ```
   0123456789
   0123456788
   0123456787
   ```
4. Select "12 tháng"
5. Optionally select a medical facility
6. Click "Xem trước" then "Thêm hộ gia đình"
7. **Expected Result:** STT hộ should show 1, 2, 3 respectively

### 2. DS Type Test (Ethnic Minority)
1. Ensure the declaration type is DS (ethnic minority)
2. Follow the same steps as above
3. **Expected Result:** All participants should have STT hộ = "1"

### 3. Debug Console Verification
Open browser console and look for these debug messages:
- `🏠 Setting data for participant X: BHXH=..., STT hộ=...`
- `📝 handleParticipantChange: Setting sttHo = "X" for participant Y`
- `🔄 Before API update - STT hộ: "X", Months: "Y"`
- `🔄 After API update - STT hộ: "X", Months: "Y"`

### 4. Verify Persistence
1. After bulk input, check that STT hộ values remain visible in the table
2. Try editing other fields - STT hộ should not disappear
3. Save the data and reload - STT hộ should persist

## Business Rules Verified

### STT Hộ Assignment
- ✅ **Regular participants**: Auto-increment (1, 2, 3, ...)
- ✅ **DS (ethnic minority)**: All members get STT hộ = 1
- ✅ **Preservation**: Values maintained after API lookup

### Data Flow
- ✅ **Manual input**: STT hộ set during bulk input
- ✅ **API lookup**: Personal data updated, STT hộ preserved
- ✅ **State management**: Proper async handling with delays
- ✅ **UI display**: Values correctly shown in table

## Files Modified

1. **`frontend/src/modules/ke-khai/hooks/useKeKhai603Participants.ts`**
   - Fixed `updateParticipantWithApiData` function
   - Added debugging to `handleParticipantChange`

2. **`frontend/src/modules/ke-khai/components/KeKhai603FormContent.tsx`**
   - Improved `handleHouseholdBulkAdd` timing and error handling
   - Added comprehensive debugging logs

3. **`frontend/src/modules/ke-khai/components/kekhai603/KeKhai603ParticipantTable.tsx`**
   - Updated interface for progress callback
   - Enhanced household bulk input integration

## Debugging Commands

To enable/disable debug logs, look for these console.log patterns:
- `🏠` - Household bulk input process
- `📝` - Participant field changes
- `🔄` - API data updates
- `🔍` - API search process

## Performance Considerations

The fix includes increased delays between operations to ensure proper state updates:
- 50ms delays between field updates
- 100ms delays between participants
- 500ms delay before starting API searches
- 600ms delays between API calls

These delays ensure data integrity but may slightly increase processing time for large households.

## Future Improvements

1. **Batch State Updates**: Combine multiple field updates into single state update
2. **Optimistic UI**: Show expected values immediately, confirm with API
3. **Error Recovery**: Better handling of partial failures
4. **Performance**: Reduce delays once state management is optimized
