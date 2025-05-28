import { BhytInfo, BhytLookupResponse, ApiResponse, BhytBulkLookupResponse, BhytBulkResult, BulkLookupProgress, VnPostApiResponse, VnPostBhytData, BhytDeclarationRequest, BhytDeclarationResponse, BhytDeclarationData, BhytDeclarationApiResponse, BhytDeclarationApiData } from '../types/bhyt';

export class BhytService {
  protected baseURL = 'https://ssm.vnpost.vn';
  protected authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiODg0MDAwX3hhX3RsaV9waHVvY2x0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoidXNlciIsInN1YiI6IjEwMDkxNyIsInNpZCI6ImgtemFzM1hLYmJ3TFYyQVFwUURXZWhwUW5hR2R4cTFGUGJJZ3liVmptNGsiLCJuYW1lIjoiTMOqIFRo4buLIFBoxrDhu5tjIiwibmlja25hbWUiOiI4ODQwMDBfeGFfdGxpX3BodW9jbHQiLCJjbGllbnRfaWQiOiJZamcyTldVd01XRXRORFZtWlMwME1UZGhMVGc1TTJNdE56ZGtabUUzTmpVNE56VXoiLCJtYW5nTHVvaSI6Ijc2MjU1IiwiZG9uVmlDb25nVGFjIjoixJBp4buDbSB0aHUgeMOjIFTDom4gTOG7o2kiLCJjaHVjRGFuaCI6IkPhu5luZyB0w6FjIHZpw6puIHRodSIsImVtYWlsIjoibmd1eWVudGFuZHVuZzI3MTE4OUBnbWFpbC5jb20iLCJzb0RpZW5UaG9haSI6IiIsImlzU3VwZXJBZG1pbiI6IkZhbHNlIiwiaXNDYXMiOiJGYWxzZSIsIm5iZiI6MTc0ODQ0MTY0OCwiZXhwIjoxNzQ4NDU5NjQ4LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.U6kdLiiqaUMy_2k2_G5B8EJ6LcyVdkZJT7hfccH8umw';

