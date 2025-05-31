import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { DmCongTy } from '../services/supabaseClient';
import congTyService from '../services/congTyService';
import CongTyCreateModal from '../components/CongTyCreateModal';
import CongTyEditModal from '../components/CongTyEditModal';
import CongTyViewModal from '../components/CongTyViewModal';

const CongTyManagement: React.FC = () => {
  const [congTyList, setCongTyList] = useState<DmCongTy[]>([]);
  const [filteredCongTyList, setFilteredCongTyList] = useState<DmCongTy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCongTy, setSelectedCongTy] = useState<DmCongTy | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load dữ liệu công ty
  const loadCongTyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await congTyService.getAllCongTy();
      setCongTyList(data);
      setFilteredCongTyList(data);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError('Không thể tải danh sách công ty. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCongTyData();
  }, []);

  // Filter dữ liệu
  useEffect(() => {
    let filtered = congTyList;

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(congTy =>
        congTy.ma_cong_ty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        congTy.ten_cong_ty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (congTy.ma_so_thue && congTy.ma_so_thue.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(congTy => congTy.trang_thai === statusFilter);
    }

    setFilteredCongTyList(filtered);
  }, [congTyList, searchTerm, statusFilter]);

  // Handlers
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (congTy: DmCongTy) => {
    setSelectedCongTy(congTy);
    setShowEditModal(true);
  };

  const handleView = (congTy: DmCongTy) => {
    setSelectedCongTy(congTy);
    setShowViewModal(true);
  };

  const handleDelete = async (congTy: DmCongTy) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa công ty "${congTy.ten_cong_ty}"?`)) {
      try {
        await congTyService.deleteCongTy(congTy.id, 'current_user');
        await loadCongTyData();
      } catch (err) {
        console.error('Error deleting company:', err);
        setError('Không thể xóa công ty. Vui lòng thử lại.');
      }
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadCongTyData();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedCongTy(null);
    loadCongTyData();
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedCongTy(null);
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
            <Building2 className="h-8 w-8 text-blue-600" />
            Quản lý Công ty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thông tin các công ty trong hệ thống
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors gap-2"
        >
          <Plus className="h-5 w-5" />
          Thêm công ty
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên công ty, mã số thuế..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
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
              onClick={loadCongTyData}
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
          Hiển thị {filteredCongTyList.length} / {congTyList.length} công ty
        </p>
      </div>

      {/* Company List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredCongTyList.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có công ty nào</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Không tìm thấy công ty nào phù hợp với bộ lọc.'
                : 'Bắt đầu bằng cách tạo công ty đầu tiên.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thông tin công ty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCongTyList.map((congTy) => (
                  <tr key={congTy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {congTy.ten_cong_ty}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Mã: {congTy.ma_cong_ty}
                        </div>
                        {congTy.ma_so_thue && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            MST: {congTy.ma_so_thue}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {congTy.so_dien_thoai || 'Chưa có'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {congTy.email || 'Chưa có email'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(congTy.trang_thai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(congTy.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(congTy)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(congTy)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(congTy)}
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

      {/* Modals */}
      {showCreateModal && (
        <CongTyCreateModal
          onClose={handleModalClose}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && selectedCongTy && (
        <CongTyEditModal
          congTy={selectedCongTy}
          onClose={handleModalClose}
          onSuccess={handleEditSuccess}
        />
      )}

      {showViewModal && selectedCongTy && (
        <CongTyViewModal
          congTy={selectedCongTy}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default CongTyManagement;
