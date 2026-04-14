import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateItemQuantity, removeItem } from '../features/cart/cartSlice';
import type { RootState } from '../app/store';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const cart = useSelector((s: RootState) => s.cart.cart);
  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => sum + (item.variant?.price ?? 0) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-gray-300 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Keranjang Kosong</h2>
        <p className="text-gray-500 mb-6">Tambahkan produk ke keranjang terlebih dahulu</p>
        <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Belanja</h1>
      <p className="text-sm text-gray-500 mb-6">{items.length} produk dipilih</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 shadow-sm">
              <Link to={`/products/${item.product_id}`} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 block">
                {(item.variant?.images?.[0] ?? item.product?.images?.[0]) ? (
                  <img src={item.variant?.images?.[0] ?? item.product?.images?.[0]}
                    alt={item.product?.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_id}`}
                  className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600">
                  {item.product?.name}
                </Link>
                {item.variant?.name && (
                  <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    {item.variant.name}
                  </span>
                )}
                <p className="text-indigo-700 font-bold mt-2 text-sm">
                  {formatIDR(item.variant?.price ?? 0)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between shrink-0">
                <button onClick={() => dispatch(removeItem(item.id))}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => dispatch(updateItemQuantity({ itemId: item.id, quantity: item.quantity - 1 }))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-medium">−</button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateItemQuantity({ itemId: item.id, quantity: item.quantity + 1 }))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-medium">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Belanja</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} produk)</span>
                <span className="font-medium">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Ongkos Kirim</span>
                <span className="text-green-600 font-medium">Pilih di checkout</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total Sementara</span>
                <span className="text-indigo-700">{formatIDR(subtotal)}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: '🔒', text: 'Transaksi\nAman' },
                { icon: '🛡️', text: 'Pembeli\nDilindungi' },
                { icon: '↩️', text: 'Garansi\nReturn' },
              ].map(b => (
                <div key={b.text} className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg">{b.icon}</div>
                  <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-line leading-tight">{b.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login', { state: { from: '/checkout' } })}
              className="w-full mt-5 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
              Lanjut ke Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-indigo-600 mt-3">
              ← Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}
