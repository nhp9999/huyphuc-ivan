import { supabase, DmNguoiDung, VNguoiDungPhanQuyen } from '../../../shared/services/api/supabaseClient';

export interface CreateNguoiDungRequest {
  email: string;
  mat_khau: string;
  ho_ten: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  ngay_sinh?: string;
  gioi_tinh?: 'nam' | 'nu' | 'khac';
  avatar_url?: string;
  created_by?: string;
}

export interface UpdateNguoiDungRequest extends Partial<CreateNguoiDungRequest> {
  id: number;
  updated_by?: string;
}

export interface UserOrganization {
  organization_type: string;
  organization_id: number;
  organization_code: string;
  organization_name: string;
  role_name: string;
  permission_level: string;
}

class NguoiDungService {
  // Lấy tất cả người dùng
  async getAllNguoiDung(): Promise<DmNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .select('*')
        .order('ho_ten', { ascending: true });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllNguoiDung:', error);
      throw error;
    }
  }

  // Lấy người dùng với thông tin phân quyền
  async getNguoiDungPhanQuyen(): Promise<VNguoiDungPhanQuyen[]> {
    try {
      const { data, error } = await supabase
        .from('v_nguoi_dung_phan_quyen')
        .select('*')
        .order('cap_do_quyen', { ascending: false })
        .order('ho_ten', { ascending: true });

      if (error) {
        console.error('Error fetching users with permissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNguoiDungPhanQuyen:', error);
      throw error;
    }
  }

  // Lấy người dùng theo ID
  async getNguoiDungById(id: number): Promise<DmNguoiDung | null> {
    try {
      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getNguoiDungById:', error);
      throw error;
    }
  }

  // Tạo người dùng mới
  async createNguoiDung(nguoiDung: CreateNguoiDungRequest): Promise<DmNguoiDung> {
    try {
      // Hash password trước khi lưu (trong thực tế sẽ dùng bcrypt)
      const hashedPassword = await this.hashPassword(nguoiDung.mat_khau);
      
      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .insert([{
          ...nguoiDung,
          mat_khau: hashedPassword,
          trang_thai: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createNguoiDung:', error);
      throw error;
    }
  }

  // Cập nhật người dùng
  async updateNguoiDung(nguoiDung: UpdateNguoiDungRequest): Promise<DmNguoiDung> {
    try {
      const { id, mat_khau, ...updateData } = nguoiDung;
      
      // Nếu có mật khẩu mới, hash nó
      if (mat_khau) {
        const hashedPassword = await this.hashPassword(mat_khau);
        updateData.mat_khau = hashedPassword;
      }

      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateNguoiDung:', error);
      throw error;
    }
  }

  // Xóa người dùng (soft delete)
  async deleteNguoiDung(id: number, deletedBy?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dm_nguoi_dung')
        .update({
          trang_thai: 'inactive',
          updated_by: deletedBy
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteNguoiDung:', error);
      throw error;
    }
  }

  // Xóa cứng người dùng (chỉ dành cho Super Admin)
  async hardDeleteNguoiDung(id: number): Promise<void> {
    try {
      // Xóa tất cả phân quyền trước
      const { error: permissionError } = await supabase
        .from('phan_quyen_nguoi_dung')
        .delete()
        .eq('nguoi_dung_id', id);

      if (permissionError) {
        console.error('Error deleting user permissions:', permissionError);
        throw permissionError;
      }

      // Xóa người dùng
      const { error } = await supabase
        .from('dm_nguoi_dung')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error hard deleting user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in hardDeleteNguoiDung:', error);
      throw error;
    }
  }

  // Kiểm tra email đã tồn tại
  async checkEmailExists(email: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from('dm_nguoi_dung')
        .select('id')
        .eq('email', email);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking email:', error);
        throw error;
      }

      return (data && data.length > 0);
    } catch (error) {
      console.error('Error in checkEmailExists:', error);
      throw error;
    }
  }

  // Đăng nhập
  async login(email: string, password: string): Promise<DmNguoiDung | null> {
    try {
      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .select('*')
        .eq('email', email)
        .eq('trang_thai', 'active')
        .single();

      if (error || !data) {
        return null;
      }

      // Kiểm tra mật khẩu (trong thực tế sẽ dùng bcrypt.compare)
      const isPasswordValid = await this.verifyPassword(password, data.mat_khau);
      if (!isPasswordValid) {
        return null;
      }

      // Cập nhật last_login
      await supabase
        .from('dm_nguoi_dung')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      return data;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  // Lấy danh sách tổ chức của người dùng
  async getUserOrganizations(userId: number): Promise<UserOrganization[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_organizations', { p_user_id: userId });

      if (error) {
        console.error('Error fetching user organizations:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserOrganizations:', error);
      throw error;
    }
  }

  // Lấy đại lý của nhân viên thu dựa trên tổ chức hiện tại
  async getUserDaiLy(userId: number, organizationType: string, organizationId: number): Promise<any[]> {
    try {
      // Sử dụng raw SQL để join các bảng và lấy đại lý của user
      const { data, error } = await supabase.rpc('get_user_dai_ly', {
        p_user_id: userId,
        p_organization_type: organizationType,
        p_organization_id: organizationId
      });

      if (error) {
        console.error('Error fetching user dai ly:', error);
        // Fallback: nếu function chưa có, dùng query trực tiếp
        return await this.getUserDaiLyFallback(userId, organizationType, organizationId);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserDaiLy:', error);
      // Fallback: dùng query trực tiếp
      return await this.getUserDaiLyFallback(userId, organizationType, organizationId);
    }
  }

  // Fallback method sử dụng query trực tiếp
  private async getUserDaiLyFallback(userId: number, organizationType: string, organizationId: number): Promise<any[]> {
    try {
      let query = supabase
        .from('v_dai_ly_chitiet')
        .select('*')
        .eq('trang_thai', 'active');

      // Lọc đại lý theo tổ chức của user
      if (organizationType === 'cong_ty') {
        query = query.eq('cong_ty_id', organizationId);
      } else if (organizationType === 'co_quan_bhxh') {
        query = query.eq('co_quan_bhxh_id', organizationId);
      }

      query = query.order('ten', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user dai ly fallback:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserDaiLyFallback:', error);
      throw error;
    }
  }

  // Lấy đơn vị của đại lý cho nhân viên thu
  async getUserDonViByDaiLy(daiLyId: number): Promise<any[]> {
    try {
      // Sử dụng function để lấy đơn vị theo đại lý
      const { data, error } = await supabase.rpc('get_don_vi_by_dai_ly', {
        p_dai_ly_id: daiLyId
      });

      if (error) {
        console.error('Error fetching don vi by dai ly:', error);
        // Fallback: nếu function chưa có, dùng query trực tiếp
        return await this.getUserDonViByDaiLyFallback(daiLyId);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserDonViByDaiLy:', error);
      // Fallback: dùng query trực tiếp
      return await this.getUserDonViByDaiLyFallback(daiLyId);
    }
  }

  // Fallback method cho getUserDonViByDaiLy
  private async getUserDonViByDaiLyFallback(daiLyId: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('v_dai_ly_don_vi')
        .select('*')
        .eq('dai_ly_id', daiLyId)
        .not('don_vi_id', 'is', null)
        .order('ten_don_vi', { ascending: true });

      if (error) {
        console.error('Error fetching don vi by dai ly fallback:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserDonViByDaiLyFallback:', error);
      throw error;
    }
  }

  // Tìm kiếm người dùng
  async searchNguoiDung(searchTerm: string): Promise<DmNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .select('*')
        .or(`email.ilike.%${searchTerm}%,ho_ten.ilike.%${searchTerm}%,so_dien_thoai.ilike.%${searchTerm}%`)
        .eq('trang_thai', 'active')
        .order('ho_ten', { ascending: true });

      if (error) {
        console.error('Error searching users:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchNguoiDung:', error);
      throw error;
    }
  }

  // Lấy người dùng đang hoạt động
  async getActiveNguoiDung(): Promise<DmNguoiDung[]> {
    try {
      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .select('*')
        .eq('trang_thai', 'active')
        .order('ho_ten', { ascending: true });

      if (error) {
        console.error('Error fetching active users:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveNguoiDung:', error);
      throw error;
    }
  }

  // Hash password (placeholder - trong thực tế sẽ dùng bcrypt)
  private async hashPassword(password: string): Promise<string> {
    // Placeholder implementation - trong demo chỉ encode đơn giản
    return `$2b$10$${btoa(password).slice(0, 53)}`;
  }

  // Verify password (placeholder - trong thực tế sẽ dùng bcrypt)
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // Placeholder implementation - trong demo so sánh trực tiếp
    // Kiểm tra cả hash và plain text để tương thích với dữ liệu mẫu
    const expectedHash = await this.hashPassword(password);
    return expectedHash === hashedPassword || password === hashedPassword || hashedPassword.includes(btoa(password));
  }
}

export const nguoiDungService = new NguoiDungService();
export default nguoiDungService;
