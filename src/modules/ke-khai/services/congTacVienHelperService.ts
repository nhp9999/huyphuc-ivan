import { supabase } from '../../../shared/services/api/supabaseClient';

export interface NhanVienThuInfo {
  id: number;
  ma_nhan_vien: string;
  ho_ten: string;
  email: string;
}

export interface CongTacVienInfo {
  id: number;
  ma_ctv: string;
  ho_ten: string;
  nhan_vien_thu_id: number;
  nhan_vien_thu_info: NhanVienThuInfo;
}

class CongTacVienHelperService {
  /**
   * Lấy thông tin nhân viên thu dựa trên người tạo kê khai
   * Nếu người tạo là cộng tác viên, trả về thông tin nhân viên thu quản lý
   * Nếu không, trả về thông tin người tạo
   */
  async getNhanVienThuForPayment(createdBy: number): Promise<NhanVienThuInfo | null> {
    try {
      // Lấy thông tin người tạo
      const { data: nguoiTaoData, error: nguoiTaoError } = await supabase
        .from('dm_nguoi_dung')
        .select('id, ma_nhan_vien, ho_ten, email')
        .eq('id', createdBy)
        .single();

      if (nguoiTaoError) {
        console.error('Error fetching creator data:', nguoiTaoError);
        return null;
      }

      // Kiểm tra xem người tạo có phải là cộng tác viên không
      // Cách 1: Kiểm tra qua vai trò
      const { data: roleData } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select(`
          vai_tro_id,
          dm_vai_tro!inner(ten_vai_tro, ma_vai_tro)
        `)
        .eq('nguoi_dung_id', createdBy)
        .eq('trang_thai', 'active');

      const isCongTacVien = roleData?.some(role =>
        role.dm_vai_tro.ten_vai_tro.toLowerCase().includes('cộng tác viên') ||
        role.dm_vai_tro.ma_vai_tro.toLowerCase().includes('cong_tac_vien')
      );

      if (isCongTacVien) {
        // Nếu là cộng tác viên, tìm nhân viên thu quản lý qua bảng cong_tac_vien
        const { data: congTacVienData } = await supabase
          .from('cong_tac_vien')
          .select(`
            nhan_vien_thu_id,
            dm_nguoi_dung!cong_tac_vien_nhan_vien_thu_id_fkey(id, ma_nhan_vien, ho_ten, email)
          `)
          .eq('nguoi_dung_id', createdBy)
          .eq('trang_thai', 'active')
          .single();

        if (congTacVienData?.dm_nguoi_dung) {
          return {
            id: congTacVienData.dm_nguoi_dung.id,
            ma_nhan_vien: congTacVienData.dm_nguoi_dung.ma_nhan_vien || `NV${congTacVienData.dm_nguoi_dung.id.toString().padStart(3, '0')}`,
            ho_ten: congTacVienData.dm_nguoi_dung.ho_ten,
            email: congTacVienData.dm_nguoi_dung.email
          };
        }

        // Fallback: Tìm nhân viên thu trong cùng tổ chức
        const nhanVienThu = await this.findNhanVienThuInSameOrganization(createdBy);
        if (nhanVienThu) {
          return nhanVienThu;
        }
      }

      // Nếu không phải cộng tác viên hoặc không tìm thấy nhân viên thu, trả về thông tin người tạo
      return {
        id: nguoiTaoData.id,
        ma_nhan_vien: nguoiTaoData.ma_nhan_vien || `NV${nguoiTaoData.id.toString().padStart(3, '0')}`,
        ho_ten: nguoiTaoData.ho_ten,
        email: nguoiTaoData.email
      };

    } catch (error) {
      console.error('Error in getNhanVienThuForPayment:', error);
      return null;
    }
  }

