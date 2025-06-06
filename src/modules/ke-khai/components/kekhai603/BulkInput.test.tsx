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
  });

  test('disables STT hộ for DS participant type', () => {
    render(<QuickFillModal {...mockQuickFillProps} doiTuongThamGia="DS" />);
    
    const sttHoButton = screen.getByText('STT hộ').closest('button');
    expect(sttHoButton).toBeDisabled();
    expect(screen.getByText('Không áp dụng cho DS')).toBeInTheDocument();
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