  protected getHeaders(): Record<string, string> {
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
  protected buildAddress(data: any): string {
    // Tạm thời trả về empty string vì không có thông tin địa chỉ chi tiết trong response
    return '';
  }

  // Kiểm tra dữ liệu kê khai có hợp lệ không
  protected isValidDeclarationData(data: any): boolean {
    if (!data) {
      console.log('Declaration data validation failed: No data');
      return false;
    }

    // Kiểm tra các trường bắt buộc - API trả về null khi không tìm thấy
    if (data.hoTen === null || data.hoTen === undefined || data.hoTen === '') {
      console.log('Declaration data validation failed: hoTen is null/empty', data.hoTen);
      return false;
    }

    if (data.maSoBHXH === null || data.maSoBHXH === undefined || data.maSoBHXH === '') {
      console.log('Declaration data validation failed: maSoBHXH is null/empty', data.maSoBHXH);
      return false;
    }

    // Kiểm tra số thẻ BHYT - trường quan trọng để xác định có thẻ hay không
    if (data.soTheBHYT === null || data.soTheBHYT === undefined || data.soTheBHYT === '') {
      console.log('Declaration data validation failed: soTheBHYT is null/empty', data.soTheBHYT);
      return false;
    }

    // Kiểm tra trạng thái thẻ
    if (data.moTa && (
      data.moTa.toLowerCase().includes('không có thẻ') ||
      data.moTa.toLowerCase().includes('không tìm thấy') ||
      data.moTa.toLowerCase().includes('không tồn tại')
    )) {
      console.log('Declaration data validation failed: Invalid card status', data.moTa);
      return false;
    }

    // Kiểm tra typeId - nếu là "GT" (Guest/Không tìm thấy) thì không hợp lệ
    if (data.typeId === 'GT') {
      console.log('Declaration data validation failed: typeId is GT (not found)', data.typeId);
      return false;
    }

    console.log('Declaration data validation passed', {
      hoTen: data.hoTen,
      maSoBHXH: data.maSoBHXH,
      soTheBHYT: data.soTheBHYT,
      typeId: data.typeId,
      moTa: data.moTa
    });
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

  // API tìm kiếm thông tin BHYT cho kê khai
  async lookupBhytForDeclaration(request: BhytDeclarationRequest): Promise<BhytDeclarationResponse> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinbhytforkekhai`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      console.log('BHYT Declaration API Response:', apiResponse); // Debug log

      // Kiểm tra response từ API
      if (apiResponse.success && apiResponse.data && this.isValidDeclarationData(apiResponse.data)) {
        // Convert API response to our format
        const declarationData: BhytDeclarationData = {
          maSoBhxh: apiResponse.data.maSoBHXH || request.maSoBHXH,
          hoTen: apiResponse.data.hoTen || '',
          ngaySinh: this.convertDateFormat(apiResponse.data.ngaySinh || ''),
          gioiTinh: apiResponse.data.gioiTinh === 1 ? 'Nam' : 'Nữ',
          diaChi: this.buildAddress(apiResponse.data),
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
          tyLeDong: '4.5',
          soTienDong: '',
          // Thêm mapping cho các trường còn thiếu
          quocTich: apiResponse.data.quocTich || 'VN',
          danToc: apiResponse.data.danToc || '',
          maTinhKS: apiResponse.data.maTinhKS || '',
          maHuyenKS: apiResponse.data.maHuyenKS || '',
          maXaKS: apiResponse.data.maXaKS || '',
          maTinhNkq: apiResponse.data.maTinhNkq || '',
          maHuyenNkq: apiResponse.data.maHuyenNkq || '',
          maXaNkq: apiResponse.data.maXaNkq || '',
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
          } else if (apiResponse.data.maSoBHXH === null || apiResponse.data.maSoBHXH === '') {
            errorMessage = 'Mã số BHXH không hợp lệ trong dữ liệu trả về';
          } else if (apiResponse.data.soTheBHYT === null || apiResponse.data.soTheBHYT === '') {
            errorMessage = 'Không có thẻ BHYT với mã số này trong hệ thống';
          } else if (apiResponse.data.moTa && apiResponse.data.moTa.toLowerCase().includes('không có thẻ')) {
            errorMessage = 'Không có thẻ BHYT với mã số này trong hệ thống';
          } else {
            errorMessage = 'Dữ liệu BHYT không đầy đủ hoặc không hợp lệ';
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

  // Mock function for BHYT Declaration API testing
  async mockLookupBhytForDeclaration(request: BhytDeclarationRequest): Promise<BhytDeclarationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock data based on the real API response you provided
    if (request.maSoBHXH === '0123456789') {
      const declarationData: BhytDeclarationData = {
        maSoBhxh: "0123456789",
        hoTen: "Trần Đình Liệu",
        ngaySinh: "1966-05-12", // Đã convert sang format YYYY-MM-DD
        gioiTinh: "Nam",
        diaChi: "",
        noiDangKyKCB: "Bệnh viện (Mã: 075)",
        trangThaiThe: "Thẻ hợp lệ",
        ngayHieuLuc: "01/01/2025",
        ngayHetHan: "31/12/2025",
        mucHuong: "80%",
        donViCongTac: "",
        maKV: "01",
        tenKV: "",
        soDienThoai: "0978060666",
        cmnd: "030066000049",
        soTheBHYT: "HC4010123456789",
        loaiDoiTuong: "HC",
        mucLuong: "0",
        tyLeDong: "4.5",
        soTienDong: "",
        // Thêm các trường mới từ response
        quocTich: "VN",
        danToc: "01",
        maTinhKS: "30",
        maHuyenKS: "288",
        maXaKS: "10516",
        maTinhNkq: "01",
        maHuyenNkq: "001",
        maXaNkq: "00028",
        noiNhanHoSo: "68",
        maBenhVien: "075",
        maHoGiaDinh: "3099313370",
        phuongAn: "ON",
        moTa: "Thẻ hợp lệ"
      };

      return {
        success: true,
        data: declarationData,
        message: 'Tra cứu thông tin BHYT cho kê khai thành công'
      };
    } else {
      return {
        success: false,
        message: 'Không tìm thấy thông tin BHYT cho kê khai với mã số này'
      };
    }
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

  // Override method để thêm debug cho API kê khai
  async lookupBhytForDeclaration(request: BhytDeclarationRequest): Promise<BhytDeclarationResponse> {
    try {
      const url = `${this.baseURL}/connect/tracuu/thongtinbhytforkekhai`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
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