  /**
   * Tìm nhân viên thu trong cùng tổ chức với cộng tác viên
   */
  private async findNhanVienThuInSameOrganization(congTacVienUserId: number): Promise<NhanVienThuInfo | null> {
    try {
      // Lấy thông tin tổ chức của cộng tác viên
      const { data: congTacVienPermission } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select('cong_ty_id, co_quan_bhxh_id, loai_to_chuc')
        .eq('nguoi_dung_id', congTacVienUserId)
        .eq('trang_thai', 'active')
        .single();

      if (!congTacVienPermission) {
        return null;
      }

      // Tìm nhân viên thu trong cùng tổ chức
      let query = supabase
        .from('phan_quyen_nguoi_dung')
        .select(`
          nguoi_dung_id,
          dm_nguoi_dung!inner(id, ma_nhan_vien, ho_ten, email),
          dm_vai_tro!inner(ten_vai_tro, ma_vai_tro)
        `)
        .eq('trang_thai', 'active')
        .eq('loai_to_chuc', congTacVienPermission.loai_to_chuc);

      if (congTacVienPermission.cong_ty_id) {
        query = query.eq('cong_ty_id', congTacVienPermission.cong_ty_id);
      } else if (congTacVienPermission.co_quan_bhxh_id) {
        query = query.eq('co_quan_bhxh_id', congTacVienPermission.co_quan_bhxh_id);
      }

      const { data: nhanVienThuList } = await query;

      // Tìm nhân viên thu đầu tiên
      const nhanVienThu = nhanVienThuList?.find(item => 
        item.dm_vai_tro.ten_vai_tro.toLowerCase().includes('nhân viên thu') ||
        item.dm_vai_tro.ma_vai_tro.toLowerCase().includes('nhan_vien_thu')
      );

      if (nhanVienThu) {
        return {
          id: nhanVienThu.dm_nguoi_dung.id,
          ma_nhan_vien: nhanVienThu.dm_nguoi_dung.ma_nhan_vien || `NV${nhanVienThu.dm_nguoi_dung.id.toString().padStart(3, '0')}`,
          ho_ten: nhanVienThu.dm_nguoi_dung.ho_ten,
          email: nhanVienThu.dm_nguoi_dung.email
        };
      }

      return null;
    } catch (error) {
      console.error('Error in findNhanVienThuInSameOrganization:', error);
      return null;
    }
  }

  /**
   * Kiểm tra xem user có phải là cộng tác viên không
   */
  async isCongTacVien(userId: number): Promise<boolean> {
    try {
      const { data: roleData } = await supabase
        .from('phan_quyen_nguoi_dung')
        .select(`
          vai_tro_id,
          dm_vai_tro!inner(ten_vai_tro, ma_vai_tro)
        `)
        .eq('nguoi_dung_id', userId)
        .eq('trang_thai', 'active');

      return roleData?.some(role => 
        role.dm_vai_tro.ten_vai_tro.toLowerCase().includes('cộng tác viên') ||
        role.dm_vai_tro.ma_vai_tro.toLowerCase().includes('cong_tac_vien')
      ) || false;

    } catch (error) {
      console.error('Error in isCongTacVien:', error);
      return false;
    }
  }

  /**
   * Lấy danh sách cộng tác viên mà nhân viên thu quản lý
   */
  async getCongTacVienByNhanVienThu(nhanVienThuId: number): Promise<CongTacVienInfo[]> {
    try {
      const { data, error } = await supabase
        .from('v_cong_tac_vien_chi_tiet')
        .select('*')
        .eq('nhan_vien_thu_id', nhanVienThuId)
        .eq('trang_thai', 'active');

      if (error) {
        console.error('Error fetching cong tac vien by nhan vien thu:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        ma_ctv: item.ma_ctv,
        ho_ten: item.ho_ten,
        nhan_vien_thu_id: item.nhan_vien_thu_id,
        nhan_vien_thu_info: {
          id: item.nhan_vien_thu_id,
          ma_nhan_vien: '', // Cần join thêm để lấy thông tin này
          ho_ten: item.ten_nhan_vien_thu,
          email: item.email_nhan_vien_thu
        }
      })) || [];

    } catch (error) {
      console.error('Error in getCongTacVienByNhanVienThu:', error);
      return [];
    }
  }

  /**
   * Tạo liên kết giữa cộng tác viên và tài khoản người dùng
   * (Nếu cần thiết trong tương lai)
   */
  async linkCongTacVienToUser(congTacVienId: number, userId: number): Promise<boolean> {
    try {
      // Cập nhật bảng cong_tac_vien để thêm trường nguoi_dung_id
      // Hoặc tạo bảng mapping riêng
      // Tạm thời chưa implement vì cần thay đổi schema

      console.log('Link cong tac vien to user not implemented yet');
      return false;
    } catch (error) {
      console.error('Error in linkCongTacVienToUser:', error);
      return false;
    }
  }

  /**
   * Lấy thông tin nhân viên thu từ mã nhân viên
   */
  async getNhanVienThuByMa(maNhanVien: string): Promise<NhanVienThuInfo | null> {
    try {
      const { data, error } = await supabase
        .from('dm_nguoi_dung')
        .select('id, ma_nhan_vien, ho_ten, email')
        .eq('ma_nhan_vien', maNhanVien)
        .eq('trang_thai', 'active')
        .single();

      if (error) {
        console.error('Error fetching nhan vien thu by ma:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getNhanVienThuByMa:', error);
      return null;
    }
  }
}

export const congTacVienHelperService = new CongTacVienHelperService();
export default congTacVienHelperService;
