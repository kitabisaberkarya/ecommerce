// Cookie-based cart helper — stateless & persistent per browser session
const COOKIE_NAME = 'sk_cart';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 jam

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(
    raw.split(';').map(c => c.trim().split('=').map(decodeURIComponent))
  );
}

function readCart(req) {
  try {
    const cookies = parseCookies(req);
    if (!cookies[COOKIE_NAME]) return emptyCart();
    const decoded = Buffer.from(cookies[COOKIE_NAME], 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    if (!parsed || !Array.isArray(parsed.items)) return emptyCart();
    return parsed;
  } catch {
    return emptyCart();
  }
}

function writeCart(res, cart) {
  const encoded = Buffer.from(JSON.stringify(cart)).toString('base64');
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${encoded}; Path=/; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; HttpOnly`,
  ]);
}

function clearCart(res) {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; Path=/; SameSite=Lax; Max-Age=0; HttpOnly`,
  ]);
}

function emptyCart() {
  return { id: 'cart-guest', session_id: 'sess-guest', user_id: null, items: [] };
}

function enrichItems(rawItems, products) {
  return rawItems.map(raw => {
    const product = products.find(p => p.id === raw.product_id);
    const variant = product ? product.variants.find(v => v.id === raw.variant_id) : null;
    return {
      id: raw.id,
      cart_id: 'cart-guest',
      product_id: raw.product_id,
      variant_id: raw.variant_id,
      quantity: raw.quantity,
      product: product ? { id: product.id, name: product.name, images: product.images } : undefined,
      variant: variant ? {
        id: variant.id,
        name: variant.name,
        price: variant.price,
        compare_price: variant.compare_price,
        stock: variant.stock,
        images: variant.images,
      } : undefined,
    };
  });
}

function buildResponse(rawCart, products) {
  return {
    id: rawCart.id,
    session_id: rawCart.session_id,
    user_id: rawCart.user_id || null,
    items: enrichItems(rawCart.items, products),
  };
}

module.exports = { readCart, writeCart, clearCart, emptyCart, buildResponse };
