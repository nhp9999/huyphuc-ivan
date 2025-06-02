import React, { useState } from 'react';
import { Download, Search, Loader, CheckCircle, AlertCircle, Trash2, Copy, ChevronDown, ChevronUp, User, Calendar, MapPin, Building, Shield, Clock, CreditCard } from 'lucide-react';
import { bhytService } from '../services/bhytService';
import { BhytBulkLookupResponse, BulkLookupProgress } from '../types/bhyt';

interface BulkLookupProps {
  onBack: () => void;
}

const BulkLookup: React.FC<BulkLookupProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BhytBulkLookupResponse | null>(null);
  const [progress, setProgress] = useState<BulkLookupProgress | null>(null);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const parseMaSoList = (text: string): string[] => {
    return text
      .split(/[\n,;|\s]+/)
      .map(item => item.trim().replace(/\D/g, ''))
      .filter(item => item.length === 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setProgress(null);

    if (!inputText.trim()) {
      setError('Vui lòng nhập danh sách mã số BHXH');
      return;
    }

    const maSoList = parseMaSoList(inputText);

    if (maSoList.length === 0) {
      setError('Không tìm thấy mã số BHXH hợp lệ nào (10 chữ số)');
      return;
    }

    if (maSoList.length > 100) {
      setError('Tối đa 100 mã số BHXH mỗi lần tra cứu');
      return;
    }

    setIsLoading(true);

    try {
      const response = await bhytService.bulkLookupBhytInfo(maSoList, setProgress);
      setResults(response);
    } catch (error) {
      setError('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.');
      console.error('Bulk lookup error:', error);
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResults(null);
    setError('');
    setProgress(null);
  };

  const handleSampleData = () => {
    setInputText('0123456789\n0123456788\n0123456787\n1234567890\n9876543210');
  };

  const exportToCSV = () => {
    if (!results) return;

    const headers = ['Mã số BHXH', 'Trạng thái', 'Họ tên', 'Ngày sinh', 'Giới tính', 'Địa chỉ', 'Nơi đăng ký KCB', 'Trạng thái thẻ', 'Mức hưởng', 'Ghi chú'];
    const rows = results.results.map(result => [
      result.maSoBHXH,
      result.success ? 'Thành công' : 'Thất bại',
      result.data?.hoTen || '',
      result.data?.ngaySinh || '',
      result.data?.gioiTinh || '',
      result.data?.diaChi || '',
      result.data?.noiDangKyKCB || '',
      result.data?.trangThaiThe || '',
      result.data?.mucHuong || '',
      result.message || result.error || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bhyt_bulk_lookup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const copyResults = () => {
    if (!results) return;

    const text = results.results.map(result => {
      if (result.success && result.data) {
        return `${result.maSoBHXH}: ${result.data.hoTen} - ${result.data.trangThaiThe}`;
      } else {
        return `${result.maSoBHXH}: ${result.message || result.error}`;
      }
    }).join('\n');

    navigator.clipboard.writeText(text);
  };

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatDate = (dateString: string) => {
    return dateString; // Already formatted from API
  };

  const expandAll = () => {
    if (!results) return;
    const allIndices = new Set(results.results.map((_, index) => index));
    setExpandedRows(allIndices);
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const renderResultsTable = () => {
    if (!results) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Kết quả tra cứu hàng loạt
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {results.message}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={expandAll}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Mở tất cả</span>
              </button>
              <button
                onClick={collapseAll}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                <span>Đóng tất cả</span>
              </button>
              <button
                onClick={copyResults}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.totalCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tổng số</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{results.successCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Thành công</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{results.failureCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Thất bại</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {results.results.map((result, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Header Row */}
              <div
                className="bg-gray-50 dark:bg-gray-700 px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => toggleRowExpansion(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {result.maSoBHXH}
                      </span>
                    </div>

                    {result.success ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Thành công
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Thất bại
                      </span>
                    )}

                    {result.data && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{result.data.hoTen}</span>
                        <span>•</span>
                        <span>{result.data.trangThaiThe}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {result.success && result.data && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Click để xem chi tiết
                      </span>
                    )}
                    {expandedRows.has(index) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRows.has(index) && result.success && result.data && (
                <div className="bg-white dark:bg-gray-800 px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Họ và tên</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">{result.data.hoTen}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày sinh</p>
                          <p className="text-base text-gray-900 dark:text-white">{formatDate(result.data.ngaySinh)}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <User className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Giới tính</p>
                          <p className="text-base text-gray-900 dark:text-white">{result.data.gioiTinh}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Địa chỉ</p>
                          <p className="text-base text-gray-900 dark:text-white">{result.data.diaChi}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Building className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Đơn vị công tác</p>
                          <p className="text-base text-gray-900 dark:text-white">{result.data.donViCongTac}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Building className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nơi đăng ký KCB</p>
                          <p className="text-base text-gray-900 dark:text-white">{result.data.noiDangKyKCB}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái thẻ</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            result.data.trangThaiThe === 'Còn hiệu lực' || result.data.trangThaiThe === 'Thẻ hợp lệ'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {result.data.trangThaiThe}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày hiệu lực</p>
                          <p className="text-base text-gray-900 dark:text-white">{formatDate(result.data.ngayHieuLuc)}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày hết hạn</p>
                          <p className="text-base text-gray-900 dark:text-white">{formatDate(result.data.ngayHetHan)}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mức hưởng</p>
                          <p className="text-base font-semibold text-purple-600 dark:text-purple-400">{result.data.mucHuong}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Khu vực</p>
                          <p className="text-base text-gray-900 dark:text-white">{result.data.tenKV} ({result.data.maKV})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Details */}
              {expandedRows.has(index) && !result.success && (
                <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">Lỗi tra cứu</p>
                      <p className="text-sm text-red-600 dark:text-red-300">{result.message || result.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tra cứu hàng loạt BHYT</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Nhập nhiều mã số BHXH để tra cứu cùng lúc
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          ← Quay lại tra cứu đơn lẻ
        </button>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="bulkInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Danh sách mã số BHXH
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleSampleData}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Dữ liệu mẫu
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              id="bulkInput"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError('');
              }}
              placeholder="Nhập mã số BHXH, mỗi mã một dòng hoặc cách nhau bằng dấu phẩy&#10;Ví dụ:&#10;0123456789&#10;0123456788&#10;0123456787"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tối đa 100 mã số. Hỗ trợ ngăn cách bằng xuống dòng, dấu phẩy, chấm phẩy hoặc khoảng trắng.
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {progress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Đang tra cứu: {progress.currentMaSo}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {progress.current}/{progress.total} ({progress.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Đang tra cứu...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Tra cứu hàng loạt</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && renderResultsTable()}
    </div>
  );
};

export default BulkLookup;
