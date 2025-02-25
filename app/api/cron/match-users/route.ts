import { NextResponse } from 'next/server';
import { matchUsers } from '@/server/actions/matchUsers';

// This function will be called by Vercel's cron system
export async function GET() {
  try {
    const result = await matchUsers();
    
    console.log('Cron job completed successfully:', result);
    
    return NextResponse.json({ 
      success: true,
      result
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to match users in cron job' },
      { status: 500 }
    );
  }
}

// Define the cron schedule - this runs at 2pm EST (7pm UTC) every day
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300; // 5 minutes maximum execution time

// This is the Vercel Cron syntax - 7pm UTC = 2pm EST
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // US East (N. Virginia)
  cron: '0 19 * * *' // Run at 7pm UTC (2pm EST) every day
};