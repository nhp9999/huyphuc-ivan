import { BhytInfo, BhytLookupResponse, ApiResponse, BhytBulkLookupResponse, BhytBulkResult, BulkLookupProgress, VnPostApiResponse, VnPostBhytData } from '../types/bhyt';

export class BhytService {
  private baseURL = 'https://ssm.vnpost.vn';
  private authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiODg0MDAwX3hhX3RsaV9waHVvY2x0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsInN1YiI6IjEwMDkxNyIsInNpZCI6IkZWVVVvcGd1NmVxVDVqN3ZHNDEzQzZUSm9zdndFZFE4UHl6bFZSc3FBLUkiLCJuYW1lIjoiTMOqIFRo4buLIFBoxrDhu5tjIiwibmlja25hbWUiOiI4ODQwMDBfeGFfdGxpX3BodW9jbHQiLCJjbGllbnRfaWQiOiJZamcyTldVd01XRXRORFZtWlMwME1UZGhMVGc1TTJNdE56ZGtabUUzTmpVNE56VXoiLCJtYW5nTHVvaSI6Ijc2MjU1IiwiZG9uVmlDb25nVGFjIjoixJBp4buDbSB0aHUgeMOjIFTDom4gTOG7o2kiLCJjaHVjRGFuaCI6IkPhu5luZyB0w6FjIHZpw6puIHRodSIsImVtYWlsIjoibmd1eWVudGFuZHVuZzI3MTE4OUBnbWFpbC5jb20iLCJzb0RpZW5UaG9haSI6IiIsImlzU3VwZXJBZG1pbiI6IkZhbHNlIiwiaXNDYXMiOiJGYWxzZSIsIm5iZiI6MTc0ODM2MDMwNywiZXhwIjoxNzQ4Mzc4MzA3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.L_bWNPK3q__6-JBBjZ4gFe5eyIDBb4zCQl_dFzTkeqA';

  private getHeaders(): Record<string, string> {
    return {
      'sec-ch-ua-platform': '"Windows"',
      'Authorization': `Bearer ${this.authToken}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'Content-Type': 'application/json',
      'sec-ch-ua-mobile': '?0',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'host': 'ssm.vnpost.vn'
    };
  }

  // Helper function to validate VnPost data
  private isValidVnPostData(data: any): data is VnPostBhytData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Kiểm tra trạng thái thẻ - nếu "Không có thẻ" thì không hợp lệ
    if (data.trangThaiThe === "Không có thẻ") {
      return false;
    }

    // Kiểm tra các field bắt buộc
    const hasValidId = data.maSoBhxh || data.soTheBhyt;
    const hasValidName = data.hoTen && data.hoTen.trim() !== '';

    return hasValidId && hasValidName;
  }

  // Convert VnPost API response to our BhytInfo format
  private convertVnPostToBhytInfo(vnPostData: VnPostBhytData): BhytInfo {
    // Format dates from YYYYMMDD to DD/MM/YYYY
    const formatDate = (dateStr: string): string => {
      if (!dateStr || dateStr.length !== 8) return dateStr;
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${day}/${month}/${year}`;
    };

    // Calculate coverage percentage from tyLeBhyt
    const mucHuong = vnPostData.tyLeBhyt ? `${vnPostData.tyLeBhyt * 20}%` : '80%';

    return {
      maSoBHXH: vnPostData.maSoBhxh || vnPostData.soTheBhyt || '',
      hoTen: vnPostData.hoTen || '',
      ngaySinh: vnPostData.ngaySinhHienThi || formatDate(vnPostData.ngaySinh),
      gioiTinh: vnPostData.gioiTinhHienThi || (vnPostData.gioiTinh === '1' ? 'Nam' : 'Nữ'),
      diaChi: `${vnPostData.diaChiLh || ''}, ${vnPostData.tenTinhKCB || ''}`.trim().replace(/^,\s*/, ''),
      noiDangKyKCB: vnPostData.coSoKCB || vnPostData.tenBenhVien || '',
      trangThaiThe: vnPostData.trangThaiThe || '',
      ngayHieuLuc: formatDate(vnPostData.tuNgay),
      ngayHetHan: formatDate(vnPostData.denNgay),
      mucHuong: mucHuong,
      donViCongTac: vnPostData.tenDvi || vnPostData.tenCqbh || '',
      maKV: vnPostData.maTinhKcb || vnPostData.maKCB || '',
      tenKV: vnPostData.tenTinhKCB || ''
    };
  }

