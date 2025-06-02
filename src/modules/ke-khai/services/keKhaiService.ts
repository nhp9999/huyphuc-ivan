import { supabase } from '../../../shared/services/api/supabaseClient';
import { DanhSachKeKhai, DanhSachNguoiThamGia } from '../../../shared/services/api/supabaseClient';

export interface CreateKeKhaiRequest {
  ten_ke_khai: string;
  loai_ke_khai: string;
  dai_ly_id?: number;
  don_vi_id?: number;
  doi_tuong_tham_gia?: string;
  hinh_thuc_tinh?: string;
  luong_co_so?: number;
  nguon_dong?: string;
  noi_dang_ky_kcb_ban_dau?: string;
  bien_lai_ngay_tham_gia?: string;
  so_thang?: number;
  ngay_tao?: string;
  ty_le_nsnn_ho_tro?: number;
  ghi_chu?: string;
  created_by?: string;
  // Organization fields - required by check_ke_khai_organization constraint
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
}

export interface CreateNguoiThamGiaRequest {
  ke_khai_id: number;
  stt: number;
  ho_ten: string;
  ma_so_bhxh?: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  so_cccd?: string;
  noi_dang_ky_kcb?: string;
  so_dien_thoai?: string;
  so_the_bhyt?: string;
  quoc_tich?: string;
  dan_toc?: string;
  ma_tinh_ks?: string;
  ma_huyen_ks?: string;
  ma_xa_ks?: string;
  ma_tinh_nkq?: string;
  ma_huyen_nkq?: string;
  ma_xa_nkq?: string;
  noi_nhan_ho_so?: string;
  muc_luong?: number;
  ty_le_dong?: number;
  so_tien_dong?: number;
  tinh_kcb?: string;
  ma_benh_vien?: string;
  ma_ho_gia_dinh?: string;
  phuong_an?: string;
  trang_thai_the?: string;
  tu_ngay_the_cu?: string;
  den_ngay_the_cu?: string;
  so_thang_dong?: number;
  stt_ho?: string;
  tu_ngay_the_moi?: string;
  den_ngay_the_moi?: string;
  ngay_bien_lai?: string;
  // Organization fields - required by database schema
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc?: string;
}

export interface KeKhaiSearchParams {
  ma_ke_khai?: string;
  loai_ke_khai?: string;
  dai_ly_id?: number;
  don_vi_id?: number;
  trang_thai?: string;
  tu_ngay?: string;
  den_ngay?: string;
  created_by?: string;
}

export interface ApproveKeKhaiRequest {
  approved_by: string;
  processing_notes?: string;
}

export interface RejectKeKhaiRequest {
  rejected_by: string;
  rejection_reason: string;
  processing_notes?: string;
}

class KeKhaiService {
  // Tạo mã kê khai tự động
  async generateMaKeKhai(): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('generate_ma_ke_khai');

      if (error) {
        console.error('Error generating ma ke khai:', error);
        throw new Error('Không thể tạo mã kê khai');
      }

