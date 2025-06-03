import { supabase } from '../../../shared/services/api/supabaseClient';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';

export interface CreatePaymentRequest {
  ke_khai_id: number;
  so_tien: number;
  phuong_thuc_thanh_toan: string;
  payment_description?: string;
  created_by?: string;
}

export interface QRCodeData {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  template?: string;
}

export interface VietQRResponse {
  code: string;
  desc: string;
  data?: {
    qrCode: string;
    qrDataURL: string;
  };
}

class PaymentService {
  // Tạo mã thanh toán tự động
  async generateMaThanhToan(): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('generate_ma_thanh_toan');

      if (error) {
        console.error('Error generating ma thanh toan:', error);
        throw new Error('Không thể tạo mã thanh toán');
      }

      return data;
    } catch (error) {
      console.error('Error in generateMaThanhToan:', error);
      throw error;
    }
  }

  // Tính tổng số tiền cần thanh toán cho kê khai
  async calculateTotalAmount(keKhaiId: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('danh_sach_nguoi_tham_gia')
        .select('so_tien_dong')
        .eq('ke_khai_id', keKhaiId);

      if (error) {
        console.error('Error calculating total amount:', error);
        throw new Error('Không thể tính tổng số tiền');
      }

      if (!data || data.length === 0) {
        throw new Error('Kê khai chưa có người tham gia nào. Vui lòng thêm người tham gia trước khi duyệt.');
      }

      const total = data.reduce((sum, item) => {
        const amount = parseFloat(item.so_tien_dong) || 0;
        return sum + amount;
      }, 0);

      if (total <= 0) {
        throw new Error('Tổng số tiền đóng bằng 0. Vui lòng kiểm tra lại số tiền đóng của từng người tham gia.');
      }

      return total;
    } catch (error) {
      console.error('Error in calculateTotalAmount:', error);
      throw error;
    }
  }

  // Tạo QR code VietQR
  async generateVietQR(qrData: QRCodeData): Promise<string> {
    try {
      // Sử dụng API VietQR.io để tạo QR code chuẩn
      const vietQRUrl = `https://img.vietqr.io/image/970405-${qrData.accountNumber}-compact2.png?amount=${qrData.amount}&addInfo=${encodeURIComponent(qrData.description)}&accountName=${encodeURIComponent(qrData.accountName)}`;

      return vietQRUrl;
    } catch (error) {
      console.error('Error generating VietQR:', error);
      throw error;
    }
  }



  // Tạo nội dung chuyển khoản theo cú pháp BHXH
  private generatePaymentDescription(maDonVi?: string, maCoQuanBhxh?: string, maNhanVienThu?: string): string {
    // Cú pháp: BHXH 103 00 <ma_don_vi> <ma_co_quan_bhxh> DONG BHXH CTY HUY PHUC <ma_nhan_vien_thu>
    const maDonViStr = maDonVi || '000';
    const maCoQuanStr = maCoQuanBhxh || '000';
    const maNhanVienStr = maNhanVienThu || '000';

    return `BHXH 103 00 ${maDonViStr} ${maCoQuanStr} DONG BHXH CTY HUY PHUC ${maNhanVienStr}`;
  }

  // Tạo yêu cầu thanh toán mới
  async createPayment(data: CreatePaymentRequest): Promise<ThanhToan> {
    try {
      // Kiểm tra số tiền phải lớn hơn 0
      if (data.so_tien <= 0) {
        throw new Error('Số tiền thanh toán phải lớn hơn 0. Vui lòng kiểm tra lại thông tin người tham gia trong kê khai.');
      }

      const ma_thanh_toan = await this.generateMaThanhToan();

      // Lấy thông tin kê khai để tạo nội dung chuyển khoản
      const { data: keKhaiData, error: keKhaiError } = await supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .eq('id', data.ke_khai_id)
        .single();

      if (keKhaiError) {
        console.error('Error fetching ke khai data:', keKhaiError);
      }

      // Lấy thông tin đơn vị nếu có
      let donViInfo = null;
      if (keKhaiData?.don_vi_id) {
        const { data: donViData } = await supabase
          .from('dm_don_vi')
          .select('ma_don_vi, ma_co_quan_bhxh')
          .eq('id', keKhaiData.don_vi_id)
          .single();
        donViInfo = donViData;
      }

      // Lấy thông tin nhân viên tạo kê khai
      let nhanVienInfo = null;
      if (keKhaiData?.created_by) {
        const { data: nhanVienData, error: nhanVienError } = await supabase
          .from('dm_nguoi_dung')
          .select('ma_nhan_vien, id')
          .eq('id', keKhaiData.created_by)
          .single();

        if (nhanVienError) {
          console.error('Error fetching employee data:', nhanVienError);
        } else {
          nhanVienInfo = nhanVienData;
          // Nếu chưa có mã nhân viên, sử dụng ID làm mã tạm thời
          if (!nhanVienInfo.ma_nhan_vien) {
            nhanVienInfo.ma_nhan_vien = `NV${nhanVienInfo.id.toString().padStart(3, '0')}`;
          }
        }
      }



      // Tạo nội dung chuyển khoản theo cú pháp BHXH
      const paymentDescription = this.generatePaymentDescription(
        donViInfo?.ma_don_vi,
        donViInfo?.ma_co_quan_bhxh,
        nhanVienInfo?.ma_nhan_vien
      );

      // Tạo QR code data
      const qrData: QRCodeData = {
        bankCode: 'AGRIBANK', // Agribank
        accountNumber: '6706202903085', // Số tài khoản nhận
        accountName: 'BAO HIEM XA HOI THI XA TINH BIEN',
        amount: data.so_tien,
        description: paymentDescription
      };

      const qrCodeUrl = await this.generateVietQR(qrData);
      
      // Thời gian hết hạn (30 phút)
      const expiredAt = new Date();
      expiredAt.setMinutes(expiredAt.getMinutes() + 30);

      const { data: result, error } = await supabase
        .from('thanh_toan')
        .insert({
          ...data,
          ma_thanh_toan,
          trang_thai: 'pending',
          qr_code_data: JSON.stringify(qrData),
          qr_code_url: qrCodeUrl,
          payment_gateway: 'vietqr',
          payment_description: paymentDescription,
          expired_at: expiredAt.toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        throw new Error('Không thể tạo yêu cầu thanh toán');
      }

      return result;
    } catch (error) {
      console.error('Error in createPayment:', error);
      throw error;
    }
  }

  // Lấy thông tin thanh toán theo kê khai ID
  async getPaymentByKeKhaiId(keKhaiId: number): Promise<ThanhToan | null> {
    try {
      const { data, error } = await supabase
        .from('thanh_toan')
        .select('*')
        .eq('ke_khai_id', keKhaiId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching payment:', error);
        throw new Error('Không thể lấy thông tin thanh toán');
      }

      return data || null;
    } catch (error) {
      console.error('Error in getPaymentByKeKhaiId:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái thanh toán
  async updatePaymentStatus(
    paymentId: number,
    status: string,
    transactionId?: string,
    updatedBy?: string,
    proofImageUrl?: string,
    confirmationNote?: string
  ): Promise<ThanhToan> {
    try {
      const updateData: any = {
        trang_thai: status,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy
      };

      if (status === 'completed') {
        updateData.paid_at = new Date().toISOString();
      }

      if (transactionId) {
        updateData.transaction_id = transactionId;
      }

      if (proofImageUrl) {
        updateData.proof_image_url = proofImageUrl;
      }

      if (confirmationNote) {
        updateData.confirmation_note = confirmationNote;
      }

      const { data: result, error } = await supabase
        .from('thanh_toan')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating payment status:', error);
        throw new Error('Không thể cập nhật trạng thái thanh toán');
      }

      return result;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      throw error;
    }
  }

  // Kiểm tra trạng thái thanh toán (polling)
  async checkPaymentStatus(paymentId: number): Promise<ThanhToan> {
    try {
      const { data, error } = await supabase
        .from('thanh_toan')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        throw new Error('Không thể kiểm tra trạng thái thanh toán');
      }

      return data;
    } catch (error) {
      console.error('Error in checkPaymentStatus:', error);
      throw error;
    }
  }

  // Hủy thanh toán
  async cancelPayment(paymentId: number, reason?: string, updatedBy?: string): Promise<ThanhToan> {
    try {
      const { data: result, error } = await supabase
        .from('thanh_toan')
        .update({
          trang_thai: 'cancelled',
          ghi_chu: reason,
          updated_at: new Date().toISOString(),
          updated_by: updatedBy
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling payment:', error);
        throw new Error('Không thể hủy thanh toán');
      }

      return result;
    } catch (error) {
      console.error('Error in cancelPayment:', error);
      throw error;
    }
  }

  // Format số tiền
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}

export default new PaymentService();
