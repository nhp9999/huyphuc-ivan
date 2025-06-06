import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BulkInputModal } from './BulkInputModal';
import { QuickFillModal } from './QuickFillModal';

// Mock data
const mockBulkInputProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  doiTuongThamGia: 'TM'
};

const mockQuickFillProps = {
  isOpen: true,
  onClose: jest.fn(),
  onApply: jest.fn(),
  onApplyAutoIncrement: jest.fn(),
  onApplyBulkBHXH: jest.fn(),
  participantCount: 5,
  doiTuongThamGia: 'TM'
};

describe('BulkInputModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders bulk input modal when open', () => {
    render(<BulkInputModal {...mockBulkInputProps} />);
    
    expect(screen.getByText('Nhập hàng loạt mã BHXH')).toBeInTheDocument();
    expect(screen.getByText('Hướng dẫn nhập liệu:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nhập mã BHXH/)).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<BulkInputModal {...mockBulkInputProps} isOpen={false} />);
    
    expect(screen.queryByText('Nhập hàng loạt mã BHXH')).not.toBeInTheDocument();
  });

  test('handles sample data button', () => {
    render(<BulkInputModal {...mockBulkInputProps} />);
    
    const sampleButton = screen.getByText('Dữ liệu mẫu');
    fireEvent.click(sampleButton);
    
    const textarea = screen.getByPlaceholderText(/Nhập mã BHXH/);
    expect(textarea).toHaveValue(expect.stringContaining('0123456789'));
  });

  test('validates BHXH codes correctly', async () => {
    render(<BulkInputModal {...mockBulkInputProps} />);
    
    const textarea = screen.getByPlaceholderText(/Nhập mã BHXH/);
    const previewButton = screen.getByText('Xem trước');
    
    // Test invalid BHXH code
    fireEvent.change(textarea, { target: { value: '123456789' } }); // 9 digits
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Lỗi dữ liệu:/)).toBeInTheDocument();
    });
  });

  test('parses valid input correctly', async () => {
    render(<BulkInputModal {...mockBulkInputProps} />);
    
    const textarea = screen.getByPlaceholderText(/Nhập mã BHXH/);
    const previewButton = screen.getByText('Xem trước');
    
    // Test valid input
    fireEvent.change(textarea, { 
      target: { value: '0123456789,12,1\n0123456788,6,2' } 
    });
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Đã phân tích thành công 2 mã BHXH/)).toBeInTheDocument();
    });
  });

  test('handles DS participant type correctly', () => {
    render(<BulkInputModal {...mockBulkInputProps} doiTuongThamGia="DS" />);
    
    const sampleButton = screen.getByText('Dữ liệu mẫu');
    fireEvent.click(sampleButton);
    
    const textarea = screen.getByPlaceholderText(/Nhập mã BHXH/);
    // For DS type, sample should not include STT hộ
    expect(textarea.value).not.toContain(',1');
    expect(textarea.value).not.toContain(',2');
  });
});

