import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { clearCartState } from '../features/cart/cartSlice';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Address {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postal: string;
  address: string;
  label: 'Rumah' | 'Kantor' | 'Lainnya';
}

interface ShippingOption {
  id: string;
  courier: string;
  logo: string;
  service: string;
  desc: string;
  price: number;
  etd: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROVINCES = [
  'Aceh','Bali','Bangka Belitung','Banten','Bengkulu','DI Yogyakarta','DKI Jakarta',
  'Gorontalo','Jambi','Jawa Barat','Jawa Tengah','Jawa Timur','Kalimantan Barat',
  'Kalimantan Selatan','Kalimantan Tengah','Kalimantan Timur','Kalimantan Utara',
  'Kepulauan Riau','Lampung','Maluku','Maluku Utara','Nusa Tenggara Barat',
  'Nusa Tenggara Timur','Papua','Papua Barat','Papua Pegunungan','Papua Selatan',
  'Papua Tengah','Riau','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tengah',
  'Sulawesi Tenggara','Sulawesi Utara','Sumatera Barat','Sumatera Selatan','Sumatera Utara',
];

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'jne-reg', courier: 'JNE', logo: '📦', service: 'REG', desc: 'Reguler', price: 15000, etd: '3–5 hari kerja' },
  { id: 'jne-yes', courier: 'JNE', logo: '📦', service: 'YES', desc: 'Yakin Esok Sampai', price: 25000, etd: '1 hari kerja' },
  { id: 'jnt-reg', courier: 'J&T', logo: '🚀', service: 'Express', desc: 'Reguler', price: 14000, etd: '2–4 hari kerja' },
  { id: 'sicepat', courier: 'SiCepat', logo: '⚡', service: 'BEST', desc: 'Besok Sampai', price: 13000, etd: '2–3 hari kerja' },
  { id: 'gosend', courier: 'Gosend', logo: '🛵', service: 'Instant', desc: 'Same-day delivery', price: 35000, etd: 'Hari ini (< 4 jam)' },
];

const PAYMENT_METHODS = {
  'Transfer Bank (Virtual Account)': [
    { id: 'bca-va', name: 'BCA Virtual Account', logo: '🏦', extra: 'Transfer 24 jam' },
    { id: 'mandiri-va', name: 'Mandiri Virtual Account', logo: '🏦', extra: 'Transfer 24 jam' },
    { id: 'bni-va', name: 'BNI Virtual Account', logo: '🏦', extra: 'Transfer 24 jam' },
    { id: 'bri-va', name: 'BRI Virtual Account', logo: '🏦', extra: 'Transfer 24 jam' },
  ],
  'Dompet Digital': [
    { id: 'gopay', name: 'GoPay', logo: '💚', extra: 'Cashback 5%' },
    { id: 'ovo', name: 'OVO', logo: '💜', extra: 'Poin 2x' },
    { id: 'dana', name: 'DANA', logo: '💙', extra: 'Transfer gratis' },
    { id: 'shopeepay', name: 'ShopeePay', logo: '🧡', extra: 'Cashback 10%' },
  ],
  'Metode Lain': [
    { id: 'qris', name: 'QRIS', logo: '📱', extra: 'Scan & Pay' },
    { id: 'cod', name: 'Bayar di Tempat (COD)', logo: '💵', extra: 'Maks. Rp 1.000.000' },
  ],
};

