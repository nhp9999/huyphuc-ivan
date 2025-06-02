// Interface cho API kê khai 603
export interface KeKhai603Request {
  maSoBHXH: string;
  mangLuoiId: number;
  ma: string;
  maCoQuanBHXH: string;
}

// Response data từ API kê khai 603
export interface KeKhai603ApiData {
  maSoBHXH: string;
  hoTen: string;
  soDienThoai: string;
  ccns: string;
  ngaySinh: string;
  gioiTinh: number;
  quocTich: string;
  danToc: string;
  cmnd: string;
  maTinhKS: string;   // Mã tỉnh khai sinh
  maHuyenKS: string;  // Mã huyện khai sinh
  maXaKS: string;     // Mã xã khai sinh
  maTinhNkq: string;  // Mã tỉnh nhận kết quả
  maHuyenNkq: string; // Mã huyện nhận kết quả
  maXaNkq: string;    // Mã xã nhận kết quả
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

export interface KeKhai603ApiResponse {
  data: KeKhai603ApiData | null;
  success: boolean;
  message: string | null;
  errors: any | null;
  status: number;
  traceId: string;
}

export interface KeKhai603Data {
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
  // Thêm các trường đặc biệt cho kê khai 603
  loaiDoiTuong?: string;
  mucLuong?: string;
  tyLeDong?: string;
  soTienDong?: string;
  // Thêm các trường mới từ API response
  quocTich?: string;
  danToc?: string;
  maTinhKS?: string;   // Mã tỉnh khai sinh
  maHuyenKS?: string;  // Mã huyện khai sinh
  maXaKS?: string;     // Mã xã khai sinh
  maTinhNkq?: string;  // Mã tỉnh nhận kết quả
  maHuyenNkq?: string; // Mã huyện nhận kết quả
  maXaNkq?: string;    // Mã xã nhận kết quả
  noiNhanHoSo?: string;
  maBenhVien?: string;
  maHoGiaDinh?: string;
  phuongAn?: string;
  moTa?: string;
}

export interface KeKhai603Response {
  success: boolean;
  data?: KeKhai603Data;
  message?: string;
  error?: string;
}
