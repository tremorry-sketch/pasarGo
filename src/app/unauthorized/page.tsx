import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center bg-background">
      <div className="w-24 h-24 bg-error-container rounded-full flex items-center justify-center mb-lg">
        <span className="material-symbols-outlined text-[48px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
          gpp_bad
        </span>
      </div>
      <h1 className="font-bold text-headline-sm text-on-surface mb-xs" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        Akses Ditolak
      </h1>
      <p className="text-body-sm text-text-secondary mb-xl">
        Kamu tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Link
        href="/"
        className="bg-primary text-on-primary px-xl py-md rounded-full font-bold text-label-bold shadow-btn-primary active:scale-95 transition-transform"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
