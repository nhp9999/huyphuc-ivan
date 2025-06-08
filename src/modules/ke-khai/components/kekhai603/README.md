# KeKhai603 Participant Table Component

## Overview

The `KeKhai603ParticipantTable` component provides a comprehensive table interface for managing participants in the KeKhai603 form. It displays a list of participants with their information and provides functionality for adding, editing, searching, and removing participants.

## Features

### 1. Participant Display
- **Responsive Table**: Displays participant information in a scrollable table format
- **Comprehensive Fields**: Shows all relevant participant information including:
  - Personal info (Name, BHXH code, CCCD, Birth date, Gender)
  - Contact info (Phone number, BHYT card number)
  - Medical facility registration
  - Payment information (Salary, payment amount, months)
  - Administrative info (STT hộ, receipt date)

### 2. Interactive Editing
- **Inline Editing**: Most fields can be edited directly in the table
- **Real-time Updates**: Changes are reflected immediately in the form state
- **Input Validation**: Appropriate input types and constraints for each field

### 3. Search Functionality
- **BHXH Search**: Click the search icon or press Enter in the BHXH field to search for participant information
- **Auto-populate**: Search results automatically fill in participant details
- **Loading States**: Visual feedback during search operations

### 4. Bulk Operations
- **Multi-select**: Checkbox selection for individual participants
- **Select All**: Master checkbox to select/deselect all participants
- **Bulk Delete**: Remove multiple selected participants at once
- **Selection Counter**: Shows number of selected participants

### 5. Individual Actions
- **Save**: Save individual participant data
- **Delete**: Remove individual participant
- **Add New**: Add new participant to the list

## Usage

```tsx
import { KeKhai603ParticipantTable } from './kekhai603/KeKhai603ParticipantTable';

<KeKhai603ParticipantTable
  participants={participants}
  onParticipantChange={handleParticipantChange}
  onParticipantSearch={handleParticipantSearch}
  onSaveSingleParticipant={handleSaveSingleParticipant}
  onRemoveParticipant={handleRemoveParticipant}
  onAddParticipant={handleAddParticipant}
  onBulkRemoveParticipants={handleBulkRemoveParticipants}
  participantSearchLoading={participantSearchLoading}
  savingData={savingData}
  doiTuongThamGia={keKhaiInfo?.doi_tuong_tham_gia}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `participants` | `KeKhai603Participant[]` | Yes | Array of participant data |
| `onParticipantChange` | `(index: number, field: keyof KeKhai603Participant, value: string) => void` | Yes | Handler for field changes |
| `onParticipantSearch` | `(index: number) => void` | Yes | Handler for BHXH search |
| `onSaveSingleParticipant` | `(index: number) => void` | Yes | Handler for saving individual participant |
| `onRemoveParticipant` | `(index: number) => void` | Yes | Handler for removing individual participant |
| `onAddParticipant` | `() => void` | Yes | Handler for adding new participant |
| `onBulkRemoveParticipants` | `(indices: number[]) => void` | No | Handler for bulk removal |
| `participantSearchLoading` | `{ [key: number]: boolean }` | Yes | Loading states for search operations |
| `savingData` | `boolean` | Yes | Global saving state |
| `doiTuongThamGia` | `string` | No | Type of participant group |

## Table Columns

1. **Checkbox**: Selection for bulk operations
2. **STT**: Sequential number
3. **Họ tên**: Full name (editable)
4. **Mã số BHXH**: Social insurance number (editable, searchable)
5. **CCCD**: Citizen ID (editable)
6. **Ngày sinh**: Birth date (editable)
7. **Giới tính**: Gender (dropdown)
8. **Số điện thoại**: Phone number (editable)
9. **Số thẻ BHYT**: Health insurance card number (editable)
10. **Nơi đăng ký KCB**: Medical facility (read-only, populated by search)
11. **Mức lương**: Salary (editable)
12. **Tiền đóng**: Payment amount (calculated, read-only)
13. **Số tháng**: Number of months (editable)
14. **STT hộ**: Household number (dropdown, auto-set for DS type)
15. **Ngày biên lai**: Receipt date (editable)
16. **Thao tác**: Action buttons (Save, Delete)

## Responsive Design

- **Horizontal Scroll**: Table scrolls horizontally on smaller screens
- **Fixed Column Widths**: Ensures consistent layout across different screen sizes
- **Minimum Widths**: Prevents columns from becoming too narrow

## Integration

The component is integrated into the `KeKhai603FormContent` and works seamlessly with:
- **Form State Management**: Uses the same participant state as the main form
- **API Integration**: Connects to BHXH search APIs
- **Database Operations**: Saves/updates participant data in the database
- **Validation**: Respects form validation rules

## Styling

- **Tailwind CSS**: Uses utility classes for styling
- **Dark Mode Support**: Includes dark mode variants
- **Hover Effects**: Interactive feedback for better UX
- **Loading States**: Visual indicators for async operations

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Meets accessibility standards
