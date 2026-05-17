// API Route: GET /api/health-data
// Returns the full HealthDataResponse JSON
// Currently uses static data; ready for Google Sheets API integration

import { NextResponse } from 'next/server';
import { clinicalParameters } from '@/lib/clinicalData';
import { buildHealthData } from '@/lib/parser';

// ISR revalidation every 3600 seconds (1 hour)
export const revalidate = 3600;

export async function GET() {
  try {
    // TODO: Replace with Google Sheets API fetch
    // const rawData = await fetchGoogleSheets();
    // const parameters = parseSheetData(rawData);
    
    const healthData = buildHealthData(clinicalParameters);
    
    return NextResponse.json(healthData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to build health data:', error);
    return NextResponse.json(
      { error: 'Failed to process health data' },
      { status: 500 }
    );
  }
}
