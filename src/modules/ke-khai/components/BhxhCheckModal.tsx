import React, { useState } from 'react';
import { X, Search, CheckCircle, XCircle, User, FileText, Calendar, AlertTriangle, Copy, Download } from 'lucide-react';
import { keKhaiService } from '../services/keKhaiService';
import { useAuth } from '../../auth';
import { useToast } from '../../../shared/hooks/useToast';

interface BhxhCheckResult {
  maSoBhxh: string;
  exists: boolean;
  participant?: any;
  keKhai?: any;
}

interface BhxhCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BhxhCheckModal: React.FC<BhxhCheckModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BhxhCheckResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    existing: number;
    new: number;
  } | null>(null);

  // Parse input text to extract BHXH codes
  const parseBhxhCodes = (text: string): string[] => {
    if (!text.trim()) return [];

    // Split by lines, commas, spaces and clean up
    const codes = text
      .split(/[\n,\s]+/)
      .map(code => code.trim().replace(/\D/g, '')) // Remove non-digits
      .filter(code => code.length >= 8 && code.length <= 10) // Valid BHXH code length
      .map(code => code.slice(0, 10)); // Limit to 10 digits

    // Remove duplicates
    return [...new Set(codes)];
  };

  // Handle check BHXH codes
  const handleCheck = async () => {
    if (!inputText.trim()) {
      showToast('Vui lòng nhập danh sách mã BHXH', 'warning');
      return;
    }

    const codes = parseBhxhCodes(inputText);
    
    if (codes.length === 0) {
      showToast('Không tìm thấy mã BHXH hợp lệ nào', 'warning');
      return;
    }

    if (codes.length > 100) {
      showToast('Tối đa 100 mã BHXH mỗi lần kiểm tra', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const checkResult = await keKhaiService.checkMultipleBhxhCodes(codes, user?.id);
      
      setResults(checkResult.results);
      setSummary({
        total: codes.length,
        existing: checkResult.existingCount,
        new: checkResult.newCount
      });

      showToast(`Đã kiểm tra ${codes.length} mã BHXH. Có ${checkResult.existingCount} mã đã tồn tại, ${checkResult.newCount} mã mới`, 'success');
    } catch (error) {
      console.error('Error checking BHXH codes:', error);
      showToast('Có lỗi xảy ra khi kiểm tra mã BHXH', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clear all
  const handleClear = () => {
    setInputText('');
    setResults([]);
    setSummary(null);
  };

  // Handle copy results
  const handleCopyResults = () => {
    const existingCodes = results.filter(r => r.exists).map(r => r.maSoBhxh);
    const newCodes = results.filter(r => !r.exists).map(r => r.maSoBhxh);
    
    const text = `Kết quả kiểm tra mã BHXH:

Đã tồn tại (${existingCodes.length}):
${existingCodes.join('\n')}

Mã mới (${newCodes.length}):
${newCodes.join('\n')}`;

    navigator.clipboard.writeText(text);
    showToast('Đã sao chép kết quả', 'success');
  };

  // Handle copy new codes only
  const handleCopyNewCodes = () => {
    const newCodes = results.filter(r => !r.exists).map(r => r.maSoBhxh);
    navigator.clipboard.writeText(newCodes.join('\n'));
    showToast(`Đã sao chép ${newCodes.length} mã BHXH mới`, 'success');
  };

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Kiểm tra mã BHXH
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kiểm tra danh sách mã BHXH đã được thêm vào hệ thống hay chưa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Nhập danh sách mã BHXH (mỗi dòng một mã hoặc cách nhau bằng dấu phẩy)
            </label>
            <div className="space-y-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ví dụ:
0123456789
0123456788
0123456787
hoặc: 0123456789, 0123456788, 0123456787`}
                className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-y"
                rows={6}
                disabled={isLoading}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {inputText.trim() && (
                    <span>
                      Phát hiện {parseBhxhCodes(inputText).length} mã BHXH hợp lệ
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleClear}
                    disabled={isLoading || !inputText.trim()}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={handleCheck}
                    disabled={isLoading || !inputText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang kiểm tra...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Kiểm tra</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Tổng số</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {summary.total}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-900 dark:text-red-100">Đã tồn tại</span>
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {summary.existing}
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">Mã mới</span>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {summary.new}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {results.length > 0 && (
            <div className="mb-6 flex items-center space-x-3">
              <button
                onClick={handleCopyResults}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                Sao chép tất cả
              </button>

              {summary && summary.new > 0 && (
                <button
                  onClick={handleCopyNewCodes}
                  className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Sao chép mã mới ({summary.new})
                </button>
              )}
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mã BHXH
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Họ tên
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mã kê khai
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                            {result.maSoBhxh}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          {result.exists ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <XCircle className="w-3 h-3 mr-1" />
                              Đã tồn tại
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mã mới
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {result.participant?.ho_ten || (
                              <span className="text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900 dark:text-gray-100">
                            {result.keKhai?.ma_ke_khai || (
                              <span className="text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {result.keKhai?.created_at ? formatDate(result.keKhai.created_at) : (
                              <span className="text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BhxhCheckModal;
