import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  RefreshCw,
  Users,
  Building,
  Shield
} from 'lucide-react';
import { VNguoiDungPhanQuyen } from '../services/supabaseClient';
import nguoiDungService from '../services/nguoiDungService';

const PhanQuyenManagement: React.FC = () => {
  const [phanQuyenList, setPhanQuyenList] = useState<VNguoiDungPhanQuyen[]>([]);
  const [filteredPhanQuyenList, setFilteredPhanQuyenList] = useState<VNguoiDungPhanQuyen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [organizationTypeFilter, setOrganizationTypeFilter] = useState<string>('all');
  const [permissionLevelFilter, setPermissionLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [error, setError] = useState<string | null>(null);

  // Load dữ liệu phân quyền
  const loadPhanQuyenData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nguoiDungService.getNguoiDungPhanQuyen();
      setPhanQuyenList(data);
      setFilteredPhanQuyenList(data);
    } catch (err) {
      console.error('Error loading permissions:', err);
      setError('Không thể tải danh sách phân quyền. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhanQuyenData();
  }, []);

  // Filter dữ liệu
  useEffect(() => {
    let filtered = phanQuyenList;

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(phanQuyen =>
        phanQuyen.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phanQuyen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phanQuyen.ten_vai_tro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (phanQuyen.ten_cong_ty && phanQuyen.ten_cong_ty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (phanQuyen.ten_co_quan && phanQuyen.ten_co_quan.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter theo loại tổ chức
    if (organizationTypeFilter !== 'all') {
      filtered = filtered.filter(phanQuyen => phanQuyen.loai_to_chuc === organizationTypeFilter);
    }

    // Filter theo cấp độ quyền
    if (permissionLevelFilter !== 'all') {
      filtered = filtered.filter(phanQuyen => phanQuyen.cap_do_quyen === permissionLevelFilter);
    }

    // Filter theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(phanQuyen => phanQuyen.trang_thai_phan_quyen === statusFilter);
    }

    setFilteredPhanQuyenList(filtered);
  }, [phanQuyenList, searchTerm, organizationTypeFilter, permissionLevelFilter, statusFilter]);

  const getOrganizationTypeBadge = (type: string) => {
    switch (type) {
      case 'cong_ty':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Building className="w-3 h-3 mr-1" />
            Công ty
          </span>
        );
      case 'co_quan_bhxh':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Shield className="w-3 h-3 mr-1" />
            Cơ quan BHXH
          </span>
        );
      case 'he_thong':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Users className="w-3 h-3 mr-1" />
            Hệ thống
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

  const getPermissionLevelBadge = (level: string) => {
    switch (level) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Admin
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            User
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
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Hết hạn
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
            <UserCheck className="h-8 w-8 text-blue-600" />
            Phân quyền Hệ thống
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý phân quyền người dùng theo tổ chức và vai trò
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors gap-2">
          <Plus className="h-5 w-5" />
          Thêm phân quyền
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Organization Type Filter */}
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={organizationTypeFilter}
              onChange={(e) => setOrganizationTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả tổ chức</option>
              <option value="cong_ty">Công ty</option>
              <option value="co_quan_bhxh">Cơ quan BHXH</option>
              <option value="he_thong">Hệ thống</option>
            </select>
          </div>

          {/* Permission Level Filter */}
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={permissionLevelFilter}
              onChange={(e) => setPermissionLevelFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
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
              onClick={loadPhanQuyenData}
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
          Hiển thị {filteredPhanQuyenList.length} / {phanQuyenList.length} phân quyền
        </p>
      </div>

      {/* Permission List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredPhanQuyenList.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có phân quyền nào</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || organizationTypeFilter !== 'all' || permissionLevelFilter !== 'all' || statusFilter !== 'all'
                ? 'Không tìm thấy phân quyền nào phù hợp với bộ lọc.'
                : 'Bắt đầu bằng cách tạo phân quyền đầu tiên.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tổ chức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Loại tổ chức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cấp độ quyền
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
                {filteredPhanQuyenList.map((phanQuyen, index) => (
                  <tr key={`${phanQuyen.id}-${phanQuyen.loai_to_chuc}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {phanQuyen.ho_ten.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {phanQuyen.ho_ten}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {phanQuyen.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {phanQuyen.ten_vai_tro}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {phanQuyen.ten_cong_ty || phanQuyen.ten_co_quan || 'Toàn hệ thống'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOrganizationTypeBadge(phanQuyen.loai_to_chuc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPermissionLevelBadge(phanQuyen.cap_do_quyen)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(phanQuyen.trang_thai_phan_quyen)}
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

export default PhanQuyenManagement;
