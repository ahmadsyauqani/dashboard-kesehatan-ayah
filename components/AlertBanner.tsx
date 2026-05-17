'use client';

import { Alert } from '@/types/health';
import { IconAlertTriangle, IconAlertCircle, IconInfoCircle, IconCircleCheck } from '@tabler/icons-react';

interface AlertBannerProps {
  alerts: Alert[];
}

const alertConfig = {
  critical: {
    icon: IconAlertTriangle,
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-500',
    textColor: 'text-red-800 dark:text-red-200',
    label: 'KRITIS',
    labelBg: 'bg-red-500',
  },
  warning: {
    icon: IconAlertCircle,
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-500',
    textColor: 'text-amber-800 dark:text-amber-200',
    label: 'WASPADA',
    labelBg: 'bg-amber-500',
  },
  info: {
    icon: IconInfoCircle,
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800 dark:text-blue-200',
    label: 'INFO',
    labelBg: 'bg-blue-500',
  },
  normal: {
    icon: IconCircleCheck,
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-500',
    textColor: 'text-emerald-800 dark:text-emerald-200',
    label: 'NORMAL',
    labelBg: 'bg-emerald-500',
  },
};

export default function AlertBanner({ alerts }: AlertBannerProps) {
  if (!alerts || alerts.length === 0) return null;

  // Only show non-normal alerts at the top
  const activeAlerts = alerts.filter(a => a.level !== 'normal');
  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-2 animate-slide-down">
      {activeAlerts.map((alert, index) => {
        const config = alertConfig[alert.level];
        const Icon = config.icon;
        
        return (
          <div
            key={index}
            className={`${config.bg} ${config.border} border rounded-2xl p-3.5 md:p-4 flex items-start gap-3 transition-all`}
            role="alert"
            aria-live="assertive"
          >
            <div className={`${config.iconColor} mt-0.5 flex-shrink-0`}>
              <Icon size={20} stroke={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`${config.labelBg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider`}>
                  {config.label}
                </span>
              </div>
              <p className={`${config.textColor} text-sm leading-relaxed`}>
                {alert.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
