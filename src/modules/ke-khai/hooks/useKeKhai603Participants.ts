import React, { useState } from 'react';
import { keKhaiService } from '../services/keKhaiService';
import { calculateKeKhai603Amount, calculateKeKhai603AmountThucTe, calculateKeKhai603CardValidity } from './useKeKhai603FormData';

// Interface for participant data
export interface KeKhai603Participant {
  id: number;
  hoTen: string;
  maSoBHXH: string;
  ngaySinh: string;
  gioiTinh: string;
  soCCCD: string;
  soDienThoai: string;
  soTheBHYT: string;
  danToc: string;
  quocTich: string;
  noiDangKyKCB: string;
  tinhKCB: string; // Mã tỉnh KCB
  maBenhVien: string; // Mã cơ sở KCB
  tenBenhVien: string; // Tên cơ sở KCB
  mucLuong: string;
  tyLeDong: string;
  soTienDong: string;
  tienDong?: number; // Giá trị từ cột tien_dong trong database (công thức mới)
  tienDongThucTe?: number; // Giá trị từ cột tien_dong_thuc_te trong database (công thức cũ)
  tuNgayTheCu: string;
  denNgayTheCu: string;
  tuNgayTheMoi: string;
  denNgayTheMoi: string;
  ngayBienLai: string;
  sttHo: string;
  soThangDong: string;
  maTinhNkq: string;
  maHuyenNkq: string;
  maXaNkq: string;
  noiNhanHoSo: string;
  // Additional fields from API
  maTinhKS: string;
  maHuyenKS: string;
  maXaKS: string;
  maHoGiaDinh: string;
  phuongAn: string;
}

// Default CSKCB - Trung tâm Y tế thị xã Tịnh Biên
const DEFAULT_CSKCB = {
  value: '006',
  ten: 'Trung tâm Y tế thị xã Tịnh Biên',
  maTinh: '89'
};

// Initial participant data
const createInitialParticipant = (doiTuongThamGia?: string): KeKhai603Participant => ({
  id: 0,
  hoTen: '',
  maSoBHXH: '',
  ngaySinh: '',
  gioiTinh: '',
  soCCCD: '',
  soDienThoai: '',
  soTheBHYT: '',
  danToc: '',
  quocTich: 'VN',
  noiDangKyKCB: DEFAULT_CSKCB.ten,
  tinhKCB: DEFAULT_CSKCB.maTinh,
  maBenhVien: DEFAULT_CSKCB.value,
  tenBenhVien: DEFAULT_CSKCB.ten,
  mucLuong: '',
  tyLeDong: '100', // Mặc định 100% lương cơ sở
  soTienDong: '',
  tienDong: 0, // Khởi tạo giá trị từ database = 0
  tienDongThucTe: 0, // Khởi tạo giá trị số = 0
  tuNgayTheCu: '',
  denNgayTheCu: '',
  tuNgayTheMoi: '',
  denNgayTheMoi: '',
  ngayBienLai: new Date().toISOString().split('T')[0],
  sttHo: doiTuongThamGia && doiTuongThamGia.includes('DS') ? '1' : '', // Mặc định STT hộ = 1 cho đối tượng DS
  soThangDong: '',
  maTinhNkq: '',
  maHuyenNkq: '',
  maXaNkq: '',
  noiNhanHoSo: '',
  // Additional fields from API
  maTinhKS: '',
  maHuyenKS: '',
  maXaKS: '',
  maHoGiaDinh: '',
  phuongAn: ''
});

