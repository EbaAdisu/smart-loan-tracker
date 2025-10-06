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
        <span className="text-sm text-muted-foreground">
          Hello, {session.user.name}
        </span>
        <button
          onClick={handleSignOut}
          className="text-sm text-link hover:text-link-hover"
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
        className="text-sm text-link hover:text-link-hover"
      >
        Sign In
      </button>
      <button
        onClick={() => router.push('/register')}
        className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary-hover"
      >
        Sign Up
      </button>
    </div>
  );
}
