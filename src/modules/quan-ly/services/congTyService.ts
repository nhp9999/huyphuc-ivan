import { supabase, DmCongTy } from '../../../shared/services/api/supabaseClient';

export interface CreateCongTyRequest {
  ma_cong_ty: string;
  ten_cong_ty: string;
  dia_chi?: string;
  so_dien_thoai?: string;
  email?: string;
  ma_so_thue?: string;
  nguoi_dai_dien?: string;
  ghi_chu?: string;
  created_by?: string;
}

export interface UpdateCongTyRequest extends Partial<CreateCongTyRequest> {
  id: number;
  updated_by?: string;
}

class CongTyService {
  // Lấy tất cả công ty
  async getAllCongTy(): Promise<DmCongTy[]> {
    try {
      const { data, error } = await supabase
        .from('dm_cong_ty')
        .select('*')
        .order('ten_cong_ty', { ascending: true });

      if (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllCongTy:', error);
      throw error;
    }
  }

  // Lấy công ty theo ID
  async getCongTyById(id: number): Promise<DmCongTy | null> {
    try {
      const { data, error } = await supabase
        .from('dm_cong_ty')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching company by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCongTyById:', error);
      throw error;
    }
  }

  // Tạo công ty mới
  async createCongTy(congTy: CreateCongTyRequest): Promise<DmCongTy> {
    try {
      const { data, error } = await supabase
        .from('dm_cong_ty')
        .insert([{
          ...congTy,
          trang_thai: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createCongTy:', error);
      throw error;
    }
  }

  // Cập nhật công ty
  async updateCongTy(congTy: UpdateCongTyRequest): Promise<DmCongTy> {
    try {
      const { id, ...updateData } = congTy;
      const { data, error } = await supabase
        .from('dm_cong_ty')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating company:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCongTy:', error);
      throw error;
    }
  }

  // Xóa công ty (soft delete)
  async deleteCongTy(id: number, deletedBy?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_cong_ty')
        .update({ 
          trang_thai: 'inactive',
          updated_by: deletedBy 
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting company:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteCongTy:', error);
      throw error;
    }
  }

  // Kiểm tra mã công ty đã tồn tại
  async checkMaCongTyExists(maCongTy: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from('dm_cong_ty')
        .select('id')
        .eq('ma_cong_ty', maCongTy);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking company code:', error);
        throw error;
      }

      return (data && data.length > 0);
    } catch (error) {
      console.error('Error in checkMaCongTyExists:', error);
      throw error;
    }
  }

  // Tìm kiếm công ty
  async searchCongTy(searchTerm: string): Promise<DmCongTy[]> {
    try {
      const { data, error } = await supabase
        .from('dm_cong_ty')
        .select('*')
        .or(`ma_cong_ty.ilike.%${searchTerm}%,ten_cong_ty.ilike.%${searchTerm}%`)
        .eq('trang_thai', 'active')
        .order('ten_cong_ty', { ascending: true });

      if (error) {
        console.error('Error searching companies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchCongTy:', error);
      throw error;
    }
  }

  // Lấy công ty đang hoạt động
  async getActiveCongTy(): Promise<DmCongTy[]> {
    try {
      const { data, error } = await supabase
        .from('dm_cong_ty')
        .select('*')
        .eq('trang_thai', 'active')
        .order('ten_cong_ty', { ascending: true });

      if (error) {
        console.error('Error fetching active companies:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveCongTy:', error);
      throw error;
    }
  }

  // Lấy đại lý của công ty
  async getDaiLyByCongTy(congTyId: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('dm_dai_ly')
        .select('id, ma, ten, cap, loai_to_chuc, trang_thai, ngay_tao')
        .eq('cong_ty_id', congTyId)
        .eq('trang_thai', 'active')
        .order('ten', { ascending: true });

      if (error) {
        console.error('Error fetching dai ly by cong ty:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getDaiLyByCongTy:', error);
      throw error;
    }
  }

  // Lấy đại lý chưa thuộc công ty nào (để thêm vào công ty)
  async getAvailableDaiLy(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('dm_dai_ly')
        .select('id, ma, ten, cap, loai_to_chuc')
        .is('cong_ty_id', null)
        .eq('trang_thai', 'active')
        .order('ten', { ascending: true });

      if (error) {
        console.error('Error fetching available dai ly:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAvailableDaiLy:', error);
      throw error;
    }
  }

  // Liên kết đại lý với công ty
  async linkDaiLyToCongTy(daiLyId: number, congTyId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_dai_ly')
        .update({
          cong_ty_id: congTyId,
          loai_to_chuc: 'cong_ty',
          ngay_cap_nhat: new Date().toISOString()
        })
        .eq('id', daiLyId);

      if (error) {
        console.error('Error linking dai ly to cong ty:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in linkDaiLyToCongTy:', error);
      throw error;
    }
  }

  // Hủy liên kết đại lý khỏi công ty
  async unlinkDaiLyFromCongTy(daiLyId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_dai_ly')
        .update({
          cong_ty_id: null,
          loai_to_chuc: null,
          ngay_cap_nhat: new Date().toISOString()
        })
        .eq('id', daiLyId);

      if (error) {
        console.error('Error unlinking dai ly from cong ty:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in unlinkDaiLyFromCongTy:', error);
      throw error;
    }
  }
}

export const congTyService = new CongTyService();
export default congTyService;
