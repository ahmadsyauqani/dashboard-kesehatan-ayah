export default function FooterNote() {
  return (
    <footer className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      <div className="card bg-gradient-to-br from-[var(--warm-50)] to-[var(--warm-100)] p-4 md:p-5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs">🏥</span>
          </div>
          <p className="text-xs font-semibold text-[var(--warm-600)]">Catatan Penting</p>
        </div>

        <p className="text-xs text-[var(--warm-500)] leading-relaxed">
          Dashboard ini untuk membantu Bapak memantau kesehatan.{' '}
          <span className="font-semibold text-[var(--warm-700)] dark:text-[var(--warm-700)]">
            Selalu konsultasikan setiap hasil dengan dokter
          </span>{' '}
          untuk penjelasan yang akurat.
        </p>

        <div className="mt-3 pt-3 border-t border-[var(--card-border)] grid grid-cols-2 gap-2">
          <div>
            <p className="text-[10px] text-[var(--warm-400)] font-medium">Rumah Sakit</p>
            <p className="text-[11px] text-[var(--warm-600)] font-medium">RS Jantung Heartology</p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--warm-400)] font-medium">Dokter</p>
            <p className="text-[11px] text-[var(--warm-600)] font-medium">dr. Debby C. Soemitha, Sp.PD</p>
          </div>
        </div>

        <p className="text-[10px] text-[var(--warm-300)] mt-2.5 text-center">
          Data pemeriksaan: Nov 2024 — Mei 2026 · Dashboard Kesehatan Mandiri v2
        </p>
      </div>
    </footer>
  );
}
