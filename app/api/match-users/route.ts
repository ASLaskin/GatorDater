import { NextResponse } from 'next/server'
import { matchUsers } from '@/server/actions/matchUsers'

export async function POST() {
  try {
    const result = await matchUsers();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in match-users API route:', error)
    return NextResponse.json(
      { error: 'Failed to match users' },
      { status: 500 }
    )
  }
}