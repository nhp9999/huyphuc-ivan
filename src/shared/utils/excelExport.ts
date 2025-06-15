import * as ExcelJS from 'exceljs';
import { KeKhai603Participant } from '../../modules/ke-khai/hooks/useKeKhai603Participants';
import { DanhSachKeKhai } from '../services/api/supabaseClient';
import { tinhService } from '../services/location/tinhService';
import { huyenService } from '../services/location/huyenService';
import { xaService } from '../services/location/xaService';

// Interface for D03-TK1-VNPT Excel export data
export interface D03TK1VNPTExportData {
  STT: number;
  HoTen: string;
  MasoBHXH: string;
  MaPhongBan: string;
  Loai: number;
  PA: string;
  TyleNSDP: string;
  NgayBienLai: string;
  SoBienLai: string;
  NguoiThamGiaThu: number;
  Tiendong: number;
  TienDongThucTe: number;
  MucHuong: number;
  TuNgay: string;
  NgayChet: string;
  HotroKhac: string;
  TenTinhDangSS: string;
  Matinh_DangSS: string;
  Tenhuyen_DangSS: string;
  Mahuyen_DangSS: string;
  TenxaDangSS: string;
  Maxa_DangSS: string;
  Diachi_DangSS: string;
  Sothang: number;
  Ghichu: string;
  NgaySinh: string;
  GioiTinh: number;
  TenTinhBenhVien: string;
  MaTinhBenhVien: string;
  TenBenhVien: string;
  MaBenhVien: string;
  MavungSS: string;
  Tk1_Save: string;
  CMND: string;
  Maho_Giadinh: string;
  QuocTich: string;
  TenTinhKS: string;
  MaTinh_KS: string;
  TenHuyenKS: string;
  MaHuyen_KS: string;
  TenXaKS: string;
  MaXa_KS: string;
  TenTinhNN: string;
  Matinh_NN: string;
  TenHuyenNN: string;
  Mahuyen_NN: string;
  TenXaNN: string;
  Maxa_NN: string;
  Diachi_NN: string;
  SoCCCD: string;
  SoBienLai2: string;
  NgayBienLai2: string;
  MaNhanvienThu: string;
  DiaChi: string;
}

