import React, { memo } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Play,
  Edit3,
  Save,
  X,
  Bell,
  DollarSign,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { DanhSachKeKhai } from '../../../shared/services/api/supabaseClient';

interface KeKhaiTableRowProps {
  keKhai: DanhSachKeKhai;
  isSelected: boolean;
  userName: string;
  paymentAmount: number;
  bhxhNotification: any;
  editingHoSoId: number | null;
  editingHoSoValue: string;
  savingHoSo: number | null;
  completingKeKhaiId: number | null;
  exportingKeKhaiId: number | null;
  processingKeKhaiId: number | null;
  loadingBhxhNotifications: boolean;
  onSelect: (keKhaiId: number, checked: boolean) => void;
  onViewDetail: (keKhai: DanhSachKeKhai) => void;
  onContextMenu: (e: React.MouseEvent, keKhai: DanhSachKeKhai) => void;
  onStartEditHoSo: (keKhai: DanhSachKeKhai) => void;
  onSaveHoSo: (keKhaiId: number) => void;
  onCancelEditHoSo: () => void;
  onHoSoKeyPress: (e: React.KeyboardEvent, keKhaiId: number) => void;
  onSetEditingHoSoValue: (value: string) => void;
  onCompleteKeKhai: (keKhai: DanhSachKeKhai) => void;
  onExportD03TK1VNPT: (keKhai: DanhSachKeKhai) => void;
  onSendRequest: (keKhai: DanhSachKeKhai) => void;
  onSetProcessing: (keKhai: DanhSachKeKhai) => void;
  onDeleteKeKhai: (keKhai: DanhSachKeKhai) => void;
  onRefreshBhxhNotification: (keKhai: DanhSachKeKhai) => void;
}

const KeKhaiTableRow: React.FC<KeKhaiTableRowProps> = memo(({
  keKhai,
  isSelected,
  userName,
  paymentAmount,
  bhxhNotification,
  editingHoSoId,
  editingHoSoValue,
  savingHoSo,
  completingKeKhaiId,
  exportingKeKhaiId,
  processingKeKhaiId,
  loadingBhxhNotifications,
  onSelect,
  onViewDetail,
  onContextMenu,
  onStartEditHoSo,
  onSaveHoSo,
  onCancelEditHoSo,
  onHoSoKeyPress,
  onSetEditingHoSoValue,
  onCompleteKeKhai,
  onExportD03TK1VNPT,
  onSendRequest,
  onSetProcessing,
  onDeleteKeKhai,
  onRefreshBhxhNotification
}) => {
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="w-3 h-3 mr-1" />
            Chờ duyệt
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Đang xử lý
          </span>
        );
      case 'pending_payment':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ thanh toán
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã thanh toán
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </span>
        );
      case 'request_sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Play className="w-3 h-3 mr-1" />
            Đã gửi yêu cầu phát sinh
          </span>
        );
      case 'request_confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã xác nhận yêu cầu phát sinh
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  return (
    <tr
      key={keKhai.id}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
      onContextMenu={(e) => onContextMenu(e, keKhai)}
    >
      {/* Checkbox */}
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(keKhai.id, e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>

      {/* Mã kê khai */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button
            onClick={() => onViewDetail(keKhai)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            title="Xem chi tiết kê khai"
          >
            {keKhai.ma_ke_khai}
          </button>
        </div>
      </td>

      {/* Tên kê khai */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={keKhai.ten_ke_khai}>
          {keKhai.ten_ke_khai}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Loại: {keKhai.loai_ke_khai}
        </div>
      </td>

      {/* Trạng thái */}
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(keKhai.trang_thai)}
      </td>

      {/* Người tạo */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {userName || 'Đang tải...'}
      </td>

      {/* Số tiền */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {paymentAmount > 0 ? (
          <span className="font-medium text-green-600 dark:text-green-400">
            {paymentAmount.toLocaleString('vi-VN')} ₫
          </span>
        ) : (
          <span className="text-gray-400">Chưa có</span>
        )}
      </td>

      {/* Mã hồ sơ */}
      <td className="px-6 py-4 whitespace-nowrap">
        {editingHoSoId === keKhai.id ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editingHoSoValue}
              onChange={(e) => onSetEditingHoSoValue(e.target.value)}
              onKeyDown={(e) => onHoSoKeyPress(e, keKhai.id)}
              className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nhập mã hồ sơ"
              autoFocus
            />
            <button
              onClick={() => onSaveHoSo(keKhai.id)}
              disabled={savingHoSo === keKhai.id}
              className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
              title="Lưu mã hồ sơ"
            >
              {savingHoSo === keKhai.id ? (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onCancelEditHoSo}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="Hủy chỉnh sửa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900 dark:text-white">
              {keKhai.ma_ho_so || (
                <span className="text-gray-400 italic">Chưa có</span>
              )}
            </span>
            <button
              onClick={() => onStartEditHoSo(keKhai)}
              className="p-1 text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Chỉnh sửa mã hồ sơ"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </td>

      {/* Thông báo BHXH */}
      <td className="px-6 py-4 max-w-xs">
        {keKhai.ma_ho_so ? (
          <div className="flex items-center space-x-2">
            <div className="flex-1 min-w-0">
              {loadingBhxhNotifications ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-500">Đang tải...</span>
                </div>
              ) : bhxhNotification ? (
                <div className="text-sm text-gray-900 dark:text-white break-words">
                  {bhxhNotification.msg || 'Không có thông báo'}
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Chưa có thông báo</span>
              )}
            </div>
            <button
              onClick={() => onRefreshBhxhNotification(keKhai)}
              disabled={loadingBhxhNotifications}
              className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 flex-shrink-0"
              title="Cập nhật thông báo BHXH"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Cần mã hồ sơ</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          {/* View Detail */}
          <button
            onClick={() => onViewDetail(keKhai)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Export Excel */}
          <button
            onClick={() => onExportD03TK1VNPT(keKhai)}
            disabled={exportingKeKhaiId === keKhai.id}
            className={`${
              exportingKeKhaiId === keKhai.id
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
            }`}
            title="Xuất D03 TK1 VNPT"
          >
            {exportingKeKhaiId === keKhai.id ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
          </button>

          {/* Status-specific actions */}
          {keKhai.trang_thai === 'paid' && (
            <button
              onClick={() => onSendRequest(keKhai)}
              disabled={processingKeKhaiId === keKhai.id}
              className={`${
                processingKeKhaiId === keKhai.id
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'
              }`}
              title="Gửi yêu cầu phát sinh"
            >
              {processingKeKhaiId === keKhai.id ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          )}

          {(keKhai.trang_thai === 'request_sent' || keKhai.trang_thai === 'request_confirmed') && (
            <button
              onClick={() => onCompleteKeKhai(keKhai)}
              disabled={completingKeKhaiId === keKhai.id}
              className={`${
                completingKeKhaiId === keKhai.id
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300'
              }`}
              title="Hoàn thành kê khai"
            >
              {completingKeKhaiId === keKhai.id ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => onDeleteKeKhai(keKhai)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title="Xóa kê khai"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

KeKhaiTableRow.displayName = 'KeKhaiTableRow';

export default KeKhaiTableRow;
