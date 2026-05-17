'use client';

import { useState } from 'react';
import { Parameter } from '@/types/health';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler, ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
try { ChartJS.register(annotationPlugin); } catch { /* ok */ }

interface TrendChartProps {
  parameters: Parameter[];
}

type TabId = 'gula' | 'ginjal' | 'kreatinin' | 'hba1c' | 'lipid';

function getNumericValues(param: Parameter | undefined) {
  if (!param) return { labels: [] as string[], data: [] as (number | null)[] };
  const labels: string[] = [];
  const data: (number | null)[] = [];
  param.values.forEach(v => {
    labels.push(v.date);
    data.push(v.value === '-' ? null : Number(v.value));
  });
  return { labels, data };
}

function getTrend(data: (number | null)[], higherIsBetter: boolean): { text: string; emoji: string; color: string } {
  const valid = data.filter(d => d !== null) as number[];
  if (valid.length < 2) return { text: '', emoji: '', color: '' };
  const last = valid[valid.length - 1];
  const prev = valid[valid.length - 2];
  const diff = last - prev;
  const improving = higherIsBetter ? diff > 0 : diff < 0;
  
  if (Math.abs(diff) < 0.5 && !higherIsBetter) {
    return { text: 'Stabil — pertahankan ya, Pak! 💪', emoji: '➡️', color: 'text-blue-600 dark:text-blue-400' };
  }
  if (improving) {
    return { text: 'Alhamdulillah, ada perbaikan! Terus semangat ya, Pak! 🤲', emoji: '📈', color: 'text-emerald-600 dark:text-emerald-400' };
  }
  return { text: 'Sedikit naik dari sebelumnya. Jangan khawatir, kita jaga sama-sama ya, Pak.', emoji: '📊', color: 'text-amber-600 dark:text-amber-400' };
}

