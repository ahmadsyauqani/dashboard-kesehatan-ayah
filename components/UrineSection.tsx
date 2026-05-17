'use client';

import { Parameter } from '@/types/health';
import { URINE_SCALE } from '@/lib/parser';

interface UrineSectionProps {
  parameters: Parameter[];
}

const valConfig: Record<string, { color: string; bg: string; text: string }> = {
  'Negatif': { color: 'bg-emerald-400', bg: 'bg-emerald-50/60 dark:bg-emerald-950/15', text: 'text-emerald-600 dark:text-emerald-400' },
  'Trace': { color: 'bg-yellow-400', bg: 'bg-yellow-50/60 dark:bg-yellow-950/15', text: 'text-yellow-600 dark:text-yellow-400' },
  '1+': { color: 'bg-orange-400', bg: 'bg-orange-50/60 dark:bg-orange-950/15', text: 'text-orange-600 dark:text-orange-400' },
  '2+': { color: 'bg-amber-500', bg: 'bg-amber-50/60 dark:bg-amber-950/15', text: 'text-amber-600 dark:text-amber-400' },
  '3+': { color: 'bg-amber-600', bg: 'bg-amber-50/60 dark:bg-amber-950/15', text: 'text-amber-700 dark:text-amber-400' },
};

export default function UrineSection({ parameters }: UrineSectionProps) {
  const urineGlucose = parameters.find(p => p.id === 'urine_glucose');
  const urineProtein = parameters.find(p => p.id === 'urine_protein');

  const items = [
    { label: 'Gula dalam Urin', param: urineGlucose, target: 'Negatif (tidak ada)',
      explain: 'Normalnya gula tidak ditemukan di urin. Jika ada, artinya gula darah terlalu tinggi sehingga ginjal tidak bisa menyaring semua.' },
    { label: 'Protein dalam Urin', param: urineProtein, target: 'Negatif (tidak ada)',
      explain: 'Normalnya protein tidak ada di urin. Jika ditemukan, ginjal mungkin perlu diperhatikan lebih.' },
  ];

  return (
    <div className="card-warm p-4 md:p-5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🧪</span>
        <h2 className="text-sm font-semibold text-[var(--warm-700)] dark:text-[var(--warm-700)]">Pemeriksaan Urin</h2>
      </div>
      <p className="text-xs text-[var(--warm-400)] mb-4">
        Urin bisa memberi tahu banyak hal tentang kesehatan ginjal dan gula darah
      </p>

      <div className="space-y-5">
        {items.map(item => {
          if (!item.param) return null;
          const validValues = item.param.values.filter(v => v.value !== '-');
          const latest = validValues[validValues.length - 1];
          const latestStr = String(latest?.value ?? 'Negatif');
          const barPct = ((URINE_SCALE[latestStr] ?? 0) / 3) * 100;
          const cfg = valConfig[latestStr] || valConfig['Negatif'];

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-[var(--warm-600)]">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${cfg.text}`}>{latestStr}</span>
                  <span className="text-[11px] text-[var(--warm-400)]">/ {item.target}</span>
                </div>
              </div>

              {/* Simple bar */}
              <div className="relative h-3 bg-[var(--warm-100)] rounded-full overflow-hidden">
                <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${cfg.color}`} style={{ width: `${Math.max(barPct, 2)}%` }} />
              </div>

              {/* Simple explanation */}
              <p className="text-[11px] text-[var(--warm-400)] mt-1.5 leading-relaxed">{item.explain}</p>

              {/* Timeline pills */}
              <div className="mt-2 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                {validValues.map((v, i) => {
                  const vs = String(v.value);
                  const vc = valConfig[vs] || valConfig['Negatif'];
                  return (
                    <div key={i} className={`${vc.bg} rounded-lg px-2.5 py-1 flex-shrink-0 text-center min-w-[50px]`}>
                      <p className="text-[10px] text-[var(--warm-400)]">{v.date}</p>
                      <p className={`text-[11px] font-bold ${vc.text}`}>{vs}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
