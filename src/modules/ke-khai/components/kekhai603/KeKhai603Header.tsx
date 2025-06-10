import React from 'react';
import { DanhSachKeKhai } from '../../../../shared/services/api/supabaseClient';
import { ApiSummary } from '../../../hooks/useKeKhai603Api';
import {
  FileText,
  Loader2,
  Save,
  Send,
  Users,
  Clock,
  CreditCard
} from 'lucide-react';

interface KeKhai603HeaderProps {
  keKhaiInfo: DanhSachKeKhai | null;
  // New props for save and submit actions
  onSaveAll?: () => void;
  onSubmitWithPayment?: () => void;
  saving?: boolean;
  submittingWithPayment?: boolean;
  savingData?: boolean;
  // Household bulk input props
  onHouseholdBulkInput?: () => void;
  householdProcessing?: boolean;
  // Participant count for validation
  participantCount?: number;
}

export const KeKhai603Header: React.FC<KeKhai603HeaderProps> = ({
  keKhaiInfo,
  onSaveAll,
  onSubmitWithPayment,
  saving = false,
  submittingWithPayment = false,
  savingData = false,
  onHouseholdBulkInput,
  householdProcessing = false,
  participantCount = 0
}) => {

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Kê khai 603 - BHYT Hộ gia đình
              </h1>
              {keKhaiInfo && (
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Mã kê khai: <span className="font-medium">{keKhaiInfo.ma_ke_khai}</span>
                  </span>
                  {keKhaiInfo.ten_ke_khai && (
                    <span>• {keKhaiInfo.ten_ke_khai}</span>
                  )}
                  <span className="flex items-center space-x-1">
                    <span>•</span>
                    <div className={`w-2 h-2 rounded-full ${
                      keKhaiInfo.trang_thai === 'submitted'
                        ? 'bg-blue-500'
                        : keKhaiInfo.trang_thai === 'pending_payment'
                        ? 'bg-orange-500'
                        : keKhaiInfo.trang_thai === 'processing'
                        ? 'bg-purple-500'
                        : keKhaiInfo.trang_thai === 'completed'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}></div>
                    <span className="font-medium">
                      {keKhaiInfo.trang_thai === 'submitted' ? 'Chờ duyệt' :
                       keKhaiInfo.trang_thai === 'pending_payment' ? 'Chờ thanh toán' :
                       keKhaiInfo.trang_thai === 'processing' ? 'Đang xử lý' :
                       keKhaiInfo.trang_thai === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Household Bulk Input Button */}
            {onHouseholdBulkInput && keKhaiInfo && (
              <button
                onClick={onHouseholdBulkInput}
                disabled={saving || savingData || householdProcessing || submittingWithPayment}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                title="Nhập hộ gia đình - tự động tăng STT hộ"
              >
                {householdProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Nhập hộ gia đình</span>
                  </>
                )}
              </button>
            )}

            {/* Save All Button */}
            {onSaveAll && keKhaiInfo && (
              <button
                onClick={onSaveAll}
                disabled={submittingWithPayment || saving || savingData || householdProcessing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Ghi dữ liệu</span>
                  </>
                )}
              </button>
            )}



            {/* Submit with Payment Button - For entire declaration */}
            {onSubmitWithPayment && keKhaiInfo && (
              <button
                onClick={onSubmitWithPayment}
                disabled={submittingWithPayment || saving || savingData || householdProcessing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                title="Nộp kê khai và tạo thanh toán ngay lập tức"
              >
                {submittingWithPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Nộp & Thanh toán</span>
                  </>
                )}
              </button>
            )}




          </div>
        </div>
      </div>

      {/* Participant Requirement Warning */}
      {keKhaiInfo && participantCount === 0 && (
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm">
              <span className="font-medium">Lưu ý:</span> Kê khai này chưa có người tham gia nào. Bạn cần thêm ít nhất một người tham gia trước khi có thể nộp kê khai.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
