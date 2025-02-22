import { Suspense } from 'react';
import ProfileForm from "./components/ProfileForm";
import ProfilePreview from "./components/ProfilePreview";
import Header from "@/components/header";
import { auth } from "@/server/auth";
import { db } from "@/server";
import { users } from "@/server/schema";
import { eq } from "drizzle-orm";

async function getProfileData(email: string) {
  try {
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!userData.length) {
      return null;
    }
    
    return userData[0];
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

export default async function Page() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return <div className="container mx-auto px-4 py-8 text-center">Please sign in to view your profile</div>;
  }
  
  // Fetch complete user data from database
  const profileData = await getProfileData(session.user.email);
  
  if (!profileData) {
    return <div className="container mx-auto px-4 py-8 text-center">Unable to load profile data. Please try again later.</div>;
  }
  
  // Merge session data with profile data for completeness
  const userData = {
    ...session.user,
    ...profileData,
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>
        
        <Suspense >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Profile Preview Section */}
            <div className="lg:sticky lg:top-4 h-fit">
              <ProfilePreview user={userData} />
            </div>
            
            {/* Profile Form Section */}
            <div>
              <ProfileForm initialUser={userData} />
            </div>
          </div>
        </Suspense>
      </main>
    </>
  );
}