// Function to convert participant data to D03-TK1-VNPT format
export const convertToD03TK1Format = (
  participants: KeKhai603Participant[],
  keKhaiInfo: DanhSachKeKhai,
  maNhanVienThu?: string
): D03TK1VNPTExportData[] => {
  return participants.map((participant, index) => {
    console.log(`Participant ${index + 1} data:`, {
      mucLuong: participant.mucLuong,
      soTienDong: participant.soTienDong,
      mucLuongType: typeof participant.mucLuong,
      soTienDongType: typeof participant.soTienDong
    });

    // Convert date format from YYYY-MM-DD to DD/MM/YYYY with leading zeros
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return '';

      // Handle different date formats
      let date: Date;
      if (dateStr.includes('/')) {
        // Already in DD/MM/YYYY format
        return dateStr;
      } else if (dateStr.includes('-')) {
        // YYYY-MM-DD format
        date = new Date(dateStr);
      } else {
        return dateStr;
      }

      if (isNaN(date.getTime())) return dateStr;

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };

    // Convert gender to number (0 = female, 1 = male)
    const genderToNumber = (gender: string): number => {
      return gender === 'Nam' ? 1 : 0;
    };

    // Parse amount values
    const parseAmount = (amountStr: string | number): number => {
      if (!amountStr && amountStr !== 0) return 0;

      // If it's already a number, return it
      if (typeof amountStr === 'number') return amountStr;

      // If it's a string, clean it up
      const cleaned = String(amountStr).replace(/[.,\s]/g, '');
      const result = parseFloat(cleaned) || 0;
      console.log(`parseAmount: "${amountStr}" -> ${result}`);
      return result;
    };



    return {
      STT: index + 1,
      HoTen: participant.hoTen || '',
      MasoBHXH: participant.maSoBHXH || '',
      MaPhongBan: '', // Empty as per sample
      Loai: 1, // Default value as per sample
      PA: participant.phuongAn || 'ON', // Default to 'ON' as per sample
      TyleNSDP: '', // Empty as requested
      NgayBienLai: formatDate(participant.ngayBienLai),
      SoBienLai: participant.sttHo || '',
      NguoiThamGiaThu: parseInt(participant.sttHo) || 1, // Use stt_ho data or default to 1
      Tiendong: participant.tienDong || parseAmount(participant.soTienDong) || parseAmount(keKhaiInfo.luong_co_so?.toString()) || 2340000, // Lấy từ cột tien_dong trong database
      TienDongThucTe: participant.tienDongThucTe || parseAmount(participant.soTienDong), // Tiền đóng thực tế từ tienDongThucTe, fallback về soTienDong
      MucHuong: 4, // Default value as per sample
      TuNgay: formatDate(participant.tuNgayTheCu),
      NgayChet: '', // Empty as per sample
      HotroKhac: '', // Empty as per sample
      TenTinhDangSS: '', // Will be populated from location service
      Matinh_DangSS: participant.maTinhNkq || '',
      Tenhuyen_DangSS: '', // Will be populated from location service
      Mahuyen_DangSS: participant.maHuyenNkq || '',
      TenxaDangSS: '', // Will be populated from location service
      Maxa_DangSS: participant.maXaNkq || '',
      Diachi_DangSS: participant.noiNhanHoSo || '',
      Sothang: parseInt(participant.soThangDong) || 12,
      Ghichu: '', // Empty as per sample
      NgaySinh: formatDate(participant.ngaySinh),
      GioiTinh: genderToNumber(participant.gioiTinh),
      TenTinhBenhVien: '', // Will be populated from location service
      MaTinhBenhVien: participant.tinhKCB || '',
      TenBenhVien: participant.tenBenhVien || '',
      MaBenhVien: participant.maBenhVien || '',
      MavungSS: '', // Empty as per sample
      Tk1_Save: (participant.phuongAn === 'TM') ? 'x' : '', // Only 'x' when PA is 'TM'
      CMND: participant.soCCCD || '',
      Maho_Giadinh: participant.maHoGiaDinh || '',
      QuocTich: 'VN', // Default value as per sample
      TenTinhKS: '', // Will be populated from location service
      MaTinh_KS: participant.maTinhKS || '',
      TenHuyenKS: '', // Will be populated from location service
      MaHuyen_KS: participant.maHuyenKS || '',
      TenXaKS: '', // Will be populated from location service
      MaXa_KS: participant.maXaKS || '',
      TenTinhNN: '', // Will be populated from location service
      Matinh_NN: participant.maTinhNkq || '',
      TenHuyenNN: '', // Will be populated from location service
      Mahuyen_NN: participant.maHuyenNkq || '',
      TenXaNN: '', // Will be populated from location service
      Maxa_NN: participant.maXaNkq || '',
      Diachi_NN: participant.noiNhanHoSo || '',
      SoCCCD: participant.soCCCD || '',
      SoBienLai2: participant.sttHo || '',
      NgayBienLai2: formatDate(participant.ngayBienLai),
      MaNhanvienThu: maNhanVienThu || keKhaiInfo.created_by || ''
    };
  });
};

