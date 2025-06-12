import React, { useState } from 'react';
import { X, Search, AlertTriangle, CheckCircle, Users, Hash, User, Download } from 'lucide-react';
import { keKhaiService } from '../services/keKhaiService';
import { DanhSachNguoiThamGia, DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';

interface DuplicateCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

interface DuplicateResult {
  type: 'bhxh' | 'name';
  value: string;
  duplicates: Array<{
    participant: DanhSachNguoiThamGia;
    keKhai: DanhSachKeKhai;
  }>;
}

const DuplicateCheckModal: React.FC<DuplicateCheckModalProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'bhxh' | 'name' | 'both'>('both');
  const [searchMode, setSearchMode] = useState<'manual' | 'auto'>('manual');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState<DuplicateResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [autoScanResults, setAutoScanResults] = useState<{
    bhxhDuplicates: Array<{ maSoBhxh: string; participants: any[] }>;
    nameDuplicates: Array<{ hoTen: string; participants: any[] }>;
  } | null>(null);

  const handleSearch = async () => {
    if (searchMode === 'manual' && !searchInput.trim()) {
      setError('Vui lòng nhập dữ liệu để kiểm tra');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setAutoScanResults(null);

    try {
      if (searchMode === 'auto') {
        // Tự động quét toàn bộ hệ thống
        const allDuplicates = await keKhaiService.findAllDuplicates(userId);
        setAutoScanResults(allDuplicates);

        // Chuyển đổi kết quả để hiển thị trong format cũ
        const duplicateResults: DuplicateResult[] = [];

        // Thêm kết quả mã BHXH
        if (searchType === 'bhxh' || searchType === 'both') {
          allDuplicates.bhxhDuplicates.forEach(group => {
            duplicateResults.push({
              type: 'bhxh',
              value: group.maSoBhxh,
              duplicates: group.participants
            });
          });
        }

        // Thêm kết quả họ tên
        if (searchType === 'name' || searchType === 'both') {
          allDuplicates.nameDuplicates.forEach(group => {
            duplicateResults.push({
              type: 'name',
              value: group.hoTen,
              duplicates: group.participants
            });
          });
        }

        setResults(duplicateResults);
      } else {
        // Tìm kiếm thủ công theo input
        const searchValues = searchInput
          .split(/[\n,;]+/)
          .map(v => v.trim())
          .filter(v => v.length > 0);

        const duplicateResults: DuplicateResult[] = [];

        for (const value of searchValues) {
          if (searchType === 'bhxh' || searchType === 'both') {
            // Kiểm tra trùng lặp mã BHXH
            const bhxhDuplicates = await keKhaiService.findDuplicateBhxhCodes([value], userId);
            if (bhxhDuplicates.length > 0) {
              duplicateResults.push({
                type: 'bhxh',
                value,
                duplicates: bhxhDuplicates
              });
            }
          }

          if (searchType === 'name' || searchType === 'both') {
            // Kiểm tra trùng lặp họ tên
            const nameDuplicates = await keKhaiService.findDuplicateNames([value], userId);
            if (nameDuplicates.length > 0) {
              duplicateResults.push({
                type: 'name',
                value,
                duplicates: nameDuplicates
              });
            }
          }
        }

        setResults(duplicateResults);
      }
    } catch (err) {
      console.error('Error checking duplicates:', err);
      setError('Có lỗi xảy ra khi kiểm tra trùng lặp');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setResults([]);
    setAutoScanResults(null);
    setError(null);
  };

  // Export duplicates to CSV
  const exportDuplicates = () => {
    if (results.length === 0) return;

    const csvData = [];
    csvData.push(['Loại trùng lặp', 'Giá trị trùng lặp', 'Họ tên', 'Mã BHXH', 'CCCD', 'Ngày sinh', 'Mã kê khai', 'Trạng thái', 'Ngày tạo', 'ID người tham gia']);

    results.forEach(result => {
      result.duplicates.forEach(duplicate => {
        csvData.push([
          result.type === 'bhxh' ? 'Mã BHXH' : 'Họ tên',
          result.value,
          duplicate.participant.ho_ten,
          duplicate.participant.ma_so_bhxh || '',
          duplicate.participant.so_cccd || '',
          duplicate.participant.ngay_sinh ? formatDate(duplicate.participant.ngay_sinh) : '',
          duplicate.keKhai.ma_ke_khai,
          duplicate.keKhai.trang_thai,
          duplicate.keKhai.created_at ? formatDate(duplicate.keKhai.created_at) : '',
          duplicate.participant.id
        ]);
      });
    });

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `duplicate_check_${searchMode}_${new Date().toISOString().split('T')[0]}.csv`;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Search className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Kiểm tra trùng lặp
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tìm kiếm mã BHXH và họ tên trùng lặp trong hệ thống
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchMode('auto');
                setSearchType('both');
                handleSearch();
              }}
              disabled={loading}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
              title="Quét nhanh toàn bộ hệ thống"
            >
              <Search className="w-4 h-4" />
              <span>Quét nhanh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Search Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chế độ kiểm tra
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="manual"
                    checked={searchMode === 'manual'}
                    onChange={(e) => setSearchMode(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Nhập thủ công</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="auto"
                    checked={searchMode === 'auto'}
                    onChange={(e) => setSearchMode(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Tự động quét toàn bộ</span>
                </label>
              </div>
            </div>

            {/* Search Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Loại kiểm tra
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="both"
                    checked={searchType === 'both'}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Cả hai</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bhxh"
                    checked={searchType === 'bhxh'}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mã BHXH</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="name"
                    checked={searchType === 'name'}
                    onChange={(e) => setSearchType(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Họ tên</span>
                </label>
              </div>
            </div>

            {/* Search Input - Only show in manual mode */}
            {searchMode === 'manual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dữ liệu cần kiểm tra
                </label>
                <textarea
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Nhập mã BHXH hoặc họ tên (mỗi dòng một giá trị, hoặc phân cách bằng dấu phẩy)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={4}
                />
              </div>
            )}

            {/* Auto scan info */}
            {searchMode === 'auto' && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">Quét tự động</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Hệ thống sẽ tự động quét toàn bộ dữ liệu của bạn để tìm các bản ghi trùng lặp.
                      Quá trình này có thể mất vài giây tùy thuộc vào lượng dữ liệu.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>
                  {loading
                    ? (searchMode === 'auto' ? 'Đang quét toàn bộ...' : 'Đang kiểm tra...')
                    : (searchMode === 'auto' ? 'Quét toàn bộ' : 'Kiểm tra')
                  }
                </span>
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Xóa
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Auto scan statistics */}
          {searchMode === 'auto' && autoScanResults && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Kết quả quét toàn bộ</h3>
                {results.length > 0 && (
                  <button
                    onClick={exportDuplicates}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                    title="Xuất báo cáo CSV"
                  >
                    <Download className="w-3 h-3" />
                    <span>Xuất CSV</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-red-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>{autoScanResults.bhxhDuplicates.length}</strong> nhóm trùng mã BHXH
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>{autoScanResults.nameDuplicates.length}</strong> nhóm trùng họ tên
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>
                      {autoScanResults.bhxhDuplicates.reduce((sum, group) => sum + group.participants.length, 0) +
                       autoScanResults.nameDuplicates.reduce((sum, group) => sum + group.participants.length, 0)}
                    </strong> bản ghi bị ảnh hưởng
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>{results.length}</strong> nhóm trùng lặp hiển thị
                  </span>
                </div>
              </div>
            </div>
          )}

          {results.length === 0 && !loading && (searchInput || searchMode === 'auto') && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy trùng lặp
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchMode === 'auto'
                  ? 'Không có dữ liệu trùng lặp trong hệ thống của bạn'
                  : 'Tất cả dữ liệu đã kiểm tra đều không bị trùng lặp'
                }
              </p>
            </div>
          )}

          {results.map((result, index) => (
            <div key={index} className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                {result.type === 'bhxh' ? (
                  <Hash className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <h3 className="font-medium text-red-800 dark:text-red-300">
                  Trùng lặp {result.type === 'bhxh' ? 'mã BHXH' : 'họ tên'}: "{result.value}"
                </h3>
                <span className="text-sm text-red-600 dark:text-red-400">
                  ({result.duplicates.length} bản ghi)
                </span>
              </div>

              <div className="space-y-2">
                {result.duplicates.map((duplicate, dupIndex) => (
                  <div key={dupIndex} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-3">
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
                        <span className="font-medium text-gray-700 dark:text-gray-300">CCCD:</span>
                        <div className="text-gray-900 dark:text-white">{duplicate.participant.so_cccd || '—'}</div>
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

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateCheckModal;
