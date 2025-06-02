import { supabase } from './api/supabaseClient';
import { DmCSKCB } from './api/supabaseClient';

export interface CreateCSKCBRequest {
  ma: string;
  ten: string;
  text: string;
  value: string;
  ma_tinh: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  website?: string;
  loai_cskcb?: string;
  cap_cskcb?: string;
  ghi_chu?: string;
  created_by?: string;
}

export interface UpdateCSKCBRequest extends Partial<CreateCSKCBRequest> {
  updated_by?: string;
}

export interface CSKCBSearchParams {
  ma_tinh?: string;
  loai_cskcb?: string;
  cap_cskcb?: string;
  trang_thai?: string;
  search?: string; // Tìm kiếm theo tên hoặc mã
  limit?: number; // Giới hạn số lượng kết quả
}

class CSKCBService {
  // Lấy danh sách cơ sở khám chữa bệnh
  async getCSKCBList(params?: CSKCBSearchParams): Promise<DmCSKCB[]> {
    try {
      let query = supabase
        .from('dm_cskcb')
        .select('*')
        .eq('trang_thai', 'active')
        .order('value', { ascending: true });

      if (params?.ma_tinh) {
        query = query.eq('ma_tinh', params.ma_tinh);
      }

      if (params?.loai_cskcb) {
        query = query.eq('loai_cskcb', params.loai_cskcb);
      }

      if (params?.cap_cskcb) {
        query = query.eq('cap_cskcb', params.cap_cskcb);
      }

      if (params?.trang_thai) {
        query = query.eq('trang_thai', params.trang_thai);
      }

      if (params?.search) {
        query = query.or(`ten.ilike.%${params.search}%,ma.ilike.%${params.search}%,text.ilike.%${params.search}%`);
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching CSKCB list:', error);
        throw new Error('Không thể lấy danh sách cơ sở khám chữa bệnh');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCSKCBList:', error);
      throw error;
    }
  }

  // Lấy cơ sở khám chữa bệnh theo tỉnh
  async getCSKCBByTinh(maTinh: string): Promise<DmCSKCB[]> {
    return this.getCSKCBList({ ma_tinh: maTinh });
  }

  // Lấy chi tiết cơ sở khám chữa bệnh
  async getCSKCBById(id: number): Promise<DmCSKCB | null> {
    try {
      const { data, error } = await supabase
        .from('dm_cskcb')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching CSKCB:', error);
        throw new Error('Không thể lấy thông tin cơ sở khám chữa bệnh');
      }

      return data;
    } catch (error) {
      console.error('Error in getCSKCBById:', error);
      throw error;
    }
  }

  // Lấy cơ sở khám chữa bệnh theo value và mã tỉnh
  async getCSKCBByValue(value: string, maTinh: string): Promise<DmCSKCB | null> {
    try {
      const { data, error } = await supabase
        .from('dm_cskcb')
        .select('*')
        .eq('value', value)
        .eq('ma_tinh', maTinh)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Không tìm thấy
        }
        console.error('Error fetching CSKCB by value:', error);
        throw new Error('Không thể lấy thông tin cơ sở khám chữa bệnh');
      }

      return data;
    } catch (error) {
      console.error('Error in getCSKCBByValue:', error);
      throw error;
    }
  }

  // Tạo cơ sở khám chữa bệnh mới
  async createCSKCB(data: CreateCSKCBRequest): Promise<DmCSKCB> {
    try {
      const { data: result, error } = await supabase
        .from('dm_cskcb')
        .insert({
          ...data,
          trang_thai: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating CSKCB:', error);
        if (error.code === '23505') {
          throw new Error('Mã cơ sở khám chữa bệnh đã tồn tại trong tỉnh này');
        }
        throw new Error('Không thể tạo cơ sở khám chữa bệnh');
      }

      return result;
    } catch (error) {
      console.error('Error in createCSKCB:', error);
      throw error;
    }
  }

  // Cập nhật cơ sở khám chữa bệnh
  async updateCSKCB(id: number, data: UpdateCSKCBRequest): Promise<DmCSKCB> {
    try {
      const { data: result, error } = await supabase
        .from('dm_cskcb')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating CSKCB:', error);
        if (error.code === '23505') {
          throw new Error('Mã cơ sở khám chữa bệnh đã tồn tại trong tỉnh này');
        }
        throw new Error('Không thể cập nhật cơ sở khám chữa bệnh');
      }

      return result;
    } catch (error) {
      console.error('Error in updateCSKCB:', error);
      throw error;
    }
  }

  // Xóa cơ sở khám chữa bệnh (soft delete)
  async deleteCSKCB(id: number, deletedBy?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_cskcb')
        .update({
          trang_thai: 'inactive',
          updated_at: new Date().toISOString(),
          updated_by: deletedBy
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting CSKCB:', error);
        throw new Error('Không thể xóa cơ sở khám chữa bệnh');
      }
    } catch (error) {
      console.error('Error in deleteCSKCB:', error);
      throw error;
    }
  }

  // Khôi phục cơ sở khám chữa bệnh
  async restoreCSKCB(id: number, restoredBy?: string): Promise<DmCSKCB> {
    try {
      const { data: result, error } = await supabase
        .from('dm_cskcb')
        .update({
          trang_thai: 'active',
          updated_at: new Date().toISOString(),
          updated_by: restoredBy
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error restoring CSKCB:', error);
        throw new Error('Không thể khôi phục cơ sở khám chữa bệnh');
      }

      return result;
    } catch (error) {
      console.error('Error in restoreCSKCB:', error);
      throw error;
    }
  }

  // Kiểm tra mã cơ sở khám chữa bệnh đã tồn tại
  async checkValueExists(value: string, maTinh: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from('dm_cskcb')
        .select('id')
        .eq('value', value)
        .eq('ma_tinh', maTinh);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking value exists:', error);
        return false;
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkValueExists:', error);
      return false;
    }
  }

  // Lấy danh sách loại cơ sở khám chữa bệnh
  getLoaiCSKCB(): Array<{ value: string; label: string }> {
    return [
      { value: 'benh_vien', label: 'Bệnh viện' },
      { value: 'phong_kham', label: 'Phòng khám' },
      { value: 'trung_tam_y_te', label: 'Trung tâm Y tế' },
      { value: 'tram_y_te', label: 'Trạm Y tế' },
      { value: 'phong_kham_da_khoa', label: 'Phòng khám đa khoa' },
      { value: 'benh_vien_chuyen_khoa', label: 'Bệnh viện chuyên khoa' }
    ];
  }

  // Lấy danh sách cấp cơ sở khám chữa bệnh
  getCapCSKCB(): Array<{ value: string; label: string }> {
    return [
      { value: 'trung_uong', label: 'Trung ương' },
      { value: 'tinh', label: 'Tỉnh' },
      { value: 'huyen', label: 'Huyện' },
      { value: 'xa', label: 'Xã' }
    ];
  }
}

export const cskcbService = new CSKCBService();
export default cskcbService;
