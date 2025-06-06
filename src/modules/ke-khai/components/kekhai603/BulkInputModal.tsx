import React, { useState } from 'react';
import { X, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface BulkInputData {
  maSoBHXH: string;
  soThangDong?: string;
  sttHo?: string;
}

interface BulkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkInputData[]) => void;
  doiTuongThamGia?: string;
}

export const BulkInputModal: React.FC<BulkInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doiTuongThamGia
}) => {
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState<BulkInputData[]>([]);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [detectedFormat, setDetectedFormat] = useState<string>('');

  if (!isOpen) return null;

  // Parse input text to extract BHXH codes and optional data
  const parseInputText = (text: string): BulkInputData[] => {
    // Split by lines and process each line
    const allLines = text.split('\n');
    const results: BulkInputData[] = [];
    const errors: string[] = [];
    let processedLineCount = 0;

    // Detect format for user feedback
    let formatDetected = '';
    const nonEmptyLines = allLines.filter(line => line.trim());
    if (nonEmptyLines.length > 0) {
      const firstLine = nonEmptyLines[0];
      if (firstLine.includes('\t')) {
        formatDetected = 'Excel (Tab-separated)';
      } else if (firstLine.includes(',')) {
        formatDetected = 'Comma-separated';
      } else if (firstLine.includes(' ')) {
        formatDetected = 'Space-separated';
      } else {
        formatDetected = 'Chỉ mã BHXH';
      }
      setDetectedFormat(formatDetected);
    }

    // Helper function to validate and process STT hộ
    const processSttHo = (sttHoRaw: string, lineIndex: number): string | null => {
      const trimmed = sttHoRaw.trim();

      // Handle STT hộ: 1, 2, 3, 4 stay as is; 5 and above become "5+"
      if (['1', '2', '3', '4'].includes(trimmed)) {
        return trimmed;
      } else if (trimmed === '5+') {
        return '5+';
      } else {
        // Check if it's a number >= 5
        const sttHoNum = parseInt(trimmed);
        if (!isNaN(sttHoNum) && sttHoNum >= 5) {
          return '5+'; // Convert 5, 6, 7, etc. to "5+"
        } else {
          errors.push(`Dòng ${lineIndex + 1}: STT hộ không hợp lệ (${trimmed}). Chỉ chấp nhận 1, 2, 3, 4, hoặc từ 5 trở lên (sẽ chuyển thành 5+)`);
          return null; // Invalid STT hộ
        }
      }
    };

    allLines.forEach((line, originalIndex) => {
      const trimmedLine = line.trim();

      // Skip completely empty lines
      if (!trimmedLine) return;

      // Skip lines that only contain whitespace or tabs
      if (/^\s*$/.test(line)) return;

      processedLineCount++;

      // Support multiple formats for Excel copy-paste:
      // 1. Tab-separated (Excel default): "0123456789\t12\t1"
      // 2. Tab-separated with empty cells: "0123456789\t\t" or "0123456789\t12\t"
      // 3. Comma-separated: "0123456789,12,1"
      // 4. Space-separated: "0123456789 12 1"
      // 5. Mixed separators: "0123456789, 12, 1"
      // 6. Just BHXH code: "0123456789"

      let parts: string[];
      if (trimmedLine.includes('\t')) {
        // Excel tab-separated format - split by tabs and clean up
        parts = trimmedLine.split('\t').map(p => p.trim());
        // Keep empty strings to maintain column positions
      } else {
        // Other formats (comma, space, mixed)
        parts = trimmedLine.split(/[,\s]+/).map(p => p.trim()).filter(p => p);
      }

      // Get the first non-empty part as BHXH code
      const bhxhPart = parts.find(p => p && p.trim());
      if (!bhxhPart) return; // Skip if no valid data found

      // Extract BHXH code (remove any non-digits)
      const maSoBHXH = bhxhPart.replace(/\D/g, '');

      // Validate BHXH code
      if (maSoBHXH.length !== 10) {
        errors.push(`Dòng ${originalIndex + 1}: Mã BHXH không hợp lệ (${bhxhPart}) - cần đúng 10 chữ số`);
        return;
      }

      const data: BulkInputData = { maSoBHXH };

      // Parse months from second column/part
      let monthsFound = false;
      const monthsIndex = 1; // Second position in both formats

      if (parts.length > monthsIndex && parts[monthsIndex] && parts[monthsIndex].trim()) {
        const months = parts[monthsIndex].trim().replace(/\D/g, '');
        if (['3', '6', '12'].includes(months)) {
          data.soThangDong = months;
          monthsFound = true;
        } else if (months) {
          errors.push(`Dòng ${originalIndex + 1}: Số tháng không hợp lệ (${parts[monthsIndex]}). Chỉ chấp nhận 3, 6, hoặc 12`);
          return; // Skip this row due to invalid data
        }
      }

      // Parse STT hộ from third column/part - only if not DS type
      const isDsType = doiTuongThamGia && doiTuongThamGia.includes('DS');

      if (!isDsType) {
        const sttHoIndex = 2; // Third position in both formats

        if (parts.length > sttHoIndex && parts[sttHoIndex] && parts[sttHoIndex].trim()) {
          const processedSttHo = processSttHo(parts[sttHoIndex], originalIndex);
          if (processedSttHo === null) {
            return; // Skip this row due to invalid STT hộ
          }
          data.sttHo = processedSttHo;
        }
      } else {
        // For DS type, auto-set STT hộ to "1"
        data.sttHo = '1';
      }

      // Determine if this row has sufficient data
      // For DS type: only need BHXH code + months
      // For other types: need BHXH code + months (STT hộ is optional but recommended)
      const hasValidData = monthsFound; // Months is required for all types

      // Only add to results if the row has sufficient data
      if (hasValidData) {
        results.push(data);
      }
      // Skip rows that only have BHXH code without months data
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return [];
    }

    setError('');

    // Update format detection message to include processing info
    if (results.length > 0 && formatDetected) {
      setDetectedFormat(`${formatDetected} - Đã xử lý ${results.length} mã BHXH từ ${processedLineCount} dòng có dữ liệu`);
    }

    return results;
  };

  const handlePreview = () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập dữ liệu');
      return;
    }

    const parsed = parseInputText(inputText);
    if (parsed.length > 0) {
      setParsedData(parsed);
      setShowPreview(true);
    }
  };

  const handleSubmit = () => {
    if (parsedData.length === 0) {
      setError('Không có dữ liệu hợp lệ để thêm');
      return;
    }

    onSubmit(parsedData);
    handleClose();
  };

  const handleClose = () => {
    setInputText('');
    setParsedData([]);
    setError('');
    setShowPreview(false);
    setDetectedFormat('');
    onClose();
  };

  const handleSampleData = () => {
    // Use tab-separated format to simulate Excel copy-paste
    const sampleText = doiTuongThamGia && doiTuongThamGia.includes('DS')
      ? '0123456789\t12\n0123456788\t6\n0123456787\t3'
      : '0123456789\t12\t1\n0123456788\t6\t2\n0123456787\t3\t1';
    setInputText(sampleText);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nhập hàng loạt mã BHXH
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showPreview ? (
            /* Input Form */
            <div className="space-y-4">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-2">Hướng dẫn nhập liệu:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li><strong>Copy từ Excel:</strong> Chọn cột/dòng trong Excel và paste trực tiếp</li>
                      <li><strong>Định dạng Excel:</strong> Cột A: Mã BHXH, Cột B: Số tháng, Cột C: STT hộ</li>
                      <li><strong>Chỉ nhận dòng đầy đủ:</strong> Phải có ít nhất mã BHXH + số tháng</li>
                      <li><strong>Tự động bỏ qua:</strong> Dòng trống, dòng chỉ có mã BHXH</li>
                      <li>Mỗi dòng một mã BHXH (10 chữ số)</li>
                      <li>Bắt buộc có số tháng đóng: <code>0123456789	12</code></li>
                      {doiTuongThamGia && !doiTuongThamGia.includes('DS') && (
                        <li>Có thể thêm STT hộ: <code>0123456789	12	1</code></li>
                      )}
                      <li>Hỗ trợ ngăn cách: Tab (Excel), dấu phẩy, khoảng trắng</li>
                      <li>Số tháng hợp lệ: 3, 6, 12</li>
                      {doiTuongThamGia && !doiTuongThamGia.includes('DS') && (
                        <li>STT hộ hợp lệ: 1, 2, 3, 4, hoặc từ 5 trở lên (tự động chuyển thành 5+)</li>
                      )}
                    </ul>
                  </div>
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

              {/* Input Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dữ liệu nhập vào
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setError('');
                    setDetectedFormat('');
                  }}
                  placeholder={`Copy dữ liệu từ Excel hoặc nhập thủ công...

✅ Từ Excel: Chọn cột/dòng và Ctrl+C, sau đó Ctrl+V vào đây
✅ Chỉ nhận dòng có đầy đủ thông tin (mã BHXH + số tháng)
✅ Tự động bỏ qua dòng trống và dòng thiếu dữ liệu

Ví dụ Excel (chỉ lấy dòng có số tháng):
8924992285	12	1  ← Được nhận
8923487321		   ← Bỏ qua (thiếu số tháng)
8922622809		   ← Bỏ qua (thiếu số tháng)
8923440017	12	4  ← Được nhận

Hoặc nhập thủ công:
0123456789,12,1`}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                />
              </div>

              {/* Format Detection Display */}
              {detectedFormat && !error && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Đã phát hiện định dạng: <strong>{detectedFormat}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="text-sm text-red-700 dark:text-red-300">
                      <p className="font-medium mb-1">Lỗi dữ liệu:</p>
                      <pre className="whitespace-pre-wrap">{error}</pre>
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
                  disabled={!inputText.trim()}
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
                    <p className="font-medium">
                      Đã phân tích thành công {parsedData.length} mã BHXH
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">STT</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Mã BHXH</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Số tháng</th>
                        {doiTuongThamGia && !doiTuongThamGia.includes('DS') && (
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">STT hộ</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {parsedData.map((item, index) => (
                        <tr key={index} className="bg-white dark:bg-gray-800">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{item.maSoBHXH}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.soThangDong || '-'}</td>
                          {doiTuongThamGia && !doiTuongThamGia.includes('DS') && (
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.sttHo || '-'}</td>
                          )}
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
                    Thêm {parsedData.length} người tham gia
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
