import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KeKhai603Header } from '../KeKhai603Header';
import { DanhSachKeKhai } from '../../../../../shared/services/api/supabaseClient';

// Mock data
const mockKeKhaiInfo: DanhSachKeKhai = {
  id: 1,
  ma_ke_khai: 'KK603-001',
  ten_ke_khai: 'Test Declaration',
  trang_thai: 'draft',
  doi_tuong_tham_gia: 'HGD',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  user_id: 'test-user'
};

describe('KeKhai603Header', () => {
  const defaultProps = {
    keKhaiInfo: mockKeKhaiInfo,
    onSaveAll: jest.fn(),
    onSubmitWithPayment: jest.fn(),
    onHouseholdBulkInput: jest.fn(),
    saving: false,
    submittingWithPayment: false,
    savingData: false,
    householdProcessing: false,
    participantCount: 0,
    maxParticipants: 50,
    hasUnsavedChanges: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation Logic', () => {
    it('should disable household bulk input when participant limit is reached', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={50}
          maxParticipants={50}
        />
      );

      const bulkInputButton = screen.getByRole('button', { name: /không thể thêm người tham gia/i });
      expect(bulkInputButton).toBeDisabled();
      expect(bulkInputButton).toHaveTextContent('Đã đạt giới hạn');
    });

    it('should disable save button when no participants', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={0}
        />
      );

      const saveButton = screen.getByRole('button', { name: /lưu tất cả dữ liệu/i });
      expect(saveButton).toBeDisabled();
    });

    it('should disable submit button when no participants', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={0}
        />
      );

      const submitButton = screen.getByRole('button', { name: /nộp kê khai và thanh toán/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable all buttons when conditions are met', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
        />
      );

      const bulkInputButton = screen.getByRole('button', { name: /nhập hộ gia đình/i });
      const saveButton = screen.getByRole('button', { name: /lưu tất cả dữ liệu/i });
      const submitButton = screen.getByRole('button', { name: /nộp kê khai và thanh toán/i });

      expect(bulkInputButton).not.toBeDisabled();
      expect(saveButton).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Status Display', () => {
    it('should display correct status for draft', () => {
      render(<KeKhai603Header {...defaultProps} />);
      expect(screen.getByText('Bản nháp')).toBeInTheDocument();
    });

    it('should display correct status for submitted', () => {
      const submittedKeKhai = { ...mockKeKhaiInfo, trang_thai: 'submitted' };
      render(<KeKhai603Header {...defaultProps} keKhaiInfo={submittedKeKhai} />);
      expect(screen.getByText('Chờ duyệt')).toBeInTheDocument();
    });

    it('should display correct status for completed', () => {
      const completedKeKhai = { ...mockKeKhaiInfo, trang_thai: 'completed' };
      render(<KeKhai603Header {...defaultProps} keKhaiInfo={completedKeKhai} />);
      expect(screen.getByText('Hoàn thành')).toBeInTheDocument();
    });
  });

  describe('Warning Messages', () => {
    it('should show no participants warning', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={0}
        />
      );

      expect(screen.getByText(/kê khai này chưa có người tham gia nào/i)).toBeInTheDocument();
    });

    it('should show participant limit warning', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={50}
          maxParticipants={50}
        />
      );

      expect(screen.getByText(/đã đạt giới hạn tối đa 50 người tham gia/i)).toBeInTheDocument();
    });

    it('should show unsaved changes warning', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
          hasUnsavedChanges={true}
        />
      );

      expect(screen.getByText(/có thay đổi chưa được lưu/i)).toBeInTheDocument();
    });

    it('should show success status when ready', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
          hasUnsavedChanges={false}
        />
      );

      expect(screen.getByText(/kê khai có 5 người tham gia và đã được lưu/i)).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call onHouseholdBulkInput when bulk input button is clicked', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
        />
      );

      const bulkInputButton = screen.getByRole('button', { name: /nhập hộ gia đình/i });
      fireEvent.click(bulkInputButton);

      expect(defaultProps.onHouseholdBulkInput).toHaveBeenCalledTimes(1);
    });

    it('should call onSaveAll when save button is clicked', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
        />
      );

      const saveButton = screen.getByRole('button', { name: /lưu tất cả dữ liệu/i });
      fireEvent.click(saveButton);

      expect(defaultProps.onSaveAll).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmitWithPayment when submit button is clicked', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
        />
      );

      const submitButton = screen.getByRole('button', { name: /nộp kê khai và thanh toán/i });
      fireEvent.click(submitButton);

      expect(defaultProps.onSubmitWithPayment).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading States', () => {
    it('should show loading state for household processing', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          householdProcessing={true}
        />
      );

      expect(screen.getByText('Đang xử lý...')).toBeInTheDocument();
    });

    it('should show loading state for saving', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          saving={true}
          participantCount={5}
        />
      );

      expect(screen.getByText('Đang lưu...')).toBeInTheDocument();
    });

    it('should show loading state for submitting', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          submittingWithPayment={true}
          participantCount={5}
        />
      );

      const submitButton = screen.getByRole('button', { name: /nộp kê khai và thanh toán/i });
      expect(submitButton).toHaveTextContent('Đang xử lý...');
    });
  });

  describe('Participant Counter', () => {
    it('should show participant count badge when participants exist', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
        />
      );

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should not show participant count badge when no participants', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={0}
        />
      );

      // The badge should not be visible
      const badge = screen.queryByText('0');
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={5}
        />
      );

      expect(screen.getByLabelText('Nhập hộ gia đình')).toBeInTheDocument();
      expect(screen.getByLabelText('Lưu tất cả dữ liệu')).toBeInTheDocument();
      expect(screen.getByLabelText('Nộp kê khai và thanh toán')).toBeInTheDocument();
    });

    it('should have proper tooltips', () => {
      render(
        <KeKhai603Header
          {...defaultProps}
          participantCount={50}
          maxParticipants={50}
        />
      );

      const bulkInputButton = screen.getByRole('button', { name: /không thể thêm người tham gia/i });
      expect(bulkInputButton).toHaveAttribute('title', 'Đã đạt giới hạn tối đa 50 người tham gia');
    });
  });
});
