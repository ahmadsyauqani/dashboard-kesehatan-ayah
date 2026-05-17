// TypeScript interfaces for the Health Monitoring Dashboard
// Based on PRD v2.0 — Section 6.4

export type StatusLevel = 'normal' | 'warning' | 'critical';
export type AlertLevel = 'critical' | 'warning' | 'info' | 'normal';

export interface ParameterValue {
  date: string;
  value: number | string;
  status: StatusLevel;
}

export interface Parameter {
  id: string;
  name: string;
  unit: string;
  refMin: number | null;
  refMax: number | null;
  values: ParameterValue[];
}

export interface Alert {
  level: AlertLevel;
  message: string;
  triggeredBy: string[];
}

export interface HighlightValue {
  value: number | string;
  unit: string;
  status: StatusLevel;
}

export interface HighlightWithDelta extends HighlightValue {
  delta: number;
  deltaLabel: string;
}

export interface Highlights {
  hba1c: HighlightValue;
  glucose: HighlightValue;
  egfr: HighlightWithDelta;
}

export interface HealthDataResponse {
  lastCheckDate: string;
  parameters: Parameter[];
  alerts: Alert[];
  highlights: Highlights;
}
