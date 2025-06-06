import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KeKhai603ParticipantTable } from './KeKhai603ParticipantTable';
import { KeKhai603Participant } from '../../../hooks/useKeKhai603Participants';

// Mock the services
jest.mock('../../../../shared/services/location/tinhService');
jest.mock('../../../../shared/services/location/huyenService');
jest.mock('../../../../shared/services/location/xaService');
jest.mock('../../../../shared/services/cskcbService');

// Mock window.innerWidth for responsive testing
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

// Mock MutationObserver
global.MutationObserver = class {
  constructor(callback: MutationCallback) {}
  observe() {}
  disconnect() {}
};

const mockParticipants: KeKhai603Participant[] = [
  {
    id: '1',
    maSoBHXH: 'BH123456789',
    hoTen: 'Nguyễn Văn A',
    ngaySinh: '1990-01-01',
    gioiTinh: 'Nam',
    soDienThoai: '0123456789',
    soTheBHYT: 'HS4010123456789',
    danToc: 'Kinh',
    noiDangKyKCB: 'Bệnh viện Đa khoa Trung ương',
    maBenhVien: 'BV001',
    mucLuong: '2340000',
    tyLeDong: '4.5',
    sttHo: '1',
    soThangDong: '12',
    tienDongThucTe: 1263600,
    tuNgayTheCu: '2023-01-01',
    denNgayTheCu: '2023-12-31',
    ngayBienLai: '2024-01-01',
    maTinhNkq: '01',
    maHuyenNkq: '001',
    maXaNkq: '00001',
    noiNhanHoSo: 'VNPOST Hà Nội'
  }
];

const mockProps = {
  participants: mockParticipants,
  handleParticipantChange: jest.fn(),
  handleParticipantKeyPress: jest.fn(),
  handleAddParticipant: jest.fn(),
  handleRemoveParticipant: jest.fn(),
  handleSaveSingleParticipant: jest.fn(),
  participantSearchLoading: {},
  savingData: false,
  doiTuongThamGia: 'TM',
  onBulkAdd: jest.fn()
};

describe('KeKhai603ParticipantTable Responsive', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset window width
    mockInnerWidth(1024);
  });

  test('renders desktop table layout on large screens', async () => {
    mockInnerWidth(1024);
    
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    await waitFor(() => {
      // Should show table headers
      expect(screen.getByText('Mã BHXH')).toBeInTheDocument();
      expect(screen.getByText('Họ tên')).toBeInTheDocument();
      expect(screen.getByText('STT hộ')).toBeInTheDocument();
      expect(screen.getByText('Số tháng')).toBeInTheDocument();
    });
  });

  test('renders mobile card layout on small screens', async () => {
    mockInnerWidth(600);
    
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    await waitFor(() => {
      // Should show participant name in card format
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
    });
  });

  test('mobile cards have proper touch targets', async () => {
    mockInnerWidth(600);
    
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /lưu/i });
      const deleteButton = screen.getByRole('button', { name: /xóa/i });
      
      // Check minimum touch target size (44px)
      expect(saveButton).toHaveStyle('min-height: 44px');
      expect(deleteButton).toHaveStyle('min-height: 44px');
    });
  });

  test('action buttons are responsive', () => {
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    const addButton = screen.getByRole('button', { name: /thêm người/i });
    const bulkButton = screen.getByRole('button', { name: /nhập hàng loạt/i });
    const quickFillButton = screen.getByRole('button', { name: /điền nhanh/i });
    
    // Check buttons have proper mobile styling
    expect(addButton).toHaveClass('min-h-[44px]');
    expect(bulkButton).toHaveClass('min-h-[44px]');
    expect(quickFillButton).toHaveClass('min-h-[44px]');
  });

  test('mobile card expand/collapse functionality', async () => {
    mockInnerWidth(600);
    
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    await waitFor(() => {
      const expandButton = screen.getByRole('button', { name: /xem chi tiết/i });
      expect(expandButton).toBeInTheDocument();
      
      // Click to expand
      fireEvent.click(expandButton);
      
      // Should show additional fields
      expect(screen.getByText(/ngày sinh/i)).toBeInTheDocument();
      expect(screen.getByText(/giới tính/i)).toBeInTheDocument();
    });
  });

  test('responsive breakpoints work correctly', async () => {
    // Test tablet breakpoint
    mockInnerWidth(800);
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    await waitFor(() => {
      // Should show table on tablet
      expect(screen.getByText('Mã BHXH')).toBeInTheDocument();
    });
    
    // Test mobile breakpoint
    mockInnerWidth(600);
    window.dispatchEvent(new Event('resize'));
    
    await waitFor(() => {
      // Should show cards on mobile
      expect(screen.getByText('#1')).toBeInTheDocument();
    });
  });

  test('dark mode detection works', async () => {
    // Mock dark mode class
    document.documentElement.classList.add('dark');
    
    mockInnerWidth(600);
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    await waitFor(() => {
      // Component should detect dark mode
      const participantCard = document.querySelector('[class*="participantCard"]');
      expect(participantCard).toHaveClass('dark');
    });
    
    // Cleanup
    document.documentElement.classList.remove('dark');
  });

  test('form inputs have proper mobile styling', async () => {
    mockInnerWidth(600);
    
    render(<KeKhai603ParticipantTable {...mockProps} />);
    
    await waitFor(() => {
      const inputs = screen.getAllByRole('textbox');
      const selects = screen.getAllByRole('combobox');
      
      // Check inputs have proper mobile styling
      inputs.forEach(input => {
        expect(input).toHaveStyle('min-height: 44px');
        expect(input).toHaveStyle('font-size: 16px');
      });
      
      selects.forEach(select => {
        expect(select).toHaveStyle('min-height: 44px');
        expect(select).toHaveStyle('font-size: 16px');
      });
    });
  });

  test('empty state is responsive', () => {
    const emptyProps = { ...mockProps, participants: [] };
    
    render(<KeKhai603ParticipantTable {...emptyProps} />);
    
    expect(screen.getByText(/chưa có người tham gia nào/i)).toBeInTheDocument();
  });
});
