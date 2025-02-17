import { NextResponse } from 'next/server';
import { db } from '@/server';
import { messages, matcher } from '@/server/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import { auth } from "@/server/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
  }

  const matchExists = await db.query.matcher.findFirst({
    where: and(
      eq(matcher.id, matchId),
      or(
        eq(matcher.user1, session.user.id),
        eq(matcher.user2, session.user.id)
      )
    ),
  });

  if (!matchExists) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }


  const messagesList = await db.query.messages.findMany({
    where: eq(messages.matchId, matchId),
    orderBy: [desc(messages.createdAt)],
  });

  return NextResponse.json({
    success: true,
    messages: messagesList,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { matchId, content } = body;

  if (!matchId || !content) {
    return NextResponse.json(
      { error: "Match ID and content are required" },
      { status: 400 }
    );
  }

  const match = await db.query.matcher.findFirst({
    where: and(
      eq(matcher.id, matchId),
      or(
        eq(matcher.user1, session.user.id),
        eq(matcher.user2, session.user.id)
      )
    ),
  });

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const newMessage = await db.insert(messages).values({
    id: crypto.randomUUID(),
    matchId,
    senderId: session.user.id,
    content,
    createdAt: new Date(),
  }).returning();

  return NextResponse.json({
    success: true,
    message: newMessage[0],
  });
}