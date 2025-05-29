import React, { useState, useEffect } from 'react';
import { Search, Building2, RefreshCw, AlertCircle, Filter, Eye, Users, FileText, Edit, Trash2, Plus, X } from 'lucide-react';
import { donViService, DonViSearchParams } from '../services/donViService';
import { VDonViChiTiet, DmKhoiKcb } from '../services/supabaseClient';
import DonViEditModal from '../components/DonViEditModal';
import DonViCreateModal from '../components/DonViCreateModal';

const DonViManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<VDonViChiTiet[]>([]);
  const [allData, setAllData] = useState<VDonViChiTiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoaiDichVu, setSelectedLoaiDichVu] = useState<'ALL' | 'BHXH' | 'BHYT'>('ALL');
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [maCoQuanOptions, setMaCoQuanOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedMaCoQuan, setSelectedMaCoQuan] = useState<string>('');
  const [statistics, setStatistics] = useState<{ type: number; so_luong: number; ten_loai: string }[]>([]);
  const [serviceStats, setServiceStats] = useState<{ loai: string; so_luong: number }[]>([]);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDonVi, setSelectedDonVi] = useState<VDonViChiTiet | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingDonVi, setDeletingDonVi] = useState<VDonViChiTiet | null>(null);

  // Load data from Supabase
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [donViData, maCoQuanData, statsData, serviceStatsData] = await Promise.all([
        donViService.getAllDonVi(),
        donViService.getMaCoQuanBHXHList(),
        donViService.getThongKeTheoLoai(),
        donViService.getThongKeTheoDichVu()
      ]);

      setAllData(donViData);
      setFilteredData(donViData);
      setMaCoQuanOptions(maCoQuanData);
      setStatistics(statsData);
      setServiceStats(serviceStatsData);
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
      const searchParams: DonViSearchParams = {
        searchTerm: searchTerm.trim() || undefined,
        loaiDichVu: selectedLoaiDichVu !== 'ALL' ? selectedLoaiDichVu : undefined,
        type: selectedType || undefined,
        maCoQuanBHXH: selectedMaCoQuan || undefined
      };

      const results = await donViService.searchDonVi(searchParams);
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
    setSelectedLoaiDichVu('ALL');
    setSelectedType(null);
    setSelectedMaCoQuan('');
    loadData();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedLoaiDichVu('ALL');
    setSelectedType(null);
    setSelectedMaCoQuan('');
    setFilteredData(allData);
  };

  // Handle edit
  const handleEdit = (donVi: VDonViChiTiet) => {
    setSelectedDonVi(donVi);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedDonVi(null);
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
  const handleDelete = (donVi: VDonViChiTiet) => {
    setDeletingDonVi(donVi);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDonVi) return;

    setLoading(true);
    try {
      await donViService.deleteDonVi(deletingDonVi.id);
      setIsDeleteConfirmOpen(false);
      setDeletingDonVi(null);
      loadData(); // Reload data after delete
    } catch (err) {
      console.error('Error deleting don vi:', err);
      setError('Có lỗi xảy ra khi xóa đơn vị. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingDonVi(null);
  };

  const getServiceBadgeColor = (loaiDichVu: string) => {
    switch (loaiDichVu) {
      case 'BHXH Tự nguyện':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'BHYT':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'BHXH Tự nguyện + BHYT':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
    }
  };

  const getTypeBadgeColor = (loaiDonVi: string) => {
    switch (loaiDonVi) {
      case 'Cơ quan nhà nước':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      case 'Dịch vụ thu':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'Doanh nghiệp':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý đơn vị</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các đơn vị thu BHXH và BHYT
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đơn vị</span>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Type Statistics */}
        {statistics.map((stat) => (
          <div key={stat.type} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.so_luong}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.ten_loai}</div>
          </div>
        ))}
      </div>

      {/* Service Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {serviceStats.map((stat) => (
          <div key={stat.loai} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stat.so_luong}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.loai}</div>
          </div>
        ))}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm đơn vị
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tên hoặc mã đơn vị..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="loaidichvu" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại dịch vụ
            </label>
            <select
              id="loaidichvu"
              value={selectedLoaiDichVu}
              onChange={(e) => setSelectedLoaiDichVu(e.target.value as 'ALL' | 'BHXH' | 'BHYT')}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
            >
              <option value="ALL">Tất cả dịch vụ</option>
              <option value="BHXH">BHXH Tự nguyện</option>
              <option value="BHYT">BHYT</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại đơn vị
            </label>
            <select
              id="type"
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base"
            >
              <option value="">Tất cả loại</option>
              <option value="1">Cơ quan nhà nước</option>
              <option value="2">Dịch vụ thu</option>
              <option value="3">Doanh nghiệp</option>
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
        {/* Desktop Table Header */}
        <div className="hidden md:block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Mã số BHXH</div>
            <div className="col-span-3">Tên đơn vị</div>
            <div className="col-span-2">Đại lý quản lý</div>
            <div className="col-span-2">Dịch vụ</div>
            <div className="col-span-1">Loại</div>
            <div className="col-span-1 text-center">Hành động</div>
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
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy đơn vị nào phù hợp</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200">
                {/* Desktop Layout */}
                <div className="hidden md:block px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm text-gray-900 dark:text-white font-medium">
                      {item.id}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                          <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {item.ma_so_bhxh}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3 text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{item.ten_don_vi}</div>
                      {item.ma_co_quan_bhxh && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Mã cơ quan: {item.ma_co_quan_bhxh}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 text-sm">
                      {item.ten_dai_ly ? (
                        <div>
                          <div className="font-medium text-green-600 dark:text-green-400">
                            {item.ma_dai_ly}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.ten_dai_ly}
                          </div>
                          {item.loai_dai_ly && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              {item.loai_dai_ly}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                          Chưa gán đại lý
                        </span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceBadgeColor(item.loai_dich_vu)}`}>
                        {item.loai_dich_vu}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(item.loai_don_vi)}`}>
                        {item.loai_don_vi.replace('Đơn vị thu ', '')}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">ID: {item.id}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.ma_so_bhxh}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Organization Name */}
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tên đơn vị:</span>
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {item.ten_don_vi}
                    </p>
                  </div>

                  {/* Services and Type */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getServiceBadgeColor(item.loai_dich_vu)}`}>
                      {item.loai_dich_vu}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(item.loai_don_vi)}`}>
                      {item.loai_don_vi}
                    </span>
                  </div>

                  {/* Agent Info */}
                  {item.ten_dai_ly && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Đại lý quản lý:</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="mt-1">
                        <div className="text-xs font-medium text-green-600 dark:text-green-400">
                          {item.ma_dai_ly} - {item.ten_dai_ly}
                        </div>
                        {item.loai_dai_ly && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {item.loai_dai_ly}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {item.ma_co_quan_bhxh && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Mã cơ quan: {item.ma_co_quan_bhxh}
                      </span>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="font-medium">Tổng số đơn vị: <span className="text-blue-600 dark:text-blue-400">{filteredData.length}</span></span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span>Hiển thị: <span className="text-blue-600 dark:text-blue-400">{filteredData.length}</span> kết quả</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1.5 rounded-full">
                  Từ khóa: "{searchTerm}"
                </span>
              )}
              {selectedLoaiDichVu !== 'ALL' && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1.5 rounded-full">
                  Dịch vụ: {selectedLoaiDichVu}
                </span>
              )}
              {selectedType && (
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-3 py-1.5 rounded-full">
                  Loại: {donViService.getLoaiDonViLabel(selectedType)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Hướng dẫn sử dụng
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• <strong>Tạo đơn vị:</strong> Click nút "Tạo đơn vị" để thêm đơn vị mới vào hệ thống</li>
          <li>• <strong>Tìm kiếm:</strong> Nhập tên hoặc mã đơn vị để tìm kiếm nhanh</li>
          <li>• <strong>Lọc dịch vụ:</strong> Chọn loại dịch vụ (BHXH Tự nguyện, BHYT)</li>
          <li>• <strong>Lọc loại:</strong> Chọn loại đơn vị (Cơ quan nhà nước, Dịch vụ thu, Doanh nghiệp)</li>
          <li>• <strong>Chỉnh sửa:</strong> Click vào icon bút chì để chỉnh sửa thông tin đơn vị</li>
          <li>• <strong>Xóa:</strong> Click vào icon thùng rác để xóa đơn vị (xóa mềm)</li>
          <li>• <strong>Làm mới:</strong> Tải lại dữ liệu mới nhất từ hệ thống</li>
          <li>• Dữ liệu được đồng bộ từ cơ sở dữ liệu và cập nhật theo thời gian thực</li>
        </ul>
      </div>

      {/* Edit Modal */}
      <DonViEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        donVi={selectedDonVi}
        onSave={handleEditSave}
      />

      {/* Create Modal */}
      <DonViCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSave={handleCreateSave}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && deletingDonVi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Xác nhận xóa
              </h2>
              <button
                onClick={handleDeleteCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Xóa đơn vị
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Đơn vị:</strong> {deletingDonVi.ten_don_vi}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <strong>Mã số BHXH:</strong> {deletingDonVi.ma_so_bhxh}
                </p>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bạn có chắc chắn muốn xóa đơn vị này? Đơn vị sẽ được đánh dấu là không hoạt động và không thể sử dụng trong các kê khai mới.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleDeleteCancel}
                disabled={loading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
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
      )}
    </div>
  );
};

export default DonViManagement;
