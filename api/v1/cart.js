const { products } = require('../../_data');
const { readCart, writeCart, clearCart, emptyCart, buildResponse } = require('../../_cart');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const cart = readCart(req);
    return res.status(200).json({
      success: true,
      message: 'Keranjang ditemukan',
      data: buildResponse(cart, products),
    });
  }

  if (req.method === 'DELETE') {
    clearCart(res);
    return res.status(200).json({
      success: true,
      message: 'Keranjang dikosongkan',
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