  async lookupBhytInfo(maSoBHXH: string): Promise<BhytLookupResponse> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinthe?maSoBHXH=${encodeURIComponent(maSoBHXH)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: VnPostApiResponse = await response.json();

      console.log('VNPost API Response:', apiResponse); // Debug log

      // Kiểm tra response từ VnPost API
      // API có thể trả về success: true nhưng data: null khi không tìm thấy
      if (apiResponse.success && this.isValidVnPostData(apiResponse.data)) {
        const bhytInfo = this.convertVnPostToBhytInfo(apiResponse.data);
        return {
          success: true,
          data: bhytInfo,
          message: 'Tra cứu thành công'
        };
      } else {
        // Xử lý các trường hợp thất bại
        let errorMessage = 'Không tìm thấy thông tin thẻ BHYT';

        if (apiResponse.message) {
          errorMessage = apiResponse.message;
        } else if (!apiResponse.success) {
          errorMessage = `API trả về lỗi (Status: ${apiResponse.status})`;
        } else if (!apiResponse.data) {
          errorMessage = 'Không có dữ liệu thẻ BHYT - Mã số có thể không tồn tại';
        } else if (apiResponse.data) {
          // Kiểm tra trạng thái thẻ cụ thể
          if (apiResponse.data.trangThaiThe === "Không có thẻ") {
            errorMessage = 'Không có thẻ BHYT với mã số này trong hệ thống';
          } else if (!apiResponse.data.hoTen || !apiResponse.data.maSoBhxh) {
            errorMessage = 'Dữ liệu thẻ không đầy đủ hoặc không hợp lệ';
          } else {
            errorMessage = 'Dữ liệu thẻ không hợp lệ hoặc thiếu thông tin cần thiết';
          }
        }

        console.log('BHYT lookup failed:', {
          apiSuccess: apiResponse.success,
          hasData: !!apiResponse.data,
          trangThaiThe: apiResponse.data?.trangThaiThe,
          hoTen: apiResponse.data?.hoTen,
          maSoBhxh: apiResponse.data?.maSoBhxh,
          isValidData: this.isValidVnPostData(apiResponse.data),
          message: apiResponse.message,
          status: apiResponse.status
        });

        return {
          success: false,
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error('BHYT lookup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi kết nối đến server',
        message: 'Không thể tra cứu thông tin. Vui lòng thử lại sau.'
      };
    }
  }

  // Bulk lookup function for real API
  async bulkLookupBhytInfo(
    maSoBHXHList: string[],
    onProgress?: (progress: BulkLookupProgress) => void
  ): Promise<BhytBulkLookupResponse> {
    const results: BhytBulkResult[] = [];
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
        const response = await this.lookupBhytInfo(maSoBHXH);

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
            message: response.message || 'Không tìm thấy thông tin'
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
      message: `Hoàn thành tra cứu ${maSoBHXHList.length} mã số. Thành công: ${successCount}, Thất bại: ${failureCount}`
    };
  }

  // Mock function for testing when API is not available
  async mockLookupBhytInfo(maSoBHXH: string): Promise<BhytLookupResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data for testing
    if (maSoBHXH === '0123456789') {
      return {
        success: true,
        data: {
          maSoBHXH: '0123456789',
          hoTen: 'NGUYỄN VĂN A',
          ngaySinh: '01/01/1990',
          gioiTinh: 'Nam',
          diaChi: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
          noiDangKyKCB: 'Bệnh viện Chợ Rẫy',
          trangThaiThe: 'Còn hiệu lực',
          ngayHieuLuc: '01/01/2024',
          ngayHetHan: '31/12/2024',
          mucHuong: '80%',
          donViCongTac: 'Công ty TNHH ABC',
          maKV: 'KV1',
          tenKV: 'Khu vực 1'
        },
        message: 'Tra cứu thành công'
      };
    } else {
      return {
        success: false,
        message: 'Không tìm thấy thông tin thẻ BHYT với mã số này'
      };
    }
  }

  // Mock bulk lookup function for testing
  async mockBulkLookupBhytInfo(
    maSoBHXHList: string[],
    onProgress?: (progress: BulkLookupProgress) => void
  ): Promise<BhytBulkLookupResponse> {
    const results: BhytBulkResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    const mockData = [
      {
        maSoBHXH: '0123456789',
        hoTen: 'NGUYỄN VĂN A',
        ngaySinh: '01/01/1990',
        gioiTinh: 'Nam',
        diaChi: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
        noiDangKyKCB: 'Bệnh viện Chợ Rẫy',
        trangThaiThe: 'Còn hiệu lực',
        ngayHieuLuc: '01/01/2024',
        ngayHetHan: '31/12/2024',
        mucHuong: '80%',
        donViCongTac: 'Công ty TNHH ABC',
        maKV: 'KV1',
        tenKV: 'Khu vực 1'
      },
      {
        maSoBHXH: '0123456788',
        hoTen: 'TRẦN THỊ B',
        ngaySinh: '15/05/1985',
        gioiTinh: 'Nữ',
        diaChi: '456 Đường DEF, Phường UVW, Quận 2, TP.HCM',
        noiDangKyKCB: 'Bệnh viện Đại học Y Dược',
        trangThaiThe: 'Còn hiệu lực',
        ngayHieuLuc: '01/01/2024',
        ngayHetHan: '31/12/2024',
        mucHuong: '100%',
        donViCongTac: 'Công ty CP XYZ',
        maKV: 'KV2',
        tenKV: 'Khu vực 2'
      },
      {
        maSoBHXH: '0123456787',
        hoTen: 'LÊ VĂN C',
        ngaySinh: '20/12/1992',
        gioiTinh: 'Nam',
        diaChi: '789 Đường GHI, Phường RST, Quận 3, TP.HCM',
        noiDangKyKCB: 'Bệnh viện Nhân dân 115',
        trangThaiThe: 'Hết hạn',
        ngayHieuLuc: '01/01/2023',
        ngayHetHan: '31/12/2023',
        mucHuong: '80%',
        donViCongTac: 'Công ty TNHH DEF',
        maKV: 'KV1',
        tenKV: 'Khu vực 1'
      }
    ];

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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find mock data for this maSoBHXH
      const foundData = mockData.find(data => data.maSoBHXH === maSoBHXH);

      if (foundData) {
        results.push({
          maSoBHXH,
          success: true,
          data: foundData,
          message: 'Tra cứu thành công'
        });
        successCount++;
      } else {
        results.push({
          maSoBHXH,
          success: false,
          message: 'Không tìm thấy thông tin thẻ BHYT với mã số này'
        });
        failureCount++;
      }
    }

    return {
      success: true,
      results,
      totalCount: maSoBHXHList.length,
      successCount,
      failureCount,
      message: `Hoàn thành tra cứu ${maSoBHXHList.length} mã số. Thành công: ${successCount}, Thất bại: ${failureCount}`
    };
  }
}

