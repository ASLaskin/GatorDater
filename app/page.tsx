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
      <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header />
      {!session ? (
        <div className="flex flex-col items-center mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign in with your UFL email to join
          </h2>
          <SignIn />
          <div className="max-w-lg text-center space-y-5 px-6 py-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              How It Works
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              Welcome to the dating app exclusively for UF students! We’re different—no endless swiping. Instead, you get **one quality match** every day at a set time.
            </p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              When you get a match, you both have **24 hours** to decide if you want to stay connected. If both of you like each other, you remain matched and can continue chatting. **No pressure, no games—just one meaningful connection at a time.**
            </p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Ready to meet someone special? Sign in with your UFL email and get your first match tomorrow!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
            <label htmlFor="notify" className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Get notified for the next match
            </label>
          </div>

          {/* <MatchUsersButton /> */}

          <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            {session?.user?.id ? (
              <MatchesList userId={session.user.id} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Loading matches...</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
