import { Link } from 'react-router-dom';
import { useListProductsQuery, useListCategoriesQuery } from '../api/productApi';
import ProductCard from '../components/common/ProductCard';

export default function HomePage() {
  const { data: productsData, isLoading: productsLoading } = useListProductsQuery({ limit: 8, sort_by: 'newest' });
  const { data: categoriesData } = useListCategoriesQuery();

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Belanja Lebih Mudah,<br />Lebih Hemat
            </h1>
            <p className="text-indigo-100 text-lg mb-8">
              Temukan jutaan produk pilihan dengan harga terbaik dan pengiriman cepat.
            </p>
            <Link to="/products" className="inline-block bg-white text-indigo-700 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors">
              Mulai Belanja
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-white/10 rounded-3xl flex items-center justify-center">
              <svg className="w-32 h-32 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        {categoriesData?.data && categoriesData.data.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Kategori Populer</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
              {categoriesData.data.slice(0, 8).map((cat) => (
                <Link key={cat.id} to={`/products?category_id=${cat.id}`}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-300 hover:shadow-sm transition-all text-center">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-12 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 text-lg font-bold">
                      {cat.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs text-gray-700 font-medium leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Products */}
        <section className="mt-12 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Produk Terbaru</h2>
            <Link to="/products" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Lihat Semua →
            </Link>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsData?.data?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
