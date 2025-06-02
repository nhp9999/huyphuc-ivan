import React from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import CSKCBSelector from '../CSKCBSelector';
import styles from './KeKhai603ListModeTable.module.css';

// Import type from the correct location
interface KeKhai603Participant {
  id: number;
  hoTen: string;
  maSoBHXH: string;
  ngaySinh: string;
  gioiTinh: string;
  noiDangKyKCB: string;
  tinhKCB: string;
  maBenhVien: string;
  tenBenhVien: string;
  mucLuong: string;
  tyLeDong: string;
  soTienDong: string;
  tuNgayTheCu: string;
  denNgayTheCu: string;
  ngayBienLai: string;
  sttHo: string;
  soThangDong: string;
  maTinhNkq: string;
  maHuyenNkq: string;
  maXaNkq: string;
  noiNhanHoSo: string;
}

interface KeKhai603ListModeTableProps {
  participants: KeKhai603Participant[];
  handleParticipantChange: (index: number, field: keyof KeKhai603Participant, value: string) => void;
  handleParticipantKeyPress: (e: React.KeyboardEvent, index: number) => void;
  handleAddParticipant: () => void;
  handleRemoveParticipant: (index: number) => void;
  searchLoading: boolean;
  savingData: boolean;
  hasUnsavedChanges?: boolean;
}



