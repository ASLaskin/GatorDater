import ProfileForm from "./components/ProfileForm";
import { auth } from "@/server/auth";
import ProfilePreview from "./components/ProfilePreview";
import Header from "@/components/header";


export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Profile Preview Section */}
          <div className="lg:sticky lg:top-4 h-fit">
            <ProfilePreview user={session.user} />
          </div>

          {/* Profile Form Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <ProfileForm />
          </div>
        </div>

      </main>
    </>
  );
}