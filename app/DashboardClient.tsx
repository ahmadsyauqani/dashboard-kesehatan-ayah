'use client';

import { HealthDataResponse } from '@/types/health';
import Header from '@/components/Header';
import HealthOverview from '@/components/HealthOverview';
import HighlightCards from '@/components/HighlightCards';
import TrendChart from '@/components/TrendChart';
import DoctorNotes from '@/components/DoctorNotes';
import DetailedHistory from '@/components/DetailedHistory';
import HealthTips from '@/components/HealthTips';
import FooterNote from '@/components/FooterNote';

interface DashboardClientProps {
  data: HealthDataResponse;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header lastCheckDate={data.lastCheckDate} />
      
      <main className="max-w-xl mx-auto px-4 py-5 md:py-6 space-y-4">
        {/* 1. Warm overview */}
        <HealthOverview data={data} />
        
        {/* 2. Key numbers with progress rings */}
        <HighlightCards highlights={data.highlights} />
        
        {/* 3. Trend charts with explanations */}
        <TrendChart parameters={data.parameters} />
        
        {/* 4. Full history — expandable */}
        <DetailedHistory parameters={data.parameters} />
        
        {/* 5. Saran & Rekomendasi Kesehatan */}
        <HealthTips parameters={data.parameters} />
        
        {/* 6. Doctor notes */}
        <DoctorNotes alerts={data.alerts} />
        
        {/* 7. Footer */}
        <FooterNote />
      </main>
    </div>
  );
}