const tabConfig: Record<TabId, {
  label: string;
  icon: string;
  paramId: string;
  explanation: string;
  whatItMeans: string;
  target: string;
  targetValue: number;
  targetLabel: string;
  higherIsBetter: boolean;
  chartColor: string;
  chartBg: string;
  goodPointColor: string;
  cautionPointColor: string;
  pointCheck: (v: number) => boolean; // true = caution
  encouragement: string;
}> = {
  gula: {
    label: 'Gula Darah',
    icon: '🩸',
    paramId: 'fasting_glucose',
    explanation: 'Kadar gula darah saat puasa (belum makan pagi)',
    whatItMeans: 'Angka ini menunjukkan berapa banyak gula di dalam darah saat perut kosong. Kalau terlalu tinggi, artinya tubuh kesulitan mengontrol gula. Ini yang perlu kita jaga bersama.',
    target: 'Target: di bawah 99 mg/dL → semakin rendah semakin bagus',
    targetValue: 99,
    targetLabel: 'Target sehat: 99',
    higherIsBetter: false,
    chartColor: '#6366F1',
    chartBg: 'rgba(99, 102, 241, 0.06)',
    goodPointColor: '#059669',
    cautionPointColor: '#D97706',
    pointCheck: (v) => v > 99,
    encouragement: 'Dengan menjaga pola makan dan olahraga ringan, angka ini bisa turun. Semangat! 💪',
  },
  ginjal: {
    label: 'Fungsi Ginjal',
    icon: '🫘',
    paramId: 'egfr',
    explanation: 'Seberapa baik ginjal Bapak bekerja menyaring darah',
    whatItMeans: 'Ginjal bertugas menyaring kotoran dari darah. Angka ini (eLFG) menunjukkan seberapa baik ginjal bekerja. Kabar baiknya, angka ini terus naik sejak Desember 2025!',
    target: 'Target: di atas 90 mL/min → semakin tinggi semakin bagus',
    targetValue: 90,
    targetLabel: 'Target sehat: 90',
    higherIsBetter: true,
    chartColor: '#0D9488',
    chartBg: 'rgba(13, 148, 136, 0.06)',
    goodPointColor: '#059669',
    cautionPointColor: '#D97706',
    pointCheck: (v) => v < 90,
    encouragement: 'Fungsi ginjal Bapak menunjukkan perbaikan yang bagus! Terus jaga minum air putih yang cukup ya. 💧',
  },
  kreatinin: {
    label: 'Kreatinin',
    icon: '💧',
    paramId: 'creatinine',
    explanation: 'Limbah otot yang disaring oleh ginjal',
    whatItMeans: 'Kreatinin adalah sisa buangan dari otot yang seharusnya dibuang oleh ginjal lewat urin. Kalau angka ini tinggi, artinya ginjal kurang mampu membuangnya. Kabar baiknya, angka Bapak terakhir sudah bagus!',
    target: 'Target: di bawah 1.20 mg/dL → semakin rendah semakin bagus',
    targetValue: 1.20,
    targetLabel: 'Target sehat: 1.20',
    higherIsBetter: false,
    chartColor: '#8B5CF6',
    chartBg: 'rgba(139, 92, 246, 0.06)',
    goodPointColor: '#059669',
    cautionPointColor: '#D97706',
    pointCheck: (v) => v > 1.2,
    encouragement: 'Nilai terakhir 0.91 — sudah di bawah batas! Ini artinya ginjal Bapak bekerja lebih baik. Alhamdulillah! 🤲',
  },
  hba1c: {
    label: 'HbA1c',
    icon: '📊',
    paramId: 'hba1c',
    explanation: 'Rata-rata gula darah dalam 3 bulan terakhir',
    whatItMeans: 'Berbeda dengan gula darah puasa yang hanya menunjukkan kondisi saat itu, HbA1c menggambarkan rata-rata gula darah selama 3 bulan. Ini seperti "rapor" gula darah Bapak.',
    target: 'Target dokter: di bawah 7.0% → semakin rendah semakin bagus',
    targetValue: 7.0,
    targetLabel: 'Target dokter: 7.0%',
    higherIsBetter: false,
    chartColor: '#EC4899',
    chartBg: 'rgba(236, 72, 153, 0.06)',
    goodPointColor: '#059669',
    cautionPointColor: '#D97706',
    pointCheck: (v) => v > 7.0,
    encouragement: 'Pernah turun sampai 6.6% di Juli 2025. Itu artinya tubuh Bapak bisa! Ayo kita kejar lagi target itu. 🎯',
  },
  lipid: {
    label: 'Kolesterol',
    icon: '🫀',
    paramId: 'ldl',
    explanation: 'Kolesterol jahat (LDL) yang bisa menyumbat pembuluh darah',
    whatItMeans: 'LDL adalah lemak jahat yang bisa menumpuk di dinding pembuluh darah dan menyebabkan penyumbatan. Karena Bapak juga punya diabetes, sangat penting menjaga LDL tetap rendah untuk melindungi jantung.',
    target: 'Target: di bawah 100 mg/dL → semakin rendah semakin aman untuk jantung',
    targetValue: 100,
    targetLabel: 'Target sehat: 100',
    higherIsBetter: false,
    chartColor: '#DC2626',
    chartBg: 'rgba(220, 38, 38, 0.06)',
    goodPointColor: '#059669',
    cautionPointColor: '#D97706',
    pointCheck: (v) => v > 100,
    encouragement: 'Alhamdulillah, LDL Bapak sudah di bawah 100 sejak Jul 2025! Dari 89 turun ke 51, sekarang 63. Terus pertahankan ya, Pak. ❤️',
  },
};