describe('QuickFillModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders quick fill modal when open', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    expect(screen.getByText('Điền nhanh dữ liệu')).toBeInTheDocument();
    expect(screen.getByText('Số tháng đóng')).toBeInTheDocument();
    expect(screen.getByText('STT hộ')).toBeInTheDocument();
    expect(screen.getByText('Mã số BHXH')).toBeInTheDocument();
  });

  test('disables STT hộ for DS participant type', () => {
    render(<QuickFillModal {...mockQuickFillProps} doiTuongThamGia="DS" />);

    const sttHoButton = screen.getByText('STT hộ').closest('button');
    expect(sttHoButton).toBeDisabled();
    expect(screen.getByText('Không áp dụng cho DS')).toBeInTheDocument();
  });

  test('shows STT hộ mode selection when STT hộ field is selected', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    // Click STT hộ field
    const sttHoButton = screen.getByText('STT hộ').closest('button');
    fireEvent.click(sttHoButton!);

    // Should show mode selection
    expect(screen.getByText('Chế độ điền STT hộ')).toBeInTheDocument();
    expect(screen.getByText('Giá trị cố định')).toBeInTheDocument();
    expect(screen.getByText('Tự động tăng dần')).toBeInTheDocument();
  });

  test('shows auto increment preview when auto mode is selected', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    // Click STT hộ field
    const sttHoButton = screen.getByText('STT hộ').closest('button');
    fireEvent.click(sttHoButton!);

    // Click auto increment mode
    const autoButton = screen.getByText('Tự động tăng dần').closest('button');
    fireEvent.click(autoButton!);

    // Should show preview
    expect(screen.getByText('Xem trước STT hộ tự động')).toBeInTheDocument();
    expect(screen.getByText(/STT hộ sẽ được điền tự động:/)).toBeInTheDocument();
  });

  test('calls onApplyAutoIncrement when auto mode is applied', () => {
    const mockOnApplyAutoIncrement = jest.fn();
    render(<QuickFillModal {...mockQuickFillProps} onApplyAutoIncrement={mockOnApplyAutoIncrement} />);

    // Click STT hộ field
    const sttHoButton = screen.getByText('STT hộ').closest('button');
    fireEvent.click(sttHoButton!);

    // Click auto increment mode
    const autoButton = screen.getByText('Tự động tăng dần').closest('button');
    fireEvent.click(autoButton!);

    // Click apply
    const applyButton = screen.getByText('Điền STT hộ tự động');
    fireEvent.click(applyButton);

    expect(mockOnApplyAutoIncrement).toHaveBeenCalledWith('sttHo', undefined);
  });

  test('shows BHXH input when BHXH field is selected', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    // Click mã BHXH field
    const bhxhButton = screen.getByText('Mã số BHXH').closest('button');
    fireEvent.click(bhxhButton!);

    // Should show BHXH input
    expect(screen.getByText('Nhập mã số BHXH')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập mã số BHXH (tối đa 10 số)')).toBeInTheDocument();
  });

  test('validates BHXH input correctly', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    // Click mã BHXH field
    const bhxhButton = screen.getByText('Mã số BHXH').closest('button');
    fireEvent.click(bhxhButton!);

    // Get input field
    const input = screen.getByPlaceholderText('Nhập mã số BHXH (tối đa 10 số)');

    // Type invalid characters (should be filtered out)
    fireEvent.change(input, { target: { value: 'abc123def456ghi' } });

    // Should only contain numbers and be limited to 10 characters
    expect(input).toHaveValue('1234564');
  });

  test('calls onApply with BHXH value when applied', () => {
    const mockOnApply = jest.fn();
    render(<QuickFillModal {...mockQuickFillProps} onApply={mockOnApply} />);

    // Click mã BHXH field
    const bhxhButton = screen.getByText('Mã số BHXH').closest('button');
    fireEvent.click(bhxhButton!);

    // Should default to single mode, so enter BHXH value
    const input = screen.getByPlaceholderText('Nhập mã số BHXH (tối đa 10 số)');
    fireEvent.change(input, { target: { value: '1234567890' } });

    // Click apply
    const applyButton = screen.getByText('Điền mã BHXH');
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith('maSoBHXH', '1234567890', undefined);
  });

  test('shows BHXH mode selection when BHXH field is selected', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    // Click mã BHXH field
    const bhxhButton = screen.getByText('Mã số BHXH').closest('button');
    fireEvent.click(bhxhButton!);

    // Should show mode selection
    expect(screen.getByText('Chế độ điền mã BHXH')).toBeInTheDocument();
    expect(screen.getByText('Mã đơn lẻ')).toBeInTheDocument();
    expect(screen.getByText('Danh sách mã')).toBeInTheDocument();
  });

  test('shows bulk input when bulk mode is selected', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    // Click mã BHXH field
    const bhxhButton = screen.getByText('Mã số BHXH').closest('button');
    fireEvent.click(bhxhButton!);

    // Click bulk mode
    const bulkButton = screen.getByText('Danh sách mã').closest('button');
    fireEvent.click(bulkButton!);

    // Should show bulk input
    expect(screen.getByText('Nhập danh sách mã số BHXH')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nhập danh sách mã BHXH/)).toBeInTheDocument();
  });

  test('parses bulk BHXH input correctly', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);

    // Click mã BHXH field and switch to bulk mode
    const bhxhButton = screen.getByText('Mã số BHXH').closest('button');
    fireEvent.click(bhxhButton!);

    const bulkButton = screen.getByText('Danh sách mã').closest('button');
    fireEvent.click(bulkButton!);

    // Enter bulk BHXH data
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    fireEvent.change(textarea, {
      target: {
        value: `1234567890
2345678901
abc3456789012def
4567890123`
      }
    });

    // Should show parsed count
    expect(screen.getByText('Đã phát hiện 4 mã BHXH hợp lệ')).toBeInTheDocument();
  });

  test('calls onApplyBulkBHXH when bulk mode is applied', () => {
    const mockOnApplyBulkBHXH = jest.fn();
    render(<QuickFillModal {...mockQuickFillProps} onApplyBulkBHXH={mockOnApplyBulkBHXH} />);

    // Click mã BHXH field and switch to bulk mode
    const bhxhButton = screen.getByText('Mã số BHXH').closest('button');
    fireEvent.click(bhxhButton!);

    const bulkButton = screen.getByText('Danh sách mã').closest('button');
    fireEvent.click(bulkButton!);

    // Enter bulk BHXH data
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    fireEvent.change(textarea, {
      target: {
        value: `1234567890
2345678901
3456789012`
      }
    });

    // Click apply
    const applyButton = screen.getByText('Điền 3 mã BHXH');
    fireEvent.click(applyButton);

    expect(mockOnApplyBulkBHXH).toHaveBeenCalledWith(['1234567890', '2345678901', '3456789012'], undefined);
  });

  test('handles month selection', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);
    
    // Select số tháng đóng field
    const monthField = screen.getByText('Số tháng đóng').closest('button');
    fireEvent.click(monthField!);
    
    // Select 12 months
    const month12 = screen.getByText('12 tháng');
    fireEvent.click(month12);
    
    // Apply button should be enabled
    const applyButton = screen.getByText('Áp dụng');
    expect(applyButton).not.toBeDisabled();
  });

  test('handles participant selection', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);
    
    // Switch to selected mode
    const selectedRadio = screen.getByLabelText(/Chỉ những người được chọn/);
    fireEvent.click(selectedRadio);
    
    // Select some participants
    const participant1 = screen.getByText('1');
    const participant3 = screen.getByText('3');
    fireEvent.click(participant1);
    fireEvent.click(participant3);
    
    // Check if selection works
    expect(participant1.closest('button')).toHaveClass('border-blue-500');
    expect(participant3.closest('button')).toHaveClass('border-blue-500');
  });

  test('calls onApply with correct parameters', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);
    
    // Select field and value
    const monthField = screen.getByText('Số tháng đóng').closest('button');
    fireEvent.click(monthField!);
    
    const month6 = screen.getByText('6 tháng');
    fireEvent.click(month6);
    
    // Apply
    const applyButton = screen.getByText('Áp dụng');
    fireEvent.click(applyButton);
    
    expect(mockQuickFillProps.onApply).toHaveBeenCalledWith(
      'soThangDong',
      '6',
      undefined // all participants
    );
  });

  test('select all and clear selection buttons work', () => {
    render(<QuickFillModal {...mockQuickFillProps} />);
    
    // Switch to selected mode
    const selectedRadio = screen.getByLabelText(/Chỉ những người được chọn/);
    fireEvent.click(selectedRadio);
    
    // Select all
    const selectAllButton = screen.getByText('Chọn tất cả');
    fireEvent.click(selectAllButton);
    
    // All participants should be selected
    for (let i = 1; i <= 5; i++) {
      const participant = screen.getByText(i.toString());
      expect(participant.closest('button')).toHaveClass('border-blue-500');
    }
    
    // Clear selection
    const clearButton = screen.getByText('Bỏ chọn');
    fireEvent.click(clearButton);
    
    // No participants should be selected
    for (let i = 1; i <= 5; i++) {
      const participant = screen.getByText(i.toString());
      expect(participant.closest('button')).not.toHaveClass('border-blue-500');
    }
  });
});

