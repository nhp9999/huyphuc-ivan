import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import {
  FileText,
  User,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  Save,
  Send,
  Printer,
  Download,
  X
} from 'lucide-react';

const CreateDeclaration: React.FC = () => {
  const { pageParams, setCurrentPage } = useNavigation();
  const [formData, setFormData] = useState({
    // Thông tin đại lý
    bienLaiDienTu: true,
    chonDonVi: '',
    chonDaiLy: 'BH01TGC - Dịch vụ thu BHYT Hà Ga Đình - thu tiền',

    // Nghiệp vụ
    doiTuongThamGia: 'GD - Hộ gia đình',
    hinhThucTinh: 'Ngân sách nhà nước hỗ trợ mức đóng',
    luongCoSo: '2,340,000',
    nguonDong: '',
    tuDong: '',

    // Form fields
    noiDangKyKCBBanDau: '',
    bienLaiNgayThamGia: '',
    soThang: '',
    ngay: '',
    tyLeNSNNHoTro: '',
    ghiChu: '',
    tongTien: '0'
  });

  const declarationCode = pageParams?.code || '603';
  const declarationName = pageParams?.name || 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT';

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving declaration:', formData);
    // Implement save logic
  };

  const handleSubmit = () => {
    console.log('Submitting declaration:', formData);
    // Implement submit logic
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting declaration:', formData);
    // Implement export logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo kê khai</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {declarationCode} - {declarationName}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Lưu C4S</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Import tờ khai</span>
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Thông tin đại lý Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin đại lý</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bienLaiDienTu"
                checked={formData.bienLaiDienTu}
                onChange={(e) => handleInputChange('bienLaiDienTu', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="bienLaiDienTu" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Biên lai điện tử
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn đại lý (*)
                </label>
                <select
                  value={formData.chonDaiLy}
                  onChange={(e) => handleInputChange('chonDaiLy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Điền thủ tục tại Hà Lội</option>
                  <option value="BH01TGC - Dịch vụ thu BHYT Hà Ga Đình - thu tiền">BH01TGC - Dịch vụ thu BHYT Hà Ga Đình - thu tiền</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn đơn vị
                </label>
                <select
                  value={formData.chonDonVi}
                  onChange={(e) => handleInputChange('chonDonVi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Chọn đơn vị</option>
                  <option value="donvi1">Đơn vị 1</option>
                  <option value="donvi2">Đơn vị 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Nghiệp vụ Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nghiệp vụ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Đối tượng tham gia
              </label>
              <input
                type="text"
                value={formData.doiTuongThamGia}
                onChange={(e) => handleInputChange('doiTuongThamGia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hình thức tính
              </label>
              <select
                value={formData.hinhThucTinh}
                onChange={(e) => handleInputChange('hinhThucTinh', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="Ngân sách nhà nước hỗ trợ mức đóng">Ngân sách nhà nước hỗ trợ mức đóng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lương cơ sở
              </label>
              <input
                type="text"
                value={formData.luongCoSo}
                onChange={(e) => handleInputChange('luongCoSo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nguồn đóng (*)
              </label>
              <input
                type="text"
                value={formData.nguonDong}
                onChange={(e) => handleInputChange('nguonDong', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tự động
              </label>
              <input
                type="text"
                value={formData.tuDong}
                onChange={(e) => handleInputChange('tuDong', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tổng tiền
              </label>
              <input
                type="text"
                value={formData.tongTien}
                onChange={(e) => handleInputChange('tongTien', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>


      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <div className="col-span-1">STT</div>
            <div className="col-span-1">Phương án</div>
            <div className="col-span-1">Họ và tên</div>
            <div className="col-span-1">Mã số BHXH</div>
            <div className="col-span-1">Ngày sinh</div>
            <div className="col-span-1">Giới tính</div>
            <div className="col-span-1">Nơi ĐK KCB ban đầu</div>
            <div className="col-span-1">Biên lai, ngày tham gia</div>
            <div className="col-span-1">Tiền lương trợ cấp hoặc số tiền đóng</div>
            <div className="col-span-1">Tỷ lệ NSNN hỗ trợ (%)</div>
            <div className="col-span-1">Thời hạn sử dụng thẻ</div>
            <div className="col-span-1">Ghi chú</div>
          </div>
        </div>

        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Không có dữ liệu</p>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>Ghi Nhận</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Thoát</span>
        </button>
      </div>
    </div>
  );
};

export default CreateDeclaration;
