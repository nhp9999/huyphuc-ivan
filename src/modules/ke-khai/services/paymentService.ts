import { supabase } from '../../../shared/services/api/supabaseClient';
import { ThanhToan } from '../../../shared/services/api/supabaseClient';
import congTacVienHelperService from './congTacVienHelperService';

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

  // Tạo QR code VietQR với nhiều template để thử
  async generateVietQR(qrData: QRCodeData): Promise<string> {
    try {
      // Thử các template khác nhau để tìm template hỗ trợ nội dung dài nhất
      const templates = ['print', 'compact2', 'qr_only', 'compact'];

      // Sử dụng template print trước (thường hỗ trợ nội dung dài hơn)
      const selectedTemplate = 'print';

      const vietQRUrl = `https://img.vietqr.io/image/970405-${qrData.accountNumber}-${selectedTemplate}.png?amount=${qrData.amount}&addInfo=${encodeURIComponent(qrData.description)}&accountName=${encodeURIComponent(qrData.accountName)}`;

      console.log('VietQR URL generated:', {
        template: selectedTemplate,
        description: qrData.description,
        descriptionLength: qrData.description.length,
        encodedDescription: encodeURIComponent(qrData.description),
        encodedLength: encodeURIComponent(qrData.description).length,
        fullUrl: vietQRUrl
      });

      return vietQRUrl;
    } catch (error) {
      console.error('Error generating VietQR:', error);
      throw error;
    }
  }

  // Tạo QR code với template qr_only (chỉ QR, không có thông tin thêm)
  async generateVietQRSimple(qrData: QRCodeData): Promise<string> {
    try {
      // Template qr_only chỉ tạo QR code thuần, có thể hỗ trợ nội dung dài hơn
      const vietQRUrl = `https://img.vietqr.io/image/970405-${qrData.accountNumber}-qr_only.png?amount=${qrData.amount}&addInfo=${encodeURIComponent(qrData.description)}`;

      console.log('VietQR Simple URL generated:', {
        description: qrData.description,
        descriptionLength: qrData.description.length,
        fullUrl: vietQRUrl
      });

      return vietQRUrl;
    } catch (error) {
      console.error('Error generating VietQR Simple:', error);
      throw error;
    }
  }

  // Tạo QR code bằng API khác để hỗ trợ nội dung dài hơn
  async generateCustomQR(qrData: QRCodeData): Promise<string> {
    try {
      // Tạo URL chuyển khoản đơn giản với đầy đủ thông tin
      const transferUrl = `https://qr.sepay.vn/img?acc=${qrData.accountNumber}&bank=970405&amount=${qrData.amount}&des=${encodeURIComponent(qrData.description)}`;

      console.log('Custom QR (SePay) generated:', {
        description: qrData.description,
        descriptionLength: qrData.description.length,
        transferUrl: transferUrl
      });

      return transferUrl;
    } catch (error) {
      console.error('Error generating Custom QR:', error);
      throw error;
    }
  }

  // Tạo QR code đơn giản với QR Server API
  async generateSimpleQR(qrData: QRCodeData): Promise<string> {
    try {
      // Tạo nội dung chuyển khoản đơn giản
      const simpleContent = `Bank: AGRIBANK\nAccount: ${qrData.accountNumber}\nAmount: ${qrData.amount}\nContent: ${qrData.description}`;

      // Sử dụng QR Server API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(simpleContent)}`;

      console.log('Simple QR generated:', {
        content: simpleContent,
        contentLength: simpleContent.length,
        qrUrl: qrUrl
      });

      return qrUrl;
    } catch (error) {
      console.error('Error generating Simple QR:', error);
      throw error;
    }
  }



  // Validate và lấy dữ liệu đầy đủ cho nội dung chuyển khoản
  private async validateAndGetPaymentData(keKhaiId: number, createdBy: number) {
    try {
      // Lấy thông tin kê khai để lấy don_vi_id
      const { data: keKhaiData, error: keKhaiError } = await supabase
        .from('danh_sach_ke_khai')
        .select('don_vi_id')
        .eq('id', keKhaiId)
        .single();

      if (keKhaiError) {
        console.error('Error fetching ke khai data:', keKhaiError);
      }

      // Lấy thông tin đơn vị
      let donViInfo = null;
      if (keKhaiData?.don_vi_id) {
        const { data: donViData, error: donViError } = await supabase
          .from('dm_don_vi')
          .select('ma_don_vi, ma_co_quan_bhxh, ten_don_vi')
          .eq('id', keKhaiData.don_vi_id)
          .single();

        if (!donViError && donViData) {
          donViInfo = donViData;
          console.log('Don vi info for payment:', donViInfo);
        } else {
          console.warn('Could not get don vi info:', donViError);
        }
      }

      // Lấy thông tin nhân viên thu
      const nhanVienThuInfo = await congTacVienHelperService.getNhanVienThuForPayment(createdBy);

      if (nhanVienThuInfo) {
        console.log('Nhan vien thu info for payment:', nhanVienThuInfo);
      } else {
        console.warn('Could not get nhan vien thu info for payment, created_by:', createdBy);
      }

      return {
        donViInfo,
        nhanVienThuInfo
      };
    } catch (error) {
      console.error('Error in validateAndGetPaymentData:', error);
      throw error;
    }
  }

  // Tạo nội dung chuyển khoản theo cú pháp BHXH
  private generatePaymentDescription(maDonVi?: string, maCoQuanBhxh?: string, maNhanVienThu?: string): string {
    // Cú pháp: BHXH 103 00 <ma_don_vi> <ma_co_quan_bhxh> DONG BHXH CTY HUY PHUC <ma_nhan_vien_thu>
    const maDonViStr = maDonVi || 'BI0110G'; // Fallback mặc định
    const maCoQuanStr = maCoQuanBhxh || '08907'; // Fallback mặc định
    const maNhanVienStr = maNhanVienThu || 'NV089167001615'; // Fallback mặc định

    // Tạo nội dung đầy đủ - không rút ngắn để test với template qr_only
    const fullDescription = `BHXH 103 00 ${maDonViStr} ${maCoQuanStr} DONG BHXH CTY HUY PHUC ${maNhanVienStr}`;

    console.log('Payment description data:', {
      maDonVi: maDonVi,
      maCoQuanBhxh: maCoQuanBhxh,
      maNhanVienThu: maNhanVienThu,
      fullDescription: fullDescription,
      length: fullDescription.length
    });

    return fullDescription;
  }

  // Tạo yêu cầu thanh toán mới
  async createPayment(data: CreatePaymentRequest): Promise<ThanhToan> {
    try {
      // Kiểm tra số tiền phải lớn hơn 0
      if (data.so_tien <= 0) {
        throw new Error('Số tiền thanh toán phải lớn hơn 0. Vui lòng kiểm tra lại thông tin người tham gia trong kê khai.');
      }

      const ma_thanh_toan = await this.generateMaThanhToan();

      // Lấy thông tin kê khai trước
      const { data: keKhaiData, error: keKhaiError } = await supabase
        .from('danh_sach_ke_khai')
        .select('*')
        .eq('id', data.ke_khai_id)
        .single();

      if (keKhaiError) {
        console.error('Error fetching ke khai data:', keKhaiError);
        throw new Error('Không thể lấy thông tin kê khai');
      }

      // Lấy dữ liệu đầy đủ cho thanh toán
      const { donViInfo, nhanVienThuInfo } = await this.validateAndGetPaymentData(
        data.ke_khai_id,
        data.created_by || keKhaiData?.created_by
      );

      // Tạo nội dung chuyển khoản theo cú pháp BHXH
      const paymentDescription = this.generatePaymentDescription(
        donViInfo?.ma_don_vi,
        donViInfo?.ma_co_quan_bhxh,
        nhanVienThuInfo?.ma_nhan_vien
      );

      // Tạo QR code data
      const qrData: QRCodeData = {
        bankCode: 'AGRIBANK', // Agribank
        accountNumber: '6706202903085', // Số tài khoản nhận
        accountName: 'BAO HIEM XA HOI THI XA TINH BIEN',
        amount: data.so_tien,
        description: paymentDescription
      };

      // Thử nhiều API để tìm API hỗ trợ nội dung đầy đủ
      let qrCodeUrl;
      let qrMethod = 'unknown';

      try {
        // Thử SePay API trước
        qrCodeUrl = await this.generateCustomQR(qrData);
        qrMethod = 'sepay';
        console.log('Using SePay QR API for full content support');
      } catch (error) {
        console.warn('SePay QR failed, trying Simple QR:', error);
        try {
          // Thử QR Server API
          qrCodeUrl = await this.generateSimpleQR(qrData);
          qrMethod = 'simple';
          console.log('Using Simple QR API');
        } catch (error2) {
          console.warn('Simple QR failed, falling back to VietQR:', error2);
          // Fallback về VietQR
          qrCodeUrl = await this.generateVietQRSimple(qrData);
          qrMethod = 'vietqr';
          console.log('Using VietQR API (may truncate content)');
        }
      }
      
      // Thời gian hết hạn (30 phút)
      const expiredAt = new Date();
      expiredAt.setMinutes(expiredAt.getMinutes() + 30);

      const { data: result, error } = await supabase
        .from('thanh_toan')
        .insert({
          ...data,
          ma_thanh_toan,
          trang_thai: 'pending',
          qr_code_data: JSON.stringify({...qrData, qr_method: qrMethod}),
          qr_code_url: qrCodeUrl,
          payment_gateway: qrMethod,
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
