import React from 'react';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import Toast from '../../../shared/components/ui/Toast';
import { useKeKhai603FormData } from '../hooks/useKeKhai603FormData';
import { useKeKhai603Participants } from '../hooks/useKeKhai603Participants';
import { useKeKhai603Api } from '../hooks/useKeKhai603Api';
import { useKeKhai603 } from '../hooks/useKeKhai603';
import { useToast } from '../../../shared/hooks/useToast';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';
import PaymentQRModal from './PaymentQRModal';
import { KeKhai603Header } from './kekhai603/KeKhai603Header';
import { KeKhai603PersonalInfoForm } from './kekhai603/KeKhai603PersonalInfoForm';
import { KeKhai603CardInfoForm } from './kekhai603/KeKhai603CardInfoForm';
import { KeKhai603PaymentInfoForm } from './kekhai603/KeKhai603PaymentInfoForm';
import { KeKhai603ParticipantTable } from './kekhai603/KeKhai603ParticipantTable';
import { useCSKCBPreloader } from '../hooks/useCSKCBPreloader';

interface KeKhai603FormContentProps {
  pageParams: any;
}

export const KeKhai603FormContent: React.FC<KeKhai603FormContentProps> = ({ pageParams }) => {
  // Preload CSKCB data for better performance
  useCSKCBPreloader();

  // State for tracking save status
  const [lastSavedTime, setLastSavedTime] = React.useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // State for payment modal
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<ThanhToan | null>(null);

  // Custom hooks
  const { formData, handleInputChange, resetForm } = useKeKhai603FormData();
  const { toast, showToast, hideToast } = useToast();
  const { searchLoading, apiSummary, searchKeKhai603, searchParticipantData } = useKeKhai603Api();
  const {
    keKhaiInfo,
    saving,
    submitting,
    inputMode,
    setInputMode,
    initializeKeKhai,
    createNewKeKhai,
    submitDeclaration,
    saveAllParticipants
  } = useKeKhai603(pageParams);

  const {
    participants,
    savingData,
    handleParticipantChange,
    addParticipant,
    removeParticipant,
    updateParticipantWithApiData
  } = useKeKhai603Participants(keKhaiInfo?.id);

  // Track changes to mark as unsaved
  React.useEffect(() => {
    if (participants.length > 0 || Object.values(formData).some(value => value !== '')) {
      setHasUnsavedChanges(true);
    }
  }, [participants, formData]);

  // Show message when participants are loaded
  React.useEffect(() => {
    if (participants.length > 0 && participants[0].id > 0) {
      showToast(`Đã tải ${participants.length} người tham gia từ database`, 'success');
      setHasUnsavedChanges(false); // Data loaded from DB is considered saved
    }
  }, [participants.length]);

  // Show success message when keKhaiInfo is loaded
  React.useEffect(() => {
    if (keKhaiInfo) {
      showToast(`Kê khai ${keKhaiInfo.ma_ke_khai} đã sẵn sàng`, 'success');
      setHasUnsavedChanges(false); // Initial load is considered saved
    }
  }, [keKhaiInfo]);

  // Handle search for main form
  const handleSearch = async () => {
    if (!formData.maSoBHXH.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    try {
      const result = await searchKeKhai603(formData.maSoBHXH);

      if (result.success && result.data) {
        // Update form data with search results
        Object.entries(result.data).forEach(([key, value]) => {
          handleInputChange(key as any, value as string);
        });

        // Also update the first participant with the same data
        if (participants.length > 0) {
          if (result.data.hoTen) {
            handleParticipantChange(0, 'hoTen', result.data.hoTen);
          }
          if ((result.data as any).maSoBHXH) {
            handleParticipantChange(0, 'maSoBHXH', (result.data as any).maSoBHXH);
          }
          if (result.data.ngaySinh) {
            handleParticipantChange(0, 'ngaySinh', result.data.ngaySinh);
          }
          if (result.data.gioiTinh) {
            handleParticipantChange(0, 'gioiTinh', result.data.gioiTinh);
          }
          if (result.data.noiDangKyKCB) {
            handleParticipantChange(0, 'noiDangKyKCB', result.data.noiDangKyKCB);
          }
        }

        showToast('Đã tìm thấy và cập nhật thông tin BHYT!', 'success');
      } else {
        showToast(result.message || 'Không tìm thấy thông tin BHYT', 'warning');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.', 'error');
    }
  };

  // Handle search for participant
  const handleParticipantSearch = async (index: number) => {
    const participant = participants[index];
    if (!participant?.maSoBHXH?.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    try {
      const result = await searchParticipantData(participant.maSoBHXH);

      if (result.success && result.data) {
        updateParticipantWithApiData(index, result.data);
        showToast('Đã cập nhật thông tin người tham gia!', 'success');
      } else {
        showToast(result.message || 'Không tìm thấy thông tin BHYT', 'warning');
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.', 'error');
    }
  };

  // Handle key press for search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle participant key press for search
  const handleParticipantKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleParticipantSearch(index);
    }
  };

  // Handle save all data
  const handleSaveAll = async () => {
    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai để lưu. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    try {
      // Pass both participants and form data to save function
      const result = await saveAllParticipants(participants, formData);
      if (result.success) {
        showToast(result.message, 'success');
        // Mark as saved
        setHasUnsavedChanges(false);
        setLastSavedTime(new Date());
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.', 'error');
    }
  };

  // Handle submit declaration
  const handleSubmit = async () => {
    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai để nộp. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    try {
      const result = await submitDeclaration();
      if (result.success) {
        showToast(result.message, 'success');

        // Hiển thị QR modal nếu có payment được tạo
        if (result.payment) {
          setSelectedPayment(result.payment);
          setShowPaymentModal(true);
        }
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast('Có lỗi xảy ra khi nộp kê khai. Vui lòng thử lại.', 'error');
    }
  };

  // Handle add participant
  const handleAddParticipant = async () => {
    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    try {
      await addParticipant();
      showToast('Đã thêm người tham gia mới thành công!', 'success');
    } catch (error) {
      console.error('Add participant error:', error);
      showToast('Có lỗi xảy ra khi thêm người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  // Handle remove participant
  const handleRemoveParticipant = async (index: number) => {
    try {
      await removeParticipant(index);
      showToast('Đã xóa người tham gia thành công!', 'success');
    } catch (error) {
      console.error('Remove participant error:', error);
      showToast('Có lỗi xảy ra khi xóa người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  // Handle create new declaration
  const handleCreateNewKeKhai = async () => {
    try {
      const result = await createNewKeKhai();
      if (result.success) {
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Create new ke khai error:', error);
      showToast('Có lỗi xảy ra khi tạo kê khai mới. Vui lòng thử lại.', 'error');
    }
  };

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  // Handle payment confirmed
  const handlePaymentConfirmed = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    showToast('Thanh toán đã được xác nhận thành công!', 'success');
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <KeKhai603Header
          keKhaiInfo={keKhaiInfo}
          inputMode={inputMode}
          setInputMode={setInputMode}
          apiSummary={apiSummary}
        />

      {/* Main Content */}
      <div className="space-y-6">
        {!keKhaiInfo ? (
          /* No Declaration Info - Show Create Button */
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Chưa có thông tin kê khai
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                Để sử dụng chức năng này, bạn cần tạo kê khai mới hoặc truy cập từ danh sách kê khai có sẵn.
              </p>
            </div>
            <button
              onClick={handleCreateNewKeKhai}
              disabled={saving}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <span>Tạo kê khai mới (Test)</span>
              )}
            </button>
          </div>
        ) : (
          <>
            {inputMode === 'form' ? (
              <>
                {/* Personal Information Form */}
                <KeKhai603PersonalInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSearch={handleSearch}
                  handleKeyPress={handleKeyPress}
                  searchLoading={searchLoading}
                />

                {/* Card Information Form */}
                <KeKhai603CardInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />

                {/* Payment Information Form */}
                <KeKhai603PaymentInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
              </>
            ) : (
              /* List Mode Table */
              <KeKhai603ParticipantTable
                participants={participants}
                handleParticipantChange={handleParticipantChange}
                handleParticipantKeyPress={handleParticipantKeyPress}
                handleAddParticipant={handleAddParticipant}
                handleRemoveParticipant={handleRemoveParticipant}
                searchLoading={searchLoading}
                savingData={savingData}
              />
            )}

            {/* Participant Table (always shown in form mode) */}
            {inputMode === 'form' && (
              <KeKhai603ParticipantTable
                participants={participants}
                handleParticipantChange={handleParticipantChange}
                handleParticipantKeyPress={handleParticipantKeyPress}
                handleAddParticipant={handleAddParticipant}
                handleRemoveParticipant={handleRemoveParticipant}
                searchLoading={searchLoading}
                savingData={savingData}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveAll}
                disabled={saving || savingData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving || savingData ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Ghi dữ liệu</span>
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting || saving || savingData}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang nộp...</span>
                  </>
                ) : (
                  <span>Nộp kê khai</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/* Payment QR Modal */}
      {showPaymentModal && selectedPayment && (
        <PaymentQRModal
          payment={selectedPayment}
          onClose={handlePaymentModalClose}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </div>
  );
};
