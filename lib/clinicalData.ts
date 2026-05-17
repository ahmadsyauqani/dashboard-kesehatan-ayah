// Clinical data from Google Sheets: Rekapitulasi Lengkap Hasil Laboratorium SYAFRIMAN
// Source: https://docs.google.com/spreadsheets/d/1ZrAY_T4VkeLV4sZq0A3OK5UaVqHnYMAp65wdvpSlzaU
// Dates: Nov'24, Des'24, Feb'25, Apr'25, Jul'25, Agt'25, Des'25, Feb'26, Mei'26

import { Parameter, StatusLevel } from '@/types/health';

function status(value: number | string, refMin: number | null, refMax: number | null): StatusLevel {
  if (typeof value === 'string') {
    if (value === 'Negatif' || value === '-') return 'normal';
    if (value === 'Trace' || value === '1+') return 'warning';
    return 'critical';
  }
  if (refMin !== null && refMax !== null) {
    if (value < refMin || value > refMax) return 'critical';
    const range = refMax - refMin;
    if (value < refMin + range * 0.1 || value > refMax - range * 0.1) return 'warning';
    return 'normal';
  }
  if (refMax !== null) {
    if (value > refMax) return 'critical';
    if (value > refMax * 0.85) return 'warning';
    return 'normal';
  }
  if (refMin !== null) {
    if (value < refMin) return 'critical';
    if (value < refMin * 1.15) return 'warning';
    return 'normal';
  }
  return 'normal';
}

const D = (date: string, value: number | string, refMin: number | null, refMax: number | null) => ({
  date, value, status: value === '-' ? 'normal' as StatusLevel : status(value, refMin, refMax),
});