// Function to export D03-TK1-VNPT Excel file
export const exportD03TK1VNPTExcel = async (
  participants: KeKhai603Participant[],
  keKhaiInfo: DanhSachKeKhai,
  maNhanVienThu?: string,
  fileName?: string
): Promise<void> => {
  try {
    // Convert data to D03-TK1-VNPT format
    const exportData = convertToD03TK1Format(participants, keKhaiInfo, maNhanVienThu);

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dữ Liệu');

    // Define column headers matching the CSV sample format
    const columnHeaders = [
      'STT', 'HoTen', 'MasoBHXH', 'MaPhongBan', 'Loai', 'PA', 'TyleNSDP', 'NgayBienLai', 'SoBienLai', 'NguoiThamGiaThu',
      'Tiendong', 'TienDongThucTe', 'MucHuong', 'TuNgay', 'NgayChet', 'HotroKhac', 'TenTinhDangSS', 'Matinh_DangSS', 'Tenhuyen_DangSS', 'Mahuyen_DangSS',
      'TenxaDangSS', 'Maxa_DangSS', 'Diachi_DangSS', 'Sothang', 'Ghichu', 'NgaySinh', 'GioiTinh', 'TenTinhBenhVien', 'MaTinhBenhVien', 'TenBenhVien',
      'MaBenhVien', 'MavungSS', 'Tk1_Save', 'CMND', 'Maho_Giadinh', '', 'QuocTich', '', '', 'TenTinhKS',
      'MaTinh_KS', 'TenHuyenKS', 'MaHuyen_KS', 'TenXaKS', 'MaXa_KS', 'TenTinhNN', 'Matinh_NN', 'TenHuyenNN', 'Mahuyen_NN', 'TenXaNN',
      'Maxa_NN', 'Diachi_NN', '', '', '', '', '', '', '', 'SoCCCD',
      'SoBienLai', 'NgayBienLai', 'MaNhanvienThu'
    ];

    // Add empty header rows (as per sample format)
    worksheet.addRow(Array(63).fill(''));
    worksheet.addRow(Array(63).fill(''));

    // Add column headers
    worksheet.addRow(columnHeaders);

    // Add data rows
    exportData.forEach(row => {
      const dataRow = [
        row.STT, row.HoTen, row.MasoBHXH, row.MaPhongBan, row.Loai, row.PA, row.TyleNSDP, row.NgayBienLai, row.SoBienLai, row.NguoiThamGiaThu,
        row.Tiendong, row.TienDongThucTe, row.MucHuong, row.TuNgay, row.NgayChet, row.HotroKhac, row.TenTinhDangSS, row.Matinh_DangSS, row.Tenhuyen_DangSS, row.Mahuyen_DangSS,
        row.TenxaDangSS, row.Maxa_DangSS, row.Diachi_DangSS, row.Sothang, row.Ghichu, row.NgaySinh, row.GioiTinh, row.TenTinhBenhVien, row.MaTinhBenhVien, row.TenBenhVien,
        row.MaBenhVien, row.MavungSS, row.Tk1_Save, row.CMND, row.Maho_Giadinh, '', row.QuocTich, '', '', row.TenTinhKS,
        row.MaTinh_KS, row.TenHuyenKS, row.MaHuyen_KS, row.TenXaKS, row.MaXa_KS, row.TenTinhNN, row.Matinh_NN, row.TenHuyenNN, row.Mahuyen_NN, row.TenXaNN,
        row.Maxa_NN, row.Diachi_NN, '', '', '', '', '', '', '', row.SoCCCD,
        row.SoBienLai2, row.NgayBienLai2, row.MaNhanvienThu
      ];
      worksheet.addRow(dataRow);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      if (column.header) {
        column.width = Math.max(column.header.toString().length, 10);
      }
    });

    // Generate filename
    const defaultFileName = `D03-TK1-VNPT_${keKhaiInfo.ma_ke_khai || 'export'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const finalFileName = fileName || defaultFileName;

    // Write file to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob and download
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFileName;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);

    console.log(`Exported D03-TK1-VNPT Excel file: ${finalFileName}`);
  } catch (error) {
    console.error('Error exporting D03-TK1-VNPT Excel:', error);
    throw new Error('Không thể xuất file Excel. Vui lòng thử lại.');
  }
};

// Interface for processed participant data from HoSoDaXuLy
export interface ProcessedParticipantExport {
  id: number;
  ho_ten: string;
  ma_so_bhxh: string;
  so_cccd: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_dien_thoai: string;
  so_the_bhyt: string;
  noi_dang_ky_kcb: string;
  noi_nhan_ho_so: string;
  ma_tinh_nkq: string;
  ma_huyen_nkq: string;
  ma_xa_nkq: string;
  xa_nkq: string;
  huyen_nkq: string;
  tinh_nkq: string;
  dia_chi: string;
  tien_dong_thuc_te: number;
  tien_dong: number;
  participant_status: string;
  payment_status: string;
  submitted_at: string;
  paid_at: string;
  ke_khai: {
    id: number;
    ma_ke_khai: string;
    ten_ke_khai: string;
    trang_thai: string;
    created_at: string;
    approved_at: string;
    luong_co_so: number;
  };
}

// Helper function to resolve location names from codes (name only, no codes)
const resolveLocationNames = async (
  maTinh?: string,
  maHuyen?: string,
  maXa?: string
): Promise<{ tinhName: string; huyenName: string; xaName: string }> => {
  try {
    const [tinhName, huyenName, xaName] = await Promise.all([
      maTinh ? tinhService.getTinhNameByValue(maTinh) : '',
      maHuyen && maTinh ? huyenService.getHuyenNameByValue(maHuyen, maTinh) : '',
      maXa && maHuyen && maTinh ? xaService.getXaNameByValue(maXa, maHuyen, maTinh) : ''
    ]);

    return {
      tinhName: tinhName || '',
      huyenName: huyenName || '',
      xaName: xaName || ''
    };
  } catch (error) {
    console.error('Error resolving location names:', error);
    return {
      tinhName: maTinh || '',
      huyenName: maHuyen || '',
      xaName: maXa || ''
    };
  }
};

// Function to convert processed participant data to D03-TK1 format
export const convertProcessedParticipantToD03TK1Format = async (
  participants: ProcessedParticipantExport[],
  maNhanVienThu?: string,
  skipLocationResolution: boolean = false
): Promise<D03TK1VNPTExportData[]> => {
  console.log(`🚀 Converting ${participants.length} participants to D03-TK1 format...`);

  // Location resolution cache
  const locationCache = new Map<string, { xaName: string; huyenName: string; tinhName: string }>();

  if (!skipLocationResolution) {
    // Collect unique location codes for batch resolution
    const uniqueLocations = new Set<string>();
    participants.forEach(participant => {
      if (participant.ma_tinh_nkq && participant.ma_huyen_nkq && participant.ma_xa_nkq) {
        uniqueLocations.add(`${participant.ma_tinh_nkq}-${participant.ma_huyen_nkq}-${participant.ma_xa_nkq}`);
      }
    });

    console.log(`📍 Found ${uniqueLocations.size} unique locations to resolve...`);

    // Batch resolve all unique locations
    if (uniqueLocations.size > 0) {
      await Promise.all(
        Array.from(uniqueLocations).map(async (locationKey) => {
          const [maTinh, maHuyen, maXa] = locationKey.split('-');
          try {
            const locationNames = await resolveLocationNames(maTinh, maHuyen, maXa);
            locationCache.set(locationKey, locationNames);
          } catch (error) {
            console.warn(`Failed to resolve location ${locationKey}:`, error);
            locationCache.set(locationKey, { xaName: '', huyenName: '', tinhName: '' });
          }
        })
      );
    }

    console.log(`✅ Resolved ${locationCache.size} locations. Processing participants...`);
  } else {
    console.log(`⚡ Skipping location resolution for faster export...`);
  }

  // Process participants without async location calls
  const processedParticipants = participants.map((participant, index) => {
    // Helper function to format date
    const formatDate = (dateString: string | null | undefined): string => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        // Format as dd/mm/yyyy to ensure full date display
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch {
        return '';
      }
    };

    // Helper function to convert gender to number
    const genderToNumber = (gender: string | undefined): number => {
      if (!gender) return 0;
      return gender.toLowerCase() === 'nam' ? 1 : 0;
    };

    // Helper function to parse amount
    const parseAmount = (value: string | number | null | undefined): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

      // Get location names from cache
      const locationKey = `${participant.ma_tinh_nkq}-${participant.ma_huyen_nkq}-${participant.ma_xa_nkq}`;
      const locationNames = locationCache.get(locationKey) || { xaName: '', huyenName: '', tinhName: '' };

      // Helper function to build full address
      const buildFullAddress = (): string => {
        const addressParts = [];

        // Add detailed address if available
        if (participant.noi_nhan_ho_so) {
          addressParts.push(participant.noi_nhan_ho_so);
        }

        // Add resolved location names (if available)
        if (!skipLocationResolution) {
          if (locationNames.xaName) {
            addressParts.push(locationNames.xaName);
          }
          if (locationNames.huyenName) {
            addressParts.push(locationNames.huyenName);
          }
          if (locationNames.tinhName) {
            addressParts.push(locationNames.tinhName);
          }
        } else {
          // Use raw codes if skipping resolution
          if (participant.ma_xa_nkq) {
            addressParts.push(`Xã ${participant.ma_xa_nkq}`);
          }
          if (participant.ma_huyen_nkq) {
            addressParts.push(`Huyện ${participant.ma_huyen_nkq}`);
          }
          if (participant.ma_tinh_nkq) {
            addressParts.push(`Tỉnh ${participant.ma_tinh_nkq}`);
          }
        }

        return addressParts.join(', ');
      };

    return {
      STT: index + 1,
      HoTen: participant.ho_ten || '',
      MasoBHXH: participant.ma_so_bhxh || '',
      MaPhongBan: '', // Empty as per sample
      Loai: 1, // Default value as per sample
      PA: 'ON', // Default to 'ON' as per sample
      TyleNSDP: '', // Empty as requested
      NgayBienLai: formatDate(participant.submitted_at),
      SoBienLai: '', // Leave empty as requested - no automatic numbering
      NguoiThamGiaThu: 1, // Default to 1
      Tiendong: participant.tien_dong_thuc_te || participant.tien_dong || participant.ke_khai.luong_co_so || 2340000,
      TienDongThucTe: participant.tien_dong_thuc_te || participant.tien_dong || participant.ke_khai.luong_co_so || 2340000,
      MucHuong: 0, // Default value
      TuNgay: formatDate(participant.submitted_at),
      NgayChet: '', // Empty as per sample
      HotroKhac: '', // Empty as per sample
      TenTinhDangSS: '', // Will be populated from location service
      Matinh_DangSS: '',
      Tenhuyen_DangSS: '',
      Mahuyen_DangSS: '',
      TenxaDangSS: '',
      Maxa_DangSS: '',
      Diachi_DangSS: '',
      Sothang: 12, // Default value
      Ghichu: '',
      NgaySinh: formatDate(participant.ngay_sinh),
      GioiTinh: genderToNumber(participant.gioi_tinh),
      TenTinhBenhVien: '', // Will be populated from location service
      MaTinhBenhVien: '',
      TenBenhVien: participant.noi_dang_ky_kcb || '',
      MaBenhVien: '',
      MavungSS: '', // Empty as per sample
      Tk1_Save: '', // Empty as default
      CMND: participant.so_cccd || '',
      Maho_Giadinh: '',
      QuocTich: 'VN', // Default value as per sample
      TenTinhKS: '', // Will be populated from location service
      MaTinh_KS: '',
      TenHuyenKS: '',
      MaHuyen_KS: '',
      TenXaKS: '',
      MaXa_KS: '',
      TenTinhNN: '',
      Matinh_NN: '',
      TenHuyenNN: '',
      Mahuyen_NN: '',
      TenXaNN: '',
      Maxa_NN: '',
      Diachi_NN: '',
      SoCCCD: participant.so_cccd || '',
      SoBienLai2: '', // Leave empty as requested - no automatic numbering
      NgayBienLai2: formatDate(participant.submitted_at),
      MaNhanvienThu: maNhanVienThu || '',
      DiaChi: buildFullAddress(), // Build full address from multiple fields
      // Store resolved location names for reference
      xa_nkq: locationNames.xaName,
      huyen_nkq: locationNames.huyenName,
      tinh_nkq: locationNames.tinhName
    };
    });

  console.log(`✅ Converted ${processedParticipants.length} participants successfully.`);
  return processedParticipants;
};

// Function to export D03-TK1 using existing template file
export const exportD03TK1WithTemplate = async (
  participants: ProcessedParticipantExport[],
  maNhanVienThu?: string,
  fileName?: string,
  skipLocationResolution: boolean = false
): Promise<void> => {
  try {
    // Convert data to D03-TK1 format
    const exportData = await convertProcessedParticipantToD03TK1Format(participants, maNhanVienThu, skipLocationResolution);

    // Load the template file
    const templatePath = '/templates/FileMau_D03_TS.xlsx';
    const response = await fetch(templatePath);

    if (!response.ok) {
      throw new Error('Không thể tải file mẫu Excel');
    }

    const templateBuffer = await response.arrayBuffer();

    // Load template workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(templateBuffer);

    // Get the first worksheet (assuming data goes to the first sheet)
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error('Không tìm thấy worksheet trong file mẫu');
    }

    // Based on the image, data should start from row 15 (after the sample data)
    const dataStartRow = 15;

    // Create base style template for performance
    const baseStyle = {
      font: {
        name: 'Times New Roman',
        size: 11,
        color: { argb: '000000' }
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'left',
        wrapText: true
      },
      border: {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      }
    };

    // Insert new rows starting from row 15 to avoid overwriting sample data
    console.log(`Starting Excel export for ${exportData.length} participants...`);

    exportData.forEach((rowData, index) => {
      const insertPosition = dataStartRow + index; // Position 15, 16, 17, ...

      // Create data array for the new row (including column Q)
      const rowValues = [
        rowData.STT, // A: STT
        rowData.HoTen, // B: Họ tên
        rowData.MasoBHXH, // C: Mã BHXH
        rowData.CMND || '', // D: Số CCCD/CNTND/ĐDCN/hộ chiếu
        rowData.NgaySinh, // E: Ngày sinh
        rowData.GioiTinh === 1 ? 'Nam' : 'Nữ', // F: Giới tính
        rowData.DiaChi || '', // G: Địa chỉ
        rowData.TenBenhVien || '', // H: Nơi đăng ký KCB (Bệnh viện)
        rowData.NgayBienLai, // I: Ngày biên lai
        rowData.SoBienLai || '', // J: Số biên lai (leave empty if no data)
        rowData.Tiendong, // K: Số tiền
        rowData.TuNgay, // L: Từ ngày (moved from J to L)
        rowData.Ghichu || '', // M: Ghi chú
        rowData.NgayChet || '', // N: Đến ngày (moved from L to N)
        rowData.Sothang, // O: Số tháng
        rowData.MaNhanvienThu || '', // P: Mã nhân viên thu
        '' // Q: Cột trống (cột 17)
      ];

      // Insert a completely new row at the specified position
      const newRow = worksheet.insertRow(insertPosition, rowValues);

      // Force create all cells up to column Q (17) to ensure proper grid
      for (let colIndex = 1; colIndex <= 17; colIndex++) {
        const cell = newRow.getCell(colIndex);
        // Ensure cell exists by accessing it
        if (cell.value === undefined && colIndex > rowValues.length) {
          cell.value = '';
        }
      }

      // Set row height once
      newRow.height = 75;

      // Apply formatting efficiently using base style
      for (let colNumber = 1; colNumber <= 17; colNumber++) {
        const cell = newRow.getCell(colNumber);

        // Apply base style
        cell.style = { ...baseStyle };

        // Apply specific alignments
        if (colNumber === 1) { // STT - center align
          cell.style.alignment.horizontal = 'center';
        } else if (colNumber === 11) { // Số tiền column (K) - right align with number format
          cell.style.alignment.horizontal = 'right';
          cell.style.numFmt = '#,##0';
        } else if (colNumber === 15) { // Số tháng column (O) - center align
          cell.style.alignment.horizontal = 'center';
        } else if (colNumber === 5 || colNumber === 9 || colNumber === 10 || colNumber === 12) { // Date columns (E, I, J, L) - center align
          cell.style.alignment.horizontal = 'center';
        }
      }

      // Commit the row to ensure it's properly written
      newRow.commit();
    });

    // Calculate total amount from column K
    const totalAmount = exportData.reduce((sum, rowData) => {
      const amount = parseFloat(rowData.Tiendong) || 0;
      return sum + amount;
    }, 0);

    // Find the row with "cộng tăng" text and update the total (optimized search)
    let foundTotal = false;
    for (let rowNumber = 1; rowNumber <= worksheet.rowCount && !foundTotal; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      for (let colNumber = 1; colNumber <= 17 && !foundTotal; colNumber++) {
        const cell = row.getCell(colNumber);
        if (cell.value && typeof cell.value === 'string' &&
            cell.value.toLowerCase().includes('cộng tăng')) {
          console.log(`Found "cộng tăng" at row ${rowNumber}, updating total: ${totalAmount}`);

          // Write total amount to column K of this row
          const totalCell = row.getCell(11); // Column K
          totalCell.value = totalAmount;
          totalCell.style = {
            font: { name: 'Times New Roman', size: 11, bold: true },
            alignment: { horizontal: 'right', vertical: 'middle' },
            numFmt: '#,##0',
            border: {
              top: { style: 'thin', color: { argb: '000000' } },
              left: { style: 'thin', color: { argb: '000000' } },
              bottom: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } }
            }
          };
          foundTotal = true;
        }
      }
    }

    console.log(`Completed inserting ${exportData.length} rows. Calculating totals...`);

    // Generate filename
    const currentDate = new Date().toISOString().split('T')[0];
    const defaultFileName = `D03_TK1_${currentDate}.xlsx`;
    const finalFileName = fileName || defaultFileName;

    console.log('Generating Excel file buffer...');
    // Write file to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    console.log('Excel file buffer generated successfully.');

    // Create blob and download
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFileName;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);

    console.log(`Exported D03-TK1 Excel file using template: ${finalFileName}`);
  } catch (error) {
    console.error('Error exporting D03-TK1 Excel with template:', error);
    throw new Error('Không thể xuất file Excel với template. Vui lòng thử lại.');
  }
};
