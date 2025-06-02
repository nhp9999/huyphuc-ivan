import { useState, useEffect, useCallback, useRef } from 'react';
import { keKhaiService } from '../services/keKhaiService';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import { KeKhai603Participant } from './useKeKhai603Participants';

// Interface for page parameters
export interface PageParams {
  keKhaiId?: number;
  declarationName?: string;
  declarationCode?: string;
  formData?: any;
}

// Custom hook for KeKhai603 management
export const useKeKhai603 = (pageParams?: PageParams) => {
  const [keKhaiInfo, setKeKhaiInfo] = useState<DanhSachKeKhai | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState<'form' | 'list'>('form');
  const [initialized, setInitialized] = useState(false);

  // Use ref to track if we've already initialized for this pageParams
  const lastPageParamsRef = useRef<PageParams | undefined>();

  // Memoize the initialization function to prevent infinite loops
  const initializeKeKhai = useCallback(async () => {
    // Prevent multiple initializations for the same pageParams
    if (initialized && JSON.stringify(lastPageParamsRef.current) === JSON.stringify(pageParams)) {
      return {
        success: true,
        message: 'Đã khởi tạo trước đó'
      };
    }

    setInitialized(true);
    lastPageParamsRef.current = pageParams;

    // If there's a keKhaiId in pageParams, load that declaration
    if (pageParams?.keKhaiId) {
      try {
        setSaving(true);
        const existingKeKhai = await keKhaiService.getKeKhaiById(pageParams.keKhaiId);
        if (existingKeKhai) {
          setKeKhaiInfo(existingKeKhai);
          return {
            success: true,
            message: `Đã tải kê khai ${existingKeKhai.ma_ke_khai}`,
            data: existingKeKhai
          };
        }
      } catch (error) {
        console.error('Error loading existing ke khai:', error);
        return {
          success: false,
          message: 'Không thể tải kê khai. Sẽ tạo kê khai mới.'
        };
      } finally {
        setSaving(false);
      }
    }

    // If no pageParams or no formData, create default declaration for testing
    if (!pageParams?.formData) {
      const defaultKeKhaiData = {
        ten_ke_khai: 'Kê khai 603 test',
        loai_ke_khai: '603',
        doi_tuong_tham_gia: 'GD - Hộ gia đình',
        hinh_thuc_tinh: 'Hỗ trợ dựa trên mức đóng từng người',
        luong_co_so: 2340000,
        nguon_dong: 'Tự đóng',
        created_by: 'system'
      };

      try {
        setSaving(true);
        const newKeKhai = await keKhaiService.createKeKhai(defaultKeKhaiData);
        setKeKhaiInfo(newKeKhai);
        return {
          success: true,
          message: `Đã tạo kê khai 603 ${newKeKhai.ma_ke_khai} thành công!`,
          data: newKeKhai
        };
      } catch (error) {
        console.error('Error creating default ke khai:', error);
        return {
          success: false,
          message: 'Có lỗi xảy ra khi tạo kê khai 603. Vui lòng thử lại.'
        };
      } finally {
        setSaving(false);
      }
    }

    try {
      setSaving(true);

      // Create new declaration in database
      const keKhaiData = {
        ten_ke_khai: pageParams.declarationName || 'Kê khai 603',
        loai_ke_khai: pageParams.declarationCode || '603',
        dai_ly_id: pageParams.formData.chonDaiLy ? parseInt(pageParams.formData.chonDaiLy) : undefined,
        don_vi_id: pageParams.formData.chonDonVi ? parseInt(pageParams.formData.chonDonVi) : undefined,
        doi_tuong_tham_gia: pageParams.formData.doiTuongThamGia,
        hinh_thuc_tinh: pageParams.formData.hinhThucTinh,
        luong_co_so: pageParams.formData.luongCoSo ? parseFloat(pageParams.formData.luongCoSo.replace(/[.,]/g, '')) : undefined,
        nguon_dong: pageParams.formData.nguonDong,
        noi_dang_ky_kcb_ban_dau: pageParams.formData.noiDangKyKCBBanDau || undefined,
        bien_lai_ngay_tham_gia: pageParams.formData.bienLaiNgayThamGia || undefined,
        so_thang: pageParams.formData.soThang ? parseInt(pageParams.formData.soThang) : undefined,
        ngay_tao: pageParams.formData.ngay || undefined,
        ty_le_nsnn_ho_tro: pageParams.formData.tyLeNSNNHoTro ? parseFloat(pageParams.formData.tyLeNSNNHoTro) : undefined,
        ghi_chu: pageParams.formData.ghiChu || undefined,
        created_by: 'system' // TODO: Get from user context
      };

      const newKeKhai = await keKhaiService.createKeKhai(keKhaiData);
      setKeKhaiInfo(newKeKhai);

      return {
        success: true,
        message: `Đã tạo kê khai 603 ${newKeKhai.ma_ke_khai} thành công!`,
        data: newKeKhai
      };
    } catch (error) {
      console.error('Error initializing ke khai:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tạo kê khai 603. Vui lòng thử lại.'
      };
    } finally {
      setSaving(false);
    }
  }, [pageParams, initialized]);

  // Initialize declaration when component mounts or pageParams changes
  useEffect(() => {
    // Initialize on first mount or when pageParams actually changed
    if (!initialized || JSON.stringify(lastPageParamsRef.current) !== JSON.stringify(pageParams)) {
      setInitialized(false);
      // Automatically initialize
      initializeKeKhai().catch(error => {
        console.error('Auto-initialization failed:', error);
      });
    }
  }, [pageParams, initializeKeKhai, initialized]);

  // Submit declaration
  const submitDeclaration = async () => {
    if (!keKhaiInfo) {
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    try {
      setSubmitting(true);

      // Update declaration status to submitted
      await keKhaiService.updateKeKhai(keKhaiInfo.id, {
        trang_thai: 'submitted',
        updated_by: 'system' // TODO: Get from user context
      } as any);

      return {
        success: true,
        message: 'Đã nộp kê khai 603 thành công!'
      };
    } catch (error) {
      console.error('Error submitting declaration:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi nộp kê khai 603. Vui lòng thử lại.'
      };
    } finally {
      setSubmitting(false);
    }
  };

  // Save all data (declaration + participants)
  const saveAllParticipants = async (participants: KeKhai603Participant[], formData?: any) => {
    if (!keKhaiInfo) {
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    try {
      setSaving(true);

      // 1. Update declaration information with form data if provided
      const updateData: any = {
        trang_thai: 'draft',
        updated_by: 'system' // TODO: Get from user context
      };

      // Add form data to declaration if provided
      if (formData) {
        console.log('Form data received for saving:', formData);

        // Map KeKhai603FormData fields to DanhSachKeKhai fields
        if (formData.noiDangKyKCB && formData.noiDangKyKCB.trim()) {
          updateData.noi_dang_ky_kcb_ban_dau = formData.noiDangKyKCB;
        }

        if (formData.ngayBienLai && formData.ngayBienLai.trim()) {
          updateData.bien_lai_ngay_tham_gia = formData.ngayBienLai;
        }

        if (formData.soThangDong && formData.soThangDong.trim()) {
          const soThang = parseInt(formData.soThangDong);
          if (!isNaN(soThang) && soThang > 0) {
            updateData.so_thang = soThang;
          }
        }

        if (formData.ghiChuDongPhi && formData.ghiChuDongPhi.trim()) {
          updateData.ghi_chu = formData.ghiChuDongPhi;
        }

        // Update luong_co_so if provided
        if (formData.mucLuong && formData.mucLuong.trim()) {
          const mucLuong = parseFloat(formData.mucLuong.replace(/[.,]/g, ''));
          if (!isNaN(mucLuong) && mucLuong > 0) {
            updateData.luong_co_so = mucLuong;
          }
        }

        // Update ty_le_nsnn_ho_tro if provided
        if (formData.tyLeDong && formData.tyLeDong.trim()) {
          const tyLe = parseFloat(formData.tyLeDong);
          if (!isNaN(tyLe) && tyLe > 0) {
            updateData.ty_le_nsnn_ho_tro = tyLe;
          }
        }

        console.log('Mapped update data for declaration:', updateData);
      }

      const updatedKeKhai = await keKhaiService.updateKeKhai(keKhaiInfo.id, updateData);
      console.log('Declaration updated successfully:', updatedKeKhai);

      // 2. Save participants (if any)
      let savedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      if (participants.length === 0) {
        return {
          success: true,
          message: 'Đã lưu thông tin kê khai 603 thành công!'
        };
      }

      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];

        try {
          // Prepare data to save
          const participantData: any = {
            ke_khai_id: keKhaiInfo.id,
            stt: i + 1,
            ho_ten: participant.hoTen || '',
            ma_so_bhxh: participant.maSoBHXH || null,
            ngay_sinh: participant.ngaySinh || null,
            gioi_tinh: participant.gioiTinh || 'Nam',
            noi_dang_ky_kcb: participant.noiDangKyKCB || null,
            muc_luong: participant.mucLuong ? parseFloat(participant.mucLuong.replace(/[.,]/g, '')) : null,
            ty_le_dong: participant.tyLeDong ? parseFloat(participant.tyLeDong) : 4.5,
            so_tien_dong: participant.soTienDong ? parseFloat(participant.soTienDong.replace(/[.,]/g, '')) : null,
            tu_ngay_the_cu: participant.tuNgayTheCu || null,
            den_ngay_the_cu: participant.denNgayTheCu || null,
            so_thang_dong: participant.soThangDong ? parseInt(participant.soThangDong) : null,
            stt_ho: participant.sttHo || null,
            ngay_bien_lai: participant.ngayBienLai || new Date().toISOString().split('T')[0],
            ma_tinh_nkq: participant.maTinhNkq || null,
            ma_huyen_nkq: participant.maHuyenNkq || null,
            ma_xa_nkq: participant.maXaNkq || null,
            noi_nhan_ho_so: participant.noiNhanHoSo || null
          };

          // Remove null values to avoid database issues
          Object.keys(participantData).forEach(key => {
            if (participantData[key] === null || participantData[key] === undefined || participantData[key] === '') {
              delete participantData[key];
            }
          });

          if (participant.id) {
            // Update existing participant
            await keKhaiService.updateNguoiThamGia(participant.id, participantData);
            updatedCount++;
          } else {
            // Add new participant
            await keKhaiService.addNguoiThamGia(participantData);
            savedCount++;
          }
        } catch (error) {
          console.error(`Error saving participant ${i + 1}:`, error);
          errorCount++;
        }
      }

      // Return results
      if (errorCount === 0) {
        if (savedCount + updatedCount > 0) {
          return {
            success: true,
            message: `Đã lưu thành công kê khai 603 và ${savedCount} người mới, cập nhật ${updatedCount} người!`
          };
        } else {
          return {
            success: true,
            message: 'Đã lưu thông tin kê khai 603 thành công!'
          };
        }
      } else {
        return {
          success: false,
          message: `Đã lưu kê khai 603 và ${savedCount + updatedCount} người thành công, ${errorCount} người lỗi.`
        };
      }

    } catch (error) {
      console.error('Error saving all participants:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi ghi dữ liệu kê khai 603. Vui lòng thử lại.'
      };
    } finally {
      setSaving(false);
    }
  };

  return {
    keKhaiInfo,
    saving,
    submitting,
    inputMode,
    setInputMode,
    initializeKeKhai,
    submitDeclaration,
    saveAllParticipants
  };
};
