import React, { useMemo } from 'react';
import { DanhSachKeKhai } from '../../../../shared/services/api/supabaseClient';
import { ApiSummary } from '../../../hooks/useKeKhai603Api';
import {
  FileText,
  Loader2,
  Save,
  Send,
  Users,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle
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
  // Additional props for better validation
  maxParticipants?: number;
  hasUnsavedChanges?: boolean;
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
  participantCount = 0,
  maxParticipants = 50, // Default max participants
  hasUnsavedChanges = false
}) => {

  // Memoized validation logic for better performance
  const validationState = useMemo(() => {
    const isProcessing = saving || savingData || householdProcessing || submittingWithPayment;
    const canAddParticipants = participantCount < maxParticipants;
    const hasParticipants = participantCount > 0;
    const isDeclarationReady = keKhaiInfo && hasParticipants;

    return {
      isProcessing,
      canAddParticipants,
      hasParticipants,
      isDeclarationReady,
      participantLimitReached: participantCount >= maxParticipants
    };
  }, [saving, savingData, householdProcessing, submittingWithPayment, participantCount, maxParticipants, keKhaiInfo]);

  // Memoized status display logic
  const statusInfo = useMemo(() => {
    if (!keKhaiInfo) return null;

    const statusConfig = {
      'submitted': { color: 'bg-blue-500', text: 'Chờ duyệt' },
      'pending_payment': { color: 'bg-orange-500', text: 'Chờ thanh toán' },
      'processing': { color: 'bg-purple-500', text: 'Đang xử lý' },
      'completed': { color: 'bg-green-500', text: 'Hoàn thành' },
      'draft': { color: 'bg-yellow-500', text: 'Bản nháp' }
    };

    return statusConfig[keKhaiInfo.trang_thai as keyof typeof statusConfig] || statusConfig.draft;
  }, [keKhaiInfo?.trang_thai]);

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
                  {statusInfo && (
                    <span className="flex items-center space-x-1">
                      <span>•</span>
                      <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
                      <span className="font-medium">{statusInfo.text}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Household Bulk Input Button */}
            {onHouseholdBulkInput && keKhaiInfo && (
              <div className="relative">
                <button
                  onClick={onHouseholdBulkInput}
                  disabled={validationState.isProcessing || !validationState.canAddParticipants}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    validationState.participantLimitReached
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                  title={
                    validationState.participantLimitReached
                      ? `Đã đạt giới hạn tối đa ${maxParticipants} người tham gia`
                      : 'Nhập hộ gia đình - tự động tăng STT hộ'
                  }
                  aria-label={
                    validationState.participantLimitReached
                      ? 'Không thể thêm người tham gia - đã đạt giới hạn'
                      : 'Nhập hộ gia đình'
                  }
                >
                  {householdProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : validationState.participantLimitReached ? (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      <span>Đã đạt giới hạn</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4" />
                      <span>Nhập hộ gia đình</span>
                    </>
                  )}
                </button>

                {/* Participant count indicator */}
                {participantCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {participantCount}
                  </div>
                )}
              </div>
            )}

            {/* Save All Button */}
            {onSaveAll && keKhaiInfo && (
              <div className="relative">
                <button
                  onClick={onSaveAll}
                  disabled={validationState.isProcessing}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !validationState.hasParticipants
                      ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                  title={
                    !validationState.hasParticipants
                      ? 'Lưu thông tin kê khai (chưa có người tham gia)'
                      : 'Lưu tất cả dữ liệu người tham gia'
                  }
                  aria-label="Lưu tất cả dữ liệu"
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
                      {hasUnsavedChanges && (
                        <span className="ml-1 w-2 h-2 bg-orange-400 rounded-full" title="Có thay đổi chưa lưu" />
                      )}
                    </>
                  )}
                </button>
              </div>
            )}



            {/* Submit with Payment Button - For entire declaration */}
            {onSubmitWithPayment && keKhaiInfo && (
              <button
                onClick={onSubmitWithPayment}
                disabled={validationState.isProcessing || !validationState.isDeclarationReady}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !validationState.isDeclarationReady
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
                title={
                  !validationState.isDeclarationReady
                    ? 'Cần có ít nhất một người tham gia để nộp kê khai'
                    : 'Nộp kê khai và tạo thanh toán ngay lập tức'
                }
                aria-label="Nộp kê khai và thanh toán"
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

      {/* Enhanced Status and Warning Messages */}
      {keKhaiInfo && (
        <>
          {/* No Participants Warning */}
          {!validationState.hasParticipants && (
            <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <span className="font-medium">Lưu ý:</span> Kê khai này chưa có người tham gia nào. Bạn có thể lưu thông tin kê khai, nhưng cần thêm ít nhất một người tham gia trước khi có thể nộp kê khai.
                </div>
              </div>
            </div>
          )}

          {/* Participant Limit Warning */}
          {validationState.participantLimitReached && (
            <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <span className="font-medium">Cảnh báo:</span> Đã đạt giới hạn tối đa {maxParticipants} người tham gia. Không thể thêm người mới.
                </div>
              </div>
            </div>
          )}

          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && validationState.hasParticipants && (
            <div className="px-6 py-3 bg-orange-50 dark:bg-orange-900/20 border-t border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <span className="font-medium">Thông báo:</span> Có thay đổi chưa được lưu. Nhấn "Ghi dữ liệu" để lưu các thay đổi.
                </div>
              </div>
            </div>
          )}

          {/* Success Status */}
          {validationState.hasParticipants && !hasUnsavedChanges && !validationState.isProcessing && (
            <div className="px-6 py-3 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="text-sm">
                  <span className="font-medium">Sẵn sàng:</span> Kê khai có {participantCount} người tham gia và đã được lưu. Bạn có thể nộp kê khai.
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