export const KeKhai603ListModeTable: React.FC<KeKhai603ListModeTableProps> = ({
  participants,
  handleParticipantChange,
  handleParticipantKeyPress,
  handleAddParticipant,
  handleRemoveParticipant,
  searchLoading,
  savingData,
  hasUnsavedChanges = true
}) => {
  // Helper function để parse số tiền từ format Việt Nam
  const parseVietnameseNumber = (value: string): number => {
    if (!value) return 0;
    // Xử lý format số Việt Nam: "316.000" -> 316000
    const cleanAmount = value.replace(/[.,]/g, '');
    return parseFloat(cleanAmount) || 0;
  };

  // Tính tổng tiền
  const totalAmount = participants.reduce((sum, participant) => {
    const amount = parseVietnameseNumber(participant.soTienDong);
    return sum + amount;
  }, 0);

  // Format số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Danh sách người tham gia BHYT
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nơi KCB mặc định: <span className="font-medium text-blue-600 dark:text-blue-400">Trung tâm Y tế thị xã Tịnh Biên</span>
                <span className="mx-2">•</span>
                <span className="text-gray-500">Đã ẩn: Ngày sinh, Giới tính (mặc định Nam)</span>
              </p>
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Chưa lưu</span>
                  </div>
                  <span className="text-gray-500">Nhấn "Ghi dữ liệu" để lưu</span>
                </div>
              )}
              {!hasUnsavedChanges && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Đã lưu</span>
                  </div>
                  <span className="text-gray-500">Dữ liệu đã được lưu</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleAddParticipant}
            disabled={savingData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm người</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto" style={{ position: 'relative' }}>
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 w-16">STT</th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 w-44">
                  Mã BHXH <span className="text-red-500">*</span>
                  <div className="text-xs text-gray-500 font-normal">10 số</div>
                </th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[200px]">
                  Họ tên <span className="text-red-500">*</span>
                </th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[300px]">
                  Nơi KCB <span className="text-red-500">*</span>
                </th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                  STT hộ
                </th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 w-32">
                  Số tháng
                </th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 w-36">
                  Số tiền
                </th>
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant.id || index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  {/* STT */}
                  <td className="py-4 px-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{index + 1}</span>
                  </td>

                  {/* Mã BHXH */}
                  <td className="py-4 px-3">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={participant.maSoBHXH}
                        onChange={(e) => {
                          // Chỉ cho phép nhập số và giới hạn 10 ký tự
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleParticipantChange(index, 'maSoBHXH', value);
                        }}
                        onKeyDown={(e) => {
                          // Chỉ cho phép: số, Backspace, Delete, Tab, Enter, Arrow keys
                          if (!/[0-9]/.test(e.key) &&
                              !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                            e.preventDefault();
                          } else {
                            handleParticipantKeyPress(e, index);
                          }
                        }}
                        maxLength={10}
                        className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors font-mono ${
                          participant.maSoBHXH && participant.maSoBHXH.length !== 10
                            ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        placeholder="1234567890"
                      />
                      {searchLoading && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                      {/* Character counter with validation */}
                      <div className={`absolute -bottom-5 right-0 text-xs ${
                        participant.maSoBHXH.length === 10
                          ? 'text-green-600 dark:text-green-400'
                          : participant.maSoBHXH.length > 0
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-400'
                      }`}>
                        {participant.maSoBHXH.length}/10
                        {participant.maSoBHXH.length === 10 && (
                          <span className="ml-1">✓</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Họ tên */}
                  <td className="py-4 px-3">
                    <input
                      type="text"
                      value={participant.hoTen}
                      onChange={(e) => handleParticipantChange(index, 'hoTen', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                      placeholder="Nhập họ và tên"
                    />
                  </td>

                  {/* Nơi KCB */}
                  <td className="py-4 px-3">
                    <div className={`w-full ${styles.cskcbTableCell}`}>
                      <CSKCBSelector
                        value={participant.maBenhVien}
                        onChange={(value, cskcb) => {
                          handleParticipantChange(index, 'maBenhVien', value);
                          handleParticipantChange(index, 'tenBenhVien', cskcb?.ten || '');
                          handleParticipantChange(index, 'noiDangKyKCB', cskcb?.ten || '');
                          // Tự động cập nhật tỉnh KCB từ cơ sở KCB được chọn
                          if (cskcb?.ma_tinh) {
                            handleParticipantChange(index, 'tinhKCB', cskcb.ma_tinh);
                          }
                        }}
                        maTinh={participant.tinhKCB}
                        placeholder="Trung tâm Y tế thị xã Tịnh Biên (mặc định)"
                        className="w-full"
                      />
                    </div>
                  </td>

                  {/* STT hộ */}
                  <td className="py-4 px-3">
                    <select
                      value={participant.sttHo}
                      onChange={(e) => handleParticipantChange(index, 'sttHo', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <option value="">Chọn STT</option>
                      <option value="1">1 (100%)</option>
                      <option value="2">2 (70%)</option>
                      <option value="3">3 (60%)</option>
                      <option value="4">4 (50%)</option>
                      <option value="5+">5+ (40%)</option>
                    </select>
                  </td>

                  {/* Số tháng */}
                  <td className="py-4 px-3">
                    <select
                      value={participant.soThangDong}
                      onChange={(e) => handleParticipantChange(index, 'soThangDong', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <option value="">Chọn tháng</option>
                      <option value="3">3 tháng</option>
                      <option value="6">6 tháng</option>
                      <option value="12">12 tháng</option>
                    </select>
                  </td>

                  {/* Số tiền */}
                  <td className="py-4 px-3">
                    <div className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-right font-medium">
                      {participant.soTienDong ?
                        formatCurrency(parseVietnameseNumber(participant.soTienDong)) :
                        <span className="text-gray-400 italic">Tự động tính</span>
                      }
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="py-4 px-3">
                    <button
                      onClick={() => handleRemoveParticipant(index)}
                      disabled={savingData}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Xóa người tham gia"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hiển thị tổng tiền */}
        {participants.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Tổng số người tham gia: <span className="font-bold">{participants.length}</span>
                </span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Tổng số tiền: <span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-blue-600 dark:text-blue-400">Tính toán tự động</span>
                <span className="text-gray-400">•</span>
                {hasUnsavedChanges ? (
                  <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Chưa lưu</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Đã lưu</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {participants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có người tham gia nào. Nhấn "Thêm người" để bắt đầu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
