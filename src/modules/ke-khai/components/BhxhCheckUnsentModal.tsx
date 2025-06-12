import React, { useState } from 'react';
import { X, Search, CheckCircle, XCircle, AlertTriangle, FileText, User, Calendar, Building } from 'lucide-react';
import { keKhaiService } from '../services/keKhaiService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';

interface BhxhCheckResult {
  maSoBhxh: string;
  found: boolean;
  keKhaiInfo?: {
    id: number;
    ma_ke_khai: string;
    ten_ke_khai: string;
    trang_thai: string;
    created_at: string;
    loai_ke_khai: string;
    participantInfo?: {
      ho_ten: string;
      don_vi_id?: string;
      don_vi_name?: string;
    };
  };
  error?: string;
}

interface BhxhCheckUnsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BhxhCheckUnsentModal: React.FC<BhxhCheckUnsentModalProps> = ({ isOpen, onClose }) => {
  const [bhxhList, setBhxhList] = useState('');
  const [results, setResults] = useState<BhxhCheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  
  const { user } = useAuth();
  const { showToast } = useToast();

  // Handle search
  const handleSearch = async () => {
    if (!bhxhList.trim()) {
      showToast('Vui lòng nhập danh sách mã số BHXH', 'warning');
      return;
    }

    setLoading(true);
    setResults([]);
    setSearchCompleted(false);

    try {
      // Parse BHXH list (split by newlines, commas, or spaces)
      const bhxhNumbers = bhxhList
        .split(/[\n,\s]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      if (bhxhNumbers.length === 0) {
        showToast('Không tìm thấy mã số BHXH hợp lệ', 'warning');
        return;
      }

      console.log('🔍 Checking BHXH numbers:', bhxhNumbers);

      const searchResults: BhxhCheckResult[] = [];

      // Check each BHXH number
      for (const maSoBhxh of bhxhNumbers) {
        try {
          console.log(`🔍 Checking BHXH: ${maSoBhxh}`);
          
          // Search for ke khai that are NOT in request_sent, request_confirmed, or completed status
          // and contain this BHXH number
          const unsentKeKhai = await keKhaiService.findUnsentKeKhaiBySoBhxh(maSoBhxh);
          
          if (unsentKeKhai) {
            searchResults.push({
              maSoBhxh,
              found: true,
              keKhaiInfo: unsentKeKhai
            });
          } else {
            searchResults.push({
              maSoBhxh,
              found: false
            });
          }
        } catch (error) {
          console.error(`Error checking BHXH ${maSoBhxh}:`, error);
          searchResults.push({
            maSoBhxh,
            found: false,
            error: 'Lỗi khi kiểm tra'
          });
        }
      }

      setResults(searchResults);
      setSearchCompleted(true);

      const foundCount = searchResults.filter(r => r.found).length;
      showToast(
        `Đã kiểm tra ${bhxhNumbers.length} mã số BHXH. Tìm thấy ${foundCount} kê khai chưa gửi yêu cầu phát sinh.`,
        foundCount > 0 ? 'success' : 'warning'
      );

    } catch (error) {
      console.error('Error in BHXH check:', error);
      showToast('Có lỗi xảy ra khi kiểm tra', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Clear results
  const handleClear = () => {
    setBhxhList('');
    setResults([]);
    setSearchCompleted(false);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FileText className="w-3 h-3 mr-1" />
            Nháp
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Chờ duyệt
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case 'pending_payment':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Chờ thanh toán
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã thanh toán
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Kiểm tra kê khai chưa gửi yêu cầu phát sinh
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh sách mã số BHXH
              </label>
              <textarea
                value={bhxhList}
                onChange={(e) => setBhxhList(e.target.value)}
                placeholder="Nhập danh sách mã số BHXH (mỗi mã một dòng hoặc cách nhau bằng dấu phẩy)&#10;Ví dụ:&#10;1234567890&#10;0987654321&#10;hoặc: 1234567890, 0987654321"
                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSearch}
                disabled={loading || !bhxhList.trim()}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  loading || !bhxhList.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Kiểm tra
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                disabled={loading}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-2" />
                Xóa
              </button>
            </div>
          </div>

          {/* Results Section */}
          {searchCompleted && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Kết quả kiểm tra
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tổng: {results.length} | 
                  Tìm thấy: <span className="text-green-600 font-medium">{results.filter(r => r.found).length}</span> | 
                  Không tìm thấy: <span className="text-gray-600 font-medium">{results.filter(r => !r.found).length}</span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Mã số BHXH
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Thông tin kê khai
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {result.maSoBhxh}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {result.found ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Tìm thấy
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-500">
                              <XCircle className="w-4 h-4 mr-1" />
                              {result.error || 'Không tìm thấy'}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {result.keKhaiInfo ? (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  {result.keKhaiInfo.ma_ke_khai}
                                </span>
                                {getStatusBadge(result.keKhaiInfo.trang_thai)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {result.keKhaiInfo.ten_ke_khai}
                              </div>
                              {result.keKhaiInfo.participantInfo && (
                                <div className="text-xs text-gray-600 dark:text-gray-300">
                                  <User className="w-3 h-3 inline mr-1" />
                                  {result.keKhaiInfo.participantInfo.ho_ten}
                                  {result.keKhaiInfo.participantInfo.don_vi_name && (
                                    <>
                                      {' • '}
                                      <Building className="w-3 h-3 inline mr-1" />
                                      {result.keKhaiInfo.participantInfo.don_vi_name}
                                    </>
                                  )}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {new Date(result.keKhaiInfo.created_at).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BhxhCheckUnsentModal;
