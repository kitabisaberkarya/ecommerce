const { products } = require('../../../../_data');
const { readCart, writeCart, clearCart, buildResponse } = require('../../../../_cart');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { itemId } = req.query;
  const cart = readCart(req);

  if (req.method === 'PUT') {
    const { quantity } = req.body || {};
    const qty = parseInt(quantity, 10);

    if (!qty || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity tidak valid' });
    }

    const item = cart.items.find(i => i.id === itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item tidak ditemukan' });

    const product = products.find(p => p.id === item.product_id);
    const variant = product ? product.variants.find(v => v.id === item.variant_id) : null;
    item.quantity = Math.min(qty, variant ? variant.stock : 99);

    writeCart(res, cart);
    return res.status(200).json({
      success: true,
      message: 'Keranjang diperbarui',
      data: buildResponse(cart, products),
    });
  }

  if (req.method === 'DELETE') {
    const before = cart.items.length;
    cart.items = cart.items.filter(i => i.id !== itemId);

    if (cart.items.length === before) {
      return res.status(404).json({ success: false, message: 'Item tidak ditemukan' });
    }

    writeCart(res, cart);
    return res.status(200).json({
      success: true,
      message: 'Item dihapus dari keranjang',
      data: buildResponse(cart, products),
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
