import { Link } from 'react-router-dom';
import type { Product } from '../../api/productApi';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const defaultVariant = product.variants?.[0];
  const price = defaultVariant?.price ?? 0;
  const comparePrice = defaultVariant?.compare_price ?? 0;
  const discountPct = comparePrice > price && comparePrice > 0
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  const image = product.images?.[0] || defaultVariant?.images?.[0] || null;

  return (
    <Link to={`/products/${product.slug || product.id}`} className="group block bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      {/* Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-2 leading-snug">{product.name}</p>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-base font-bold text-gray-900">
            {formatIDR(price)}
          </span>
          {discountPct > 0 && (
            <span className="text-xs bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded">
              -{discountPct}%
            </span>
          )}
        </div>

        {comparePrice > price && (
          <p className="text-xs text-gray-400 line-through">{formatIDR(comparePrice)}</p>
        )}

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-500">{product.rating.toFixed(1)} ({product.reviews})</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}
