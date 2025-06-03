import { supabase } from '../../../shared/services/api/supabaseClient';
import congTacVienService, { CreateCongTacVienRequest } from './congTacVienService';
import nguoiDungService from './nguoiDungService';

export interface CreateCongTacVienWithAccountRequest extends CreateCongTacVienRequest {
  createAccount: boolean;
  accountPassword?: string;
}

class CongTacVienAccountService {
  /**
   * Tạo cộng tác viên và tài khoản người dùng (nếu cần)
   */
  async createCongTacVienWithAccount(request: CreateCongTacVienWithAccountRequest) {
    const { createAccount, accountPassword, ...congTacVienData } = request;

    try {
      // Bước 1: Tạo cộng tác viên trước
      const congTacVien = await congTacVienService.createCongTacVien(congTacVienData);

      let nguoiDungId = null;

      // Bước 2: Tạo tài khoản người dùng nếu được yêu cầu
      if (createAccount && accountPassword) {
        try {
          // Sử dụng mã cộng tác viên làm username (lưu vào trường email)
          const username = congTacVien.ma_ctv;

          // Tạo tài khoản người dùng
          const nguoiDung = await nguoiDungService.createNguoiDung({
            ho_ten: congTacVienData.ho_ten,
            email: username, // Sử dụng mã CTV làm username
            mat_khau: accountPassword,
            so_dien_thoai: congTacVienData.so_dien_thoai,
            dia_chi: congTacVienData.dia_chi,
            trang_thai: 'active',
            created_by: congTacVienData.created_by
          });

          nguoiDungId = nguoiDung.id;

          // Bước 3: Không tạo tài khoản Supabase Auth nữa vì hệ thống sử dụng auth nội bộ
          // Chỉ cần tạo tài khoản trong hệ thống nội bộ
          console.log('Created internal account for cong tac vien:', {
            congTacVienId: congTacVien.id,
            nguoiDungId: nguoiDung.id,
            username: username
          });

          // Bước 4: Gán vai trò "cộng tác viên" cho người dùng
          await this.assignCongTacVienRole(nguoiDung.id, congTacVienData);

          // Bước 5: Liên kết cộng tác viên với tài khoản người dùng
          await congTacVienService.updateCongTacVien({
            id: congTacVien.id,
            nguoi_dung_id: nguoiDung.id,
            updated_by: congTacVienData.created_by
          });

          console.log('Created cong tac vien with account successfully:', {
            congTacVienId: congTacVien.id,
            nguoiDungId: nguoiDung.id,
            username: username
          });

        } catch (accountError) {
          console.error('Error creating account for cong tac vien:', accountError);
          // Nếu tạo tài khoản thất bại, xóa cộng tác viên đã tạo
          await congTacVienService.deleteCongTacVien(congTacVien.id);
          throw accountError;
        }
      }

      return {
        congTacVien,
        nguoiDungId,
        hasAccount: createAccount
      };

    } catch (error) {
      console.error('Error in createCongTacVienWithAccount:', error);
      throw error;
    }
  }

  /**
   * Gán vai trò "cộng tác viên" cho người dùng
   */
  private async assignCongTacVienRole(nguoiDungId: number, congTacVienData: CreateCongTacVienRequest) {
    try {
      // Lấy ID vai trò "cộng tác viên"
      const { data: vaiTroData, error: vaiTroError } = await supabase
        .from('dm_vai_tro')
        .select('id')
        .eq('ma_vai_tro', 'cong_tac_vien')
        .single();

      if (vaiTroError) {
        console.error('Error fetching cong tac vien role:', vaiTroError);
        throw new Error('Không tìm thấy vai trò cộng tác viên');
      }

      // Tạo phân quyền người dùng
      const { error: phanQuyenError } = await supabase
        .from('phan_quyen_nguoi_dung')
        .insert([{
          nguoi_dung_id: nguoiDungId,
          vai_tro_id: vaiTroData.id,
          cong_ty_id: congTacVienData.cong_ty_id,
          co_quan_bhxh_id: congTacVienData.co_quan_bhxh_id,
          loai_to_chuc: congTacVienData.loai_to_chuc,
          trang_thai: 'active',
          created_by: congTacVienData.created_by
        }]);

      if (phanQuyenError) {
        console.error('Error creating user permission:', phanQuyenError);
        throw new Error('Không thể gán quyền cho người dùng: ' + phanQuyenError.message);
      }

    } catch (error) {
      console.error('Error in assignCongTacVienRole:', error);
      throw error;
    }
  }

  /**
   * Tạo tài khoản cho cộng tác viên đã tồn tại
   */
  async createAccountForExistingCongTacVien(congTacVienId: number, password: string) {
    try {
      // Lấy thông tin cộng tác viên
      const congTacVien = await congTacVienService.getCongTacVienById(congTacVienId);
      if (!congTacVien) {
        throw new Error('Không tìm thấy cộng tác viên');
      }

      if (congTacVien.nguoi_dung_id) {
        throw new Error('Cộng tác viên đã có tài khoản');
      }

      // Sử dụng mã cộng tác viên làm username
      const username = congTacVien.ma_ctv;

      // Tạo tài khoản người dùng
      const nguoiDung = await nguoiDungService.createNguoiDung({
        ho_ten: congTacVien.ho_ten,
        email: username, // Sử dụng mã CTV làm username
        mat_khau: password,
        so_dien_thoai: congTacVien.so_dien_thoai,
        dia_chi: congTacVien.dia_chi,
        trang_thai: 'active',
        created_by: 'system'
      });

      // Không cần tạo tài khoản Supabase Auth nữa vì hệ thống sử dụng auth nội bộ
      console.log('Creating account for existing cong tac vien:', {
        congTacVienId: congTacVienId,
        nguoiDungId: nguoiDung.id,
        username: username
      });

      // Gán vai trò
      await this.assignCongTacVienRole(nguoiDung.id, {
        ho_ten: congTacVien.ho_ten,
        email: username, // Sử dụng username thay vì email
        nhan_vien_thu_id: congTacVien.nhan_vien_thu_id,
        cong_ty_id: congTacVien.cong_ty_id,
        co_quan_bhxh_id: congTacVien.co_quan_bhxh_id,
        loai_to_chuc: congTacVien.loai_to_chuc,
        created_by: 'system'
      });

      // Liên kết với cộng tác viên
      await congTacVienService.updateCongTacVien({
        id: congTacVienId,
        nguoi_dung_id: nguoiDung.id,
        updated_by: 'system'
      });

      return {
        nguoiDung,
        username: username
      };

    } catch (error) {
      console.error('Error in createAccountForExistingCongTacVien:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra cộng tác viên có tài khoản chưa
   */
  async checkCongTacVienHasAccount(congTacVienId: number): Promise<boolean> {
    try {
      const congTacVien = await congTacVienService.getCongTacVienById(congTacVienId);
      return !!(congTacVien?.nguoi_dung_id);
    } catch (error) {
      console.error('Error in checkCongTacVienHasAccount:', error);
      return false;
    }
  }

  /**
   * Lấy thông tin tài khoản của cộng tác viên
   */
  async getCongTacVienAccount(congTacVienId: number) {
    try {
      const { data, error } = await supabase
        .from('v_cong_tac_vien_chi_tiet')
        .select('*')
        .eq('id', congTacVienId)
        .single();

      if (error) {
        console.error('Error fetching cong tac vien account:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCongTacVienAccount:', error);
      throw error;
    }
  }
}

export const congTacVienAccountService = new CongTacVienAccountService();
export default congTacVienAccountService;
