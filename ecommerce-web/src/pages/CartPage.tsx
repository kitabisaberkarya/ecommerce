import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '../api/cartApi';
import { setCart } from '../features/cart/cartSlice';
import type { RootState } from '../app/store';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { data, refetch } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();

  useEffect(() => {
    if (data?.data) dispatch(setCart(data.data));
  }, [data, dispatch]);

  const cart = data?.data;
  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => sum + (item.variant?.price ?? 0) * item.quantity, 0);

  const handleQtyChange = async (itemId: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(itemId);
    } else {
      await updateItem({ item_id: itemId, quantity: qty });
    }
    refetch();
  };

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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4">
              {/* Image */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {item.variant?.images?.[0] || item.product?.images?.[0] ? (
                  <img src={item.variant?.images?.[0] || item.product?.images?.[0]} alt={item.product?.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm leading-snug">{item.product?.name}</p>
                {item.variant?.name && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.variant.name}</p>
                )}
                <p className="text-indigo-700 font-semibold mt-2">
                  {formatIDR(item.variant?.price ?? 0)}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg">−</button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Ringkasan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} produk)</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkir</span>
                <span className="text-green-600">Dihitung saat checkout</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
            </div>
            <button
              onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login', { state: { from: '/checkout' } })}
              className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Lanjut ke Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-indigo-600 mt-3">
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