export const clinicalParameters: Parameter[] = [
  // ═══════ RISIKO DIABETES ═══════
  {
    id: 'fasting_glucose', name: 'Glukosa Puasa', unit: 'mg/dL', refMin: 70, refMax: 99,
    values: [
      D('Nov 24', '-', 70, 99), D('Des 24', 135, 70, 99), D('Feb 25', 142, 70, 99),
      D('Apr 25', 156, 70, 99), D('Jul 25', 107, 70, 99), D('Agt 25', '-', 70, 99),
      D('Des 25', 129, 70, 99), D('Feb 26', 131, 70, 99), D('Mei 26', 146, 70, 99),
    ],
  },
  {
    id: 'hba1c', name: 'HbA1c (NGSP)', unit: '%', refMin: null, refMax: 5.7,
    values: [
      D('Nov 24', '-', null, 5.7), D('Des 24', 7.4, null, 5.7), D('Feb 25', 7.2, null, 5.7),
      D('Apr 25', 7.8, null, 5.7), D('Jul 25', 6.6, null, 5.7), D('Agt 25', 7.2, null, 5.7),
      D('Des 25', 7.8, null, 5.7), D('Feb 26', 7.1, null, 5.7), D('Mei 26', 7.3, null, 5.7),
    ],
  },
  // ═══════ FUNGSI GINJAL ═══════
  {
    id: 'ureum', name: 'Ureum', unit: 'mg/dL', refMin: 16.6, refMax: 48.5,
    values: [
      D('Nov 24', 35.9, 16.6, 48.5), D('Des 24', '-', 16.6, 48.5), D('Feb 25', 22.1, 16.6, 48.5),
      D('Apr 25', 38.5, 16.6, 48.5), D('Jul 25', 38.8, 16.6, 48.5), D('Agt 25', '-', 16.6, 48.5),
      D('Des 25', 45.8, 16.6, 48.5), D('Feb 26', 42.9, 16.6, 48.5), D('Mei 26', 34.4, 16.6, 48.5),
    ],
  },
  {
    id: 'creatinine', name: 'Kreatinin', unit: 'mg/dL', refMin: null, refMax: 1.20,
    values: [
      D('Nov 24', 1.2, null, 1.20), D('Des 24', '-', null, 1.20), D('Feb 25', 0.99, null, 1.20),
      D('Apr 25', 1.08, null, 1.20), D('Jul 25', 1.23, null, 1.20), D('Agt 25', '-', null, 1.20),
      D('Des 25', 1.30, null, 1.20), D('Feb 26', 1.09, null, 1.20), D('Mei 26', 0.91, null, 1.20),
    ],
  },
  {
    id: 'egfr', name: 'eLFG (CKD-EPI)', unit: 'mL/min', refMin: 90, refMax: null,
    values: [
      D('Nov 24', 63, 90, null), D('Des 24', 83, 90, null), D('Feb 25', 79, 90, null),
      D('Apr 25', 71.1, 90, null), D('Jul 25', 60.8, 90, null), D('Agt 25', '-', 90, null),
      D('Des 25', 56.5, 90, null), D('Feb 26', 69.9, 90, null), D('Mei 26', 86.9, 90, null),
    ],
  },
  // ═══════ PEMERIKSAAN URIN ═══════
  {
    id: 'urine_glucose', name: 'Glukosa Urin', unit: '', refMin: null, refMax: null,
    values: [
      D('Nov 24', '-', null, null), D('Des 24', '-', null, null), D('Feb 25', '3+', null, null),
      D('Apr 25', '3+', null, null), D('Jul 25', '3+', null, null), D('Agt 25', '3+', null, null),
      D('Des 25', '3+', null, null), D('Feb 26', '3+', null, null), D('Mei 26', '3+', null, null),
    ],
  },
  {
    id: 'urine_protein', name: 'Protein Urin', unit: '', refMin: null, refMax: null,
    values: [
      D('Nov 24', '-', null, null), D('Des 24', '-', null, null), D('Feb 25', 'Negatif', null, null),
      D('Apr 25', 'Negatif', null, null), D('Jul 25', '1+', null, null), D('Agt 25', 'Negatif', null, null),
      D('Des 25', 'Negatif', null, null), D('Feb 26', '1+', null, null), D('Mei 26', '1+', null, null),
    ],
  },
  // ═══════ HEMATOLOGI RUTIN ═══════
  {
    id: 'hemoglobin', name: 'Hemoglobin', unit: 'g/dL', refMin: 13.2, refMax: 17.3,
    values: [
      D('Nov 24', 15.4, 13.2, 17.3), D('Des 24', '-', 13.2, 17.3), D('Feb 25', '-', 13.2, 17.3),
      D('Apr 25', '-', 13.2, 17.3), D('Jul 25', '-', 13.2, 17.3), D('Agt 25', '-', 13.2, 17.3),
      D('Des 25', '-', 13.2, 17.3), D('Feb 26', 14, 13.2, 17.3), D('Mei 26', 14.5, 13.2, 17.3),
    ],
  },
  {
    id: 'leukocyte', name: 'Leukosit', unit: '10³/µL', refMin: 4.0, refMax: 11.0,
    values: [
      D('Nov 24', 7.1, 4.0, 11.0), D('Des 24', '-', 4.0, 11.0), D('Feb 25', '-', 4.0, 11.0),
      D('Apr 25', '-', 4.0, 11.0), D('Jul 25', '-', 4.0, 11.0), D('Agt 25', '-', 4.0, 11.0),
      D('Des 25', '-', 4.0, 11.0), D('Feb 26', 8.9, 4.0, 11.0), D('Mei 26', 7.2, 4.0, 11.0),
    ],
  },
  {
    id: 'erythrocyte', name: 'Eritrosit', unit: '10⁶/µL', refMin: 4.4, refMax: 5.9,
    values: [
      D('Nov 24', 4.9, 4.4, 5.9), D('Des 24', '-', 4.4, 5.9), D('Feb 25', '-', 4.4, 5.9),
      D('Apr 25', '-', 4.4, 5.9), D('Jul 25', '-', 4.4, 5.9), D('Agt 25', '-', 4.4, 5.9),
      D('Des 25', '-', 4.4, 5.9), D('Feb 26', 4.5, 4.4, 5.9), D('Mei 26', 4.7, 4.4, 5.9),
    ],
  },
  {
    id: 'hematocrit', name: 'Hematokrit', unit: '%', refMin: 40, refMax: 52,
    values: [
      D('Nov 24', 45, 40, 52), D('Des 24', '-', 40, 52), D('Feb 25', '-', 40, 52),
      D('Apr 25', '-', 40, 52), D('Jul 25', '-', 40, 52), D('Agt 25', '-', 40, 52),
      D('Des 25', '-', 40, 52), D('Feb 26', 41, 40, 52), D('Mei 26', 43, 40, 52),
    ],
  },
  {
    id: 'platelet', name: 'Trombosit', unit: '10³/µL', refMin: 150, refMax: 440,
    values: [
      D('Nov 24', 208, 150, 440), D('Des 24', '-', 150, 440), D('Feb 25', '-', 150, 440),
      D('Apr 25', '-', 150, 440), D('Jul 25', '-', 150, 440), D('Agt 25', '-', 150, 440),
      D('Des 25', '-', 150, 440), D('Feb 26', 207, 150, 440), D('Mei 26', 199, 150, 440),
    ],
  },
  {
    id: 'mcv', name: 'MCV', unit: 'fL', refMin: 80.0, refMax: 100.0,
    values: [
      D('Nov 24', 92.4, 80, 100), D('Des 24', '-', 80, 100), D('Feb 25', '-', 80, 100),
      D('Apr 25', '-', 80, 100), D('Jul 25', '-', 80, 100), D('Agt 25', '-', 80, 100),
      D('Des 25', '-', 80, 100), D('Feb 26', 91.1, 80, 100), D('Mei 26', 91.3, 80, 100),
    ],
  },
  {
    id: 'mch', name: 'MCH', unit: 'pg', refMin: 26.0, refMax: 34.0,
    values: [
      D('Nov 24', 31.6, 26, 34), D('Des 24', '-', 26, 34), D('Feb 25', '-', 26, 34),
      D('Apr 25', '-', 26, 34), D('Jul 25', '-', 26, 34), D('Agt 25', '-', 26, 34),
      D('Des 25', '-', 26, 34), D('Feb 26', 31, 26, 34), D('Mei 26', 30.9, 26, 34),
    ],
  },
  {
    id: 'mchc', name: 'MCHC', unit: 'g/dL', refMin: 32.0, refMax: 36.0,
    values: [
      D('Nov 24', 34.1, 32, 36), D('Des 24', '-', 32, 36), D('Feb 25', '-', 32, 36),
      D('Apr 25', '-', 32, 36), D('Jul 25', '-', 32, 36), D('Agt 25', '-', 32, 36),
      D('Des 25', '-', 32, 36), D('Feb 26', 34.1, 32, 36), D('Mei 26', 33.9, 32, 36),
    ],
  },
  // ═══════ HITUNG JENIS ═══════
  {
    id: 'neutrophil', name: 'Neutrofil', unit: '%', refMin: 34.0, refMax: 67.9,
    values: [
      D('Nov 24', 67.2, 34, 67.9), D('Des 24', '-', 34, 67.9), D('Feb 25', '-', 34, 67.9),
      D('Apr 25', '-', 34, 67.9), D('Jul 25', '-', 34, 67.9), D('Agt 25', '-', 34, 67.9),
      D('Des 25', '-', 34, 67.9), D('Feb 26', 77.1, 34, 67.9), D('Mei 26', 71.9, 34, 67.9),
    ],
  },
  {
    id: 'lymphocyte', name: 'Limfosit', unit: '%', refMin: 21.8, refMax: 53.1,
    values: [
      D('Nov 24', 17.5, 21.8, 53.1), D('Des 24', '-', 21.8, 53.1), D('Feb 25', '-', 21.8, 53.1),
      D('Apr 25', '-', 21.8, 53.1), D('Jul 25', '-', 21.8, 53.1), D('Agt 25', '-', 21.8, 53.1),
      D('Des 25', '-', 21.8, 53.1), D('Feb 26', 11.9, 21.8, 53.1), D('Mei 26', 16.1, 21.8, 53.1),
    ],
  },
  {
    id: 'monocyte', name: 'Monosit', unit: '%', refMin: 5.3, refMax: 12.2,
    values: [
      D('Nov 24', 9.1, 5.3, 12.2), D('Des 24', '-', 5.3, 12.2), D('Feb 25', '-', 5.3, 12.2),
      D('Apr 25', '-', 5.3, 12.2), D('Jul 25', '-', 5.3, 12.2), D('Agt 25', '-', 5.3, 12.2),
      D('Des 25', '-', 5.3, 12.2), D('Feb 26', 6.3, 5.3, 12.2), D('Mei 26', 6.9, 5.3, 12.2),
    ],
  },
  {
    id: 'eosinophil', name: 'Eosinofil', unit: '%', refMin: 0.8, refMax: 7.0,
    values: [
      D('Nov 24', 5.9, 0.8, 7.0), D('Des 24', '-', 0.8, 7.0), D('Feb 25', '-', 0.8, 7.0),
      D('Apr 25', '-', 0.8, 7.0), D('Jul 25', '-', 0.8, 7.0), D('Agt 25', '-', 0.8, 7.0),
      D('Des 25', '-', 0.8, 7.0), D('Feb 26', 4.5, 0.8, 7.0), D('Mei 26', 5, 0.8, 7.0),
    ],
  },
  {
    id: 'basophil', name: 'Basofil', unit: '%', refMin: 0.2, refMax: 1.2,
    values: [
      D('Nov 24', 0.3, 0.2, 1.2), D('Des 24', '-', 0.2, 1.2), D('Feb 25', '-', 0.2, 1.2),
      D('Apr 25', '-', 0.2, 1.2), D('Jul 25', '-', 0.2, 1.2), D('Agt 25', '-', 0.2, 1.2),
      D('Des 25', '-', 0.2, 1.2), D('Feb 26', 0.2, 0.2, 1.2), D('Mei 26', 0.1, 0.2, 1.2),
    ],
  },
  // ═══════ ELEKTROLIT ═══════
  {
    id: 'natrium', name: 'Natrium (Na)', unit: 'mEq/L', refMin: 136, refMax: 145,
    values: [
      D('Nov 24', 139, 136, 145), D('Des 24', '-', 136, 145), D('Feb 25', 138, 136, 145),
      D('Apr 25', 137, 136, 145), D('Jul 25', 133, 136, 145), D('Agt 25', '-', 136, 145),
      D('Des 25', 133, 136, 145), D('Feb 26', 130, 136, 145), D('Mei 26', 134, 136, 145),
    ],
  },
  {
    id: 'kalium', name: 'Kalium (K)', unit: 'mEq/L', refMin: 3.5, refMax: 5.1,
    values: [
      D('Nov 24', 4.4, 3.5, 5.1), D('Des 24', '-', 3.5, 5.1), D('Feb 25', 4.4, 3.5, 5.1),
      D('Apr 25', 4.3, 3.5, 5.1), D('Jul 25', 5.7, 3.5, 5.1), D('Agt 25', '-', 3.5, 5.1),
      D('Des 25', 4.9, 3.5, 5.1), D('Feb 26', 4.9, 3.5, 5.1), D('Mei 26', 4.2, 3.5, 5.1),
    ],
  },
  {
    id: 'klorida', name: 'Klorida (Cl)', unit: 'mEq/L', refMin: 98, refMax: 107,
    values: [
      D('Nov 24', 101, 98, 107), D('Des 24', '-', 98, 107), D('Feb 25', 102, 98, 107),
      D('Apr 25', 100, 98, 107), D('Jul 25', 98, 98, 107), D('Agt 25', '-', 98, 107),
      D('Des 25', 98, 98, 107), D('Feb 26', 97, 98, 107), D('Mei 26', 100, 98, 107),
    ],
  },
  // ═══════ FUNGSI HATI ═══════
  {
    id: 'sgot', name: 'SGOT (AST)', unit: 'U/L', refMin: null, refMax: 50,
    values: [
      D('Nov 24', 17, null, 50), D('Des 24', '-', null, 50), D('Feb 25', '-', null, 50),
      D('Apr 25', '-', null, 50), D('Jul 25', '-', null, 50), D('Agt 25', '-', null, 50),
      D('Des 25', '-', null, 50), D('Feb 26', '-', null, 50), D('Mei 26', 15, null, 50),
    ],
  },
  {
    id: 'sgpt', name: 'SGPT (ALT)', unit: 'U/L', refMin: null, refMax: 50,
    values: [
      D('Nov 24', 20, null, 50), D('Des 24', '-', null, 50), D('Feb 25', '-', null, 50),
      D('Apr 25', '-', null, 50), D('Jul 25', '-', null, 50), D('Agt 25', '-', null, 50),
      D('Des 25', '-', null, 50), D('Feb 26', '-', null, 50), D('Mei 26', 20, null, 50),
    ],
  },
  // ═══════ ASAM URAT ═══════
  {
    id: 'uric_acid', name: 'Asam Urat', unit: 'mg/dL', refMin: 3.4, refMax: 7.0,
    values: [
      D('Nov 24', 8.4, 3.4, 7.0), D('Des 24', '-', 3.4, 7.0), D('Feb 25', 6.7, 3.4, 7.0),
      D('Apr 25', 7.5, 3.4, 7.0), D('Jul 25', 8.5, 3.4, 7.0), D('Agt 25', 4.2, 3.4, 7.0),
      D('Des 25', 4.4, 3.4, 7.0), D('Feb 26', 4.2, 3.4, 7.0), D('Mei 26', 5.9, 3.4, 7.0),
    ],
  },
  // ═══════ PROFIL LIPID ═══════
  {
    id: 'cholesterol_total', name: 'Kolesterol Total', unit: 'mg/dL', refMin: null, refMax: 200,
    values: [
      D('Nov 24', '-', null, 200), D('Des 24', 143, null, 200), D('Feb 25', 128, null, 200),
      D('Apr 25', 154, null, 200), D('Jul 25', 108, null, 200), D('Agt 25', 100, null, 200),
      D('Des 25', 100, null, 200), D('Feb 26', 108, null, 200), D('Mei 26', 123, null, 200),
    ],
  },
  {
    id: 'ldl', name: 'Kolesterol LDL', unit: 'mg/dL', refMin: null, refMax: 100,
    values: [
      D('Nov 24', '-', null, 100), D('Des 24', 89, null, 100), D('Feb 25', 77, null, 100),
      D('Apr 25', 105, null, 100), D('Jul 25', 63, null, 100), D('Agt 25', 52, null, 100),
      D('Des 25', 51, null, 100), D('Feb 26', 58, null, 100), D('Mei 26', 63, null, 100),
    ],
  },
  {
    id: 'hdl', name: 'Kolesterol HDL', unit: 'mg/dL', refMin: 40, refMax: null,
    values: [
      D('Nov 24', '-', 40, null), D('Des 24', 40, 40, null), D('Feb 25', 39, 40, null),
      D('Apr 25', 43, 40, null), D('Jul 25', 38, 40, null), D('Agt 25', 31, 40, null),
      D('Des 25', 35, 40, null), D('Feb 26', 36, 40, null), D('Mei 26', 39, 40, null),
    ],
  },
  {
    id: 'triglyceride', name: 'Trigliserida', unit: 'mg/dL', refMin: null, refMax: 150,
    values: [
      D('Nov 24', '-', null, 150), D('Des 24', 114, null, 150), D('Feb 25', 120, null, 150),
      D('Apr 25', 142, null, 150), D('Jul 25', 121, null, 150), D('Agt 25', 126, null, 150),
      D('Des 25', 135, null, 150), D('Feb 26', 101, null, 150), D('Mei 26', 104, null, 150),
    ],
  },
];

export function getLatestValue(paramId: string): number | string | null {
  const param = clinicalParameters.find(p => p.id === paramId);
  if (!param) return null;
  const validValues = param.values.filter(v => v.value !== '-');
  return validValues.length > 0 ? validValues[validValues.length - 1].value : null;
}

export function getPreviousValue(paramId: string): number | string | null {
  const param = clinicalParameters.find(p => p.id === paramId);
  if (!param) return null;
  const validValues = param.values.filter(v => v.value !== '-');
  return validValues.length > 1 ? validValues[validValues.length - 2].value : null;
}
