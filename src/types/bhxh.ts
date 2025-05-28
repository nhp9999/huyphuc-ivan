export interface BhxhInfo {
  maSoBHXH: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  soDienThoai: string;
  cmnd: string;
  trangThaiThamGia: string;
  ngayThamGia: string;
  ngayNgungThamGia?: string;
  mucLuong: string;
  tyLeDong: string;
  soTienDong: string;
  donViThuTien: string;
  tinhTrangDongPhi: string;
}

// API Response từ VNPost cho BHXH tự nguyện
export interface VnPostBhxhData {
  maSoBHXH: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: number;
  diaChi: string;
  soDienThoai: string;
  cmnd: string;
  trangThaiThamGia: string;
  ngayThamGia: string;
  ngayNgungThamGia: string | null;
  mucLuong: number;
  tyLeDong: number;
  soTienDong: number;
  donViThuTien: string;
  tinhTrangDongPhi: string;
  quocTich: string;
  danToc: string;
  maTinhKS: string;
  maHuyenKS: string;
  maXaKS: string;
  noiDangKy: string;
  loaiDoiTuong: string;
}

export interface VnPostBhxhApiResponse {
  data: VnPostBhxhData | null;
  success: boolean;
  message: string | null;
  errors: any | null;
  status: number;
  traceId: string;
}

export interface BhxhLookupRequest {
  maSoBHXH: string;
}

export interface BhxhLookupResponse {
  success: boolean;
  data?: BhxhInfo;
  message?: string;
  error?: string;
}

export interface BhxhBulkLookupRequest {
  maSoBHXHList: string[];
}

export interface BhxhBulkResult {
  maSoBHXH: string;
  success: boolean;
  data?: BhxhInfo;
  message?: string;
  error?: string;
}

export interface BhxhBulkLookupResponse {
  success: boolean;
  results: BhxhBulkResult[];
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