// Integration test
describe('Bulk Input Integration', () => {
  test('bulk input workflow', async () => {
    const mockOnSubmit = jest.fn();
    
    render(<BulkInputModal 
      isOpen={true}
      onClose={jest.fn()}
      onSubmit={mockOnSubmit}
      doiTuongThamGia="TM"
    />);
    
    // Enter valid data
    const textarea = screen.getByPlaceholderText(/Nhập mã BHXH/);
    fireEvent.change(textarea, { 
      target: { value: '0123456789,12,1\n0123456788,6,2\n0123456787,3,1' } 
    });
    
    // Preview
    const previewButton = screen.getByText('Xem trước');
    fireEvent.click(previewButton);
    
    // Wait for preview to show
    await waitFor(() => {
      expect(screen.getByText(/Đã phân tích thành công 3 mã BHXH/)).toBeInTheDocument();
    });
    
    // Submit
    const submitButton = screen.getByText('Thêm 3 người tham gia');
    fireEvent.click(submitButton);
    
    // Check if onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith([
      { maSoBHXH: '0123456789', soThangDong: '12', sttHo: '1' },
      { maSoBHXH: '0123456788', soThangDong: '6', sttHo: '2' },
      { maSoBHXH: '0123456787', soThangDong: '3', sttHo: '1' }
    ]);
  });
});
