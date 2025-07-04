import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../../core/contexts/NavigationContext';
import { Search, FileText, Eye, Download, Filter, RefreshCw, AlertCircle, EyeOff } from 'lucide-react';
import { danhMucThuTucService, ThuTucSearchParams } from '../services/danhMucThuTucService';
import { DanhMucThuTuc } from '../../../shared/services/api/supabaseClient';
import Toast from '../../../shared/components/ui/Toast';

interface DeclarationCategory {
  stt: number;
  kyHieu: string;
  ma: string;
  ten: string;
  linhVuc: number;
  moTa?: string;
  trangThai: string;
}

const DeclarationCategories: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<DeclarationCategory[]>([]);
  const [allData, setAllData] = useState<DeclarationCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLinhVuc, setSelectedLinhVuc] = useState<number | null>(null);
  const [linhVucOptions, setLinhVucOptions] = useState<{ value: number; label: string }[]>([]);

  const [showOnlyDeveloped, setShowOnlyDeveloped] = useState<boolean>(() => {
    // Load từ localStorage, mặc định là true (chỉ hiển thị thủ tục đã phát triển)
    const saved = localStorage.getItem('showOnlyDevelopedProcedures');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // State cho toast notification
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'warning' as 'success' | 'error' | 'warning' | 'info'
  });

  // Helper function để hiển thị toast
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'warning') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Convert Supabase data to component format
  const convertToDeclarationCategory = (data: DanhMucThuTuc[]): DeclarationCategory[] => {
    return data.map(item => ({
      stt: item.stt,
      kyHieu: item.ky_hieu,
      ma: item.ma,
      ten: item.ten,
      linhVuc: item.linh_vuc,
      moTa: item.mo_ta,
      trangThai: item.trang_thai
    }));
  };

  // Load data from Supabase
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams: ThuTucSearchParams = {
        showOnlyDeveloped: showOnlyDeveloped // true = chỉ lấy 'active', false = lấy tất cả
      };

      const [thuTucData, linhVucData] = await Promise.all([
        danhMucThuTucService.searchThuTuc(searchParams), // Sử dụng searchThuTuc thay vì getAllThuTuc
        danhMucThuTucService.getLinhVucList()
      ]);

      const convertedData = convertToDeclarationCategory(thuTucData);
      setAllData(convertedData);
      setFilteredData(convertedData);
      setLinhVucOptions(linhVucData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when showOnlyDeveloped changes
  useEffect(() => {
    if (allData.length > 0) { // Chỉ reload nếu đã có dữ liệu
      loadData();
    }
  }, [showOnlyDeveloped]);

  // Toggle function để ẩn hiện thủ tục chưa phát triển
  const handleToggleDeveloped = () => {
    const newValue = !showOnlyDeveloped;
    setShowOnlyDeveloped(newValue);
    localStorage.setItem('showOnlyDevelopedProcedures', JSON.stringify(newValue));

    // Tự động tìm kiếm lại với filter mới
    handleSearch();
  };

  // Search and filter functions
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams: ThuTucSearchParams = {
        searchTerm: searchTerm.trim() || undefined,
        linhVuc: selectedLinhVuc || undefined,
        showOnlyDeveloped: showOnlyDeveloped // true = chỉ lấy 'active', false = lấy tất cả
      };

      const results = await danhMucThuTucService.searchThuTuc(searchParams);
      const convertedData = convertToDeclarationCategory(results);
      setFilteredData(convertedData);
    } catch (err) {
      console.error('Error searching:', err);
      setError('Lỗi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLinhVucChange = (linhVuc: number | null) => {
    setSelectedLinhVuc(linhVuc);
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedLinhVuc(null);
    loadData();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedLinhVuc(null);
    setFilteredData(allData);
  };

  const handleDeclarationClick = (item: DeclarationCategory) => {
    // Chỉ cho phép click vào thủ tục đã phát triển (active)
    if (item.trangThai === 'active') {
      if (item.kyHieu === '603') {
        setCurrentPage('ke-khai-603', {
          code: item.kyHieu,
          name: item.ten,
          ma: item.ma
        });
      } else {
        // Có thể thêm logic để chuyển đến các trang kê khai khác đã phát triển
        showToast(`Thủ tục "${item.kyHieu} - ${item.ten}" đã sẵn sàng nhưng chưa được tích hợp.`, 'info');
      }
    } else {
      // Hiển thị thông báo cho các thủ tục chưa được phát triển
      const statusText = item.trangThai === 'draft' ? 'đang phát triển' : 'chưa phát triển';
      console.log(`Clicked on ${statusText} procedure: ${item.kyHieu} - ${item.ten}`);
      showToast(`Thủ tục "${item.kyHieu} - ${item.ten}" ${statusText === 'đang phát triển' ? 'đang được phát triển' : 'sẽ được hỗ trợ trong phiên bản tiếp theo'}.`, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Danh mục thủ tục</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các thủ tục kê khai bảo hiểm xã hội và y tế
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleDeveloped}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showOnlyDeveloped
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {showOnlyDeveloped ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showOnlyDeveloped ? 'Chỉ hiện sẵn sàng' : 'Hiện tất cả'}</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm thủ tục
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập mã hoặc tên thủ tục..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="linhvuc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lĩnh vực
            </label>
            <select
              id="linhvuc"
              value={selectedLinhVuc || ''}
              onChange={(e) => handleLinhVucChange(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
            >
              <option value="">Tất cả lĩnh vực</option>
              {linhVucOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors min-h-[48px]"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? 'Đang tìm...' : 'Tìm kiếm'}</span>
            </button>
            <button
              onClick={handleClearSearch}
              className="flex items-center justify-center space-x-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[48px]"
            >
              <Filter className="w-4 h-4" />
              <span>Xóa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Desktop Table Header - Hidden on mobile */}
        <div className="hidden md:block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="col-span-1">STT</div>
            <div className="col-span-2">Ký hiệu</div>
            <div className="col-span-1">Mã</div>
            <div className="col-span-6">Tên</div>
            <div className="col-span-2 text-center">Lĩnh vực</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="px-4 md:px-6 py-12 text-center">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="px-4 md:px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy thủ tục nào phù hợp</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.stt}
                onClick={() => handleDeclarationClick(item)}
                className={`transition-all duration-200 group ${
                  item.trangThai === 'active'
                    ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 cursor-pointer'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer opacity-60'
                }`}
              >
                {/* Desktop Layout */}
                <div className="hidden md:block px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-1 text-sm text-gray-900 dark:text-white font-medium">
                      {item.stt}
                    </div>
                    <div className="col-span-2">
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
                    <div className="col-span-6 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <span>{item.ten}</span>
                        {item.trangThai === 'active' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            Sẵn sàng
                          </span>
                        ) : item.trangThai === 'draft' ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                            Đang phát triển
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400">
                            Chưa phát triển
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.linhVuc === 1
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : item.linhVuc === 2
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                          : item.linhVuc === 3
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                      }`}>
                        {danhMucThuTucService.getLinhVucLabel(item.linhVuc)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden p-4 space-y-3">
                  {/* Header with STT and Field */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {item.stt}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                          <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {item.kyHieu}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.linhVuc === 1
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : item.linhVuc === 2
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                        : item.linhVuc === 3
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                    }`}>
                      {danhMucThuTucService.getLinhVucLabel(item.linhVuc)}
                    </span>
                  </div>

                  {/* Code */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-0">Mã:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{item.ma}</span>
                  </div>

                  {/* Procedure Name */}
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tên thủ tục:</span>
                    <div className="flex items-start space-x-2">
                      <p className="text-sm text-gray-900 dark:text-white leading-relaxed flex-1">
                        {item.ten}
                      </p>
                      {item.trangThai === 'active' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 flex-shrink-0">
                          Sẵn sàng
                        </span>
                      ) : item.trangThai === 'draft' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 flex-shrink-0">
                          Đang phát triển
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 flex-shrink-0">
                          Chưa phát triển
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Field Label */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Lĩnh vực: {danhMucThuTucService.getLinhVucLabel(item.linhVuc)}
                    </span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="font-medium">Tổng số dòng: <span className="text-blue-600 dark:text-blue-400">{filteredData.length}</span></span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span>Hiển thị: <span className="text-blue-600 dark:text-blue-400">{filteredData.length}</span> kết quả</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1.5 rounded-full">
                  Từ khóa: "{searchTerm}"
                </span>
              )}
              {selectedLinhVuc && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1.5 rounded-full">
                  Lĩnh vực: {danhMucThuTucService.getLinhVucLabel(selectedLinhVuc)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default DeclarationCategories;
