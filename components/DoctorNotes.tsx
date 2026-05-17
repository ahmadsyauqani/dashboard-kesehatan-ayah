'use client';

import { useState } from 'react';
import { Alert } from '@/types/health';
import { IconChevronDown, IconChevronUp, IconStethoscope } from '@tabler/icons-react';

interface DoctorNotesProps {
  alerts: Alert[];
}

function simplifyMessage(alert: Alert): { text: string; emoji: string } {
  const map: Record<string, { text: string; emoji: string }> = {
    'Pola penurunan fungsi ginjal berkorelasi dengan glukosuria persisten. Risiko beban filtrasi glomerulus tinggi.':
      { text: 'Gula ditemukan terus di urin — ginjal bekerja ekstra keras untuk menyaringnya', emoji: '🧪' },
    'Pola hematologi mengindikasikan kemungkinan respons inflamasi atau infeksi aktif.':
      { text: 'Sel darah putih menunjukkan tubuh sedang melawan peradangan atau infeksi ringan', emoji: '🛡️' },
    'Kontrol glikemik suboptimal. Pertimbangkan evaluasi rejimen terapi diabetes.':
      { text: 'Gula darah masih di atas target — perlu diskusi pengaturan obat', emoji: '💊' },
    'Peningkatan kreatinin akut terdeteksi. Pastikan hidrasi adekuat dan evaluasi nefrotoksisitas.':
      { text: 'Kreatinin sempat naik — pastikan minum air putih yang cukup', emoji: '💧' },
  };
  return map[alert.message] || { text: alert.message, emoji: '📋' };
}

export default function DoctorNotes({ alerts }: DoctorNotesProps) {
  const activeAlerts = alerts.filter(a => a.level !== 'normal');
  const [open, setOpen] = useState(false);
  if (activeAlerts.length === 0) return null;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      <div className="card overflow-hidden">
        {/* Header — always visible */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-[var(--warm-50)]/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <IconStethoscope size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--warm-700)] dark:text-[var(--warm-700)]">
              Catatan untuk Dokter
            </p>
            <p className="text-[10px] text-[var(--warm-400)]">
              {activeAlerts.length} hal untuk dibicarakan saat kontrol
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex -space-x-1.5">
              {activeAlerts.map((_, i) => (
                <span key={i} className="w-3 h-3 rounded-full border-2 border-white dark:border-[var(--card-bg)] bg-amber-400" />
              ))}
            </div>
            {open ? <IconChevronUp size={16} className="text-[var(--warm-400)]" /> : <IconChevronDown size={16} className="text-[var(--warm-400)]" />}
          </div>
        </button>

        {/* Content */}
        {open && (
          <div className="animate-slide-down">
            <div className="mx-4 mb-3 px-3 py-2 bg-blue-50/50 dark:bg-blue-950/15 rounded-xl">
              <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80">
                📋 Bawa catatan ini saat kontrol ke <span className="font-semibold">dr. Debby Christiana Soemitha, Sp.PD</span>
              </p>
            </div>

            <div className="px-4 pb-4 space-y-2">
              {activeAlerts.map((alert, i) => {
                const info = simplifyMessage(alert);
                return (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-[var(--warm-50)] rounded-xl border border-[var(--card-border)]">
                    <span className="text-sm flex-shrink-0 mt-0.5">{info.emoji}</span>
                    <p className="text-xs text-[var(--warm-600)] leading-relaxed">{info.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