export default function TrendChart({ parameters }: TrendChartProps) {
  const [activeTab, setActiveTab] = useState<TabId>('gula');
  const config = tabConfig[activeTab];
  const param = parameters.find(p => p.id === config.paramId);
  const { labels, data } = getNumericValues(param);
  const trend = getTrend(data, config.higherIsBetter);

  const chartData = {
    labels,
    datasets: [{
      label: config.label,
      data,
      borderColor: config.chartColor,
      backgroundColor: config.chartBg,
      fill: true,
      pointBackgroundColor: data.map(v => v !== null && config.pointCheck(v) ? config.cautionPointColor : config.goodPointColor),
      pointBorderColor: data.map(v => v !== null && config.pointCheck(v) ? config.cautionPointColor : config.goodPointColor),
      pointRadius: 6,
      pointHoverRadius: 9,
      borderWidth: 2.5,
      tension: 0.35,
    }],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartOptions: ChartOptions<'line'> & { plugins?: any } = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(45, 42, 38, 0.95)',
        titleColor: '#f5f3ef',
        bodyColor: '#d4cfc5',
        borderColor: 'rgba(168, 161, 150, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const, family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        callbacks: {
          title: (items: { label: string }[]) => `Pemeriksaan ${items[0]?.label || ''}`,
          label: (item) => {
            const val = item.parsed.y;
            if (val === null || val === undefined) return '';
            const unit = config.paramId === 'hba1c' ? '%' : config.paramId === 'egfr' ? ' mL/min' : ' mg/dL';
            let line = `${config.label}: ${val}${unit}`;
            if (item.dataIndex > 0) {
              const rawData = item.dataset.data as (number | null)[];
              const prev = rawData[item.dataIndex - 1];
              if (prev !== null && prev !== undefined) {
                const delta = val - Number(prev);
                const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
                line += ` (${arrow} ${delta > 0 ? '+' : ''}${delta.toFixed(1)})`;
              }
            }
            return line;
          },
          afterBody: () => ['', '🏥 RS Jantung Heartology'],
        },
      },
      annotation: {
        annotations: {
          targetLine: {
            type: 'line' as const,
            yMin: config.targetValue,
            yMax: config.targetValue,
            borderColor: 'rgba(217, 119, 6, 0.35)',
            borderWidth: 1.5,
            borderDash: [6, 4],
            label: {
              display: true,
              content: config.targetLabel,
              position: 'end' as const,
              font: { size: 10 },
              color: '#D97706',
            },
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' } } },
      y: { grid: { color: 'rgba(168, 161, 150, 0.08)' }, ticks: { font: { size: 11, family: 'Inter' } } },
    },
  };

  return (
    <div className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      {/* Header with gradient icon */}
      <div className="px-4 pt-4 md:px-5 md:pt-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-xs">📈</span>
        </div>
        <div>
          <h2 className="text-xs font-bold text-[var(--warm-700)] dark:text-[var(--warm-700)]">
            Perkembangan dari Waktu ke Waktu
          </h2>
          <p className="text-[10px] text-[var(--warm-400)]">
            Lihat perubahan setiap kali periksa
          </p>
        </div>
      </div>

      {/* Pill-style tabs — horizontally scrollable on small screens */}
      <div className="flex flex-nowrap overflow-x-auto scrollbar-hide px-4 pt-3 pb-1 gap-1.5 md:px-5 -mx-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        {(Object.keys(tabConfig) as TabId[]).map(tabId => {
          const tab = tabConfig[tabId];
          return (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all rounded-full flex-shrink-0 ${
                activeTab === tabId
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-sm'
                  : 'text-[var(--warm-400)] hover:bg-[var(--warm-100)] hover:text-[var(--warm-600)]'
              }`}
              role="tab"
              aria-selected={activeTab === tabId}
            >
              <span className="text-xs">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
        {/* Right padding spacer for scroll */}
        <div className="flex-shrink-0 w-1" aria-hidden="true" />
      </div>

      {/* Info strip */}
      <div className="px-4 pt-2.5 md:px-5 flex items-center gap-3 flex-wrap">
        <p className="text-[11px] text-[var(--warm-500)] font-medium">
          {config.icon} {config.explanation}
        </p>
        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/15 px-2 py-0.5 rounded-full">
          🎯 {config.target.replace('Target: ', '')}
        </span>
      </div>

      {/* Chart */}
      <div className="px-4 pt-2 pb-3 md:px-5">
        <div className="h-[200px] md:h-[260px]">
          <Line key={activeTab} data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Trend + Explainer consolidated */}
      <div className="px-4 pb-4 md:px-5 space-y-2">
        {/* Trend */}
        {trend.text && (
          <div className={`p-2.5 rounded-xl bg-[var(--warm-50)] flex items-center gap-2 ${trend.color}`}>
            <span className="text-sm">{trend.emoji}</span>
            <p className="text-[11px] font-medium">{trend.text}</p>
          </div>
        )}

        {/* Explainer + Encouragement merged */}
        <div className="p-3 bg-violet-50/40 dark:bg-violet-950/10 rounded-xl border border-violet-100/40 dark:border-violet-900/20">
          <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 mb-1">💡 Apa artinya?</p>
          <p className="text-[11px] text-[var(--warm-500)] leading-relaxed">{config.whatItMeans}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">{config.encouragement}</p>
        </div>
      </div>
    </div>
  );
}
