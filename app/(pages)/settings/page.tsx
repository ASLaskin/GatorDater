import Header from '@/components/header';
import SettingsClientComponent from './components/settings-client';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  // Get the session
  const session = await auth();
  
  // Redirect unauthenticated users
  if (!session?.user) {
    redirect('/login');
  }
  
  return (
    <>
      <Header />
      <SettingsClientComponent />
    </>
  );
}