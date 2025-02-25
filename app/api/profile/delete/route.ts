import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server";
import { users } from "@/server/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const deletedUser = await db
      .delete(users)
      .where(eq(users.email, session.user.email))
      .returning({ id: users.id });
    
    if (!deletedUser.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Account deleted successfully",
      userId: deletedUser[0].id
    });
    
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}