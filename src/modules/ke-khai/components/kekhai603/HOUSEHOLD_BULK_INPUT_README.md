# Household Bulk Input Feature

## Overview
The Household Bulk Input feature allows users to efficiently add multiple family members to a BHXH declaration by automatically handling STT hộ (household number) incrementing and bulk BHXH API lookups.

## Features

### 1. **Household-Specific Input Interface**
- Dedicated modal for household input (`HouseholdBulkInputModal`)
- Input field for multiple BHXH codes (one per line)
- Common months selection for all family members
- Optional medical facility selection for all members
- Auto-increment STT hộ starting from 1

### 2. **Auto-increment STT hộ**
- First family member gets STT hộ = 1 (household head)
- Second family member gets STT hộ = 2
- Third family member gets STT hộ = 3
- And so on...
- For DS (ethnic minority) type: all members get STT hộ = 1 (as per business rules)

### 3. **Bulk BHXH API Processing**
- Sequential API calls for each BHXH code
- Auto-populate participant data from API responses
- Progress tracking with current participant being processed
- Error handling for individual API failures
- Rate limiting to avoid overwhelming the API

### 4. **Progress Tracking**
- Real-time progress indicator during processing
- Shows current participant being processed
- Displays progress as "X / Y người"
- Non-blocking UI with processing overlay

## Usage

### Basic Usage
1. Click "Nhập hộ gia đình" button in the participant table
2. Enter BHXH codes (one per line) in the text area
3. Select number of months (3, 6, or 12)
4. Optionally select a medical facility for all members
5. Click "Xem trước" to preview the data
6. Click "Thêm hộ gia đình" to process

### Input Format
```
0123456789
0123456788
0123456787
0123456786
```

### Sample Data
The modal provides sample data for testing:
```
0123456789
0123456788
0123456787
0123456786
0123456785
```

## Technical Implementation

### Components
- `HouseholdBulkInputModal.tsx` - Main modal component
- `KeKhai603ParticipantTable.tsx` - Updated with household bulk input button
- `KeKhai603FormContent.tsx` - Contains the bulk processing logic

### Key Functions
- `handleHouseholdBulkAdd()` - Main processing function
- `handleHouseholdBulkInput()` - Modal submission handler
- Progress callback for real-time updates

### API Integration
- Uses existing `handleParticipantSearch()` function
- Leverages `searchParticipantData()` from `useKeKhai603Api`
- Maintains compatibility with existing BHXH API authentication

## Business Rules

### STT hộ Assignment
- **Regular participants**: Auto-increment (1, 2, 3, ...)
- **DS (ethnic minority)**: All members get STT hộ = 1

### Data Population
- BHXH code: From user input
- Months: Common value for all members
- Medical facility: Optional, applied to all if selected
- Personal data: Auto-populated from BHXH API
- STT hộ: Auto-assigned based on order

### Error Handling
- Invalid BHXH codes are rejected with validation messages
- API failures for individual participants don't stop the entire process
- Progress continues even if some lookups fail
- User is notified of successful completion

## Performance Considerations

### Rate Limiting
- 500ms delay between API calls to avoid overwhelming the server
- Sequential processing to maintain data integrity
- Progress tracking to keep user informed

### Memory Management
- State cleanup after processing completion
- Proper error handling to prevent memory leaks
- Modal state reset on close

## Future Enhancements

### Potential Improvements
1. **Batch API Processing**: Process multiple BHXH codes in a single API call
2. **Retry Logic**: Automatic retry for failed API calls
3. **Data Validation**: Enhanced validation for BHXH codes
4. **Export/Import**: Save and load household data
5. **Templates**: Pre-defined household templates

### Integration Points
- Payment calculation for household totals
- Excel export with household grouping
- Household-specific reporting features

## Testing

### Test Scenarios
1. **Valid household input**: Multiple valid BHXH codes
2. **Mixed validity**: Some valid, some invalid codes
3. **API failures**: Network issues during processing
4. **Large households**: 10+ family members
5. **DS type households**: Ethnic minority participants
6. **Medical facility selection**: Common facility for all members

### Sample Test Data
```
Valid BHXH codes for testing:
0123456789
0123456788
0123456787

Invalid codes for error testing:
123456789 (9 digits)
01234567890 (11 digits)
abcd123456 (contains letters)
```

## Accessibility

### Features
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Mobile-responsive design
- Clear error messages and instructions

### WCAG 2.1 AA Compliance
- Proper heading structure
- Alt text for icons
- Focus management
- Color contrast requirements
- Keyboard accessibility
