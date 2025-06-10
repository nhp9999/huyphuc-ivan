import React from 'react';
import { KeKhai603Participant } from '../hooks/useKeKhai603Participants';
import { formatCurrency } from '../../../shared/utils/formatters';

interface PaymentStatusSummaryProps {
  participants: KeKhai603Participant[];
}

const PaymentStatusSummary: React.FC<PaymentStatusSummaryProps> = ({ participants }) => {
  // Calculate payment statistics
  const stats = React.useMemo(() => {
    const totalParticipants = participants.length;
    let unpaidCount = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let failedCount = 0;
    let cancelledCount = 0;
    
    let unpaidAmount = 0;
    let pendingAmount = 0;
    let completedAmount = 0;
    let failedAmount = 0;
    let cancelledAmount = 0;

    participants.forEach(participant => {
      const amount = participant.tienDongThucTe || participant.tienDong || 0;
      const status = participant.paymentStatus || 'unpaid';

      switch (status) {
        case 'completed':
          completedCount++;
          completedAmount += amount;
          break;
        case 'pending':
          pendingCount++;
          pendingAmount += amount;
          break;
        case 'failed':
          failedCount++;
          failedAmount += amount;
          break;
        case 'cancelled':
          cancelledCount++;
          cancelledAmount += amount;
          break;
        case 'unpaid':
        default:
          unpaidCount++;
          unpaidAmount += amount;
          break;
      }
    });

    const totalAmount = unpaidAmount + pendingAmount + completedAmount + failedAmount + cancelledAmount;

    return {
      totalParticipants,
      unpaidCount,
      pendingCount,
      completedCount,
      failedCount,
      cancelledCount,
      unpaidAmount,
      pendingAmount,
      completedAmount,
      failedAmount,
      cancelledAmount,
      totalAmount
    };
  }, [participants]);

  if (participants.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Thống kê thanh toán
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Unpaid */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Chưa thanh toán</span>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unpaidCount}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(stats.unpaidAmount)}</div>
        </div>

        {/* Pending */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Chờ thanh toán</span>
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.pendingCount}</div>
          <div className="text-sm text-orange-600 dark:text-orange-400">{formatCurrency(stats.pendingAmount)}</div>
        </div>

        {/* Completed */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Đã thanh toán</span>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.completedCount}</div>
          <div className="text-sm text-green-600 dark:text-green-400">{formatCurrency(stats.completedAmount)}</div>
        </div>

        {/* Failed */}
        {stats.failedCount > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Thất bại</span>
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.failedCount}</div>
            <div className="text-sm text-red-600 dark:text-red-400">{formatCurrency(stats.failedAmount)}</div>
          </div>
        )}

        {/* Cancelled */}
        {stats.cancelledCount > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã hủy</span>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.cancelledCount}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(stats.cancelledAmount)}</div>
          </div>
        )}

        {/* Total */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng cộng</span>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalParticipants}</div>
          <div className="text-sm text-blue-600 dark:text-blue-400">{formatCurrency(stats.totalAmount)}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiến độ thanh toán</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {stats.completedCount}/{stats.totalParticipants} ({Math.round((stats.completedCount / stats.totalParticipants) * 100)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stats.completedCount / stats.totalParticipants) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Actions */}
      {(stats.unpaidCount > 0 || stats.pendingCount > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.unpaidCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              {stats.unpaidCount} người chưa thanh toán
            </span>
          )}
          {stats.pendingCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
              {stats.pendingCount} người đang chờ thanh toán
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentStatusSummary;
