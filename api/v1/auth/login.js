// Mock login — menerima email & password apapun yang valid formatnya
// Di production nyata, ini akan terkoneksi ke database dan JWT asli

function makeMockToken() {
  return 'mock-jwt-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Format email tidak valid' });
  }

  if (password.length < 6) {
    return res.status(401).json({ success: false, message: 'Email atau password salah' });
  }

  const now = new Date();
  const accessExpiry = new Date(now.getTime() + 15 * 60 * 1000).toISOString();       // 15 menit
  const refreshExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 hari

  const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const user = {
    id: 'user-demo-' + Buffer.from(email).toString('base64').slice(0, 8),
    email,
    full_name: name,
    phone: '081234567890',
    avatar_url: `https://picsum.photos/seed/${email}/80/80`,
    role: email.includes('admin') ? 'admin' : 'customer',
    is_active: true,
  };

  return res.status(200).json({
    success: true,
    message: 'Login berhasil',
    data: {
      access_token: makeMockToken(),
      refresh_token: makeMockToken(),
      access_token_expires_at: accessExpiry,
      refresh_token_expires_at: refreshExpiry,
      user,
    },
  });
};
