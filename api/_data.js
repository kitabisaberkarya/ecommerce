// Shared dummy data for Vercel serverless functions
// Harga dalam IDR (Rupiah)

const SELLER_ID = 'seller-demo-001';

const categories = [
  {
    id: 'cat-001', parent_id: null, name: 'Elektronik', slug: 'elektronik',
    description: 'Gadget, laptop, smartphone, dan aksesoris elektronik terkini',
    image_url: 'https://picsum.photos/seed/cat-elektronik/200/200',
    is_active: true, sort_order: 1, children: []
  },
  {
    id: 'cat-002', parent_id: null, name: 'Fashion Pria', slug: 'fashion-pria',
    description: 'Pakaian, sepatu, dan aksesoris pria berkualitas',
    image_url: 'https://picsum.photos/seed/cat-fashionpria/200/200',
    is_active: true, sort_order: 2, children: []
  },
  {
    id: 'cat-003', parent_id: null, name: 'Fashion Wanita', slug: 'fashion-wanita',
    description: 'Pakaian, tas, sepatu, dan aksesoris wanita tren terkini',
    image_url: 'https://picsum.photos/seed/cat-fashionwanita/200/200',
    is_active: true, sort_order: 3, children: []
  },
  {
    id: 'cat-004', parent_id: null, name: 'Rumah & Dapur', slug: 'rumah-dapur',
    description: 'Peralatan rumah tangga, dapur, dan dekorasi interior',
    image_url: 'https://picsum.photos/seed/cat-rumahdapur/200/200',
    is_active: true, sort_order: 4, children: []
  },
  {
    id: 'cat-005', parent_id: null, name: 'Kecantikan', slug: 'kecantikan',
    description: 'Skincare, makeup, parfum, dan perawatan tubuh',
    image_url: 'https://picsum.photos/seed/cat-kecantikan/200/200',
    is_active: true, sort_order: 5, children: []
  },
  {
    id: 'cat-006', parent_id: null, name: 'Olahraga', slug: 'olahraga',
    description: 'Perlengkapan olahraga, fitness, dan outdoor',
    image_url: 'https://picsum.photos/seed/cat-olahraga/200/200',
    is_active: true, sort_order: 6, children: []
  },
  {
    id: 'cat-007', parent_id: null, name: 'Mainan & Hobi', slug: 'mainan-hobi',
    description: 'Mainan anak, board game, koleksi, dan hobi kreatif',
    image_url: 'https://picsum.photos/seed/cat-mainanhobi/200/200',
    is_active: true, sort_order: 7, children: []
  },
  {
    id: 'cat-008', parent_id: null, name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis',
    description: 'Buku, novel, alat tulis, dan perlengkapan belajar',
    image_url: 'https://picsum.photos/seed/cat-buku/200/200',
    is_active: true, sort_order: 8, children: []
  },
];

