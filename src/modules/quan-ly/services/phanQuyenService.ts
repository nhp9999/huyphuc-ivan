import { supabase, PhanQuyenNguoiDung, DmVaiTro } from '../../../shared/services/api/supabaseClient';

export interface CreatePhanQuyenRequest {
  nguoi_dung_id: number;
  vai_tro_id: number;
  cong_ty_id?: number;
  co_quan_bhxh_id?: number;
  loai_to_chuc: 'cong_ty' | 'co_quan_bhxh' | 'he_thong';
  cap_do_quyen: 'user' | 'admin' | 'super_admin';
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  created_by?: string;
}

export interface UpdatePhanQuyenRequest extends Partial<CreatePhanQuyenRequest> {
  id: number;
  updated_by?: string;
}

class PhanQuyenService {
  // Lấy tất cả phân quyền
  async getAllPhanQuyen(): Promise<PhanQuyenNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching permissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPhanQuyen:', error);
      throw error;
    }
  }

  // Lấy phân quyền theo người dùng
  async getPhanQuyenByUserId(userId: number): Promise<PhanQuyenNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select('*')
        .eq('nguoi_dung_id', userId)
        .eq('trang_thai', 'active')
        .order('cap_do_quyen', { ascending: false });

      if (error) {
        console.error('Error fetching user permissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPhanQuyenByUserId:', error);
      throw error;
    }
  }

  // Lấy phân quyền theo công ty
  async getPhanQuyenByCongTy(congTyId: number): Promise<PhanQuyenNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select('*')
        .eq('cong_ty_id', congTyId)
        .eq('trang_thai', 'active')
        .order('cap_do_quyen', { ascending: false });

      if (error) {
        console.error('Error fetching company permissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPhanQuyenByCongTy:', error);
      throw error;
    }
  }

  // Lấy phân quyền theo cơ quan BHXH
  async getPhanQuyenByCoQuan(coQuanId: number): Promise<PhanQuyenNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select('*')
        .eq('co_quan_bhxh_id', coQuanId)
        .eq('trang_thai', 'active')
        .order('cap_do_quyen', { ascending: false });

      if (error) {
        console.error('Error fetching agency permissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPhanQuyenByCoQuan:', error);
      throw error;
    }
  }

  // Tạo phân quyền mới
  async createPhanQuyen(phanQuyen: CreatePhanQuyenRequest): Promise<PhanQuyenNguoiDung> {
    try {
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .insert([{
          ...phanQuyen,
          trang_thai: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating permission:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createPhanQuyen:', error);
      throw error;
    }
  }

  // Cập nhật phân quyền
  async updatePhanQuyen(phanQuyen: UpdatePhanQuyenRequest): Promise<PhanQuyenNguoiDung> {
    try {
      const { id, ...updateData } = phanQuyen;
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating permission:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updatePhanQuyen:', error);
      throw error;
    }
  }

  // Xóa phân quyền (soft delete)
  async deletePhanQuyen(id: number, deletedBy?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .update({ 
          trang_thai: 'inactive',
          updated_by: deletedBy 
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting permission:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deletePhanQuyen:', error);
      throw error;
    }
  }

  // Kiểm tra quyền của người dùng
  async checkUserPermission(
    userId: number, 
    organizationType: string, 
    organizationId: number, 
    requiredPermission: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('check_user_permission', {
          p_user_id: userId,
          p_organization_type: organizationType,
          p_organization_id: organizationId,
          p_required_permission: requiredPermission
        });

      if (error) {
        console.error('Error checking user permission:', error);
        throw error;
      }

      return data || false;
    } catch (error) {
      console.error('Error in checkUserPermission:', error);
      throw error;
    }
  }

  // Lấy tất cả vai trò
  async getAllVaiTro(): Promise<DmVaiTro[]> {
    try {
      const { data, error } = await supabase
        .from('dm_vai_tro')
        .select('*')
        .eq('trang_thai', 'active')
        .order('cap_do', { ascending: false })
        .order('ten_vai_tro', { ascending: true });

      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllVaiTro:', error);
      throw error;
    }
  }

  // Lấy vai trò theo cấp độ
  async getVaiTroByCap(capDo: 'user' | 'admin' | 'super_admin'): Promise<DmVaiTro[]> {
    try {
      const { data, error } = await supabase
        .from('dm_vai_tro')
        .select('*')
        .eq('cap_do', capDo)
        .eq('trang_thai', 'active')
        .order('ten_vai_tro', { ascending: true });

      if (error) {
        console.error('Error fetching roles by level:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getVaiTroByCap:', error);
      throw error;
    }
  }

  // Kiểm tra người dùng đã có phân quyền trong tổ chức chưa
  async checkExistingPermission(
    userId: number, 
    organizationType: string, 
    organizationId?: number
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('phan_quyen_nguoi_dung')
        .select('id')
        .eq('nguoi_dung_id', userId)
        .eq('loai_to_chuc', organizationType)
        .eq('trang_thai', 'active');

      if (organizationType === 'cong_ty' && organizationId) {
        query = query.eq('cong_ty_id', organizationId);
      } else if (organizationType === 'co_quan_bhxh' && organizationId) {
        query = query.eq('co_quan_bhxh_id', organizationId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking existing permission:', error);
        throw error;
      }

      return (data && data.length > 0);
    } catch (error) {
      console.error('Error in checkExistingPermission:', error);
      throw error;
    }
  }

  // Lấy danh sách Super Admin
  async getSuperAdmins(): Promise<PhanQuyenNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select('*')
        .eq('cap_do_quyen', 'super_admin')
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching super admins:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSuperAdmins:', error);
      throw error;
    }
  }

  // Xóa phân quyền theo user và tổ chức
  async deletePhanQuyenByUserAndOrg(
    userId: number,
    organizationType: string,
    organizationId?: number
  ): Promise<void> {
    try {
      let query = supabase
        .from('phan_quyen_nguoi_dung')
        .update({
          trang_thai: 'inactive',
          updated_by: 'current_user'
        })
        .eq('nguoi_dung_id', userId)
        .eq('loai_to_chuc', organizationType)
        .eq('trang_thai', 'active');

      if (organizationType === 'cong_ty' && organizationId) {
        query = query.eq('cong_ty_id', organizationId);
      } else if (organizationType === 'co_quan_bhxh' && organizationId) {
        query = query.eq('co_quan_bhxh_id', organizationId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error deleting permission by user and org:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deletePhanQuyenByUserAndOrg:', error);
      throw error;
    }
  }
}

export const phanQuyenService = new PhanQuyenService();
export default phanQuyenService;
