import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, Link, Unlink, Save, Users, Building2 } from 'lucide-react';
import { daiLyService } from '../services/daiLyService';
import { donViService } from '../services/donViService';
import { VDaiLyChiTiet, VDonViChiTiet } from '../../../shared/services/api/supabaseClient';

const DaiLyDonViLinkManagement: React.FC = () => {
  const [daiLyList, setDaiLyList] = useState<VDaiLyChiTiet[]>([]);
  const [donViList, setDonViList] = useState<VDonViChiTiet[]>([]);
  const [selectedDaiLy, setSelectedDaiLy] = useState<VDaiLyChiTiet | null>(null);
  const [donViByDaiLy, setDonViByDaiLy] = useState<VDonViChiTiet[]>([]);
  const [unlinkedDonVi, setUnlinkedDonVi] = useState<VDonViChiTiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [daiLyData, donViData] = await Promise.all([
        daiLyService.getAllDaiLy(),
        donViService.getAllDonVi()
      ]);
      setDaiLyList(daiLyData);
      setDonViList(donViData);
      
      // Load unlinked don vi
      const unlinked = donViData.filter(dv => !dv.dai_ly_id);
      setUnlinkedDonVi(unlinked);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle dai ly selection
  const handleDaiLySelect = async (daiLy: VDaiLyChiTiet) => {
    setSelectedDaiLy(daiLy);
    setLoading(true);
    try {
      const donViData = await daiLyService.getDonViByDaiLy(daiLy.id);
      setDonViByDaiLy(donViData);
    } catch (err) {
      console.error('Error loading don vi by dai ly:', err);
      setError('Không thể tải danh sách đơn vị cho đại lý này.');
    } finally {
      setLoading(false);
    }
  };

  // Link don vi to dai ly
  const handleLinkDonVi = async (donViId: number) => {
    if (!selectedDaiLy) return;
    
    setLoading(true);
    try {
      await donViService.updateDaiLyForDonVi(donViId, selectedDaiLy.id);
      
      // Refresh data
      await loadData();
      await handleDaiLySelect(selectedDaiLy);
    } catch (err) {
      console.error('Error linking don vi:', err);
      setError('Có lỗi xảy ra khi liên kết đơn vị.');
    } finally {
      setLoading(false);
    }
  };

  // Unlink don vi from dai ly
  const handleUnlinkDonVi = async (donViId: number) => {
    setLoading(true);
    try {
      await donViService.updateDaiLyForDonVi(donViId, null);
      
      // Refresh data
      await loadData();
      if (selectedDaiLy) {
        await handleDaiLySelect(selectedDaiLy);
      }
    } catch (err) {
      console.error('Error unlinking don vi:', err);
      setError('Có lỗi xảy ra khi hủy liên kết đơn vị.');
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filteredDaiLy = daiLyList.filter(daiLy =>
    daiLy.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    daiLy.ma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUnlinkedDonVi = unlinkedDonVi.filter(donVi =>
    donVi.ten_don_vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (donVi.ma_so_bhxh && donVi.ma_so_bhxh.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý liên kết Đại lý - Đơn vị</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Liên kết và quản lý mối quan hệ giữa đại lý và đơn vị
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm đại lý hoặc đơn vị..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách đại lý */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Danh sách đại lý ({filteredDaiLy.length})
            </h3>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {filteredDaiLy.map((daiLy) => (
              <div
                key={daiLy.id}
                onClick={() => handleDaiLySelect(daiLy)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedDaiLy?.id === daiLy.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">{daiLy.ma}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{daiLy.ten}</div>
                {daiLy.loai_dai_ly && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{daiLy.loai_dai_ly}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Đơn vị của đại lý được chọn */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Link className="w-5 h-5 mr-2 text-green-600" />
              Đơn vị đã liên kết ({donViByDaiLy.length})
            </h3>
            {selectedDaiLy && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Đại lý: {selectedDaiLy.ma} - {selectedDaiLy.ten}
              </p>
            )}
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {selectedDaiLy ? (
              donViByDaiLy.length > 0 ? (
                donViByDaiLy.map((donVi) => (
                  <div key={donVi.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{donVi.ma_so_bhxh}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{donVi.ten_don_vi}</div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">{donVi.loai_dich_vu}</div>
                      </div>
                      <button
                        onClick={() => handleUnlinkDonVi(donVi.id)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        title="Hủy liên kết"
                      >
                        <Unlink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có đơn vị nào được liên kết</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chọn đại lý để xem đơn vị</p>
              </div>
            )}
          </div>
        </div>

        {/* Đơn vị chưa liên kết */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-orange-600" />
              Đơn vị chưa liên kết ({filteredUnlinkedDonVi.length})
            </h3>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {filteredUnlinkedDonVi.length > 0 ? (
              filteredUnlinkedDonVi.map((donVi) => (
                <div key={donVi.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{donVi.ma_so_bhxh}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{donVi.ten_don_vi}</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">{donVi.loai_dich_vu}</div>
                    </div>
                    <button
                      onClick={() => handleLinkDonVi(donVi.id)}
                      disabled={loading || !selectedDaiLy}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                      title="Liên kết với đại lý đã chọn"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Link className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tất cả đơn vị đã được liên kết</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Hướng dẫn sử dụng</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Chọn đại lý:</strong> Click vào đại lý trong danh sách bên trái để xem các đơn vị đã liên kết</li>
          <li>• <strong>Liên kết đơn vị:</strong> Click icon liên kết (🔗) bên cạnh đơn vị chưa liên kết để gán cho đại lý đã chọn</li>
          <li>• <strong>Hủy liên kết:</strong> Click icon hủy liên kết (🔓) để gỡ bỏ liên kết giữa đơn vị và đại lý</li>
          <li>• <strong>Tìm kiếm:</strong> Sử dụng ô tìm kiếm để lọc đại lý hoặc đơn vị theo tên/mã</li>
          <li>• <strong>Làm mới:</strong> Click nút "Làm mới" để cập nhật dữ liệu mới nhất</li>
        </ul>
      </div>
    </div>
  );
};

export default DaiLyDonViLinkManagement;

