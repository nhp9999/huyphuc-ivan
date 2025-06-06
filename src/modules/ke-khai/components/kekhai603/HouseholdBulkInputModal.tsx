import React, { useState, useEffect } from 'react';
import { X, Users, AlertCircle, CheckCircle, Loader2, FileText } from 'lucide-react';

interface HouseholdBulkInputData {
  bhxhCodes: string[];
  soThangDong: string;
  maBenhVien?: string;
  tenBenhVien?: string;
}

interface HouseholdBulkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HouseholdBulkInputData) => void;
  doiTuongThamGia?: string;
  cskcbOptions?: any[];
  processing?: boolean;
  progress?: {
    current: number;
    total: number;
    currentCode?: string;
  };
}

export const HouseholdBulkInputModal: React.FC<HouseholdBulkInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doiTuongThamGia,
  cskcbOptions = [],
  processing = false,
  progress
}) => {
  const [inputText, setInputText] = useState('');
  const [soThangDong, setSoThangDong] = useState('12');
  const [selectedMedicalFacility, setSelectedMedicalFacility] = useState('');
  const [parsedCodes, setParsedCodes] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  // Parse input text to extract BHXH codes
  const parseInputText = (text: string): string[] => {
    const lines = text.split('\n');
    const codes: string[] = [];
    const errors: string[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Skip empty lines

      // Extract BHXH code (remove any non-digits)
      const bhxhCode = trimmedLine.replace(/\D/g, '');

      // Validate BHXH code
      if (bhxhCode.length !== 10) {
        errors.push(`Dòng ${index + 1}: Mã BHXH không hợp lệ (${trimmedLine}) - cần đúng 10 chữ số`);
        return;
      }

      codes.push(bhxhCode);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return [];
    }

    setError('');
    return codes;
  };

  const handlePreview = () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập danh sách mã BHXH');
      return;
    }

    if (!soThangDong) {
      setError('Vui lòng chọn số tháng đóng');
      return;
    }

    const parsed = parseInputText(inputText);
    if (parsed.length > 0) {
      setParsedCodes(parsed);
      setShowPreview(true);
    }
  };

  const handleSubmit = () => {
    if (parsedCodes.length === 0) {
      setError('Không có mã BHXH hợp lệ để thêm');
      return;
    }

    const selectedFacility = cskcbOptions.find(option => option.value === selectedMedicalFacility);

    const data: HouseholdBulkInputData = {
      bhxhCodes: parsedCodes,
      soThangDong,
      maBenhVien: selectedFacility?.value,
      tenBenhVien: selectedFacility?.ten
    };

    onSubmit(data);
  };

  const handleClose = () => {
    if (processing) return; // Prevent closing during processing
    
    setInputText('');
    setSoThangDong('12');
    setSelectedMedicalFacility('');
    setParsedCodes([]);
    setError('');
    setShowPreview(false);
    onClose();
  };

  const handleSampleData = () => {
    const sampleText = `0123456789
0123456788
0123456787
0123456786
0123456785`;
    setInputText(sampleText);
  };

  // Show processing overlay if processing
  if (processing && progress) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Đang xử lý hộ gia đình
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Đang tra cứu thông tin BHXH và tạo danh sách người tham gia...
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {progress.current} / {progress.total} người
            </div>
            
            {progress.currentCode && (
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý: {progress.currentCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Nhập hộ gia đình
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={processing}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showPreview ? (
            /* Input Form */
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-2">Nhập hộ gia đình - Hướng dẫn:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li><strong>Danh sách mã BHXH:</strong> Mỗi dòng một mã (10 chữ số)</li>
                      <li><strong>STT hộ tự động:</strong> Người đầu tiên = 1, người thứ hai = 2, v.v.</li>
                      <li><strong>Số tháng chung:</strong> Áp dụng cho tất cả thành viên</li>
                      <li><strong>Nơi KCB chung:</strong> Tùy chọn, áp dụng cho tất cả (có thể chỉnh sửa sau)</li>
                      <li><strong>Tự động tra cứu:</strong> Hệ thống sẽ tự động tra cứu thông tin từ BHXH</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Common Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Months Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số tháng đóng (chung cho cả hộ) *
                  </label>
                  <select
                    value={soThangDong}
                    onChange={(e) => setSoThangDong(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="3">3 tháng</option>
                    <option value="6">6 tháng</option>
                    <option value="12">12 tháng</option>
                  </select>
                </div>

                {/* Medical Facility Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nơi KCB (tùy chọn)
                  </label>
                  <select
                    value={selectedMedicalFacility}
                    onChange={(e) => setSelectedMedicalFacility(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Chọn nơi KCB (có thể để trống)</option>
                    {cskcbOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.ten}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sample Data Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSampleData}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Dữ liệu mẫu
                </button>
              </div>

              {/* BHXH Codes Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Danh sách mã BHXH *
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setError('');
                  }}
                  placeholder={`Nhập danh sách mã BHXH, mỗi dòng một mã:

0123456789
0123456788
0123456787
...

Hoặc copy từ Excel (chỉ cần cột mã BHXH)`}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePreview}
                  disabled={!inputText.trim() || !soThangDong}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xem trước
                </button>
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="text-sm text-green-700 dark:text-green-300">
                    <p className="font-medium">Sẵn sàng thêm {parsedCodes.length} người vào hộ gia đình</p>
                    <p>Số tháng: {soThangDong} tháng | STT hộ: Tự động (1, 2, 3, ...)</p>
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">STT hộ</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Mã BHXH</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Số tháng</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {parsedCodes.map((code, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-800">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{code}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{soThangDong}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {index === 0 ? 'Chủ hộ' : `Thành viên ${index + 1}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Quay lại chỉnh sửa
                </button>
                <div className="space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Thêm hộ gia đình ({parsedCodes.length} người)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
