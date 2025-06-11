import { useState, useEffect, useCallback, useRef } from 'react';
import { keKhaiService } from '../services/keKhaiService';
import paymentService from '../services/paymentService';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import { useAuth } from '../../auth/contexts/AuthContext';
import { KeKhai603Participant } from './useKeKhai603Participants';
import { calculateKeKhai603Amount, calculateKeKhai603AmountThucTe } from './useKeKhai603FormData';

// Interface for page parameters
export interface PageParams {
  keKhaiId?: number;
  declarationName?: string;
  declarationCode?: string;
  formData?: any;
}

// Custom hook for KeKhai603 management
export const useKeKhai603 = (pageParams?: PageParams) => {
  const { user } = useAuth();
  const [keKhaiInfo, setKeKhaiInfo] = useState<DanhSachKeKhai | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

    // If no pageParams or no formData, don't create default declaration
    // This prevents automatic creation of unwanted declarations
    if (!pageParams?.formData) {
      return {
        success: false,
        message: 'Không có thông tin để khởi tạo kê khai. Vui lòng tạo kê khai mới từ trang chính.'
      };
    }

    try {
      setSaving(true);

      // Prepare organization data based on user's current organization
      const organizationData: { cong_ty_id?: number; co_quan_bhxh_id?: number } = {};
      if (user?.currentOrganization) {
        if (user.currentOrganization.organization_type === 'cong_ty') {
          organizationData.cong_ty_id = user.currentOrganization.organization_id;
        } else if (user.currentOrganization.organization_type === 'co_quan_bhxh') {
          organizationData.co_quan_bhxh_id = user.currentOrganization.organization_id;
        }
      }

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
        created_by: user?.id || 'system',
        ...organizationData
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

  // Create a new declaration manually (for testing or when needed)
  const createNewKeKhai = useCallback(async () => {
    // Prepare organization data based on user's current organization
    const organizationData: { cong_ty_id?: number; co_quan_bhxh_id?: number } = {};
    if (user?.currentOrganization) {
      if (user.currentOrganization.organization_type === 'cong_ty') {
        organizationData.cong_ty_id = user.currentOrganization.organization_id;
      } else if (user.currentOrganization.organization_type === 'co_quan_bhxh') {
        organizationData.co_quan_bhxh_id = user.currentOrganization.organization_id;
      }
    }

    const defaultKeKhaiData = {
      ten_ke_khai: 'Kê khai 603 test',
      loai_ke_khai: '603',
      doi_tuong_tham_gia: 'GD - Hộ gia đình',
      hinh_thuc_tinh: 'Hỗ trợ dựa trên mức đóng từng người',
      luong_co_so: 2340000,
      nguon_dong: 'Tự đóng',
      created_by: user?.id || 'system',
      ...organizationData
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
      console.error('Error creating new ke khai:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tạo kê khai 603. Vui lòng thử lại.'
      };
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Initialize declaration when component mounts or pageParams changes
  useEffect(() => {
    // Only initialize if we have valid pageParams with keKhaiId or formData
    // This prevents unwanted automatic creation of declarations
    if (pageParams && (pageParams.keKhaiId || pageParams.formData)) {
      if (!initialized || JSON.stringify(lastPageParamsRef.current) !== JSON.stringify(pageParams)) {
        setInitialized(false);
        // Automatically initialize only when we have valid data
        initializeKeKhai().catch(error => {
          console.error('Auto-initialization failed:', error);
        });
      }
    }
  }, [pageParams, initializeKeKhai, initialized]);

  // Submit declaration
  const submitDeclaration = async () => {
    if (!keKhaiInfo) {
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    // Validate that declaration has participants before submission
    try {
      const participants = await keKhaiService.getNguoiThamGiaByKeKhai(keKhaiInfo.id);
      if (!participants || participants.length === 0) {
        throw new Error('Không thể nộp kê khai mà không có người tham gia. Vui lòng thêm ít nhất một người tham gia trước khi nộp.');
      }
    } catch (error) {
      console.error('Error checking participants:', error);
      throw new Error('Không thể kiểm tra danh sách người tham gia. Vui lòng thử lại.');
    }

    try {
      setSubmitting(true);

      // Update declaration status to submitted - QR code will be generated after synthesis staff approval
      const updatedKeKhai = await keKhaiService.updateKeKhai(keKhaiInfo.id, {
        trang_thai: 'submitted',
        updated_by: user?.id || 'system'
      } as any);

      // Cập nhật state local với thông tin mới
      setKeKhaiInfo(updatedKeKhai);

      return {
        success: true,
        message: 'Đã nộp kê khai 603 thành công! Kê khai sẽ được xem xét và duyệt bởi nhân viên tổng hợp.',
        payment: null // No payment created yet - will be created after approval
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
      console.log('🔄 Starting save process...');
      console.log('📋 Form data received:', formData);
      console.log('👥 Participants count:', participants.length);

      // 1. Update declaration information with form data if provided
      const updateData: any = {
        trang_thai: 'draft',
        updated_by: user?.id || 'system',
        updated_at: new Date().toISOString()
      };

      // Add form data to declaration if provided
      if (formData) {
        console.log('📝 Processing form data for declaration update...');

        // Map KeKhai603FormData fields to DanhSachKeKhai fields
        if (formData.noiDangKyKCB && formData.noiDangKyKCB.trim()) {
          updateData.noi_dang_ky_kcb_ban_dau = formData.noiDangKyKCB;
          console.log('✅ Mapped noiDangKyKCB:', formData.noiDangKyKCB);
        }

        if (formData.ngayBienLai && formData.ngayBienLai.trim()) {
          updateData.bien_lai_ngay_tham_gia = formData.ngayBienLai;
          console.log('✅ Mapped ngayBienLai:', formData.ngayBienLai);
        }

        if (formData.soThangDong && formData.soThangDong.trim()) {
          const soThang = parseInt(formData.soThangDong);
          if (!isNaN(soThang) && soThang > 0) {
            updateData.so_thang = soThang;
            console.log('✅ Mapped soThangDong:', soThang);
          }
        }

        if (formData.ghiChuDongPhi && formData.ghiChuDongPhi.trim()) {
          updateData.ghi_chu = formData.ghiChuDongPhi;
          console.log('✅ Mapped ghiChuDongPhi:', formData.ghiChuDongPhi);
        }

        // Update luong_co_so if provided
        if (formData.mucLuong && formData.mucLuong.trim()) {
          const mucLuong = parseFloat(formData.mucLuong.replace(/[.,]/g, ''));
          if (!isNaN(mucLuong) && mucLuong > 0) {
            updateData.luong_co_so = mucLuong;
            console.log('✅ Mapped mucLuong:', mucLuong);
          }
        }

        // Update ty_le_nsnn_ho_tro if provided
        if (formData.tyLeDong && formData.tyLeDong.trim()) {
          const tyLe = parseFloat(formData.tyLeDong);
          if (!isNaN(tyLe) && tyLe > 0) {
            updateData.ty_le_nsnn_ho_tro = tyLe;
            console.log('✅ Mapped tyLeDong:', tyLe);
          }
        }

        // Map additional form fields that might be useful for declaration
        console.log('📝 Checking additional form fields...');
        console.log('- hoTen:', formData.hoTen);
        console.log('- maSoBHXH:', formData.maSoBHXH);
        console.log('- sttHo:', formData.sttHo);
        console.log('- phuongAn:', formData.phuongAn);

        console.log('📊 Final mapped update data for declaration:', updateData);
      } else {
        console.log('⚠️ No form data provided for declaration update');
      }

      console.log('💾 Updating declaration in database...');
      const updatedKeKhai = await keKhaiService.updateKeKhai(keKhaiInfo.id, updateData);
      console.log('✅ Declaration updated successfully:', updatedKeKhai);

      // 2. Save participants (if any)
      let savedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      console.log('👥 Processing participants...');
      if (participants.length === 0) {
        console.log('⚠️ Warning: Saving declaration without participants');
        return {
          success: true,
          message: 'Đã lưu thông tin kê khai 603 thành công! Lưu ý: Bạn cần thêm ít nhất một người tham gia trước khi có thể nộp kê khai.'
        };
      }

      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        console.log(`👤 Processing participant ${i + 1}/${participants.length}:`, participant.hoTen || 'Unnamed');

        try {
          // Prepare data to save
          const participantData: any = {
            ke_khai_id: keKhaiInfo.id,
            stt: i + 1,
            ho_ten: participant.hoTen || '',
            ma_so_bhxh: participant.maSoBHXH || null,
            ngay_sinh: participant.ngaySinh || null,
            gioi_tinh: participant.gioiTinh || 'Nam',
            so_cccd: participant.soCCCD || null,
            so_dien_thoai: participant.soDienThoai || null,
            so_the_bhyt: participant.soTheBHYT || null,
            dan_toc: participant.danToc || null,
            quoc_tich: participant.quocTich || 'VN',
            noi_dang_ky_kcb: participant.noiDangKyKCB || null,
            muc_luong: participant.mucLuong ? parseFloat(participant.mucLuong.replace(/[.,]/g, '')) : null,
            ty_le_dong: participant.tyLeDong ? parseFloat(participant.tyLeDong) : 100,
            tien_dong: participant.tienDong || (participant.soTienDong ? parseFloat(participant.soTienDong.replace(/[.,]/g, '')) : null), // Ưu tiên sử dụng tienDong, fallback về soTienDong
            tien_dong_thuc_te: participant.tienDongThucTe || (participant.sttHo && participant.soThangDong ? calculateKeKhai603AmountThucTe(participant.sttHo, participant.soThangDong, 2340000, keKhaiInfo?.doi_tuong_tham_gia) : null), // Tính toán tiền đóng thực tế theo công thức cũ
            tu_ngay_the_cu: participant.tuNgayTheCu || null,
            den_ngay_the_cu: participant.denNgayTheCu || null,
            tu_ngay_the_moi: participant.tuNgayTheMoi || null,
            den_ngay_the_moi: participant.denNgayTheMoi || null,
            so_thang_dong: participant.soThangDong ? parseInt(participant.soThangDong) : null,
            stt_ho: participant.sttHo || null,
            ngay_bien_lai: participant.ngayBienLai || new Date().toISOString().split('T')[0],
            ma_tinh_nkq: participant.maTinhNkq || null,
            ma_huyen_nkq: participant.maHuyenNkq || null,
            ma_xa_nkq: participant.maXaNkq || null,
            noi_nhan_ho_so: participant.noiNhanHoSo || null,
            // Additional fields from API
            ma_tinh_ks: participant.maTinhKS || null,
            ma_huyen_ks: participant.maHuyenKS || null,
            ma_xa_ks: participant.maXaKS || null,
            tinh_kcb: participant.tinhKCB || null,
            ma_benh_vien: participant.maBenhVien || null,
            ma_ho_gia_dinh: participant.maHoGiaDinh || null,
            phuong_an: participant.phuongAn || null
          };

          // Remove null values to avoid database issues
          Object.keys(participantData).forEach(key => {
            if (participantData[key] === null || participantData[key] === undefined || participantData[key] === '') {
              delete participantData[key];
            }
          });

          console.log(`💾 Participant data to save:`, participantData);

          if (participant.id) {
            // Update existing participant
            console.log(`🔄 Updating existing participant ${i + 1} with ID: ${participant.id}`);
            const updatedParticipant = await keKhaiService.updateNguoiThamGia(participant.id, participantData);
            console.log(`✅ Updated participant ${i + 1}:`, updatedParticipant);
            updatedCount++;
          } else {
            // Add new participant
            console.log(`➕ Adding new participant ${i + 1}`);
            const savedParticipant = await keKhaiService.addNguoiThamGia(participantData);
            console.log(`✅ Saved new participant ${i + 1}:`, savedParticipant);
            savedCount++;
          }
        } catch (error) {
          console.error(`❌ Error saving participant ${i + 1}:`, error);
          errorCount++;
        }
      }

      // Return results
      console.log(`📊 Save summary: ${savedCount} new, ${updatedCount} updated, ${errorCount} errors`);

      if (errorCount === 0) {
        if (savedCount + updatedCount > 0) {
          const message = `Đã lưu thành công kê khai 603 và ${savedCount} người mới, cập nhật ${updatedCount} người!`;
          console.log(`✅ ${message}`);
          return {
            success: true,
            message
          };
        } else {
          const message = 'Đã lưu thông tin kê khai 603 thành công!';
          console.log(`✅ ${message}`);
          return {
            success: true,
            message
          };
        }
      } else {
        const message = `Đã lưu kê khai 603 và ${savedCount + updatedCount} người thành công, ${errorCount} người lỗi.`;
        console.log(`⚠️ ${message}`);
        return {
          success: false,
          message
        };
      }

    } catch (error) {
      console.error('❌ Error saving all participants:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi ghi dữ liệu kê khai 603. Vui lòng thử lại.'
      };
    } finally {
      setSaving(false);
      console.log('🔄 Save process completed');
    }
  };

  return {
    keKhaiInfo,
    setKeKhaiInfo,
    saving,
    submitting,
    initializeKeKhai,
    createNewKeKhai,
    submitDeclaration,
    saveAllParticipants
  };
};
