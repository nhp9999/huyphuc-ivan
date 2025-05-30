import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import Toast from '../components/Toast';
import { useBhytFormData } from '../hooks/useBhytFormData';
import { useBhytParticipants } from '../hooks/useBhytParticipants';
import { useBhytApi } from '../hooks/useBhytApi';
import { useBhytDeclaration } from '../hooks/useBhytDeclaration';
import { useToast } from '../hooks/useToast';
import { BhytDeclarationHeader } from '../components/bhyt/BhytDeclarationHeader';
import { BhytPersonalInfoForm } from '../components/bhyt/BhytPersonalInfoForm';
import { BhytCardInfoForm } from '../components/bhyt/BhytCardInfoForm';
import { BhytPaymentInfoForm } from '../components/bhyt/BhytPaymentInfoForm';
import { BhytParticipantTable } from '../components/bhyt/BhytParticipantTable';
import { BhytListModeTable } from '../components/bhyt/BhytListModeTable';

const BhytDeclaration: React.FC = () => {
  const { pageParams } = useNavigation();

  // Custom hooks
  const { formData, handleInputChange, resetForm } = useBhytFormData();
  const { toast, showToast, hideToast } = useToast();
  const { searchLoading, apiSummary, searchBhytForDeclaration, searchParticipantData } = useBhytApi();
  const {
    keKhaiInfo,
    saving,
    submitting,
    inputMode,
    setInputMode,
    initializeKeKhai,
    submitDeclaration,
    saveAllParticipants
  } = useBhytDeclaration(pageParams);

  const {
    participants,
    savingData,
    handleParticipantChange,
    addParticipant,
    removeParticipant,
    updateParticipantWithApiData
  } = useBhytParticipants(keKhaiInfo?.id);

  // Show message when participants are loaded
  React.useEffect(() => {
    if (participants.length > 0 && participants[0].id > 0) {
      showToast(`Đã tải ${participants.length} người tham gia từ database`, 'success');
    }
  }, [participants.length]);

  // Show success message when keKhaiInfo is loaded
  React.useEffect(() => {
    if (keKhaiInfo) {
      showToast(`Kê khai ${keKhaiInfo.ma_ke_khai} đã sẵn sàng`, 'success');
    }
  }, [keKhaiInfo]);

  // Handle search for main form
  const handleSearch = async () => {
    if (!formData.maSoBHXH.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    try {
      const result = await searchBhytForDeclaration(formData.maSoBHXH);

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
      showToast('Đang khởi tạo kê khai, vui lòng đợi...', 'warning');
      try {
        // Try to initialize if not already done
        const result = await initializeKeKhai();
        if (!result.success) {
          showToast(result.message, 'error');
          return;
        }
      } catch (error) {
        console.error('Initialization error:', error);
        showToast('Không thể khởi tạo kê khai. Vui lòng thử lại.', 'error');
        return;
      }
    }

    try {
      // Pass both participants and form data to save function
      const result = await saveAllParticipants(participants, formData);
      if (result.success) {
        showToast(result.message, 'success');
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
      showToast('Đang khởi tạo kê khai, vui lòng đợi...', 'warning');
      try {
        // Try to initialize if not already done
        const result = await initializeKeKhai();
        if (!result.success) {
          showToast(result.message, 'error');
          return;
        }
      } catch (error) {
        console.error('Initialization error:', error);
        showToast('Không thể khởi tạo kê khai. Vui lòng thử lại.', 'error');
        return;
      }
    }

    try {
      const result = await submitDeclaration();
      if (result.success) {
        showToast(result.message, 'success');
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
      showToast('Đang khởi tạo kê khai, vui lòng đợi...', 'warning');
      try {
        // Try to initialize if not already done
        const result = await initializeKeKhai();
        if (!result.success) {
          showToast(result.message, 'error');
          return;
        }
      } catch (error) {
        console.error('Initialization error:', error);
        showToast('Không thể khởi tạo kê khai. Vui lòng thử lại.', 'error');
        return;
      }
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
    if (participants.length <= 1) {
      showToast('Phải có ít nhất một người tham gia trong kê khai', 'warning');
      return;
    }

    try {
      await removeParticipant(index);
      showToast('Đã xóa người tham gia thành công!', 'success');
    } catch (error) {
      console.error('Remove participant error:', error);
      showToast('Có lỗi xảy ra khi xóa người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <BhytDeclarationHeader
          keKhaiInfo={keKhaiInfo}
          inputMode={inputMode}
          setInputMode={setInputMode}
          apiSummary={apiSummary}
        />

        {/* Main Content */}
        <div className="space-y-6">
          {inputMode === 'form' ? (
            <>
              {/* Personal Information Form */}
              <BhytPersonalInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
                handleKeyPress={handleKeyPress}
                searchLoading={searchLoading}
                resetForm={resetForm}
              />

              {/* Card Information Form */}
              <BhytCardInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
              />

              {/* Payment Information Form */}
              <BhytPaymentInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </>
          ) : (
            /* List Mode Table */
            <BhytListModeTable
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
            <BhytParticipantTable
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
        </div>

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};

export default BhytDeclaration;
