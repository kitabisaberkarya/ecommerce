import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ─── Types (mirrored from CheckoutPage state) ─────────────────────────────────

interface OrderState {
  orderId: string;
  total: number;
  paymentId: string;
  paymentName: string;
  address: {
    name: string; phone: string; province: string; city: string;
    district: string; postal: string; address: string; label: string;
  };
  shipping: { courier: string; service: string; etd: string; price: number };
  voucher: string;
  note: string;
  insurance: boolean;
}

// ─── VA number generator (deterministic from orderId) ────────────────────────

function genVA(orderId: string, bank: string) {
  const seed = orderId.replace(/\D/g, '').slice(0, 8).padStart(8, '9');
  const prefix: Record<string, string> = {
    bca: '8808', mandiri: '8900', bni: '9889', bri: '1234',
  };
  const p = prefix[bank] ?? '9999';
  return p + seed + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

// ─── Countdown timer hook ────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(ref.current!); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current!);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pct = (remaining / seconds) * 100;

  return { h, m, s, remaining, pct };
}

// ─── Payment instruction panels ──────────────────────────────────────────────

function VAInstructions({ bank, va, total }: { bank: string; va: string; total: number }) {
  const [copied, setCopied] = useState(false);
  const steps: Record<string, string[]> = {
    bca: [
      'Buka aplikasi BCA Mobile atau myBCA',
      'Pilih "Transfer" → "BCA Virtual Account"',
      `Masukkan nomor VA: ${va}`,
      `Konfirmasi nominal ${formatIDR(total)} dan lanjutkan`,
      'Masukkan PIN BCA dan selesai',
    ],
    mandiri: [
      'Buka aplikasi Livin\' by Mandiri',
      'Pilih "Bayar" → "Multipayment"',
      `Masukkan kode perusahaan dan nomor VA: ${va}`,
      `Pastikan nominal ${formatIDR(total)} sesuai`,
      'Masukkan PIN dan konfirmasi',
    ],
    bni: [
      'Buka aplikasi BNI Mobile Banking',
      'Pilih "Transfer" → "Virtual Account Billing"',
      `Masukkan nomor VA: ${va}`,
      `Periksa detail pembayaran (${formatIDR(total)})`,
      'Masukkan password transaksi',
    ],
    bri: [
      'Buka BRImo atau ATM BRI terdekat',
      'Pilih "Pembayaran" → "BRIVA"',
      `Masukkan nomor BRIVA: ${va}`,
      `Konfirmasi pembayaran ${formatIDR(total)}`,
      'Masukkan PIN dan selesai',
    ],
  };

  const copy = () => {
    navigator.clipboard.writeText(va).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bankNames: Record<string, string> = { bca: 'BCA', mandiri: 'Mandiri', bni: 'BNI', bri: 'BRI' };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 rounded-xl p-4">
        <p className="text-xs text-indigo-600 font-semibold mb-1">NOMOR VIRTUAL ACCOUNT {(bankNames[bank] ?? bank).toUpperCase()}</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-indigo-800 tracking-wider font-mono">{va}</span>
          <button onClick={copy}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}>
            {copied ? '✓ Disalin!' : 'Salin'}
          </button>
        </div>
        <p className="text-xs text-indigo-500 mt-1">Total: <strong>{formatIDR(total)}</strong> (bayar tepat sesuai nominal)</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Cara Pembayaran via {bankNames[bank] ?? bank} Mobile:</p>
        <ol className="space-y-2">
          {(steps[bank] ?? []).map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function EwalletInstructions({ wallet, total }: { wallet: string; total: number }) {
  const instructions: Record<string, { steps: string[]; note: string }> = {
    gopay: {
      steps: ['Buka aplikasi Gojek', 'Pilih GoPay → "Scan QR" atau "Transfer"', `Bayar ${formatIDR(total)}`, 'Konfirmasi dengan PIN/biometrik'],
      note: 'Kamu mendapat cashback GoPay Points 5% untuk transaksi ini!',
    },
    ovo: {
      steps: ['Buka aplikasi OVO', 'Pilih "Pay" → scan kode QR atau transfer', `Bayar ${formatIDR(total)}`, 'Konfirmasi dengan PIN'],
      note: 'Dapatkan OVO Points 2x lipat untuk transaksi ini!',
    },
    dana: {
      steps: ['Buka aplikasi DANA', 'Pilih "Bayar" → scan QR', `Konfirmasi nominal ${formatIDR(total)}`, 'Masukkan PIN DANA'],
      note: 'Transfer DANA gratis, tanpa biaya admin.',
    },
    shopeepay: {
      steps: ['Buka aplikasi Shopee / ShopeePay', 'Pilih "ShopeePay" → "Bayar"', `Bayar ${formatIDR(total)}`, 'Verifikasi dengan PIN'],
      note: 'Cashback ShopeePay Coins 10% berlaku!',
    },
  };

  const info = instructions[wallet];
  if (!info) return null;

  return (
    <div className="space-y-4">
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="text-4xl mb-2">📱</p>
        <p className="text-sm text-green-800 font-semibold">Selesaikan pembayaran di aplikasi {wallet.charAt(0).toUpperCase() + wallet.slice(1)}</p>
        <p className="text-xs text-green-600 mt-1">{info.note}</p>
      </div>
      <ol className="space-y-2">
        {info.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
            <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function QRISInstructions({ total }: { total: number }) {
  return (
    <div className="space-y-4 text-center">
      <div className="inline-block bg-white border-4 border-gray-200 rounded-2xl p-4 mx-auto">
        {/* Fake QR code grid */}
        <div className="w-40 h-40 grid grid-cols-10 gap-px mx-auto">
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} className={`rounded-sm ${
              [0,1,2,3,4,5,6,10,16,20,26,30,36,40,46,50,56,60,66,70,76,80,86,90,91,92,93,94,95,96,
               13,23,33,43,53,63,73,83,7,17,27,37,47,57,67,77,87,11,21,31,41,51,61,71,81,99,98,97].includes(i)
                ? 'bg-gray-900' : 'bg-white'
            }`} />
          ))}
        </div>
      </div>
      <div>
        <p className="font-semibold text-gray-800">Scan dengan aplikasi apapun yang mendukung QRIS</p>
        <p className="text-sm text-gray-500 mt-1">GoPay · OVO · DANA · ShopeePay · LinkAja · i-Saku · dll.</p>
        <p className="text-lg font-bold text-indigo-700 mt-2">{formatIDR(total)}</p>
      </div>
    </div>
  );
}

function CODInstructions({ address }: { address: OrderState['address'] }) {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 rounded-xl p-4 flex items-start gap-3">
        <span className="text-3xl">💵</span>
        <div>
          <p className="font-semibold text-yellow-900">Bayar saat paket tiba</p>
          <p className="text-sm text-yellow-700 mt-0.5">Siapkan uang pas saat kurir tiba di alamat kamu.</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="font-semibold text-gray-800">Paket akan dikirim ke:</p>
        <p>{address.name} · {address.phone}</p>
        <p>{address.address}, {address.district}, {address.city}, {address.province} {address.postal}</p>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function estimatedDelivery(etd: string): string {
  const today = new Date();
  const match = etd.match(/(\d+)/);
  const days = match ? parseInt(match[1]) : 3;
  today.setDate(today.getDate() + days + 1);
  return today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderState | null;
  const { h, m, s, pct } = useCountdown(24 * 60 * 60); // 24-hour payment window

  // Redirect if no order state
  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { orderId, total, paymentId, paymentName, address, shipping } = state;

  const bankKey = paymentId.replace('-va', '');
  const isVA = paymentId.endsWith('-va');
  const isEwallet = ['gopay', 'ovo', 'dana', 'shopeepay'].includes(paymentId);
  const isQRIS = paymentId === 'qris';
  const isCOD = paymentId === 'cod';

  const va = isVA ? genVA(orderId, bankKey) : '';
  const paymentDeadline = isCOD ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Hue stroke for countdown circle
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5">

        {/* ── Success header ── */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            {isCOD ? 'Pesanan Dibuat! 🎉' : 'Pesanan Berhasil Dibuat! 🎉'}
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            {isCOD ? 'Pesananmu sedang diproses dan akan segera dikirim.' : 'Segera selesaikan pembayaran sebelum batas waktu.'}
          </p>

          <div className="bg-gray-50 rounded-xl p-4 inline-block">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Nomor Pesanan</p>
            <p className="text-xl font-black text-indigo-700 font-mono mt-0.5">{orderId}</p>
          </div>

          {/* Estimated delivery */}
          <div className="mt-5 flex items-center justify-center gap-3 text-sm">
            <span className="text-2xl">📦</span>
            <div className="text-left">
              <p className="text-xs text-gray-400">Estimasi Tiba</p>
              <p className="font-semibold text-gray-800">{estimatedDelivery(shipping.etd)}</p>
              <p className="text-xs text-gray-500">via {shipping.courier} {shipping.service}</p>
            </div>
          </div>
        </div>

        {/* ── Payment countdown (non-COD) ── */}
        {!isCOD && paymentDeadline && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
                  <circle cx="50" cy="50" r={radius} fill="none"
                    stroke={pct > 30 ? '#4F46E5' : pct > 10 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1s linear' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-700 tabular-nums leading-none">
                    {String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
                  </span>
                  <span className="text-xs text-gray-400">tersisa</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Batas Waktu Pembayaran</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {paymentDeadline.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })},{' '}
                  {paymentDeadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </p>
                <p className="text-xs text-red-500 mt-1.5 font-medium">
                  Pesanan otomatis dibatalkan jika belum dibayar
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Payment instructions ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <p className="font-bold text-gray-900">Cara Pembayaran</p>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-semibold">{paymentName}</span>
          </div>
          <div className="p-6">
            {isVA && <VAInstructions bank={bankKey} va={va} total={total} />}
            {isEwallet && <EwalletInstructions wallet={paymentId} total={total} />}
            {isQRIS && <QRISInstructions total={total} />}
            {isCOD && <CODInstructions address={address} />}
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Alamat Pengiriman</span>
              <span className="text-right text-gray-800 font-medium max-w-[55%]">
                {address.name}, {address.city}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Kurir</span>
              <span className="text-gray-800 font-medium">{shipping.courier} {shipping.service}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Metode Bayar</span>
              <span className="text-gray-800 font-medium">{paymentName}</span>
            </div>
            <hr className="border-gray-50" />
            <div className="flex justify-between font-bold text-base text-gray-900">
              <span>Total Dibayar</span>
              <span className="text-indigo-700">{formatIDR(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Timeline / Status ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="font-bold text-gray-900 mb-4">Status Pesanan</p>
          <div className="space-y-4">
            {[
              { icon: '✅', label: 'Pesanan Dibuat', sub: 'Baru saja', done: true },
              { icon: isCOD ? '✅' : '⏳', label: isCOD ? 'Menunggu Konfirmasi Penjual' : 'Menunggu Pembayaran', sub: isCOD ? 'Segera diproses' : 'Selesaikan dalam 24 jam', done: isCOD },
              { icon: '🔄', label: 'Pesanan Diproses', sub: 'Estimasi 1–2 hari kerja', done: false },
              { icon: '🚚', label: 'Dalam Pengiriman', sub: `${shipping.courier} ${shipping.service}`, done: false },
              { icon: '🎉', label: 'Pesanan Diterima', sub: `Estimasi ${estimatedDelivery(shipping.etd)}`, done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 ${
                  item.done ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-sm font-semibold ${item.done ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</p>
                  <p className={`text-xs mt-0.5 ${item.done ? 'text-gray-500' : 'text-gray-300'}`}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/orders"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lacak Pesanan
          </Link>
          <Link to="/products"
            className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
            </svg>
            Lanjut Belanja
          </Link>
        </div>

        {/* ── Help ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Ada kendala?</p>
            <p className="text-xs text-gray-500">Hubungi CS ShopKita 24/7 via chat atau email</p>
          </div>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Chat CS</button>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Terima kasih sudah berbelanja di <strong>ShopKita</strong> ✨
        </p>
      </div>
    </div>
  );
}
