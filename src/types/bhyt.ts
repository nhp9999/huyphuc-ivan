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

// Interface cho API kê khai BHYT
export interface BhytDeclarationRequest {
  maSoBHXH: string;
  mangLuoiId: number;
  ma: string;
  maCoQuanBHXH: string;
}

// Response data từ API kê khai BHYT
export interface BhytDeclarationApiData {
  maSoBHXH: string;
  hoTen: string;
  soDienThoai: string;
  ccns: string;
  ngaySinh: string;
  gioiTinh: number;
  quocTich: string;
  danToc: string;
  cmnd: string;
  maTinhKS: string;
  maHuyenKS: string;
  maXaKS: string;
  maTinhNkq: string;
  maHuyenNkq: string;
  maXaNkq: string;
  tinhKCB: string;
  noiNhanHoSo: string;
  maBenhVien: string;
  maHoGiaDinh: string;
  soTheBHYT: string;
  tuNgayTheCu: string;
  denNgayTheCu: string;
  typeId: string;
  phuongAn: string;
  mucLuongNsTw: number;
  tyLeNsdp: number;
  tienNsdp: number;
  tyLeNsKhac: number;
  tienNsKhac: number;
  tyLeNsnn: number;
  tyLeNsTw: number;
  trangThai: string;
  maLoi: string;
  moTa: string;
  giaHanThe: number;
  isThamGiaBb: number;
}

export interface BhytDeclarationApiResponse {
  data: BhytDeclarationApiData | null;
  success: boolean;
  message: string | null;
  errors: any | null;
  status: number;
  traceId: string;
}

export interface BhytDeclarationData {
  maSoBhxh: string;
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
  soDienThoai: string;
  cmnd: string;
  soTheBHYT: string;
  // Thêm các trường đặc biệt cho kê khai
  loaiDoiTuong?: string;
  mucLuong?: string;
  tyLeDong?: string;
  soTienDong?: string;
  // Thêm các trường mới từ API response
  quocTich?: string;
  danToc?: string;
  maTinhKS?: string;
  maHuyenKS?: string;
  maXaKS?: string;
  maTinhNkq?: string;
  maHuyenNkq?: string;
  maXaNkq?: string;
  noiNhanHoSo?: string;
  maBenhVien?: string;
  maHoGiaDinh?: string;
  phuongAn?: string;
  moTa?: string;
}

export interface BhytDeclarationResponse {
  success: boolean;
  data?: BhytDeclarationData;
  message?: string;
  error?: string;
}
