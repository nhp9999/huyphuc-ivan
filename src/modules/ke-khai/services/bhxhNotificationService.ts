// Interface cho response từ API BHXH
interface BhxhNotificationResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

// Interface cho response thực tế từ API BHXH
interface BhxhApiResponse {
  status: string;
  msg: string;
  data?: any;
}

// Service để gọi API thông báo BHXH
class BhxhNotificationService {
  private readonly baseUrl = 'https://dichvucong.baohiemxahoi.gov.vn';

  // Token và headers mặc định
  private readonly defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/json',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'Access-Control-Allow-Origin': '*',
    'X-CLIENT': 'U2FsdGVkX1/S+muWkU4UTOvj87OZ58DCa+kaj/pWdC8tDPFf99Ag6pRxOwfvEjBsIWDu33H9S+bArTukO6DdwHk33sHDV/qW50/O29ANLsqdrAxI7kuEaIbMhwTwLd/E',
    'Origin': 'https://dichvucong.baohiemxahoi.gov.vn',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://dichvucong.baohiemxahoi.gov.vn/',
    'Accept-Language': 'en-US,en;q=0.9'
  };

  // Token Bearer - cần cập nhật khi hết hạn
  private bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMTYwMjE4NzY3OCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6InVzZXIiLCJzdWIiOiIxNjAyMTg3Njc4IiwiaXNfcHVibGljIjoiMCIsImlzX2FkbWluIjoiMCIsImNsaWVudF9pZCI6IllXWTBOakl3TXpZdE1UazFNeTAwTnpsaExXSXhaRGt0Tm1VMU5HUXhOVGN5TUdFNExUWXpPRGMzTmpRek16ZzNORFkyTmprNU1RPT0iLCJ2bmNvbm5lY3QiOiIwIiwibG9haWRvaXR1b25nIjoiMSIsImV4cCI6MTc0OTY5NzQ1MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIn0.1v6SnDwv8jpxVx1NeeLONtwI84TooA_0mbfMIT9kDT0';

  // Gọi API để lấy thông báo BHXH theo số hồ sơ
  async getNotificationByHoSo(soHoSo: string): Promise<BhxhNotificationResponse> {
    try {
      console.log('🔔 Getting BHXH notification for ho so:', soHoSo);

      if (!soHoSo || soHoSo.trim() === '') {
        return {
          success: false,
          message: 'Số hồ sơ không hợp lệ'
        };
      }

      const response = await fetch(`${this.baseUrl}/GetValues`, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          'Authorization': `Bearer ${this.bearerToken}`
        },
        body: JSON.stringify({
          code: "176",
          data: {
            soHoSo: soHoSo.trim()
          }
        })
      });

      if (!response.ok) {
        console.error('BHXH API response not ok:', response.status, response.statusText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const apiResponse: BhxhApiResponse = await response.json();
      console.log('🔔 BHXH API response:', apiResponse);

      // Parse response từ API BHXH
      const isSuccess = apiResponse.status === 'success';

      return {
        success: isSuccess,
        data: apiResponse,
        message: apiResponse.msg,
        error: isSuccess ? undefined : apiResponse.msg
      };

    } catch (error) {
      console.error('Error calling BHXH notification API:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      };
    }
  }

  // Gọi API cho nhiều số hồ sơ cùng lúc
  async getNotificationsForMultipleHoSo(soHoSoList: string[]): Promise<Record<string, BhxhNotificationResponse>> {
    const results: Record<string, BhxhNotificationResponse> = {};
    
    // Gọi API tuần tự để tránh quá tải server
    for (const soHoSo of soHoSoList) {
      if (soHoSo && soHoSo.trim() !== '') {
        try {
          results[soHoSo] = await this.getNotificationByHoSo(soHoSo);
          // Delay nhỏ giữa các request để tránh rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Error getting notification for ${soHoSo}:`, error);
          results[soHoSo] = {
            success: false,
            error: 'Lỗi khi gọi API'
          };
        }
      }
    }

    return results;
  }

  // Cập nhật Bearer token khi cần
  updateBearerToken(newToken: string) {
    this.bearerToken = newToken;
    console.log('🔑 Updated BHXH Bearer token');
  }

  // Format thông báo để hiển thị
  formatNotificationMessage(response: BhxhNotificationResponse): string {
    // Ưu tiên hiển thị message từ response
    if (response.message) {
      return response.message;
    }

    if (!response.success) {
      return response.error || 'Lỗi không xác định';
    }

    if (!response.data) {
      return 'Không có dữ liệu';
    }

    // Nếu data là BhxhApiResponse, lấy msg
    if (response.data.msg) {
      return response.data.msg;
    }

    // Fallback cho các trường hợp khác
    if (typeof response.data === 'string') {
      return response.data;
    }

    if (response.data.message) {
      return response.data.message;
    }

    if (response.data.thongBao) {
      return response.data.thongBao;
    }

    return JSON.stringify(response.data);
  }

  // Kiểm tra trạng thái thông báo
  getNotificationStatus(response: BhxhNotificationResponse): 'success' | 'warning' | 'error' | 'info' {
    // Kiểm tra status từ API trước
    if (response.data && response.data.status) {
      const apiStatus = response.data.status.toLowerCase();
      if (apiStatus === 'success') {
        // Kiểm tra nội dung message để xác định trạng thái cụ thể
        const message = this.formatNotificationMessage(response).toLowerCase();

        if (message.includes('đang xử lý') || message.includes('chờ') || message.includes('pending')) {
          return 'warning';
        }

        if (message.includes('thành công') || message.includes('đã duyệt') || message.includes('hoàn thành') || message.includes('đã hoàn thành')) {
          return 'success';
        }

        // Mặc định cho status success nhưng đang xử lý
        return 'warning';
      }

      if (apiStatus === 'error' || apiStatus === 'failed') {
        return 'error';
      }
    }

    if (!response.success) {
      return 'error';
    }

    if (!response.data) {
      return 'warning';
    }

    // Logic để xác định trạng thái dựa trên nội dung thông báo
    const message = this.formatNotificationMessage(response).toLowerCase();

    if (message.includes('thành công') || message.includes('đã duyệt') || message.includes('hoàn thành') || message.includes('đã hoàn thành')) {
      return 'success';
    }

    if (message.includes('chờ') || message.includes('đang xử lý') || message.includes('pending') || message.includes('xử lý')) {
      return 'warning';
    }

    if (message.includes('lỗi') || message.includes('từ chối') || message.includes('thất bại') || message.includes('không tìm thấy')) {
      return 'error';
    }

    return 'info';
  }
}

// Export singleton instance
const bhxhNotificationService = new BhxhNotificationService();
export default bhxhNotificationService;
