import React, { useState } from 'react';
import { keKhaiService } from '../services/keKhaiService';
import { calculateKeKhai603Amount } from './useKeKhai603FormData';

// Interface for participant data
export interface KeKhai603Participant {
  id: number;
  hoTen: string;
  maSoBHXH: string;
  ngaySinh: string;
  gioiTinh: string;
  noiDangKyKCB: string;
  mucLuong: string;
  tyLeDong: string;
  soTienDong: string;
  tuNgayTheCu: string;
  denNgayTheCu: string;
  ngayBienLai: string;
  sttHo: string;
  soThangDong: string;
  maTinhNkq: string;
  maHuyenNkq: string;
  maXaNkq: string;
  noiNhanHoSo: string;
}

// Initial participant data
const createInitialParticipant = (): KeKhai603Participant => ({
  id: 0,
  hoTen: '',
  maSoBHXH: '',
  ngaySinh: '',
  gioiTinh: 'Nam',
  noiDangKyKCB: '',
  mucLuong: '',
  tyLeDong: '4.5',
  soTienDong: '',
  tuNgayTheCu: '',
  denNgayTheCu: '',
  ngayBienLai: new Date().toISOString().split('T')[0],
  sttHo: '',
  soThangDong: '',
  maTinhNkq: '',
  maHuyenNkq: '',
  maXaNkq: '',
  noiNhanHoSo: ''
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
        noiDangKyKCB: item.noi_dang_ky_kcb || '',
        mucLuong: item.muc_luong?.toString() || '',
        tyLeDong: item.ty_le_dong?.toString() || '4.5',
        soTienDong: item.so_tien_dong?.toString() || '',
        tuNgayTheCu: item.tu_ngay_the_cu || '',
        denNgayTheCu: item.den_ngay_the_cu || '',
        ngayBienLai: item.ngay_bien_lai || new Date().toISOString().split('T')[0],
        sttHo: item.stt_ho || '',
        soThangDong: item.so_thang_dong?.toString() || '',
        maTinhNkq: item.ma_tinh_nkq || '',
        maHuyenNkq: item.ma_huyen_nkq || '',
        maXaNkq: item.ma_xa_nkq || '',
        noiNhanHoSo: item.noi_nhan_ho_so || ''
      }));

      // If no participants exist, create one default participant
      if (convertedParticipants.length === 0) {
        const defaultParticipant = await createDefaultParticipant();
        setParticipants([defaultParticipant]);
        setInitialized(true);
        return [defaultParticipant];
      }

      setParticipants(convertedParticipants);
      setInitialized(true);
      return convertedParticipants;
    } catch (error) {
      console.error('Error loading participants:', error);
      throw error;
    }
  };

  // Create default participant and save to database
  const createDefaultParticipant = async (): Promise<KeKhai603Participant> => {
    if (!keKhaiId) {
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    try {
      const newParticipantData = {
        ke_khai_id: keKhaiId,
        stt: 1,
        ho_ten: '',
        gioi_tinh: 'Nam',
        muc_luong: 0,
        ty_le_dong: 4.5,
        so_tien_dong: 0,
        ngay_bien_lai: new Date().toISOString().split('T')[0],
        so_thang_dong: 0
      };

      // Save to database
      const savedParticipant = await keKhaiService.addNguoiThamGia(newParticipantData);

      // Return UI format
      return {
        id: savedParticipant.id,
        hoTen: '',
        maSoBHXH: '',
        ngaySinh: '',
        gioiTinh: 'Nam',
        noiDangKyKCB: '',
        mucLuong: '',
        tyLeDong: '4.5',
        soTienDong: '',
        tuNgayTheCu: '',
        denNgayTheCu: '',
        ngayBienLai: new Date().toISOString().split('T')[0],
        sttHo: '',
        soThangDong: '',
        maTinhNkq: '',
        maHuyenNkq: '',
        maXaNkq: '',
        noiNhanHoSo: ''
      };
    } catch (error) {
      console.error('Error creating default participant:', error);
      throw error;
    }
  };

  // Handle participant field changes
  const handleParticipantChange = async (index: number, field: keyof KeKhai603Participant, value: string) => {
    const participant = participants[index];
    if (!participant) return;

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

        return updatedParticipant;
      }
      return p;
    }));

    // Save to database only if participant has ID (already saved)
    if (participant.id) {
      try {
        const updateData: any = {};

        // Map field names from UI to database
        const fieldMapping: { [key: string]: string } = {
          'hoTen': 'ho_ten',
          'maSoBHXH': 'ma_so_bhxh',
          'ngaySinh': 'ngay_sinh',
          'gioiTinh': 'gioi_tinh',
          'noiDangKyKCB': 'noi_dang_ky_kcb',
          'mucLuong': 'muc_luong',
          'tyLeDong': 'ty_le_dong',
          'soTienDong': 'so_tien_dong',
          'tuNgayTheCu': 'tu_ngay_the_cu',
          'denNgayTheCu': 'den_ngay_the_cu',
          'ngayBienLai': 'ngay_bien_lai',
          'sttHo': 'stt_ho',
          'soThangDong': 'so_thang_dong',
          'maTinhNkq': 'ma_tinh_nkq',
          'maHuyenNkq': 'ma_huyen_nkq',
          'maXaNkq': 'ma_xa_nkq',
          'noiNhanHoSo': 'noi_nhan_ho_so'
        };

        const dbField = fieldMapping[field];
        if (dbField) {
          // Convert value if needed
          if (dbField === 'muc_luong' || dbField === 'ty_le_dong' || dbField === 'so_tien_dong' || dbField === 'so_thang_dong') {
            const numValue = parseFloat(value.replace(/[.,]/g, ''));
            updateData[dbField] = isNaN(numValue) ? null : numValue;
          } else {
            updateData[dbField] = value || null;
          }

          // Update database
          await keKhaiService.updateNguoiThamGia(participant.id, updateData);
        }
      } catch (error) {
        console.error('Error updating participant:', error);
        // Don't show toast to avoid spam, just log error
      }
    }
  };

  // Add new participant
  const addParticipant = async () => {
    if (!keKhaiId) {
      throw new Error('Chưa có thông tin kê khai. Vui lòng thử lại.');
    }

    try {
      setSavingData(true);

      const newParticipantData = {
        ke_khai_id: keKhaiId,
        stt: participants.length + 1,
        ho_ten: '',
        gioi_tinh: 'Nam',
        muc_luong: 0,
        ty_le_dong: 4.5,
        so_tien_dong: 0,
        ngay_bien_lai: new Date().toISOString().split('T')[0],
        so_thang_dong: 0
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

    // Don't allow removal if only one participant
    if (participants.length <= 1) {
      throw new Error('Phải có ít nhất một người tham gia trong kê khai');
    }

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
        noiDangKyKCB: apiData.noiDangKyKCB,
        mucLuong: apiData.mucLuong || '',
        tyLeDong: apiData.tyLeDong || '4.5',
        soTienDong: apiData.soTienDong || '',
        tuNgayTheCu: apiData.tuNgayTheCu || '',
        denNgayTheCu: apiData.denNgayTheCu || '',
        maTinhNkq: apiData.maTinhNkq || '',
        maHuyenNkq: apiData.maHuyenNkq || '',
        maXaNkq: apiData.maXaNkq || '',
        noiNhanHoSo: apiData.noiNhanHoSo || ''
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