export const bhytService = new BhytService();

// Debug wrapper để capture API responses
export class BhytServiceDebug extends BhytService {
  public lastApiResponse: any = null;

  async lookupBhytInfo(maSoBHXH: string): Promise<BhytLookupResponse> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinthe?maSoBHXH=${encodeURIComponent(maSoBHXH)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: VnPostApiResponse = await response.json();

      // Lưu response để debug
      this.lastApiResponse = {
        url,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: apiResponse,
        timestamp: new Date().toISOString()
      };

      console.log('VNPost API Response:', apiResponse); // Debug log

      // Kiểm tra response từ VnPost API
      // API có thể trả về success: true nhưng data: null khi không tìm thấy
      if (apiResponse.success && this.isValidVnPostData(apiResponse.data)) {
        const bhytInfo = this.convertVnPostToBhytInfo(apiResponse.data);
        return {
          success: true,
          data: bhytInfo,
          message: 'Tra cứu thành công'
        };
      } else {
        // Xử lý các trường hợp thất bại
        let errorMessage = 'Không tìm thấy thông tin thẻ BHYT';

        if (apiResponse.message) {
          errorMessage = apiResponse.message;
        } else if (!apiResponse.success) {
          errorMessage = `API trả về lỗi (Status: ${apiResponse.status})`;
        } else if (!apiResponse.data) {
          errorMessage = 'Không có dữ liệu thẻ BHYT - Mã số có thể không tồn tại';
        } else if (apiResponse.data) {
          // Kiểm tra trạng thái thẻ cụ thể
          if (apiResponse.data.trangThaiThe === "Không có thẻ") {
            errorMessage = 'Không có thẻ BHYT với mã số này trong hệ thống';
          } else if (!apiResponse.data.hoTen || !apiResponse.data.maSoBhxh) {
            errorMessage = 'Dữ liệu thẻ không đầy đủ hoặc không hợp lệ';
          } else {
            errorMessage = 'Dữ liệu thẻ không hợp lệ hoặc thiếu thông tin cần thiết';
          }
        }

        console.log('BHYT lookup failed:', {
          apiSuccess: apiResponse.success,
          hasData: !!apiResponse.data,
          trangThaiThe: apiResponse.data?.trangThaiThe,
          hoTen: apiResponse.data?.hoTen,
          maSoBhxh: apiResponse.data?.maSoBhxh,
          isValidData: this.isValidVnPostData(apiResponse.data),
          message: apiResponse.message,
          status: apiResponse.status
        });

        return {
          success: false,
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error('BHYT lookup failed:', error);
      this.lastApiResponse = {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi kết nối đến server',
        message: 'Không thể tra cứu thông tin. Vui lòng thử lại sau.'
      };
    }
  }
}

export const bhytServiceDebug = new BhytServiceDebug();
