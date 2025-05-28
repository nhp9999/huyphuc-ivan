import React, { useState } from 'react';
import { History, FileText, Calendar, User, Eye, Download, Filter, Search } from 'lucide-react';

interface Declaration {
  id: string;
  type: 'BHYT' | 'BHXH';
  customerName: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  amount: number;
  description: string;
}

const DeclarationHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'BHYT' | 'BHXH'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processing'>('all');

  // Mock data - in real app this would come from API
  const declarations: Declaration[] = [
    {
      id: 'KK001',
      type: 'BHYT',
      customerName: 'Nguyễn Văn An',
      submissionDate: '2024-01-15',
      status: 'approved',
      amount: 500000,
      description: 'Kê khai BHYT tự nguyện'
    },
    {
      id: 'KK002',
      type: 'BHXH',
      customerName: 'Trần Thị Bình',
      submissionDate: '2024-01-14',
      status: 'processing',
      amount: 800000,
      description: 'Kê khai BHXH tự nguyện'
    },
    {
      id: 'KK003',
      type: 'BHYT',
      customerName: 'Lê Văn Cường',
      submissionDate: '2024-01-13',
      status: 'pending',
      amount: 450000,
      description: 'Kê khai BHYT tự nguyện'
    },
    {
      id: 'KK004',
      type: 'BHXH',
      customerName: 'Phạm Thị Dung',
      submissionDate: '2024-01-12',
      status: 'rejected',
      amount: 750000,
      description: 'Kê khai BHXH tự nguyện'
    },
    {
      id: 'KK005',
      type: 'BHYT',
      customerName: 'Hoàng Văn Em',
      submissionDate: '2024-01-11',
      status: 'approved',
      amount: 520000,
      description: 'Kê khai BHYT tự nguyện'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  const filteredDeclarations = declarations.filter(declaration => {
    const matchesSearch = declaration.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         declaration.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || declaration.type === filterType;
    const matchesStatus = filterStatus === 'all' || declaration.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <History className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử kê khai</h1>
            <p className="text-gray-600 dark:text-gray-400">Quản lý và theo dõi các kê khai đã thực hiện</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã kê khai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả loại</option>
            <option value="BHYT">BHYT</option>
            <option value="BHXH">BHXH</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="processing">Đang xử lý</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredDeclarations.length} kết quả
            </span>
          </div>
        </div>
      </div>

      {/* Declarations List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mã kê khai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDeclarations.map((declaration) => (
                <tr key={declaration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="text-gray-400 mr-2" size={16} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {declaration.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      declaration.type === 'BHYT' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {declaration.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="text-gray-400 mr-2" size={16} />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {declaration.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={16} />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(declaration.submissionDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(declaration.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(declaration.status)}`}>
                      {getStatusText(declaration.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDeclarations.length === 0 && (
          <div className="text-center py-12">
            <History className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Không có kê khai nào</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Không tìm thấy kê khai nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeclarationHistory;
