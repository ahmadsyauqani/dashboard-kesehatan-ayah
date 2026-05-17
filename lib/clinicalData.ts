// Clinical data extracted from PRD v2.0 — Section 2.1
// Data from RS Jantung Heartology: Nov 2024 – May 2026
// Ready to be replaced with Google Sheets API fetch

import { Parameter, StatusLevel } from '@/types/health';

function status(value: number | string, refMin: number | null, refMax: number | null): StatusLevel {
  if (typeof value === 'string') {
    if (value === 'Negatif' || value === '-') return 'normal';
    if (value === 'Trace' || value === '1+') return 'warning';
    return 'critical'; // 2+, 3+
  }
  if (refMin !== null && refMax !== null) {
    if (value < refMin || value > refMax) return 'critical';
    // borderline: within 10% of limits
    const range = refMax - refMin;
    if (value < refMin + range * 0.1 || value > refMax - range * 0.1) return 'warning';
    return 'normal';
  }
  if (refMax !== null) {
    if (value > refMax) return 'critical';
    if (value > refMax * 0.9) return 'warning';
    return 'normal';
  }
  if (refMin !== null) {
    if (value < refMin) return 'critical';
    if (value < refMin * 1.1) return 'warning';
    return 'normal';
  }
  return 'normal';
}

export const DATES = ['Des 24', 'Feb 25', 'Jul 25', 'Agt 25', 'Des 25', 'Feb 26', 'Mei 26'];

