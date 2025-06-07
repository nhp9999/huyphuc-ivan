import React from 'react';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import Toast from '../../../shared/components/ui/Toast';
import { useKeKhai603FormData } from '../hooks/useKeKhai603FormData';
import { useKeKhai603Participants } from '../hooks/useKeKhai603Participants';
import { useKeKhai603Api } from '../hooks/useKeKhai603Api';
import { useKeKhai603 } from '../hooks/useKeKhai603';
import { useToast } from '../../../shared/hooks/useToast';
import { ThanhToan, supabase } from '../../../shared/services/api/supabaseClient';
import PaymentQRModal from './PaymentQRModal';
import vnpostTokenService from '../../../shared/services/api/vnpostTokenService';
import { KeKhai603Header } from './kekhai603/KeKhai603Header';
import { KeKhai603PersonalInfoForm } from './kekhai603/KeKhai603PersonalInfoForm';
import { KeKhai603CardInfoForm } from './kekhai603/KeKhai603CardInfoForm';
import { KeKhai603PaymentInfoForm } from './kekhai603/KeKhai603PaymentInfoForm';
import { KeKhai603ParticipantTable } from './kekhai603/KeKhai603ParticipantTable';
import { useCSKCBPreloader } from '../hooks/useCSKCBPreloader';
import { useCSKCBContext } from '../contexts/CSKCBContext';
import { keKhaiService } from '../services/keKhaiService';

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

  // State for save participant functionality
  const [savingParticipant, setSavingParticipant] = React.useState(false);

  // State for Fix Error functionality (moved from participant table)
  const [fixErrorProcessing, setFixErrorProcessing] = React.useState(false);
  const [fixErrorPhase, setFixErrorPhase] = React.useState<'idle' | 'testing' | 'waiting' | 'refreshing'>('idle');
  const [waitingCountdown, setWaitingCountdown] = React.useState(0);

  // Custom hooks - order matters for dependencies
  const { toast, showToast, hideToast } = useToast();
  const { searchLoading, participantSearchLoading, apiSummary, searchKeKhai603, searchParticipantData } = useKeKhai603Api();
  const { getCSKCBData } = useCSKCBContext();

  // Get keKhaiInfo first
  const {
    keKhaiInfo,
    saving,
    submitting,
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
    loadParticipants,
    handleParticipantChange,
    addParticipant,
    removeParticipant,
    removeMultipleParticipants,
    updateParticipantWithApiData,
    saveSingleParticipant,
    saveParticipantFromForm
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
      console.warn(`⚠️ No BHXH code for participant at index ${index}:`, participant);
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

  // Handle household bulk input (new approach using saveParticipantFromForm)
  const handleHouseholdBulkAddNew = async (
    bhxhCodes: string[],
    soThangDong: string,
    medicalFacility?: { maBenhVien: string; tenBenhVien: string },
    progressCallback?: (current: number, currentCode?: string) => void
  ) => {
    try {
      console.log(`🏠 Starting NEW household bulk input for ${bhxhCodes.length} participants`);

      let successCount = 0;
      let errorCount = 0;

      // Process each participant individually using saveParticipantFromForm
      for (let i = 0; i < bhxhCodes.length; i++) {
        const bhxhCode = bhxhCodes[i];
        const sttHo = keKhaiInfo?.doi_tuong_tham_gia && keKhaiInfo.doi_tuong_tham_gia.includes('DS') ? '1' : (i + 1).toString();

        progressCallback?.(i + 1, `Đang lưu ${bhxhCode}...`);
        console.log(`🏠 Processing participant ${i + 1}/${bhxhCodes.length}: ${bhxhCode}`);

        let participantSaved = false;
        let savedParticipantId: string | null = null;

        try {
          // Create form data for this participant
          const participantFormData = {
            maSoBHXH: bhxhCode,
            soThangDong: soThangDong,
            sttHo: sttHo,
            hoTen: '', // Will be filled by API lookup
            ngaySinh: '',
            gioiTinh: 'Nam',
            soCCCD: '',
            noiDangKyKCB: medicalFacility?.tenBenhVien || '',
            soDienThoai: '',
            soTheBHYT: '',
            quocTich: 'VN',
            danToc: '',
            maTinhKS: '',
            maHuyenKS: '',
            maXaKS: '',
            maTinhNkq: '',
            maHuyenNkq: '',
            maXaNkq: '',
            tinhKCB: '',
            maBenhVien: medicalFacility?.maBenhVien || '',
            tenBenhVien: medicalFacility?.tenBenhVien || '',
            tuNgayTheCu: '',
            denNgayTheCu: '',
            tuNgayTheMoi: '',
            denNgayTheMoi: '',
            ngayBienLai: new Date().toISOString().split('T')[0],
            maHoGiaDinh: '',
            phuongAn: ''
          };

          console.log(`📝 Form data for participant ${i + 1}:`, participantFormData);

          // Save participant using the new approach
          const result = await saveParticipantFromForm(participantFormData);

          if (result.success) {
            console.log(`✅ Successfully saved participant ${i + 1}: ${bhxhCode}`);
            successCount++;
            participantSaved = true;
            savedParticipantId = result.participant?.id?.toString() || null;

            // Refresh participants list to get the newly saved participant
            console.log(`🔄 Refreshing participants list to include newly saved participant...`);
            await loadParticipants();
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for state to update

            // Try to lookup participant data from API to get real name and info
            try {
              progressCallback?.(i + 1, `Đang tra cứu thông tin ${bhxhCode}...`);
              console.log(`🔍 Looking up data for ${bhxhCode}...`);

              // Call API search directly with BHXH code
              console.log(`🚀 Direct API search for BHXH: ${bhxhCode}`);
              const directSearchResult = await searchParticipantData(bhxhCode, -1); // Use -1 as placeholder index

              if (directSearchResult.success && directSearchResult.data) {
                console.log(`✅ Direct API search successful for ${bhxhCode}:`, directSearchResult.data);

                // Now update the participant directly in database with API data
                if (savedParticipantId) {
                  console.log(`💾 Updating participant ${savedParticipantId} in database with API data...`);

                  try {
                    // Prepare API data for database update
                    const apiUpdateData: any = {
                      ho_ten: directSearchResult.data.hoTen || '',
                      ngay_sinh: directSearchResult.data.ngaySinh || undefined,
                      gioi_tinh: directSearchResult.data.gioiTinh || 'Nam',
                      so_cccd: directSearchResult.data.soCCCD || undefined,
                      so_dien_thoai: directSearchResult.data.soDienThoai || undefined,
                      so_the_bhyt: directSearchResult.data.soTheBHYT || undefined,
                      dan_toc: directSearchResult.data.danToc || undefined,
                      quoc_tich: directSearchResult.data.quocTich || 'VN',
                      noi_dang_ky_kcb: directSearchResult.data.noiDangKyKCB || undefined,
                      ma_tinh_ks: directSearchResult.data.maTinhKS || undefined,
                      ma_huyen_ks: directSearchResult.data.maHuyenKS || undefined,
                      ma_xa_ks: directSearchResult.data.maXaKS || undefined,
                      ma_tinh_nkq: directSearchResult.data.maTinhNkq || undefined,
                      ma_huyen_nkq: directSearchResult.data.maHuyenNkq || undefined,
                      ma_xa_nkq: directSearchResult.data.maXaNkq || undefined,
                      noi_nhan_ho_so: directSearchResult.data.noiNhanHoSo || undefined,
                      ma_ho_gia_dinh: directSearchResult.data.maHoGiaDinh || undefined,
                      phuong_an: directSearchResult.data.phuongAn || undefined,
                      updated_at: new Date().toISOString()
                    };

                    // Clean null/undefined values
                    Object.keys(apiUpdateData).forEach(key => {
                      if (apiUpdateData[key] === null || apiUpdateData[key] === undefined || apiUpdateData[key] === '') {
                        delete apiUpdateData[key];
                      }
                    });

                    console.log(`📝 API update data:`, apiUpdateData);

                    // Update participant in database using keKhaiService
                    const updateResult = await keKhaiService.updateNguoiThamGia(parseInt(savedParticipantId), apiUpdateData);
                    console.log(`✅ API data saved to database for ${bhxhCode}:`, updateResult);

                    // Refresh participants list again to show updated data
                    await loadParticipants();
                  } catch (updateError) {
                    console.error(`❌ Error updating participant ${savedParticipantId} with API data:`, updateError);
                  }
                } else {
                  console.warn(`⚠️ No saved participant ID available to update with API data for ${bhxhCode}`);
                }
              } else {
                console.warn(`⚠️ Direct API search failed for ${bhxhCode}:`, directSearchResult.message);
              }

              console.log(`✅ Direct API search completed for ${bhxhCode}`);

              // Additional delay after API call to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (searchError) {
              console.warn(`⚠️ Could not lookup data for ${bhxhCode}:`, searchError);
              // Continue even if API lookup fails - participant is still saved
            }
          } else {
            console.error(`❌ Failed to save participant ${i + 1}: ${bhxhCode}`, result.message);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error processing participant ${i + 1}: ${bhxhCode}`, error);
          errorCount++;
        }

        // Delay between participants (longer if API lookup was performed)
        const delayTime = participantSaved ? 1200 : 400; // Longer delay after successful save + API lookup + database save
        console.log(`⏳ Waiting ${delayTime}ms before next participant...`);
        await new Promise(resolve => setTimeout(resolve, delayTime));
      }

      // Final refresh to ensure all data is up to date
      console.log(`🔄 Final refresh of participants list...`);
      await loadParticipants();

      // Show final result
      if (errorCount === 0) {
        console.log(`🏠 Household bulk input completed successfully: ${successCount} participants added with API lookup`);
        showToast(`Đã thêm thành công ${successCount} người vào hộ gia đình và tra cứu thông tin từ API!`, 'success');
      } else {
        console.log(`🏠 Household bulk input completed with errors: ${successCount} success, ${errorCount} errors`);
        showToast(`Đã thêm ${successCount} người thành công, ${errorCount} người lỗi. Thông tin đã được tra cứu từ API.`, 'warning');
      }
    } catch (error) {
      console.error('Household bulk add error:', error);
      showToast('Có lỗi xảy ra khi thêm hộ gia đình. Vui lòng thử lại.', 'error');
    }
  };

  // Handle household bulk input (old approach - keep for backup)
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

  // Handle Fix Error - Sequential GemLogin Test + 5 second wait + Refresh Token
  const handleFixError = async () => {
    if (fixErrorProcessing) return;

    setFixErrorProcessing(true);
    setFixErrorPhase('testing');

    try {
      // Phase 1: Test GemLogin API
      showToast('Bắt đầu test token...', 'warning');

      const payload = {
        token: "W1tRXRGrogqDKKfi2vjntmYAKwUGURDrkH7fUzxRjoM82Ee9B1mjazatTWGnPOcA",
        device_id: "F2DEA0FC4095FCA69F6E20A06B5A0B03",
        profile_id: "1",
        workflow_id: "CvfYXv3KTCMKjjHmLk4ze",
        parameter: {},
        soft_id: "1",
        close_browser: false
      };

      console.log('Testing GemLogin API with payload:', payload);

      const response = await fetch('https://app.gemlogin.vn/api/v2/execscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GemLogin API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('GemLogin API response:', data);

      // Extract bearer token and timestamp from response
      const token = data.bearer_token || data.token || data.authorization;
      const timestamp = data.timestamp || Date.now();

      showToast('Test token thành công! Bắt đầu chờ 5 giây...', 'success');

      // Phase 2: Wait exactly 5 seconds
      setFixErrorPhase('waiting');
      setWaitingCountdown(5); // 5 seconds

      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setWaitingCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Wait for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5,000ms = 5 seconds

      // Phase 3: Refresh Token
      setFixErrorPhase('refreshing');
      showToast('Bắt đầu refresh token...', 'warning');

      await vnpostTokenService.forceRefresh();

      showToast('Sửa lỗi hoàn tất! Token đã được refresh thành công.', 'success');

    } catch (error) {
      console.error('Fix error process failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // If GemLogin API fails, still try to refresh token after 5 seconds
      if (fixErrorPhase === 'testing') {
        showToast(`Test token thất bại: ${errorMessage}. Vẫn tiếp tục refresh token...`, 'warning');

        // Phase 2: Wait exactly 5 seconds even if test failed
        setFixErrorPhase('waiting');
        setWaitingCountdown(5);

        // Start countdown timer
        const countdownInterval = setInterval(() => {
          setWaitingCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
          // Phase 3: Refresh Token
          setFixErrorPhase('refreshing');
          showToast('Bắt đầu refresh token...', 'warning');

          await vnpostTokenService.forceRefresh();

          showToast('Refresh token thành công! (Test token đã bỏ qua do lỗi API)', 'success');
        } catch (refreshError) {
          console.error('Refresh token also failed:', refreshError);
          const refreshErrorMessage = refreshError instanceof Error ? refreshError.message : 'Unknown error occurred';
          showToast(`Refresh token thất bại: ${refreshErrorMessage}`, 'error');
        }
      } else {
        showToast(`Sửa lỗi thất bại: ${errorMessage}`, 'error');
      }
    } finally {
      setFixErrorProcessing(false);
      setFixErrorPhase('idle');
      setWaitingCountdown(0);
    }
  };

  // Handle refresh token
  const handleRefreshToken = async () => {
    try {
      showToast('Đang làm mới token...', 'warning');
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

  // Test database connection
  const handleTestDatabase = async () => {
    console.log('🧪 Testing database connection...');

    try {
      // Test 1: Check if we can read from database
      console.log('📖 Test 1: Reading from database...');
      const { data: testRead, error: readError } = await supabase
        .from('danh_sach_ke_khai')
        .select('id, ma_ke_khai, ten_ke_khai')
        .limit(1);

      if (readError) {
        console.error('❌ Database read failed:', readError);
        showToast(`Database read error: ${readError.message}`, 'error');
        return;
      }

      console.log('✅ Database read successful:', testRead);

      // Test 2: Check user authentication
      console.log('👤 Test 2: Checking user authentication...');
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('❌ Auth check failed:', authError);
      } else {
        console.log('👤 Auth user:', authUser);
      }

      // Test 3: Try a simple update if keKhaiInfo exists
      if (keKhaiInfo) {
        console.log('💾 Test 3: Testing database write...');
        const testUpdateData = {
          updated_at: new Date().toISOString(),
          updated_by: 'test_user'
        };

        const { data: updateResult, error: updateError } = await supabase
          .from('danh_sach_ke_khai')
          .update(testUpdateData)
          .eq('id', keKhaiInfo.id)
          .select();

        if (updateError) {
          console.error('❌ Database write failed:', updateError);
          showToast(`Database write error: ${updateError.message}`, 'error');
        } else {
          console.log('✅ Database write successful:', updateResult);
          showToast('Database connection test passed!', 'success');
        }
      } else {
        showToast('Database read test passed, but no keKhaiInfo to test write', 'warning');
      }

    } catch (error) {
      console.error('❌ Database test failed:', error);
      showToast(`Database test failed: ${error}`, 'error');
    }
  };

  // Simple test save function
  const handleSimpleTestSave = async () => {
    console.log('🧪 Simple test save...');

    if (!keKhaiInfo) {
      showToast('No keKhaiInfo available for test', 'error');
      return;
    }

    try {
      // Direct database call to test
      const testData = {
        ghi_chu: `Test save at ${new Date().toISOString()}`,
        updated_at: new Date().toISOString(),
        updated_by: 'test_user'
      };

      console.log('💾 Testing direct database update...');
      console.log('📊 Test data:', testData);
      console.log('🎯 Target ID:', keKhaiInfo.id);

      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update(testData)
        .eq('id', keKhaiInfo.id)
        .select();

      if (error) {
        console.error('❌ Direct save failed:', error);
        showToast(`Direct save error: ${error.message}`, 'error');
      } else {
        console.log('✅ Direct save successful:', result);
        showToast('Direct database save test passed!', 'success');
      }
    } catch (error) {
      console.error('❌ Simple test save failed:', error);
      showToast(`Simple test save failed: ${error}`, 'error');
    }
  };

  // Handle save all data
  const handleSaveAll = async () => {
    console.log('🚀 handleSaveAll triggered');

    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      console.log('❌ No keKhaiInfo available');
      showToast('Chưa có thông tin kê khai để lưu. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    console.log('📋 Current form data:', formData);
    console.log('👥 Current participants:', participants);
    console.log('🏢 KeKhai info:', keKhaiInfo);

    // Test: Add some sample data to form if empty
    if (!formData.hoTen && !formData.maSoBHXH) {
      console.log('🧪 Form is empty, this is expected for testing declaration-only save');
    }

    try {
      // Pass both participants and form data to save function
      console.log('💾 Calling saveAllParticipants...');
      const result = await saveAllParticipants(participants, formData);
      console.log('📊 Save result:', result);

      if (result.success) {
        showToast(result.message, 'success');
        // Mark as saved
        setHasUnsavedChanges(false);
        setLastSavedTime(new Date());
        console.log('✅ Save completed successfully');
      } else {
        showToast(result.message, 'error');
        console.log('⚠️ Save completed with errors');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
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

  // Handle save participant from form (new approach)
  const handleSaveParticipantNew = async () => {
    console.log('🚀 handleSaveParticipantNew called');

    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      console.log('❌ No keKhaiInfo available');
      showToast('Chưa có thông tin kê khai. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    // Validate required fields
    if (!formData.maSoBHXH.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    if (!formData.noiDangKyKCB.trim()) {
      showToast('Vui lòng chọn nơi đăng ký KCB', 'warning');
      return;
    }

    if (!formData.hoTen.trim()) {
      showToast('Vui lòng nhập họ tên', 'warning');
      return;
    }

    try {
      setSavingParticipant(true);
      console.log('📋 Current form data:', formData);

      // Save participant directly from form data
      const result = await saveParticipantFromForm(formData);

      if (result.success) {
        console.log('✅ Save successful:', result);
        showToast(result.message, 'success');

        // Reset the form for next entry
        console.log('🔄 Resetting form...');
        resetForm();
      } else {
        console.log('❌ Save failed:', result);
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('❌ Save participant error:', error);
      showToast('Có lỗi xảy ra khi lưu người tham gia. Vui lòng thử lại.', 'error');
    } finally {
      setSavingParticipant(false);
      console.log('🔄 Save participant process finished');
    }
  };

  // Handle save participant from form (old approach - keep for backup)
  const handleSaveParticipant = async () => {
    // Check if keKhaiInfo is available
    if (!keKhaiInfo) {
      showToast('Chưa có thông tin kê khai. Vui lòng tạo kê khai mới từ trang chính.', 'error');
      return;
    }

    // Validate required fields
    if (!formData.maSoBHXH.trim()) {
      showToast('Vui lòng nhập mã số BHXH', 'warning');
      return;
    }

    if (!formData.noiDangKyKCB.trim()) {
      showToast('Vui lòng chọn nơi đăng ký KCB', 'warning');
      return;
    }

    if (!formData.hoTen.trim()) {
      showToast('Vui lòng nhập họ tên', 'warning');
      return;
    }

    try {
      setSavingParticipant(true);
      console.log('🚀 Starting save participant process...');
      console.log('📊 Current participants count:', participants.length);

      // Add a new participant first
      console.log('➕ Adding new participant...');
      const savedParticipant = await addParticipant();
      console.log('✅ New participant added to database:', savedParticipant);

      // Wait for state to update and get the correct index
      console.log('⏳ Waiting for state to update...');

      // Use multiple attempts to get the updated state
      let newParticipantIndex = -1;
      let attempts = 0;
      const maxAttempts = 10;

      while (newParticipantIndex === -1 && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;

        console.log(`🔄 Attempt ${attempts}/${maxAttempts} - participants count:`, participants.length);

        // Find the participant by ID to get the correct index
        for (let i = 0; i < participants.length; i++) {
          if (participants[i].id === savedParticipant.id) {
            newParticipantIndex = i;
            console.log(`✅ Found participant by ID at index ${i} on attempt ${attempts}`);
            break;
          }
        }

        // If still not found and we have participants, use the last one
        if (newParticipantIndex === -1 && participants.length > 0) {
          newParticipantIndex = participants.length - 1;
          console.log(`⚠️ Using last index as fallback: ${newParticipantIndex}`);
          break;
        }
      }

      console.log('📍 Final participant index:', newParticipantIndex);
      console.log('📊 Final participants count:', participants.length);
      console.log('📋 Final participants:', participants.map(p => ({ id: p.id, hoTen: p.hoTen })));

      // Validate the index
      if (newParticipantIndex < 0) {
        console.error('❌ No participants found in array after adding');
        console.error('📊 Participants length:', participants.length);
        console.error('🆔 Saved participant ID:', savedParticipant.id);
        console.error('🔄 Attempts made:', attempts);
        throw new Error(`Không thể tìm thấy người tham gia vừa thêm sau ${attempts} lần thử. Participants length: ${participants.length}`);
      }

      if (newParticipantIndex >= participants.length) {
        console.error('❌ Index out of bounds');
        throw new Error(`Invalid participant index: ${newParticipantIndex}. Participants length: ${participants.length}`);
      }

      // Update the new participant with form data
      const participantData = {
        maSoBHXH: formData.maSoBHXH,
        hoTen: formData.hoTen,
        ngaySinh: formData.ngaySinh,
        gioiTinh: formData.gioiTinh,
        soCCCD: formData.soCCCD,
        noiDangKyKCB: formData.noiDangKyKCB,
        soDienThoai: formData.soDienThoai,
        soTheBHYT: formData.soTheBHYT,
        quocTich: formData.quocTich,
        danToc: formData.danToc,
        maTinhKS: formData.maTinhKS,
        maHuyenKS: formData.maHuyenKS,
        maXaKS: formData.maXaKS,
        maTinhNkq: formData.maTinhNkq,
        maHuyenNkq: formData.maHuyenNkq,
        maXaNkq: formData.maXaNkq,
        tinhKCB: formData.tinhKCB,
        soThangDong: formData.soThangDong,
        sttHo: formData.sttHo,
        tuNgayTheCu: formData.tuNgayTheCu,
        denNgayTheCu: formData.denNgayTheCu,
        tuNgayTheMoi: formData.tuNgayTheMoi,
        denNgayTheMoi: formData.denNgayTheMoi,
        ngayBienLai: formData.ngayBienLai,
        ghiChuDongPhi: formData.ghiChuDongPhi,
        maHoGiaDinh: formData.maHoGiaDinh,
        phuongAn: formData.phuongAn
      };

      console.log('📝 Updating participant with form data...');
      // Update each field for the new participant
      for (const [key, value] of Object.entries(participantData)) {
        if (value && value.toString().trim()) {
          await handleParticipantChange(newParticipantIndex, key as any, value.toString());
          await new Promise(resolve => setTimeout(resolve, 50)); // Small delay between updates
        }
      }

      console.log('💾 Saving participant to database...');
      // Save the participant to database
      await handleSaveSingleParticipant(newParticipantIndex);

      // Reset the form for next entry
      console.log('🔄 Resetting form...');
      resetForm();

      console.log('✅ Save participant process completed successfully');
      showToast('Đã lưu người tham gia thành công! Form đã được làm mới để nhập người tiếp theo.', 'success');
    } catch (error) {
      console.error('❌ Save participant error:', error);
      showToast('Có lỗi xảy ra khi lưu người tham gia. Vui lòng thử lại.', 'error');
    } finally {
      setSavingParticipant(false);
      console.log('🔄 Save participant process finished');
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
          apiSummary={apiSummary}
          onRefreshToken={handleRefreshToken}
          onFixError={handleFixError}
          fixErrorProcessing={fixErrorProcessing}
          fixErrorPhase={fixErrorPhase}
          waitingCountdown={waitingCountdown}
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
            {/* Personal Information Form */}
            <KeKhai603PersonalInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSearch={handleSearch}
              handleKeyPress={handleKeyPress}
              searchLoading={searchLoading}
              onSaveParticipant={handleSaveParticipantNew}
              savingParticipant={savingParticipant}
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

            {/* Participant Table */}
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
              onHouseholdBulkAdd={handleHouseholdBulkAddNew}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* Test Buttons - Temporary for debugging */}
              <button
                onClick={() => {
                  console.log('🧪 TEST: Current form state:', formData);
                  console.log('🧪 TEST: Has form data:', Object.values(formData).some(v => v && v.toString().trim()));
                  console.log('🧪 TEST: Participants:', participants);
                  console.log('🧪 TEST: KeKhai info:', keKhaiInfo);
                }}
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                Debug
              </button>

              <button
                onClick={handleTestDatabase}
                className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
              >
                Test DB
              </button>

              <button
                onClick={handleSimpleTestSave}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
              >
                Test Save
              </button>

              <button
                onClick={handleSaveParticipantNew}
                disabled={savingParticipant}
                className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm disabled:opacity-50"
              >
                {savingParticipant ? 'Saving...' : 'Test New Save'}
              </button>

              <button
                onClick={() => {
                  const testCodes = ['0123456789', '0123456788'];
                  handleHouseholdBulkAddNew(testCodes, '12', undefined, (current, code) => {
                    console.log(`Progress: ${current}/${testCodes.length} - ${code}`);
                  });
                }}
                disabled={savingData}
                className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm disabled:opacity-50"
              >
                {savingData ? 'Processing...' : 'Test Household'}
              </button>

              <button
                onClick={handleSaveAll}
                disabled={submitting || saving || savingData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
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
