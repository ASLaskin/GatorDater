// app/api/matches/like/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/server';
import { matcher, matchHistory } from '@/server/schema';
import { eq, and, or } from 'drizzle-orm';
import { auth } from "@/server/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { matchId } = body;

  if (!matchId) {
    return NextResponse.json(
      { error: "Match ID is required" },
      { status: 400 }
    );
  }

  // Find the match and verify user is part of it
  const match = await db.query.matcher.findFirst({
    where: eq(matcher.id, matchId),
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Determine which user is liking
  const isUser1 = match.user1 === session.user.id;
  const isUser2 = match.user2 === session.user.id;

  if (!isUser1 && !isUser2) {
    return NextResponse.json({ error: "User not part of this match" }, { status: 403 });
  }

  // Update the appropriate like field
  const updateData = isUser1 
    ? { user1Liked: true }
    : { user2Liked: true };

  const updatedMatch = await db
    .update(matcher)
    .set(updateData)
    .where(eq(matcher.id, matchId))
    .returning();

  // Check if both users have liked
  const bothLiked = updatedMatch[0].user1Liked && updatedMatch[0].user2Liked;

  return NextResponse.json({
    success: true,
    match: {
      ...updatedMatch[0],
      isMutualMatch: bothLiked
    }
  });
}