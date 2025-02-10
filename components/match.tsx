"use client"
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'

type Match = {
  matchId: string
  status: 'pending' | 'liked' | 'passed' | 'unmatched'
  matchedUser: {
    id: string
    name: string | null
    image: string | null
    bio: string
    gender: string | null
  } | null
}

export default function MatchesList({ userId }: { userId: string }) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/matches/get?userId=${userId}`)
        if (!response.ok) throw new Error('Failed to fetch matches')
        
        const data = await response.json()
        setMatches(data.matches)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load matches')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Matches</h2>
      {matches.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No matches found yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        matches.map(match => (
          <Card key={match.matchId}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  {match.matchedUser?.image ? (
                    <AvatarImage src={match.matchedUser.image} />
                  ) : (
                    <AvatarFallback>
                      {match.matchedUser?.name?.[0] || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {match.matchedUser?.name || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {match.matchedUser?.bio}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {match.status}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}