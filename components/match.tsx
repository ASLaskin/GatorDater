"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import Chat from './Chat';

type Match = {
  matchId: string;
  status: 'pending' | 'liked' | 'passed' | 'unmatched';
  matchedUser: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string;
    gender: string | null;
  } | null;
};

interface MatchesListProps {
  userId: string;
}

export default function MatchesList({ userId }: MatchesListProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/matches/get?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch match');
        
        const data = await response.json();
        // Since user only has one match at a time, take the first one if it exists
        setMatch(data.matches && data.matches.length > 0 ? data.matches[0] : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatch();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Match</h2>
      {!match ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No match found yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <Card>
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
          <Chat
            matchId={match.matchId}
            matchedUserName={match.matchedUser?.name || 'Anonymous'}
            matchedUserImage={match.matchedUser?.image || undefined}
            currentUserId={userId}
          />
        </div>
      )}
    </div>
  );
}