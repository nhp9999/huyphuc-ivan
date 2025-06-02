import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Users, AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import congTyService from '../services/congTyService';

interface DaiLy {
  id: number;
  ma: string;
  ten: string;
  cap?: number;
  loai_to_chuc?: string;
  trang_thai: string;
  ngay_tao: string;
}

interface DaiLyManagementSectionProps {
  congTyId?: number; // undefined khi tạo mới
  onDaiLyCountChange?: (count: number) => void;
}

const DaiLyManagementSection: React.FC<DaiLyManagementSectionProps> = ({ 
  congTyId, 
  onDaiLyCountChange 
}) => {
  const [currentDaiLy, setCurrentDaiLy] = useState<DaiLy[]>([]);
  const [availableDaiLy, setAvailableDaiLy] = useState<DaiLy[]>([]);
  const [selectedDaiLy, setSelectedDaiLy] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load dữ liệu khi component mount hoặc congTyId thay đổi
  useEffect(() => {
    if (congTyId) {
      loadCurrentDaiLy();
    }
    loadAvailableDaiLy();
  }, [congTyId]);

  // Thông báo thay đổi số lượng đại lý
  useEffect(() => {
    onDaiLyCountChange?.(currentDaiLy.length);
  }, [currentDaiLy.length, onDaiLyCountChange]);

  // Load đại lý hiện tại của công ty
  const loadCurrentDaiLy = async () => {
    if (!congTyId) return;

    setLoading(true);
    try {
      const data = await congTyService.getDaiLyByCongTy(congTyId);
      setCurrentDaiLy(data);
    } catch (err) {
      console.error('Error loading current dai ly:', err);
      setError('Không thể tải danh sách đại lý hiện tại');
    } finally {
      setLoading(false);
    }
  };

  // Load đại lý có sẵn (chưa thuộc công ty nào)
  const loadAvailableDaiLy = async () => {
    try {
      const data = await congTyService.getAvailableDaiLy();
      setAvailableDaiLy(data);
    } catch (err) {
      console.error('Error loading available dai ly:', err);
      setError('Không thể tải danh sách đại lý có sẵn');
    }
  };

  // Thêm đại lý vào công ty
  const handleAddDaiLy = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!selectedDaiLy || !congTyId) return;

    setLoading(true);
    setError(null);

    try {
      await congTyService.linkDaiLyToCongTy(selectedDaiLy, congTyId);

      // Refresh danh sách
      await loadCurrentDaiLy();
      await loadAvailableDaiLy();

      // Reset form
      setSelectedDaiLy(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding dai ly:', err);
      setError('Không thể thêm đại lý vào công ty');
    } finally {
      setLoading(false);
    }
  };

  // Xóa đại lý khỏi công ty
  const handleRemoveDaiLy = async (daiLyId: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!confirm('Bạn có chắc chắn muốn xóa đại lý này khỏi công ty?')) return;

    setLoading(true);
    setError(null);

    try {
      await congTyService.unlinkDaiLyFromCongTy(daiLyId);

      // Refresh danh sách
      await loadCurrentDaiLy();
      await loadAvailableDaiLy();
    } catch (err) {
      console.error('Error removing dai ly:', err);
      setError('Không thể xóa đại lý khỏi công ty');
    } finally {
      setLoading(false);
    }
  };

  const getCapText = (cap?: number) => {
    switch (cap) {
      case 1: return 'Cấp 1';
      case 2: return 'Cấp 2';
      case 3: return 'Cấp 3';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Quản lý đại lý
          </h3>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
            {currentDaiLy.length} đại lý
          </span>
        </div>
        
        {congTyId && availableDaiLy.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors space-x-1"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm đại lý</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && congTyId && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-blue-900 dark:text-blue-100">Thêm đại lý mới</h4>
          
          <div className="flex space-x-3">
            <select
              value={selectedDaiLy || ''}
              onChange={(e) => setSelectedDaiLy(parseInt(e.target.value))}
              className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Chọn đại lý</option>
              {availableDaiLy.map(daiLy => (
                <option key={daiLy.id} value={daiLy.id}>
                  {daiLy.ten} ({daiLy.ma})
                </option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={handleAddDaiLy}
              disabled={!selectedDaiLy || loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-1"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>Thêm</span>
            </button>
          </div>
        </div>
      )}

      {/* Current Dai Ly List */}
      {congTyId ? (
        <div className="space-y-2">
          {loading && currentDaiLy.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              <span>Đang tải danh sách đại lý...</span>
            </div>
          ) : currentDaiLy.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Công ty chưa có đại lý nào</p>
              {availableDaiLy.length > 0 && (
                <p className="text-sm mt-1">Nhấn "Thêm đại lý" để bắt đầu</p>
              )}
            </div>
          ) : (
            currentDaiLy.map(daiLy => (
              <div
                key={daiLy.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {daiLy.ten}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {daiLy.ma} • {getCapText(daiLy.cap)}
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => handleRemoveDaiLy(daiLy.id, e)}
                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  disabled={loading}
                  title="Xóa đại lý khỏi công ty"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <Building2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Lưu công ty trước để quản lý đại lý</p>
        </div>
      )}

      {/* Available Dai Ly Info */}
      {availableDaiLy.length === 0 && congTyId && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Không có đại lý nào có sẵn để thêm</p>
          <p>Tất cả đại lý đã được phân công cho các công ty khác</p>
        </div>
      )}
    </div>
  );
};

export default DaiLyManagementSection;
