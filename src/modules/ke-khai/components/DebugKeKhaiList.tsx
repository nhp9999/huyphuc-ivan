import React, { useState, useEffect } from 'react';
import keKhaiService from '../services/keKhaiService';
import { useAuth } from '../../auth';

const DebugKeKhaiList: React.FC = () => {
  const { user } = useAuth();
  const [allDeclarations, setAllDeclarations] = useState<any[]>([]);
  const [approvalDeclarations, setApprovalDeclarations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDebugData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Debug: Loading all declarations...');
      const allData = await keKhaiService.getKeKhaiListForAdmin();
      setAllDeclarations(allData);
      
      console.log('🔍 Debug: Loading approval declarations...');
      const approvalData = await keKhaiService.getKeKhaiForApprovalForAdmin();
      setApprovalDeclarations(approvalData);
      
      console.log('🔍 Debug Results:');
      console.log('- All declarations:', allData.length);
      console.log('- Approval declarations:', approvalData.length);
      
    } catch (err) {
      console.error('Debug error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebugData();
  }, [user?.id]);

  if (!user) {
    return <div>No user logged in</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Debug: Declaration Data</h3>
      
      <button 
        onClick={loadDebugData}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Reload Debug Data'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">All Declarations ({allDeclarations.length})</h4>
          <div className="max-h-64 overflow-y-auto bg-white p-2 rounded border">
            {allDeclarations.map((item, index) => (
              <div key={item.id} className="text-xs mb-1 p-1 border-b">
                <div><strong>#{index + 1}</strong> {item.ma_ke_khai}</div>
                <div>Status: <span className="font-mono">{item.trang_thai}</span></div>
                <div>Created by: {item.created_by}</div>
                <div>Created: {new Date(item.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Approval Declarations ({approvalDeclarations.length})</h4>
          <div className="max-h-64 overflow-y-auto bg-white p-2 rounded border">
            {approvalDeclarations.map((item, index) => (
              <div key={item.id} className="text-xs mb-1 p-1 border-b">
                <div><strong>#{index + 1}</strong> {item.ma_ke_khai}</div>
                <div>Status: <span className="font-mono">{item.trang_thai}</span></div>
                <div>Created by: {item.created_by}</div>
                <div>Created: {new Date(item.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Current User:</strong> {user.id}</p>
        <p><strong>Expected Statuses for Approval:</strong> submitted, processing, pending_payment</p>
      </div>
    </div>
  );
};

export default DebugKeKhaiList;
