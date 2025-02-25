import { NextResponse } from 'next/server'
import { db } from '@/server'
import { users, matcher } from '@/server/schema'
import { eq, or, and } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get all matches where the user is either user1 or user2
    const matches = await db
      .select({
        matchId: matcher.id,
        status: matcher.status,
        matchedUser: users,
      })
      .from(matcher)
      .where(
        and(
          or(
            eq(matcher.user1, userId),
            eq(matcher.user2, userId)
          ),
          // Optionally filter by status if you don't want to show 'passed' or 'unmatched'
          or(
            eq(matcher.status, 'pending'),
            eq(matcher.status, 'liked')
          )
        )
      )
      .leftJoin(
        users,
        or(
          and(
            eq(matcher.user1, userId),
            eq(users.id, matcher.user2)
          ),
          and(
            eq(matcher.user2, userId),
            eq(users.id, matcher.user1)
          )
        )
      )

    // Transform the data to a cleaner format
    const transformedMatches = matches.map(match => ({
      matchId: match.matchId,
      status: match.status,
      matchedUser: match.matchedUser ? {
        id: match.matchedUser.id,
        name: match.matchedUser.name,
        image: match.matchedUser.image,
        bio: match.matchedUser.bio,
        gender: match.matchedUser.gender,
      } : null
    }))

    return NextResponse.json({
      success: true,
      matches: transformedMatches
    })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}