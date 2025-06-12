import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Hash, User, RefreshCw, Search, Download, Trash2 } from 'lucide-react';
import { keKhaiService } from '../services/keKhaiService';
import { DanhSachNguoiThamGia, DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';

interface DuplicateGroup {
  type: 'bhxh' | 'name';
  value: string;
  participants: Array<{
    participant: DanhSachNguoiThamGia;
    keKhai: DanhSachKeKhai;
  }>;
}

const DuplicateManagement: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [bhxhDuplicates, setBhxhDuplicates] = useState<DuplicateGroup[]>([]);
  const [nameDuplicates, setNameDuplicates] = useState<DuplicateGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'bhxh' | 'name'>('all');
  const [selectedDuplicates, setSelectedDuplicates] = useState<Set<string>>(new Set());

  // Load all duplicates
  const loadDuplicates = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await keKhaiService.findAllDuplicates(user.id);
      
      const bhxhGroups = result.bhxhDuplicates.map(group => ({
        type: 'bhxh' as const,
        value: group.maSoBhxh,
        participants: group.participants
      }));

      const nameGroups = result.nameDuplicates.map(group => ({
        type: 'name' as const,
        value: group.hoTen,
        participants: group.participants
      }));

      setBhxhDuplicates(bhxhGroups);
      setNameDuplicates(nameGroups);

      showToast(`Tìm thấy ${bhxhGroups.length} nhóm trùng mã BHXH và ${nameGroups.length} nhóm trùng họ tên`, 'info');
    } catch (error) {
      console.error('Error loading duplicates:', error);
      showToast('Có lỗi xảy ra khi tải dữ liệu trùng lặp', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicates();
  }, [user?.id]);

  // Filter duplicates based on search term and type
  const getFilteredDuplicates = () => {
    let allDuplicates: DuplicateGroup[] = [];
    
    if (filterType === 'all' || filterType === 'bhxh') {
      allDuplicates = [...allDuplicates, ...bhxhDuplicates];
    }
    
    if (filterType === 'all' || filterType === 'name') {
      allDuplicates = [...allDuplicates, ...nameDuplicates];
    }

    if (searchTerm) {
      allDuplicates = allDuplicates.filter(group =>
        group.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.participants.some(p => 
          p.participant.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.participant.ma_so_bhxh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.keKhai.ma_ke_khai.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return allDuplicates;
  };

  const filteredDuplicates = getFilteredDuplicates();

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = filteredDuplicates.map(group => `${group.type}-${group.value}`);
      setSelectedDuplicates(new Set(allKeys));
    } else {
      setSelectedDuplicates(new Set());
    }
  };

  // Handle individual selection
  const handleSelect = (group: DuplicateGroup, checked: boolean) => {
    const key = `${group.type}-${group.value}`;
    const newSelected = new Set(selectedDuplicates);
    
    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    
    setSelectedDuplicates(newSelected);
  };

  // Export duplicates to CSV
  const exportDuplicates = () => {
    const csvData = [];
    csvData.push(['Loại', 'Giá trị trùng lặp', 'Họ tên', 'Mã BHXH', 'CCCD', 'Mã kê khai', 'Trạng thái', 'Ngày tạo']);

    filteredDuplicates.forEach(group => {
      group.participants.forEach(p => {
        csvData.push([
          group.type === 'bhxh' ? 'Mã BHXH' : 'Họ tên',
          group.value,
          p.participant.ho_ten,
          p.participant.ma_so_bhxh || '',
          p.participant.so_cccd || '',
          p.keKhai.ma_ke_khai,
          p.keKhai.trang_thai,
          new Date(p.keKhai.created_at || '').toLocaleDateString('vi-VN')
        ]);
      });
    });

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `duplicate_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      'draft': { label: 'Nháp', color: 'bg-gray-100 text-gray-800' },
      'submitted': { label: 'Đã nộp', color: 'bg-blue-100 text-blue-800' },
      'processing': { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800' },
      'approved': { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
      'rejected': { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
      'paid': { label: 'Đã thanh toán', color: 'bg-purple-100 text-purple-800' },
      'completed': { label: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800' }
    };

    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            Quản lý trùng lặp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tìm kiếm và quản lý các bản ghi trùng lặp mã BHXH và họ tên
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportDuplicates}
            disabled={filteredDuplicates.length === 0}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất CSV
          </button>
          <button
            onClick={loadDuplicates}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã BHXH, mã kê khai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter Type */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tất cả loại trùng lặp</option>
              <option value="bhxh">Chỉ mã BHXH</option>
              <option value="name">Chỉ họ tên</option>
            </select>
          </div>

          {/* Statistics */}
          <div className="flex items-center justify-end space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Hash className="w-4 h-4 mr-1 text-red-500" />
              <span>{bhxhDuplicates.length} nhóm mã BHXH</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1 text-orange-500" />
              <span>{nameDuplicates.length} nhóm họ tên</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
          </div>
        ) : filteredDuplicates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy trùng lặp
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Không có kết quả phù hợp với bộ lọc hiện tại'
                : 'Không có dữ liệu trùng lặp trong hệ thống'
              }
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Selection header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filteredDuplicates.length > 0 && selectedDuplicates.size === filteredDuplicates.length}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selectedDuplicates.size > 0 && selectedDuplicates.size < filteredDuplicates.length;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Đã chọn {selectedDuplicates.size} / {filteredDuplicates.length} nhóm
                </span>
              </div>
              
              {selectedDuplicates.size > 0 && (
                <button
                  onClick={() => {
                    // TODO: Implement bulk actions
                    showToast('Chức năng đang phát triển', 'info');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xử lý hàng loạt</span>
                </button>
              )}
            </div>

            {/* Duplicate groups */}
            {filteredDuplicates.map((group, index) => (
              <div key={`${group.type}-${group.value}`} className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedDuplicates.has(`${group.type}-${group.value}`)}
                      onChange={(e) => handleSelect(group, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      {group.type === 'bhxh' ? (
                        <Hash className="w-5 h-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      )}
                      <h3 className="font-medium text-red-800 dark:text-red-300">
                        Trùng lặp {group.type === 'bhxh' ? 'mã BHXH' : 'họ tên'}: "{group.value}"
                      </h3>
                      <span className="text-sm text-red-600 dark:text-red-400">
                        ({group.participants.length} bản ghi)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {group.participants.map((duplicate, dupIndex) => (
                    <div key={`${duplicate.participant.id}-${duplicate.keKhai.id}`} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Họ tên:</span>
                          <div className="text-gray-900 dark:text-white">{duplicate.participant.ho_ten}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Mã BHXH:</span>
                          <div className="text-gray-900 dark:text-white">{duplicate.participant.ma_so_bhxh || '—'}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">CCCD:</span>
                          <div className="text-gray-900 dark:text-white">{duplicate.participant.so_cccd || '—'}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Kê khai:</span>
                          <div className="text-gray-900 dark:text-white">{duplicate.keKhai.ma_ke_khai}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Trạng thái:</span>
                          <div>{getStatusBadge(duplicate.keKhai.trang_thai)}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Ngày tạo:</span>
                          <div className="text-gray-900 dark:text-white">
                            {duplicate.keKhai.created_at ? formatDate(duplicate.keKhai.created_at) : '—'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Ngày sinh:</span>
                          <div className="text-gray-900 dark:text-white">
                            {duplicate.participant.ngay_sinh ? formatDate(duplicate.participant.ngay_sinh) : '—'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">ID:</span>
                          <div className="text-gray-900 dark:text-white">#{duplicate.participant.id}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DuplicateManagement;
