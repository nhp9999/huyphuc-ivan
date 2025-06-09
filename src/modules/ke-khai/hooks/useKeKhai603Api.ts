import { useState } from 'react';
import { bhytService } from '../../tra-cuu/services/bhytService';
import { KeKhai603Request } from '../types/kekhai603';

// Helper function to normalize birth date from various formats
export const convertDisplayDateToInputDate = (displayDate: string): string => {
  if (!displayDate) return '';

  // Remove any extra spaces
  const cleaned = displayDate.trim();

  // Case 1: Full date format "dd/mm/yyyy" or "dd-mm-yyyy"
  const fullDateMatch = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (fullDateMatch) {
    const [, day, month, year] = fullDateMatch;
    // Convert to ISO format YYYY-MM-DD
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Case 2: Month/Year format "mm/yyyy" or "mm-yyyy"
  const monthYearMatch = cleaned.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (monthYearMatch) {
    const [, month, year] = monthYearMatch;
    // Default to 1st day of the month
    return `${year}-${month.padStart(2, '0')}-01`;
  }

  // Case 3: Year only "yyyy" - keep as year only, don't add month/day
  const yearMatch = cleaned.match(/^(\d{4})$/);
  if (yearMatch) {
    const [, year] = yearMatch;
    // Return just the year, not a full date
    return year;
  }

  // Case 4: Already in ISO format "yyyy-mm-dd"
  const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Case 5: Invalid format - try to extract year at least
  const yearExtract = cleaned.match(/(\d{4})/);
  if (yearExtract) {
    const year = yearExtract[1];
    console.warn(`Invalid birth date format: "${displayDate}", extracting year only: ${year}`);
    return year;
  }

  // If all else fails, return original value
  console.warn(`Cannot parse birth date: "${displayDate}", keeping original`);
  return cleaned;
};

// Test function for birth date conversion (for debugging)
export const testBirthDateConversion = () => {
  const testCases = [
    '12/05/1966',    // Full date DD/MM/YYYY → 1966-05-12
    '05/1966',       // Month/Year MM/YYYY → 1966-05-01
    '1966',          // Year only → 1966 (keep as is)
    '1966-05-12',    // ISO format → 1966-05-12
    '12-05-1966',    // DD-MM-YYYY with dashes → 1966-05-12
    '1966-5-12',     // ISO with single digits → 1966-05-12
    'invalid',       // Invalid format → invalid
    '1966 something' // Year with extra text → 1966
  ];

  console.log('🧪 Testing birth date conversion:');
  testCases.forEach(testCase => {
    const result = convertDisplayDateToInputDate(testCase);
    console.log(`"${testCase}" → "${result}"`);
  });
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
  const [participantSearchLoading, setParticipantSearchLoading] = useState<{ [key: number]: boolean }>({});
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
          ngaySinh: convertDisplayDateToInputDate(response.data.ngaySinh),
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

          // BHYT information - only include mucLuong if API provides a valid value (not empty, not 0)
          ...((response.data.mucLuong && response.data.mucLuong.toString().trim() !== '' && response.data.mucLuong.toString().trim() !== '0') ? { mucLuong: response.data.mucLuong.toString() } : {}),
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
  const searchParticipantData = async (maSoBHXH: string, participantIndex?: number) => {
    if (!maSoBHXH.trim()) {
      throw new Error('Vui lòng nhập mã số BHXH');
    }

    // Set loading state for specific participant if index provided
    if (participantIndex !== undefined) {
      setParticipantSearchLoading(prev => ({ ...prev, [participantIndex]: true }));
    } else {
      setSearchLoading(true);
    }

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
        console.log('🔄 Converting birth date:', response.data.ngaySinh, '→', convertDisplayDateToInputDate(response.data.ngaySinh));

        const participantData = {
          hoTen: response.data.hoTen,
          // Sử dụng mã BHXH từ request nếu response không có (trường hợp maSoBHXH null trong response)
          maSoBHXH: response.data.maSoBhxh || request.maSoBHXH,
          ngaySinh: convertDisplayDateToInputDate(response.data.ngaySinh),
          gioiTinh: response.data.gioiTinh,
          soCCCD: response.data.cmnd || '',
          soDienThoai: response.data.soDienThoai || '',
          soTheBHYT: response.data.soTheBHYT || '',
          danToc: response.data.danToc || '',
          quocTich: response.data.quocTich || 'VN',
          noiDangKyKCB: response.data.noiDangKyKCB,

          // Location data (Khẩu sử)
          maTinhKS: response.data.maTinhKS || '',
          maHuyenKS: response.data.maHuyenKS || '',
          maXaKS: response.data.maXaKS || '',

          // Location data (Nơi khai quyết) - fallback to khẩu sử if null
          maTinhNkq: response.data.maTinhNkq || response.data.maTinhKS || '',
          maHuyenNkq: response.data.maHuyenNkq || response.data.maHuyenKS || '',
          maXaNkq: response.data.maXaNkq || response.data.maXaKS || '',

          // Medical facility data
          tinhKCB: response.data.maKV || '',
          maBenhVien: response.data.maBenhVien || '',
          noiNhanHoSo: response.data.noiNhanHoSo || '',

          // Card validity dates - convert from DD/MM/YYYY to YYYY-MM-DD for date input
          tuNgayTheCu: convertDisplayDateToInputDate(response.data.ngayHieuLuc || ''),
          denNgayTheCu: convertDisplayDateToInputDate(response.data.ngayHetHan || ''),

          // Additional data
          maHoGiaDinh: response.data.maHoGiaDinh || '',
          phuongAn: response.data.phuongAn || '',
          // Only include mucLuong if API provides a valid value (not empty, not 0)
          ...((response.data.mucLuong && response.data.mucLuong.toString().trim() !== '' && response.data.mucLuong.toString().trim() !== '0') ? { mucLuong: response.data.mucLuong.toString() } : {}),
          tyLeDong: response.data.tyLeDong || '4.5',
          soTienDong: response.data.soTienDong || ''
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
      // Clear loading state for specific participant if index provided
      if (participantIndex !== undefined) {
        setParticipantSearchLoading(prev => ({ ...prev, [participantIndex]: false }));
      } else {
        setSearchLoading(false);
      }
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
    participantSearchLoading,
    apiSummary,
    searchKeKhai603,
    searchParticipantData,
    resetApiSummary
  };
};
