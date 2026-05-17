import { clinicalParameters } from '@/lib/clinicalData';
import { buildHealthData } from '@/lib/parser';
import DashboardClient from './DashboardClient';

// ISR: revalidate every hour
export const revalidate = 3600;

export default function Home() {
  // Build health data on the server
  const healthData = buildHealthData(clinicalParameters);

  return <DashboardClient data={healthData} />;
}
