import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server";
import { users } from "@/server/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";
import { profileUpdateSchema } from "@/server/schemas/profile-schema";

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = profileUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const updatedUser = await db
      .update(users)
      .set({
        ...validatedData.data,
      })
      .where(eq(users.email, session.user.email))
      .returning();

    if (!updatedUser.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser[0]
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}