import { useState, useEffect, useCallback, useRef } from 'react';
import { keKhaiService } from '../services/keKhaiService';
import { DanhSachKeKhai } from '../services/supabaseClient';
import { BhytParticipant } from './useBhytParticipants';

// Interface for page parameters
export interface PageParams {
  keKhaiId?: number;
  declarationName?: string;
  declarationCode?: string;
  formData?: any;
}

// Custom hook for BHYT declaration management
export const useBhytDeclaration = (pageParams?: PageParams) => {
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
        ten_ke_khai: 'Kê khai BHYT test',
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
          message: `Đã tạo kê khai ${newKeKhai.ma_ke_khai} thành công!`,
          data: newKeKhai
        };
      } catch (error) {
        console.error('Error creating default ke khai:', error);
        return {
          success: false,
          message: 'Có lỗi xảy ra khi tạo kê khai. Vui lòng thử lại.'
        };
      } finally {
        setSaving(false);
      }
    }

    try {
      setSaving(true);

      // Create new declaration in database
      const keKhaiData = {
        ten_ke_khai: pageParams.declarationName || 'Kê khai BHYT',
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
        message: `Đã tạo kê khai ${newKeKhai.ma_ke_khai} thành công!`,
        data: newKeKhai
      };
    } catch (error) {
      console.error('Error initializing ke khai:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tạo kê khai. Vui lòng thử lại.'
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
        message: 'Đã nộp kê khai thành công!'
      };
    } catch (error) {
      console.error('Error submitting declaration:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi nộp kê khai. Vui lòng thử lại.'
      };
    } finally {
      setSubmitting(false);
    }
  };

  // Save all data (declaration + participants)
  const saveAllParticipants = async (participants: BhytParticipant[], formData?: any) => {
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
      // Note: Based on DanhSachKeKhai interface and BhytFormData structure
      if (formData) {
        console.log('Form data received for saving:', formData);

        // Map BhytFormData fields to DanhSachKeKhai fields
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

      // Debug log for declaration update
      console.log('Updating declaration with data:', {
        keKhaiId: keKhaiInfo.id,
        updateData,
        originalFormData: formData
      });

      const updatedKeKhai = await keKhaiService.updateKeKhai(keKhaiInfo.id, updateData);
      console.log('Declaration updated successfully:', updatedKeKhai);

      // 2. Save participants (if any)
      let savedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      if (participants.length === 0) {
        return {
          success: true,
          message: 'Đã lưu thông tin kê khai thành công!'
        };
      }

      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];

        try {
          // Prepare data to save - include all fields from participant and form data
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

          // Add additional fields from form data if this is the first participant (main person)
          if (i === 0 && formData) {
            // Add form data to first participant (main person)
            if (formData.soCCCD && formData.soCCCD.trim()) {
              participantData.so_cccd = formData.soCCCD;
            }
            if (formData.soDienThoai && formData.soDienThoai.trim()) {
              participantData.so_dien_thoai = formData.soDienThoai;
            }
            if (formData.soTheBHYT && formData.soTheBHYT.trim()) {
              participantData.so_the_bhyt = formData.soTheBHYT;
            }
            if (formData.quocTich && formData.quocTich.trim()) {
              participantData.quoc_tich = formData.quocTich;
            }
            if (formData.danToc && formData.danToc.trim()) {
              participantData.dan_toc = formData.danToc;
            }
            if (formData.maTinhKS && formData.maTinhKS.trim()) {
              participantData.ma_tinh_ks = formData.maTinhKS;
            }
            if (formData.maHuyenKS && formData.maHuyenKS.trim()) {
              participantData.ma_huyen_ks = formData.maHuyenKS;
            }
            if (formData.maXaKS && formData.maXaKS.trim()) {
              participantData.ma_xa_ks = formData.maXaKS;
            }
            if (formData.tinhKCB && formData.tinhKCB.trim()) {
              participantData.tinh_kcb = formData.tinhKCB;
            }
            if (formData.maBenhVien && formData.maBenhVien.trim()) {
              participantData.ma_benh_vien = formData.maBenhVien;
            }
            if (formData.maHoGiaDinh && formData.maHoGiaDinh.trim()) {
              participantData.ma_ho_gia_dinh = formData.maHoGiaDinh;
            }
            if (formData.phuongAn && formData.phuongAn.trim()) {
              participantData.phuong_an = formData.phuongAn;
            }
            if (formData.trangThai && formData.trangThai.trim()) {
              participantData.trang_thai_the = formData.trangThai;
            }
            if (formData.tuNgayTheMoi && formData.tuNgayTheMoi.trim()) {
              participantData.tu_ngay_the_moi = formData.tuNgayTheMoi;
            }
            if (formData.denNgayTheMoi && formData.denNgayTheMoi.trim()) {
              participantData.den_ngay_the_moi = formData.denNgayTheMoi;
            }

            console.log('Added form data to first participant:', {
              formDataFields: Object.keys(formData),
              addedFields: Object.keys(participantData).filter(key =>
                ['so_cccd', 'so_dien_thoai', 'so_the_bhyt', 'quoc_tich', 'dan_toc',
                 'ma_tinh_ks', 'ma_huyen_ks', 'ma_xa_ks', 'tinh_kcb', 'ma_benh_vien',
                 'ma_ho_gia_dinh', 'phuong_an', 'trang_thai_the', 'tu_ngay_the_moi', 'den_ngay_the_moi'].includes(key)
              )
            });
          }

          // Remove null values to avoid database issues
          Object.keys(participantData).forEach(key => {
            if (participantData[key] === null || participantData[key] === undefined || participantData[key] === '') {
              delete participantData[key];
            }
          });

          // Debug log
          console.log(`Saving participant ${i + 1}:`, {
            participantId: participant.id,
            participantData,
            originalParticipant: participant
          });

          if (participant.id) {
            // Update existing participant
            const result = await keKhaiService.updateNguoiThamGia(participant.id, participantData);
            console.log(`Updated participant ${i + 1}:`, result);
            updatedCount++;
          } else {
            // Add new participant
            const result = await keKhaiService.addNguoiThamGia(participantData);
            console.log(`Added new participant ${i + 1}:`, result);
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
            message: `Đã lưu thành công kê khai và ${savedCount} người mới, cập nhật ${updatedCount} người!`
          };
        } else {
          return {
            success: true,
            message: 'Đã lưu thông tin kê khai thành công!'
          };
        }
      } else {
        return {
          success: false,
          message: `Đã lưu kê khai và ${savedCount + updatedCount} người thành công, ${errorCount} người lỗi.`
        };
      }

    } catch (error) {
      console.error('Error saving all participants:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi ghi dữ liệu. Vui lòng thử lại.'
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
