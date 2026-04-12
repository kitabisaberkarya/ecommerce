const { demoOrders } = require('../../_data');
const { readCart, clearCart } = require('../../_cart');

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const rand = String(Math.floor(Math.random() * 90000) + 10000);
  return `ORD-${y}-${rand}`;
}

function generateId() {
  return 'order-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /orders — kembalikan demo orders
  if (req.method === 'GET') {
    const { status } = req.query;
    let orders = demoOrders;
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    return res.status(200).json({
      success: true,
      message: 'Daftar pesanan',
      data: orders,
      meta: { page: 1, limit: 20, total: orders.length, total_pages: 1, has_next: false, has_prev: false },
    });
  }

  // POST /orders — buat pesanan dari cart
  if (req.method === 'POST') {
    const { payment_method = 'bank_transfer', shipping_cost = 15000 } = req.body || {};
    const cart = readCart(req);
    const { products } = require('../../_data');

    // Jika cart kosong, buat order dari demo products
    const cartItems = cart.items.length > 0 ? cart.items : [
      { id: 'ci-demo', product_id: 'prod-005', variant_id: 'var-005-1', quantity: 1 },
    ];

    const orderItems = cartItems.map((item, idx) => {
      const product = products.find(p => p.id === item.product_id);
      const variant = product ? product.variants.find(v => v.id === item.variant_id) : null;
      const price = variant ? variant.price : 0;
      return {
        id: `oi-new-${idx + 1}`,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: product ? product.name : 'Produk',
        variant_name: variant ? variant.name : '-',
        sku: variant ? variant.sku : '-',
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
        image_url: product ? (product.images[0] || '') : '',
      };
    });

    const subtotal = orderItems.reduce((s, i) => s + i.subtotal, 0);
    const total = subtotal + Number(shipping_cost);

    const newOrder = {
      id: generateId(),
      order_number: generateOrderNumber(),
      status: 'pending',
      subtotal,
      shipping_cost: Number(shipping_cost),
      discount_amount: 0,
      total,
      payment_method,
      created_at: new Date().toISOString(),
      items: orderItems,
    };

    // Kosongkan cart setelah checkout
    clearCart(res);

    return res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: newOrder,
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
