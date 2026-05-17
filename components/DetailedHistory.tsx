'use client';

import { useState, useRef, useEffect } from 'react';
import { Parameter } from '@/types/health';
import { IconChevronDown, IconChevronUp, IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Tooltip, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface DetailedHistoryProps {
  parameters: Parameter[];
}

/* ═══════════════════════════════════════════ */
/*  Parameter metadata                         */
/* ═══════════════════════════════════════════ */
const paramMeta: Record<string, {
  name: string; emoji: string; explain: string; unit: string;
  goodDir: 'lower' | 'higher' | 'negative'; target: string;
  chartColor: string; chartBg: string;
}> = {
  fasting_glucose: { name: 'Gula Darah Puasa', emoji: '🩸', explain: 'Kadar gula saat belum makan pagi', unit: 'mg/dL', goodDir: 'lower', target: '< 99 mg/dL', chartColor: '#F43F5E', chartBg: 'rgba(244,63,94,0.08)' },
  hba1c: { name: 'HbA1c (Rapor Gula 3 Bulan)', emoji: '📊', explain: 'Rata-rata gula darah selama 3 bulan terakhir', unit: '%', goodDir: 'lower', target: '< 7.0%', chartColor: '#EC4899', chartBg: 'rgba(236,72,153,0.08)' },
  egfr: { name: 'Fungsi Ginjal (eLFG)', emoji: '🫘', explain: 'Kemampuan ginjal menyaring darah', unit: 'mL/min', goodDir: 'higher', target: '≥ 90 mL/min', chartColor: '#14B8A6', chartBg: 'rgba(20,184,166,0.08)' },
  creatinine: { name: 'Kreatinin', emoji: '💧', explain: 'Sisa buangan otot yang dibuang ginjal', unit: 'mg/dL', goodDir: 'lower', target: '< 1.20 mg/dL', chartColor: '#3B82F6', chartBg: 'rgba(59,130,246,0.08)' },
  ureum: { name: 'Ureum', emoji: '🧬', explain: 'Sisa buangan pencernaan protein', unit: 'mg/dL', goodDir: 'lower', target: '16.6–48.5 mg/dL', chartColor: '#8B5CF6', chartBg: 'rgba(139,92,246,0.08)' },
  urine_glucose: { name: 'Gula dalam Urin', emoji: '🧪', explain: 'Normalnya gula tidak ada di urin', unit: '', goodDir: 'negative', target: 'Negatif', chartColor: '#F97316', chartBg: 'rgba(249,115,22,0.08)' },
  urine_protein: { name: 'Protein dalam Urin', emoji: '🔬', explain: 'Normalnya protein tidak bocor ke urin', unit: '', goodDir: 'negative', target: 'Negatif', chartColor: '#EAB308', chartBg: 'rgba(234,179,8,0.08)' },
  neutrophil: { name: 'Neutrofil (Pejuang Infeksi)', emoji: '🛡️', explain: 'Sel darah putih utama yang melawan bakteri — terlalu tinggi bisa tanda infeksi', unit: '%', goodDir: 'lower', target: '34–68%', chartColor: '#EF4444', chartBg: 'rgba(239,68,68,0.08)' },
  lymphocyte: { name: 'Limfosit (Kekebalan)', emoji: '🔰', explain: 'Sel kekebalan jangka panjang tubuh — membantu lawan virus', unit: '%', goodDir: 'higher', target: '22–53%', chartColor: '#6366F1', chartBg: 'rgba(99,102,241,0.08)' },
  // Hematologi Rutin
  hemoglobin: { name: 'Hemoglobin (Hb)', emoji: '🩸', explain: 'Protein dalam sel darah merah yang membawa oksigen ke seluruh tubuh', unit: 'g/dL', goodDir: 'higher', target: '13–17 g/dL', chartColor: '#DC2626', chartBg: 'rgba(220,38,38,0.08)' },
  leukocyte: { name: 'Leukosit (Sel Darah Putih)', emoji: '💥', explain: 'Jumlah total pasukan pertahanan tubuh — melawan penyakit', unit: '/µL', goodDir: 'lower', target: '4.000–10.000', chartColor: '#7C3AED', chartBg: 'rgba(124,58,237,0.08)' },
  erythrocyte: { name: 'Eritrosit (Sel Darah Merah)', emoji: '🔴', explain: 'Sel yang mengangkut oksigen dari paru ke seluruh tubuh', unit: 'juta/µL', goodDir: 'higher', target: '4.5–5.5 juta', chartColor: '#E11D48', chartBg: 'rgba(225,29,72,0.08)' },
  hematocrit: { name: 'Hematokrit', emoji: '🌡️', explain: 'Persentase sel darah merah dalam darah — terlalu rendah bisa tanda kurang darah', unit: '%', goodDir: 'higher', target: '40–54%', chartColor: '#BE185D', chartBg: 'rgba(190,24,93,0.08)' },
  platelet: { name: 'Trombosit (Keping Darah)', emoji: '🩹', explain: 'Sel kecil yang membantu darah membeku saat luka', unit: 'ribu/µL', goodDir: 'higher', target: '150–450 ribu', chartColor: '#0891B2', chartBg: 'rgba(8,145,178,0.08)' },
  mcv: { name: 'MCV (Ukuran Sel Darah Merah)', emoji: '🔬', explain: 'Rata-rata ukuran sel darah merah — terlalu besar/kecil bisa tanda masalah', unit: 'fL', goodDir: 'lower', target: '80–96 fL', chartColor: '#4F46E5', chartBg: 'rgba(79,70,229,0.08)' },
  mch: { name: 'MCH (Isi Hemoglobin per Sel)', emoji: '🧪', explain: 'Rata-rata berat hemoglobin di setiap sel darah merah', unit: 'pg', goodDir: 'lower', target: '27–32 pg', chartColor: '#7C3AED', chartBg: 'rgba(124,58,237,0.08)' },
  mchc: { name: 'MCHC (Kepekatan Hemoglobin)', emoji: '💧', explain: 'Kepekatan hemoglobin dalam sel darah merah', unit: 'g/dL', goodDir: 'lower', target: '33–36 g/dL', chartColor: '#9333EA', chartBg: 'rgba(147,51,234,0.08)' },
  // Hitung Jenis (tambahan)
  monocyte: { name: 'Monosit (Pembersih)', emoji: '🧹', explain: 'Sel pembersih yang memakan kuman dan sel rusak', unit: '%', goodDir: 'lower', target: '4–8%', chartColor: '#059669', chartBg: 'rgba(5,150,105,0.08)' },
  eosinophil: { name: 'Eosinofil (Anti-Alergi)', emoji: '🌿', explain: 'Sel yang melawan parasit dan terkait reaksi alergi', unit: '%', goodDir: 'lower', target: '1–4%', chartColor: '#65A30D', chartBg: 'rgba(101,163,13,0.08)' },
  basophil: { name: 'Basofil', emoji: '🟣', explain: 'Sel darah putih paling sedikit — berperan dalam reaksi alergi', unit: '%', goodDir: 'lower', target: '0–1%', chartColor: '#7E22CE', chartBg: 'rgba(126,34,206,0.08)' },
  // Elektrolit
  natrium: { name: 'Natrium (Na)', emoji: '🧂', explain: 'Mineral penting untuk menjaga keseimbangan cairan tubuh dan tekanan darah', unit: 'mEq/L', goodDir: 'lower', target: '136–145 mEq/L', chartColor: '#0284C7', chartBg: 'rgba(2,132,199,0.08)' },
  kalium: { name: 'Kalium (K)', emoji: '🍌', explain: 'Mineral untuk jantung dan otot — harus seimbang, tidak terlalu tinggi/rendah', unit: 'mEq/L', goodDir: 'lower', target: '3.5–5.1 mEq/L', chartColor: '#D97706', chartBg: 'rgba(217,119,6,0.08)' },
  klorida: { name: 'Klorida (Cl)', emoji: '💎', explain: 'Mineral yang membantu menjaga keseimbangan asam-basa dan cairan tubuh', unit: 'mEq/L', goodDir: 'lower', target: '98–107 mEq/L', chartColor: '#0891B2', chartBg: 'rgba(8,145,178,0.08)' },
  // Fungsi Hati
  sgot: { name: 'SGOT (AST)', emoji: '🟤', explain: 'Enzim hati — jika tinggi bisa menandakan gangguan pada hati', unit: 'U/L', goodDir: 'lower', target: '< 40 U/L', chartColor: '#92400E', chartBg: 'rgba(146,64,14,0.08)' },
  sgpt: { name: 'SGPT (ALT)', emoji: '🟠', explain: 'Enzim hati yang lebih spesifik — penanda utama kesehatan hati', unit: 'U/L', goodDir: 'lower', target: '< 41 U/L', chartColor: '#B45309', chartBg: 'rgba(180,83,9,0.08)' },
  // Asam Urat
  uric_acid: { name: 'Asam Urat', emoji: '💠', explain: 'Sisa metabolisme yang dibuang ginjal — terlalu tinggi bisa sebabkan nyeri sendi', unit: 'mg/dL', goodDir: 'lower', target: '< 7.0 mg/dL', chartColor: '#7C3AED', chartBg: 'rgba(124,58,237,0.08)' },
  // Profil Lipid
  cholesterol_total: { name: 'Kolesterol Total', emoji: '🫀', explain: 'Jumlah total lemak di darah — semakin rendah semakin sehat untuk jantung', unit: 'mg/dL', goodDir: 'lower', target: '< 200 mg/dL', chartColor: '#DC2626', chartBg: 'rgba(220,38,38,0.08)' },
  ldl: { name: 'Kolesterol Jahat (LDL)', emoji: '⚠️', explain: 'Lemak jahat yang bisa menyumbat pembuluh darah — harus dijaga rendah', unit: 'mg/dL', goodDir: 'lower', target: '< 100 mg/dL', chartColor: '#EA580C', chartBg: 'rgba(234,88,12,0.08)' },
  hdl: { name: 'Kolesterol Baik (HDL)', emoji: '💚', explain: 'Lemak baik yang melindungi jantung — semakin tinggi semakin bagus', unit: 'mg/dL', goodDir: 'higher', target: '> 40 mg/dL', chartColor: '#16A34A', chartBg: 'rgba(22,163,74,0.08)' },
  triglyceride: { name: 'Trigliserida (Lemak Darah)', emoji: '🍔', explain: 'Lemak dari makanan yang beredar di darah — terlalu tinggi bisa bahayakan jantung', unit: 'mg/dL', goodDir: 'lower', target: '< 150 mg/dL', chartColor: '#D97706', chartBg: 'rgba(217,119,6,0.08)' },
};

/* ═══════════════════════════════════════════ */
/*  Group definitions                          */
/* ═══════════════════════════════════════════ */
const groups = [
  {
    id: 'diabetes', title: 'Gula Darah & Diabetes', emoji: '🩸',
    desc: 'Kontrol gula darah',
    ids: ['fasting_glucose', 'hba1c'],
    gradient: 'from-rose-400 to-pink-500',
    gradientBg: 'from-rose-50 via-pink-50/40 to-orange-50/20 dark:from-rose-950/30 dark:via-pink-950/15 dark:to-orange-950/10',
    accentText: 'text-rose-700 dark:text-rose-300',
    accentBg: 'bg-rose-100/80 dark:bg-rose-900/25',
    ringColor: '#F43F5E',
  },
  {
    id: 'kidney', title: 'Fungsi Ginjal', emoji: '🫘',
    desc: 'Kemampuan ginjal menyaring',
    ids: ['egfr', 'creatinine', 'ureum'],
    gradient: 'from-teal-400 to-cyan-500',
    gradientBg: 'from-teal-50 via-cyan-50/40 to-emerald-50/20 dark:from-teal-950/30 dark:via-cyan-950/15 dark:to-emerald-950/10',
    accentText: 'text-teal-700 dark:text-teal-300',
    accentBg: 'bg-teal-100/80 dark:bg-teal-900/25',
    ringColor: '#14B8A6',
  },
  {
    id: 'urine', title: 'Pemeriksaan Urin', emoji: '🧪',
    desc: 'Apa yang ada di urin',
    ids: ['urine_glucose', 'urine_protein'],
    gradient: 'from-orange-400 to-amber-500',
    gradientBg: 'from-orange-50 via-amber-50/40 to-yellow-50/20 dark:from-orange-950/30 dark:via-amber-950/15 dark:to-yellow-950/10',
    accentText: 'text-orange-700 dark:text-orange-300',
    accentBg: 'bg-orange-100/80 dark:bg-orange-900/25',
    ringColor: '#F97316',
  },
  {
    id: 'lipid', title: 'Profil Lipid (Kolesterol)', emoji: '🫀',
    desc: 'Kesehatan jantung & pembuluh darah',
    ids: ['cholesterol_total', 'ldl', 'hdl', 'triglyceride'],
    gradient: 'from-red-400 to-rose-500',
    gradientBg: 'from-red-50 via-rose-50/40 to-pink-50/20 dark:from-red-950/30 dark:via-rose-950/15 dark:to-pink-950/10',
    accentText: 'text-red-700 dark:text-red-300',
    accentBg: 'bg-red-100/80 dark:bg-red-900/25',
    ringColor: '#DC2626',
  },
  {
    id: 'hematology', title: 'Hematologi Rutin', emoji: '🩸',
    desc: 'Komponen darah — Hb, sel darah, trombosit',
    ids: ['hemoglobin', 'leukocyte', 'erythrocyte', 'hematocrit', 'platelet', 'mcv', 'mch', 'mchc'],
    gradient: 'from-rose-400 to-red-500',
    gradientBg: 'from-rose-50 via-red-50/40 to-pink-50/20 dark:from-rose-950/30 dark:via-red-950/15 dark:to-pink-950/10',
    accentText: 'text-rose-700 dark:text-rose-300',
    accentBg: 'bg-rose-100/80 dark:bg-rose-900/25',
    ringColor: '#E11D48',
  },
  {
    id: 'differential', title: 'Hitung Jenis Sel Darah', emoji: '🔬',
    desc: 'Komposisi pasukan pertahanan tubuh',
    ids: ['neutrophil', 'lymphocyte', 'monocyte', 'eosinophil', 'basophil'],
    gradient: 'from-indigo-400 to-violet-500',
    gradientBg: 'from-indigo-50 via-violet-50/40 to-purple-50/20 dark:from-indigo-950/30 dark:via-violet-950/15 dark:to-purple-950/10',
    accentText: 'text-indigo-700 dark:text-indigo-300',
    accentBg: 'bg-indigo-100/80 dark:bg-indigo-900/25',
    ringColor: '#6366F1',
  },
  {
    id: 'electrolyte', title: 'Elektrolit', emoji: '⚡',
    desc: 'Keseimbangan mineral tubuh',
    ids: ['natrium', 'kalium', 'klorida'],
    gradient: 'from-sky-400 to-blue-500',
    gradientBg: 'from-sky-50 via-blue-50/40 to-cyan-50/20 dark:from-sky-950/30 dark:via-blue-950/15 dark:to-cyan-950/10',
    accentText: 'text-sky-700 dark:text-sky-300',
    accentBg: 'bg-sky-100/80 dark:bg-sky-900/25',
    ringColor: '#0284C7',
  },
  {
    id: 'liver', title: 'Fungsi Hati', emoji: '🫁',
    desc: 'Kesehatan organ hati',
    ids: ['sgot', 'sgpt'],
    gradient: 'from-amber-400 to-yellow-500',
    gradientBg: 'from-amber-50 via-yellow-50/40 to-orange-50/20 dark:from-amber-950/30 dark:via-yellow-950/15 dark:to-orange-950/10',
    accentText: 'text-amber-700 dark:text-amber-300',
    accentBg: 'bg-amber-100/80 dark:bg-amber-900/25',
    ringColor: '#D97706',
  },
  {
    id: 'uric', title: 'Asam Urat', emoji: '💠',
    desc: 'Sisa metabolisme & risiko sendi',
    ids: ['uric_acid'],
    gradient: 'from-purple-400 to-fuchsia-500',
    gradientBg: 'from-purple-50 via-fuchsia-50/40 to-pink-50/20 dark:from-purple-950/30 dark:via-fuchsia-950/15 dark:to-pink-950/10',
    accentText: 'text-purple-700 dark:text-purple-300',
    accentBg: 'bg-purple-100/80 dark:bg-purple-900/25',
    ringColor: '#9333EA',
  },
];

/* ═══════════════════════════════════════════ */
/*  Helpers                                    */
/* ═══════════════════════════════════════════ */
function getStatusStyle(status: string) {
  if (status === 'normal') return { label: 'Baik', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' };
  if (status === 'warning') return { label: 'Perlu diawasi', dot: 'bg-orange-400', text: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' };
  return { label: 'Perlu perhatian', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' };
}

function getGroupStatus(params: Parameter[]): string {
  let worstLevel = 0;
  params.forEach(p => {
    const valid = p.values.filter(v => v.value !== '-');
    if (valid.length > 0) {
      const s = valid[valid.length - 1].status;
      const level = s === 'critical' ? 2 : s === 'warning' ? 1 : 0;
      worstLevel = Math.max(worstLevel, level);
    }
  });
  return worstLevel === 2 ? 'critical' : worstLevel === 1 ? 'warning' : 'normal';
}

function getGroupSummary(params: Parameter[]): string {
  const good = params.filter(p => {
    const valid = p.values.filter(v => v.value !== '-');
    return valid.length > 0 && valid[valid.length - 1].status === 'normal';
  }).length;
  if (good === params.length) return 'Semua baik ✓';
  if (good === 0) return 'Semua perlu perhatian';
  return `${good} dari ${params.length} baik`;
}

/* ═══════════════════════════════════════════ */
/*  Mini chart for expanded view               */
/* ═══════════════════════════════════════════ */
function MiniLineChart({ param }: { param: Parameter }) {
  const meta = paramMeta[param.id];
  if (!meta) return null;

  const validVals = param.values.filter(v => v.value !== '-');
  const isNumeric = validVals.length > 0 && typeof validVals[0].value === 'number';
  if (!isNumeric || validVals.length < 2) return null;

  const labels = param.values.map(v => v.date);
  const data = param.values.map(v => v.value === '-' ? null : Number(v.value));

  const chartData = {
    labels,
    datasets: [{
      data,
      borderColor: meta.chartColor,
      backgroundColor: meta.chartBg,
      fill: true,
      tension: 0.35,
      pointRadius: 3,
      pointBackgroundColor: meta.chartColor,
      pointBorderWidth: 0,
      pointHoverRadius: 5,
      borderWidth: 2,
      spanGaps: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true, intersect: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, color: '#A8A196', maxRotation: 0 } },
      y: { grid: { color: 'rgba(168,161,150,0.1)' }, ticks: { font: { size: 9 }, color: '#A8A196' } },
    },
  } as const;

  return (
    <div className="h-[140px] md:h-[160px]">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  Parameter detail row (inside expanded)     */
/* ═══════════════════════════════════════════ */
function ParamDetail({ param }: { param: Parameter }) {
  const meta = paramMeta[param.id];
  if (!meta) return null;

  const valid = param.values.filter(v => v.value !== '-');
  const latest = valid[valid.length - 1];
  const prev = valid.length > 1 ? valid[valid.length - 2] : null;
  const latestSt = latest ? getStatusStyle(latest.status) : null;

  // Numeric stats
  const nums = valid.filter(v => typeof v.value === 'number').map(v => Number(v.value));
  const hasNums = nums.length > 0;

  // Delta
  let deltaText = '';
  let deltaGood = false;
  if (prev && latest && typeof latest.value === 'number' && typeof prev.value === 'number') {
    const diff = Number(latest.value) - Number(prev.value);
    deltaGood = meta.goodDir === 'higher' ? diff > 0 : diff < 0;
    deltaText = `${diff > 0 ? '↑+' : '↓'}${diff.toFixed(1)}`;
  }

  // Trend
  let trendIcon = IconMinus;
  let trendText = 'Stabil';
  let trendColor = 'text-blue-600 dark:text-blue-400';
  if (nums.length >= 2) {
    const diff = nums[nums.length - 1] - nums[0];
    const improving = meta.goodDir === 'higher' ? diff > 0 : diff < 0;
    if (Math.abs(diff) >= 0.1) {
      if (improving) { trendIcon = IconTrendingUp; trendText = 'Membaik 👍'; trendColor = 'text-emerald-600 dark:text-emerald-400'; }
      else { trendIcon = IconTrendingDown; trendText = 'Perlu perhatian'; trendColor = 'text-amber-600 dark:text-amber-400'; }
    }
  }
  const TrendIcon = trendIcon;

  return (
    <div className="border border-[var(--card-border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center gap-2 bg-[var(--warm-50)]">
        <span className="text-sm">{meta.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[var(--warm-700)] dark:text-[var(--warm-700)] truncate">{meta.name}</p>
          <p className="text-[9px] text-[var(--warm-400)]">{meta.explain}</p>
        </div>
        {latestSt && (
          <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${latestSt.bg} ${latestSt.text} flex items-center gap-0.5`}>
            <span className={`w-1 h-1 rounded-full ${latestSt.dot}`} />
            {latestSt.label}
          </span>
        )}
      </div>

      <div className="px-3 py-2.5 space-y-2">
        {/* Value + delta */}
        <div className="flex items-baseline gap-2">
          <span className={`text-lg font-extrabold ${latestSt?.text || 'text-[var(--warm-600)]'}`}>
            {latest?.value}{meta.unit && ` ${meta.unit}`}
          </span>
          {deltaText && (
            <span className={`text-[10px] font-semibold ${deltaGood ? 'text-emerald-500' : 'text-amber-500'}`}>{deltaText}</span>
          )}
          <span className="text-[9px] text-[var(--warm-300)] ml-auto">🎯 {meta.target}</span>
        </div>

        {/* Mini chart */}
        <MiniLineChart param={param} />

        {/* Timeline compact */}
        <div className="flex flex-wrap gap-1">
          {param.values.map((v, i) => {
            const isLast = i === param.values.length - 1;
            const sc = v.value === '-' ? null : getStatusStyle(v.status);
            return (
              <div key={i} className={`text-center px-1.5 py-1 rounded-lg ${isLast ? 'bg-violet-50/60 dark:bg-violet-950/15 ring-1 ring-violet-200 dark:ring-violet-800' : 'bg-[var(--warm-50)]'}`}>
                <p className="text-[8px] text-[var(--warm-400)]">{v.date}</p>
                <p className={`text-[10px] font-bold ${sc ? sc.text : 'text-[var(--warm-300)]'}`}>
                  {v.value === '-' ? '—' : `${v.value}`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats + Trend */}
        {hasNums && (
          <div className="flex gap-1.5 mt-1">
            <div className="flex-1 grid grid-cols-3 gap-1">
              <div className="bg-emerald-50/60 dark:bg-emerald-950/15 rounded-lg py-1 px-1.5 text-center">
                <p className="text-[7px] text-[var(--warm-400)]">Terendah</p>
                <p className="text-[10px] font-bold text-emerald-600">{Math.min(...nums).toFixed(1)}</p>
              </div>
              <div className="bg-[var(--warm-50)] rounded-lg py-1 px-1.5 text-center">
                <p className="text-[7px] text-[var(--warm-400)]">Rata-rata</p>
                <p className="text-[10px] font-bold text-[var(--warm-600)]">{(nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)}</p>
              </div>
              <div className="bg-amber-50/60 dark:bg-amber-950/15 rounded-lg py-1 px-1.5 text-center">
                <p className="text-[7px] text-[var(--warm-400)]">Tertinggi</p>
                <p className="text-[10px] font-bold text-amber-600">{Math.max(...nums).toFixed(1)}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 px-2 rounded-lg bg-[var(--warm-50)]`}>
              <TrendIcon size={11} className={trendColor} />
              <span className={`text-[9px] font-semibold ${trendColor} whitespace-nowrap`}>{trendText}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  Group Card (main component)                */
/* ═══════════════════════════════════════════ */
function GroupCard({ group, params }: { group: typeof groups[0]; params: Parameter[] }) {
  const [expanded, setExpanded] = useState(false);
  const status = getGroupStatus(params);
  const summary = getGroupSummary(params);
  const statusStyle = getStatusStyle(status);

  return (
    <div className="card overflow-hidden animate-fade-in-up">
      {/* Collapsed — summary view */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left hover:bg-[var(--warm-50)]/30 transition-colors"
      >
        <div className={`px-4 py-3.5 bg-gradient-to-r ${group.gradientBg}`}>
          <div className="flex items-center gap-3">
            {/* Group icon */}
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
              <span className="text-lg">{group.emoji}</span>
            </div>

            {/* Title + summary */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-bold ${group.accentText}`}>{group.title}</h3>
              <p className="text-[10px] text-[var(--warm-400)] mt-0.5">{group.desc}</p>
            </div>

            {/* Status badge + chevron */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {statusStyle.label}
              </span>
              {expanded ? <IconChevronUp size={16} className="text-[var(--warm-400)]" /> : <IconChevronDown size={16} className="text-[var(--warm-400)]" />}
            </div>
          </div>

          {/* Mini parameter pills */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {params.map(p => {
              const m = paramMeta[p.id];
              if (!m) return null;
              const valid = p.values.filter(v => v.value !== '-');
              const lat = valid[valid.length - 1];
              const st = lat ? getStatusStyle(lat.status) : null;

              return (
                <div key={p.id} className="flex items-center gap-1 bg-white/70 dark:bg-white/10 rounded-full px-2 py-0.5">
                  <span className="text-[10px]">{m.emoji}</span>
                  <span className="text-[10px] font-bold text-[var(--warm-600)] dark:text-[var(--warm-500)]">
                    {lat?.value}{m.unit && ` ${m.unit}`}
                  </span>
                  {st && <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </button>

      {/* Expanded — detail view */}
      {expanded && (
        <div className="px-4 py-3.5 space-y-3 animate-slide-down border-t border-[var(--card-border)]">
          {params.map(param => (
            <ParamDetail key={param.id} param={param} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  Main export                                */
/* ═══════════════════════════════════════════ */
export default function DetailedHistory({ parameters }: DetailedHistoryProps) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-3 px-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
          <span className="text-white text-xs">📋</span>
        </div>
        <div>
          <h2 className="text-xs font-bold text-[var(--warm-700)] dark:text-[var(--warm-700)]">
            Riwayat Lengkap
          </h2>
          <p className="text-[10px] text-[var(--warm-400)]">
            Tap kategori untuk lihat detail & grafik
          </p>
        </div>
      </div>

      {/* 7 group cards */}
      <div className="space-y-2.5">
        {groups.map(group => {
          const groupParams = group.ids
            .map(id => parameters.find(p => p.id === id))
            .filter(Boolean) as Parameter[];

          return (
            <GroupCard key={group.id} group={group} params={groupParams} />
          );
        })}
      </div>
    </div>
  );
}
