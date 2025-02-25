import { auth } from "@/server/auth";
import Header from "@/components/header";
import { SignIn } from "@/components/sign-in";
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import MatchesList from "@/components/match";
import CountdownWrapper from "@/components/CountdownWrapper";

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
    <main className="min-h-screen bg-gradient-to-b from-rose-200 to-teal-100">
      <Header />
      {!session ? (
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-lg px-8 py-10 bg-white/80 dark:bg-gray-800 shadow-lg backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 text-center space-y-6">
            {/* Title */}
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Sign in with your UFL email to join
            </h2>
            <SignIn />

            {/* Info Section */}
            <div className="space-y-5">
              <h3 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                How It Works
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to the dating app exclusively for UF students! This is different though, no endless swiping. Instead, you get
                <span className="font-semibold"> one quality match </span> every day at a set time.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When you get a match, you both have <span className="font-semibold">24 hours</span> to decide if you want to stay connected. If both of you like each other, you remain matched and can continue chatting.
                <span className="italic"> No pressure, no games—just one meaningful connection at a time.</span>
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Ready to meet someone special? Sign in with your UFL email and get your first match tomorrow!
              </p>
            </div>
          </Card>
          <h1 className="flex items-center py-3">
            Got feedback? Let me know
            <a href="" className="text-blue-400 hover:text-blue-500 underline px-1"> Here</a>
          </h1>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 space-y-6">
          {/* CountdownTimer rendered client-side only */}
          <CountdownWrapper />

          {/* <MatchUsersButton /> */}

          <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            {session?.user?.id ? (
              <MatchesList userId={session.user.id} />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Loading matches...</p>
            )}
          </div>
          <h1 className="flex items-center py-3">
            Got feedback? Let me know
            <a href="" className="text-blue-400 hover:text-blue-500 underline px-1"> Here</a>
          </h1>
        </div>
      )}

    </main>
  );
}