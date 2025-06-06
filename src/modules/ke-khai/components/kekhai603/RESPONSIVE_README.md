# Responsive Participant Table Implementation

## Overview

The "Nhập danh sách người tham gia BHYT" (BHYT Participant Input) interface has been completely redesigned to be fully responsive across all device sizes, providing an optimal user experience on mobile, tablet, and desktop devices.

## Key Features

### 📱 Mobile-First Design
- **Card-based layout** for mobile devices (< 768px)
- **Touch-friendly interfaces** with minimum 44px touch targets
- **Expandable sections** to manage information density
- **Optimized form inputs** with proper font sizes to prevent zoom on iOS

### 💻 Desktop Optimization
- **Full table layout** for desktop screens (> 1024px)
- **Horizontal scrolling** for extensive data
- **Optimized column widths** for better readability
- **Enhanced visual styling** with improved contrast

### 📊 Tablet Support
- **Hybrid approach** showing priority columns
- **Hidden secondary columns** to reduce clutter
- **Better touch targets** for tablet interaction
- **Responsive button layouts**

## Responsive Breakpoints

```css
/* Mobile: < 768px */
- Card-based layout
- Stacked form elements
- Expandable details
- Large touch targets

/* Tablet: 768px - 1023px */
- Table layout with hidden columns
- Priority-based column display
- Improved touch targets
- Horizontal scrolling for overflow

/* Desktop: > 1024px */
- Full table layout
- All columns visible
- Optimized spacing
- Enhanced visual design

/* Large Desktop: > 1440px */
- Expanded table width
- Larger input fields
- Better spacing
```

## Implementation Details

### Mobile Card Component
- **ParticipantMobileCard.tsx**: Dedicated component for mobile view
- **Expandable sections**: Essential fields shown by default, details on demand
- **Action buttons**: Save and Delete with proper touch targets
- **Form validation**: Real-time validation with visual feedback

### Responsive Detection
- **Window resize listener**: Automatically adapts to screen size changes
- **Dark mode detection**: Supports system dark mode preferences
- **Performance optimized**: Efficient event handling and cleanup

### Accessibility Features
- **WCAG 2.1 AA compliance**: Proper contrast ratios and focus indicators
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: Proper ARIA labels and semantic markup
- **High contrast mode**: Enhanced visibility for users with visual impairments
- **Reduced motion**: Respects user motion preferences

## Column Priority System

### Priority 1 (Always Visible)
- STT (Index)
- Mã BHXH (BHXH Code)
- Họ tên (Full Name)
- STT hộ (Household Number)
- Số tháng (Number of Months)
- Thao tác (Actions)

### Priority 2 (Hidden on Mobile)
- Ngày sinh (Birth Date)
- Giới tính (Gender)
- Số ĐT (Phone Number)
- Số thẻ BHYT (BHYT Card Number)
- Nơi đăng ký KCB (Medical Facility)
- Số tiền (Amount)

### Priority 3 (Hidden on Mobile & Small Tablet)
- Dân tộc (Ethnicity)
- Mức lương (Salary Level)
- Tỷ lệ đóng (Contribution Rate)
- Ngày biên lai (Receipt Date)
- Nơi nhận hồ sơ (Document Receiving Location)

### Priority 4 (Desktop Only)
- Từ ngày thẻ cũ (Old Card Start Date)
- Đến ngày thẻ cũ (Old Card End Date)
- Tỉnh NKQ (Province)
- Huyện NKQ (District)
- Xã NKQ (Ward)

## Performance Optimizations

### CSS Optimizations
- **GPU acceleration**: Hardware-accelerated animations
- **Efficient selectors**: Optimized CSS for better performance
- **Minimal reflows**: Reduced layout thrashing
- **Touch scrolling**: Smooth scrolling on mobile devices

### JavaScript Optimizations
- **Event debouncing**: Efficient resize handling
- **Memory cleanup**: Proper event listener cleanup
- **Lazy loading**: Components loaded as needed
- **Memoization**: Optimized re-renders

## Browser Support

### Modern Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Browsers
- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Samsung Internet 14+
- ✅ Firefox Mobile 88+

## Testing

### Responsive Testing
- **Multiple breakpoints**: Tested across all major breakpoints
- **Device simulation**: Tested on various device simulations
- **Real device testing**: Verified on actual mobile and tablet devices
- **Orientation changes**: Supports portrait and landscape modes

### Accessibility Testing
- **Screen reader testing**: Verified with NVDA and JAWS
- **Keyboard navigation**: Full keyboard accessibility
- **Color contrast**: WCAG AA compliant contrast ratios
- **Focus management**: Proper focus indicators and management

## Usage Examples

### Basic Implementation
```tsx
<KeKhai603ParticipantTable
  participants={participants}
  handleParticipantChange={handleParticipantChange}
  handleParticipantKeyPress={handleParticipantKeyPress}
  handleAddParticipant={handleAddParticipant}
  handleRemoveParticipant={handleRemoveParticipant}
  handleSaveSingleParticipant={handleSaveSingleParticipant}
  participantSearchLoading={participantSearchLoading}
  savingData={savingData}
  doiTuongThamGia={doiTuongThamGia}
  onBulkAdd={onBulkAdd}
/>
```

### Mobile Card Usage
```tsx
<ParticipantMobileCard
  participant={participant}
  index={index}
  handleParticipantChange={handleParticipantChange}
  // ... other props
  isDarkMode={isDarkMode}
/>
```

## Future Enhancements

### Planned Features
- **Virtual scrolling**: For large datasets (1000+ participants)
- **Column customization**: User-configurable column visibility
- **Export functionality**: PDF/Excel export with responsive layouts
- **Offline support**: PWA capabilities for offline data entry

### Performance Improvements
- **Code splitting**: Lazy load mobile components
- **Bundle optimization**: Reduce initial bundle size
- **Caching strategies**: Implement intelligent caching
- **Progressive enhancement**: Enhanced features for capable devices

## Maintenance Notes

### CSS Modules
- All styles are scoped using CSS modules
- Responsive breakpoints are centralized
- Dark mode support is built-in
- Print styles are included

### Component Structure
- Clear separation between mobile and desktop layouts
- Reusable responsive patterns
- Consistent naming conventions
- Comprehensive TypeScript types

### Testing Strategy
- Unit tests for responsive behavior
- Integration tests for user interactions
- Visual regression testing
- Performance monitoring