// Custom hook for participant management
export const useKeKhai603Participants = (keKhaiId?: number, doiTuongThamGia?: string) => {
  const [participants, setParticipants] = useState<KeKhai603Participant[]>([]);
  const [savingData, setSavingData] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load participants from database
  const loadParticipants = React.useCallback(async () => {
    if (!keKhaiId) return [];

    console.log(`🔄 loadParticipants called for keKhaiId: ${keKhaiId}`);

    try {
      const nguoiThamGiaList = await keKhaiService.getNguoiThamGiaByKeKhai(keKhaiId);

      // Convert database data to UI format
      const convertedParticipants = nguoiThamGiaList.map(item => ({
        id: item.id,
        hoTen: item.ho_ten || '',
        maSoBHXH: item.ma_so_bhxh || '',
        ngaySinh: item.ngay_sinh || '',
        gioiTinh: item.gioi_tinh || '',
        soCCCD: item.so_cccd || '',
        soDienThoai: item.so_dien_thoai || '',
        soTheBHYT: item.so_the_bhyt || '',
        danToc: item.dan_toc || '',
        quocTich: item.quoc_tich || 'VN',
        noiDangKyKCB: item.noi_dang_ky_kcb || DEFAULT_CSKCB.ten,
        tinhKCB: item.tinh_kcb || DEFAULT_CSKCB.maTinh,
        maBenhVien: item.ma_benh_vien || DEFAULT_CSKCB.value,
        tenBenhVien: item.noi_dang_ky_kcb || DEFAULT_CSKCB.ten, // Use the name from database or default
        mucLuong: item.muc_luong !== null && item.muc_luong !== undefined ? item.muc_luong.toString() : '',
        tyLeDong: item.ty_le_dong?.toString() || '100', // Mặc định 100% lương cơ sở
        soTienDong: item.tien_dong?.toString() || '', // Hiển thị từ tien_dong
        tienDong: item.tien_dong || 0, // Load tien_dong từ database
        tienDongThucTe: item.tien_dong_thuc_te || 0, // Load tien_dong_thuc_te từ database
        tuNgayTheCu: item.tu_ngay_the_cu || '',
        denNgayTheCu: item.den_ngay_the_cu || '',
        tuNgayTheMoi: item.tu_ngay_the_moi || '',
        denNgayTheMoi: item.den_ngay_the_moi || '',
        ngayBienLai: item.ngay_bien_lai || new Date().toISOString().split('T')[0],
        sttHo: item.stt_ho || (doiTuongThamGia && doiTuongThamGia.includes('DS') ? '1' : ''),
        soThangDong: item.so_thang_dong?.toString() || '',
        maTinhNkq: item.ma_tinh_nkq || '',
        maHuyenNkq: item.ma_huyen_nkq || '',
        maXaNkq: item.ma_xa_nkq || '',
        noiNhanHoSo: item.noi_nhan_ho_so || '',
        // Additional fields from API
        maTinhKS: item.ma_tinh_ks || '',
        maHuyenKS: item.ma_huyen_ks || '',
        maXaKS: item.ma_xa_ks || '',
        maHoGiaDinh: item.ma_ho_gia_dinh || '',
        phuongAn: item.phuong_an || ''
      }));

      // Set participants (can be empty array)
      setParticipants(convertedParticipants);
      setInitialized(true);

      // Debug log to check loaded data
      console.log(`🔍 Loaded ${convertedParticipants.length} participants:`, convertedParticipants.map(p => ({
        id: p.id,
        hoTen: p.hoTen,
        maBenhVien: p.maBenhVien,
        noiDangKyKCB: p.noiDangKyKCB,
        noiNhanHoSo: p.noiNhanHoSo
      })));

      return convertedParticipants;
    } catch (error) {
      console.error('Error loading participants:', error);
      throw error;
    }
  }, [keKhaiId]);

  // Auto-load participants when keKhaiId is available
  React.useEffect(() => {
    if (keKhaiId && !initialized) {
      const initializeParticipants = async () => {
        try {
          await loadParticipants();
        } catch (error) {
          console.error('Error auto-loading participants:', error);
        }
      };
      initializeParticipants();
    }
  }, [keKhaiId, initialized, loadParticipants]);





  // Handle participant field changes
  const handleParticipantChange = async (index: number, field: keyof KeKhai603Participant, value: string) => {
    const participant = participants[index];
    if (!participant) {
      console.warn(`⚠️ handleParticipantChange: No participant found at index ${index}`);
      return;
    }

    // Debug logging disabled to reduce console spam
    // if (field === 'sttHo' || field === 'soThangDong' || field === 'maSoBHXH') {
    //   console.log(`📝 handleParticipantChange: Setting ${field} = "${value}" for participant ${index + 1}`);
    // }

    // Validate mã BHXH - chỉ cho phép số và tối đa 10 ký tự
    if (field === 'maSoBHXH') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    // Update local state first
    setParticipants(prev => {
      const newParticipants = prev.map((p, i) => {
        if (i === index) {
          const updatedParticipant = { ...p, [field]: value };

          // Debug logging disabled to reduce console spam
          // if (field === 'sttHo' || field === 'soThangDong' || field === 'maSoBHXH') {
          //   console.log(`📝 State update: Participant ${index + 1} ${field} changed from "${p[field]}" to "${value}"`);
          // }

          return updatedParticipant;
        }
        return p;
      });

      // Debug logging disabled to reduce console spam
      // if (field === 'sttHo' || field === 'soThangDong' || field === 'maSoBHXH') {
      //   const updatedParticipant = newParticipants[index];
      //   console.log(`📝 State updated: Participant ${index + 1} now has ${field} = "${updatedParticipant?.[field]}"`);
      // }

      return newParticipants;
    });

    // Auto-calculate payment amount when STT or months change (separate state update)
    if (field === 'sttHo' || field === 'soThangDong') {
      setTimeout(() => {
        setParticipants(prev => prev.map((p, i) => {
          if (i === index) {
            const updatedParticipant = { ...p };
            const sttHo = updatedParticipant.sttHo;
            const soThangDong = updatedParticipant.soThangDong;

            if (sttHo && soThangDong) {
              // Tính tiền đóng theo công thức mới (lưu vào tien_dong)
              const soTien = calculateKeKhai603Amount(sttHo, soThangDong);
              updatedParticipant.soTienDong = soTien.toLocaleString('vi-VN');
              updatedParticipant.tienDong = soTien;

              // Tính tiền đóng thực tế theo công thức cũ (lưu vào tien_dong_thuc_te)
              const soTienThucTe = calculateKeKhai603AmountThucTe(sttHo, soThangDong, 2340000, doiTuongThamGia);
              updatedParticipant.tienDongThucTe = soTienThucTe;
            }
            return updatedParticipant;
          }
          return p;
        }));
      }, 100);
    }

    // Auto-calculate card validity when relevant fields change (separate state update)
    if (field === 'soThangDong' || field === 'ngayBienLai' || field === 'denNgayTheCu') {
      setTimeout(() => {
        setParticipants(prev => prev.map((p, i) => {
          if (i === index) {
            const updatedParticipant = { ...p };
            const soThangDong = updatedParticipant.soThangDong;
            const ngayBienLai = updatedParticipant.ngayBienLai;
            const denNgayTheCu = updatedParticipant.denNgayTheCu;

            if (soThangDong && ngayBienLai) {
              const cardValidity = calculateKeKhai603CardValidity(soThangDong, denNgayTheCu, ngayBienLai);
              updatedParticipant.tuNgayTheMoi = cardValidity.tuNgay;
              updatedParticipant.denNgayTheMoi = cardValidity.denNgay;
            }
            return updatedParticipant;
          }
          return p;
        }));
      }, 150);
    }

    // Note: Auto-save has been disabled. Data will only be saved when user clicks "Ghi dữ liệu" button.
    // The auto-save logic has been removed to prevent unwanted database updates.
  };

  // Add new participant
  const addParticipant = async () => {
    console.log('🚀 addParticipant called');

    if (!keKhaiId) {
      console.error('❌ No keKhaiId available');
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    try {
      setSavingData(true);

      // Get ke khai info to get organization details
      const keKhaiInfo = await keKhaiService.getKeKhaiById(keKhaiId);
      if (!keKhaiInfo) {
        console.error('❌ No keKhaiInfo found');
        throw new Error('Không tìm thấy thông tin kê khai');
      }

      const newParticipantData = {
        ke_khai_id: keKhaiId,
        stt: participants.length + 1,
        ho_ten: '-', // Minimal placeholder for database constraint
        gioi_tinh: '',
        noi_dang_ky_kcb: DEFAULT_CSKCB.ten,
        tinh_kcb: DEFAULT_CSKCB.maTinh,
        ma_benh_vien: DEFAULT_CSKCB.value,
        muc_luong: 0,
        ty_le_dong: 100, // Mặc định 100% lương cơ sở
        tien_dong: 0, // Sử dụng tien_dong thay vì so_tien_dong
        tien_dong_thuc_te: 0, // Khởi tạo tien_dong_thuc_te = 0
        ngay_bien_lai: new Date().toISOString().split('T')[0],
        so_thang_dong: 0,
        stt_ho: doiTuongThamGia && doiTuongThamGia.includes('DS') ? '1' : undefined, // Mặc định STT hộ = 1 cho đối tượng DS
        // Add organization fields from ke khai
        cong_ty_id: keKhaiInfo.cong_ty_id,
        co_quan_bhxh_id: keKhaiInfo.co_quan_bhxh_id,
        loai_to_chuc: keKhaiInfo.loai_to_chuc || 'cong_ty'
      };

      // Save to database
      const savedParticipant = await keKhaiService.addNguoiThamGia(newParticipantData);

      // Update local state
      const newParticipant: KeKhai603Participant = {
        ...createInitialParticipant(doiTuongThamGia),
        id: savedParticipant.id
      };

      setParticipants(prev => {
        const newArray = [...prev, newParticipant];
        return newArray;
      });

      console.log('✅ addParticipant completed successfully');
      return savedParticipant;
    } catch (error) {
      console.error('❌ Error adding participant:', error);
      throw error;
    } finally {
      setSavingData(false);
    }
  };

  // Remove participant
  const removeParticipant = async (index: number) => {
    const participant = participants[index];
    if (!participant) return;

    try {
      setSavingData(true);

      // Remove from database if it has ID (already saved)
      if (participant.id) {
        await keKhaiService.deleteNguoiThamGia(participant.id);
      }

      // Update local state
      setParticipants(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    } finally {
      setSavingData(false);
    }
  };

  // Remove multiple participants
  const removeMultipleParticipants = async (indices: number[]) => {
    if (indices.length === 0) return;

    try {
      setSavingData(true);

      // Get participants to delete
      const participantsToDelete = indices.map(index => participants[index]).filter(Boolean);

      // Get IDs of saved participants
      const idsToDelete = participantsToDelete
        .filter(p => p.id)
        .map(p => p.id!);

      // Delete from database if there are saved participants
      if (idsToDelete.length > 0) {
        await keKhaiService.deleteMultipleNguoiThamGia(idsToDelete);
      }

      // Update local state - remove participants at specified indices
      setParticipants(prev => prev.filter((_, index) => !indices.includes(index)));
    } catch (error) {
      console.error('Error removing multiple participants:', error);
      throw error;
    } finally {
      setSavingData(false);
    }
  };

  // Save single participant (only the changed one)
  const saveSingleParticipant = async (index: number) => {
    console.log(`🚀 saveSingleParticipant called with index: ${index}`);
    console.log(`📊 Current participants array length: ${participants.length}`);
    console.log(`📋 Participants array:`, participants.map((p, i) => ({ index: i, hoTen: p.hoTen, maSoBHXH: p.maSoBHXH })));

    if (!keKhaiId) {
      console.error('❌ No keKhaiId available');
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    // Validate index bounds
    if (index < 0 || index >= participants.length) {
      console.error(`❌ Invalid index: ${index}, participants length: ${participants.length}`);
      throw new Error(`Index không hợp lệ: ${index}. Số lượng người tham gia: ${participants.length}`);
    }

    const participant = participants[index];
    if (!participant) {
      console.error(`❌ No participant found at index ${index}`);
      throw new Error('Không tìm thấy thông tin người tham gia.');
    }

    console.log(`👤 Found participant at index ${index}:`, { hoTen: participant.hoTen, maSoBHXH: participant.maSoBHXH });

    try {
      setSavingData(true);

      // Get ke khai info to get organization details
      const keKhaiInfo = await keKhaiService.getKeKhaiById(keKhaiId);
      if (!keKhaiInfo) {
        throw new Error('Không tìm thấy thông tin kê khai');
      }

      // Prepare data to save
      const participantData: any = {
        ke_khai_id: keKhaiId,
        stt: index + 1,
        ho_ten: participant.hoTen || '',
        ma_so_bhxh: participant.maSoBHXH || null,
        ngay_sinh: participant.ngaySinh || null,
        gioi_tinh: participant.gioiTinh || '',
        so_cccd: participant.soCCCD || null,
        so_dien_thoai: participant.soDienThoai || null,
        so_the_bhyt: participant.soTheBHYT || null,
        dan_toc: participant.danToc || null,
        quoc_tich: participant.quocTich || 'VN',
        noi_dang_ky_kcb: participant.noiDangKyKCB || null,
        muc_luong: participant.mucLuong ? parseFloat(participant.mucLuong.replace(/[.,]/g, '')) : null,
        ty_le_dong: participant.tyLeDong ? parseFloat(participant.tyLeDong) : 100, // Mặc định 100% lương cơ sở
        tien_dong: participant.tienDong || (participant.soTienDong ? parseFloat(participant.soTienDong.replace(/[.,]/g, '')) : null), // Ưu tiên sử dụng tienDong, fallback về soTienDong
        tien_dong_thuc_te: participant.tienDongThucTe || null, // Lưu tien_dong_thuc_te
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
        phuong_an: participant.phuongAn || null,
        // Add organization fields from ke khai
        cong_ty_id: keKhaiInfo.cong_ty_id,
        co_quan_bhxh_id: keKhaiInfo.co_quan_bhxh_id,
        loai_to_chuc: keKhaiInfo.loai_to_chuc || 'cong_ty'
      };

      // Handle required fields and clean data
      Object.keys(participantData).forEach(key => {
        if (participantData[key] === null || participantData[key] === undefined) {
          delete participantData[key];
        }
        // Only remove empty strings for optional date fields
        if (participantData[key] === '' && (key.includes('ngay') || key.includes('date') || key.includes('tu_') || key.includes('den_'))) {
          delete participantData[key];
        }
      });

      // Ensure ho_ten has a value for database constraint (but use minimal placeholder)
      if (!participantData.ho_ten || participantData.ho_ten.trim() === '') {
        participantData.ho_ten = '-'; // Minimal placeholder that will be replaced by API
      }

      if (participant.id) {
        // Update existing participant
        const updatedParticipant = await keKhaiService.updateNguoiThamGia(participant.id, participantData);
        console.log(`✅ Updated participant ${index + 1}:`, updatedParticipant);
        return {
          success: true,
          message: `Đã cập nhật thành công người tham gia ${participant.hoTen || 'STT ' + (index + 1)}!`
        };
      } else {
        // Add new participant
        const savedParticipant = await keKhaiService.addNguoiThamGia(participantData);

        // Update local state with new ID
        setParticipants(prev => prev.map((p, i) =>
          i === index ? { ...p, id: savedParticipant.id } : p
        ));

        console.log(`✅ Saved new participant ${index + 1}:`, savedParticipant);
        return {
          success: true,
          message: `Đã lưu thành công người tham gia ${participant.hoTen || 'STT ' + (index + 1)}!`
        };
      }
    } catch (error) {
      console.error(`Error saving participant ${index + 1}:`, error);
      return {
        success: false,
        message: `Có lỗi xảy ra khi lưu người tham gia ${participant.hoTen || 'STT ' + (index + 1)}. Vui lòng thử lại.`
      };
    } finally {
      setSavingData(false);
    }
  };

  // Update participant with API data
  const updateParticipantWithApiData = (index: number, apiData: any) => {
    console.log(`🔄 updateParticipantWithApiData: Updating participant ${index + 1} with API data`);

    // Log current participant state before update
    const currentParticipant = participants[index];
    if (currentParticipant) {
      console.log(`🔄 Before API update - STT hộ: "${currentParticipant.sttHo}", Months: "${currentParticipant.soThangDong}"`);
    }

    console.log('API data received:', {
      hoTen: apiData.hoTen,
      soDienThoai: apiData.soDienThoai,
      soTheBHYT: apiData.soTheBHYT,
      danToc: apiData.danToc
    });

    setParticipants(prev => prev.map((p, i) =>
      i === index ? {
        ...p,
        // Update with API data but preserve important fields that were set manually
        hoTen: apiData.hoTen || p.hoTen,
        maSoBHXH: apiData.maSoBHXH || p.maSoBHXH, // Keep original if API doesn't return it
        ngaySinh: apiData.ngaySinh || p.ngaySinh,
        gioiTinh: apiData.gioiTinh || p.gioiTinh,
        soCCCD: apiData.soCCCD || p.soCCCD,
        soDienThoai: apiData.soDienThoai || p.soDienThoai,
        soTheBHYT: apiData.soTheBHYT || p.soTheBHYT,
        danToc: apiData.danToc || p.danToc,
        quocTich: apiData.quocTich || p.quocTich || 'VN',

        // Preserve manually set fields - these should NOT be overwritten by API
        sttHo: p.sttHo, // IMPORTANT: Always preserve STT hộ
        soThangDong: p.soThangDong, // IMPORTANT: Always preserve number of months
        tenBenhVien: p.tenBenhVien, // IMPORTANT: Preserve medical facility name if set manually

        // Update medical facility info only if not already set manually
        noiDangKyKCB: apiData.noiDangKyKCB || p.noiDangKyKCB,
        maBenhVien: p.maBenhVien || apiData.maBenhVien, // Prefer manually set value
        tinhKCB: p.tinhKCB || apiData.tinhKCB, // Prefer manually set value

        // Update other API fields
        mucLuong: apiData.mucLuong || p.mucLuong,
        tyLeDong: apiData.tyLeDong || p.tyLeDong || '100', // Mặc định 100% lương cơ sở
        soTienDong: apiData.soTienDong || p.soTienDong,
        tuNgayTheCu: apiData.tuNgayTheCu || p.tuNgayTheCu,
        denNgayTheCu: apiData.denNgayTheCu || p.denNgayTheCu,
        tuNgayTheMoi: apiData.tuNgayTheMoi || p.tuNgayTheMoi,
        denNgayTheMoi: apiData.denNgayTheMoi || p.denNgayTheMoi,

        // Preserve manually set receipt date
        ngayBienLai: p.ngayBienLai,

        // Update address information
        maTinhNkq: apiData.maTinhNkq || p.maTinhNkq,
        maHuyenNkq: apiData.maHuyenNkq || p.maHuyenNkq,
        maXaNkq: apiData.maXaNkq || p.maXaNkq,
        noiNhanHoSo: apiData.noiNhanHoSo || p.noiNhanHoSo,
        maTinhKS: apiData.maTinhKS || p.maTinhKS,
        maHuyenKS: apiData.maHuyenKS || p.maHuyenKS,
        maXaKS: apiData.maXaKS || p.maXaKS,
        maHoGiaDinh: apiData.maHoGiaDinh || p.maHoGiaDinh,
        phuongAn: apiData.phuongAn || p.phuongAn
      } : p
    ));

    // Log the result after update
    setTimeout(() => {
      const updatedParticipant = participants[index];
      if (updatedParticipant) {
        console.log(`🔄 After API update - STT hộ: "${updatedParticipant.sttHo}", Months: "${updatedParticipant.soThangDong}"`);
      }
    }, 50);
  };

  // Save participant directly from form data (new approach)
  const saveParticipantFromForm = async (formData: any) => {
    console.log('🚀 saveParticipantFromForm called');
    console.log('📋 Form data received:', formData);

    if (!keKhaiId) {
      console.error('❌ No keKhaiId available');
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    // Validate required fields from the passed formData (not global form state)
    if (!formData.maSoBHXH || !formData.maSoBHXH.trim()) {
      console.error('❌ Missing maSoBHXH in form data');
      throw new Error('Mã số BHXH là bắt buộc.');
    }

    try {
      setSavingData(true);
      console.log('💾 Setting saving data to true');

      // Get ke khai info to get organization details
      console.log('📋 Getting ke khai info...');
      const keKhaiInfo = await keKhaiService.getKeKhaiById(keKhaiId);
      if (!keKhaiInfo) {
        console.error('❌ No keKhaiInfo found');
        throw new Error('Không tìm thấy thông tin kê khai');
      }
      console.log('✅ KeKhai info retrieved:', keKhaiInfo.id);

      // Prepare participant data from form
      const participantData: any = {
        ke_khai_id: keKhaiId,
        stt: participants.length + 1,
        ho_ten: formData.hoTen && formData.hoTen.trim() ? formData.hoTen.trim() : '', // Keep empty for now, will be handled in cleaning
        ma_so_bhxh: formData.maSoBHXH || null,
        ngay_sinh: formData.ngaySinh || null,
        gioi_tinh: formData.gioiTinh || '',
        so_cccd: formData.soCCCD || null,
        so_dien_thoai: formData.soDienThoai || null,
        so_the_bhyt: formData.soTheBHYT || null,
        dan_toc: formData.danToc || null,
        quoc_tich: formData.quocTich || 'VN',
        noi_dang_ky_kcb: formData.noiDangKyKCB || null,
        tinh_kcb: formData.tinhKCB || null,
        ma_benh_vien: formData.maBenhVien || null,
        so_thang_dong: formData.soThangDong ? parseInt(formData.soThangDong) : null,
        stt_ho: formData.sttHo || null,
        ngay_bien_lai: formData.ngayBienLai || new Date().toISOString().split('T')[0],
        ma_tinh_nkq: formData.maTinhNkq || null,
        ma_huyen_nkq: formData.maHuyenNkq || null,
        ma_xa_nkq: formData.maXaNkq || null,
        ma_tinh_ks: formData.maTinhKS || null,
        ma_huyen_ks: formData.maHuyenKS || null,
        ma_xa_ks: formData.maXaKS || null,
        tu_ngay_the_cu: formData.tuNgayTheCu || null,
        den_ngay_the_cu: formData.denNgayTheCu || null,
        tu_ngay_the_moi: formData.tuNgayTheMoi || null,
        den_ngay_the_moi: formData.denNgayTheMoi || null,
        ma_ho_gia_dinh: formData.maHoGiaDinh || null,
        phuong_an: formData.phuongAn || null,
        muc_luong: 0,
        ty_le_dong: 100,
        tien_dong: 0,
        tien_dong_thuc_te: 0,
        // Add organization fields from ke khai
        cong_ty_id: keKhaiInfo.cong_ty_id,
        co_quan_bhxh_id: keKhaiInfo.co_quan_bhxh_id,
        loai_to_chuc: keKhaiInfo.loai_to_chuc || 'cong_ty'
      };

      // Handle required fields and clean data
      Object.keys(participantData).forEach(key => {
        if (participantData[key] === null || participantData[key] === undefined) {
          delete participantData[key];
        }
        // Only remove empty strings for optional date fields
        if (participantData[key] === '' && (key.includes('ngay') || key.includes('date') || key.includes('tu_') || key.includes('den_'))) {
          delete participantData[key];
        }
      });

      // Ensure ho_ten has a value for database constraint (but use minimal placeholder)
      if (!participantData.ho_ten || participantData.ho_ten.trim() === '') {
        participantData.ho_ten = '-'; // Minimal placeholder that will be replaced by API
      }

      console.log('📝 Participant data to save:', participantData);

      // Save to database
      console.log('💾 Saving to database...');
      const savedParticipant = await keKhaiService.addNguoiThamGia(participantData);
      console.log('✅ Saved to database:', savedParticipant);

      // Create participant object for local state
      const newParticipant: KeKhai603Participant = {
        id: savedParticipant.id,
        hoTen: formData.hoTen || '',
        maSoBHXH: formData.maSoBHXH || '',
        ngaySinh: formData.ngaySinh || '',
        gioiTinh: formData.gioiTinh || '',
        soCCCD: formData.soCCCD || '',
        soDienThoai: formData.soDienThoai || '',
        soTheBHYT: formData.soTheBHYT || '',
        danToc: formData.danToc || '',
        quocTich: formData.quocTich || 'VN',
        noiDangKyKCB: formData.noiDangKyKCB || '',
        tinhKCB: formData.tinhKCB || '',
        maBenhVien: formData.maBenhVien || '',
        tenBenhVien: formData.noiDangKyKCB || '',
        mucLuong: '',
        tyLeDong: '100',
        soTienDong: '',
        tienDong: 0,
        tienDongThucTe: 0,
        tuNgayTheCu: formData.tuNgayTheCu || '',
        denNgayTheCu: formData.denNgayTheCu || '',
        tuNgayTheMoi: formData.tuNgayTheMoi || '',
        denNgayTheMoi: formData.denNgayTheMoi || '',
        ngayBienLai: formData.ngayBienLai || new Date().toISOString().split('T')[0],
        sttHo: formData.sttHo || '',
        soThangDong: formData.soThangDong || '',
        maTinhNkq: formData.maTinhNkq || '',
        maHuyenNkq: formData.maHuyenNkq || '',
        maXaNkq: formData.maXaNkq || '',
        noiNhanHoSo: '',
        maTinhKS: formData.maTinhKS || '',
        maHuyenKS: formData.maHuyenKS || '',
        maXaKS: formData.maXaKS || '',
        maHoGiaDinh: formData.maHoGiaDinh || '',
        phuongAn: formData.phuongAn || ''
      };

      // Update local state
      console.log('🔄 Updating local state...');
      console.log('🔍 DEBUG: Current participants before update:', participants.length);
      console.log('🔍 DEBUG: New participant to add:', { id: newParticipant.id, hoTen: newParticipant.hoTen, maSoBHXH: newParticipant.maSoBHXH });

      setParticipants(prev => {
        console.log('🔍 DEBUG: setParticipants callback - prev length:', prev.length);
        const newArray = [...prev, newParticipant];
        console.log('📊 New participants array length:', newArray.length);
        console.log('🔍 DEBUG: New array contents:', newArray.map(p => ({ id: p.id, hoTen: p.hoTen, maSoBHXH: p.maSoBHXH })));
        return newArray;
      });

      console.log('🔍 DEBUG: After setParticipants call completed');

      console.log('✅ saveParticipantFromForm completed successfully');
      return {
        success: true,
        message: `Đã lưu thành công người tham gia ${formData.hoTen || 'mới'}!`,
        participant: savedParticipant
      };
    } catch (error) {
      console.error('❌ Error saving participant from form:', error);
      return {
        success: false,
        message: `Có lỗi xảy ra khi lưu người tham gia. Vui lòng thử lại.`
      };
    } finally {
      setSavingData(false);
      console.log('🔄 Setting saving data to false');
    }
  };

  return {
    participants,
    savingData,
    loadParticipants,
    handleParticipantChange,
    addParticipant,
    removeParticipant,
    removeMultipleParticipants,
    updateParticipantWithApiData,
    saveSingleParticipant,
    saveParticipantFromForm,
    setParticipants
  };
};