      return data;
    } catch (error) {
      console.error('Error in generateMaKeKhai:', error);
      throw error;
    }
  }

  // Tạo kê khai mới với retry logic
  async createKeKhai(data: CreateKeKhaiRequest): Promise<DanhSachKeKhai> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Tự động sinh mã kê khai mới cho mỗi lần thử
        const ma_ke_khai = await this.generateMaKeKhai();

        // Lọc bỏ các trường undefined và chuỗi rỗng cho date fields
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            // Loại bỏ undefined và null
            if (value === undefined || value === null) return false;
            // Loại bỏ chuỗi rỗng cho date fields
            if ((key.includes('ngay') || key.includes('date')) && value === '') return false;
            return true;
          })
        );

        const { data: result, error } = await supabase
          .from('danh_sach_ke_khai')
          .insert({
            ...cleanData,
            ma_ke_khai,
            trang_thai: 'draft'
          })
          .select()
          .single();

        if (error) {
          lastError = error;

          // Nếu là lỗi duplicate key và chưa hết retry, thử lại
          if (error.code === '23505' && attempt < maxRetries) {
            console.warn(`Attempt ${attempt}: Duplicate key, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Delay tăng dần
            continue;
          }

          console.error('Error creating ke khai:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          console.error('Data sent:', JSON.stringify(cleanData, null, 2));
          throw new Error(`Không thể tạo kê khai: ${error.message || 'Unknown error'}`);
        }

        return result;
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          console.error('Error in createKeKhai after all retries:', error);
          throw error;
        }
      }
    }

    throw lastError;
  }

  // Cập nhật kê khai
  async updateKeKhai(id: number, data: Partial<CreateKeKhaiRequest>): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating ke khai:', error);
        throw new Error('Không thể cập nhật kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in updateKeKhai:', error);
      throw error;
    }
  }

  // Lấy danh sách kê khai
  async getKeKhaiList(params?: KeKhaiSearchParams): Promise<DanhSachKeKhai[]> {
    try {
      let query = supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .order('created_at', { ascending: false });

      if (params?.ma_ke_khai) {
        query = query.ilike('ma_ke_khai', `%${params.ma_ke_khai}%`);
      }

      if (params?.loai_ke_khai) {
        query = query.eq('loai_ke_khai', params.loai_ke_khai);
      }

      if (params?.dai_ly_id) {
        query = query.eq('dai_ly_id', params.dai_ly_id);
      }

      if (params?.don_vi_id) {
        query = query.eq('don_vi_id', params.don_vi_id);
      }

      if (params?.trang_thai) {
        query = query.eq('trang_thai', params.trang_thai);
      }

      if (params?.tu_ngay) {
        query = query.gte('created_at', params.tu_ngay);
      }

      if (params?.den_ngay) {
        query = query.lte('created_at', params.den_ngay);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ke khai list:', error);
        throw new Error('Không thể tải danh sách kê khai');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getKeKhaiList:', error);
      throw error;
    }
  }

  // Lấy danh sách kê khai cần duyệt (cho nhân viên tổng hợp)
  async getKeKhaiForApproval(params?: KeKhaiSearchParams): Promise<DanhSachKeKhai[]> {
    try {
      let query = supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .in('trang_thai', ['submitted', 'processing'])
        .order('created_at', { ascending: false });

      if (params?.ma_ke_khai) {
        query = query.ilike('ma_ke_khai', `%${params.ma_ke_khai}%`);
      }

      if (params?.loai_ke_khai) {
        query = query.eq('loai_ke_khai', params.loai_ke_khai);
      }

      if (params?.dai_ly_id) {
        query = query.eq('dai_ly_id', params.dai_ly_id);
      }

      if (params?.don_vi_id) {
        query = query.eq('don_vi_id', params.don_vi_id);
      }

      if (params?.trang_thai) {
        query = query.eq('trang_thai', params.trang_thai);
      }

      if (params?.tu_ngay) {
        query = query.gte('created_at', params.tu_ngay);
      }

      if (params?.den_ngay) {
        query = query.lte('created_at', params.den_ngay);
      }

      if (params?.created_by) {
        query = query.eq('created_by', params.created_by);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ke khai for approval:', error);
        throw new Error('Không thể lấy danh sách kê khai cần duyệt');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getKeKhaiForApproval:', error);
      throw error;
    }
  }

  // Lấy chi tiết kê khai
  async getKeKhaiById(id: number): Promise<DanhSachKeKhai | null> {
    try {
      const { data, error } = await supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching ke khai:', error);
        throw new Error('Không thể tải thông tin kê khai');
      }

      return data;
    } catch (error) {
      console.error('Error in getKeKhaiById:', error);
      throw error;
    }
  }

  // Xóa kê khai
  async deleteKeKhai(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('danh_sach_ke_khai')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ke khai:', error);
        throw new Error('Không thể xóa kê khai');
      }
    } catch (error) {
      console.error('Error in deleteKeKhai:', error);
      throw error;
    }
  }

  // Duyệt kê khai
  async approveKeKhai(id: number, data: ApproveKeKhaiRequest): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'approved',
          approved_by: data.approved_by,
          approved_at: new Date().toISOString(),
          processing_notes: data.processing_notes,
          updated_at: new Date().toISOString(),
          updated_by: data.approved_by
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error approving ke khai:', error);
        throw new Error('Không thể duyệt kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in approveKeKhai:', error);
      throw error;
    }
  }

  // Từ chối kê khai
  async rejectKeKhai(id: number, data: RejectKeKhaiRequest): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'rejected',
          rejected_by: data.rejected_by,
          rejected_at: new Date().toISOString(),
          rejection_reason: data.rejection_reason,
          processing_notes: data.processing_notes,
          updated_at: new Date().toISOString(),
          updated_by: data.rejected_by
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error rejecting ke khai:', error);
        throw new Error('Không thể từ chối kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in rejectKeKhai:', error);
      throw error;
    }
  }

  // Chuyển kê khai sang trạng thái đang xử lý
  async setKeKhaiProcessing(id: number, userId: string, notes?: string): Promise<DanhSachKeKhai> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_ke_khai')
        .update({
          trang_thai: 'processing',
          processing_notes: notes,
          updated_at: new Date().toISOString(),
          updated_by: userId
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error setting ke khai to processing:', error);
        throw new Error('Không thể cập nhật trạng thái kê khai');
      }

      return result;
    } catch (error) {
      console.error('Error in setKeKhaiProcessing:', error);
      throw error;
    }
  }

  // Thêm người tham gia vào kê khai
  async addNguoiThamGia(data: CreateNguoiThamGiaRequest): Promise<DanhSachNguoiThamGia> {
    try {
      // Lọc bỏ các trường undefined và chuỗi rỗng cho date fields
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          // Loại bỏ undefined và null
          if (value === undefined || value === null) return false;
          // Loại bỏ chuỗi rỗng cho date fields
          if ((key.includes('ngay') || key.includes('date')) && value === '') return false;
          return true;
        })
      );

      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .insert(cleanData)
        .select()
        .single();

      if (error) {
        console.error('Error adding nguoi tham gia:', error);
        throw new Error('Không thể thêm người tham gia');
      }

      return result;
    } catch (error) {
      console.error('Error in addNguoiThamGia:', error);
      throw error;
    }
  }

  // Thêm nhiều người tham gia cùng lúc
  async addMultipleNguoiThamGia(dataList: CreateNguoiThamGiaRequest[]): Promise<DanhSachNguoiThamGia[]> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .insert(dataList)
        .select();

      if (error) {
        console.error('Error adding multiple nguoi tham gia:', error);
        throw new Error('Không thể thêm danh sách người tham gia');
      }

      return result || [];
    } catch (error) {
      console.error('Error in addMultipleNguoiThamGia:', error);
      throw error;
    }
  }

  // Cập nhật người tham gia
  async updateNguoiThamGia(id: number, data: Partial<CreateNguoiThamGiaRequest>): Promise<DanhSachNguoiThamGia> {
    try {
      const { data: result, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating nguoi tham gia:', error);
        throw new Error('Không thể cập nhật người tham gia');
      }

      return result;
    } catch (error) {
      console.error('Error in updateNguoiThamGia:', error);
      throw error;
    }
  }

  // Lấy danh sách người tham gia theo kê khai
  async getNguoiThamGiaByKeKhai(keKhaiId: number): Promise<DanhSachNguoiThamGia[]> {
    try {
      const { data, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('*')
        .eq('ke_khai_id', keKhaiId)
        .order('stt', { ascending: true });

      if (error) {
        console.error('Error fetching nguoi tham gia:', error);
        throw new Error('Không thể tải danh sách người tham gia');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNguoiThamGiaByKeKhai:', error);
      throw error;
    }
  }

  // Xóa người tham gia
  async deleteNguoiThamGia(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting nguoi tham gia:', error);
        throw new Error('Không thể xóa người tham gia');
      }
    } catch (error) {
      console.error('Error in deleteNguoiThamGia:', error);
      throw error;
    }
  }
}

export const keKhaiService = new KeKhaiService();
export default keKhaiService;
