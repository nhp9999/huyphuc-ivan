import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  RefreshCw,
  UserCheck,
  User,
  Mail,
  Phone,
  Skull
} from 'lucide-react';
import { VNguoiDungPhanQuyen, DmNguoiDung } from '../../../shared/services/api/supabaseClient';
import nguoiDungService from '../services/nguoiDungService';
import NguoiDungCreateModal from '../components/NguoiDungCreateModal';
import NguoiDungEditModal from '../components/NguoiDungEditModal';
import PhanQuyenCreateModal from '../components/PhanQuyenCreateModal';
import ConfirmDeleteModal from '../../../shared/components/ui/ConfirmDeleteModal';
import ConfirmHardDeleteModal from '../../../shared/components/ui/ConfirmHardDeleteModal';
import { useAuth } from '../../auth/contexts/AuthContext';

const NguoiDungManagement: React.FC = () => {
  const { user } = useAuth();
  const [nguoiDungList, setNguoiDungList] = useState<VNguoiDungPhanQuyen[]>([]);
  const [filteredNguoiDungList, setFilteredNguoiDungList] = useState<VNguoiDungPhanQuyen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHardDeleteModal, setShowHardDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<DmNguoiDung | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<VNguoiDungPhanQuyen | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hardDeleteLoading, setHardDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra xem user hiện tại có phải Super Admin không
  const isSuperAdmin = user?.currentOrganization?.permission_level === 'super_admin' ||
                       user?.organizations?.some(org => org.permission_level === 'super_admin');

  // Load dữ liệu người dùng
  const loadNguoiDungData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await nguoiDungService.getNguoiDungPhanQuyen();
      setNguoiDungList(data);
      setFilteredNguoiDungList(data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNguoiDungData();
  }, []);

  // Filter dữ liệu
  useEffect(() => {
    let filtered = nguoiDungList;

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(nguoiDung =>
        nguoiDung.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nguoiDung.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nguoiDung.so_dien_thoai && nguoiDung.so_dien_thoai.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter theo vai trò
    if (roleFilter !== 'all') {
      filtered = filtered.filter(nguoiDung => nguoiDung.ma_vai_tro === roleFilter);
    }

    // Filter theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(nguoiDung => nguoiDung.trang_thai_nguoi_dung === statusFilter);
    }

    setFilteredNguoiDungList(filtered);
  }, [nguoiDungList, searchTerm, roleFilter, statusFilter]);

  const getCapDoBadge = (capDo: string) => {
    switch (capDo) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
      case 'locked':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Bị khóa
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

  // Handlers
  const handleCreateSuccess = (userId?: number) => {
    setShowCreateModal(false);
    if (userId) {
      // Hiển thị modal phân quyền cho user vừa tạo
      setSelectedUserId(userId);
      setShowPermissionModal(true);
    } else {
      loadNguoiDungData();
    }
  };

  const handlePermissionSuccess = () => {
    setShowPermissionModal(false);
    setSelectedUserId(null);
    loadNguoiDungData();
  };

  const handleEdit = async (nguoiDung: VNguoiDungPhanQuyen) => {
    try {
      // Lấy thông tin chi tiết người dùng để edit
      const userDetail = await nguoiDungService.getNguoiDungById(nguoiDung.id);
      setSelectedUserForEdit(userDetail);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Không thể tải thông tin người dùng. Vui lòng thử lại.');
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedUserForEdit(null);
    loadNguoiDungData();
  };

  const handleDelete = (nguoiDung: VNguoiDungPhanQuyen) => {
    setSelectedUserForDelete(nguoiDung);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserForDelete) return;

    setDeleteLoading(true);
    try {
      await nguoiDungService.deleteNguoiDung(selectedUserForDelete.id, 'current_user');
      await loadNguoiDungData();
      setShowDeleteModal(false);
      setSelectedUserForDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Không thể xóa người dùng. Vui lòng thử lại.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedUserForDelete(null);
  };

  const handleHardDelete = (nguoiDung: VNguoiDungPhanQuyen) => {
    setSelectedUserForDelete(nguoiDung);
    setShowHardDeleteModal(true);
  };

  const handleConfirmHardDelete = async () => {
    if (!selectedUserForDelete) return;

    setHardDeleteLoading(true);
    try {
      await nguoiDungService.hardDeleteNguoiDung(selectedUserForDelete.id);
      await loadNguoiDungData();
      setShowHardDeleteModal(false);
      setSelectedUserForDelete(null);
    } catch (err) {
      console.error('Error hard deleting user:', err);
      setError('Không thể xóa vĩnh viễn người dùng. Vui lòng thử lại.');
    } finally {
      setHardDeleteLoading(false);
    }
  };

  const handleCancelHardDelete = () => {
    setShowHardDeleteModal(false);
    setSelectedUserForDelete(null);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowPermissionModal(false);
    setSelectedUserId(null);
    setSelectedUserForEdit(null);
  };

  // Lấy danh sách vai trò unique
  const uniqueRoles = Array.from(new Set(nguoiDungList.map(nd => nd.ma_vai_tro)));

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
            <Users className="h-8 w-8 text-blue-600" />
            Quản lý Người dùng
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thông tin người dùng và phân quyền trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors gap-2"
        >
          <Plus className="h-5 w-5" />
          Thêm người dùng
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
              placeholder="Tìm kiếm theo username, tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">Tất cả vai trò</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
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
              onClick={loadNguoiDungData}
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
          Hiển thị {filteredNguoiDungList.length} / {nguoiDungList.length} người dùng
        </p>
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredNguoiDungList.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có người dùng nào</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Không tìm thấy người dùng nào phù hợp với bộ lọc.'
                : 'Bắt đầu bằng cách tạo người dùng đầu tiên.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thông tin người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tổ chức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cấp độ
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
                {filteredNguoiDungList.map((nguoiDung) => (
                  <tr key={`${nguoiDung.id}-${nguoiDung.loai_to_chuc}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {nguoiDung.ho_ten.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {nguoiDung.ho_ten}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {nguoiDung.email}
                          </div>
                          {nguoiDung.so_dien_thoai && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {nguoiDung.so_dien_thoai}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {nguoiDung.ten_vai_tro}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {nguoiDung.ten_cong_ty || nguoiDung.ten_co_quan || 'Hệ thống'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {nguoiDung.loai_to_chuc === 'cong_ty' ? 'Công ty' : 
                         nguoiDung.loai_to_chuc === 'co_quan_bhxh' ? 'Cơ quan BHXH' : 'Hệ thống'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCapDoBadge(nguoiDung.cap_do_quyen)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(nguoiDung.trang_thai_nguoi_dung)}
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
                          onClick={() => handleEdit(nguoiDung)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(nguoiDung)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Xóa (Soft Delete)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {/* Hard Delete - Chỉ cho Super Admin */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleHardDelete(nguoiDung)}
                            className="text-red-800 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 p-1 rounded"
                            title="XÓA VĨNH VIỄN (Super Admin Only)"
                          >
                            <Skull className="h-4 w-4" />
                          </button>
                        )}
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
        <NguoiDungCreateModal
          onClose={handleModalClose}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && selectedUserForEdit && (
        <NguoiDungEditModal
          nguoiDung={selectedUserForEdit}
          onClose={handleModalClose}
          onSuccess={handleEditSuccess}
        />
      )}

      {showPermissionModal && selectedUserId && (
        <PhanQuyenCreateModal
          nguoiDungId={selectedUserId}
          onClose={handleModalClose}
          onSuccess={handlePermissionSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này?"
        itemName={selectedUserForDelete ? `${selectedUserForDelete.ho_ten} (${selectedUserForDelete.email})` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />

      {/* Hard Delete Confirmation Modal - Super Admin Only */}
      <ConfirmHardDeleteModal
        isOpen={showHardDeleteModal}
        title="XÓA VĨNH VIỄN NGƯỜI DÙNG"
        message="Bạn sắp XÓA VĨNH VIỄN người dùng này khỏi hệ thống. Tất cả dữ liệu sẽ bị mất hoàn toàn và KHÔNG THỂ KHÔI PHỤC."
        itemName={selectedUserForDelete ? `${selectedUserForDelete.ho_ten} (${selectedUserForDelete.email})` : ''}
        onConfirm={handleConfirmHardDelete}
        onCancel={handleCancelHardDelete}
        loading={hardDeleteLoading}
      />
    </div>
  );
};

export default NguoiDungManagement;


