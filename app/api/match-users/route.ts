import { NextResponse, NextRequest } from 'next/server';
import { matchUsers } from '@/server/actions/matchUsers';

export async function POST(req: NextRequest) {
  // Verify the request is coming from an authorized source
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Check if the cron secret exists
  if (!cronSecret) {
    console.error('CRON_SECRET environment variable is not set');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Check if the request has the correct authorization
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    console.error('Unauthorized attempt to access cron job API route');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const result = await matchUsers();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in match-users API route:', error);
    return NextResponse.json(
      { error: 'Failed to match users' },
      { status: 500 }
    );
  }
}