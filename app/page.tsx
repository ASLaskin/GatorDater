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
          <SignIn/>
          <a
            href="#how-it-works"
            className="text-blue-500 underline hover:text-blue-700"
          >
            How it works
          </a>
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
