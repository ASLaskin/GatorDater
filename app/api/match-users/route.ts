import { NextResponse } from 'next/server'
import { db } from '@/server'
import { users, preferences, matcher } from '@/server/schema'
import { eq } from 'drizzle-orm'

type UserWithPreferences = {
  id: string
  gender: string | null
  preferences: {
    genderPreferences: string | null
  } | null
}

export async function POST() {
  try {
    // Get all users with their preferences
    const result = await db
      .select({
        id: users.id,
        gender: users.gender,
        preferences: preferences
      })
      .from(users)
      .leftJoin(preferences, eq(users.id, preferences.userId))

    // Filter out any invalid users and transform data
    const allUsers: UserWithPreferences[] = result
      .filter(user => user.id && user.gender) // Ensure we have valid users
      .map(user => ({
        id: user.id,
        gender: user.gender,
        preferences: user.preferences
      }))

    const matches = []
    const matched = new Set<string>()

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
      
      // Skip if user is already matched
      if (matched.has(user1.id)) continue

      let foundMatch = false

      // Look for compatible matches
      for (let j = i + 1; j < allUsers.length; j++) {
        const user2 = allUsers[j]
        
        // Skip if user2 is already matched
        if (matched.has(user2.id)) continue

        // Check if users are compatible based on their preferences
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
          break
        }
      }

      // If no match found, create an unmatched record
      if (!foundMatch && user1.id) {
        matches.push({
          id: crypto.randomUUID(),
          user1: user1.id,
          user2: user1.id, // Same user indicates unmatched
          status: 'unmatched' as const
        })
      }
    }

    // Clear existing matches first
    await db.delete(matcher)

    // Insert new matches if we have any
    if (matches.length > 0) {
      console.log('Inserting matches:', matches) // Debug log
      await db.insert(matcher).values(matches)
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