const products = [
  // ─── ELEKTRONIK ────────────────────────────────────────────────────────────
  {
    id: 'prod-001', seller_id: SELLER_ID, category_id: 'cat-001',
    name: 'Smartphone Samsung Galaxy A55 5G 8/256GB',
    slug: 'smartphone-samsung-galaxy-a55-5g',
    description: 'Smartphone flagship mid-range dengan layar Super AMOLED 120Hz, kamera utama 50MP OIS, prosesor Exynos 1480, baterai 5000mAh fast charging 25W, dan desain elegan tahan air IP67.',
    images: ['https://picsum.photos/seed/samsung-a55/400/400'],
    status: 'active', weight: 213, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.7, reviews: 1243,
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-001-1', sku: 'SAM-A55-BLU', name: 'Biru Laut / 8+256GB', price: 4999000, compare_price: 5999000, stock: 42, images: ['https://picsum.photos/seed/samsung-a55-blue/400/400'], attributes: { warna: 'Biru Laut', storage: '8+256GB' }, is_active: true },
      { id: 'var-001-2', sku: 'SAM-A55-BLK', name: 'Hitam / 8+256GB', price: 4999000, compare_price: 5999000, stock: 38, images: ['https://picsum.photos/seed/samsung-a55-black/400/400'], attributes: { warna: 'Hitam', storage: '8+256GB' }, is_active: true },
      { id: 'var-001-3', sku: 'SAM-A55-WHT', name: 'Putih / 8+256GB', price: 4999000, compare_price: 5999000, stock: 25, images: ['https://picsum.photos/seed/samsung-a55-white/400/400'], attributes: { warna: 'Putih', storage: '8+256GB' }, is_active: true },
    ],
  },
  {
    id: 'prod-002', seller_id: SELLER_ID, category_id: 'cat-001',
    name: 'TWS Earbuds Pro Bluetooth 5.3 ANC 30H',
    slug: 'tws-earbuds-pro-bluetooth-53-anc',
    description: 'True wireless earbuds dengan Active Noise Cancellation, driver 12mm, latensi rendah 40ms, IPX5 waterproof, baterai 8 jam + case 30 jam total. Cocok untuk gaming dan musik.',
    images: ['https://picsum.photos/seed/tws-earbuds/400/400'],
    status: 'active', weight: 58, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.5, reviews: 876,
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-002-1', sku: 'TWS-PRO-WHT', name: 'Putih', price: 299000, compare_price: 449000, stock: 120, images: ['https://picsum.photos/seed/tws-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
      { id: 'var-002-2', sku: 'TWS-PRO-BLK', name: 'Hitam', price: 299000, compare_price: 449000, stock: 95, images: ['https://picsum.photos/seed/tws-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-003', seller_id: SELLER_ID, category_id: 'cat-001',
    name: 'Laptop ASUS VivoBook 14 Slim Intel i5 16GB 512GB SSD',
    slug: 'laptop-asus-vivobook-14-slim-i5',
    description: 'Laptop tipis dan ringan untuk produktivitas harian. Prosesor Intel Core i5-1335U, RAM 16GB DDR5, SSD 512GB NVMe, layar 14" FHD IPS 90Hz, baterai 63Wh tahan 10 jam, Windows 11.',
    images: ['https://picsum.photos/seed/asus-vivobook/400/400'],
    status: 'active', weight: 1500, condition: 'new', min_purchase: 1, max_purchase: 2,
    rating: 4.6, reviews: 521,
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-003-1', sku: 'ASUS-VB14-SLV', name: 'Silver Metalik', price: 7499000, compare_price: 8999000, stock: 18, images: ['https://picsum.photos/seed/asus-vivobook-silver/400/400'], attributes: { warna: 'Silver Metalik' }, is_active: true },
      { id: 'var-003-2', sku: 'ASUS-VB14-BLK', name: 'Hitam', price: 7499000, compare_price: 8999000, stock: 12, images: ['https://picsum.photos/seed/asus-vivobook-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-004', seller_id: SELLER_ID, category_id: 'cat-001',
    name: 'Smart TV 43 Inch 4K UHD Android TV Google',
    slug: 'smart-tv-43-inch-4k-uhd-android',
    description: 'Televisi pintar 43 inci resolusi 4K UHD, panel VA, Google TV built-in, Chromecast, Dolby Audio, 3 port HDMI, 2 USB, WiFi dual-band. Nikmati Netflix, YouTube, Spotify tanpa dongle.',
    images: ['https://picsum.photos/seed/smart-tv-43/400/400'],
    status: 'active', weight: 8500, condition: 'new', min_purchase: 1, max_purchase: 2,
    rating: 4.4, reviews: 389,
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-004-1', sku: 'SMTV-43-BLK', name: 'Hitam', price: 4299000, compare_price: 5499000, stock: 22, images: ['https://picsum.photos/seed/smart-tv-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-005', seller_id: SELLER_ID, category_id: 'cat-001',
    name: 'Powerbank 20000mAh PD 45W Super Fast Charging',
    slug: 'powerbank-20000mah-pd-45w-fast-charging',
    description: 'Powerbank kapasitas besar 20000mAh dengan teknologi PD 45W. Isi ulang laptop, tablet, dan HP sekaligus. Layar LED indikator, 2 port USB-A, 1 USB-C, ultra slim 15mm.',
    images: ['https://picsum.photos/seed/powerbank-anker/400/400'],
    status: 'active', weight: 420, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.8, reviews: 2107,
    category: { id: 'cat-001', name: 'Elektronik', slug: 'elektronik' },
    variants: [
      { id: 'var-005-1', sku: 'PB-20K-BLK', name: 'Hitam', price: 249000, compare_price: 399000, stock: 200, images: ['https://picsum.photos/seed/powerbank-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-005-2', sku: 'PB-20K-WHT', name: 'Putih', price: 249000, compare_price: 399000, stock: 180, images: ['https://picsum.photos/seed/powerbank-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
    ],
  },

  // ─── FASHION PRIA ───────────────────────────────────────────────────────────
  {
    id: 'prod-006', seller_id: SELLER_ID, category_id: 'cat-002',
    name: 'Kemeja Flannel Pria Premium Kotak-Kotak Lengan Panjang',
    slug: 'kemeja-flannel-pria-premium-kotak',
    description: 'Kemeja flannel premium bahan cotton 100% tebal dan lembut. Cocok untuk casual maupun semi-formal. Motif kotak-kotak klasik, tombol kokoh, jahitan rapi. Tersedia berbagai warna.',
    images: ['https://picsum.photos/seed/kemeja-flannel/400/400'],
    status: 'active', weight: 350, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.6, reviews: 654,
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-006-1', sku: 'KMJ-FL-M-RED', name: 'Merah / M', price: 169000, compare_price: 249000, stock: 45, images: ['https://picsum.photos/seed/flannel-red/400/400'], attributes: { warna: 'Merah', ukuran: 'M' }, is_active: true },
      { id: 'var-006-2', sku: 'KMJ-FL-L-RED', name: 'Merah / L', price: 169000, compare_price: 249000, stock: 38, images: ['https://picsum.photos/seed/flannel-red/400/400'], attributes: { warna: 'Merah', ukuran: 'L' }, is_active: true },
      { id: 'var-006-3', sku: 'KMJ-FL-M-BLU', name: 'Biru Navy / M', price: 169000, compare_price: 249000, stock: 52, images: ['https://picsum.photos/seed/flannel-blue/400/400'], attributes: { warna: 'Biru Navy', ukuran: 'M' }, is_active: true },
      { id: 'var-006-4', sku: 'KMJ-FL-L-BLU', name: 'Biru Navy / L', price: 169000, compare_price: 249000, stock: 41, images: ['https://picsum.photos/seed/flannel-blue/400/400'], attributes: { warna: 'Biru Navy', ukuran: 'L' }, is_active: true },
    ],
  },
  {
    id: 'prod-007', seller_id: SELLER_ID, category_id: 'cat-002',
    name: 'Celana Chino Pria Slim Fit Stretch',
    slug: 'celana-chino-pria-slim-fit-stretch',
    description: 'Celana chino pria slim fit berbahan stretch twill yang nyaman dipakai seharian. Anti-kusut, mudah dicuci, cocok untuk kerja dan santai. Tersedia warna klasik.',
    images: ['https://picsum.photos/seed/celana-chino/400/400'],
    status: 'active', weight: 400, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.5, reviews: 892,
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-007-1', sku: 'CLN-CH-30-KHK', name: 'Khaki / 30', price: 189000, compare_price: 269000, stock: 30, images: ['https://picsum.photos/seed/chino-khaki/400/400'], attributes: { warna: 'Khaki', pinggang: '30' }, is_active: true },
      { id: 'var-007-2', sku: 'CLN-CH-32-KHK', name: 'Khaki / 32', price: 189000, compare_price: 269000, stock: 35, images: ['https://picsum.photos/seed/chino-khaki/400/400'], attributes: { warna: 'Khaki', pinggang: '32' }, is_active: true },
      { id: 'var-007-3', sku: 'CLN-CH-30-NVY', name: 'Navy / 30', price: 189000, compare_price: 269000, stock: 28, images: ['https://picsum.photos/seed/chino-navy/400/400'], attributes: { warna: 'Navy', pinggang: '30' }, is_active: true },
      { id: 'var-007-4', sku: 'CLN-CH-32-NVY', name: 'Navy / 32', price: 189000, compare_price: 269000, stock: 32, images: ['https://picsum.photos/seed/chino-navy/400/400'], attributes: { warna: 'Navy', pinggang: '32' }, is_active: true },
    ],
  },
  {
    id: 'prod-008', seller_id: SELLER_ID, category_id: 'cat-002',
    name: 'Sepatu Sneakers Pria Casual Running Ringan',
    slug: 'sepatu-sneakers-pria-casual-running',
    description: 'Sepatu sneakers pria casual dengan upper mesh breathable, sol EVA ringan dan empuk, desain sporty minimalis. Cocok untuk sehari-hari, jalan santai, atau olahraga ringan.',
    images: ['https://picsum.photos/seed/sepatu-sneaker/400/400'],
    status: 'active', weight: 550, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.4, reviews: 1203,
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-008-1', sku: 'SPT-SNK-40-WHT', name: 'Putih / 40', price: 359000, compare_price: 499000, stock: 25, images: ['https://picsum.photos/seed/sneaker-white/400/400'], attributes: { warna: 'Putih', ukuran: '40' }, is_active: true },
      { id: 'var-008-2', sku: 'SPT-SNK-41-WHT', name: 'Putih / 41', price: 359000, compare_price: 499000, stock: 30, images: ['https://picsum.photos/seed/sneaker-white/400/400'], attributes: { warna: 'Putih', ukuran: '41' }, is_active: true },
      { id: 'var-008-3', sku: 'SPT-SNK-42-WHT', name: 'Putih / 42', price: 359000, compare_price: 499000, stock: 22, images: ['https://picsum.photos/seed/sneaker-white/400/400'], attributes: { warna: 'Putih', ukuran: '42' }, is_active: true },
      { id: 'var-008-4', sku: 'SPT-SNK-41-BLK', name: 'Hitam / 41', price: 359000, compare_price: 499000, stock: 28, images: ['https://picsum.photos/seed/sneaker-black/400/400'], attributes: { warna: 'Hitam', ukuran: '41' }, is_active: true },
    ],
  },
  {
    id: 'prod-009', seller_id: SELLER_ID, category_id: 'cat-002',
    name: 'Jaket Bomber Pria Premium Waterproof',
    slug: 'jaket-bomber-pria-premium-waterproof',
    description: 'Jaket bomber pria premium dengan bahan polyester waterproof ringan, lapisan fleece hangat, ribbed collar, cuff & hem. Kantong dalam dan luar. Cocok untuk semi-outdoor.',
    images: ['https://picsum.photos/seed/jaket-bomber/400/400'],
    status: 'active', weight: 500, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.7, reviews: 743,
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-009-1', sku: 'JKT-BOM-M-OLV', name: 'Olive / M', price: 289000, compare_price: 429000, stock: 35, images: ['https://picsum.photos/seed/bomber-olive/400/400'], attributes: { warna: 'Olive', ukuran: 'M' }, is_active: true },
      { id: 'var-009-2', sku: 'JKT-BOM-L-OLV', name: 'Olive / L', price: 289000, compare_price: 429000, stock: 30, images: ['https://picsum.photos/seed/bomber-olive/400/400'], attributes: { warna: 'Olive', ukuran: 'L' }, is_active: true },
      { id: 'var-009-3', sku: 'JKT-BOM-M-BLK', name: 'Hitam / M', price: 289000, compare_price: 429000, stock: 40, images: ['https://picsum.photos/seed/bomber-black/400/400'], attributes: { warna: 'Hitam', ukuran: 'M' }, is_active: true },
    ],
  },
  {
    id: 'prod-010', seller_id: SELLER_ID, category_id: 'cat-002',
    name: 'Kaos Polos Pria Cotton Combed 30s Premium',
    slug: 'kaos-polos-pria-cotton-combed-30s',
    description: 'Kaos polos pria berbahan cotton combed 30s yang lembut, adem, dan tahan lama. Jahitan clean-finish, leher bulat/O-neck. Tersedia banyak pilihan warna solid.',
    images: ['https://picsum.photos/seed/kaos-polos/400/400'],
    status: 'active', weight: 200, condition: 'new', min_purchase: 1, max_purchase: 12,
    rating: 4.8, reviews: 3204,
    category: { id: 'cat-002', name: 'Fashion Pria', slug: 'fashion-pria' },
    variants: [
      { id: 'var-010-1', sku: 'KAO-PLO-M-WHT', name: 'Putih / M', price: 79000, compare_price: 119000, stock: 150, images: ['https://picsum.photos/seed/kaos-white/400/400'], attributes: { warna: 'Putih', ukuran: 'M' }, is_active: true },
      { id: 'var-010-2', sku: 'KAO-PLO-L-WHT', name: 'Putih / L', price: 79000, compare_price: 119000, stock: 140, images: ['https://picsum.photos/seed/kaos-white/400/400'], attributes: { warna: 'Putih', ukuran: 'L' }, is_active: true },
      { id: 'var-010-3', sku: 'KAO-PLO-M-BLK', name: 'Hitam / M', price: 79000, compare_price: 119000, stock: 160, images: ['https://picsum.photos/seed/kaos-black/400/400'], attributes: { warna: 'Hitam', ukuran: 'M' }, is_active: true },
      { id: 'var-010-4', sku: 'KAO-PLO-L-BLK', name: 'Hitam / L', price: 79000, compare_price: 119000, stock: 135, images: ['https://picsum.photos/seed/kaos-black/400/400'], attributes: { warna: 'Hitam', ukuran: 'L' }, is_active: true },
    ],
  },

  // ─── FASHION WANITA ─────────────────────────────────────────────────────────
  {
    id: 'prod-011', seller_id: SELLER_ID, category_id: 'cat-003',
    name: 'Dress Midi Batik Modern Wanita Elegan',
    slug: 'dress-midi-batik-modern-wanita',
    description: 'Dress midi wanita dengan motif batik modern yang elegan. Bahan katun satin lembut dan adem, lengan pendek, kancing depan, cocok untuk pesta, kondangan, dan acara formal semi-formal.',
    images: ['https://picsum.photos/seed/dress-batik/400/400'],
    status: 'active', weight: 300, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.7, reviews: 534,
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-011-1', sku: 'DRS-BTK-S-NAV', name: 'Navy Motif / S', price: 259000, compare_price: 349000, stock: 30, images: ['https://picsum.photos/seed/dress-navy/400/400'], attributes: { warna: 'Navy Motif', ukuran: 'S' }, is_active: true },
      { id: 'var-011-2', sku: 'DRS-BTK-M-NAV', name: 'Navy Motif / M', price: 259000, compare_price: 349000, stock: 35, images: ['https://picsum.photos/seed/dress-navy/400/400'], attributes: { warna: 'Navy Motif', ukuran: 'M' }, is_active: true },
      { id: 'var-011-3', sku: 'DRS-BTK-M-MAR', name: 'Maroon Motif / M', price: 259000, compare_price: 349000, stock: 28, images: ['https://picsum.photos/seed/dress-maroon/400/400'], attributes: { warna: 'Maroon Motif', ukuran: 'M' }, is_active: true },
    ],
  },
  {
    id: 'prod-012', seller_id: SELLER_ID, category_id: 'cat-003',
    name: 'Hijab Satin Silk Premium Anti Kusut',
    slug: 'hijab-satin-silk-premium-anti-kusut',
    description: 'Hijab satin silk premium dengan bahan satin berkualitas tinggi, anti-kusut, jatuh sempurna, lembut di kulit. Ukuran 115x115cm. Cocok untuk pesta, wisuda, dan keseharian.',
    images: ['https://picsum.photos/seed/hijab-satin/400/400'],
    status: 'active', weight: 80, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.8, reviews: 2103,
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-012-1', sku: 'HJB-SAT-CRM', name: 'Cream', price: 89000, compare_price: 139000, stock: 200, images: ['https://picsum.photos/seed/hijab-cream/400/400'], attributes: { warna: 'Cream' }, is_active: true },
      { id: 'var-012-2', sku: 'HJB-SAT-BLK', name: 'Hitam', price: 89000, compare_price: 139000, stock: 180, images: ['https://picsum.photos/seed/hijab-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-012-3', sku: 'HJB-SAT-ROS', name: 'Dusty Rose', price: 89000, compare_price: 139000, stock: 165, images: ['https://picsum.photos/seed/hijab-rose/400/400'], attributes: { warna: 'Dusty Rose' }, is_active: true },
      { id: 'var-012-4', sku: 'HJB-SAT-MNT', name: 'Mint', price: 89000, compare_price: 139000, stock: 120, images: ['https://picsum.photos/seed/hijab-mint/400/400'], attributes: { warna: 'Mint' }, is_active: true },
    ],
  },
  {
    id: 'prod-013', seller_id: SELLER_ID, category_id: 'cat-003',
    name: 'Blouse Korea Wanita Lengan Balon Kekinian',
    slug: 'blouse-korea-wanita-lengan-balon',
    description: 'Blouse wanita model Korea terkini dengan lengan balon puff sleeve yang modis. Bahan rayon sifon premium, nyaman dan adem. Cocok dipadupadankan dengan rok maupun celana.',
    images: ['https://picsum.photos/seed/blouse-korea/400/400'],
    status: 'active', weight: 180, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.5, reviews: 876,
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-013-1', sku: 'BLS-KOR-S-WHT', name: 'Putih / S', price: 159000, compare_price: 229000, stock: 45, images: ['https://picsum.photos/seed/blouse-white/400/400'], attributes: { warna: 'Putih', ukuran: 'S' }, is_active: true },
      { id: 'var-013-2', sku: 'BLS-KOR-M-WHT', name: 'Putih / M', price: 159000, compare_price: 229000, stock: 50, images: ['https://picsum.photos/seed/blouse-white/400/400'], attributes: { warna: 'Putih', ukuran: 'M' }, is_active: true },
      { id: 'var-013-3', sku: 'BLS-KOR-M-PNK', name: 'Pink / M', price: 159000, compare_price: 229000, stock: 38, images: ['https://picsum.photos/seed/blouse-pink/400/400'], attributes: { warna: 'Pink', ukuran: 'M' }, is_active: true },
    ],
  },
  {
    id: 'prod-014', seller_id: SELLER_ID, category_id: 'cat-003',
    name: 'Tas Tote Bag Kanvas Wanita Anti Air',
    slug: 'tas-tote-bag-kanvas-wanita-anti-air',
    description: 'Tas tote bag kanvas premium anti air berkapasitas besar. Dengan inner pocket, zipper pocket, bahan canvas 12oz tebal, handle kulit sintetis kuat. Cocok untuk kerja, kuliah, belanja.',
    images: ['https://picsum.photos/seed/tote-bag/400/400'],
    status: 'active', weight: 400, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.6, reviews: 1432,
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-014-1', sku: 'TAS-TOT-NAT', name: 'Natural', price: 179000, compare_price: 259000, stock: 80, images: ['https://picsum.photos/seed/totebag-natural/400/400'], attributes: { warna: 'Natural' }, is_active: true },
      { id: 'var-014-2', sku: 'TAS-TOT-BLK', name: 'Hitam', price: 179000, compare_price: 259000, stock: 75, images: ['https://picsum.photos/seed/totebag-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-014-3', sku: 'TAS-TOT-SAGE', name: 'Sage Green', price: 179000, compare_price: 259000, stock: 60, images: ['https://picsum.photos/seed/totebag-sage/400/400'], attributes: { warna: 'Sage Green' }, is_active: true },
    ],
  },
  {
    id: 'prod-015', seller_id: SELLER_ID, category_id: 'cat-003',
    name: 'Sepatu Heels Wanita Block Heel 5cm Comfortable',
    slug: 'sepatu-heels-wanita-block-heel-5cm',
    description: 'Sepatu heels wanita dengan block heel 5cm yang nyaman dan stabil. Upper bahan suede mikro premium, sol anti-slip, dilengkapi cushion insole. Cocok untuk kerja, pesta, dan acara formal.',
    images: ['https://picsum.photos/seed/heels-wanita/400/400'],
    status: 'active', weight: 600, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.4, reviews: 678,
    category: { id: 'cat-003', name: 'Fashion Wanita', slug: 'fashion-wanita' },
    variants: [
      { id: 'var-015-1', sku: 'SPT-HEL-36-BLK', name: 'Hitam / 36', price: 299000, compare_price: 449000, stock: 20, images: ['https://picsum.photos/seed/heels-black/400/400'], attributes: { warna: 'Hitam', ukuran: '36' }, is_active: true },
      { id: 'var-015-2', sku: 'SPT-HEL-37-BLK', name: 'Hitam / 37', price: 299000, compare_price: 449000, stock: 25, images: ['https://picsum.photos/seed/heels-black/400/400'], attributes: { warna: 'Hitam', ukuran: '37' }, is_active: true },
      { id: 'var-015-3', sku: 'SPT-HEL-37-NUD', name: 'Nude / 37', price: 299000, compare_price: 449000, stock: 18, images: ['https://picsum.photos/seed/heels-nude/400/400'], attributes: { warna: 'Nude', ukuran: '37' }, is_active: true },
    ],
  },

  // ─── RUMAH & DAPUR ──────────────────────────────────────────────────────────
  {
    id: 'prod-016', seller_id: SELLER_ID, category_id: 'cat-004',
    name: 'Rice Cooker Digital 1.8L Multi Fungsi Penghangat',
    slug: 'rice-cooker-digital-18l-multi-fungsi',
    description: 'Rice cooker digital 1.8L dengan 8 program memasak: nasi putih, nasi merah, bubur, steam, cake, slow cook, dan keep warm otomatis. Anti lengket, lapisan teflon tebal, mudah dibersihkan.',
    images: ['https://picsum.photos/seed/rice-cooker/400/400'],
    status: 'active', weight: 2500, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.6, reviews: 934,
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-016-1', sku: 'RC-DIG-18-WHT', name: 'Putih', price: 379000, compare_price: 499000, stock: 55, images: ['https://picsum.photos/seed/ricecooker-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
      { id: 'var-016-2', sku: 'RC-DIG-18-SLV', name: 'Silver', price: 399000, compare_price: 519000, stock: 40, images: ['https://picsum.photos/seed/ricecooker-silver/400/400'], attributes: { warna: 'Silver' }, is_active: true },
    ],
  },
  {
    id: 'prod-017', seller_id: SELLER_ID, category_id: 'cat-004',
    name: 'Air Fryer 4 Liter Digital Touch Screen Low Oil',
    slug: 'air-fryer-4-liter-digital-touch-screen',
    description: 'Air fryer 4 liter dengan panel sentuh digital, 8 preset menu otomatis, suhu dapat diatur 80-200°C. Masak lebih sehat dengan 95% lebih sedikit minyak. Wadah anti-lengket mudah dicuci.',
    images: ['https://picsum.photos/seed/air-fryer/400/400'],
    status: 'active', weight: 3800, condition: 'new', min_purchase: 1, max_purchase: 2,
    rating: 4.7, reviews: 1567,
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-017-1', sku: 'AF-4L-BLK', name: 'Hitam', price: 459000, compare_price: 699000, stock: 65, images: ['https://picsum.photos/seed/airfryer-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-017-2', sku: 'AF-4L-WHT', name: 'Putih', price: 459000, compare_price: 699000, stock: 48, images: ['https://picsum.photos/seed/airfryer-white/400/400'], attributes: { warna: 'Putih' }, is_active: true },
    ],
  },
  {
    id: 'prod-018', seller_id: SELLER_ID, category_id: 'cat-004',
    name: 'Set Panci 5pcs Stainless Steel 316 Anti Karat',
    slug: 'set-panci-5pcs-stainless-steel-316',
    description: 'Set panci lengkap 5 buah: panci sup 24cm, panci susu 16cm, panci serbaguna 20cm, wok anti lengket 28cm, dan panci presto mini. Material stainless steel 316 food grade, tahan lama.',
    images: ['https://picsum.photos/seed/set-panci/400/400'],
    status: 'active', weight: 4500, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.5, reviews: 423,
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-018-1', sku: 'PAN-SET-5PCS', name: 'Set 5 Pcs', price: 349000, compare_price: 499000, stock: 30, images: ['https://picsum.photos/seed/panci-set/400/400'], attributes: {}, is_active: true },
    ],
  },
  {
    id: 'prod-019', seller_id: SELLER_ID, category_id: 'cat-004',
    name: 'Lampu LED Smart Bulb WiFi 12W RGB Tunable White',
    slug: 'lampu-led-smart-bulb-wifi-12w-rgb',
    description: 'Lampu LED pintar 12W WiFi kompatibel dengan Google Home, Alexa, SmartThings. 16 juta warna RGB + tunable white 2700K-6500K. Timer, jadwal, grup kontrol via smartphone.',
    images: ['https://picsum.photos/seed/smart-bulb/400/400'],
    status: 'active', weight: 95, condition: 'new', min_purchase: 1, max_purchase: 20,
    rating: 4.6, reviews: 2341,
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-019-1', sku: 'LMP-LED-E27', name: 'E27 / 1 Pcs', price: 89000, compare_price: 139000, stock: 300, images: ['https://picsum.photos/seed/smartbulb-e27/400/400'], attributes: { socket: 'E27', isi: '1 Pcs' }, is_active: true },
      { id: 'var-019-2', sku: 'LMP-LED-E27-3', name: 'E27 / 3 Pcs', price: 249000, compare_price: 399000, stock: 150, images: ['https://picsum.photos/seed/smartbulb-e27-3/400/400'], attributes: { socket: 'E27', isi: '3 Pcs' }, is_active: true },
    ],
  },
  {
    id: 'prod-020', seller_id: SELLER_ID, category_id: 'cat-004',
    name: 'Vacuum Cleaner Portable Cordless 120W Cyclone',
    slug: 'vacuum-cleaner-portable-cordless-120w',
    description: 'Vacuum cleaner tanpa kabel 120W dengan teknologi cyclone separator. Baterai 2500mAh, hisap kuat 20kPa, HEPA filter, ringan hanya 1.2kg. Cocok untuk sofa, kasur, dan lantai.',
    images: ['https://picsum.photos/seed/vacuum-cleaner/400/400'],
    status: 'active', weight: 1200, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.4, reviews: 765,
    category: { id: 'cat-004', name: 'Rumah & Dapur', slug: 'rumah-dapur' },
    variants: [
      { id: 'var-020-1', sku: 'VAC-COR-BLU', name: 'Biru', price: 449000, compare_price: 649000, stock: 40, images: ['https://picsum.photos/seed/vacuum-blue/400/400'], attributes: { warna: 'Biru' }, is_active: true },
    ],
  },

  // ─── KECANTIKAN ─────────────────────────────────────────────────────────────
  {
    id: 'prod-021', seller_id: SELLER_ID, category_id: 'cat-005',
    name: 'Serum Vitamin C 20% Brightening Glow Whitening',
    slug: 'serum-vitamin-c-20-brightening-glow',
    description: 'Serum wajah Vitamin C 20% yang efektif mencerahkan, meratakan warna kulit, dan melawan tanda penuaan. Kandungan L-Ascorbic Acid, Niacinamide 5%, Hyaluronic Acid, bebas paraben dan alkohol.',
    images: ['https://picsum.photos/seed/serum-vitc/400/400'],
    status: 'active', weight: 80, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.8, reviews: 3412,
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-021-1', sku: 'SRM-VITC-30ML', name: '30ml', price: 159000, compare_price: 229000, stock: 200, images: ['https://picsum.photos/seed/serum-30ml/400/400'], attributes: { ukuran: '30ml' }, is_active: true },
      { id: 'var-021-2', sku: 'SRM-VITC-50ML', name: '50ml', price: 219000, compare_price: 319000, stock: 150, images: ['https://picsum.photos/seed/serum-50ml/400/400'], attributes: { ukuran: '50ml' }, is_active: true },
    ],
  },
  {
    id: 'prod-022', seller_id: SELLER_ID, category_id: 'cat-005',
    name: 'Sunscreen SPF 50+ PA++++ Invisible Matte Finish',
    slug: 'sunscreen-spf-50-pa-invisible-matte',
    description: 'Sunscreen dengan perlindungan SPF 50+ PA++++ yang invisible dan ringan di kulit. Formula matte finish, tidak berminyak, water resistant 80 menit, cocok sebagai base makeup. BPOM certified.',
    images: ['https://picsum.photos/seed/sunscreen/400/400'],
    status: 'active', weight: 70, condition: 'new', min_purchase: 1, max_purchase: 6,
    rating: 4.7, reviews: 4521,
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-022-1', sku: 'SC-SPF50-50ML', name: '50ml', price: 119000, compare_price: 179000, stock: 350, images: ['https://picsum.photos/seed/sunscreen-50ml/400/400'], attributes: { ukuran: '50ml' }, is_active: true },
    ],
  },
  {
    id: 'prod-023', seller_id: SELLER_ID, category_id: 'cat-005',
    name: 'Foundation Matte Cover 24H Full Coverage Buildable',
    slug: 'foundation-matte-cover-24h-full-coverage',
    description: 'Foundation dengan coverage tinggi yang tahan 24 jam. Formula buildable dari light hingga full coverage, SPF 15, transfer-proof, kontrol minyak 12 jam. 12 shade tersedia dari porcelain hingga deep.',
    images: ['https://picsum.photos/seed/foundation/400/400'],
    status: 'active', weight: 60, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.5, reviews: 1876,
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-023-1', sku: 'FND-MAT-N10', name: 'N10 Porcelain', price: 149000, compare_price: 229000, stock: 60, images: ['https://picsum.photos/seed/foundation-n10/400/400'], attributes: { shade: 'N10 Porcelain' }, is_active: true },
      { id: 'var-023-2', sku: 'FND-MAT-N20', name: 'N20 Ivory', price: 149000, compare_price: 229000, stock: 75, images: ['https://picsum.photos/seed/foundation-n20/400/400'], attributes: { shade: 'N20 Ivory' }, is_active: true },
      { id: 'var-023-3', sku: 'FND-MAT-N30', name: 'N30 Sand', price: 149000, compare_price: 229000, stock: 55, images: ['https://picsum.photos/seed/foundation-n30/400/400'], attributes: { shade: 'N30 Sand' }, is_active: true },
    ],
  },
  {
    id: 'prod-024', seller_id: SELLER_ID, category_id: 'cat-005',
    name: 'Parfum Unisex Lokal Oud Agarwood 50ml Tahan Lama',
    slug: 'parfum-unisex-lokal-oud-agarwood-50ml',
    description: 'Parfum unisex lokal premium dengan aroma oud agarwood yang khas, hangat, dan mewah. EDP concentration, ketahanan 8-12 jam. Top notes: bergamot & lemon; Heart: oud & rose; Base: amber & musk.',
    images: ['https://picsum.photos/seed/parfum/400/400'],
    status: 'active', weight: 180, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.7, reviews: 987,
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-024-1', sku: 'PFM-OUD-50ML', name: '50ml', price: 199000, compare_price: 299000, stock: 85, images: ['https://picsum.photos/seed/parfum-50ml/400/400'], attributes: { ukuran: '50ml' }, is_active: true },
    ],
  },
  {
    id: 'prod-025', seller_id: SELLER_ID, category_id: 'cat-005',
    name: 'Sheet Mask Brightening Korea 10pcs Box Set',
    slug: 'sheet-mask-brightening-korea-10pcs',
    description: 'Set 10 lembar sheet mask Korea dengan kandungan niacinamide, hyaluronic acid, dan ekstrak white pearl. Cerahkan dan lembabkan kulit dalam 15-20 menit. Dermatologically tested, bebas paraben.',
    images: ['https://picsum.photos/seed/sheet-mask/400/400'],
    status: 'active', weight: 150, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.6, reviews: 5632,
    category: { id: 'cat-005', name: 'Kecantikan', slug: 'kecantikan' },
    variants: [
      { id: 'var-025-1', sku: 'MSK-SHT-10PCS', name: '10 Pcs', price: 79000, compare_price: 129000, stock: 500, images: ['https://picsum.photos/seed/sheetmask-box/400/400'], attributes: { isi: '10 Pcs' }, is_active: true },
    ],
  },

  // ─── OLAHRAGA ───────────────────────────────────────────────────────────────
  {
    id: 'prod-026', seller_id: SELLER_ID, category_id: 'cat-006',
    name: 'Sepatu Running Pria Cushion Foam Air Mesh',
    slug: 'sepatu-running-pria-cushion-foam-air',
    description: 'Sepatu lari pria dengan teknologi air cushion foam untuk penyerapan benturan optimal. Upper mesh breathable, sol karet anti-slip, reflective strip untuk keamanan malam. Berat hanya 280g.',
    images: ['https://picsum.photos/seed/sepatu-running/400/400'],
    status: 'active', weight: 280, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.6, reviews: 1876,
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-026-1', sku: 'SPT-RUN-40-BLU', name: 'Biru / 40', price: 499000, compare_price: 699000, stock: 20, images: ['https://picsum.photos/seed/running-blue/400/400'], attributes: { warna: 'Biru', ukuran: '40' }, is_active: true },
      { id: 'var-026-2', sku: 'SPT-RUN-41-BLU', name: 'Biru / 41', price: 499000, compare_price: 699000, stock: 25, images: ['https://picsum.photos/seed/running-blue/400/400'], attributes: { warna: 'Biru', ukuran: '41' }, is_active: true },
      { id: 'var-026-3', sku: 'SPT-RUN-42-BLU', name: 'Biru / 42', price: 499000, compare_price: 699000, stock: 18, images: ['https://picsum.photos/seed/running-blue/400/400'], attributes: { warna: 'Biru', ukuran: '42' }, is_active: true },
    ],
  },
  {
    id: 'prod-027', seller_id: SELLER_ID, category_id: 'cat-006',
    name: 'Matras Yoga TPE Premium 6mm Non-Slip Anti Bakteri',
    slug: 'matras-yoga-tpe-premium-6mm-non-slip',
    description: 'Matras yoga premium bahan TPE (thermoplastic elastomer) ramah lingkungan. Ketebalan 6mm, ukuran 183x61cm, double layer non-slip, ringan 1.5kg, tali pengikat. Cocok untuk yoga, pilates, stretching.',
    images: ['https://picsum.photos/seed/matras-yoga/400/400'],
    status: 'active', weight: 1500, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.7, reviews: 2345,
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-027-1', sku: 'MAT-YGA-PRP', name: 'Ungu', price: 279000, compare_price: 399000, stock: 80, images: ['https://picsum.photos/seed/yoga-purple/400/400'], attributes: { warna: 'Ungu' }, is_active: true },
      { id: 'var-027-2', sku: 'MAT-YGA-GRN', name: 'Hijau Teal', price: 279000, compare_price: 399000, stock: 65, images: ['https://picsum.photos/seed/yoga-green/400/400'], attributes: { warna: 'Hijau Teal' }, is_active: true },
    ],
  },
  {
    id: 'prod-028', seller_id: SELLER_ID, category_id: 'cat-006',
    name: 'Barbel Hex Rubber Set 5kg + 10kg + Rack',
    slug: 'barbel-hex-rubber-set-5kg-10kg-rack',
    description: 'Set barbel hex rubber coating lengkap dengan rack. Pasang 2x5kg + 2x10kg = 30kg total. Anti-slip, anti-bising, tidak merusak lantai. Handle ergonomis, rubber coating solid.',
    images: ['https://picsum.photos/seed/barbel-set/400/400'],
    status: 'active', weight: 30000, condition: 'new', min_purchase: 1, max_purchase: 2,
    rating: 4.5, reviews: 654,
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-028-1', sku: 'BBL-HEX-30KG', name: 'Set 30kg + Rack', price: 299000, compare_price: 449000, stock: 25, images: ['https://picsum.photos/seed/barbel-30kg/400/400'], attributes: { total: '30kg + Rack' }, is_active: true },
    ],
  },
  {
    id: 'prod-029', seller_id: SELLER_ID, category_id: 'cat-006',
    name: 'Tas Gym Olahraga Multifungsi Waterproof 40L',
    slug: 'tas-gym-olahraga-multifungsi-40l',
    description: 'Tas gym besar 40L dengan kompartemen sepatu terpisah, kantong basah, laptop sleeve 15.6", bahan polyester 600D waterproof. Cocok untuk gym, renang, hiking, dan travel.',
    images: ['https://picsum.photos/seed/tas-gym/400/400'],
    status: 'active', weight: 700, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.6, reviews: 1123,
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-029-1', sku: 'TAS-GYM-BLK', name: 'Hitam', price: 189000, compare_price: 279000, stock: 70, images: ['https://picsum.photos/seed/tasgym-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-029-2', sku: 'TAS-GYM-NVY', name: 'Navy', price: 189000, compare_price: 279000, stock: 55, images: ['https://picsum.photos/seed/tasgym-navy/400/400'], attributes: { warna: 'Navy' }, is_active: true },
    ],
  },
  {
    id: 'prod-030', seller_id: SELLER_ID, category_id: 'cat-006',
    name: 'Treadmill Lipat Elektrik 1.5HP LCD Display',
    slug: 'treadmill-lipat-elektrik-15hp-lcd',
    description: 'Treadmill listrik lipat hemat tempat. Motor 1.5HP, kecepatan 1-12 km/jam, incline manual 3 level, LCD display kalori/waktu/jarak, safety key, berat pengguna max 100kg. Desain compact untuk rumah.',
    images: ['https://picsum.photos/seed/treadmill/400/400'],
    status: 'active', weight: 32000, condition: 'new', min_purchase: 1, max_purchase: 1,
    rating: 4.4, reviews: 312,
    category: { id: 'cat-006', name: 'Olahraga', slug: 'olahraga' },
    variants: [
      { id: 'var-030-1', sku: 'TRM-ELC-BLK', name: 'Hitam', price: 1999000, compare_price: 2999000, stock: 15, images: ['https://picsum.photos/seed/treadmill-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },

  // ─── MAINAN & HOBI ──────────────────────────────────────────────────────────
  {
    id: 'prod-031', seller_id: SELLER_ID, category_id: 'cat-007',
    name: 'RC Car Monster Truck 4WD Off-Road 1:12 RTR',
    slug: 'rc-car-monster-truck-4wd-off-road',
    description: 'Mobil remote control monster truck 4WD skala 1:12, kecepatan max 40km/jam, jarak kontrol 80m, baterai 1500mAh. Suspensi independen, tahan benturan, cocok untuk kontur on/off-road.',
    images: ['https://picsum.photos/seed/rc-car/400/400'],
    status: 'active', weight: 900, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.5, reviews: 876,
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-031-1', sku: 'RC-MTC-RED', name: 'Merah', price: 349000, compare_price: 499000, stock: 40, images: ['https://picsum.photos/seed/rccar-red/400/400'], attributes: { warna: 'Merah' }, is_active: true },
      { id: 'var-031-2', sku: 'RC-MTC-BLU', name: 'Biru', price: 349000, compare_price: 499000, stock: 35, images: ['https://picsum.photos/seed/rccar-blue/400/400'], attributes: { warna: 'Biru' }, is_active: true },
    ],
  },
  {
    id: 'prod-032', seller_id: SELLER_ID, category_id: 'cat-007',
    name: 'Building Block Creative City Set 550 Pcs Kompatibel',
    slug: 'building-block-creative-city-550pcs',
    description: 'Set bangunan kreatif 550 pcs kompatibel dengan merek major. Termasuk mini figure, kendaraan, bangunan kota. Material ABS food-grade aman, tepian halus anti lecet. Usia 6+ tahun.',
    images: ['https://picsum.photos/seed/building-block/400/400'],
    status: 'active', weight: 600, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.6, reviews: 1234,
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-032-1', sku: 'BBL-CTY-550', name: 'City Set 550 Pcs', price: 449000, compare_price: 599000, stock: 55, images: ['https://picsum.photos/seed/block-city/400/400'], attributes: { model: 'City Set' }, is_active: true },
    ],
  },
  {
    id: 'prod-033', seller_id: SELLER_ID, category_id: 'cat-007',
    name: 'Puzzle 1000 Pieces Landscape Pemandangan Alam',
    slug: 'puzzle-1000-pieces-landscape-pemandangan',
    description: 'Puzzle 1000 keping bergambar pemandangan alam indah resolusi tinggi. Bahan karton tebal anti melengkung, tepi presisi, potongan jigsaw akurat. Ukuran jadi 50x70cm. Termasuk kotak cantik.',
    images: ['https://picsum.photos/seed/puzzle/400/400'],
    status: 'active', weight: 500, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.6, reviews: 987,
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-033-1', sku: 'PZL-1000-LD1', name: 'Gunung Fuji', price: 149000, compare_price: 229000, stock: 80, images: ['https://picsum.photos/seed/puzzle-fuji/400/400'], attributes: { motif: 'Gunung Fuji' }, is_active: true },
      { id: 'var-033-2', sku: 'PZL-1000-LD2', name: 'Santorini', price: 149000, compare_price: 229000, stock: 65, images: ['https://picsum.photos/seed/puzzle-santorini/400/400'], attributes: { motif: 'Santorini' }, is_active: true },
    ],
  },
  {
    id: 'prod-034', seller_id: SELLER_ID, category_id: 'cat-007',
    name: 'Drone Mini FPV Camera HD 720p Foldable Stabilizer',
    slug: 'drone-mini-fpv-camera-720p-foldable',
    description: 'Drone mini lipat dengan kamera HD 720p dan FPV real-time via smartphone. Altitude hold, headless mode, 360° flip, jarak kontrol 100m, baterai 600mAh terbang 12 menit. Cocok pemula.',
    images: ['https://picsum.photos/seed/drone-mini/400/400'],
    status: 'active', weight: 95, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.3, reviews: 543,
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-034-1', sku: 'DRN-MNI-BLK', name: 'Hitam', price: 699000, compare_price: 999000, stock: 30, images: ['https://picsum.photos/seed/drone-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
    ],
  },
  {
    id: 'prod-035', seller_id: SELLER_ID, category_id: 'cat-007',
    name: 'Kartu UNO Deluxe Edition Tahan Air Jumbo',
    slug: 'kartu-uno-deluxe-edition-tahan-air',
    description: 'Kartu UNO edisi deluxe dengan material PVC premium tahan air dan lembab. 108 kartu lengkap termasuk kartu spesial wild & draw-four. Ukuran jumbo 95x63mm, mudah dipegang. Cocok usia 5+.',
    images: ['https://picsum.photos/seed/kartu-uno/400/400'],
    status: 'active', weight: 180, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.8, reviews: 3456,
    category: { id: 'cat-007', name: 'Mainan & Hobi', slug: 'mainan-hobi' },
    variants: [
      { id: 'var-035-1', sku: 'UNO-DLX-108', name: 'Deluxe 108 Kartu', price: 89000, compare_price: 129000, stock: 200, images: ['https://picsum.photos/seed/uno-deluxe/400/400'], attributes: {}, is_active: true },
    ],
  },

  // ─── BUKU & ALAT TULIS ──────────────────────────────────────────────────────
  {
    id: 'prod-036', seller_id: SELLER_ID, category_id: 'cat-008',
    name: 'Novel Bumi Seri Pertama - Tere Liye (Cetakan Baru)',
    slug: 'novel-bumi-tere-liye-cetakan-baru',
    description: 'Novel fiksi ilmiah terlaris karya Tere Liye. Petualangan Raib, Seli, dan Ali di dunia paralel yang menakjubkan. Cetakan baru revisi, cover terbaru, 440 halaman. Cocok usia 12+ tahun.',
    images: ['https://picsum.photos/seed/novel-bumi/400/400'],
    status: 'active', weight: 350, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.9, reviews: 7823,
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-036-1', sku: 'BKU-BUM-NEW', name: 'Cetakan Terbaru', price: 89000, compare_price: 119000, stock: 150, images: ['https://picsum.photos/seed/bumi-cover/400/400'], attributes: {}, is_active: true },
    ],
  },
  {
    id: 'prod-037', seller_id: SELLER_ID, category_id: 'cat-008',
    name: 'Buku Python untuk Pemula Lengkap + Studi Kasus',
    slug: 'buku-python-pemula-lengkap-studi-kasus',
    description: 'Panduan belajar Python dari nol untuk pemula. Mencakup: dasar Python, OOP, web scraping, data analysis dengan pandas, visualisasi matplotlib, dan proyek nyata. 550+ halaman, full color.',
    images: ['https://picsum.photos/seed/buku-python/400/400'],
    status: 'active', weight: 600, condition: 'new', min_purchase: 1, max_purchase: 5,
    rating: 4.7, reviews: 1543,
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-037-1', sku: 'BKU-PYT-V3', name: 'Edisi 3 (Terbaru)', price: 119000, compare_price: 179000, stock: 80, images: ['https://picsum.photos/seed/python-book/400/400'], attributes: { edisi: 'Edisi 3' }, is_active: true },
    ],
  },
  {
    id: 'prod-038', seller_id: SELLER_ID, category_id: 'cat-008',
    name: 'Jurnal Bullet A5 Dotted Hardcover 200 Halaman',
    slug: 'jurnal-bullet-a5-dotted-hardcover-200',
    description: 'Jurnal bullet journal premium A5 hardcover dengan kertas dotted 120gsm anti bleed. 200 halaman, numbered pages, index, inner pocket, ribbon bookmark, elastic closure. Cocok untuk planner & sketsa.',
    images: ['https://picsum.photos/seed/jurnal-bullet/400/400'],
    status: 'active', weight: 320, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.7, reviews: 2103,
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-038-1', sku: 'JRN-BUL-BLK', name: 'Hitam', price: 99000, compare_price: 149000, stock: 120, images: ['https://picsum.photos/seed/journal-black/400/400'], attributes: { warna: 'Hitam' }, is_active: true },
      { id: 'var-038-2', sku: 'JRN-BUL-TAN', name: 'Tan / Coklat', price: 99000, compare_price: 149000, stock: 95, images: ['https://picsum.photos/seed/journal-tan/400/400'], attributes: { warna: 'Tan' }, is_active: true },
      { id: 'var-038-3', sku: 'JRN-BUL-GRN', name: 'Forest Green', price: 99000, compare_price: 149000, stock: 80, images: ['https://picsum.photos/seed/journal-green/400/400'], attributes: { warna: 'Forest Green' }, is_active: true },
    ],
  },
  {
    id: 'prod-039', seller_id: SELLER_ID, category_id: 'cat-008',
    name: 'Stabilo Boss Highlighter Set 10 Warna + Pouch',
    slug: 'stabilo-boss-highlighter-set-10-warna',
    description: 'Set stabilo Boss Original 10 warna dalam pouch yang menarik. Tinta berbasis air, tidak merusak tinta printer, ujung chisel 2-5mm, tinta tahan pudar. Ideal untuk belajar, membuat catatan, dan kreasi.',
    images: ['https://picsum.photos/seed/stabilo-boss/400/400'],
    status: 'active', weight: 120, condition: 'new', min_purchase: 1, max_purchase: 10,
    rating: 4.8, reviews: 4521,
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-039-1', sku: 'STB-BSS-10WRN', name: '10 Warna + Pouch', price: 69000, compare_price: 99000, stock: 300, images: ['https://picsum.photos/seed/stabilo-10/400/400'], attributes: { isi: '10 Warna + Pouch' }, is_active: true },
    ],
  },
  {
    id: 'prod-040', seller_id: SELLER_ID, category_id: 'cat-008',
    name: 'Drawing Tablet Grafis Digital Pen USB A5 8192 Level',
    slug: 'drawing-tablet-grafis-digital-pen-a5',
    description: 'Tablet grafis digital A5 untuk ilustrasi, desain, dan editing foto. Pen pressure 8192 level, tilt support, area aktif 10x6 inch, 8 shortcut keys, kompatibel dengan Photoshop, Illustrator, Clip Studio.',
    images: ['https://picsum.photos/seed/drawing-tablet/400/400'],
    status: 'active', weight: 450, condition: 'new', min_purchase: 1, max_purchase: 3,
    rating: 4.6, reviews: 876,
    category: { id: 'cat-008', name: 'Buku & Alat Tulis', slug: 'buku-alat-tulis' },
    variants: [
      { id: 'var-040-1', sku: 'TAB-DRW-A5-BLK', name: 'A5 / Hitam', price: 899000, compare_price: 1199000, stock: 35, images: ['https://picsum.photos/seed/tablet-black/400/400'], attributes: { ukuran: 'A5', warna: 'Hitam' }, is_active: true },
    ],
  },
];

