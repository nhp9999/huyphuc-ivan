import { supabase, DmCoQuanBhxh, VCoQuanBhxhChiTiet } from '../../../shared/services/api/supabaseClient';

export interface CreateCoQuanBhxhRequest {
  ma_co_quan: string;
  ten_co_quan: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  ma_tinh?: string;
  ma_huyen?: string;
  cap_co_quan: 'trung_uong' | 'tinh' | 'huyen';
  co_quan_cha_id?: number;
  ghi_chu?: string;
  created_by?: string;
}

export interface UpdateCoQuanBhxhRequest extends Partial<CreateCoQuanBhxhRequest> {
  id: number;
  updated_by?: string;
}

class CoQuanBhxhService {
  // Lấy tất cả cơ quan BHXH
  async getAllCoQuanBhxh(): Promise<DmCoQuanBhxh[]> {
    try {
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .select('*')
        .order('cap_co_quan', { ascending: true })
        .order('ten_co_quan', { ascending: true });

      if (error) {
        console.error('Error fetching social insurance agencies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllCoQuanBhxh:', error);
      throw error;
    }
  }

  // Lấy cơ quan BHXH với thông tin chi tiết
  async getCoQuanBhxhChiTiet(): Promise<VCoQuanBhxhChiTiet[]> {
    try {
      const { data, error } = await supabase
        .from('v_co_quan_bhxh_chi_tiet')
        .select('*')
        .order('cap_co_quan', { ascending: true })
        .order('ten_co_quan', { ascending: true });

      if (error) {
        console.error('Error fetching detailed social insurance agencies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCoQuanBhxhChiTiet:', error);
      throw error;
    }
  }

  // Lấy cơ quan BHXH theo ID
  async getCoQuanBhxhById(id: number): Promise<DmCoQuanBhxh | null> {
    try {
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching social insurance agency by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCoQuanBhxhById:', error);
      throw error;
    }
  }

  // Tạo cơ quan BHXH mới
  async createCoQuanBhxh(coQuan: CreateCoQuanBhxhRequest): Promise<DmCoQuanBhxh> {
    try {
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .insert([{
          ...coQuan,
          trang_thai: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating social insurance agency:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createCoQuanBhxh:', error);
      throw error;
    }
  }

  // Cập nhật cơ quan BHXH
  async updateCoQuanBhxh(coQuan: UpdateCoQuanBhxhRequest): Promise<DmCoQuanBhxh> {
    try {
      const { id, ...updateData } = coQuan;
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating social insurance agency:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCoQuanBhxh:', error);
      throw error;
    }
  }

  // Xóa cơ quan BHXH (soft delete)
  async deleteCoQuanBhxh(id: number, deletedBy?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_co_quan_bhxh')
        .update({ 
          trang_thai: 'inactive',
          updated_by: deletedBy 
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting social insurance agency:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteCoQuanBhxh:', error);
      throw error;
    }
  }

  // Kiểm tra mã cơ quan đã tồn tại
  async checkMaCoQuanExists(maCoQuan: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from('dm_co_quan_bhxh')
        .select('id')
        .eq('ma_co_quan', maCoQuan);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking agency code:', error);
        throw error;
      }

      return (data && data.length > 0);
    } catch (error) {
      console.error('Error in checkMaCoQuanExists:', error);
      throw error;
    }
  }

  // Lấy cơ quan BHXH theo cấp
  async getCoQuanBhxhByCap(cap: 'trung_uong' | 'tinh' | 'huyen'): Promise<DmCoQuanBhxh[]> {
    try {
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .select('*')
        .eq('cap_co_quan', cap)
        .eq('trang_thai', 'active')
        .order('ten_co_quan', { ascending: true });

      if (error) {
        console.error('Error fetching agencies by level:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCoQuanBhxhByCap:', error);
      throw error;
    }
  }

  // Lấy cơ quan BHXH con theo cơ quan cha
  async getCoQuanBhxhByParent(parentId: number): Promise<DmCoQuanBhxh[]> {
    try {
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .select('*')
        .eq('co_quan_cha_id', parentId)
        .eq('trang_thai', 'active')
        .order('ten_co_quan', { ascending: true });

      if (error) {
        console.error('Error fetching child agencies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCoQuanBhxhByParent:', error);
      throw error;
    }
  }

  // Tìm kiếm cơ quan BHXH
  async searchCoQuanBhxh(searchTerm: string): Promise<DmCoQuanBhxh[]> {
    try {
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .select('*')
        .or(`ma_co_quan.ilike.%${searchTerm}%,ten_co_quan.ilike.%${searchTerm}%`)
        .eq('trang_thai', 'active')
        .order('cap_co_quan', { ascending: true })
        .order('ten_co_quan', { ascending: true });

      if (error) {
        console.error('Error searching agencies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchCoQuanBhxh:', error);
      throw error;
    }
  }

  // Lấy cơ quan BHXH đang hoạt động
  async getActiveCoQuanBhxh(): Promise<DmCoQuanBhxh[]> {
    try {
      const { data, error } = await supabase
        .from('dm_co_quan_bhxh')
        .select('*')
        .eq('trang_thai', 'active')
        .order('cap_co_quan', { ascending: true })
        .order('ten_co_quan', { ascending: true });

      if (error) {
        console.error('Error fetching active agencies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveCoQuanBhxh:', error);
      throw error;
    }
  }
}

export const coQuanBhxhService = new CoQuanBhxhService();
export default coQuanBhxhService;
