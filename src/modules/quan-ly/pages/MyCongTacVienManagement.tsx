import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Eye,
  UserCheck,
  RefreshCw,
  User,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';
import { VCongTacVienChiTiet } from '../../../shared/services/api/supabaseClient';
import { useAuth } from '../../auth';
import congTacVienService, { CongTacVienSearchParams } from '../services/congTacVienService';
import CongTacVienCreateModal from '../components/CongTacVienCreateModal';
import CongTacVienEditModal from '../components/CongTacVienEditModal';
import CongTacVienViewModal from '../components/CongTacVienViewModal';
import CongTacVienAccountModal from '../components/CongTacVienAccountModal';

const MyCongTacVienManagement: React.FC = () => {
  const { user } = useAuth();
  const [congTacVienList, setCongTacVienList] = useState<VCongTacVienChiTiet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<CongTacVienSearchParams>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedCongTacVien, setSelectedCongTacVien] = useState<VCongTacVienChiTiet | null>(null);

  // Load danh sách cộng tác viên của nhân viên thu hiện tại
  const loadMyCongTacVienList = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      // Lấy cộng tác viên của nhân viên thu hiện tại
      const data = await congTacVienService.getCongTacVienByNhanVienThu(user.id);
      setCongTacVienList(data);
    } catch (err) {
      console.error('Error loading my cong tac vien list:', err);
      setError('Không thể tải danh sách cộng tác viên của bạn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCongTacVienList();
  }, [user?.id]);

  // Handlers
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      loadMyCongTacVienList();
      return;
    }

    const filtered = congTacVienList.filter(ctv => 
      ctv.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctv.ma_ctv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ctv.email && ctv.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setCongTacVienList(filtered);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (congTacVien: VCongTacVienChiTiet) => {
    setSelectedCongTacVien(congTacVien);
    setShowEditModal(true);
  };

  const handleView = (congTacVien: VCongTacVienChiTiet) => {
    setSelectedCongTacVien(congTacVien);
    setShowViewModal(true);
  };

  const handleAccount = (congTacVien: VCongTacVienChiTiet) => {
    setSelectedCongTacVien(congTacVien);
    setShowAccountModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowAccountModal(false);
    setSelectedCongTacVien(null);
  };

  const handleCreateSuccess = () => {
    handleModalClose();
    loadMyCongTacVienList();
  };

  const handleEditSuccess = () => {
    handleModalClose();
    loadMyCongTacVienList();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      inactive: { label: 'Không hoạt động', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getAccountStatusBadge = (hasAccount: boolean) => {
    if (hasAccount) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Có tài khoản
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          Chưa có tài khoản
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cộng tác viên của tôi
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Quản lý danh sách cộng tác viên thuộc quyền quản lý của bạn
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm cộng tác viên
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã CTV, email..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={loadMyCongTacVienList}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Tổng cộng tác viên
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {congTacVienList.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Có tài khoản
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {congTacVienList.filter(ctv => ctv.nguoi_dung_id).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {congTacVienList.filter(ctv => ctv.trang_thai === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Đang tải...</p>
          </div>
        ) : congTacVienList.length === 0 ? (
          <div className="p-6 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Chưa có cộng tác viên</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Bắt đầu bằng cách thêm cộng tác viên mới.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm cộng tác viên
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thông tin cộng tác viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tài khoản
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {congTacVienList.map((congTacVien) => (
                  <tr key={congTacVien.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {congTacVien.ho_ten}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {congTacVien.ma_ctv}
                          </div>
                          {congTacVien.email && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {congTacVien.email}
                            </div>
                          )}
                          {congTacVien.so_dien_thoai && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {congTacVien.so_dien_thoai}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAccountStatusBadge(!!congTacVien.nguoi_dung_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(congTacVien.trang_thai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(congTacVien)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(congTacVien)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAccount(congTacVien)}
                          className={`${
                            congTacVien.nguoi_dung_id 
                              ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300' 
                              : 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                          }`}
                          title={congTacVien.nguoi_dung_id ? 'Xem tài khoản' : 'Tạo tài khoản'}
                        >
                          <UserCheck className="h-4 w-4" />
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
        <CongTacVienCreateModal
          onClose={handleModalClose}
          onSuccess={handleCreateSuccess}
          preSelectedNhanVienThuId={user?.id}
        />
      )}

      {showEditModal && selectedCongTacVien && (
        <CongTacVienEditModal
          congTacVien={selectedCongTacVien}
          onClose={handleModalClose}
          onSuccess={handleEditSuccess}
        />
      )}

      {showViewModal && selectedCongTacVien && (
        <CongTacVienViewModal
          congTacVien={selectedCongTacVien}
          onClose={handleModalClose}
        />
      )}

      {showAccountModal && selectedCongTacVien && (
        <CongTacVienAccountModal
          congTacVien={selectedCongTacVien}
          onClose={handleModalClose}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default MyCongTacVienManagement;
