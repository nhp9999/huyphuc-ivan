import React, { useState } from 'react';
import { keKhaiService } from '../services/keKhaiService';
import { calculateKeKhai603Amount, calculateKeKhai603CardValidity } from './useKeKhai603FormData';

// Interface for participant data
export interface KeKhai603Participant {
  id: number;
  hoTen: string;
  maSoBHXH: string;
  ngaySinh: string;
  gioiTinh: string;
  soCCCD: string;
  noiDangKyKCB: string;
  tinhKCB: string; // Mã tỉnh KCB
  maBenhVien: string; // Mã cơ sở KCB
  tenBenhVien: string; // Tên cơ sở KCB
  mucLuong: string;
  tyLeDong: string;
  soTienDong: string;
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
const createInitialParticipant = (): KeKhai603Participant => ({
  id: 0,
  hoTen: '',
  maSoBHXH: '',
  ngaySinh: '',
  gioiTinh: 'Nam',
  soCCCD: '',
  noiDangKyKCB: DEFAULT_CSKCB.ten,
  tinhKCB: DEFAULT_CSKCB.maTinh,
  maBenhVien: DEFAULT_CSKCB.value,
  tenBenhVien: DEFAULT_CSKCB.ten,
  mucLuong: '',
  tyLeDong: '4.5',
  soTienDong: '',
  tuNgayTheCu: '',
  denNgayTheCu: '',
  tuNgayTheMoi: '',
  denNgayTheMoi: '',
  ngayBienLai: new Date().toISOString().split('T')[0],
  sttHo: '',
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
export const useKeKhai603Participants = (keKhaiId?: number) => {
  const [participants, setParticipants] = useState<KeKhai603Participant[]>([]);
  const [savingData, setSavingData] = useState(false);
  const [initialized, setInitialized] = useState(false);

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
  }, [keKhaiId, initialized]);

  // Load participants from database
  const loadParticipants = async () => {
    if (!keKhaiId) return [];

    try {
      const nguoiThamGiaList = await keKhaiService.getNguoiThamGiaByKeKhai(keKhaiId);

      // Convert database data to UI format
      const convertedParticipants = nguoiThamGiaList.map(item => ({
        id: item.id,
        hoTen: item.ho_ten || '',
        maSoBHXH: item.ma_so_bhxh || '',
        ngaySinh: item.ngay_sinh || '',
        gioiTinh: item.gioi_tinh || 'Nam',
        soCCCD: item.so_cccd || '',
        noiDangKyKCB: item.noi_dang_ky_kcb || DEFAULT_CSKCB.ten,
        tinhKCB: item.tinh_kcb || DEFAULT_CSKCB.maTinh,
        maBenhVien: item.ma_benh_vien || DEFAULT_CSKCB.value,
        tenBenhVien: item.noi_dang_ky_kcb || DEFAULT_CSKCB.ten, // Use the name from database or default
        mucLuong: item.muc_luong !== null && item.muc_luong !== undefined ? item.muc_luong.toString() : '',
        tyLeDong: item.ty_le_dong?.toString() || '4.5',
        soTienDong: item.so_tien_dong?.toString() || '',
        tuNgayTheCu: item.tu_ngay_the_cu || '',
        denNgayTheCu: item.den_ngay_the_cu || '',
        tuNgayTheMoi: item.tu_ngay_the_moi || '',
        denNgayTheMoi: item.den_ngay_the_moi || '',
        ngayBienLai: item.ngay_bien_lai || new Date().toISOString().split('T')[0],
        sttHo: item.stt_ho || '',
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
      return convertedParticipants;
    } catch (error) {
      console.error('Error loading participants:', error);
      throw error;
    }
  };



  // Handle participant field changes
  const handleParticipantChange = async (index: number, field: keyof KeKhai603Participant, value: string) => {
    const participant = participants[index];
    if (!participant) return;

    // Validate mã BHXH - chỉ cho phép số và tối đa 10 ký tự
    if (field === 'maSoBHXH') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    // Update local state first
    setParticipants(prev => prev.map((p, i) => {
      if (i === index) {
        const updatedParticipant = { ...p, [field]: value };

        // Auto-calculate payment amount when STT or months change
        if (field === 'sttHo' || field === 'soThangDong') {
          const sttHo = field === 'sttHo' ? value : p.sttHo;
          const soThangDong = field === 'soThangDong' ? value : p.soThangDong;

          if (sttHo && soThangDong) {
            const soTien = calculateKeKhai603Amount(sttHo, soThangDong);
            updatedParticipant.soTienDong = soTien.toLocaleString('vi-VN');
          }
        }

        // Auto-calculate card validity when relevant fields change
        if (field === 'soThangDong' || field === 'ngayBienLai' || field === 'denNgayTheCu') {
          const soThangDong = field === 'soThangDong' ? value : p.soThangDong;
          const ngayBienLai = field === 'ngayBienLai' ? value : p.ngayBienLai;
          const denNgayTheCu = field === 'denNgayTheCu' ? value : p.denNgayTheCu;

          if (soThangDong && ngayBienLai) {
            const cardValidity = calculateKeKhai603CardValidity(soThangDong, denNgayTheCu, ngayBienLai);
            updatedParticipant.tuNgayTheMoi = cardValidity.tuNgay;
            updatedParticipant.denNgayTheMoi = cardValidity.denNgay;
          }
        }

        return updatedParticipant;
      }
      return p;
    }));

    // Note: Auto-save has been disabled. Data will only be saved when user clicks "Ghi dữ liệu" button.
    // The auto-save logic has been removed to prevent unwanted database updates.
  };

  // Add new participant
  const addParticipant = async () => {
    if (!keKhaiId) {
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    try {
      setSavingData(true);

      // Get ke khai info to get organization details
      const keKhaiInfo = await keKhaiService.getKeKhaiById(keKhaiId);
      if (!keKhaiInfo) {
        throw new Error('Không tìm thấy thông tin kê khai');
      }

      const newParticipantData = {
        ke_khai_id: keKhaiId,
        stt: participants.length + 1,
        ho_ten: '',
        gioi_tinh: 'Nam',
        noi_dang_ky_kcb: DEFAULT_CSKCB.ten,
        tinh_kcb: DEFAULT_CSKCB.maTinh,
        ma_benh_vien: DEFAULT_CSKCB.value,
        muc_luong: 0,
        ty_le_dong: 4.5,
        so_tien_dong: 0,
        ngay_bien_lai: new Date().toISOString().split('T')[0],
        so_thang_dong: 0,
        // Add organization fields from ke khai
        cong_ty_id: keKhaiInfo.cong_ty_id,
        co_quan_bhxh_id: keKhaiInfo.co_quan_bhxh_id,
        loai_to_chuc: keKhaiInfo.loai_to_chuc || 'cong_ty'
      };

      // Save to database
      const savedParticipant = await keKhaiService.addNguoiThamGia(newParticipantData);

      // Update local state
      const newParticipant: KeKhai603Participant = {
        ...createInitialParticipant(),
        id: savedParticipant.id
      };

      setParticipants(prev => [...prev, newParticipant]);
      return savedParticipant;
    } catch (error) {
      console.error('Error adding participant:', error);
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

  // Update participant with API data
  const updateParticipantWithApiData = (index: number, apiData: any) => {
    setParticipants(prev => prev.map((p, i) =>
      i === index ? {
        ...p,
        hoTen: apiData.hoTen,
        maSoBHXH: apiData.maSoBhxh,
        ngaySinh: apiData.ngaySinh,
        gioiTinh: apiData.gioiTinh,
        soCCCD: apiData.soCCCD || '',
        noiDangKyKCB: apiData.noiDangKyKCB,
        mucLuong: apiData.mucLuong || '',
        tyLeDong: apiData.tyLeDong || '4.5',
        soTienDong: apiData.soTienDong || '',
        tuNgayTheCu: apiData.tuNgayTheCu || '',
        denNgayTheCu: apiData.denNgayTheCu || '',
        tuNgayTheMoi: apiData.tuNgayTheMoi || '',
        denNgayTheMoi: apiData.denNgayTheMoi || '',
        maTinhNkq: apiData.maTinhNkq || '',
        maHuyenNkq: apiData.maHuyenNkq || '',
        maXaNkq: apiData.maXaNkq || '',
        noiNhanHoSo: apiData.noiNhanHoSo || '',
        maTinhKS: apiData.maTinhKS || '',
        maHuyenKS: apiData.maHuyenKS || '',
        maXaKS: apiData.maXaKS || '',
        tinhKCB: apiData.tinhKCB || '',
        maBenhVien: apiData.maBenhVien || '',
        maHoGiaDinh: apiData.maHoGiaDinh || '',
        phuongAn: apiData.phuongAn || ''
      } : p
    ));
  };

  return {
    participants,
    savingData,
    loadParticipants,
    handleParticipantChange,
    addParticipant,
    removeParticipant,
    updateParticipantWithApiData,
    setParticipants
  };
};
