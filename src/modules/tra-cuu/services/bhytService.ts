import { BhytInfo, BhytLookupResponse, BhytBulkLookupResponse, BhytBulkResult, BulkLookupProgress, VnPostApiResponse, VnPostBhytData, BhytDeclarationRequest, BhytDeclarationResponse, BhytDeclarationData } from '../types/bhyt';
import { KeKhai603Request, KeKhai603Response } from '../types/kekhai603';
import vnpostTokenService from '../../../shared/services/api/vnpostTokenService';

export class BhytService {
  protected baseURL = 'https://ssm.vnpost.vn';
  protected authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiODg0MDAwX3hhX3RsaV9waHVvY2x0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsInN1YiI6IjEwMDkxNyIsInNpZCI6IkthMkZWQUR0T0F0Qnp3QVVsaWI2N1N3N01IdVRzVW5CbUFmVFVGbC14dTgiLCJuYW1lIjoiTMOqIFRo4buLIFBoxrDhu5tjIiwibmlja25hbWUiOiI4ODQwMDBfeGFfdGxpX3BodW9jbHQiLCJjbGllbnRfaWQiOiJZamcyTldVd01XRXRORFZtWlMwME1UZGhMVGc1TTJNdE56ZGtabUUzTmpVNE56VXoiLCJtYW5nTHVvaSI6Ijc2MjU1IiwiZG9uVmlDb25nVGFjIjoixJBp4buDbSB0aHUgeMOjIFTDom4gTOG7o2kiLCJjaHVjRGFuaCI6IkPhu5luZyB0w6FjIHZpw6puIHRodSIsImVtYWlsIjoibmd1eWVudGFuZHVuZzI3MTE4OUBnbWFpbC5jb20iLCJzb0RpZW5UaG9haSI6IiIsImlzU3VwZXJBZG1pbiI6IkZhbHNlIiwiaXNDYXMiOiJGYWxzZSIsIm5iZiI6MTc0ODgyNTk1MiwiZXhwIjoxNzQ4ODQzOTUyLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.6aRuO_8h4K0KcFqee7zLGXiPWEq-psMda7wNoyC8zGo';

