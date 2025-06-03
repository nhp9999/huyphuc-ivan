import React from 'react';
import { 
  User, 
  Key, 
  FileText, 
  CreditCard, 
  Search, 
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const CongTacVienGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Hướng dẫn sử dụng cho Cộng tác viên</h1>
            <p className="text-blue-100 mt-1">
              Hướng dẫn chi tiết cách đăng nhập và sử dụng hệ thống kê khai
            </p>
          </div>
        </div>
      </div>

      {/* Thông tin quan trọng */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Thông tin quan trọng
            </h3>
            <div className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              <p>• Cộng tác viên sử dụng <strong>mã nhân viên của nhân viên thu quản lý</strong> khi thực hiện kê khai</p>
              <p>• Tất cả kê khai của cộng tác viên sẽ được ghi nhận dưới tên nhân viên thu quản lý</p>
              <p>• Cộng tác viên có quyền hạn tương tự nhân viên thu: kê khai, tra cứu, xem thanh toán</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bước 1: Nhận thông tin đăng nhập */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">1</span>
          </div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Nhận thông tin đăng nhập
          </h2>
        </div>
        
        <div className="ml-11 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nhân viên thu quản lý sẽ tạo tài khoản cho bạn và cung cấp thông tin đăng nhập:
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email đăng nhập:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">email@example.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu:</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">(do nhân viên thu cung cấp)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bước 2: Đăng nhập hệ thống */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2</span>
          </div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Đăng nhập hệ thống
          </h2>
        </div>
        
        <div className="ml-11 space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Truy cập trang đăng nhập của hệ thống</li>
            <li>Nhập email và mật khẩu được cung cấp</li>
            <li>Nhấn "Đăng nhập" để vào hệ thống</li>
            <li>Hệ thống sẽ tự động nhận diện bạn là cộng tác viên</li>
          </ol>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex">
              <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                <strong>Lưu ý:</strong> Lần đăng nhập đầu tiên, bạn nên đổi mật khẩu trong phần "Cài đặt"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bước 3: Sử dụng các chức năng */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">3</span>
          </div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Các chức năng có thể sử dụng
          </h2>
        </div>
        
        <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kê khai */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900 dark:text-white">Kê khai</h3>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Danh mục kê khai</li>
              <li>• Lịch sử kê khai</li>
              <li>• Tạo kê khai mới</li>
            </ul>
          </div>

          {/* Tra cứu */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Search className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900 dark:text-white">Tra cứu</h3>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Tra cứu BHYT</li>
              <li>• Tra cứu BHXH</li>
              <li>• Tra cứu mã BHXH</li>
              <li>• Tra cứu hộ gia đình</li>
            </ul>
          </div>

          {/* Thanh toán */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-gray-900 dark:text-white">Thanh toán</h3>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Xem thanh toán của tôi</li>
              <li>• Lịch sử thanh toán</li>
              <li>• Trạng thái thanh toán</li>
            </ul>
          </div>

          {/* Cài đặt */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900 dark:text-white">Cài đặt</h3>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Đổi mật khẩu</li>
              <li>• Cập nhật thông tin</li>
              <li>• Cài đặt giao diện</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lưu ý quan trọng */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Lưu ý quan trọng khi sử dụng
          </h2>
        </div>
        
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Về kê khai:</h4>
            <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
              <li>• Tất cả kê khai sẽ sử dụng mã nhân viên của nhân viên thu quản lý bạn</li>
              <li>• Kiểm tra kỹ thông tin trước khi submit kê khai</li>
              <li>• Lưu draft thường xuyên để tránh mất dữ liệu</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Về thanh toán:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Thanh toán sẽ được thực hiện dưới tên nhân viên thu quản lý</li>
              <li>• Bạn có thể xem lịch sử và trạng thái thanh toán</li>
              <li>• Liên hệ nhân viên thu nếu có vấn đề về thanh toán</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Bảo mật:</h4>
            <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
              <li>• Không chia sẻ thông tin đăng nhập với người khác</li>
              <li>• Đăng xuất sau khi sử dụng xong</li>
              <li>• Đổi mật khẩu định kỳ</li>
              <li>• Báo ngay cho nhân viên thu nếu có vấn đề bảo mật</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Liên hệ hỗ trợ */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Cần hỗ trợ?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Nếu bạn gặp khó khăn trong quá trình sử dụng, vui lòng liên hệ:
        </p>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Nhân viên thu quản lý:</strong> (Thông tin sẽ được hiển thị sau khi đăng nhập)
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Bộ phận kỹ thuật:</strong> support@company.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default CongTacVienGuide;
