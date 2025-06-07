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
import vnpostTokenService from '../../../shared/services/api/vnpostTokenService';
import { KeKhai603Header } from './kekhai603/KeKhai603Header';
import { KeKhai603PersonalInfoForm } from './kekhai603/KeKhai603PersonalInfoForm';
import { KeKhai603CardInfoForm } from './kekhai603/KeKhai603CardInfoForm';
import { KeKhai603PaymentInfoForm } from './kekhai603/KeKhai603PaymentInfoForm';
import { KeKhai603ParticipantTable } from './kekhai603/KeKhai603ParticipantTable';
import { useCSKCBPreloader } from '../hooks/useCSKCBPreloader';
import { useCSKCBContext } from '../contexts/CSKCBContext';

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

  // Custom hooks - order matters for dependencies
  const { toast, showToast, hideToast } = useToast();
  const { searchLoading, participantSearchLoading, apiSummary, searchKeKhai603, searchParticipantData } = useKeKhai603Api();
  const { getCSKCBData } = useCSKCBContext();

  // Get keKhaiInfo first
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

  // Then use keKhaiInfo in dependent hooks
  const { formData, handleInputChange, resetForm } = useKeKhai603FormData(keKhaiInfo?.doi_tuong_tham_gia);

  const {
    participants,
    savingData,
    handleParticipantChange,
    addParticipant,
    removeParticipant,
    removeMultipleParticipants,
    updateParticipantWithApiData,
    saveSingleParticipant
  } = useKeKhai603Participants(keKhaiInfo?.id, keKhaiInfo?.doi_tuong_tham_gia);

  // Track changes to mark as unsaved
  React.useEffect(() => {
    if (participants.length > 0 || Object.values(formData).some(value => value !== '')) {
      setHasUnsavedChanges(true);
    }
  }, [participants, formData]);

  // Helper function to find matching medical facility in CSKCB options
  const findMatchingMedicalFacility = async (facilityName: string) => {
    if (!facilityName) return null;

    try {
      // Get all CSKCB data
      const cskcbData = await getCSKCBData();

      // Try exact match first
      let matchedFacility = cskcbData.find(facility =>
        facility.ten === facilityName
      );

      // If no exact match, try partial match (case insensitive)
      if (!matchedFacility) {
        matchedFacility = cskcbData.find(facility =>
          facility.ten.toLowerCase().includes(facilityName.toLowerCase()) ||
          facilityName.toLowerCase().includes(facility.ten.toLowerCase())
        );
      }

      // If still no match, try matching by keywords
      if (!matchedFacility) {
        const facilityKeywords = facilityName.toLowerCase().split(' ').filter(word => word.length > 2);
        matchedFacility = cskcbData.find(facility => {
          const facilityWords = facility.ten.toLowerCase().split(' ');
          return facilityKeywords.some(keyword =>
            facilityWords.some(word => word.includes(keyword) || keyword.includes(word))
          );
        });
      }

      return matchedFacility;
    } catch (error) {
      console.error('Error finding matching medical facility:', error);
      return null;
    }
  };

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
        // Handle medical facility matching first
        let facilityUpdated = false;
        if (result.data.noiDangKyKCB) {
          const matchedFacility = await findMatchingMedicalFacility(result.data.noiDangKyKCB);
          if (matchedFacility) {
            // Update with matched facility data
            handleInputChange('noiDangKyKCB', matchedFacility.ten);
            handleInputChange('tinhKCB', matchedFacility.ma_tinh);
            facilityUpdated = true;
            console.log('✅ Matched medical facility:', matchedFacility.ten, 'Province:', matchedFacility.ma_tinh);
          } else {
            // Use original facility name if no match found
            handleInputChange('noiDangKyKCB', result.data.noiDangKyKCB);
            console.log('⚠️ No exact match found for facility:', result.data.noiDangKyKCB);
          }
        }

        // Update form data with search results (excluding noiDangKyKCB since we handled it above)
        Object.entries(result.data).forEach(([key, value]) => {
          if (key !== 'noiDangKyKCB') { // Skip noiDangKyKCB since we handled it specially
            handleInputChange(key as any, value as string);
          }
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
          // Update participant medical facility with matched data
          if (facilityUpdated && result.data.noiDangKyKCB) {
            const matchedFacility = await findMatchingMedicalFacility(result.data.noiDangKyKCB);
            if (matchedFacility) {
              handleParticipantChange(0, 'noiDangKyKCB', matchedFacility.ten);
              handleParticipantChange(0, 'tinhKCB', matchedFacility.ma_tinh);
              handleParticipantChange(0, 'maBenhVien', matchedFacility.value);
              handleParticipantChange(0, 'tenBenhVien', matchedFacility.ten);
            }
          } else if (result.data.noiDangKyKCB) {
            handleParticipantChange(0, 'noiDangKyKCB', result.data.noiDangKyKCB);
          }
        }

        // Kiểm tra nếu có cảnh báo về trạng thái thẻ
        const hasCardWarning = result.data.trangThaiThe &&
          result.data.trangThaiThe.includes('⚠️') &&
          result.data.trangThaiThe.toLowerCase().includes('không có thẻ');

        // Create success message based on facility matching and card status
        let successMessage = 'Đã tìm thấy và cập nhật thông tin BHYT!';
        if (facilityUpdated) {
          successMessage += ' Cơ sở KCB đã được tự động chọn.';
        }

        if (hasCardWarning) {
          showToast('Đã tìm thấy thông tin cá nhân! ⚠️ Lưu ý: Người này chưa có thẻ BHYT', 'warning');
        } else {
          showToast(successMessage, 'success');
        }
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
      const result = await searchParticipantData(participant.maSoBHXH, index);

      if (result.success && result.data) {
        // Handle medical facility matching for participant search
        let facilityUpdated = false;
        if (result.data.noiDangKyKCB) {
          const matchedFacility = await findMatchingMedicalFacility(result.data.noiDangKyKCB);
          if (matchedFacility) {
            // Update participant with matched facility data
            result.data.noiDangKyKCB = matchedFacility.ten;
            result.data.tinhKCB = matchedFacility.ma_tinh;
            result.data.maBenhVien = matchedFacility.value;
            result.data.tenBenhVien = matchedFacility.ten;
            facilityUpdated = true;
            console.log(`✅ Matched medical facility for participant ${index + 1}:`, matchedFacility.ten);
          } else {
            console.log(`⚠️ No exact match found for participant ${index + 1} facility:`, result.data.noiDangKyKCB);
          }
        }

        updateParticipantWithApiData(index, result.data);

        // Kiểm tra nếu có cảnh báo về trạng thái thẻ
        const hasCardWarning = result.data.trangThaiThe &&
          result.data.trangThaiThe.includes('⚠️') &&
          result.data.trangThaiThe.toLowerCase().includes('không có thẻ');

        // Create success message based on facility matching and card status
        let successMessage = 'Đã cập nhật thông tin người tham gia!';
        if (facilityUpdated) {
          successMessage += ' Cơ sở KCB đã được tự động chọn.';
        }

        if (hasCardWarning) {
          showToast('Đã cập nhật thông tin cá nhân! ⚠️ Lưu ý: Người này chưa có thẻ BHYT', 'warning');
        } else {
          showToast(successMessage, 'success');
        }
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

  // Debug function to inspect participant state (using callback to get fresh state)
  const debugParticipantState = (label: string, participantIndex?: number) => {
    // Use setTimeout to ensure we get the latest state after React updates
    setTimeout(() => {
      // Get fresh participants from the hook
      const currentParticipants = participants;

      if (participantIndex !== undefined) {
        const participant = currentParticipants[participantIndex];
        console.log(`🔍 ${label} - Participant ${participantIndex + 1}:`, {
          exists: !!participant,
          sttHo: participant?.sttHo,
          soThangDong: participant?.soThangDong,
          maSoBHXH: participant?.maSoBHXH,
          hoTen: participant?.hoTen,
          id: participant?.id
        });
      } else {
        console.log(`🔍 ${label} - All participants (${currentParticipants.length}):`, currentParticipants.map((p, i) => ({
          index: i + 1,
          sttHo: p.sttHo,
          soThangDong: p.soThangDong,
          maSoBHXH: p.maSoBHXH,
          hoTen: p.hoTen,
          id: p.id
        })));
      }
    }, 50);
  };

  // Handle household bulk input
  const handleHouseholdBulkAdd = async (
    bhxhCodes: string[],
    soThangDong: string,
    medicalFacility?: { maBenhVien: string; tenBenhVien: string },
    progressCallback?: (current: number, currentCode?: string) => void
  ) => {
    try {
      console.log(`🏠 Starting household bulk input for ${bhxhCodes.length} participants`);
      debugParticipantState('Before bulk input');
      const startingParticipantCount = participants.length;

      // Add all participants first
      for (let i = 0; i < bhxhCodes.length; i++) {
        progressCallback?.(i, `Đang thêm người ${i + 1}/${bhxhCodes.length}...`);
        console.log(`🏠 Adding participant ${i + 1}/${bhxhCodes.length}`);
        await handleAddParticipant();
        // Small delay to ensure state updates properly
        await new Promise(resolve => setTimeout(resolve, 150));
        debugParticipantState(`After adding participant ${i + 1}`);
      }

      // Wait a bit more for all participants to be added
      console.log(`🏠 Waiting for all participants to be added...`);
      await new Promise(resolve => setTimeout(resolve, 300));
      debugParticipantState('After all participants added');

      // Now populate data for each participant sequentially with improved timing
      for (let i = 0; i < bhxhCodes.length; i++) {
        const bhxhCode = bhxhCodes[i];
        const sttHo = (i + 1).toString(); // Auto-increment STT hộ starting from 1
        const participantIndex = startingParticipantCount + i;

        console.log(`🏠 Setting data for participant ${participantIndex + 1}: BHXH=${bhxhCode}, STT hộ=${sttHo}`);
        debugParticipantState(`Before setting data for participant ${participantIndex + 1}`, participantIndex);

        // Set mã BHXH first
        console.log(`🏠 Setting maSoBHXH = "${bhxhCode}" for participant ${participantIndex + 1}`);
        await handleParticipantChange(participantIndex, 'maSoBHXH', bhxhCode);
        await new Promise(resolve => setTimeout(resolve, 200)); // Longer delay
        debugParticipantState(`After setting maSoBHXH for participant ${participantIndex + 1}`, participantIndex);

        // Set số tháng đóng
        console.log(`🏠 Setting soThangDong = "${soThangDong}" for participant ${participantIndex + 1}`);
        await handleParticipantChange(participantIndex, 'soThangDong', soThangDong);
        await new Promise(resolve => setTimeout(resolve, 200)); // Longer delay
        debugParticipantState(`After setting soThangDong for participant ${participantIndex + 1}`, participantIndex);

        // Set STT hộ (auto-increment for household)
        const finalSttHo = keKhaiInfo?.doi_tuong_tham_gia && keKhaiInfo.doi_tuong_tham_gia.includes('DS') ? '1' : sttHo;
        console.log(`🏠 Setting STT hộ = "${finalSttHo}" for participant ${participantIndex + 1}`);
        await handleParticipantChange(participantIndex, 'sttHo', finalSttHo);
        await new Promise(resolve => setTimeout(resolve, 200)); // Longer delay
        debugParticipantState(`After setting sttHo for participant ${participantIndex + 1}`, participantIndex);

        // Set medical facility if provided
        if (medicalFacility) {
          console.log(`🏠 Setting medical facility for participant ${participantIndex + 1}: ${medicalFacility.tenBenhVien}`);
          await handleParticipantChange(participantIndex, 'maBenhVien', medicalFacility.maBenhVien);
          await new Promise(resolve => setTimeout(resolve, 100));

          await handleParticipantChange(participantIndex, 'tenBenhVien', medicalFacility.tenBenhVien);
          await new Promise(resolve => setTimeout(resolve, 100));

          await handleParticipantChange(participantIndex, 'noiDangKyKCB', medicalFacility.tenBenhVien);
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Longer delay before processing next participant
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Wait for all data to be set before starting API searches
      await new Promise(resolve => setTimeout(resolve, 500));

      // Now try to search for participant data for each
      for (let i = 0; i < bhxhCodes.length; i++) {
        const bhxhCode = bhxhCodes[i];
        const participantIndex = startingParticipantCount + i;

        progressCallback?.(i + 1, `Đang tra cứu ${bhxhCode}...`);

        console.log(`🔍 Starting API search for participant ${participantIndex + 1} (BHXH: ${bhxhCode})`);
        debugParticipantState(`Before API search for participant ${participantIndex + 1}`, participantIndex);

        try {
          await handleParticipantSearch(participantIndex);
          // Wait a bit for the API update to complete
          await new Promise(resolve => setTimeout(resolve, 200));
          debugParticipantState(`After API search for participant ${participantIndex + 1}`, participantIndex);
        } catch (searchError) {
          console.warn(`Could not auto-search for BHXH ${bhxhCode}:`, searchError);
          // Continue with next participant even if search fails
        }

        // Delay between API calls to avoid rate limiting
        if (i < bhxhCodes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 600));
        }
      }

      // Final state check
      console.log(`🏠 Household bulk input completed successfully`);
      debugParticipantState('Final state after household bulk input');
      showToast(`Đã thêm thành công ${bhxhCodes.length} người vào hộ gia đình!`, 'success');
    } catch (error) {
      console.error('Household bulk add error:', error);
      showToast('Có lỗi xảy ra khi thêm hộ gia đình. Vui lòng thử lại.', 'error');
    }
  };

  // Handle refresh token
  const handleRefreshToken = async () => {
    try {
      showToast('Đang làm mới token...', 'info');
      await vnpostTokenService.forceRefresh();
      showToast('Đã làm mới token thành công!', 'success');
    } catch (error) {
      console.error('Error refreshing token:', error);
      showToast('Có lỗi khi làm mới token', 'error');
    }
  };

  // Auto-refresh token when window gains focus (user comes back to tab)
  React.useEffect(() => {
    const handleFocus = async () => {
      // Check if token cache is old and refresh if needed
      try {
        await vnpostTokenService.getLatestToken();
      } catch (error) {
        console.error('Error checking token on focus:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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

        // No QR modal shown immediately after submission
        // QR code will be generated and displayed after synthesis staff approval
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

  // Handle bulk remove participants
  const handleBulkRemoveParticipants = async (indices: number[]) => {
    try {
      await removeMultipleParticipants(indices);
      const count = indices.length;
      showToast(`Đã xóa ${count} người tham gia thành công!`, 'success');
    } catch (error) {
      console.error('Bulk remove participants error:', error);
      showToast('Có lỗi xảy ra khi xóa người tham gia. Vui lòng thử lại.', 'error');
    }
  };

  // Handle save single participant
  const handleSaveSingleParticipant = async (index: number) => {
    try {
      const result = await saveSingleParticipant(index);
      if (result.success) {
        showToast(result.message, 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Save single participant error:', error);
      showToast('Có lỗi xảy ra khi lưu người tham gia. Vui lòng thử lại.', 'error');
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
          onRefreshToken={handleRefreshToken}
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
                  doiTuongThamGia={keKhaiInfo?.doi_tuong_tham_gia}
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
                handleBulkRemoveParticipants={handleBulkRemoveParticipants}
                handleSaveSingleParticipant={handleSaveSingleParticipant}
                participantSearchLoading={participantSearchLoading}
                savingData={savingData}
                doiTuongThamGia={keKhaiInfo?.doi_tuong_tham_gia}
                onBulkAdd={undefined}
                onHouseholdBulkAdd={handleHouseholdBulkAdd}
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
                handleBulkRemoveParticipants={handleBulkRemoveParticipants}
                handleSaveSingleParticipant={handleSaveSingleParticipant}
                participantSearchLoading={participantSearchLoading}
                savingData={savingData}
                doiTuongThamGia={keKhaiInfo?.doi_tuong_tham_gia}
                onBulkAdd={undefined}
                onHouseholdBulkAdd={handleHouseholdBulkAdd}
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
