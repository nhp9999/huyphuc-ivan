import React, { useState } from 'react';
import { X, Zap, Users, Calendar } from 'lucide-react';

interface QuickFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (field: 'soThangDong' | 'sttHo', value: string, selectedIndices?: number[]) => void;
  participantCount: number;
  doiTuongThamGia?: string;
}

export const QuickFillModal: React.FC<QuickFillModalProps> = ({
  isOpen,
  onClose,
  onApply,
  participantCount,
  doiTuongThamGia
}) => {
  const [selectedField, setSelectedField] = useState<'soThangDong' | 'sttHo'>('soThangDong');
  const [selectedValue, setSelectedValue] = useState('');
  const [applyTo, setApplyTo] = useState<'all' | 'selected'>('all');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!selectedValue) {
      return;
    }

    const indices = applyTo === 'selected' ? selectedIndices : undefined;
    onApply(selectedField, selectedValue, indices);
    handleClose();
  };

  const handleClose = () => {
    setSelectedField('soThangDong');
    setSelectedValue('');
    setApplyTo('all');
    setSelectedIndices([]);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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

        <div className="p-6 space-y-6">
          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Chọn trường cần điền
            </label>
            <div className="grid grid-cols-2 gap-3">
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

          {/* Value Selection */}
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
                  onChange={(e) => setApplyTo(e.target.value as 'all' | 'selected')}
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
                  value="selected"
                  checked={applyTo === 'selected'}
                  onChange={(e) => setApplyTo(e.target.value as 'all' | 'selected')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Chỉ những người được chọn ({selectedIndices.length} người)
                </span>
              </label>
            </div>

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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedValue || (applyTo === 'selected' && selectedIndices.length === 0)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
