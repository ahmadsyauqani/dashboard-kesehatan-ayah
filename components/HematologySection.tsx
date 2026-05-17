'use client';

import { Parameter } from '@/types/health';

interface HematologySectionProps {
  parameters: Parameter[];
}

export default function HematologySection({ parameters }: HematologySectionProps) {
  const neutrophil = parameters.find(p => p.id === 'neutrophil');
  const lymphocyte = parameters.find(p => p.id === 'lymphocyte');

  const neutValues = neutrophil?.values.filter(v => v.value !== '-').slice(-2) || [];
  const lympValues = lymphocyte?.values.filter(v => v.value !== '-').slice(-2) || [];

  const neutLatest = neutValues.length > 0 ? Number(neutValues[neutValues.length - 1].value) : null;
  const lympLatest = lympValues.length > 0 ? Number(lympValues[lympValues.length - 1].value) : null;

  const neutHigh = neutLatest !== null && neutLatest > 67.9;
  const lympLow = lympLatest !== null && lympLatest < 21.8;

  return (
    <div className="card-warm p-4 md:p-5 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🔬</span>
        <h2 className="text-sm font-semibold text-[var(--warm-700)] dark:text-[var(--warm-700)]">Sel Darah Putih</h2>
      </div>
      <p className="text-xs text-[var(--warm-400)] mb-4">
        Sel darah putih melindungi tubuh dari infeksi. Berikut kondisinya:
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Neutrofil */}
        <div className={`rounded-2xl p-3.5 ${neutHigh ? 'bg-amber-50/60 dark:bg-amber-950/15' : 'bg-emerald-50/60 dark:bg-emerald-950/15'}`}>
          <p className="text-xs font-medium text-[var(--warm-500)] mb-1">Neutrofil</p>
          <p className="text-xs text-[var(--warm-400)]">Sel pejuang infeksi</p>
          <p className={`text-2xl font-bold mt-2 ${neutHigh ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {neutLatest !== null ? `${neutLatest}%` : '—'}
          </p>
          <p className="text-[11px] text-[var(--warm-400)] mt-1">Normal: 34–68%</p>
          {neutHigh && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 leading-relaxed">
              Sedikit tinggi — tubuh mungkin sedang melawan sesuatu
            </p>
          )}
        </div>

        {/* Limfosit */}
        <div className={`rounded-2xl p-3.5 ${lympLow ? 'bg-amber-50/60 dark:bg-amber-950/15' : 'bg-emerald-50/60 dark:bg-emerald-950/15'}`}>
          <p className="text-xs font-medium text-[var(--warm-500)] mb-1">Limfosit</p>
          <p className="text-xs text-[var(--warm-400)]">Sel penjaga kekebalan</p>
          <p className={`text-2xl font-bold mt-2 ${lympLow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {lympLatest !== null ? `${lympLatest}%` : '—'}
          </p>
          <p className="text-[11px] text-[var(--warm-400)] mt-1">Normal: 22–53%</p>
          {lympLow && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 leading-relaxed">
              Agak rendah — bisa jadi karena tubuh sedang fokus lawan peradangan
            </p>
          )}
        </div>
      </div>

      {(neutHigh || lympLow) && (
        <div className="mt-3 p-3 bg-[var(--warm-100)] rounded-xl">
          <p className="text-xs text-[var(--warm-500)] leading-relaxed">
            💡 <span className="font-medium">Penjelasan sederhana:</span> Saat tubuh melawan infeksi atau peradangan, neutrofil naik dan limfosit turun. Ini respon alami tubuh. Sampaikan ke dokter saat kontrol ya.
          </p>
        </div>
      )}
    </div>
  );
}
