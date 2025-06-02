import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  RefreshCw,
  Building
} from 'lucide-react';
import { VCoQuanBhxhChiTiet } from '../../../shared/services/api/supabaseClient';
import coQuanBhxhService from '../services/coQuanBhxhService';

const CoQuanBhxhManagement: React.FC = () => {
  const [coQuanList, setCoQuanList] = useState<VCoQuanBhxhChiTiet[]>([]);
  const [filteredCoQuanList, setFilteredCoQuanList] = useState<VCoQuanBhxhChiTiet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [capFilter, setCapFilter] = useState<'all' | 'trung_uong' | 'tinh' | 'huyen'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [error, setError] = useState<string | null>(null);

  // Load dữ liệu cơ quan BHXH
  const loadCoQuanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await coQuanBhxhService.getCoQuanBhxhChiTiet();
      setCoQuanList(data);
      setFilteredCoQuanList(data);
    } catch (err) {
      console.error('Error loading agencies:', err);
      setError('Không thể tải danh sách cơ quan BHXH. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoQuanData();
  }, []);

  // Filter dữ liệu
  useEffect(() => {
    let filtered = coQuanList;

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(coQuan =>
        coQuan.ma_co_quan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coQuan.ten_co_quan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coQuan.ten_co_quan_cha && coQuan.ten_co_quan_cha.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter theo cấp
    if (capFilter !== 'all') {
      filtered = filtered.filter(coQuan => coQuan.cap_co_quan === capFilter);
    }

    // Filter theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(coQuan => coQuan.trang_thai === statusFilter);
    }

    setFilteredCoQuanList(filtered);
  }, [coQuanList, searchTerm, capFilter, statusFilter]);

  const getCapBadge = (cap: string) => {
    switch (cap) {
      case 'trung_uong':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Trung ương
          </span>
        );
      case 'tinh':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Tỉnh/TP
          </span>
        );
      case 'huyen':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Quận/Huyện
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Không xác định
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Hoạt động
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Ngừng hoạt động
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Không xác định
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <RefreshCw className="animate-spin h-6 w-6 text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Quản lý Cơ quan BHXH
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thông tin các cơ quan Bảo hiểm Xã hội
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors gap-2">
          <Plus className="h-5 w-5" />
          Thêm cơ quan BHXH
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên cơ quan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Cap Filter */}
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={capFilter}
              onChange={(e) => setCapFilter(e.target.value as 'all' | 'trung_uong' | 'tinh' | 'huyen')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả cấp</option>
              <option value="trung_uong">Trung ương</option>
              <option value="tinh">Tỉnh/TP</option>
              <option value="huyen">Quận/Huyện</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={loadCoQuanData}
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2">
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hiển thị {filteredCoQuanList.length} / {coQuanList.length} cơ quan BHXH
        </p>
      </div>

      {/* Agency List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredCoQuanList.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có cơ quan BHXH nào</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || capFilter !== 'all' || statusFilter !== 'all'
                ? 'Không tìm thấy cơ quan BHXH nào phù hợp với bộ lọc.'
                : 'Bắt đầu bằng cách tạo cơ quan BHXH đầu tiên.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thông tin cơ quan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cấp độ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cơ quan cấp trên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCoQuanList.map((coQuan) => (
                  <tr key={coQuan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {coQuan.ten_co_quan}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Mã: {coQuan.ma_co_quan}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCapBadge(coQuan.cap_co_quan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {coQuan.ten_co_quan_cha || 'Không có'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {coQuan.so_dien_thoai || 'Chưa có'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {coQuan.email || 'Chưa có email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coQuan.trang_thai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoQuanBhxhManagement;

