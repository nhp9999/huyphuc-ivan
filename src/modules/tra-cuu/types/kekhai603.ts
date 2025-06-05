// Types for KeKhai603 API

export interface KeKhai603Request {
  maSoBHXH: string;
  mangLuoiId: number;
  ma: string;
  maCoQuanBHXH: string;
  code?: string;
  text?: string;
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
  loaiDoiTuong: string;
  mucLuong: string;
  tyLeDong: string;
  soTienDong: string;
  quocTich: string;
  danToc: string;
  maTinhKS: string;
  maHuyenKS: string;
  maXaKS: string;
  maTinhNkq: string;
  maHuyenNkq: string;
  maXaNkq: string;
  noiNhanHoSo: string;
  maBenhVien: string;
  maHoGiaDinh: string;
  phuongAn: string;
  moTa: string;
  // Additional fields for old card information
  tuNgayTheCu: string;
  denNgayTheCu: string;
}

export interface KeKhai603Response {
  success: boolean;
  data?: KeKhai603Data;
  message?: string;
  error?: string;
}
