import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy-loaded pages for code splitting
const HomePage         = lazy(() => import('./pages/HomePage'));
const ProductsPage     = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const CartPage         = lazy(() => import('./pages/CartPage'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const OrdersPage       = lazy(() => import('./pages/OrdersPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"                   element={<HomePage />} />
            <Route path="/products"           element={<ProductsPage />} />
            <Route path="/products/:idOrSlug" element={<ProductDetailPage />} />
            <Route path="/cart"               element={<CartPage />} />
            <Route path="/checkout"           element={<CheckoutPage />} />
            <Route path="/order-success"      element={<OrderSuccessPage />} />
            <Route path="/login"              element={<LoginPage />} />
            <Route path="/register"           element={<RegisterPage />} />
            <Route path="/orders"             element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="*"                   element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
