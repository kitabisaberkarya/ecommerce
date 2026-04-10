import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListProductsQuery, useListCategoriesQuery } from '../api/productApi';
import ProductCard from '../components/common/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('category_id') ?? '';
  const sortBy = searchParams.get('sort_by') ?? 'newest';

  const { data, isLoading } = useListProductsQuery({ page, limit: 20, search, category_id: categoryId || undefined, sort_by: sortBy });
  const { data: categoriesData } = useListCategoriesQuery();

  const updateFilter = (key: string, value: string) => {
    setSearchParams((prev) => { prev.set(key, value); return prev; });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-4">Filter</h3>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Kategori</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => updateFilter('category_id', '')}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg ${!categoryId ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Semua Kategori
                  </button>
                </li>
                {categoriesData?.data?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => updateFilter('category_id', cat.id)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg ${categoryId === cat.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Urutkan</h4>
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort_by', e.target.value)}
                className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga: Termurah</option>
                <option value="price_desc">Harga: Termahal</option>
                <option value="popular">Terpopuler</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="mb-6 flex gap-3">
            <input
              type="text"
              defaultValue={search}
              placeholder="Cari produk..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateFilter('search', (e.target as HTMLInputElement).value);
              }}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">Produk tidak ditemukan</p>
              <p className="text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data?.data?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {/* Pagination */}
              {data?.meta && data.meta.total_pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!data.meta.has_prev}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    ← Sebelumnya
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    {page} / {data.meta.total_pages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data.meta.has_next}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Selanjutnya →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
