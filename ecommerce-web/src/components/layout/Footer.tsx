export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">ShopKita</h3>
            <p className="text-sm">Platform belanja online terpercaya dengan jutaan produk pilihan.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Belanja</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white">Semua Produk</a></li>
              <li><a href="/categories" className="hover:text-white">Kategori</a></li>
              <li><a href="/promo" className="hover:text-white">Promo Hari Ini</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Akun</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/orders" className="hover:text-white">Pesanan</a></li>
              <li><a href="/profile" className="hover:text-white">Profil</a></li>
              <li><a href="/wishlist" className="hover:text-white">Wishlist</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-white">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} ShopKita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