const VOUCHER_CODES: Record<string, number> = {
  SHOPKITA10: 0.10,
  HEMAT20: 0.20,
  GRATIS: 0.05,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatIDR(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function genOrderId() {
  return 'SKO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ['Alamat', 'Pengiriman', 'Pembayaran', 'Konfirmasi'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i < current ? 'bg-indigo-600 text-white' :
              i === current ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i < current ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`mt-1 text-xs font-medium hidden sm:block ${i <= current ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-16 sm:w-24 h-0.5 mx-1 ${i < current ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Address ──────────────────────────────────────────────────────────

function AddressStep({ onNext }: { onNext: (addr: Address) => void }) {
  const [form, setForm] = useState<Address>({
    name: '', phone: '', province: '', city: '', district: '', postal: '', address: '', label: 'Rumah',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const set = (k: keyof Address, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Partial<Record<keyof Address, string>> = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.phone.trim()) e.phone = 'Nomor HP wajib diisi';
    else if (!/^(\+62|0)[0-9]{8,12}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Format nomor HP tidak valid';
    if (!form.province) e.province = 'Pilih provinsi';
    if (!form.city.trim()) e.city = 'Kota/kabupaten wajib diisi';
    if (!form.district.trim()) e.district = 'Kecamatan wajib diisi';
    if (!form.postal.trim()) e.postal = 'Kode pos wajib diisi';
    else if (!/^\d{5}$/.test(form.postal)) e.postal = 'Kode pos harus 5 digit';
    if (!form.address.trim()) e.address = 'Alamat lengkap wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) onNext(form); };

  const Field = ({ label, placeholder, value, onChange, error, type = 'text' }: {
    label: string; placeholder: string; value: string;
    onChange: (v: string) => void; error?: string; type?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
        }`} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Alamat Pengiriman</h2>
        <div className="flex gap-2">
          {(['Rumah','Kantor','Lainnya'] as const).map(l => (
            <button key={l} onClick={() => set('label', l)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                form.label === l ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}>
              {l === 'Rumah' ? '🏠' : l === 'Kantor' ? '🏢' : '📍'} {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nama Penerima *" placeholder="Nama lengkap" value={form.name} onChange={v => set('name', v)} error={errors.name} />
        <Field label="Nomor HP *" placeholder="08xxxxxxxxxx" value={form.phone} onChange={v => set('phone', v)} error={errors.phone} type="tel" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi *</label>
          <select value={form.province} onChange={e => set('province', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
              errors.province ? 'border-red-400 bg-red-50' : 'border-gray-200'
            }`}>
            <option value="">Pilih Provinsi</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province}</p>}
        </div>
        <Field label="Kota / Kabupaten *" placeholder="Contoh: Jakarta Selatan" value={form.city} onChange={v => set('city', v)} error={errors.city} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Kecamatan *" placeholder="Contoh: Kebayoran Baru" value={form.district} onChange={v => set('district', v)} error={errors.district} />
        <Field label="Kode Pos *" placeholder="12345" value={form.postal} onChange={v => set('postal', v)} error={errors.postal} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap *</label>
        <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={3}
          placeholder="Nama jalan, nomor rumah, RT/RW, patokan, dll."
          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
            errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'
          }`} />
        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
      </div>

      <button onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors">
        Lanjut ke Pilih Pengiriman →
      </button>
    </div>
  );
}

// ─── Step 2: Shipping ─────────────────────────────────────────────────────────

function ShippingStep({ address, onNext, onBack }: {
  address: Address; onNext: (opt: ShippingOption) => void; onBack: () => void;
}) {
  const [selected, setSelected] = useState<string>('jne-reg');
  const opt = SHIPPING_OPTIONS.find(o => o.id === selected)!;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900">Pilih Opsi Pengiriman</h2>

      {/* Address summary */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl">📍</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{address.name} · {address.phone}</p>
          <p className="text-sm text-gray-500 mt-0.5">{address.address}, {address.district}, {address.city}, {address.province} {address.postal}</p>
        </div>
        <button onClick={onBack} className="text-xs text-indigo-600 hover:underline shrink-0">Ubah</button>
      </div>

      {/* Shipping options */}
      <div className="space-y-2">
        {SHIPPING_OPTIONS.map(o => (
          <label key={o.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            selected === o.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'
          }`}>
            <input type="radio" name="shipping" value={o.id} checked={selected === o.id} onChange={() => setSelected(o.id)} className="hidden" />
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selected === o.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
            }`}>
              {selected === o.id && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <span className="text-2xl">{o.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-800 text-sm">{o.courier} {o.service}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{o.desc}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Estimasi tiba: {o.etd}</p>
            </div>
            <span className="font-bold text-gray-800 text-sm shrink-0">{formatIDR(o.price)}</span>
          </label>
        ))}
      </div>

      {/* Shipping insurance */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
        <span className="text-2xl">🛡️</span>
        <div className="flex-1">
          <p className="font-semibold text-sm text-blue-900">Proteksi Pengiriman</p>
          <p className="text-xs text-blue-600">Ganti rugi 100% jika paket hilang atau rusak (+Rp 2.000)</p>
        </div>
        <div className="flex items-center h-5">
          <input id="insurance" type="checkbox" defaultChecked
            className="w-4 h-4 accent-indigo-600 cursor-pointer" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
          ← Kembali
        </button>
        <button onClick={() => onNext(opt)}
          className="flex-2 flex-1 bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors">
          Lanjut ke Pembayaran →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Payment ──────────────────────────────────────────────────────────

function PaymentStep({ onNext, onBack }: { onNext: (method: string, methodName: string) => void; onBack: () => void }) {
  const [selected, setSelected] = useState('bca-va');

  const allMethods = Object.values(PAYMENT_METHODS).flat();
  const selectedMethod = allMethods.find(m => m.id === selected)!;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900">Metode Pembayaran</h2>

      {Object.entries(PAYMENT_METHODS).map(([group, methods]) => (
        <div key={group}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{group}</p>
          <div className="space-y-2">
            {methods.map(m => (
              <label key={m.id} className={`flex items-center gap-4 p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                selected === m.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'
              }`}>
                <input type="radio" name="payment" value={m.id} checked={selected === m.id} onChange={() => setSelected(m.id)} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selected === m.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                }`}>
                  {selected === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-xl">{m.logo}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{m.name}</p>
                </div>
                <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">{m.extra}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
          ← Kembali
        </button>
        <button onClick={() => onNext(selected, selectedMethod.name)}
          className="flex-1 bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors">
          Lanjut ke Konfirmasi →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Confirmation ─────────────────────────────────────────────────────

function ConfirmStep({
  address, shipping, paymentName, onBack, onConfirm,
}: {
  address: Address;
  shipping: ShippingOption;
  paymentName: string;
  onBack: () => void;
  onConfirm: (voucher: string, note: string, insurance: boolean, total: number) => void;
}) {
  const items = useSelector((s: RootState) => s.cart.cart?.items ?? []);
  const [voucher, setVoucher] = useState('');
  const [voucherApplied, setVoucherApplied] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [note, setNote] = useState('');
  const [insurance, setInsurance] = useState(true);
  const [placing, setPlacing] = useState(false);

  const subtotal = items.reduce((s, i) => s + (i.variant?.price ?? 0) * i.quantity, 0);
  const discount = voucherApplied ? Math.round(subtotal * (VOUCHER_CODES[voucherApplied] ?? 0)) : 0;
  const shippingFee = shipping.price;
  const insuranceFee = insurance ? 2000 : 0;
  const total = subtotal - discount + shippingFee + insuranceFee;

  const applyVoucher = () => {
    const code = voucher.trim().toUpperCase();
    if (VOUCHER_CODES[code]) {
      setVoucherApplied(code);
      setVoucherError('');
    } else {
      setVoucherApplied('');
      setVoucherError('Kode voucher tidak valid atau sudah kedaluwarsa');
    }
  };

  const handleConfirm = () => {
    setPlacing(true);
    setTimeout(() => onConfirm(voucherApplied, note, insurance, total), 1200);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-gray-900">Ringkasan & Konfirmasi</h2>

      {/* Items */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex justify-between">
          <span className="font-semibold text-sm text-gray-700">Produk ({items.length})</span>
          <Link to="/cart" className="text-xs text-indigo-600 hover:underline">Ubah</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {items.map(item => (
            <div key={item.id} className="px-4 py-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {(item.variant?.images?.[0] ?? item.product?.images?.[0]) ? (
                  <img src={item.variant?.images?.[0] ?? item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium line-clamp-1">{item.product?.name}</p>
                {item.variant?.name && <p className="text-xs text-gray-400">{item.variant.name} · ×{item.quantity}</p>}
              </div>
              <p className="text-sm font-semibold text-gray-800 shrink-0">
                {formatIDR((item.variant?.price ?? 0) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping summary */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-lg">📍</span>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-gray-800">{address.name} · {address.phone}</p>
            <p className="text-gray-500 text-xs mt-0.5">{address.address}, {address.district}, {address.city}, {address.province}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">🚚</span>
          <span className="text-gray-700">{shipping.courier} {shipping.service} — {shipping.etd}</span>
          <span className="ml-auto font-semibold text-gray-800">{formatIDR(shippingFee)}</span>
        </div>
      </div>

      {/* Voucher */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">🎟️ Kode Voucher</p>
        <div className="flex gap-2">
          <input value={voucher} onChange={e => setVoucher(e.target.value.toUpperCase())}
            placeholder="Masukkan kode (coba: SHOPKITA10)"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button onClick={applyVoucher}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Pakai
          </button>
        </div>
        {voucherApplied && (
          <p className="mt-1.5 text-xs text-green-600 font-medium">
            ✅ Voucher {voucherApplied} berhasil! Hemat {Math.round((VOUCHER_CODES[voucherApplied] ?? 0) * 100)}%
          </p>
        )}
        {voucherError && <p className="mt-1.5 text-xs text-red-500">{voucherError}</p>}
      </div>

      {/* Note for seller */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">📝 Catatan untuk Penjual <span className="font-normal text-gray-400">(opsional)</span></p>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} maxLength={200}
          placeholder="Contoh: Mohon di-packing ekstra, barang fragile..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        <p className="text-right text-xs text-gray-300 mt-0.5">{note.length}/200</p>
      </div>

      {/* Insurance toggle */}
      <label className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 cursor-pointer">
        <input type="checkbox" checked={insurance} onChange={e => setInsurance(e.target.checked)}
          className="w-4 h-4 accent-indigo-600" />
        <div>
          <p className="text-sm font-semibold text-blue-900">🛡️ Proteksi Pengiriman (+{formatIDR(2000)})</p>
          <p className="text-xs text-blue-600">Ganti rugi 100% jika paket hilang atau rusak</p>
        </div>
      </label>

      {/* Price breakdown */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5">
        <p className="font-semibold text-sm text-gray-700 mb-1">Rincian Biaya</p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({items.length} produk)</span>
          <span>{formatIDR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Ongkos Kirim</span>
          <span>{formatIDR(shippingFee)}</span>
        </div>
        {insurance && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Proteksi Pengiriman</span>
            <span>{formatIDR(insuranceFee)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>Diskon Voucher ({voucherApplied})</span>
            <span>−{formatIDR(discount)}</span>
          </div>
        )}
        <hr className="border-gray-100" />
        <div className="flex justify-between font-bold text-base text-gray-900">
          <span>Total Pembayaran</span>
          <span className="text-indigo-700">{formatIDR(total)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <span>💳</span>
          <span>Bayar via: <strong className="text-gray-700">{paymentName}</strong></span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} disabled={placing}
          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
          ← Kembali
        </button>
        <button onClick={handleConfirm} disabled={placing}
          className="flex-1 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
          {placing ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Memproses...</>
          ) : (
            <>🛒 Buat Pesanan</>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Dengan menekan "Buat Pesanan", kamu menyetujui{' '}
        <span className="text-indigo-500 cursor-pointer hover:underline">Syarat & Ketentuan</span> ShopKita.
      </p>
    </div>
  );
}

// ─── Main CheckoutPage ────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.cart.cart?.items ?? []);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address | null>(null);
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [paymentId, setPaymentId] = useState('');
  const [paymentName, setPaymentName] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-gray-300 mb-2">🛒</p>
        <p className="text-lg font-semibold text-gray-700 mb-4">Keranjang kosong</p>
        <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/cart" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Transaksi Aman & Terenkripsi
          </div>
        </div>

        <StepBar current={step} />

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {step === 0 && (
            <AddressStep onNext={(addr) => { setAddress(addr); setStep(1); }} />
          )}
          {step === 1 && address && (
            <ShippingStep address={address} onNext={(opt) => { setShipping(opt); setStep(2); }} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <PaymentStep onNext={(id, name) => { setPaymentId(id); setPaymentName(name); setStep(3); }} onBack={() => setStep(1)} />
          )}
          {step === 3 && address && shipping && (
            <ConfirmStep
              address={address}
              shipping={shipping}
              paymentName={paymentName}
              onBack={() => setStep(2)}
              onConfirm={(voucher, note, insurance, total) => {
                const orderId = genOrderId();
                dispatch(clearCartState());
                navigate('/order-success', {
                  state: {
                    orderId,
                    total,
                    paymentId,
                    paymentName,
                    address,
                    shipping,
                    voucher,
                    note,
                    insurance,
                  },
                });
              }}
            />
          )}
        </div>

        {/* Security bar */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          {['🔒 SSL Terenkripsi', '🛡️ Pembeli Dilindungi', '💳 Pembayaran Aman'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