export const clinicalParameters: Parameter[] = [
  {
    id: 'fasting_glucose',
    name: 'Glukosa Puasa',
    unit: 'mg/dL',
    refMin: 70,
    refMax: 99,
    values: [
      { date: 'Des 24', value: 135, status: 'critical' },
      { date: 'Feb 25', value: 142, status: 'critical' },
      { date: 'Jul 25', value: 107, status: 'critical' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 129, status: 'critical' },
      { date: 'Feb 26', value: 131, status: 'critical' },
      { date: 'Mei 26', value: 146, status: 'critical' },
    ],
  },
  {
    id: 'hba1c',
    name: 'HbA1c (NGSP)',
    unit: '%',
    refMin: null,
    refMax: 5.7,
    values: [
      { date: 'Des 24', value: 7.4, status: 'critical' },
      { date: 'Feb 25', value: 7.2, status: 'critical' },
      { date: 'Jul 25', value: 6.6, status: 'critical' },
      { date: 'Agt 25', value: 7.2, status: 'critical' },
      { date: 'Des 25', value: 7.8, status: 'critical' },
      { date: 'Feb 26', value: 7.1, status: 'critical' },
      { date: 'Mei 26', value: 7.3, status: 'critical' },
    ],
  },
  {
    id: 'ureum',
    name: 'Ureum',
    unit: 'mg/dL',
    refMin: 16.6,
    refMax: 48.5,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 22.1, status: 'normal' },
      { date: 'Jul 25', value: 38.8, status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 45.8, status: 'warning' },
      { date: 'Feb 26', value: 42.9, status: 'warning' },
      { date: 'Mei 26', value: 34.4, status: 'normal' },
    ],
  },
  {
    id: 'creatinine',
    name: 'Kreatinin',
    unit: 'mg/dL',
    refMin: null,
    refMax: 1.20,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 0.99, status: 'normal' },
      { date: 'Jul 25', value: 1.23, status: 'critical' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 1.30, status: 'critical' },
      { date: 'Feb 26', value: 1.09, status: 'warning' },
      { date: 'Mei 26', value: 0.91, status: 'normal' },
    ],
  },
  {
    id: 'egfr',
    name: 'eLFG (CKD-EPI)',
    unit: 'mL/min',
    refMin: 90,
    refMax: null,
    values: [
      { date: 'Des 24', value: 83, status: 'warning' },
      { date: 'Feb 25', value: 79.0, status: 'warning' },
      { date: 'Jul 25', value: 60.8, status: 'critical' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 56.5, status: 'critical' },
      { date: 'Feb 26', value: 69.9, status: 'warning' },
      { date: 'Mei 26', value: 86.9, status: 'warning' },
    ],
  },
  {
    id: 'urine_glucose',
    name: 'Glukosa Urin',
    unit: '',
    refMin: null,
    refMax: null,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '3+', status: 'critical' },
      { date: 'Agt 25', value: '3+', status: 'critical' },
      { date: 'Des 25', value: '3+', status: 'critical' },
      { date: 'Feb 26', value: '3+', status: 'critical' },
      { date: 'Mei 26', value: '3+', status: 'critical' },
    ],
  },
  {
    id: 'urine_protein',
    name: 'Protein Urin',
    unit: '',
    refMin: null,
    refMax: null,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: 'Negatif', status: 'normal' },
      { date: 'Agt 25', value: '1+', status: 'critical' },
      { date: 'Des 25', value: 'Negatif', status: 'normal' },
      { date: 'Feb 26', value: 'Negatif', status: 'normal' },
      { date: 'Mei 26', value: '1+', status: 'critical' },
    ],
  },
  {
    id: 'neutrophil',
    name: 'Neutrofil',
    unit: '%',
    refMin: 34.0,
    refMax: 67.9,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 77.1, status: 'critical' },
      { date: 'Mei 26', value: 71.9, status: 'critical' },
    ],
  },
  {
    id: 'lymphocyte',
    name: 'Limfosit',
    unit: '%',
    refMin: 21.8,
    refMax: 53.1,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 11.9, status: 'critical' },
      { date: 'Mei 26', value: 16.1, status: 'critical' },
    ],
  },
  // ═══════ HEMATOLOGI RUTIN ═══════
  {
    id: 'hemoglobin',
    name: 'Hemoglobin',
    unit: 'g/dL',
    refMin: 13.0,
    refMax: 17.0,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 13.2, status: 'normal' },
      { date: 'Mei 26', value: 12.8, status: 'warning' },
    ],
  },
  {
    id: 'leukocyte',
    name: 'Leukosit',
    unit: '/µL',
    refMin: 4000,
    refMax: 10000,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 8200, status: 'normal' },
      { date: 'Mei 26', value: 7600, status: 'normal' },
    ],
  },
  {
    id: 'erythrocyte',
    name: 'Eritrosit',
    unit: 'juta/µL',
    refMin: 4.5,
    refMax: 5.5,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 4.52, status: 'normal' },
      { date: 'Mei 26', value: 4.38, status: 'warning' },
    ],
  },
  {
    id: 'hematocrit',
    name: 'Hematokrit',
    unit: '%',
    refMin: 40,
    refMax: 54,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 39.8, status: 'warning' },
      { date: 'Mei 26', value: 38.5, status: 'critical' },
    ],
  },
  {
    id: 'platelet',
    name: 'Trombosit',
    unit: 'ribu/µL',
    refMin: 150,
    refMax: 450,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 245, status: 'normal' },
      { date: 'Mei 26', value: 238, status: 'normal' },
    ],
  },
  {
    id: 'mcv',
    name: 'MCV',
    unit: 'fL',
    refMin: 80,
    refMax: 96,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 88.1, status: 'normal' },
      { date: 'Mei 26', value: 87.9, status: 'normal' },
    ],
  },
  {
    id: 'mch',
    name: 'MCH',
    unit: 'pg',
    refMin: 27,
    refMax: 32,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 29.2, status: 'normal' },
      { date: 'Mei 26', value: 29.2, status: 'normal' },
    ],
  },
  {
    id: 'mchc',
    name: 'MCHC',
    unit: 'g/dL',
    refMin: 33,
    refMax: 36,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 33.2, status: 'normal' },
      { date: 'Mei 26', value: 33.2, status: 'normal' },
    ],
  },
  // ═══════ HITUNG JENIS (selain Neutrofil & Limfosit) ═══════
  {
    id: 'monocyte',
    name: 'Monosit',
    unit: '%',
    refMin: 4.0,
    refMax: 8.0,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 7.8, status: 'normal' },
      { date: 'Mei 26', value: 8.2, status: 'warning' },
    ],
  },
  {
    id: 'eosinophil',
    name: 'Eosinofil',
    unit: '%',
    refMin: 1.0,
    refMax: 4.0,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 2.4, status: 'normal' },
      { date: 'Mei 26', value: 2.9, status: 'normal' },
    ],
  },
  {
    id: 'basophil',
    name: 'Basofil',
    unit: '%',
    refMin: 0,
    refMax: 1.0,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: '-', status: 'normal' },
      { date: 'Jul 25', value: '-', status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: '-', status: 'normal' },
      { date: 'Feb 26', value: 0.8, status: 'normal' },
      { date: 'Mei 26', value: 0.9, status: 'normal' },
    ],
  },
  // ═══════ ELEKTROLIT ═══════
  {
    id: 'natrium',
    name: 'Natrium (Na)',
    unit: 'mEq/L',
    refMin: 136,
    refMax: 145,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 140, status: 'normal' },
      { date: 'Jul 25', value: 138, status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 141, status: 'normal' },
      { date: 'Feb 26', value: 139, status: 'normal' },
      { date: 'Mei 26', value: 140, status: 'normal' },
    ],
  },
  {
    id: 'kalium',
    name: 'Kalium (K)',
    unit: 'mEq/L',
    refMin: 3.5,
    refMax: 5.1,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 4.2, status: 'normal' },
      { date: 'Jul 25', value: 4.8, status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 5.0, status: 'warning' },
      { date: 'Feb 26', value: 4.5, status: 'normal' },
      { date: 'Mei 26', value: 4.3, status: 'normal' },
    ],
  },
  {
    id: 'klorida',
    name: 'Klorida (Cl)',
    unit: 'mEq/L',
    refMin: 98,
    refMax: 107,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 102, status: 'normal' },
      { date: 'Jul 25', value: 100, status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 104, status: 'normal' },
      { date: 'Feb 26', value: 101, status: 'normal' },
      { date: 'Mei 26', value: 103, status: 'normal' },
    ],
  },
  // ═══════ FUNGSI HATI ═══════
  {
    id: 'sgot',
    name: 'SGOT (AST)',
    unit: 'U/L',
    refMin: null,
    refMax: 40,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 28, status: 'normal' },
      { date: 'Jul 25', value: 32, status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 35, status: 'warning' },
      { date: 'Feb 26', value: 30, status: 'normal' },
      { date: 'Mei 26', value: 27, status: 'normal' },
    ],
  },
  {
    id: 'sgpt',
    name: 'SGPT (ALT)',
    unit: 'U/L',
    refMin: null,
    refMax: 41,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 33, status: 'normal' },
      { date: 'Jul 25', value: 38, status: 'warning' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 42, status: 'critical' },
      { date: 'Feb 26', value: 36, status: 'warning' },
      { date: 'Mei 26', value: 31, status: 'normal' },
    ],
  },
  // ═══════ ASAM URAT ═══════
  {
    id: 'uric_acid',
    name: 'Asam Urat',
    unit: 'mg/dL',
    refMin: null,
    refMax: 7.0,
    values: [
      { date: 'Des 24', value: '-', status: 'normal' },
      { date: 'Feb 25', value: 6.8, status: 'warning' },
      { date: 'Jul 25', value: 7.5, status: 'critical' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 7.2, status: 'critical' },
      { date: 'Feb 26', value: 6.5, status: 'warning' },
      { date: 'Mei 26', value: 6.1, status: 'normal' },
    ],
  },
  // ═══════ PROFIL LIPID (Kolesterol) ═══════
  {
    id: 'cholesterol_total',
    name: 'Kolesterol Total',
    unit: 'mg/dL',
    refMin: null,
    refMax: 200,
    values: [
      { date: 'Des 24', value: 218, status: 'critical' },
      { date: 'Feb 25', value: 205, status: 'critical' },
      { date: 'Jul 25', value: 195, status: 'warning' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 210, status: 'critical' },
      { date: 'Feb 26', value: 198, status: 'warning' },
      { date: 'Mei 26', value: 192, status: 'warning' },
    ],
  },
  {
    id: 'ldl',
    name: 'Kolesterol LDL',
    unit: 'mg/dL',
    refMin: null,
    refMax: 100,
    values: [
      { date: 'Des 24', value: 142, status: 'critical' },
      { date: 'Feb 25', value: 130, status: 'critical' },
      { date: 'Jul 25', value: 118, status: 'critical' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 135, status: 'critical' },
      { date: 'Feb 26', value: 122, status: 'critical' },
      { date: 'Mei 26', value: 115, status: 'critical' },
    ],
  },
  {
    id: 'hdl',
    name: 'Kolesterol HDL',
    unit: 'mg/dL',
    refMin: 40,
    refMax: null,
    values: [
      { date: 'Des 24', value: 38, status: 'critical' },
      { date: 'Feb 25', value: 40, status: 'warning' },
      { date: 'Jul 25', value: 42, status: 'normal' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 39, status: 'critical' },
      { date: 'Feb 26', value: 41, status: 'normal' },
      { date: 'Mei 26', value: 43, status: 'normal' },
    ],
  },
  {
    id: 'triglyceride',
    name: 'Trigliserida',
    unit: 'mg/dL',
    refMin: null,
    refMax: 150,
    values: [
      { date: 'Des 24', value: 195, status: 'critical' },
      { date: 'Feb 25', value: 180, status: 'critical' },
      { date: 'Jul 25', value: 165, status: 'critical' },
      { date: 'Agt 25', value: '-', status: 'normal' },
      { date: 'Des 25', value: 178, status: 'critical' },
      { date: 'Feb 26', value: 162, status: 'critical' },
      { date: 'Mei 26', value: 155, status: 'critical' },
    ],
  },
];

// Helper to get the latest numeric value for a parameter
export function getLatestValue(paramId: string): number | string | null {
  const param = clinicalParameters.find(p => p.id === paramId);
  if (!param) return null;
  const validValues = param.values.filter(v => v.value !== '-');
  return validValues.length > 0 ? validValues[validValues.length - 1].value : null;
}

// Helper to get the previous numeric value for a parameter
export function getPreviousValue(paramId: string): number | string | null {
  const param = clinicalParameters.find(p => p.id === paramId);
  if (!param) return null;
  const validValues = param.values.filter(v => v.value !== '-');
  return validValues.length > 1 ? validValues[validValues.length - 2].value : null;
}
