// Mock register — membuat akun demo baru

function makeMockToken() {
  return 'mock-jwt-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { full_name, email, password, phone } = req.body || {};

  if (!full_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: {
        ...(!full_name && { full_name: 'Nama lengkap wajib diisi' }),
        ...(!email && { email: 'Email wajib diisi' }),
        ...(!password && { password: 'Password wajib diisi' }),
      },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: { email: 'Format email tidak valid' },
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: { password: 'Password minimal 8 karakter' },
    });
  }

  const now = new Date();
  const accessExpiry = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  const refreshExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const user = {
    id: 'user-' + Math.random().toString(36).slice(2, 10),
    email,
    full_name,
    phone: phone || '',
    avatar_url: `https://picsum.photos/seed/${email}/80/80`,
    role: 'customer',
    is_active: true,
  };

  return res.status(201).json({
    success: true,
    message: 'Registrasi berhasil! Selamat datang di ShopKita.',
    data: {
      access_token: makeMockToken(),
      refresh_token: makeMockToken(),
      access_token_expires_at: accessExpiry,
      refresh_token_expires_at: refreshExpiry,
      user,
    },
  });
};
