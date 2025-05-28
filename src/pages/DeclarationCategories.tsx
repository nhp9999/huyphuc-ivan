import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { Search, FileText, Eye, Download, Filter } from 'lucide-react';

interface DeclarationCategory {
  stt: number;
  kyHieu: string;
  ma: string;
  ten: string;
  linhVuc: number;
}

const DeclarationCategories: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<DeclarationCategory[]>([]);

  // Sample data based on the image
  const declarationData: DeclarationCategory[] = [
    {
      stt: 1,
      kyHieu: '602',
      ma: '602',
      ten: 'Đăng ký, đăng ký lại bảo gồm cả đăng ký cho thể nhân chưa đóng, điều chỉnh phương thức đóng, cần cứ đóng BHXH tự nguyện',
      linhVuc: 1
    },
    {
      stt: 2,
      kyHieu: '603',
      ma: '603',
      ten: 'Đăng ký đóng BHYT đối với người chỉ tham gia BHYT',
      linhVuc: 1
    },
    {
      stt: 3,
      kyHieu: '607',
      ma: '607',
      ten: 'Cấp lại số BHXH khi bị thay đổi thông tin',
      linhVuc: 2
    },
    {
      stt: 4,
      kyHieu: '608',
      ma: '608',
      ten: 'Cấp lại số BHXH do thay đổi thông tin',
      linhVuc: 2
    },
    {
      stt: 5,
      kyHieu: '610',
      ma: '610',
      ten: 'Cấp lại, đổi thẻ BHYT do thay đổi thông tin về nhân thân, mã số bảo hiểm, mã nghề nghiệp, mã nơi đăng ký khám chữa bệnh',
      linhVuc: 2
    },
    {
      stt: 6,
      kyHieu: '612',
      ma: '612',
      ten: 'Cấp lại, đổi thẻ BHYT do mất, hỏng không thay đổi thông tin',
      linhVuc: 2
    },
    {
      stt: 7,
      kyHieu: '613',
      ma: '613',
      ten: 'Cấp lại, đổi thẻ BHYT do thay đổi thời điểm đủ 05 năm liên tục, mã nơi làm việc',
      linhVuc: 1
    },
    {
      stt: 8,
      kyHieu: '602a',
      ma: '602a',
      ten: 'Hoàn trả tiền đã đóng đối với người tham gia BHXH tự nguyện',
      linhVuc: 2
    },
    {
      stt: 9,
      kyHieu: '606a',
      ma: '606a',
      ten: 'Hoàn trả tiền đã đóng đối với người tham gia BHYT theo hộ gia đình, người tham gia BHYT đúng ngạn sách nhà nước bổ trợ mức đóng do đóng trùng',
      linhVuc: 2
    },
    {
      stt: 10,
      kyHieu: '608b',
      ma: '608b',
      ten: 'Hoàn trả tiền đã đóng đối với người tham gia BHYT theo hộ gia đình, người tham gia BHYT đúng ngạn sách nhà nước bổ trợ mức đóng do đóng để chế',
      linhVuc: 2
    }
  ];

  React.useEffect(() => {
    setFilteredData(declarationData);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData(declarationData);
      return;
    }

    const filtered = declarationData.filter(item =>
      item.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kyHieu.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDeclarationClick = (item: DeclarationCategory) => {
    setCurrentPage('create-declaration', {
      code: item.kyHieu,
      name: item.ten,
      ma: item.ma
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Danh mục thủ tục</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Danh sách các thủ tục kê khai bảo hiểm xã hội và y tế
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thủ tục
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mã tên"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Tra Cứu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="col-span-1">STT</div>
            <div className="col-span-1">Ký hiệu</div>
            <div className="col-span-1">Mã</div>
            <div className="col-span-7">Tên</div>
            <div className="col-span-2 text-center">Lĩnh vực</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy thủ tục nào phù hợp</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.stt}
                onClick={() => handleDeclarationClick(item)}
                className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 cursor-pointer group"
              >
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-1 text-sm text-gray-900 dark:text-white font-medium">
                    {item.stt}
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                        <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                        {item.kyHieu}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 text-sm text-gray-900 dark:text-white">
                    {item.ma}
                  </div>
                  <div className="col-span-7 text-sm text-gray-900 dark:text-white">
                    {item.ten}
                  </div>
                  <div className="col-span-2 text-sm text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                      item.linhVuc === 1
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                    }`}>
                      {item.linhVuc}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Tổng số dòng: <span className="text-blue-600 dark:text-blue-400">{filteredData.length}</span></span>
              <span className="text-gray-400">|</span>
              <span>Hiển thị: <span className="text-blue-600 dark:text-blue-400">{filteredData.length}</span> kết quả</span>
            </div>
            {searchTerm && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full">
                Đang lọc: "{searchTerm}"
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Hướng dẫn sử dụng
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• <strong>Tìm kiếm:</strong> Nhập mã hoặc tên thủ tục để tìm kiếm nhanh</li>
          <li>• <strong>Linh vực:</strong> 1 - Đăng ký, 2 - Cấp lại/Đổi thẻ</li>
          <li>• <strong>Ký hiệu:</strong> Mã định danh duy nhất của từng thủ tục</li>
          <li>• Danh mục được cập nhật theo quy định mới nhất của Bảo hiểm Xã hội Việt Nam</li>
        </ul>
      </div>
    </div>
  );
};

export default DeclarationCategories;
