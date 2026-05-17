// Data parsing and transformation utilities
// Handles qualitative urine data → numeric conversion (PRD Section 6.3)

import { Parameter, Highlights, HealthDataResponse, StatusLevel } from '@/types/health';
import { runAlertEngine } from './alertEngine';

// Convert qualitative urine values to numeric (PRD Section 6.3)
export const URINE_SCALE: Record<string, number> = {
  'Negatif': 0,
  'Trace': 0.5,
  '1+': 1,
  '2+': 2,
  '3+': 3,
};

export function urineToNumeric(val: string): number {
  return URINE_SCALE[val] ?? 0;
}

export function urineToStatus(val: string): StatusLevel {
  if (val === 'Negatif') return 'normal';
  if (val === 'Trace' || val === '1+') return 'warning';
  return 'critical'; // 2+, 3+
}

// Get the latest valid (non-'-') value for a parameter
function getLatest(param: Parameter): { value: number | string; status: StatusLevel } | null {
  const valid = param.values.filter(v => v.value !== '-');
  return valid.length > 0 ? valid[valid.length - 1] : null;
}

// Get the previous valid value
function getPrevious(param: Parameter): { value: number | string; status: StatusLevel } | null {
  const valid = param.values.filter(v => v.value !== '-');
  return valid.length > 1 ? valid[valid.length - 2] : null;
}

// Determine status for a numeric value against reference ranges
export function determineStatus(value: number, refMin: number | null, refMax: number | null): StatusLevel {
  if (refMin !== null && value < refMin) return 'critical';
  if (refMax !== null && value > refMax) return 'critical';
  
  // Borderline checks
  if (refMin !== null && refMax !== null) {
    const range = refMax - refMin;
    if (value < refMin + range * 0.1 || value > refMax - range * 0.1) return 'warning';
  }
  if (refMin !== null && value < refMin * 1.1) return 'warning';
  if (refMax !== null && value > refMax * 0.9) return 'warning';
  
  return 'normal';
}

// Build the full HealthDataResponse from parameters
export function buildHealthData(parameters: Parameter[]): HealthDataResponse {
  const hba1cParam = parameters.find(p => p.id === 'hba1c');
  const glucoseParam = parameters.find(p => p.id === 'fasting_glucose');
  const egfrParam = parameters.find(p => p.id === 'egfr');

  const hba1cLatest = hba1cParam ? getLatest(hba1cParam) : null;
  const glucoseLatest = glucoseParam ? getLatest(glucoseParam) : null;
  const egfrLatest = egfrParam ? getLatest(egfrParam) : null;
  const egfrPrev = egfrParam ? getPrevious(egfrParam) : null;

  const egfrDelta = (egfrLatest && egfrPrev && typeof egfrLatest.value === 'number' && typeof egfrPrev.value === 'number')
    ? Number((egfrLatest.value - egfrPrev.value).toFixed(1))
    : 0;

  const highlights: Highlights = {
    hba1c: {
      value: hba1cLatest?.value ?? '-',
      unit: '%',
      status: hba1cLatest?.status ?? 'normal',
    },
    glucose: {
      value: glucoseLatest?.value ?? '-',
      unit: 'mg/dL',
      status: glucoseLatest?.status ?? 'normal',
    },
    egfr: {
      value: egfrLatest?.value ?? '-',
      unit: 'mL/min',
      status: egfrLatest?.status ?? 'normal',
      delta: egfrDelta,
      deltaLabel: egfrDelta >= 0 ? `+${egfrDelta}` : `${egfrDelta}`,
    },
  };

  const alerts = runAlertEngine(parameters);

  // Find the latest date
  const allDates = parameters.flatMap(p => p.values.map(v => v.date));
  const lastCheckDate = allDates[allDates.length - 1] || 'Mei 26';

  return {
    lastCheckDate,
    parameters,
    alerts,
    highlights,
  };
}
