import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { supabase } from './shared/services/api/supabaseClient';

// Test component để kiểm tra hiển thị ảnh CM
const TestPaymentDisplay: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestData = async () => {
      try {
        const { data, error } = await supabase
          .from('thanh_toan')
          .select(`
            id,
            ma_thanh_toan,
            trang_thai,
            so_tien,
            proof_image_url,
            confirmation_note,
            created_at
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error loading test data:', error);
        } else {
          console.log('Test data loaded:', data);
          setPayments(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading test data...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Payment Images Display</h1>
      
      <div className="bg-white rounded-lg shadow border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ảnh CM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Debug Info
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.ma_thanh_toan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(payment.so_tien)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    payment.trang_thai === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {payment.trang_thai === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {payment.proof_image_url ? (
                    <div className="flex flex-col items-center space-y-1">
                      <button
                        onClick={() => {
                          console.log('Image URL:', payment.proof_image_url);
                          // Tạo modal đơn giản để xem ảnh
                          const modal = document.createElement('div');
                          modal.style.cssText = `
                            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                            background: rgba(0,0,0,0.8); display: flex; align-items: center;
                            justify-content: center; z-index: 9999;
                          `;
                          modal.innerHTML = `
                            <div style="max-width: 90%; max-height: 90%; background: white; padding: 20px; border-radius: 8px;">
                              <img src="${payment.proof_image_url}" style="max-width: 100%; max-height: 70vh; object-fit: contain;" />
                              <button onclick="this.parentElement.parentElement.remove()" 
                                style="margin-top: 10px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Đóng
                              </button>
                            </div>
                          `;
                          document.body.appendChild(modal);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title={`Xem ảnh chứng minh (${payment.proof_image_url.startsWith('data:image/') ? 'Base64' : 'URL'})`}
                      >
                        <Image className="w-5 h-5 mx-auto" />
                      </button>
                      <span className="text-xs text-gray-500">
                        {payment.proof_image_url.startsWith('data:image/') ? 'Base64' : 'URL'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-gray-400" title="Chưa có ảnh chứng minh">
                        <Image className="w-5 h-5 mx-auto opacity-30" />
                      </span>
                      <span className="text-xs text-gray-400">
                        Chưa có
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  <div>
                    <div>ID: {payment.id}</div>
                    <div>Has Image: {payment.proof_image_url ? 'Yes' : 'No'}</div>
                    {payment.proof_image_url && (
                      <div>Size: {Math.round(payment.proof_image_url.length / 1024)} KB</div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Debug Information:</h3>
        <pre className="text-xs text-gray-600">
          {JSON.stringify(payments.map(p => ({
            id: p.id,
            ma_thanh_toan: p.ma_thanh_toan,
            has_image: !!p.proof_image_url,
            image_type: p.proof_image_url?.startsWith('data:image/') ? 'base64' : 'url'
          })), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestPaymentDisplay;
