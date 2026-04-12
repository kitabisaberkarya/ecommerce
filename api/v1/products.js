const { products } = require('../../_data');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Cache-Control', 'public, max-age=60');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { page = '1', limit = '20', search = '', category_id = '', sort_by = 'newest' } = req.query;

  let result = [...products].filter(p => p.status === 'active');

  // Filter by category
  if (category_id) {
    result = result.filter(p => p.category_id === category_id);
  }

  // Search by name / description
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.category && p.category.name.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (sort_by) {
    case 'price_asc':
      result.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
      break;
    case 'price_desc':
      result.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
      break;
    case 'popular':
      result.sort((a, b) => b.reviews - a.reviews);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
    default:
      // urutan default sudah "terbaru" (urutan array)
      break;
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const total = result.length;
  const total_pages = Math.max(1, Math.ceil(total / limitNum));
  const offset = (pageNum - 1) * limitNum;
  const data = result.slice(offset, offset + limitNum);

  return res.status(200).json({
    success: true,
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      total_pages,
      has_next: pageNum < total_pages,
      has_prev: pageNum > 1,
    },
  });
};