  // Enhanced method to make API calls with intelligent auto-retry
  protected async makeApiCall(url: string, options: RequestInit): Promise<Response> {
    const startTime = Date.now();
    const response = await fetch(url, options);

    // Enhanced error detection and reporting
    if (!response.ok) {
      const errorDetails = {
        statusCode: response.status,
        message: response.statusText,
        endpoint: url,
        timestamp: startTime
      };

      // Report error with enhanced details
      if (response.status === 401 || response.status === 403 || response.status === 406) {
        console.log('🚨 Authentication error detected, reporting with details...');
        await vnpostTokenService.reportAuthError(errorDetails);

        // Wait a shorter time for potential auto-fix to complete (optimized for speed)
        await new Promise(resolve => setTimeout(resolve, 300));

        // Update headers with fresh token for retry
        const freshHeaders = await this.getHeaders();
        const retryOptions = {
          ...options,
          headers: freshHeaders
        };

        // Retry with fresh token
        console.log('🔄 Retrying request with fresh token...');
        const retryResponse = await fetch(url, retryOptions);

        if (!retryResponse.ok) {
          // Report retry failure with details
          await vnpostTokenService.reportAuthError({
            ...errorDetails,
            statusCode: retryResponse.status,
            message: `Retry failed: ${retryResponse.statusText}`,
            timestamp: Date.now()
          });
          throw new Error(`HTTP error! status: ${retryResponse.status} (after retry)`);
        }

        vnpostTokenService.reportAuthSuccess(); // Report retry success
        return retryResponse;
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  protected async getHeaders(): Promise<Record<string, string>> {
    try {
      // Ensure token is ready before proceeding
      console.log('🔑 Ensuring token is ready for API call...');
      const tokenInfo = await vnpostTokenService.ensureTokenReady();

      // Validate token before using
      if (!tokenInfo.authorization || tokenInfo.authorization === 'Bearer undefined') {
        throw new Error('Invalid token - token service not properly initialized');
      }

      console.log('✅ Token ready for API call:', {
        hasToken: !!tokenInfo.authorization,
        timestamp: tokenInfo.timestamp,
        isValid: tokenInfo.isValid
      });

      // Report success to optimize future token checks
      vnpostTokenService.reportSuccess();

      return {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8,ckb;q=0.7,zh-CN;q=0.6,zh-TW;q=0.5,zh;q=0.4',
        'authorization': tokenInfo.authorization,
        'content-type': 'application/json',
        'origin': 'https://ssm.vnpost.vn',
        'priority': 'u=1, i',
        'referer': 'https://ssm.vnpost.vn/qldv/ke-khai/buu-cuc-ke-khai/to-khai-bhyt',
        'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'timestamp': tokenInfo.timestamp.toString(),
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
      };
    } catch (error) {
      console.error('❌ Failed to get headers:', error);
      throw new Error(`Không thể lấy token xác thực: ${error instanceof Error ? error.message : 'Unknown error'}. Vui lòng đảm bảo token đã được tạo và lưu trong database.`);
    }
  }

  // Helper function to validate VnPost data
  protected isValidVnPostData(data: any): data is VnPostBhytData {
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

  // Helper methods for BHYT Declaration API
  protected buildAddress(): string {
    // Tạm thời trả về empty string vì không có thông tin địa chỉ chi tiết trong response
    return '';
  }

  // Kiểm tra dữ liệu kê khai có hợp lệ không
  protected isValidDeclarationData(data: any): boolean {
    if (!data) {
      return false;
    }

    // Kiểm tra họ tên - trường bắt buộc
    if (data.hoTen === null || data.hoTen === undefined || data.hoTen === '') {
      return false;
    }

    // Ghi log trạng thái thẻ nhưng không từ chối - vẫn có thể sử dụng thông tin cá nhân
    if (data.moTa && (
      data.moTa.toLowerCase().includes('không có thẻ') ||
      data.moTa.toLowerCase().includes('không tìm thấy') ||
      data.moTa.toLowerCase().includes('không tồn tại')
    )) {
      // Không return false - vẫn cho phép sử dụng thông tin cá nhân
    }

    // Kiểm tra typeId - nếu là "GT" (Guest/Không tìm thấy) thì không hợp lệ
    if (data.typeId === 'GT') {
      return false;
    }

    // Kiểm tra có ít nhất một trong các thông tin định danh
    const hasIdentification = (
      (data.maSoBHXH && data.maSoBHXH !== null && data.maSoBHXH !== '') ||
      (data.cmnd && data.cmnd !== null && data.cmnd !== '') ||
      (data.soTheBHYT && data.soTheBHYT !== null && data.soTheBHYT !== '') ||
      (data.maHoGiaDinh && data.maHoGiaDinh !== null && data.maHoGiaDinh !== '')
    );

    if (!hasIdentification) {
      return false;
    }

    return true;
  }

  protected getBenhVienName(data: any): string {
    // Sử dụng mã bệnh viện để tạm thời hiển thị
    return data.maBenhVien ? `Bệnh viện (Mã: ${data.maBenhVien})` : '';
  }

  protected getMucHuong(data: any): string {
    // Tính mức hưởng dựa trên các tỷ lệ
    if (data.tyLeNsnn > 0) {
      return `${data.tyLeNsnn * 100}%`;
    }
    return '80%'; // Mặc định
  }

  // Helper function để convert ngày sinh từ DD/MM/YYYY sang YYYY-MM-DD
  protected convertDateFormat(dateStr: string): string {
    if (!dateStr) return '';

    // Kiểm tra format DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }

    return dateStr; // Trả về nguyên bản nếu không đúng format
  }

  // Helper function để format ngày hiển thị (giữ nguyên DD/MM/YYYY cho hiển thị)
  protected formatDisplayDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr; // Giữ nguyên format DD/MM/YYYY cho hiển thị
  }

  // Helper method để format trạng thái thẻ
  protected formatCardStatus(status: string): string {
    if (!status) return 'Không xác định';

    // Thêm cảnh báo cho trạng thái "không có thẻ" nhưng vẫn cho phép sử dụng thông tin
    if (status.toLowerCase().includes('không có thẻ')) {
      return `⚠️ ${status} (Thông tin cá nhân vẫn có thể sử dụng)`;
    }

    return status;
  }

  // Convert VnPost API response to our BhytInfo format
  protected convertVnPostToBhytInfo(vnPostData: VnPostBhytData): BhytInfo {
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

      const response = await this.makeApiCall(url, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

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

  // API tìm kiếm thông tin BHYT cho kê khai 603
  async lookupKeKhai603(request: KeKhai603Request): Promise<KeKhai603Response> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinbhytforkekhai`;

      const response = await this.makeApiCall(url, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(request)
      });

      const apiResponse = await response.json();

      console.log('KeKhai603 API Response:', apiResponse); // Debug log

      // Check for authentication errors in response body
      if (!apiResponse.success && apiResponse.message &&
          (apiResponse.message.includes('token') ||
           apiResponse.message.includes('unauthorized') ||
           apiResponse.message.includes('authentication'))) {
        console.log('Authentication error in response body, reporting error...');
        vnpostTokenService.reportAuthError();
      } else if (apiResponse.success) {
        vnpostTokenService.reportAuthSuccess();
      }

      // Kiểm tra response từ API
      if (apiResponse.success && apiResponse.data && this.isValidDeclarationData(apiResponse.data)) {
        // Convert API response to our format
        const keKhai603Data = {
          // Sử dụng mã BHXH từ request nếu response không có (trường hợp maSoBHXH null trong response)
          maSoBhxh: apiResponse.data.maSoBHXH || request.maSoBHXH,
          hoTen: apiResponse.data.hoTen || '',
          ngaySinh: this.convertDateFormat(apiResponse.data.ngaySinh || ''),
          gioiTinh: apiResponse.data.gioiTinh === 1 ? 'Nam' : 'Nữ',
          diaChi: this.buildAddress(),
          noiDangKyKCB: this.getBenhVienName(apiResponse.data),
          // Hiển thị trạng thái thẻ với cảnh báo nếu cần
          trangThaiThe: this.formatCardStatus(apiResponse.data.moTa || 'Không xác định'),
          ngayHieuLuc: this.formatDisplayDate(apiResponse.data.tuNgayTheCu || ''),
          ngayHetHan: this.formatDisplayDate(apiResponse.data.denNgayTheCu || ''),
          mucHuong: this.getMucHuong(apiResponse.data),
          donViCongTac: '',
          maKV: apiResponse.data.tinhKCB || '',
          tenKV: '',
          soDienThoai: apiResponse.data.soDienThoai || '',
          cmnd: apiResponse.data.cmnd || '',
          soTheBHYT: apiResponse.data.soTheBHYT || '',
          loaiDoiTuong: apiResponse.data.typeId || 'GD',
          mucLuong: apiResponse.data.mucLuongNsTw?.toString() || '',
          tyLeDong: '100', // 100% lương cơ sở
          soTienDong: '',
          // Thêm mapping cho các trường còn thiếu
          quocTich: apiResponse.data.quocTich || 'VN',
          danToc: apiResponse.data.danToc || '',
          maTinhKS: apiResponse.data.maTinhKS || '',
          maHuyenKS: apiResponse.data.maHuyenKS || '',
          maXaKS: apiResponse.data.maXaKS || '',
          maTinhNkq: apiResponse.data.maTinhNkq || apiResponse.data.maTinhKS || '',
          maHuyenNkq: apiResponse.data.maHuyenNkq || apiResponse.data.maHuyenKS || '',
          maXaNkq: apiResponse.data.maXaNkq || apiResponse.data.maXaKS || '',
          noiNhanHoSo: apiResponse.data.noiNhanHoSo || '',
          maBenhVien: apiResponse.data.maBenhVien || '',
          maHoGiaDinh: apiResponse.data.maHoGiaDinh || '',
          phuongAn: apiResponse.data.phuongAn || '',
          moTa: apiResponse.data.moTa || ''
        };

        return {
          success: true,
          data: keKhai603Data,
          message: 'Tra cứu thông tin BHYT cho kê khai 603 thành công'
        };
      } else {
        let errorMessage = 'Không tìm thấy thông tin BHYT cho kê khai 603';

        if (apiResponse.message) {
          errorMessage = apiResponse.message;
        } else if (!apiResponse.success) {
          errorMessage = 'API trả về lỗi - Không thể tra cứu thông tin';
        } else if (!apiResponse.data) {
          errorMessage = 'Không có dữ liệu BHYT - Mã số có thể không tồn tại trong hệ thống';
        } else if (apiResponse.data) {
          // Kiểm tra lý do cụ thể tại sao dữ liệu không hợp lệ
          if (apiResponse.data.typeId === 'GT') {
            errorMessage = 'Không tìm thấy thông tin BHYT với mã số này trong hệ thống';
          } else if (apiResponse.data.hoTen === null || apiResponse.data.hoTen === '') {
            errorMessage = 'Không tìm thấy thông tin họ tên với mã số này';
          } else {
            // Kiểm tra xem có thông tin định danh nào không
            const hasAnyId = (
              (apiResponse.data.maSoBHXH && apiResponse.data.maSoBHXH !== null) ||
              (apiResponse.data.cmnd && apiResponse.data.cmnd !== null) ||
              (apiResponse.data.soTheBHYT && apiResponse.data.soTheBHYT !== null) ||
              (apiResponse.data.maHoGiaDinh && apiResponse.data.maHoGiaDinh !== null)
            );

            if (!hasAnyId) {
              errorMessage = 'Không tìm thấy thông tin định danh (BHXH/CMND/Thẻ BHYT) với mã số này';
            } else {
              errorMessage = 'Dữ liệu BHYT không đầy đủ hoặc không hợp lệ';
            }
          }
        }

        console.log('KeKhai603 lookup failed:', {
          apiSuccess: apiResponse.success,
          hasData: !!apiResponse.data,
          dataValid: apiResponse.data ? this.isValidDeclarationData(apiResponse.data) : false,
          hoTen: apiResponse.data?.hoTen,
          maSoBHXH: apiResponse.data?.maSoBHXH,
          moTa: apiResponse.data?.moTa,
          message: apiResponse.message
        });

        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('KeKhai603 lookup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi kết nối đến server',
        message: 'Không thể tra cứu thông tin BHYT cho kê khai 603. Vui lòng thử lại sau.'
      };
    }
  }

  // API tìm kiếm thông tin BHYT cho kê khai
  async lookupBhytForDeclaration(request: BhytDeclarationRequest): Promise<BhytDeclarationResponse> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinbhytforkekhai`;

      const response = await this.makeApiCall(url, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(request)
      });

      const apiResponse = await response.json();

      console.log('BHYT Declaration API Response:', apiResponse); // Debug log

      // Enhanced authentication error detection in response body
      if (!apiResponse.success && apiResponse.message) {
        const message = apiResponse.message.toLowerCase();
        if (message.includes('token') ||
            message.includes('unauthorized') ||
            message.includes('authentication') ||
            message.includes('secretid') ||
            message.includes('secretpass')) {
          console.log('🚨 Authentication error in response body, reporting with details...');
          await vnpostTokenService.reportAuthError({
            statusCode: response.status,
            message: apiResponse.message,
            endpoint: 'BHYT Declaration API',
            timestamp: Date.now()
          });
        }
      } else if (apiResponse.success) {
        vnpostTokenService.reportAuthSuccess();
      }

      // Kiểm tra response từ API
      if (apiResponse.success && apiResponse.data && this.isValidDeclarationData(apiResponse.data)) {
        // Convert API response to our format
        const declarationData: BhytDeclarationData = {
          maSoBhxh: apiResponse.data.maSoBHXH || request.maSoBHXH,
          hoTen: apiResponse.data.hoTen || '',
          ngaySinh: this.convertDateFormat(apiResponse.data.ngaySinh || ''),
          gioiTinh: apiResponse.data.gioiTinh === 1 ? 'Nam' : 'Nữ',
          diaChi: this.buildAddress(),
          noiDangKyKCB: this.getBenhVienName(apiResponse.data),
          trangThaiThe: apiResponse.data.moTa || 'Không xác định',
          ngayHieuLuc: this.formatDisplayDate(apiResponse.data.tuNgayTheCu || ''),
          ngayHetHan: this.formatDisplayDate(apiResponse.data.denNgayTheCu || ''),
          mucHuong: this.getMucHuong(apiResponse.data),
          donViCongTac: '',
          maKV: apiResponse.data.tinhKCB || '',
          tenKV: '',
          soDienThoai: apiResponse.data.soDienThoai || '',
          cmnd: apiResponse.data.cmnd || '',
          soTheBHYT: apiResponse.data.soTheBHYT || '',
          loaiDoiTuong: apiResponse.data.typeId || 'GD',
          mucLuong: apiResponse.data.mucLuongNsTw?.toString() || '',
          tyLeDong: '100', // 100% lương cơ sở
          soTienDong: '',
          // Thêm mapping cho các trường còn thiếu
          quocTich: apiResponse.data.quocTich || 'VN',
          danToc: apiResponse.data.danToc || '',
          maTinhKS: apiResponse.data.maTinhKS || '',
          maHuyenKS: apiResponse.data.maHuyenKS || '',
          maXaKS: apiResponse.data.maXaKS || '',
          maTinhNkq: apiResponse.data.maTinhNkq || apiResponse.data.maTinhKS || '',
          maHuyenNkq: apiResponse.data.maHuyenNkq || apiResponse.data.maHuyenKS || '',
          maXaNkq: apiResponse.data.maXaNkq || apiResponse.data.maXaKS || '',
          noiNhanHoSo: apiResponse.data.noiNhanHoSo || '',
          maBenhVien: apiResponse.data.maBenhVien || '',
          maHoGiaDinh: apiResponse.data.maHoGiaDinh || '',
          phuongAn: apiResponse.data.phuongAn || '',
          moTa: apiResponse.data.moTa || ''
        };

        return {
          success: true,
          data: declarationData,
          message: 'Tra cứu thông tin BHYT cho kê khai thành công'
        };
      } else {
        let errorMessage = 'Không tìm thấy thông tin BHYT cho kê khai';

        if (apiResponse.message) {
          errorMessage = apiResponse.message;
        } else if (!apiResponse.success) {
          errorMessage = 'API trả về lỗi - Không thể tra cứu thông tin';
        } else if (!apiResponse.data) {
          errorMessage = 'Không có dữ liệu BHYT - Mã số có thể không tồn tại trong hệ thống';
        } else if (apiResponse.data) {
          // Kiểm tra lý do cụ thể tại sao dữ liệu không hợp lệ dựa trên response thực tế
          if (apiResponse.data.typeId === 'GT') {
            errorMessage = 'Không tìm thấy thông tin BHYT với mã số này trong hệ thống';
          } else if (apiResponse.data.hoTen === null || apiResponse.data.hoTen === '') {
            errorMessage = 'Không tìm thấy thông tin họ tên với mã số này';
          } else {
            // Kiểm tra xem có thông tin định danh nào không
            const hasAnyId = (
              (apiResponse.data.maSoBHXH && apiResponse.data.maSoBHXH !== null) ||
              (apiResponse.data.cmnd && apiResponse.data.cmnd !== null) ||
              (apiResponse.data.soTheBHYT && apiResponse.data.soTheBHYT !== null) ||
              (apiResponse.data.maHoGiaDinh && apiResponse.data.maHoGiaDinh !== null)
            );

            if (!hasAnyId) {
              errorMessage = 'Không tìm thấy thông tin định danh (BHXH/CMND/Thẻ BHYT) với mã số này';
            } else {
              errorMessage = 'Dữ liệu BHYT không đầy đủ hoặc không hợp lệ';
            }
          }
        }

        console.log('BHYT Declaration lookup failed:', {
          apiSuccess: apiResponse.success,
          hasData: !!apiResponse.data,
          dataValid: apiResponse.data ? this.isValidDeclarationData(apiResponse.data) : false,
          hoTen: apiResponse.data?.hoTen,
          maSoBHXH: apiResponse.data?.maSoBHXH,
          moTa: apiResponse.data?.moTa,
          message: apiResponse.message
        });

        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('BHYT declaration lookup failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi kết nối đến server',
        message: 'Không thể tra cứu thông tin BHYT cho kê khai. Vui lòng thử lại sau.'
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

      // Add shorter delay between requests to avoid rate limiting (optimized)
      if (i < maSoBHXHList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
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

  // Override method để thêm debug cho API kê khai
  async lookupBhytForDeclaration(request: BhytDeclarationRequest): Promise<BhytDeclarationResponse> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinbhytforkekhai`;

      const response = await fetch(url, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      // Lưu response để debug
      this.lastApiResponse = {
        url,
        method: 'POST',
        requestBody: request,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: apiResponse,
        timestamp: new Date().toISOString()
      };

      console.log('BHYT Declaration API Response:', apiResponse); // Debug log

      // Gọi method cha để xử lý logic
      return super.lookupBhytForDeclaration(request);
    } catch (error) {
      console.error('BHYT declaration lookup failed:', error);
      this.lastApiResponse = {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi kết nối đến server',
        message: 'Không thể tra cứu thông tin BHYT cho kê khai. Vui lòng thử lại sau.'
      };
    }
  }

  async lookupBhytInfo(maSoBHXH: string): Promise<BhytLookupResponse> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinthe?maSoBHXH=${encodeURIComponent(maSoBHXH)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(),
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
