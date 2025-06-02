import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  RotateCcw,
  Hospital,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { DmCSKCB, DmTinh } from '../../../shared/services/api/supabaseClient';
import cskcbService, { CSKCBSearchParams } from '../../../shared/services/cskcbService';
import { useToast } from '../../../shared/hooks/useToast';
import CSKCBCreateModal from '../components/CSKCBCreateModal';
import CSKCBEditModal from '../components/CSKCBEditModal';

const CSKCBManagement: React.FC = () => {
  const { showToast } = useToast();
  
  // State management
  const [cskcbList, setCSKCBList] = useState<DmCSKCB[]>([]);
  const [tinhList, setTinhList] = useState<DmTinh[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTinh, setFilterTinh] = useState<string>('all');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterCap, setFilterCap] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('active');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCSKCB, setSelectedCSKCB] = useState<DmCSKCB | null>(null);

  // Load data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams: CSKCBSearchParams = {
        trang_thai: filterTrangThai !== 'all' ? filterTrangThai : undefined,
        ma_tinh: filterTinh !== 'all' ? filterTinh : undefined,
        loai_cskcb: filterLoai !== 'all' ? filterLoai : undefined,
        cap_cskcb: filterCap !== 'all' ? filterCap : undefined,
        search: searchTerm || undefined
      };

      const data = await cskcbService.getCSKCBList(searchParams);
      setCSKCBList(data);
    } catch (err) {
      console.error('Error loading CSKCB data:', err);
      setError('Không thể tải danh sách cơ sở khám chữa bệnh. Vui lòng thử lại.');
      showToast('Không thể tải danh sách cơ sở khám chữa bệnh', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load tỉnh list
  const loadTinhList = async () => {
    try {
      // Assuming we have a service to get provinces
      // For now, we'll use a placeholder
      setTinhList([]);
    } catch (err) {
      console.error('Error loading tinh data:', err);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    loadData();
  }, [searchTerm, filterTinh, filterLoai, filterCap, filterTrangThai]);

  useEffect(() => {
    loadTinhList();
  }, []);

  // Handle create success
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadData();
    showToast('Đã tạo cơ sở khám chữa bệnh thành công', 'success');
  };

  // Handle edit
  const handleEdit = (cskcb: DmCSKCB) => {
    setSelectedCSKCB(cskcb);
    setShowEditModal(true);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedCSKCB(null);
    loadData();
    showToast('Đã cập nhật cơ sở khám chữa bệnh thành công', 'success');
  };

  // Handle delete
  const handleDelete = async (cskcb: DmCSKCB) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa cơ sở khám chữa bệnh "${cskcb.ten}" không?`)) {
      return;
    }

    try {
      await cskcbService.deleteCSKCB(cskcb.id);
      loadData();
      showToast('Đã xóa cơ sở khám chữa bệnh thành công', 'success');
    } catch (err) {
      console.error('Error deleting CSKCB:', err);
      showToast('Không thể xóa cơ sở khám chữa bệnh', 'error');
    }
  };

  // Handle restore
  const handleRestore = async (cskcb: DmCSKCB) => {
    try {
      await cskcbService.restoreCSKCB(cskcb.id);
      loadData();
      showToast('Đã khôi phục cơ sở khám chữa bệnh thành công', 'success');
    } catch (err) {
      console.error('Error restoring CSKCB:', err);
      showToast('Không thể khôi phục cơ sở khám chữa bệnh', 'error');
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Hoạt động
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Ngừng hoạt động
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    const types = cskcbService.getLoaiCSKCB();
    return types.find(t => t.value === type)?.label || type;
  };

  // Get level label
  const getLevelLabel = (level: string) => {
    const levels = cskcbService.getCapCSKCB();
    return levels.find(l => l.value === level)?.label || level;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Cơ sở Khám chữa bệnh
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý danh mục cơ sở khám chữa bệnh theo từng tỉnh
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm cơ sở KCB
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Tỉnh Filter */}
          <select
            value={filterTinh}
            onChange={(e) => setFilterTinh(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả tỉnh</option>
            {tinhList.map((tinh) => (
              <option key={tinh.id} value={tinh.value}>
                {tinh.ten}
              </option>
            ))}
          </select>

          {/* Loại Filter */}
          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả loại</option>
            {cskcbService.getLoaiCSKCB().map((loai) => (
              <option key={loai.value} value={loai.value}>
                {loai.label}
              </option>
            ))}
          </select>

          {/* Cấp Filter */}
          <select
            value={filterCap}
            onChange={(e) => setFilterCap(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả cấp</option>
            {cskcbService.getCapCSKCB().map((cap) => (
              <option key={cap.value} value={cap.value}>
                {cap.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <Hospital className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* CSKCB List */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {cskcbList.length === 0 ? (
            <div className="text-center py-12">
              <Hospital className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không có cơ sở khám chữa bệnh nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có cơ sở khám chữa bệnh nào hoặc không tìm thấy kết quả phù hợp.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Mã
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tên cơ sở KCB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cấp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tỉnh
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
                  {cskcbList.map((cskcb) => (
                    <tr key={cskcb.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {cskcb.value}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {cskcb.ten}
                        </div>
                        {cskcb.dia_chi && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {cskcb.dia_chi}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 mt-1">
                          {cskcb.so_dien_thoai && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {cskcb.so_dien_thoai}
                            </div>
                          )}
                          {cskcb.email && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {cskcb.email}
                            </div>
                          )}
                          {cskcb.website && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              {cskcb.website}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {getTypeLabel(cskcb.loai_cskcb || '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          {getLevelLabel(cskcb.cap_cskcb || '')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {cskcb.ma_tinh}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(cskcb.trang_thai || 'active')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(cskcb)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {cskcb.trang_thai === 'active' ? (
                            <button
                              onClick={() => handleDelete(cskcb)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(cskcb)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Khôi phục"
                            >
                              <RotateCcw className="w-4 h-4" />
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
      )}

      {/* Modals */}
      {showCreateModal && (
        <CSKCBCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && selectedCSKCB && (
        <CSKCBEditModal
          cskcb={selectedCSKCB}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCSKCB(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default CSKCBManagement;
