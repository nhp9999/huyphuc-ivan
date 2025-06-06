import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HouseholdBulkInputModal } from './HouseholdBulkInputModal';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
  Users: () => <div data-testid="users-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />,
  FileText: () => <div data-testid="file-text-icon" />
}));

const mockCSKCBOptions = [
  { value: 'BV001', ten: 'Bệnh viện Đa khoa Trung ương' },
  { value: 'BV002', ten: 'Bệnh viện Bạch Mai' },
  { value: 'BV003', ten: 'Bệnh viện Việt Đức' }
];

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  doiTuongThamGia: 'TM',
  cskcbOptions: mockCSKCBOptions,
  processing: false,
  progress: null
};

describe('HouseholdBulkInputModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(<HouseholdBulkInputModal {...defaultProps} />);
    
    expect(screen.getByText('Nhập hộ gia đình')).toBeInTheDocument();
    expect(screen.getByText('Nhập hộ gia đình - Hướng dẫn:')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<HouseholdBulkInputModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Nhập hộ gia đình')).not.toBeInTheDocument();
  });

  it('shows processing overlay when processing', () => {
    const progress = { current: 2, total: 5, currentCode: '0123456789' };
    
    render(
      <HouseholdBulkInputModal 
        {...defaultProps} 
        processing={true} 
        progress={progress} 
      />
    );
    
    expect(screen.getByText('Đang xử lý hộ gia đình')).toBeInTheDocument();
    expect(screen.getByText('2 / 5 người')).toBeInTheDocument();
    expect(screen.getByText('Đang xử lý: 0123456789')).toBeInTheDocument();
  });

  it('validates BHXH codes correctly', async () => {
    render(<HouseholdBulkInputModal {...defaultProps} />);
    
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    const previewButton = screen.getByText('Xem trước');
    
    // Test invalid BHXH codes
    fireEvent.change(textarea, { target: { value: '123456789\n01234567890' } });
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Mã BHXH không hợp lệ/)).toBeInTheDocument();
    });
  });

  it('shows preview with valid data', async () => {
    render(<HouseholdBulkInputModal {...defaultProps} />);
    
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    const monthsSelect = screen.getByDisplayValue('12 tháng');
    const previewButton = screen.getByText('Xem trước');
    
    // Enter valid BHXH codes
    fireEvent.change(textarea, { target: { value: '0123456789\n0123456788\n0123456787' } });
    fireEvent.change(monthsSelect, { target: { value: '6' } });
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      expect(screen.getByText('Sẵn sàng thêm 3 người vào hộ gia đình')).toBeInTheDocument();
      expect(screen.getByText('0123456789')).toBeInTheDocument();
      expect(screen.getByText('0123456788')).toBeInTheDocument();
      expect(screen.getByText('0123456787')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data', async () => {
    const mockOnSubmit = jest.fn();
    render(<HouseholdBulkInputModal {...defaultProps} onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    const monthsSelect = screen.getByDisplayValue('12 tháng');
    const medicalFacilitySelect = screen.getByDisplayValue('Chọn nơi KCB (có thể để trống)');
    const previewButton = screen.getByText('Xem trước');
    
    // Enter data
    fireEvent.change(textarea, { target: { value: '0123456789\n0123456788' } });
    fireEvent.change(monthsSelect, { target: { value: '6' } });
    fireEvent.change(medicalFacilitySelect, { target: { value: 'BV001' } });
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      const submitButton = screen.getByText(/Thêm hộ gia đình/);
      fireEvent.click(submitButton);
    });
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      bhxhCodes: ['0123456789', '0123456788'],
      soThangDong: '6',
      maBenhVien: 'BV001',
      tenBenhVien: 'Bệnh viện Đa khoa Trung ương'
    });
  });

  it('handles sample data button', () => {
    render(<HouseholdBulkInputModal {...defaultProps} />);
    
    const sampleButton = screen.getByText('Dữ liệu mẫu');
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    
    fireEvent.click(sampleButton);
    
    expect(textarea).toHaveValue('0123456789\n0123456788\n0123456787\n0123456786\n0123456785');
  });

  it('prevents closing during processing', () => {
    const mockOnClose = jest.fn();
    const progress = { current: 1, total: 3 };
    
    render(
      <HouseholdBulkInputModal 
        {...defaultProps} 
        onClose={mockOnClose}
        processing={true} 
        progress={progress} 
      />
    );
    
    // Try to close during processing - should not work
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows correct STT hộ in preview', async () => {
    render(<HouseholdBulkInputModal {...defaultProps} />);
    
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    const previewButton = screen.getByText('Xem trước');
    
    fireEvent.change(textarea, { target: { value: '0123456789\n0123456788\n0123456787' } });
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      // Check STT hộ values in preview table
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('1'); // First person
      expect(rows[2]).toHaveTextContent('2'); // Second person  
      expect(rows[3]).toHaveTextContent('3'); // Third person
    });
  });

  it('shows household member labels correctly', async () => {
    render(<HouseholdBulkInputModal {...defaultProps} />);
    
    const textarea = screen.getByPlaceholderText(/Nhập danh sách mã BHXH/);
    const previewButton = screen.getByText('Xem trước');
    
    fireEvent.change(textarea, { target: { value: '0123456789\n0123456788' } });
    fireEvent.click(previewButton);
    
    await waitFor(() => {
      expect(screen.getByText('Chủ hộ')).toBeInTheDocument();
      expect(screen.getByText('Thành viên 2')).toBeInTheDocument();
    });
  });
});
