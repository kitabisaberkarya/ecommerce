import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductQuery, type ProductVariant } from '../api/productApi';
import { addItem, clearCartState } from '../features/cart/cartSlice';

const MOCK_REVIEWS = [
  { id: 1, name: 'B***o', avatar: 'https://picsum.photos/seed/rev1/40/40', rating: 5, date: '10 Apr 2026', variant: 'Biru / M', text: 'Produk sangat bagus, sesuai deskripsi! Pengiriman cepat dan packing rapi. Sangat puas dengan kualitasnya, worth it banget!', helpful: 47 },
  { id: 2, name: 'S***i', avatar: 'https://picsum.photos/seed/rev2/40/40', rating: 5, date: '5 Apr 2026', variant: 'Hitam / L', text: 'Kualitas top, bahan nyaman dipakai. Sudah pakai 2 minggu tidak ada masalah. Seller responsif dan ramah. Recommended!', helpful: 31 },
  { id: 3, name: 'R***n', avatar: 'https://picsum.photos/seed/rev3/40/40', rating: 4, date: '28 Mar 2026', variant: 'Putih / M', text: 'Bagus sesuai ekspektasi. Sedikit lebih kecil dari ukuran yang biasa saya pakai, tapi overall oke. Akan order lagi.', helpful: 18 },
  { id: 4, name: 'D***a', avatar: 'https://picsum.photos/seed/rev4/40/40', rating: 5, date: '20 Mar 2026', variant: 'Merah / L', text: 'Mantap! Persis seperti di foto. Bahan premium, jahitan kuat. Sudah jadi langganan toko ini. 5 bintang!', helpful: 22 },
];

const RATING_DIST = [
  { star: 5, pct: 71 }, { star: 4, pct: 19 }, { star: 3, pct: 6 }, { star: 2, pct: 2 }, { star: 1, pct: 2 },
];

