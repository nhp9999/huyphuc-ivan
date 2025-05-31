import React, { useState } from 'react';
import { Building, Shield, Users, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserOrganization } from '../services/nguoiDungService';

interface OrganizationSelectorProps {
  organizations: UserOrganization[];
  onSelect: (org: UserOrganization) => void;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ organizations, onSelect }) => {
  const [selectedOrg, setSelectedOrg] = useState<UserOrganization | null>(null);
  const { user } = useAuth();

  const getOrganizationIcon = (type: string) => {
    switch (type) {
      case 'cong_ty':
        return <Building className="w-6 h-6 text-blue-600" />;
      case 'co_quan_bhxh':
        return <Shield className="w-6 h-6 text-green-600" />;
      case 'he_thong':
        return <Users className="w-6 h-6 text-purple-600" />;
      default:
        return <Building className="w-6 h-6 text-gray-600" />;
    }
  };

  const getOrganizationTypeName = (type: string) => {
    switch (type) {
      case 'cong_ty':
        return 'Công ty';
      case 'co_quan_bhxh':
        return 'Cơ quan BHXH';
      case 'he_thong':
        return 'Hệ thống';
      default:
        return 'Không xác định';
    }
  };

  const getPermissionLevelBadge = (level: string) => {
    switch (level) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Admin
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            User
          </span>
        );
      default:
        return null;
    }
  };

  const handleContinue = () => {
    if (selectedOrg) {
      onSelect(selectedOrg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Chào mừng, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng chọn tổ chức để bắt đầu làm việc
          </p>
        </div>

        {/* Organizations List */}
        <div className="space-y-3 mb-8">
          {organizations.map((org, index) => (
            <div
              key={`${org.organization_type}-${org.organization_id}-${index}`}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedOrg === org
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
              onClick={() => setSelectedOrg(org)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getOrganizationIcon(org.organization_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {org.organization_name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getOrganizationTypeName(org.organization_type)}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {org.role_name}
                      </span>
                    </div>
                    <div className="mt-2">
                      {getPermissionLevelBadge(org.permission_level)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedOrg === org && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${
                    selectedOrg === org ? 'text-blue-600 transform rotate-90' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Organizations */}
        {organizations.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chưa có quyền truy cập
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Tài khoản của bạn chưa được phân quyền cho bất kỳ tổ chức nào. 
              Vui lòng liên hệ quản trị viên để được cấp quyền.
            </p>
          </div>
        )}

        {/* Continue Button */}
        {organizations.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedOrg}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                selectedOrg
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Tiếp tục</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bạn có thể thay đổi tổ chức làm việc bất kỳ lúc nào trong hệ thống
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelector;
