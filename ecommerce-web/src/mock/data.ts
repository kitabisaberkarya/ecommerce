import type { Product, Category } from '../api/productApi';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-001', name: 'Elektronik', slug: 'elektronik', description: 'Gadget, laptop, smartphone, dan aksesoris elektronik', image_url: 'https://picsum.photos/seed/cat-elektronik/200/200', is_active: true, sort_order: 1 },
  { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria', description: 'Pakaian, sepatu, dan aksesoris pria', image_url: 'https://picsum.photos/seed/cat-fashionpria/200/200', is_active: true, sort_order: 2 },
  { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita', description: 'Pakaian, tas, sepatu wanita tren terkini', image_url: 'https://picsum.photos/seed/cat-fashionwanita/200/200', is_active: true, sort_order: 3 },
  { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur', description: 'Peralatan rumah tangga dan dapur', image_url: 'https://picsum.photos/seed/cat-rumahdapur/200/200', is_active: true, sort_order: 4 },
  { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan', description: 'Skincare, makeup, parfum, dan perawatan tubuh', image_url: 'https://picsum.photos/seed/cat-kecantikan/200/200', is_active: true, sort_order: 5 },
  { id: 'cat-006', name: 'Olahraga', slug: 'olahraga', description: 'Perlengkapan olahraga dan fitness', image_url: 'https://picsum.photos/seed/cat-olahraga/200/200', is_active: true, sort_order: 6 },
  { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi', description: 'Mainan anak, board game, dan hobi kreatif', image_url: 'https://picsum.photos/seed/cat-mainanhobi/200/200', is_active: true, sort_order: 7 },
  { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis', description: 'Buku, novel, dan perlengkapan belajar', image_url: 'https://picsum.photos/seed/cat-buku/200/200', is_active: true, sort_order: 8 },
];

const SELLER = 'seller-demo-001';

export const MOCK_PRODUCTS: Product[] = [
  // ── ELEKTRONIK ──────────────────────────────────────────────────────────────
  {
    id: 'prod-001', seller_id: SELLER, category_id: 'cat-001', name: 'Smartphone Samsung Galaxy A55 5G 8/256GB',
    slug: 'smartphone-samsung-galaxy-a55-5g', status: 'active', weight: 213, condition: 'new',
    min_purchase: 1, max_purchase: 3, rating: 4.7, reviews: 1243,
    description: 'Layar Super AMOLED 120Hz, kamera 50MP OIS, Exynos 1480, baterai 5000mAh fast charging 25W, tahan air IP67.',
    images: ['https://picsum.photos/seed/samsung-a55/400/400'],
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-001-1', sku: 'SAM-A55-BLU', name: 'Biru Laut / 8+256GB', price: 4999000, compare_price: 5999000, stock: 42, images: ['https://picsum.photos/seed/samsung-a55-blue/400/400'], attributes: { warna: 'Biru Laut' }, is_active: true },
      { id: 'var-001-2', sku: 'SAM-A55-BLK', name: 'Hitam / 8+256GB', price: 4999000, compare_price: 5999000, stock: 38, images: ['https://picsum.photos/seed/samsung-a55-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-002', seller_id: SELLER, category_id: 'cat-001', name: 'TWS Earbuds Pro Bluetooth 5.3 ANC 30H',
    slug: 'tws-earbuds-pro-bluetooth-53-anc', status: 'active', weight: 58, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.5, reviews: 876,
    description: 'True wireless ANC, driver 12mm, IPX5, baterai 8 jam + case 30 jam. Latensi 40ms untuk gaming.',
    images: ['https://picsum.photos/seed/tws-earbuds/400/400'],
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-002-1', sku: 'TWS-PRO-WHT', name: 'Putih', price: 299000, compare_price: 449000, stock: 120, images: ['https://picsum.photos/seed/tws-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
      { id: 'var-002-2', sku: 'TWS-PRO-BLK', name: 'Hitam', price: 299000, compare_price: 449000, stock: 95, images: ['https://picsum.photos/seed/tws-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-003', seller_id: SELLER, category_id: 'cat-001', name: 'Laptop ASUS VivoBook 14 Slim Intel i5 16GB 512GB',
    slug: 'laptop-asus-vivobook-14-slim-i5', status: 'active', weight: 1500, condition: 'new',
    min_purchase: 1, max_purchase: 2, rating: 4.6, reviews: 521,
    description: 'Prosesor Intel Core i5-1335U, RAM 16GB DDR5, SSD 512GB NVMe, layar 14" FHD IPS 90Hz, baterai 63Wh, Windows 11.',
    images: ['https://picsum.photos/seed/asus-vivobook/400/400'],
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-003-1', sku: 'ASUS-VB14-SLV', name: 'Silver Metalik', price: 7499000, compare_price: 8999000, stock: 18, images: ['https://picsum.photos/seed/asus-vivobook-silver/400/400'], attributes: { warna: 'Silver' }, is_active: true },
      { id: 'var-003-2', sku: 'ASUS-VB14-BLK', name: 'Hitam', price: 7499000, compare_price: 8999000, stock: 12, images: ['https://picsum.photos/seed/asus-vivobook-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-004', seller_id: SELLER, category_id: 'cat-001', name: 'Smart TV 43 Inch 4K UHD Android Google TV',
    slug: 'smart-tv-43-inch-4k-uhd-android', status: 'active', weight: 8500, condition: 'new',
    min_purchase: 1, max_purchase: 2, rating: 4.4, reviews: 389,
    description: 'Resolusi 4K UHD, panel VA, Google TV, Chromecast, Dolby Audio, 3 HDMI, WiFi dual-band. Netflix & YouTube built-in.',
    images: ['https://picsum.photos/seed/smart-tv-43/400/400'],
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-004-1', sku: 'SMTV-43-BLK', name: 'Hitam', price: 4299000, compare_price: 5499000, stock: 22, images: ['https://picsum.photos/seed/smart-tv-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-005', seller_id: SELLER, category_id: 'cat-001', name: 'Powerbank 20000mAh PD 45W Super Fast Charging',
    slug: 'powerbank-20000mah-pd-45w', status: 'active', weight: 420, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.8, reviews: 2107,
    description: 'Kapasitas 20000mAh, PD 45W, isi laptop & HP sekaligus. 2 USB-A + 1 USB-C, layar LED, slim 15mm.',
    images: ['https://picsum.photos/seed/powerbank-anker/400/400'],
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-005-1', sku: 'PB-20K-BLK', name: 'Hitam', price: 249000, compare_price: 399000, stock: 200, images: ['https://picsum.photos/seed/powerbank-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-005-2', sku: 'PB-20K-WHT', name: 'Putih', price: 249000, compare_price: 399000, stock: 180, images: ['https://picsum.photos/seed/powerbank-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
    ],
  },
  // ── FASHION PRIA ────────────────────────────────────────────────────────────
  {
    id: 'prod-006', seller_id: SELLER, category_id: 'cat-002', name: 'Kemeja Flannel Pria Premium Kotak Lengan Panjang',
    slug: 'kemeja-flannel-pria-premium-kotak', status: 'active', weight: 350, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.6, reviews: 654,
    description: 'Bahan cotton 100% tebal dan lembut. Motif kotak-kotak klasik, cocok casual dan semi-formal.',
    images: ['https://picsum.photos/seed/kemeja-flannel/400/400'],
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-006-1', sku: 'KMJ-FL-M-RED', name: 'Merah / M', price: 169000, compare_price: 249000, stock: 45, images: ['https://picsum.photos/seed/flannel-red/400/400'], attributes: { warna: 'Merah', ukuran: 'M' }, is_active: true },
      { id: 'var-006-2', sku: 'KMJ-FL-L-RED', name: 'Merah / L', price: 169000, compare_price: 249000, stock: 38, images: ['https://picsum.photos/seed/flannel-red/400/400'], attributes: { warna: 'Merah', ukuran: 'L' }, is_active: true },
      { id: 'var-006-3', sku: 'KMJ-FL-M-BLU', name: 'Biru Navy / M', price: 169000, compare_price: 249000, stock: 52, images: ['https://picsum.photos/seed/flannel-blue/400/400'], attributes: { warna: 'Biru Navy', ukuran: 'M' }, is_active: true },
    ],
  },
  {
    id: 'prod-007', seller_id: SELLER, category_id: 'cat-002', name: 'Celana Chino Pria Slim Fit Stretch Anti Kusut',
    slug: 'celana-chino-pria-slim-fit', status: 'active', weight: 400, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.5, reviews: 892,
    description: 'Bahan stretch twill nyaman seharian. Anti-kusut, mudah dicuci, cocok kerja dan santai.',
    images: ['https://picsum.photos/seed/celana-chino/400/400'],
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-007-1', sku: 'CLN-CH-30-KHK', name: 'Khaki / 30', price: 189000, compare_price: 269000, stock: 30, images: ['https://picsum.photos/seed/chino-khaki/400/400'], attributes: { warna: 'Khaki', pinggang: '30' }, is_active: true },
      { id: 'var-007-2', sku: 'CLN-CH-32-KHK', name: 'Khaki / 32', price: 189000, compare_price: 269000, stock: 35, images: ['https://picsum.photos/seed/chino-khaki/400/400'], attributes: { warna: 'Khaki', pinggang: '32' }, is_active: true },
      { id: 'var-007-3', sku: 'CLN-CH-30-NVY', name: 'Navy / 30', price: 189000, compare_price: 269000, stock: 28, images: ['https://picsum.photos/seed/chino-navy/400/400'], attributes: { warna: 'Navy', pinggang: '30' }, is_active: true },
    ],
  },
  {
    id: 'prod-008', seller_id: SELLER, category_id: 'cat-002', name: 'Sepatu Sneakers Pria Casual Running Ringan',
    slug: 'sepatu-sneakers-pria-casual-running', status: 'active', weight: 550, condition: 'new',
    min_purchase: 1, max_purchase: 3, rating: 4.4, reviews: 1203,
    description: 'Upper mesh breathable, sol EVA ringan dan empuk. Cocok sehari-hari dan olahraga ringan.',
    images: ['https://picsum.photos/seed/sepatu-sneaker/400/400'],
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-008-1', sku: 'SPT-SNK-40-WHT', name: 'Putih / 40', price: 359000, compare_price: 499000, stock: 25, images: ['https://picsum.photos/seed/sneaker-white/400/400'], attributes: { warna: 'Putih', ukuran: '40' }, is_active: true },
      { id: 'var-008-2', sku: 'SPT-SNK-41-WHT', name: 'Putih / 41', price: 359000, compare_price: 499000, stock: 30, images: ['https://picsum.photos/seed/sneaker-white/400/400'], attributes: { warna: 'Putih', ukuran: '41' }, is_active: true },
      { id: 'var-008-3', sku: 'SPT-SNK-41-BLK', name: 'Hitam / 41', price: 359000, compare_price: 499000, stock: 28, images: ['https://picsum.photos/seed/sneaker-black/400/400'], attributes: { warna: 'Hitam', ukuran: '41' }, is_active: true },
    ],
  },
  {
    id: 'prod-009', seller_id: SELLER, category_id: 'cat-002', name: 'Jaket Bomber Pria Premium Waterproof Fleece',
    slug: 'jaket-bomber-pria-premium-waterproof', status: 'active', weight: 500, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.7, reviews: 743,
    description: 'Bahan polyester waterproof, lapisan fleece hangat, ribbed collar, kantong dalam dan luar.',
    images: ['https://picsum.photos/seed/jaket-bomber/400/400'],
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-009-1', sku: 'JKT-BOM-M-OLV', name: 'Olive / M', price: 289000, compare_price: 429000, stock: 35, images: ['https://picsum.photos/seed/bomber-olive/400/400'], attributes: { warna: 'Olive', ukuran: 'M' }, is_active: true },
      { id: 'var-009-2', sku: 'JKT-BOM-M-BLK', name: 'Hitam / M', price: 289000, compare_price: 429000, stock: 40, images: ['https://picsum.photos/seed/bomber-black/400/400'], attributes: { warna: 'Hitam', ukuran: 'M' }, is_active: true },
    ],
  },
  {
    id: 'prod-010', seller_id: SELLER, category_id: 'cat-002', name: 'Kaos Polos Pria Cotton Combed 30s Premium',
    slug: 'kaos-polos-pria-cotton-combed-30s', status: 'active', weight: 200, condition: 'new',
    min_purchase: 1, max_purchase: 12, rating: 4.8, reviews: 3204,
    description: 'Cotton combed 30s lembut, adem, tahan lama. Jahitan clean-finish, O-neck, banyak pilihan warna.',
    images: ['https://picsum.photos/seed/kaos-polos/400/400'],
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-010-1', sku: 'KAO-PLO-M-WHT', name: 'Putih / M', price: 79000, compare_price: 119000, stock: 150, images: ['https://picsum.photos/seed/kaos-white/400/400'], attributes: { warna: 'Putih', ukuran: 'M' }, is_active: true },
      { id: 'var-010-2', sku: 'KAO-PLO-L-BLK', name: 'Hitam / L', price: 79000, compare_price: 119000, stock: 135, images: ['https://picsum.photos/seed/kaos-black/400/400'], attributes: { warna: 'Hitam', ukuran: 'L' }, is_active: true },
    ],
  },
  // ── FASHION WANITA ──────────────────────────────────────────────────────────
  {
    id: 'prod-011', seller_id: SELLER, category_id: 'cat-003', name: 'Dress Midi Batik Modern Wanita Elegan',
    slug: 'dress-midi-batik-modern-wanita', status: 'active', weight: 300, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.7, reviews: 534,
    description: 'Katun satin lembut, lengan pendek, kancing depan. Cocok pesta, kondangan, dan acara formal.',
    images: ['https://picsum.photos/seed/dress-batik/400/400'],
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-011-1', sku: 'DRS-BTK-M-NAV', name: 'Navy Motif / M', price: 259000, compare_price: 349000, stock: 35, images: ['https://picsum.photos/seed/dress-navy/400/400'], attributes: { warna: 'Navy Motif', ukuran: 'M' }, is_active: true },
      { id: 'var-011-2', sku: 'DRS-BTK-M-MAR', name: 'Maroon / M', price: 259000, compare_price: 349000, stock: 28, images: ['https://picsum.photos/seed/dress-maroon/400/400'], attributes: { warna: 'Maroon', ukuran: 'M' }, is_active: true },
    ],
  },
  {
    id: 'prod-012', seller_id: SELLER, category_id: 'cat-003', name: 'Hijab Satin Silk Premium Anti Kusut 115x115cm',
    slug: 'hijab-satin-silk-premium', status: 'active', weight: 80, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.8, reviews: 2103,
    description: 'Satin berkualitas tinggi, anti-kusut, jatuh sempurna. Cocok pesta, wisuda, dan keseharian.',
    images: ['https://picsum.photos/seed/hijab-satin/400/400'],
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-012-1', sku: 'HJB-SAT-CRM', name: 'Cream', price: 89000, compare_price: 139000, stock: 200, images: ['https://picsum.photos/seed/hijab-cream/400/400'], attributes: { warna: 'Cream' }, is_active: true },
      { id: 'var-012-2', sku: 'HJB-SAT-BLK', name: 'Hitam', price: 89000, compare_price: 139000, stock: 180, images: ['https://picsum.photos/seed/hijab-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-012-3', sku: 'HJB-SAT-ROS', name: 'Dusty Rose', price: 89000, compare_price: 139000, stock: 165, images: ['https://picsum.photos/seed/hijab-rose/400/400'], attributes: { warna: 'Dusty Rose' }, is_active: true },
    ],
  },
  {
    id: 'prod-013', seller_id: SELLER, category_id: 'cat-003', name: 'Tas Tote Bag Kanvas Wanita Anti Air Premium',
    slug: 'tas-tote-bag-kanvas-wanita-anti-air', status: 'active', weight: 400, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.6, reviews: 1432,
    description: 'Kanvas 12oz anti air, inner pocket, zipper pocket, handle kulit sintetis. Cocok kerja, kuliah, belanja.',
    images: ['https://picsum.photos/seed/tote-bag/400/400'],
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-013-1', sku: 'TAS-TOT-NAT', name: 'Natural', price: 179000, compare_price: 259000, stock: 80, images: ['https://picsum.photos/seed/totebag-natural/400/400'], attributes: { warna: 'Natural' }, is_active: true },
      { id: 'var-013-2', sku: 'TAS-TOT-BLK', name: 'Hitam', price: 179000, compare_price: 259000, stock: 75, images: ['https://picsum.photos/seed/totebag-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-013-3', sku: 'TAS-TOT-SAGE', name: 'Sage Green', price: 179000, compare_price: 259000, stock: 60, images: ['https://picsum.photos/seed/totebag-sage/400/400'], attributes: { warna: 'Sage Green' }, is_active: true },
    ],
  },
  {
    id: 'prod-014', seller_id: SELLER, category_id: 'cat-003', name: 'Sepatu Heels Wanita Block Heel 5cm Comfortable',
    slug: 'sepatu-heels-wanita-block-heel-5cm', status: 'active', weight: 600, condition: 'new',
    min_purchase: 1, max_purchase: 3, rating: 4.4, reviews: 678,
    description: 'Block heel 5cm stabil, upper suede mikro premium, sol anti-slip, cushion insole. Cocok kerja dan pesta.',
    images: ['https://picsum.photos/seed/heels-wanita/400/400'],
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-014-1', sku: 'SPT-HEL-37-BLK', name: 'Hitam / 37', price: 299000, compare_price: 449000, stock: 25, images: ['https://picsum.photos/seed/heels-black/400/400'], attributes: { warna: 'Hitam', ukuran: '37' }, is_active: true },
      { id: 'var-014-2', sku: 'SPT-HEL-37-NUD', name: 'Nude / 37', price: 299000, compare_price: 449000, stock: 18, images: ['https://picsum.photos/seed/heels-nude/400/400'], attributes: { warna: 'Nude', ukuran: '37' }, is_active: true },
    ],
  },
  // ── RUMAH & DAPUR ────────────────────────────────────────────────────────────
  {
    id: 'prod-015', seller_id: SELLER, category_id: 'cat-004', name: 'Rice Cooker Digital 1.8L Multi Fungsi 8 Program',
    slug: 'rice-cooker-digital-18l-multi', status: 'active', weight: 2500, condition: 'new',
    min_purchase: 1, max_purchase: 3, rating: 4.6, reviews: 934,
    description: '8 program: nasi putih, merah, bubur, steam, cake, slow cook. Anti lengket, lapisan teflon tebal.',
    images: ['https://picsum.photos/seed/rice-cooker/400/400'],
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-015-1', sku: 'RC-DIG-18-WHT', name: 'Putih', price: 379000, compare_price: 499000, stock: 55, images: ['https://picsum.photos/seed/ricecooker-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
    ],
  },
  {
    id: 'prod-016', seller_id: SELLER, category_id: 'cat-004', name: 'Air Fryer 4 Liter Digital Touch Screen Hemat Minyak',
    slug: 'air-fryer-4-liter-digital-touch', status: 'active', weight: 3800, condition: 'new',
    min_purchase: 1, max_purchase: 2, rating: 4.7, reviews: 1567,
    description: 'Panel sentuh digital, 8 preset menu, suhu 80-200°C. 95% lebih sedikit minyak, wadah anti-lengket.',
    images: ['https://picsum.photos/seed/air-fryer/400/400'],
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-016-1', sku: 'AF-4L-BLK', name: 'Hitam', price: 459000, compare_price: 699000, stock: 65, images: ['https://picsum.photos/seed/airfryer-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-016-2', sku: 'AF-4L-WHT', name: 'Putih', price: 459000, compare_price: 699000, stock: 48, images: ['https://picsum.photos/seed/airfryer-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
    ],
  },
  {
    id: 'prod-017', seller_id: SELLER, category_id: 'cat-004', name: 'Lampu LED Smart Bulb WiFi 12W RGB 16 Juta Warna',
    slug: 'lampu-led-smart-bulb-wifi-rgb', status: 'active', weight: 95, condition: 'new',
    min_purchase: 1, max_purchase: 20, rating: 4.6, reviews: 2341,
    description: 'WiFi, kompatibel Google Home & Alexa. 16 juta warna RGB, tunable white 2700K-6500K, timer & jadwal.',
    images: ['https://picsum.photos/seed/smart-bulb/400/400'],
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-017-1', sku: 'LMP-LED-E27-1', name: 'E27 / 1 Pcs', price: 89000, compare_price: 139000, stock: 300, images: ['https://picsum.photos/seed/smartbulb-e27/400/400'], attributes: { isi: '1 Pcs' }, is_active: true },
      { id: 'var-017-2', sku: 'LMP-LED-E27-3', name: 'E27 / 3 Pcs', price: 249000, compare_price: 399000, stock: 150, images: ['https://picsum.photos/seed/smartbulb-3/400/400'], attributes: { isi: '3 Pcs' }, is_active: true },
    ],
  },
  // ── KECANTIKAN ──────────────────────────────────────────────────────────────
  {
    id: 'prod-018', seller_id: SELLER, category_id: 'cat-005', name: 'Serum Vitamin C 20% Brightening Glow Whitening',
    slug: 'serum-vitamin-c-20-brightening', status: 'active', weight: 80, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.8, reviews: 3412,
    description: 'L-Ascorbic Acid 20%, Niacinamide 5%, Hyaluronic Acid. Cerahkan & ratakan warna kulit, bebas paraben.',
    images: ['https://picsum.photos/seed/serum-vitc/400/400'],
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-018-1', sku: 'SRM-VITC-30ML', name: '30ml', price: 159000, compare_price: 229000, stock: 200, images: ['https://picsum.photos/seed/serum-30ml/400/400'], attributes: { ukuran: '30ml' }, is_active: true },
      { id: 'var-018-2', sku: 'SRM-VITC-50ML', name: '50ml', price: 219000, compare_price: 319000, stock: 150, images: ['https://picsum.photos/seed/serum-50ml/400/400'], attributes: { ukuran: '50ml' }, is_active: true },
    ],
  },
  {
    id: 'prod-019', seller_id: SELLER, category_id: 'cat-005', name: 'Sunscreen SPF 50+ PA++++ Invisible Matte Finish',
    slug: 'sunscreen-spf-50-invisible-matte', status: 'active', weight: 70, condition: 'new',
    min_purchase: 1, max_purchase: 6, rating: 4.7, reviews: 4521,
    description: 'Invisible, ringan di kulit, matte finish, tidak berminyak, water resistant 80 menit. BPOM certified.',
    images: ['https://picsum.photos/seed/sunscreen/400/400'],
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-019-1', sku: 'SC-SPF50-50ML', name: '50ml', price: 119000, compare_price: 179000, stock: 350, images: ['https://picsum.photos/seed/sunscreen-50ml/400/400'], attributes: { ukuran: '50ml' }, is_active: true },
    ],
  },
  {
    id: 'prod-020', seller_id: SELLER, category_id: 'cat-005', name: 'Parfum Unisex Lokal Oud Agarwood 50ml EDP',
    slug: 'parfum-unisex-oud-agarwood-50ml', status: 'active', weight: 180, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.7, reviews: 987,
    description: 'EDP concentration, tahan 8-12 jam. Top: bergamot & lemon; Heart: oud & rose; Base: amber & musk.',
    images: ['https://picsum.photos/seed/parfum/400/400'],
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-020-1', sku: 'PFM-OUD-50ML', name: '50ml', price: 199000, compare_price: 299000, stock: 85, images: ['https://picsum.photos/seed/parfum-50ml/400/400'], attributes: { ukuran: '50ml' }, is_active: true },
    ],
  },
  {
    id: 'prod-021', seller_id: SELLER, category_id: 'cat-005', name: 'Sheet Mask Brightening Korea 10pcs Box Set',
    slug: 'sheet-mask-brightening-10pcs', status: 'active', weight: 150, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.6, reviews: 5632,
    description: 'Niacinamide + hyaluronic acid + ekstrak white pearl. Cerahkan & lembabkan dalam 15-20 menit.',
    images: ['https://picsum.photos/seed/sheet-mask/400/400'],
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-021-1', sku: 'MSK-SHT-10PCS', name: '10 Pcs', price: 79000, compare_price: 129000, stock: 500, images: ['https://picsum.photos/seed/sheetmask-box/400/400'], attributes: { isi: '10 Pcs' }, is_active: true },
    ],
  },
  // ── OLAHRAGA ────────────────────────────────────────────────────────────────
  {
    id: 'prod-022', seller_id: SELLER, category_id: 'cat-006', name: 'Sepatu Running Pria Air Cushion Foam Breathable',
    slug: 'sepatu-running-pria-air-cushion', status: 'active', weight: 280, condition: 'new',
    min_purchase: 1, max_purchase: 3, rating: 4.6, reviews: 1876,
    description: 'Air cushion foam penyerap benturan, upper mesh breathable, sol karet anti-slip, berat 280g.',
    images: ['https://picsum.photos/seed/sepatu-running/400/400'],
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-022-1', sku: 'SPT-RUN-41-BLU', name: 'Biru / 41', price: 499000, compare_price: 699000, stock: 25, images: ['https://picsum.photos/seed/running-blue/400/400'], attributes: { warna: 'Biru', ukuran: '41' }, is_active: true },
      { id: 'var-022-2', sku: 'SPT-RUN-42-BLU', name: 'Biru / 42', price: 499000, compare_price: 699000, stock: 18, images: ['https://picsum.photos/seed/running-blue/400/400'], attributes: { warna: 'Biru', ukuran: '42' }, is_active: true },
    ],
  },
  {
    id: 'prod-023', seller_id: SELLER, category_id: 'cat-006', name: 'Matras Yoga TPE Premium 6mm Non-Slip Anti Bakteri',
    slug: 'matras-yoga-tpe-premium-6mm', status: 'active', weight: 1500, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.7, reviews: 2345,
    description: 'TPE ramah lingkungan, 183x61cm, double layer non-slip, ringan 1.5kg, tali pengikat. Yoga & pilates.',
    images: ['https://picsum.photos/seed/matras-yoga/400/400'],
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-023-1', sku: 'MAT-YGA-PRP', name: 'Ungu', price: 279000, compare_price: 399000, stock: 80, images: ['https://picsum.photos/seed/yoga-purple/400/400'], attributes: { warna: 'Ungu' }, is_active: true },
      { id: 'var-023-2', sku: 'MAT-YGA-GRN', name: 'Hijau Teal', price: 279000, compare_price: 399000, stock: 65, images: ['https://picsum.photos/seed/yoga-green/400/400'], attributes: { warna: 'Hijau Teal' }, is_active: true },
    ],
  },
  {
    id: 'prod-024', seller_id: SELLER, category_id: 'cat-006', name: 'Tas Gym Olahraga Multifungsi Waterproof 40L',
    slug: 'tas-gym-olahraga-40l-waterproof', status: 'active', weight: 700, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.6, reviews: 1123,
    description: 'Kompartemen sepatu terpisah, kantong basah, laptop sleeve 15.6", polyester 600D waterproof.',
    images: ['https://picsum.photos/seed/tas-gym/400/400'],
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-024-1', sku: 'TAS-GYM-BLK', name: 'Hitam', price: 189000, compare_price: 279000, stock: 70, images: ['https://picsum.photos/seed/tasgym-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-024-2', sku: 'TAS-GYM-NVY', name: 'Navy', price: 189000, compare_price: 279000, stock: 55, images: ['https://picsum.photos/seed/tasgym-navy/400/400'], attributes: { warna: 'Navy' }, is_active: true },
    ],
  },
  // ── MAINAN & HOBI ────────────────────────────────────────────────────────────
  {
    id: 'prod-025', seller_id: SELLER, category_id: 'cat-007', name: 'RC Car Monster Truck 4WD Off-Road 1:12 RTR 40km/h',
    slug: 'rc-car-monster-truck-4wd-off-road', status: 'active', weight: 900, condition: 'new',
    min_purchase: 1, max_purchase: 5, rating: 4.5, reviews: 876,
    description: 'Kecepatan max 40km/jam, jarak 80m, baterai 1500mAh. Suspensi independen, tahan benturan.',
    images: ['https://picsum.photos/seed/rc-car/400/400'],
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-025-1', sku: 'RC-MTC-RED', name: 'Merah', price: 349000, compare_price: 499000, stock: 40, images: ['https://picsum.photos/seed/rccar-red/400/400'], attributes: { warna: 'Merah' }, is_active: true },
      { id: 'var-025-2', sku: 'RC-MTC-BLU', name: 'Biru', price: 349000, compare_price: 499000, stock: 35, images: ['https://picsum.photos/seed/rccar-blue/400/400'], attributes: { warna: 'Biru' }, is_active: true },
    ],
  },
  {
    id: 'prod-026', seller_id: SELLER, category_id: 'cat-007', name: 'Puzzle 1000 Pieces Landscape Pemandangan Alam',
    slug: 'puzzle-1000-pieces-landscape', status: 'active', weight: 500, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.6, reviews: 987,
    description: 'Karton tebal anti melengkung, potongan jigsaw akurat, ukuran jadi 50x70cm. Termasuk kotak cantik.',
    images: ['https://picsum.photos/seed/puzzle/400/400'],
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-026-1', sku: 'PZL-1000-MT1', name: 'Gunung Fuji', price: 149000, compare_price: 229000, stock: 80, images: ['https://picsum.photos/seed/puzzle-fuji/400/400'], attributes: { motif: 'Gunung Fuji' }, is_active: true },
      { id: 'var-026-2', sku: 'PZL-1000-MT2', name: 'Santorini', price: 149000, compare_price: 229000, stock: 65, images: ['https://picsum.photos/seed/puzzle-santorini/400/400'], attributes: { motif: 'Santorini' }, is_active: true },
    ],
  },
  {
    id: 'prod-027', seller_id: SELLER, category_id: 'cat-007', name: 'Drone Mini FPV Camera HD 720p Foldable Stabilizer',
    slug: 'drone-mini-fpv-camera-720p', status: 'active', weight: 95, condition: 'new',
    min_purchase: 1, max_purchase: 3, rating: 4.3, reviews: 543,
    description: 'Kamera HD 720p, FPV real-time, altitude hold, headless mode, 360° flip. Terbang 12 menit.',
    images: ['https://picsum.photos/seed/drone-mini/400/400'],
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-027-1', sku: 'DRN-MNI-BLK', name: 'Hitam', price: 699000, compare_price: 999000, stock: 30, images: ['https://picsum.photos/seed/drone-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-028', seller_id: SELLER, category_id: 'cat-007', name: 'Kartu UNO Deluxe Edition PVC Tahan Air Jumbo',
    slug: 'kartu-uno-deluxe-pvc-jumbo', status: 'active', weight: 180, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.8, reviews: 3456,
    description: '108 kartu PVC premium tahan air, ukuran jumbo 95x63mm. Termasuk kartu special wild & draw-four.',
    images: ['https://picsum.photos/seed/kartu-uno/400/400'],
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-028-1', sku: 'UNO-DLX-108', name: '108 Kartu', price: 89000, compare_price: 129000, stock: 200, images: ['https://picsum.photos/seed/uno-deluxe/400/400'], attributes: {}, is_active: true },
    ],
  },
  // ── BUKU & ALAT TULIS ────────────────────────────────────────────────────────
  {
    id: 'prod-029', seller_id: SELLER, category_id: 'cat-008', name: 'Novel Bumi Seri Pertama Tere Liye (Cetakan Terbaru)',
    slug: 'novel-bumi-tere-liye-cetakan-baru', status: 'active', weight: 350, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.9, reviews: 7823,
    description: 'Petualangan Raib, Seli, dan Ali di dunia paralel. Cetakan baru revisi, cover terbaru, 440 halaman.',
    images: ['https://picsum.photos/seed/novel-bumi/400/400'],
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-029-1', sku: 'BKU-BUM-NEW', name: 'Cetakan Terbaru', price: 89000, compare_price: 119000, stock: 150, images: ['https://picsum.photos/seed/bumi-cover/400/400'], attributes: {}, is_active: true },
    ],
  },
  {
    id: 'prod-030', seller_id: SELLER, category_id: 'cat-008', name: 'Stabilo Boss Highlighter Set 10 Warna + Pouch',
    slug: 'stabilo-boss-set-10-warna', status: 'active', weight: 120, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.8, reviews: 4521,
    description: 'Tinta berbasis air, tidak merusak tinta printer, ujung chisel 2-5mm, tinta tahan pudar.',
    images: ['https://picsum.photos/seed/stabilo-boss/400/400'],
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-030-1', sku: 'STB-BSS-10WRN', name: '10 Warna + Pouch', price: 69000, compare_price: 99000, stock: 300, images: ['https://picsum.photos/seed/stabilo-10/400/400'], attributes: { isi: '10 Warna' }, is_active: true },
    ],
  },
  {
    id: 'prod-031', seller_id: SELLER, category_id: 'cat-008', name: 'Jurnal Bullet A5 Dotted Hardcover 200 Halaman',
    slug: 'jurnal-bullet-a5-dotted-hardcover', status: 'active', weight: 320, condition: 'new',
    min_purchase: 1, max_purchase: 10, rating: 4.7, reviews: 2103,
    description: 'Hardcover, kertas dotted 120gsm anti bleed, 200 halaman, numbered pages, ribbon bookmark.',
    images: ['https://picsum.photos/seed/jurnal-bullet/400/400'],
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-031-1', sku: 'JRN-BUL-BLK', name: 'Hitam', price: 99000, compare_price: 149000, stock: 120, images: ['https://picsum.photos/seed/journal-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-031-2', sku: 'JRN-BUL-GRN', name: 'Forest Green', price: 99000, compare_price: 149000, stock: 80, images: ['https://picsum.photos/seed/journal-green/400/400'], attributes: { warna: 'Forest Green' }, is_active: true },
    ],
  },
];
