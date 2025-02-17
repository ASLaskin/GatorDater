import { auth } from "@/server/auth";
import Header from "@/components/header";
import { SignIn } from "@/components/sign-in";
import CountdownTimer from "@/components/CountdownTimer";
import MatchUsersButton from "@/components/matchbutton";
import MatchesList from "@/components/match";

export default async function Home() {
  const session = await auth();

  if (session === undefined) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </main>
    );
  }

  return (
    <main>
      <Header />
      {!session ? (
        <div className="flex flex-col items-center mt-10 space-y-4">
          <h2 className="text-xl font-semibold">
            Sign in with your UFL email to join
          </h2>
          <SignIn />
          <div className="max-w-md text-center space-y-4 px-4">
            <h2 className="text-xl font-semibold text-blue-600">How It Works</h2>
            <div className="space-y-3">
              <p>
                Welcome to the dating app exclusively for UF students! We're different - instead of endless swiping, we give you one quality match every day at a set time. Think of it as your daily coffee date opportunity.
              </p>
              <p>
                When you get a match, you both have 24 hours to get to know each other and decide if you'd like to continue the connection. If you both like each other, you'll stay matched and can keep chatting. No pressure, no games - just one meaningful connection at a time.
              </p>
              <p className="font-medium">
                Ready to meet someone special? Sign in with your UFL email and get your first match tomorrow!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 space-y-4">
          <div>
            <p className="text-lg font-medium">
              Time until your next match:
            </p>
            <CountdownTimer />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notify"
              className="h-5 w-5 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notify" className="text-sm font-medium">
              Get notified for the next match
            </label>
          </div>
          <MatchUsersButton />
          {session?.user?.id ? <MatchesList userId={session.user.id} /> : <p>Loading matches...</p>}
        </div>
      )}
    </main>
  );
}
