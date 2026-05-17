// Automated Clinical Alert Engine
// Rule-based deterministic alert logic — PRD Section 5.3
// 6 rules evaluated in priority order

import { Parameter, Alert } from '@/types/health';

export function runAlertEngine(params: Parameter[]): Alert[] {
  const alerts: Alert[] = [];
  
  const get = (id: string) => params.find(p => p.id === id);
  
  const latest = (id: string): number | string | null => {
    const p = get(id);
    if (!p) return null;
    const validValues = p.values.filter(v => v.value !== '-');
    return validValues.length > 0 ? validValues[validValues.length - 1].value : null;
  };

  const urineToNumber = (val: string | number | null): number => {
    if (val === null) return 0;
    if (typeof val === 'number') return val;
    const map: Record<string, number> = {
      'Negatif': 0,
      'Trace': 0.5,
      '1+': 1,
      '2+': 2,
      '3+': 3,
    };
    return map[val] ?? 0;
  };

  // Rule 1 — Glukosuria + Proteinuria → KRITIS
  const urineGlucose = latest('urine_glucose');
  const urineProtein = latest('urine_protein');
  if (urineGlucose === '3+' && urineToNumber(urineProtein) >= 1) {
    alerts.push({
      level: 'critical',
      triggeredBy: ['urine_glucose', 'urine_protein'],
      message: 'Pola penurunan fungsi ginjal berkorelasi dengan glukosuria persisten. Risiko beban filtrasi glomerulus tinggi.',
    });
  }

  // Rule 2 — eLFG < 60 pada 2 pemeriksaan berurutan → KRITIS
  const egfrVals = get('egfr')?.values.filter(v => v.value !== '-').slice(-2) ?? [];
  if (egfrVals.length === 2 && egfrVals.every(v => Number(v.value) < 60)) {
    alerts.push({
      level: 'critical',
      triggeredBy: ['egfr'],
      message: 'eLFG persistently <60 mL/min: kemungkinan PGK Stadium III. Evaluasi nefrologi segera.',
    });
  }

  // Rule 3 — HbA1c > 7.5% pada pemeriksaan terbaru → WASPADA
  const hba1cVal = Number(latest('hba1c'));
  if (hba1cVal > 7.5) {
    alerts.push({
      level: 'warning',
      triggeredBy: ['hba1c'],
      message: 'Kontrol glikemik suboptimal. Pertimbangkan evaluasi rejimen terapi diabetes.',
    });
  }

  // Rule 4 — Kreatinin naik > 0.3 dari sebelumnya → WASPADA
  const creatVals = get('creatinine')?.values.filter(v => v.value !== '-').slice(-2) ?? [];
  if (creatVals.length === 2 && (Number(creatVals[1].value) - Number(creatVals[0].value)) > 0.3) {
    alerts.push({
      level: 'warning',
      triggeredBy: ['creatinine'],
      message: 'Peningkatan kreatinin akut terdeteksi. Pastikan hidrasi adekuat dan evaluasi nefrotoksisitas.',
    });
  }

  // Rule 5 — Neutrofilia + Limfopenia → INFO
  const neutrophilVal = Number(latest('neutrophil'));
  const lymphocyteVal = Number(latest('lymphocyte'));
  if (neutrophilVal > 70 && lymphocyteVal < 20) {
    alerts.push({
      level: 'info',
      triggeredBy: ['neutrophil', 'lymphocyte'],
      message: 'Pola hematologi mengindikasikan kemungkinan respons inflamasi atau infeksi aktif.',
    });
  }

  // Rule 6 — Semua normal → NORMAL
  if (alerts.length === 0) {
    alerts.push({
      level: 'normal',
      triggeredBy: [],
      message: 'Semua parameter klinis dalam batas aman. Pertahankan rejimen terapi saat ini.',
    });
  }

  return alerts;
}
