"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import Chat from './Chat';
import MatchActions from './matchActions';
import { useToast } from "@/hooks/use-toast"
import Link from "next/link";

type Match = {
  matchId: string;
  user1Liked: boolean;
  user2Liked: boolean;
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
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/matches/get?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch match');

        const data = await response.json();
        setMatch(data.matches && data.matches.length > 0 ? data.matches[0] : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [userId]);

  const handleLike = async () => {
    if (!match) return;

    try {
      setActionLoading(true);
      const response = await fetch('/api/matches/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.matchId,
          userId: userId,
        }),
      });

      if (!response.ok) throw new Error('Failed to like match');

      const { match: updatedMatch } = await response.json();
      // Keep the existing match data but update the like status
      setMatch(prev => prev ? {
        ...prev,
        user1Liked: updatedMatch.user1Liked,
        user2Liked: updatedMatch.user2Liked,
      } : null);

      toast({
        title: "Match liked!",
        description: "If they like you back, you'll stay matched for tomorrow!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to like match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePass = async () => {
    if (!match) return;

    try {
      setActionLoading(true);
      const response = await fetch('/api/matches/pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.matchId,
          userId: userId,
        }),
      });

      if (!response.ok) throw new Error('Failed to pass on match');

      toast({
        title: "Passed on match",
        description: "You'll get a new match tomorrow!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to pass on match. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Current Match</h2>
      {!match ? (
        <Card className='border-slate-200'>
          <CardContent className="p-6 flex flex-col  items-center">
            <p className="text-center text-muted-foreground">
              No match found yet :(
            </p>
            <Link href='/misc'>
              <p className='text-muted-foreground underline'>
                Play a game while you wait?
              </p>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <Card className='border-slate-200'>
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
              </div>

              <MatchActions
                matchId={match.matchId}
                isLiked={userId === match.matchedUser?.id ? match.user2Liked : match.user1Liked}
                onLike={handleLike}
                onPass={handlePass}
                disabled={actionLoading}
              />
            </CardContent>
          </Card>

          {match.matchId && (
            <Chat
              matchId={match.matchId}
              matchedUserName={match.matchedUser?.name || 'Anonymous'}
              matchedUserImage={match.matchedUser?.image || undefined}
              currentUserId={userId}
            />
          )}
        </div>
      )}
    </div>
  );
}