// Sample demo orders
const demoOrders = [
  {
    id: 'order-demo-001',
    order_number: 'ORD-2026-00123',
    status: 'delivered',
    subtotal: 5298000,
    shipping_cost: 0,
    discount_amount: 0,
    total: 5298000,
    payment_method: 'bank_transfer',
    created_at: '2026-03-15T10:30:00Z',
    items: [
      { id: 'oi-001', product_id: 'prod-001', variant_id: 'var-001-1', product_name: 'Smartphone Samsung Galaxy A55 5G 8/256GB', variant_name: 'Biru Laut / 8+256GB', sku: 'SAM-A55-BLU', price: 4999000, quantity: 1, subtotal: 4999000, image_url: 'https://picsum.photos/seed/samsung-a55-blue/400/400' },
      { id: 'oi-002', product_id: 'prod-002', variant_id: 'var-002-1', product_name: 'TWS Earbuds Pro Bluetooth 5.3 ANC 30H', variant_name: 'Putih', sku: 'TWS-PRO-WHT', price: 299000, quantity: 1, subtotal: 299000, image_url: 'https://picsum.photos/seed/tws-white/400/400' },
    ],
  },
  {
    id: 'order-demo-002',
    order_number: 'ORD-2026-00098',
    status: 'shipped',
    subtotal: 448000,
    shipping_cost: 15000,
    discount_amount: 0,
    total: 463000,
    payment_method: 'gopay',
    created_at: '2026-04-01T14:22:00Z',
    items: [
      { id: 'oi-003', product_id: 'prod-012', variant_id: 'var-012-1', product_name: 'Hijab Satin Silk Premium Anti Kusut', variant_name: 'Cream', sku: 'HJB-SAT-CRM', price: 89000, quantity: 2, subtotal: 178000, image_url: 'https://picsum.photos/seed/hijab-cream/400/400' },
      { id: 'oi-004', product_id: 'prod-025', variant_id: 'var-025-1', product_name: 'Sheet Mask Brightening Korea 10pcs Box Set', variant_name: '10 Pcs', sku: 'MSK-SHT-10PCS', price: 79000, quantity: 1, subtotal: 79000, image_url: 'https://picsum.photos/seed/sheetmask-box/400/400' },
      { id: 'oi-005', product_id: 'prod-022', variant_id: 'var-022-1', product_name: 'Sunscreen SPF 50+ PA++++ Invisible Matte Finish', variant_name: '50ml', sku: 'SC-SPF50-50ML', price: 119000, quantity: 1, subtotal: 119000, image_url: 'https://picsum.photos/seed/sunscreen-50ml/400/400' },
      { id: 'oi-006', product_id: 'prod-021', variant_id: 'var-021-1', product_name: 'Serum Vitamin C 20% Brightening Glow', variant_name: '30ml', sku: 'SRM-VITC-30ML', price: 159000, quantity: 1, subtotal: 159000, image_url: 'https://picsum.photos/seed/serum-30ml/400/400' },
    ],
  },
  {
    id: 'order-demo-003',
    order_number: 'ORD-2026-00067',
    status: 'pending',
    subtotal: 1999000,
    shipping_cost: 25000,
    discount_amount: 50000,
    total: 1974000,
    payment_method: 'qris',
    created_at: '2026-04-10T09:00:00Z',
    items: [
      { id: 'oi-007', product_id: 'prod-030', variant_id: 'var-030-1', product_name: 'Treadmill Lipat Elektrik 1.5HP LCD Display', variant_name: 'Hitam', sku: 'TRM-ELC-BLK', price: 1999000, quantity: 1, subtotal: 1999000, image_url: 'https://picsum.photos/seed/treadmill-black/400/400' },
    ],
  },
];

function getCategoryById(id) {
  return categories.find(c => c.id === id) || null;
}

function getProductById(id) {
  return products.find(p => p.id === id || p.slug === id) || null;
}

function getVariantById(variantId) {
  for (const product of products) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

module.exports = { categories, products, demoOrders, getCategoryById, getProductById, getVariantById };
