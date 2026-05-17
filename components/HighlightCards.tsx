'use client';

import { Highlights } from '@/types/health';

interface HighlightCardsProps {
  highlights: Highlights;
}

const cards = [
  {
    key: 'hba1c' as const,
    emoji: '🩸',
    name: 'Gula Darah Jangka Panjang',
    short: 'HbA1c',
    explain: 'Rata-rata gula darah 3 bulan terakhir',
    targetLabel: 'Target < 7.0%',
    maxVal: 12,
    gradient: { good: ['#34D399', '#10B981'], caution: ['#FBBF24', '#F59E0B'], bad: ['#FB923C', '#EA580C'] },
  },
  {
    key: 'glucose' as const,
    emoji: '☕',
    name: 'Gula Darah Puasa',
    short: 'GDP',
    explain: 'Kadar gula saat belum makan pagi',
    targetLabel: 'Normal < 99',
    maxVal: 200,
    gradient: { good: ['#34D399', '#10B981'], caution: ['#FBBF24', '#F59E0B'], bad: ['#FB923C', '#EA580C'] },
  },
  {
    key: 'egfr' as const,
    emoji: '🫘',
    name: 'Fungsi Ginjal',
    short: 'eLFG',
    explain: 'Kemampuan ginjal menyaring darah',
    targetLabel: 'Sehat ≥ 90',
    maxVal: 120,
    gradient: { good: ['#34D399', '#10B981'], caution: ['#FBBF24', '#F59E0B'], bad: ['#FB923C', '#EA580C'] },
  },
];

function GaugeRing({ value, max, status, size = 80, stroke = 6 }: {
  value: number; max: number; status: string; size?: number; stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);

  const colors = {
    normal: { stroke: 'url(#grad-good)', bg: 'rgba(16, 185, 129, 0.08)' },
    warning: { stroke: 'url(#grad-caution)', bg: 'rgba(245, 158, 11, 0.08)' },
    critical: { stroke: 'url(#grad-caution)', bg: 'rgba(251, 146, 60, 0.08)' },
  };
  const c = colors[status as keyof typeof colors] || colors.normal;

  return (
    <svg width={size} height={size} className="progress-ring" viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="grad-good" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="grad-caution" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--warm-200)" strokeWidth={stroke} opacity={0.35} />
      {/* Progress */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c.stroke} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="progress-ring-circle" />
    </svg>
  );
}

const statusCfg = {
  critical: {
    label: 'Perlu perhatian',
    bg: 'bg-gradient-to-b from-amber-50/90 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/15',
    border: 'border-amber-200/60 dark:border-amber-800/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  warning: {
    label: 'Perlu diawasi',
    bg: 'bg-gradient-to-b from-orange-50/70 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10',
    border: 'border-orange-200/50 dark:border-orange-800/25',
    text: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-400',
    badge: 'bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  },
  normal: {
    label: 'Baik ✓',
    bg: 'bg-gradient-to-b from-emerald-50/70 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10',
    border: 'border-emerald-200/50 dark:border-emerald-800/25',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  },
};

export default function HighlightCards({ highlights }: HighlightCardsProps) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <div className="grid grid-cols-3 gap-2">
        {cards.map((card, index) => {
          const h = card.key === 'egfr' ? highlights.egfr : highlights[card.key];
          const sc = statusCfg[h.status];
          const numVal = Number(h.value);

          return (
            <div
              key={card.key}
              className={`card ${sc.bg} ${sc.border} border overflow-hidden animate-fade-in-up`}
              style={{ animationDelay: `${(index + 1) * 80 + 100}ms` }}
            >
              {/* Top: Ring + Value */}
              <div className="pt-3 pb-2 px-2 flex flex-col items-center">
                <div className="relative">
                  <GaugeRing value={numVal} max={card.maxVal} status={h.status} size={76} stroke={5} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-lg md:text-xl font-extrabold leading-none ${sc.text}`}>
                      {h.value}
                    </span>
                    <span className="text-[9px] text-[var(--warm-400)] mt-0.5">{h.unit}</span>
                  </div>
                </div>
              </div>

              {/* Info section */}
              <div className="px-2.5 pb-3 text-center">
                <p className="text-[11px] font-bold text-[var(--warm-700)] dark:text-[var(--warm-700)] leading-tight">
                  {card.name}
                </p>
                <p className="text-[9px] text-[var(--warm-400)] mt-0.5">{card.explain}</p>

                {/* Status + target */}
                <div className="mt-2 space-y-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold ${sc.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                  <p className="text-[9px] text-[var(--warm-300)]">{card.targetLabel}</p>
                </div>

                {/* Delta for eLFG */}
                {card.key === 'egfr' && highlights.egfr.delta !== 0 && (
                  <div className={`mt-1 text-[10px] font-bold ${highlights.egfr.delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                    {highlights.egfr.delta > 0 ? '↑' : '↓'} {Math.abs(highlights.egfr.delta)} dari sebelumnya
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
