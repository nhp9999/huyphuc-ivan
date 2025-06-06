import React, { useState } from 'react';
import { X, Zap, Users, Calendar, ArrowUpDown, Hash, List } from 'lucide-react';

interface QuickFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (field: 'soThangDong' | 'sttHo' | 'maSoBHXH', value: string, selectedIndices?: number[]) => void;
  onApplyAutoIncrement?: (field: 'sttHo', selectedIndices?: number[]) => void;
  onApplyBulkBHXH?: (bhxhCodes: string[], selectedIndices?: number[]) => void;
  participantCount: number;
  doiTuongThamGia?: string;
  participants?: any[]; // Add participants data to check existing values
}

export const QuickFillModal: React.FC<QuickFillModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onApplyAutoIncrement,
  onApplyBulkBHXH,
  participantCount,
  doiTuongThamGia,
  participants = []
}) => {
  const [selectedField, setSelectedField] = useState<'soThangDong' | 'sttHo' | 'maSoBHXH'>('soThangDong');
  const [selectedValue, setSelectedValue] = useState('');
  const [applyTo, setApplyTo] = useState<'all' | 'selected' | 'empty'>('all');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [sttHoMode, setSttHoMode] = useState<'single' | 'auto'>('single');
  const [bhxhInput, setBhxhInput] = useState('');
  const [bhxhMode, setBhxhMode] = useState<'single' | 'bulk'>('single');
  const [bhxhBulkInput, setBhxhBulkInput] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    if (selectedField === 'sttHo' && sttHoMode === 'auto') {
      // Apply auto-increment STT hộ
      if (onApplyAutoIncrement) {
        const indices = applyTo === 'selected'
          ? selectedIndices
          : applyTo === 'empty'
          ? emptyIndices
          : undefined;
        onApplyAutoIncrement('sttHo', indices);
        handleClose();
      }
      return;
    }

    if (selectedField === 'maSoBHXH' && bhxhMode === 'bulk') {
      // Apply bulk BHXH codes
      if (onApplyBulkBHXH && parsedBhxhCodes.length > 0) {
        const indices = applyTo === 'selected'
          ? selectedIndices
          : applyTo === 'empty'
          ? emptyIndices
          : undefined;
        onApplyBulkBHXH(parsedBhxhCodes, indices);
        handleClose();
      }
      return;
    }

    // For single mã BHXH, use bhxhInput instead of selectedValue
    const valueToApply = selectedField === 'maSoBHXH' ? bhxhInput : selectedValue;

    if (!valueToApply) {
      return;
    }

    const indices = applyTo === 'selected'
      ? selectedIndices
      : applyTo === 'empty'
      ? emptyIndices
      : undefined;
    onApply(selectedField, valueToApply, indices);
    handleClose();
  };

  const handleClose = () => {
    setSelectedField('soThangDong');
    setSelectedValue('');
    setApplyTo('all');
    setSelectedIndices([]);
    setSttHoMode('single');
    setBhxhInput('');
    setBhxhMode('single');
    setBhxhBulkInput('');
    onClose();
  };

  const toggleParticipantSelection = (index: number) => {
    setSelectedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectAllParticipants = () => {
    setSelectedIndices(Array.from({ length: participantCount }, (_, i) => i));
  };

  const clearSelection = () => {
    setSelectedIndices([]);
  };

  const monthOptions = [
    { value: '3', label: '3 tháng' },
    { value: '6', label: '6 tháng' },
    { value: '12', label: '12 tháng' }
  ];

  const sttHoOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5+', label: '5+' }
  ];

  const isSTTHoDisabled = doiTuongThamGia && doiTuongThamGia.includes('DS');

  // Validate and format BHXH input
  const handleBhxhInputChange = (value: string) => {
    // Only allow numbers and limit to 10 characters
    const formattedValue = value.replace(/\D/g, '').slice(0, 10);
    setBhxhInput(formattedValue);
  };

  // Parse bulk BHXH input
  const parseBulkBhxhInput = (input: string): string[] => {
    if (!input.trim()) return [];

    // Split by lines and clean up
    const lines = input.split('\n').map(line => line.trim()).filter(line => line);
    const validCodes: string[] = [];

    for (const line of lines) {
      // Extract numbers only and limit to 10 characters
      const cleanCode = line.replace(/\D/g, '').slice(0, 10);
      if (cleanCode.length >= 8) { // Minimum 8 digits for BHXH code
        validCodes.push(cleanCode);
      }
    }

    return validCodes;
  };

  const parsedBhxhCodes = parseBulkBhxhInput(bhxhBulkInput);
  const validBhxhCount = parsedBhxhCodes.length;

  // Get indices of participants who don't have data for the selected field
  const getEmptyIndices = () => {
    if (!participants || participants.length === 0) return [];

    return participants.reduce((emptyIndices: number[], participant, index) => {
      let isEmpty = false;

      switch (selectedField) {
        case 'soThangDong':
          isEmpty = !participant.soThangDong || participant.soThangDong === '';
          break;
        case 'sttHo':
          isEmpty = !participant.sttHo || participant.sttHo === '';
          break;
        case 'maSoBHXH':
          isEmpty = !participant.maSoBHXH || participant.maSoBHXH === '';
          break;
        default:
          isEmpty = false;
      }

      if (isEmpty) {
        emptyIndices.push(index);
      }

      return emptyIndices;
    }, []);
  };

  const emptyIndices = getEmptyIndices();
  const emptyCount = emptyIndices.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Điền nhanh dữ liệu
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Chọn trường cần điền
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedField('soThangDong')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedField === 'soThangDong'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Số tháng đóng</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">3, 6, hoặc 12 tháng</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedField('maSoBHXH')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedField === 'maSoBHXH'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Hash className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Mã số BHXH</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Điền cùng một mã BHXH</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedField('sttHo')}
                disabled={isSTTHoDisabled}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  isSTTHoDisabled
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
                    : selectedField === 'sttHo'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">STT hộ</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {isSTTHoDisabled ? 'Không áp dụng cho DS' : '1, 2, 3, 4, hoặc 5+'}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* STT Hộ Mode Selection (only for STT hộ field) */}
          {selectedField === 'sttHo' && !isSTTHoDisabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Chế độ điền STT hộ
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSttHoMode('single')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    sttHoMode === 'single'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Giá trị cố định</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Điền cùng một giá trị</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSttHoMode('auto')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    sttHoMode === 'auto'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ArrowUpDown className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Tự động tăng dần</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">1, 2, 3, 4, 5+...</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* BHXH Mode Selection (only for BHXH field) */}
          {selectedField === 'maSoBHXH' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Chế độ điền mã BHXH
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setBhxhMode('single')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    bhxhMode === 'single'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Mã đơn lẻ</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Điền cùng một mã BHXH</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setBhxhMode('bulk')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    bhxhMode === 'bulk'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <List className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Danh sách mã</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Nhiều mã BHXH khác nhau</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Single BHXH Input */}
          {selectedField === 'maSoBHXH' && bhxhMode === 'single' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Nhập mã số BHXH
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={bhxhInput}
                    onChange={(e) => handleBhxhInputChange(e.target.value)}
                    placeholder="Nhập mã số BHXH (tối đa 10 số)"
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400"
                    maxLength={10}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>💡</span>
                  <span>Mã BHXH sẽ được điền cho tất cả người được chọn</span>
                </div>
                {bhxhInput && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Mã BHXH: {bhxhInput}
                      </span>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {bhxhInput.length}/10 ký tự
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bulk BHXH Input */}
          {selectedField === 'maSoBHXH' && bhxhMode === 'bulk' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Nhập danh sách mã số BHXH
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    value={bhxhBulkInput}
                    onChange={(e) => setBhxhBulkInput(e.target.value)}
                    placeholder={`Nhập danh sách mã BHXH (mỗi dòng một mã):
1234567890
2345678901
3456789012`}
                    className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-y overflow-y-auto"
                    rows={4}
                    style={{ minHeight: '100px', maxHeight: '150px' }}
                  />
                  <div className="absolute right-3 top-3">
                    <List className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>💡</span>
                  <span>Mỗi dòng một mã BHXH, sẽ được phân bổ theo thứ tự</span>
                </div>
                {validBhxhCount > 0 && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <List className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Đã phát hiện {validBhxhCount} mã BHXH hợp lệ
                      </span>
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      {parsedBhxhCodes.slice(0, 3).join(', ')}
                      {validBhxhCount > 3 && ` và ${validBhxhCount - 3} mã khác...`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Value Selection */}
          {(selectedField === 'soThangDong' || (selectedField === 'sttHo' && sttHoMode === 'single')) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Chọn giá trị
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(selectedField === 'soThangDong' ? monthOptions : sttHoOptions).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedValue(option.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      selectedValue === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auto Increment Preview (only for STT hộ auto mode) */}
          {selectedField === 'sttHo' && sttHoMode === 'auto' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Xem trước STT hộ tự động
              </label>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ArrowUpDown className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    STT hộ sẽ được điền tự động:
                  </span>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {applyTo === 'all'
                    ? `Người 1 → STT hộ: 1, Người 2 → STT hộ: 2, Người 3 → STT hộ: 3, ...`
                    : selectedIndices.length > 0
                    ? `${selectedIndices.map((idx, i) => `Người ${idx + 1} → STT hộ: ${i + 1}`).slice(0, 3).join(', ')}${selectedIndices.length > 3 ? ', ...' : ''}`
                    : 'Chưa chọn người tham gia nào'
                  }
                </div>
                <div className="text-xs text-green-500 dark:text-green-400 mt-1">
                  💡 STT hộ sẽ được gán theo thứ tự: 1, 2, 3, 4, 5+ (tối đa 5+)
                </div>
              </div>
            </div>
          )}

          {/* Apply To Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Áp dụng cho
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="applyTo"
                  value="all"
                  checked={applyTo === 'all'}
                  onChange={(e) => setApplyTo(e.target.value as 'all' | 'selected' | 'empty')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Tất cả người tham gia ({participantCount} người)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="applyTo"
                  value="empty"
                  checked={applyTo === 'empty'}
                  onChange={(e) => setApplyTo(e.target.value as 'all' | 'selected' | 'empty')}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Chỉ người chưa có thông tin ({emptyCount} người)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="applyTo"
                  value="selected"
                  checked={applyTo === 'selected'}
                  onChange={(e) => setApplyTo(e.target.value as 'all' | 'selected' | 'empty')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Chỉ những người được chọn ({selectedIndices.length} người)
                </span>
              </label>
            </div>

            {/* Empty Participants Preview */}
            {applyTo === 'empty' && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Người chưa có {selectedField === 'soThangDong' ? 'số tháng đóng' : selectedField === 'sttHo' ? 'STT hộ' : 'mã BHXH'}:
                  </span>
                </div>
                {emptyCount > 0 ? (
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    {emptyIndices.length <= 10
                      ? `Người ${emptyIndices.map(i => i + 1).join(', ')}`
                      : `Người ${emptyIndices.slice(0, 10).map(i => i + 1).join(', ')} và ${emptyIndices.length - 10} người khác`
                    }
                  </div>
                ) : (
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Tất cả người tham gia đã có thông tin này
                  </div>
                )}
              </div>
            )}

            {/* Participant Selection */}
            {applyTo === 'selected' && (
              <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chọn người tham gia
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={selectAllParticipants}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      Chọn tất cả
                    </button>
                    <button
                      onClick={clearSelection}
                      className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                  {Array.from({ length: participantCount }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => toggleParticipantSelection(index)}
                      className={`p-2 text-sm border rounded transition-colors ${
                        selectedIndices.includes(index)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Action Buttons - Fixed Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={handleApply}
            disabled={
              (selectedField === 'sttHo' && sttHoMode === 'auto')
                ? (applyTo === 'selected' && selectedIndices.length === 0) || (applyTo === 'empty' && emptyCount === 0)
                : selectedField === 'maSoBHXH' && bhxhMode === 'bulk'
                ? (validBhxhCount === 0 || (applyTo === 'selected' && selectedIndices.length === 0) || (applyTo === 'empty' && emptyCount === 0))
                : selectedField === 'maSoBHXH' && bhxhMode === 'single'
                ? (!bhxhInput || (applyTo === 'selected' && selectedIndices.length === 0) || (applyTo === 'empty' && emptyCount === 0))
                : (!selectedValue || (applyTo === 'selected' && selectedIndices.length === 0) || (applyTo === 'empty' && emptyCount === 0))
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedField === 'sttHo' && sttHoMode === 'auto'
              ? 'Điền STT hộ tự động'
              : selectedField === 'maSoBHXH' && bhxhMode === 'bulk'
              ? `Điền ${validBhxhCount} mã BHXH`
              : selectedField === 'maSoBHXH' && bhxhMode === 'single'
              ? 'Điền mã BHXH'
              : 'Áp dụng'
            }
          </button>
        </div>
      </div>
    </div>
  );
};
