import { NextResponse } from 'next/server'
import { db } from '@/server'
import { users, preferences, matcher, matchHistory } from '@/server/schema'
import { eq, and, or } from 'drizzle-orm'

type UserWithPreferences = {
  id: string
  gender: string | null
  preferences: {
    genderPreferences: string | null
  } | null
}

export async function POST() {
  try {
    // Fetch all users with their preferences
    const result = await db
      .select({
        id: users.id,
        gender: users.gender,
        preferences: preferences
      })
      .from(users)
      .leftJoin(preferences, eq(users.id, preferences.userId))

    const allUsers: UserWithPreferences[] = result
      .filter(user => user.id && user.gender) // Ensure we have valid users
      .map(user => ({
        id: user.id,
        gender: user.gender,
        preferences: user.preferences
      }))

    const matches = []
    const matched = new Set<string>()

    // Fetch match history to prevent rematching
    const matchHistoryData = await db
    .select({
      userId: matchHistory.userId, 
      matchedUserIds: matchHistory.matchedUserIds
    })
    .from(matchHistory);
    const previousMatches = new Map<string, Set<string>>()

    matchHistoryData.forEach(record => {
      try {
        const matchedIds = JSON.parse(record.matchedUserIds as string) as string[];
        previousMatches.set(record.userId, new Set<string>(matchedIds));
      } catch (error) {
        console.error("Error parsing matchedUserIds for user:", record.userId, error);
        previousMatches.set(record.userId, new Set<string>()); 
      }
    });

    // Fetch active matches to avoid users who already liked each other
    const activeMatches = await db.select().from(matcher)
    const avoidMatches = new Set<string>()

    activeMatches.forEach(match => {
      if (match.user1Liked && match.user2Liked) {
        avoidMatches.add(`${match.user1}-${match.user2}`)
        avoidMatches.add(`${match.user2}-${match.user1}`)
      }
    })

    // Helper function to check if users are compatible
    const areUsersCompatible = (user1: UserWithPreferences, user2: UserWithPreferences) => {
      if (!user1.gender || !user2.gender || !user1.preferences?.genderPreferences || !user2.preferences?.genderPreferences) {
        return false
      }

      try {
        const user1Prefs = JSON.parse(user1.preferences.genderPreferences)
        const user2Prefs = JSON.parse(user2.preferences.genderPreferences)

        return user1Prefs.includes(user2.gender) && user2Prefs.includes(user1.gender)
      } catch {
        return false
      }
    }

    // Try to find matches for each user
    for (let i = 0; i < allUsers.length; i++) {
      const user1 = allUsers[i]
      
      if (matched.has(user1.id)) continue

      let foundMatch = false

      for (let j = i + 1; j < allUsers.length; j++) {
        const user2 = allUsers[j]
        
        if (matched.has(user2.id)) continue

        // Avoid previous matches and fully liked matches
        if (
          previousMatches.get(user1.id)?.has(user2.id) ||
          previousMatches.get(user2.id)?.has(user1.id) ||
          avoidMatches.has(`${user1.id}-${user2.id}`)
        ) {
          continue
        }

        if (areUsersCompatible(user1, user2)) {
          matches.push({
            id: crypto.randomUUID(),
            user1: user1.id,
            user2: user2.id,
            status: 'pending' as const
          })
        
          matched.add(user1.id)
          matched.add(user2.id)
          foundMatch = true
        
          // Add to match history after the match
          const matchedUserIdsUser1 = previousMatches.get(user1.id) || new Set();
          const matchedUserIdsUser2 = previousMatches.get(user2.id) || new Set();
          
          matchedUserIdsUser1.add(user2.id);
          matchedUserIdsUser2.add(user1.id);
        
          previousMatches.set(user1.id, matchedUserIdsUser1);
          previousMatches.set(user2.id, matchedUserIdsUser2);
        
          // Update the match history table
          await db.insert(matchHistory).values({
            id: crypto.randomUUID(),
            userId: user1.id,
            matchedUserIds: JSON.stringify([...matchedUserIdsUser1]),
            createdAt: new Date()
          }).onConflictDoUpdate({
            target: matchHistory.userId,
            set: { matchedUserIds: JSON.stringify([...matchedUserIdsUser1]), createdAt: new Date() }
          });
        
          await db.insert(matchHistory).values({
            id: crypto.randomUUID(),
            userId: user2.id,
            matchedUserIds: JSON.stringify([...matchedUserIdsUser2]),
            createdAt: new Date()
          }).onConflictDoUpdate({
            target: matchHistory.userId,
            set: { matchedUserIds: JSON.stringify([...matchedUserIdsUser2]), createdAt: new Date() }
          });
        
          break
        }
      }

      if (!foundMatch && user1.id) {
        matches.push({
          id: crypto.randomUUID(),
          user1: user1.id,
          user2: user1.id,
          status: 'unmatched' as const
        })
      }
    }

    // Clear existing matches
    await db.delete(matcher)

    // Insert new matches
    if (matches.length > 0) {
      await db.insert(matcher).values(matches)

      // Update match history
      const matchHistoryUpdates = Array.from(previousMatches.entries()).map(([userId, matchedUserIds]) => ({
        id: crypto.randomUUID(),
        userId,
        matchedUserIds: JSON.stringify([...matchedUserIds]),
        createdAt: new Date()
      }))

      await db.insert(matchHistory).values(matchHistoryUpdates).onConflictDoUpdate({
        target: matchHistory.userId,
        set: { matchedUserIds: matchHistory.matchedUserIds, createdAt: new Date() }
      });
    }

    return NextResponse.json({ 
      success: true, 
      matchCount: matches.filter(m => m.status === 'pending').length,
      unmatchedCount: matches.filter(m => m.status === 'unmatched').length
    })
  } catch (error) {
    console.error('Error in match-users:', error)
    return NextResponse.json(
      { error: 'Failed to match users' },
      { status: 500 }
    )
  }
}
