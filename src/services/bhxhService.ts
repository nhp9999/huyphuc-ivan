import {
  BhxhInfo,
  BhxhLookupResponse,
  BhxhBulkLookupResponse,
  BhxhBulkResult,
  BulkLookupProgress,
  VnPostBhxhApiResponse,
  VnPostBhxhData
} from '../types/bhxh';

export class BhxhService {
  protected baseURL = 'https://ssm.vnpost.vn';
  protected authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  protected getHeaders() {
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'sec-ch-ua-platform': '"Windows"',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'host': 'ssm.vnpost.vn'
    };
  }

  // Kiểm tra dữ liệu BHXH có hợp lệ không
  protected isValidBhxhData(data: any): boolean {
    if (!data) {
      console.log('BHXH data validation failed: No data');
      return false;
    }

    // Kiểm tra các trường bắt buộc
    if (data.hoTen === null || data.hoTen === undefined || data.hoTen === '') {
      console.log('BHXH data validation failed: hoTen is null/empty', data.hoTen);
      return false;
    }

    if (data.maSoBHXH === null || data.maSoBHXH === undefined || data.maSoBHXH === '') {
      console.log('BHXH data validation failed: maSoBHXH is null/empty', data.maSoBHXH);
      return false;
    }

    return true;
  }

  // Chuyển đổi dữ liệu từ API VNPost sang format hiển thị
  protected mapVnPostDataToBhxhInfo(data: VnPostBhxhData): BhxhInfo {
    return {
      maSoBHXH: data.maSoBHXH || '',
      hoTen: data.hoTen || '',
      ngaySinh: data.ngaySinh || '',
      gioiTinh: data.gioiTinh === 1 ? 'Nam' : 'Nữ',
      diaChi: data.diaChi || '',
      soDienThoai: data.soDienThoai || '',
      cmnd: data.cmnd || '',
      trangThaiThamGia: data.trangThaiThamGia || '',
      ngayThamGia: data.ngayThamGia || '',
      ngayNgungThamGia: data.ngayNgungThamGia || '',
      mucLuong: data.mucLuong?.toString() || '',
      tyLeDong: data.tyLeDong?.toString() || '',
      soTienDong: data.soTienDong?.toString() || '',
      donViThuTien: data.donViThuTien || '',
      tinhTrangDongPhi: data.tinhTrangDongPhi || ''
    };
  }

  // API tra cứu thông tin BHXH tự nguyện
  async lookupBhxhInfo(maSoBHXH: string): Promise<BhxhLookupResponse> {
    try {
      // Note: This endpoint might need to be updated based on actual BHXH API
      const url = `${this.baseURL}/connect/tracuu/thongtinbhxhtn?maSoBHXH=${encodeURIComponent(maSoBHXH)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: VnPostBhxhApiResponse = await response.json();

      console.log('VNPost BHXH API Response:', apiResponse); // Debug log

      if (apiResponse.success && apiResponse.data && this.isValidBhxhData(apiResponse.data)) {
        const bhxhInfo = this.mapVnPostDataToBhxhInfo(apiResponse.data);

        return {
          success: true,
          data: bhxhInfo,
          message: 'Tra cứu thông tin BHXH tự nguyện thành công'
        };
      } else {
        let errorMessage = 'Không tìm thấy thông tin BHXH tự nguyện với mã số này';

        if (apiResponse.message) {
          errorMessage = apiResponse.message;
        } else if (!apiResponse.success) {
          errorMessage = 'API trả về lỗi - Không thể tra cứu thông tin BHXH';
        } else if (!apiResponse.data) {
          errorMessage = 'Không có dữ liệu BHXH - Mã số có thể không tồn tại trong hệ thống';
        }

        return {
          success: false,
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error('BHXH lookup failed:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi kết nối đến server',
        message: 'Không thể tra cứu thông tin BHXH. Vui lòng thử lại sau.'
      };
    }
  }

  // API tra cứu hàng loạt
  async bulkLookupBhxhInfo(
    maSoBHXHList: string[],
    onProgress?: (progress: BulkLookupProgress) => void
  ): Promise<BhxhBulkLookupResponse> {
    const results: BhxhBulkResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < maSoBHXHList.length; i++) {
      const maSoBHXH = maSoBHXHList[i];

      // Update progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: maSoBHXHList.length,
          percentage: Math.round(((i + 1) / maSoBHXHList.length) * 100),
          currentMaSo: maSoBHXH
        });
      }

      try {
        const response = await this.lookupBhxhInfo(maSoBHXH);

        if (response.success && response.data) {
          results.push({
            maSoBHXH,
            success: true,
            data: response.data,
            message: response.message
          });
          successCount++;
        } else {
          results.push({
            maSoBHXH,
            success: false,
            message: response.message || 'Không tìm thấy thông tin BHXH'
          });
          failureCount++;
        }
      } catch (error) {
        results.push({
          maSoBHXH,
          success: false,
          error: error instanceof Error ? error.message : 'Lỗi không xác định'
        });
        failureCount++;
      }

      // Add delay between requests to avoid rate limiting
      if (i < maSoBHXHList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return {
      success: true,
      results,
      totalCount: maSoBHXHList.length,
      successCount,
      failureCount,
      message: `Hoàn thành tra cứu ${maSoBHXHList.length} mã số BHXH. Thành công: ${successCount}, Thất bại: ${failureCount}`
    };
  }
}

// Export service instances
export const bhxhService = new BhxhService();
