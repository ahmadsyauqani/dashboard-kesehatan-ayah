'use client';

import { HealthDataResponse } from '@/types/health';
import { IconTrendingUp, IconCheck, IconAlertTriangle, IconStethoscope } from '@tabler/icons-react';

interface HealthOverviewProps {
  data: HealthDataResponse;
}

/* ── Motivational Badge (replaces score ring) ── */
function MotivationBadge({ improvementCount }: { improvementCount: number }) {
  return (
    <div className="relative flex-shrink-0 w-[72px] h-[72px]">
      {/* Pulsing glow behind */}
      <div className="absolute inset-1 rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-400 opacity-20 animate-pulse" />
      {/* Main badge */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 shadow-lg shadow-emerald-200/40 dark:shadow-emerald-900/20 flex flex-col items-center justify-center">
        {improvementCount > 0 ? (
          <>
            <span className="text-2xl leading-none">💪</span>
            <span className="text-[9px] font-bold text-white/90 mt-0.5">{improvementCount} membaik</span>
          </>
        ) : (
          <>
            <span className="text-2xl leading-none">🤲</span>
            <span className="text-[9px] font-bold text-white/90 mt-0.5">Semangat!</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function HealthOverview({ data }: HealthOverviewProps) {
  const criticals = data.alerts.filter(a => a.level === 'critical').length;
  const warnings = data.alerts.filter(a => a.level === 'warning').length;
  const totalAlerts = criticals + warnings;

  // Count parameter statuses for summary
  const allStatuses = data.parameters.map(p => {
    const vals = p.values.filter(v => v.value !== '-');
    return vals.length > 0 ? vals[vals.length - 1].status : 'normal';
  });
  const goodCount = allStatuses.filter(s => s === 'normal').length;
  const warningCount = allStatuses.filter(s => s === 'warning').length;
  const criticalCount = allStatuses.filter(s => s === 'critical').length;
  const totalCount = allStatuses.length;
  const healthPct = Math.round((goodCount / totalCount) * 100);

  // Improvements
  const egfr = data.parameters.find(p => p.id === 'egfr')?.values.filter(v => v.value !== '-') || [];
  const creat = data.parameters.find(p => p.id === 'creatinine')?.values.filter(v => v.value !== '-') || [];
  const ldl = data.parameters.find(p => p.id === 'ldl')?.values.filter(v => v.value !== '-') || [];
  const hb = data.parameters.find(p => p.id === 'hemoglobin')?.values.filter(v => v.value !== '-') || [];
  const improvements = [
    egfr.length >= 2 && Number(egfr[egfr.length-1].value) > Number(egfr[egfr.length-2].value) && { label: 'Ginjal membaik', icon: '🫘', color: 'text-teal-700 dark:text-teal-300' },
    creat.length >= 2 && Number(creat[creat.length-1].value) < Number(creat[creat.length-2].value) && { label: 'Kreatinin turun', icon: '💧', color: 'text-blue-700 dark:text-blue-300' },
    ldl.length >= 2 && Number(ldl[ldl.length-1].value) < Number(ldl[ldl.length-2].value) && { label: 'Kolesterol turun', icon: '🫀', color: 'text-rose-700 dark:text-rose-300' },
    hb.length >= 2 && Number(hb[hb.length-1].value) > Number(hb[hb.length-2].value) && { label: 'Hemoglobin naik', icon: '🩸', color: 'text-red-700 dark:text-red-300' },
  ].filter(Boolean) as { label: string; icon: string; color: string }[];

  const hasAttention = totalAlerts > 0;

  return (
    <div className="animate-fade-in-up">
      <div className="card overflow-hidden">
        {/* ── Main content area ── */}
        <div className="relative px-4 py-4 md:px-5 md:py-5 bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-cyan-50/20 dark:from-emerald-950/30 dark:via-teal-950/15 dark:to-cyan-950/5">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.07] bg-emerald-400" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-[0.05] bg-teal-400" />

          {/* Row: Motivation Badge + Message */}
          <div className="relative flex items-center gap-4">
            <MotivationBadge improvementCount={improvements.length} />

            <div className="flex-1 min-w-0">
              {/* Greeting */}
              <div className="flex items-center gap-1.5 mb-1">
                <IconStethoscope size={14} className="text-emerald-500" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--warm-400)]">
                  Ringkasan Kesehatan
                </span>
              </div>

              <h2 className="text-sm md:text-[15px] font-bold leading-snug text-[var(--warm-700)]">
                {improvements.length > 0
                  ? `Alhamdulillah, ${improvements.length} hal yang membaik! 🤲`
                  : 'Tetap semangat ya, Pak! 💪'
                }
              </h2>
              <p className="text-[11px] mt-0.5 leading-relaxed text-[var(--warm-400)]">
                {improvements.length > 0
                  ? 'Ada perkembangan positif. Terus jaga pola hidup sehat ya, Pak.'
                  : 'Setiap langkah kecil menuju sehat itu berarti. Kami mendukung Bapak.'
                }
              </p>
            </div>
          </div>

          {/* ── Stats cards row ── */}
          <div className="relative grid grid-cols-3 gap-2 mt-4">
            {/* Good */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl px-2.5 py-2 border border-emerald-100/60 dark:border-emerald-800/20">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <IconCheck size={10} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[9px] text-[var(--warm-400)] font-medium">Baik</span>
              </div>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">{goodCount}</p>
              <p className="text-[8px] text-[var(--warm-300)] mt-0.5">parameter</p>
            </div>

            {/* Warning */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl px-2.5 py-2 border border-amber-100/60 dark:border-amber-800/20">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <IconAlertTriangle size={9} className="text-white" strokeWidth={3} />
                </div>
                <span className="text-[9px] text-[var(--warm-400)] font-medium">Diawasi</span>
              </div>
              <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400 leading-none">{warningCount}</p>
              <p className="text-[8px] text-[var(--warm-300)] mt-0.5">parameter</p>
            </div>

            {/* Critical */}
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl px-2.5 py-2 border border-rose-100/60 dark:border-rose-800/20">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">!</span>
                </div>
                <span className="text-[9px] text-[var(--warm-400)] font-medium">Perhatian</span>
              </div>
              <p className="text-lg font-extrabold text-rose-600 dark:text-rose-400 leading-none">{criticalCount}</p>
              <p className="text-[8px] text-[var(--warm-300)] mt-0.5">parameter</p>
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div className="relative mt-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-[var(--warm-400)] font-medium">Progres kesehatan</span>
              <span className="text-[9px] font-bold text-[var(--warm-500)]">{goodCount} / {totalCount}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--warm-100)] dark:bg-[var(--warm-50)]/10 overflow-hidden">
              <div className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
                style={{ width: `${healthPct}%` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Improvements strip ── */}
        {improvements.length > 0 && (
          <div className="px-4 py-2.5 md:px-5 bg-gradient-to-r from-emerald-50/60 via-teal-50/30 to-transparent dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-transparent border-t border-emerald-100/40 dark:border-emerald-900/15">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <IconTrendingUp size={11} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 flex-shrink-0">
                Perbaikan
              </span>
              <div className="flex flex-wrap gap-1.5">
                {improvements.map((imp, i) => (
                  <span key={i} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 dark:bg-white/5 border border-emerald-100/50 dark:border-emerald-800/20 ${imp.color}`}>
                    {imp.icon} {imp.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
