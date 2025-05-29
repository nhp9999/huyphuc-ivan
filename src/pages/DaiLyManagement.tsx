import React, { useState, useEffect } from 'react';
import { Search, Users, RefreshCw, AlertCircle, Filter, Eye, Edit, Trash2, Plus, X } from 'lucide-react';
import { daiLyService, DaiLySearchParams } from '../services/daiLyService';
import { VDaiLyChiTiet } from '../services/supabaseClient';
import DaiLyEditModal from '../components/DaiLyEditModal';
import DaiLyCreateModal from '../components/DaiLyCreateModal';

const DaiLyManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<VDaiLyChiTiet[]>([]);
  const [allData, setAllData] = useState<VDaiLyChiTiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCap, setSelectedCap] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [maTinhOptions, setMaTinhOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedMaTinh, setSelectedMaTinh] = useState<string>('');
  const [capStatistics, setCapStatistics] = useState<{ cap: number; so_luong: number; ten_cap: string }[]>([]);
  const [typeStatistics, setTypeStatistics] = useState<{ type: number; so_luong: number; loai_dai_ly: string }[]>([]);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDaiLy, setSelectedDaiLy] = useState<VDaiLyChiTiet | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingDaiLy, setDeletingDaiLy] = useState<VDaiLyChiTiet | null>(null);

  // Load data from Supabase
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [daiLyData, maTinhData, capStats, typeStats] = await Promise.all([
        daiLyService.getAllDaiLy(),
        daiLyService.getMaTinhList(),
        daiLyService.getThongKeTheoCap(),
        daiLyService.getThongKeTheoLoai()
      ]);

      setAllData(daiLyData);
      setFilteredData(daiLyData);
      setMaTinhOptions(maTinhData);
      setCapStatistics(capStats);
      setTypeStatistics(typeStats);
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

  // Search and filter functions
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams: DaiLySearchParams = {
        searchTerm: searchTerm.trim() || undefined,
        cap: selectedCap || undefined,
        type: selectedType || undefined,
        maTinh: selectedMaTinh || undefined
      };

      const results = await daiLyService.searchDaiLy(searchParams);
      setFilteredData(results);
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

  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedCap(null);
    setSelectedType(null);
    setSelectedMaTinh('');
    loadData();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCap(null);
    setSelectedType(null);
    setSelectedMaTinh('');
    setFilteredData(allData);
  };

  // Handle edit
  const handleEdit = (daiLy: VDaiLyChiTiet) => {
    setSelectedDaiLy(daiLy);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedDaiLy(null);
  };

  const handleEditSave = () => {
    loadData(); // Reload data after save
  };

  // Handle create
  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSave = () => {
    loadData(); // Reload data after save
  };

  // Handle delete
  const handleDelete = (daiLy: VDaiLyChiTiet) => {
    setDeletingDaiLy(daiLy);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDaiLy) return;

    setLoading(true);
    try {
      await daiLyService.deleteDaiLy(deletingDaiLy.id);
      setIsDeleteConfirmOpen(false);
      setDeletingDaiLy(null);
      loadData(); // Reload data after delete
    } catch (err) {
      console.error('Error deleting dai ly:', err);
      setError('Có lỗi xảy ra khi xóa đại lý. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingDaiLy(null);
  };

  const getCapBadgeColor = (cap: number | null) => {
    switch (cap) {
      case 1: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 2: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 3: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeBadgeColor = (type: number | null) => {
    switch (type) {
      case 1: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 3: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 4: return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý đại lý</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các đại lý thu BHXH và BHYT
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đại lý</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng đại lý</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{allData.length}</p>
            </div>
          </div>
        </div>

        {capStatistics.slice(0, 3).map((stat) => (
          <div key={stat.cap} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCapBadgeColor(stat.cap)}`}>
                <span className="text-sm font-bold">{stat.cap}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.ten_cap}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.so_luong}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Term */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tìm theo mã hoặc tên đại lý..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Cấp Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cấp
            </label>
            <select
              value={selectedCap || ''}
              onChange={(e) => setSelectedCap(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tất cả cấp</option>
              <option value="1">Cấp tỉnh</option>
              <option value="2">Cấp huyện</option>
              <option value="3">Cấp xã</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại
            </label>
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tất cả loại</option>
              <option value="1">Điểm thu cấp tỉnh</option>
              <option value="2">Điểm thu cấp huyện</option>
              <option value="3">Điểm thu cấp xã</option>
              <option value="4">Đại lý cá nhân</option>
            </select>
          </div>

          {/* Ma Tinh Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã tỉnh
            </label>
            <select
              value={selectedMaTinh}
              onChange={(e) => setSelectedMaTinh(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tất cả tỉnh</option>
              {maTinhOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
            <button
              onClick={handleClearSearch}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {filteredData.length} / {allData.length} đại lý
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden md:block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Mã đại lý</div>
            <div className="col-span-3">Tên đại lý</div>
            <div className="col-span-1">Cấp</div>
            <div className="col-span-2">Loại</div>
            <div className="col-span-1">Mã tỉnh</div>
            <div className="col-span-1">Đại lý cha</div>
            <div className="col-span-1 text-center">Hành động</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Không tìm thấy đại lý nào</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            </div>
          ) : (
            filteredData.map((daiLy) => (
              <div key={daiLy.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {/* Desktop Row */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {daiLy.id}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {daiLy.ma}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {daiLy.ten}
                      </p>
                      {daiLy.has_children && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mt-1">
                          Có đại lý con
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {daiLy.cap && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCapBadgeColor(daiLy.cap)}`}>
                        {daiLy.ten_cap}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {daiLy.type && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(daiLy.type)}`}>
                        {daiLy.loai_dai_ly}
                      </span>
                    )}
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {daiLy.ma_tinh || '-'}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {daiLy.ten_cha ? `${daiLy.ma_cha}` : '-'}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(daiLy)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(daiLy)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {daiLy.ma}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(daiLy)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(daiLy)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {daiLy.ten}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {daiLy.cap && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCapBadgeColor(daiLy.cap)}`}>
                        {daiLy.ten_cap}
                      </span>
                    )}
                    {daiLy.type && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(daiLy.type)}`}>
                        {daiLy.loai_dai_ly}
                      </span>
                    )}
                    {daiLy.has_children && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Có đại lý con
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>Mã tỉnh: {daiLy.ma_tinh || '-'}</p>
                    {daiLy.ten_cha && <p>Đại lý cha: {daiLy.ma_cha} - {daiLy.ten_cha}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Hướng dẫn sử dụng</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Tìm kiếm:</strong> Nhập mã hoặc tên đại lý để tìm kiếm</li>
          <li>• <strong>Lọc:</strong> Sử dụng các bộ lọc theo cấp, loại, mã tỉnh</li>
          <li>• <strong>Tạo mới:</strong> Click nút "Tạo đại lý" để thêm đại lý mới</li>
          <li>• <strong>Chỉnh sửa:</strong> Click vào icon bút chì để chỉnh sửa thông tin</li>
          <li>• <strong>Xóa:</strong> Click vào icon thùng rác để xóa đại lý (xóa mềm)</li>
          <li>• <strong>Làm mới:</strong> Tải lại dữ liệu mới nhất từ hệ thống</li>
          <li>• Dữ liệu được đồng bộ từ cơ sở dữ liệu và cập nhật theo thời gian thực</li>
        </ul>
      </div>

      {/* Edit Modal */}
      <DaiLyEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        daiLy={selectedDaiLy}
        onSave={handleEditSave}
      />

      {/* Create Modal */}
      <DaiLyCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateSave}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && deletingDaiLy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Xác nhận xóa đại lý
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bạn có chắc chắn muốn xóa đại lý <strong>{deletingDaiLy.ten}</strong> (Mã: {deletingDaiLy.ma})?
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Đang xóa...' : 'Xóa'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaiLyManagement;
