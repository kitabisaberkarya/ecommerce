import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useListMyOrdersQuery, useCancelOrderMutation } from '../api/orderApi';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700' },
  confirmed:  { label: 'Dikonfirmasi',        color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Diproses',            color: 'bg-indigo-100 text-indigo-700' },
  shipped:    { label: 'Dikirim',             color: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Selesai',             color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Dibatalkan',          color: 'bg-red-100 text-red-700' },
  refunded:   { label: 'Dikembalikan',        color: 'bg-gray-100 text-gray-700' },
};

export default function OrdersPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useListMyOrdersQuery({ status, page: 1 });
  const [cancelOrder] = useCancelOrderMutation();

  const handleCancel = async (id: string) => {
    if (window.confirm('Yakin ingin membatalkan pesanan ini?')) {
      await cancelOrder({ id, reason: 'Dibatalkan oleh pembeli' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pesanan Saya</h1>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {(['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as string[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              status === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === '' ? 'Semua' : STATUS_MAP[s]?.label ?? s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">Belum ada pesanan</p>
          <Link to="/products" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            Mulai belanja sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data?.map((order) => {
            const statusInfo = STATUS_MAP[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-700' };
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.order_number}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {order.items?.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-t border-gray-50">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 font-medium line-clamp-1">{item.product_name}</p>
                      <p className="text-xs text-gray-500">{item.variant_name} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatIDR(item.subtotal)}</p>
                  </div>
                ))}

                {order.items?.length > 2 && (
                  <p className="text-xs text-gray-400 mt-1">+{order.items.length - 2} produk lainnya</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500">Total: </span>
                    <span className="font-bold text-gray-900">{formatIDR(order.total)}</span>
                  </div>
                  <div className="flex gap-2">
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button onClick={() => handleCancel(order.id)}
                        className="text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50">
                        Batalkan
                      </button>
                    )}
                    <Link to={`/orders/${order.id}`}
                      className="text-xs bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700">
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}
