import { useState } from 'react';
import { bhytService } from '../services/bhytService';
import { KeKhai603Request } from '../types/kekhai603';

// Helper function to convert from DD/MM/YYYY to YYYY-MM-DD for date input
export const convertDisplayDateToInputDate = (displayDate: string): string => {
  if (!displayDate) return '';

  // Check DD/MM/YYYY format
  const parts = displayDate.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  return displayDate; // Return original if not correct format
};

// Interface for API summary
export interface ApiSummary {
  isLoaded: boolean;
  lastUpdated?: string;
  source?: string;
}

// Custom hook for KeKhai603 API integration
export const useKeKhai603Api = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [apiSummary, setApiSummary] = useState<ApiSummary>({
    isLoaded: false
  });

  // Search configuration
  const searchConfig = {
    mangLuoiId: 76255,
    ma: 'BI0110G',
    maCoQuanBHXH: '08907'
  };

  // Search BHYT information for KeKhai603
  const searchKeKhai603 = async (maSoBHXH: string) => {
    if (!maSoBHXH.trim()) {
      throw new Error('Vui lòng nhập mã số BHXH');
    }

    setSearchLoading(true);
    try {
      const request: KeKhai603Request = {
        maSoBHXH: maSoBHXH.trim(),
        mangLuoiId: searchConfig.mangLuoiId,
        ma: searchConfig.ma,
        maCoQuanBHXH: searchConfig.maCoQuanBHXH
      };

      // Use real API for search
      const response = await bhytService.lookupKeKhai603(request);

      if (response.success && response.data) {
        // Update API summary
        setApiSummary({
          isLoaded: true,
          lastUpdated: new Date().toLocaleString('vi-VN'),
          source: 'API kê khai 603'
        });

        // Transform API data to form format
        const transformedData = {
          hoTen: response.data.hoTen,
          ngaySinh: response.data.ngaySinh,
          gioiTinh: response.data.gioiTinh,
          soCCCD: response.data.cmnd,
          noiDangKyKCB: response.data.noiDangKyKCB,
          soDienThoai: response.data.soDienThoai,
          soTheBHYT: response.data.soTheBHYT,
          quocTich: response.data.quocTich || 'VN',
          danToc: response.data.danToc || '',

          // Address information - use correct field names from response
          maTinhKS: response.data.maTinhKS || '',
          maHuyenKS: response.data.maHuyenKS || '',
          maXaKS: response.data.maXaKS || '',
          maTinhNkq: response.data.maTinhNkq || '',
          maHuyenNkq: response.data.maHuyenNkq || '',
          maXaNkq: response.data.maXaNkq || '',

          // BHYT information
          mucLuong: response.data.mucLuong || '',
          tyLeDong: response.data.tyLeDong || '4.5',
          soTienDong: response.data.soTienDong || '',
          tinhKCB: response.data.maKV || '',
          noiNhanHoSo: response.data.noiNhanHoSo || '',
          maBenhVien: response.data.maBenhVien || '',
          maHoGiaDinh: response.data.maHoGiaDinh || '',
          phuongAn: response.data.phuongAn || '',
          trangThai: response.data.trangThaiThe || '',
          
          // Old card information - convert from DD/MM/YYYY to YYYY-MM-DD for date input
          tuNgayTheCu: convertDisplayDateToInputDate(response.data.ngayHieuLuc || ''),
          denNgayTheCu: convertDisplayDateToInputDate(response.data.ngayHetHan || '')
        };

        return {
          success: true,
          data: transformedData,
          originalData: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Không tìm thấy thông tin BHYT'
        };
      }
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.'
      };
    } finally {
      setSearchLoading(false);
    }
  };

  // Search for participant data
  const searchParticipantData = async (maSoBHXH: string) => {
    if (!maSoBHXH.trim()) {
      throw new Error('Vui lòng nhập mã số BHXH');
    }

    setSearchLoading(true);
    try {
      const request: KeKhai603Request = {
        maSoBHXH: maSoBHXH.trim(),
        mangLuoiId: searchConfig.mangLuoiId,
        ma: searchConfig.ma,
        maCoQuanBHXH: searchConfig.maCoQuanBHXH
      };

      // Use real API for search
      const response = await bhytService.lookupKeKhai603(request);

      if (response.success && response.data) {
        // Transform API data for participant
        const participantData = {
          hoTen: response.data.hoTen,
          maSoBhxh: response.data.maSoBHXH,
          ngaySinh: response.data.ngaySinh,
          gioiTinh: response.data.gioiTinh,
          noiDangKyKCB: response.data.noiDangKyKCB,
          mucLuong: response.data.mucLuong || '',
          tyLeDong: response.data.tyLeDong || '4.5',
          soTienDong: response.data.soTienDong || '',
          
          // Old card information - convert from DD/MM/YYYY to YYYY-MM-DD for date input
          tuNgayTheCu: convertDisplayDateToInputDate(response.data.ngayHieuLuc || ''),
          denNgayTheCu: convertDisplayDateToInputDate(response.data.ngayHetHan || ''),
          
          // Address information for receiving results
          maTinhNkq: response.data.maTinhNkq || '',
          maHuyenNkq: response.data.maHuyenNkq || '',
          maXaNkq: response.data.maXaNkq || '',
          noiNhanHoSo: response.data.noiNhanHoSo || ''
        };

        return {
          success: true,
          data: participantData
        };
      } else {
        return {
          success: false,
          message: response.message || 'Không tìm thấy thông tin BHYT'
        };
      }
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.'
      };
    } finally {
      setSearchLoading(false);
    }
  };

  // Reset API summary
  const resetApiSummary = () => {
    setApiSummary({
      isLoaded: false
    });
  };

  return {
    searchLoading,
    apiSummary,
    searchKeKhai603,
    searchParticipantData,
    resetApiSummary
  };
};
