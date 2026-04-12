const { products } = require('../../../_data');
const { readCart, writeCart, buildResponse } = require('../../../_cart');

function generateId() {
  return 'ci-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { product_id, variant_id, quantity = 1 } = req.body || {};

  if (!product_id || !variant_id) {
    return res.status(400).json({ success: false, message: 'product_id dan variant_id wajib diisi' });
  }

  const product = products.find(p => p.id === product_id);
  if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });

  const variant = product.variants.find(v => v.id === variant_id);
  if (!variant) return res.status(404).json({ success: false, message: 'Varian tidak ditemukan' });

  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const cart = readCart(req);

  // Cek apakah item sudah ada di keranjang
  const existing = cart.items.find(i => i.product_id === product_id && i.variant_id === variant_id);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + qty, variant.stock);
  } else {
    cart.items.push({ id: generateId(), product_id, variant_id, quantity: Math.min(qty, variant.stock) });
  }

  writeCart(res, cart);

  return res.status(200).json({
    success: true,
    message: 'Produk ditambahkan ke keranjang',
    data: buildResponse(cart, products),
  });
};