export default function ProductDetailPage() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { data, isLoading } = useGetProductQuery(idOrSlug ?? '');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = data?.data;
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<'desc' | 'spec' | 'review'>('desc');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product?.variants?.length) setSelectedVariant(product.variants[0]);
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-2xl font-bold text-gray-400 mb-4">Produk tidak ditemukan</p>
      <Link to="/products" className="text-indigo-600 hover:underline">← Kembali ke produk</Link>
    </div>
  );

  const allImages = [
    ...product.images,
    ...(selectedVariant?.images ?? []),
  ].filter((img, idx, arr) => arr.indexOf(img) === idx).slice(0, 6);

  const price = selectedVariant?.price ?? product.variants[0]?.price ?? 0;
  const comparePrice = selectedVariant?.compare_price ?? product.variants[0]?.compare_price ?? 0;
  const discount = comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const stock = selectedVariant?.stock ?? 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    dispatch(addItem({
      product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
      variant: {
        id: selectedVariant.id, name: selectedVariant.name,
        price: selectedVariant.price, compare_price: selectedVariant.compare_price,
        stock: selectedVariant.stock, images: selectedVariant.images,
      },
      quantity: qty,
    }));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    dispatch(clearCartState());
    dispatch(addItem({
      product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
      variant: {
        id: selectedVariant.id, name: selectedVariant.name,
        price: selectedVariant.price, compare_price: selectedVariant.compare_price,
        stock: selectedVariant.stock, images: selectedVariant.images,
      },
      quantity: qty,
    }));
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-indigo-600">Beranda</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600">Produk</Link>
          {product.category && (<><span>/</span>
            <Link to={`/products?category_id=${product.category.id}`} className="hover:text-indigo-600">
              {product.category.name}
            </Link></>
          )}
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Main Grid */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* ── LEFT: Image Gallery ─────────────────────────────────── */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 cursor-zoom-in">
                <img src={allImages[activeImg] || 'https://picsum.photos/seed/default/400/400'}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImg === i ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {/* Share */}
              <div className="flex gap-2 mt-4">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 border border-gray-200 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Bagikan
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                </button>
              </div>
            </div>

            {/* ── RIGHT: Product Info ─────────────────────────────────── */}
            <div className="p-6 flex flex-col gap-4">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {discount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">DISKON {discount}%</span>
                )}
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded">🔥 Terlaris</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">✓ Kondisi Baru</span>
              </div>

              {/* Name */}
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h1>

              {/* Rating & sold */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{product.reviews.toLocaleString('id-ID')} Penilaian</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{(product.reviews * 2).toLocaleString('id-ID')} Terjual</span>
                </div>
              )}

              {/* Price */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-3xl font-extrabold text-indigo-700">{formatIDR(price)}</span>
                  {discount > 0 && (
                    <span className="text-gray-400 line-through text-lg">{formatIDR(comparePrice)}</span>
                  )}
                </div>
                {price >= 500000 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Cicilan mulai <span className="font-semibold text-gray-700">{formatIDR(Math.round(price / 12))}</span>/bulan via kartu kredit
                  </p>
                )}
              </div>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Pilih Varian: <span className="font-normal text-indigo-600">{selectedVariant?.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button key={v.id} onClick={() => { setSelectedVariant(v); setQty(1); }}
                        disabled={v.stock === 0}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                            : v.stock === 0
                              ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                              : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}>
                        {v.name}
                        {v.stock < 10 && v.stock > 0 && <span className="ml-1 text-red-400 text-xs">({v.stock} tersisa)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock indicator */}
              {stock > 0 ? (
                <div className="flex items-center gap-1.5 text-sm">
                  <span className={`w-2 h-2 rounded-full ${stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} />
                  <span className={stock < 10 ? 'text-red-600 font-medium' : 'text-green-600'}>
                    {stock < 10 ? `Sisa ${stock} lagi!` : `Stok tersedia (${stock})`}
                  </span>
                </div>
              ) : (
                <p className="text-red-500 font-semibold text-sm">Stok Habis</p>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Jumlah:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-medium">−</button>
                  <span className="w-10 text-center text-sm font-bold">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(stock, q + 1))}
                    disabled={qty >= stock}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-medium disabled:opacity-40">+</button>
                </div>
                <span className="text-xs text-gray-400">Maks. {product.max_purchase} per transaksi</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button onClick={handleAddToCart} disabled={stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                    addedToCart
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  } disabled:opacity-50`}>
                  {addedToCart ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg> Ditambahkan!</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg> + Keranjang</>
                  )}
                </button>
                <button onClick={handleBuyNow} disabled={stock === 0}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  Beli Sekarang
                </button>
              </div>

              {/* Protection badges */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { icon: '🔒', label: 'Transaksi Aman' },
                  { icon: '🚚', label: 'Garansi Kirim' },
                  { icon: '↩️', label: 'Mudah Return' },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg text-center">
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-xs text-gray-500 font-medium">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seller Card + Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <img src={`https://picsum.photos/seed/seller-${product.seller_id}/48/48`} alt="Seller"
                className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-gray-900 flex items-center gap-1">
                  ShopKita Official
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </p>
                <p className="text-xs text-gray-400">Jakarta Selatan · ⭐ 4.9 · Respon 98%</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-sm border border-indigo-300 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 font-medium">💬 Chat</button>
              <button className="flex-1 text-sm border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 font-medium">🏪 Toko</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Info Pengiriman</h3>
            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex gap-2 items-start">
                <span className="text-lg shrink-0">📦</span>
                <div><p className="font-medium text-gray-800">Dikirim dari Jakarta Selatan</p>
                  <p className="text-xs text-gray-400">Estimasi tiba 2–5 hari kerja</p></div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-lg shrink-0">🚚</span>
                <div><p className="font-medium text-gray-800">Tersedia JNE, J&T, SiCepat, Gosend</p>
                  <p className="text-xs text-gray-400">Mulai dari Rp13.000</p></div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-lg shrink-0">🛡️</span>
                <div><p className="font-medium text-gray-800">Proteksi Pengiriman tersedia</p>
                  <p className="text-xs text-gray-400">Ganti rugi jika paket hilang/rusak</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Deskripsi / Spesifikasi / Ulasan */}
        <div className="bg-white rounded-2xl shadow-sm mt-4 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {([['desc','Deskripsi'],['spec','Spesifikasi'],['review','Ulasan']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-6 py-4 text-sm font-semibold transition-colors ${
                  tab === key
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {label}
                {key === 'review' && <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 rounded">{product.reviews.toLocaleString('id-ID')}</span>}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === 'desc' && (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="text-base">{product.description}</p>
                <ul className="mt-4 space-y-1">
                  <li>✅ Produk original bergaransi resmi</li>
                  <li>✅ Packing aman double bubble wrap</li>
                  <li>✅ Sudah termasuk aksesoris standar</li>
                  <li>✅ Free konsultasi via chat seller</li>
                </ul>
              </div>
            )}
            {tab === 'spec' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-50">
                    {[
                      ['Kondisi', 'Baru'],
                      ['Berat', `${product.weight} gram`],
                      ['Minimum Pembelian', `${product.min_purchase} pcs`],
                      ['Maksimum Pembelian', `${product.max_purchase} pcs`],
                      ['Kategori', product.category?.name ?? '-'],
                      ['SKU', selectedVariant?.sku ?? '-'],
                      ...Object.entries(selectedVariant?.attributes ?? {}).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v as string]),
                    ].map(([k, v]) => (
                      <tr key={k} className="hover:bg-gray-50">
                        <td className="py-3 pr-6 text-gray-500 w-40 font-medium">{k}</td>
                        <td className="py-3 text-gray-800 font-medium">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 'review' && (
              <div>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  {/* Overall rating */}
                  <div className="text-center shrink-0">
                    <p className="text-6xl font-black text-indigo-700">{product.rating.toFixed(1)}</p>
                    <div className="flex justify-center mt-1">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.reviews.toLocaleString('id-ID')} ulasan</p>
                  </div>
                  {/* Rating bars */}
                  <div className="flex-1 space-y-2">
                    {RATING_DIST.map(({ star, pct }) => (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-4 text-right text-gray-500">{star}</span>
                        <svg className="w-3.5 h-3.5 text-yellow-400 fill-current shrink-0" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-gray-500">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Review cards */}
                <div className="space-y-5">
                  {MOCK_REVIEWS.map(rev => (
                    <div key={rev.id} className="border-b border-gray-50 pb-5 last:border-0">
                      <div className="flex items-start gap-3">
                        <img src={rev.avatar} alt={rev.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-gray-800">{rev.name}</span>
                            <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">✓ Pembeli Terverifikasi</span>
                            <span className="text-xs text-gray-400 ml-auto">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} className={`w-3 h-3 fill-current ${s <= rev.rating ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs text-gray-400 ml-1">Varian: {rev.variant}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 leading-relaxed">{rev.text}</p>
                          <button className="mt-2 text-xs text-gray-400 hover:text-gray-600">
                            👍 Membantu ({rev.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-12 bg-gray-200 rounded w-2/3" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}
