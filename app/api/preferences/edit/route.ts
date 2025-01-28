import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server";
import { preferences } from "@/server/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const existingPreferences = await db
      .select()
      .from(preferences)
      .where(eq(preferences.userId, session.user.id));

    let updatedPreferences;

    if (existingPreferences.length > 0) {
      updatedPreferences = await db
        .update(preferences)
        .set(body)
        .where(eq(preferences.userId, session.user.id))
        .returning();
    } else {
      updatedPreferences = await db
        .insert(preferences)
        .values({
          userId: session.user.id,
          ...body
        })
        .returning();
    }

    if (!updatedPreferences.length) {
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Preferences updated successfully",
      preferences: updatedPreferences[0]
    });

  } catch (error) {
    console.error("Preferences update error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}