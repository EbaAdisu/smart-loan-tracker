'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (isPending) {
    return <LoadingSpinner size="sm" />;
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">
          Hello, {session.user.name}
        </span>
        <button
          onClick={handleSignOut}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => router.push('/login')}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Sign In
      </button>
      <button
        onClick={() => router.push('/register')}
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </div>
  );
}
