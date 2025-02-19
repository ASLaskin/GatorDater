import { NextResponse } from 'next/server';
import { db } from '@/server';
import { matcher } from '@/server/schema';
import { eq } from 'drizzle-orm';
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

  // Determine which user is passing
  const isUser1 = match.user1 === session.user.id;
  const isUser2 = match.user2 === session.user.id;

  if (!isUser1 && !isUser2) {
    return NextResponse.json({ error: "User not part of this match" }, { status: 403 });
  }

  // Update the appropriate pass field (set the opposite like field to false)
  const updateData = isUser1 
    ? { user1Liked: false }  // User1 is passing, set user1Liked to false
    : { user2Liked: false }; // User2 is passing, set user2Liked to false

  const updatedMatch = await db
    .update(matcher)
    .set(updateData)
    .where(eq(matcher.id, matchId))
    .returning();

  return NextResponse.json({
    success: true,
    match: updatedMatch[0]
  });
}