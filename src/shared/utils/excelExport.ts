import * as ExcelJS from 'exceljs';
import { KeKhai603Participant } from '../../modules/ke-khai/hooks/useKeKhai603Participants';
import { DanhSachKeKhai } from '../services/api/supabaseClient';

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
