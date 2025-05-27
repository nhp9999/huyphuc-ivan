export interface BhytInfo {
  maSoBHXH: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  noiDangKyKCB: string;
  trangThaiThe: string;
  ngayHieuLuc: string;
  ngayHetHan: string;
  mucHuong: string;
  donViCongTac: string;
  maKV: string;
  tenKV: string;
}

// API Response từ VNPost có cấu trúc khác
export interface VnPostBhytData {
  tuNgayDt: string;
  denNgayDt: string;
  ngaySinhHienThi: string;
  maKCB: string;
  tuNgayTheMoiDt: string;
  ngay5NamDt: string;
  gioiTinhHienThi: string;
  quocTichHienThi: string;
  danTocHienThi: string;
  trangThaiThe: string;
  tenTinhKCB: string;
  tuNgayTheMoi: string;
  phuongAn: string;
  coSoKCB: string;
  maSoBhxh: string;
  soTheBhyt: string;
  ngaySinh: string;
  gioiTinh: string;
  quocTich: string;
  danToc: string;
  ngay5Nam: string;
  soCmnd: string;
  soDienThoai: string;
  tuNgay: string;
  denNgay: string;
  maBhxh: string;
  tenCqbh: string;
  maDvi: string;
  tenDvi: string;
  maTinhKcb: string;
  maBenhVien: string;
  tenBenhVien: string;
  inTheDtlId: number;
  hoTen: string;
  tyLeNstw: number;
  tyLeBhyt: number;
  tyLeNsnn: number;
  tyLeNsdp: number;
  tyLeKhac: number;
  mlNsnn: number;
  mucLuongTt: number;
  diaChiLh: string;
  maTinhLh: string;
  maHuyenLh: string;
  maXaLh: string;
  maVungSs: string | null;
  tienHtNsTw: number;
  tienHtNsdp: number;
  tienHtKhac: number;
  soTien: number;
}

export interface VnPostApiResponse {
  data: VnPostBhytData | null;
  success: boolean;
  message: string | null;
  errors: any | null;
  status: number;
  traceId: string;
}

export interface BhytLookupRequest {
  maSoBHXH: string;
}

export interface BhytLookupResponse {
  success: boolean;
  data?: BhytInfo;
  message?: string;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BhytBulkLookupRequest {
  maSoBHXHList: string[];
}

export interface BhytBulkResult {
  maSoBHXH: string;
  success: boolean;
  data?: BhytInfo;
  message?: string;
  error?: string;
}

export interface BhytBulkLookupResponse {
  success: boolean;
  results: BhytBulkResult[];
  totalCount: number;
  successCount: number;
  failureCount: number;
  message?: string;
}

export interface BulkLookupProgress {
  current: number;
  total: number;
  percentage: number;
  currentMaSo?: string;
}
