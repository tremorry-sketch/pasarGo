import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">

      {/* ── Top Nav ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-between items-center px-margin-mobile py-sm bg-surface-white/80 backdrop-blur-md shadow-header">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-primary">eco</span>
          <span className="text-primary font-bold text-xl" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            PasarGo
          </span>
        </div>
        <div className="flex gap-md">
          <Link href="/login" className="text-primary font-bold text-label-bold border-2 border-primary px-md py-xs rounded-full active:scale-95 transition-transform">
            Masuk
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-20">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="px-margin-mobile py-xl relative overflow-hidden">
          {/* Blobs */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-fixed/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary-fixed/30 blur-2xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-lg text-center">
            <h1 className="font-bold text-display-lg-mobile text-on-background leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Belanja ke Pasar{' '}
              <span className="text-primary">Tanpa Harus</span> ke Pasar
            </h1>
            <p className="text-text-secondary text-body-lg mx-auto">
              Nikmati kesegaran bahan makanan langsung dari pasar tradisional favoritmu. Pilih pasarnya, tentukan barangnya, biar kurir kami yang antar sampai depan pintu.
            </p>
            <div className="flex flex-col gap-md pt-sm">
              <Link
                href="/markets"
                className="bg-primary text-on-primary px-xl py-md rounded-full font-bold text-headline-sm shadow-btn-primary active:scale-95 transition-transform text-center squishy-btn"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Mulai Belanja
              </Link>
              <Link
                href="/register?role=SELLER"
                className="border-2 border-primary text-primary bg-surface-white px-xl py-md rounded-full font-bold text-headline-sm text-center active:scale-95 transition-transform"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Daftar Jadi Penjual
              </Link>
            </div>
            {/* Social Proof */}
            <div className="flex items-center gap-lg justify-center pt-sm text-body-sm opacity-80">
              <div className="flex -space-x-3">
                {['bg-slate-300','bg-slate-400','bg-slate-500'].map((c,i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-surface ${c}`} />
                ))}
              </div>
              <span><strong className="text-primary">5000+</strong> Ibu Rumah Tangga Percaya</span>
            </div>
          </div>
        </section>

        {/* ── Kategori ─────────────────────────────────────────────── */}
        <section className="px-margin-mobile py-xl">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h2 className="font-bold text-headline-md text-on-background" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Kategori Segar</h2>
              <p className="text-text-secondary text-body-sm">Pilih kebutuhan dapur sesuai kategori</p>
            </div>
            <Link href="/markets" className="text-primary font-bold text-label-bold flex items-center gap-base">
              Semua <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-sm">
            {[
              { icon: 'eco', label: 'Sayur' },
              { icon: 'nutrition', label: 'Buah' },
              { icon: 'restaurant', label: 'Bumbu' },
              { icon: 'set_meal', label: 'Ikan' },
              { icon: 'egg', label: 'Ayam' },
              { icon: 'kebab_dining', label: 'Daging' },
              { icon: 'shopping_basket', label: 'Sembako' },
              { icon: 'egg_alt', label: 'Telur' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={`/markets`}
                className="flex flex-col items-center gap-sm p-sm bg-surface-white rounded-xl card-shadow hover:-translate-y-1 transition-transform cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                </div>
                <span className="text-[12px] font-bold text-on-surface text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Cara Kerja ───────────────────────────────────────────── */}
        <section className="bg-surface-container-low py-xl px-margin-mobile mx-0">
          <div className="text-center max-w-sm mx-auto mb-xl">
            <h2 className="font-bold text-headline-md text-on-background" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Bagaimana PasarGo Bekerja?
            </h2>
            <p className="text-text-secondary mt-xs text-body-lg">Mudah, cepat, dan transparan untuk belanja harianmu.</p>
          </div>
          <div className="grid grid-cols-2 gap-lg">
            {[
              { icon: 'storefront', title: 'Pilih Pasar', desc: 'Tentukan pasar tradisional langganan di sekitarmu.' },
              { icon: 'list_alt', title: 'Pilih Barang', desc: 'Masukkan sayur, daging, dan bumbu ke keranjang.' },
              { icon: 'inventory_2', title: 'Penjual Siapkan', desc: 'Penjual pasar menyiapkan pesananmu yang paling segar.' },
              { icon: 'moped', title: 'Kurir Antar', desc: 'Pesanan sampai dalam hitungan menit ke rumahmu.' },
            ].map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center mb-md card-shadow">
                  <span className="material-symbols-outlined text-[28px]">{step.icon}</span>
                </div>
                <h3 className="font-bold text-body-lg text-on-surface">{step.title}</h3>
                <p className="text-body-sm text-text-secondary mt-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Daftar ───────────────────────────────────────────── */}
        <section className="px-margin-mobile py-xl space-y-md">
          <h2 className="font-bold text-headline-md text-on-background" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Bergabung Bersama Kami
          </h2>
          {[
            { role: 'SELLER', icon: 'storefront', label: 'Daftar sebagai Penjual', desc: 'Perluas jangkauan dagangan kamu', color: 'border-secondary-container' },
            { role: 'COURIER', icon: 'moped', label: 'Daftar sebagai Kurir', desc: 'Tambah penghasilan dengan antar pasar', color: 'border-tertiary' },
          ].map((r) => (
            <Link
              key={r.role}
              href={`/register?role=${r.role}`}
              className={`flex items-center gap-md p-md border-2 ${r.color} bg-surface-white rounded-xl card-shadow active:scale-95 transition-transform`}
            >
              <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{r.icon}</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-body-lg">{r.label}</p>
                <p className="text-body-sm text-text-secondary">{r.desc}</p>
              </div>
              <span className="material-symbols-outlined text-outline ml-auto">chevron_right</span>
            </Link>
          ))}
        </section>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="bg-on-background text-surface-container py-xl px-margin-mobile">
          <div className="flex items-center gap-md mb-md">
            <span className="material-symbols-outlined text-primary-fixed">eco</span>
            <span className="font-bold text-headline-sm text-surface-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>PasarGo</span>
          </div>
          <p className="text-body-sm opacity-70 mb-lg">
            Menghubungkan jutaan rumah tangga dengan pasar tradisional melalui teknologi modern yang terpercaya.
          </p>
          <div className="border-t border-surface-container-highest/10 pt-md text-center text-body-sm opacity-50">
            © 2024 PasarGo Indonesia. Seluruh hak cipta dilindungi.
          </div>
        </footer>
      </main>

      {/* ── Mobile Bottom Nav (guest) ─────────────────────────────── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 flex justify-around items-center px-xs pb-6 pt-2 bg-surface-white shadow-bottom-nav rounded-t-xl border-t border-border-muted">
        {[
          { href: '/', icon: 'home', label: 'Home', active: true },
          { href: '/markets', icon: 'storefront', label: 'Markets' },
          { href: '/login', icon: 'shopping_cart', label: 'Cart' },
          { href: '/login', icon: 'receipt_long', label: 'Orders' },
          { href: '/login', icon: 'person', label: 'Profile' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90 ${item.active ? 'text-primary bg-surface-container rounded-full px-4 py-1' : 'text-text-secondary'}`}
          >
            <span
              className="material-symbols-outlined"
              style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
