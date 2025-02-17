// app/api/matches/pass/route.ts
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

  // Find the match
  const match = await db.query.matcher.findFirst({
    where: eq(matcher.id, matchId),
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Verify user is part of the match
  if (match.user1 !== session.user.id && match.user2 !== session.user.id) {
    return NextResponse.json({ error: "User not part of this match" }, { status: 403 });
  }

  // Add to match history
  await db.insert(matchHistory).values({
    id: crypto.randomUUID(),
    user1: match.user1,
    user2: match.user2,
    finalStatus: 'passed',
    createdAt: match.createdAt,
    endedAt: new Date(),
  });

  // Delete the match
  await db.delete(matcher).where(eq(matcher.id, matchId));

  return NextResponse.json({
    success: true,
  });
}