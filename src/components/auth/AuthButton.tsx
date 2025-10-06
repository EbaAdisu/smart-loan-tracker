'use client';

import { signOut, useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

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

  const handleSignIn = () => {
    console.log('Sign In button clicked, navigating to /login');
    try {
      router.push('/login');
    } catch (error) {
      console.error('Router push failed:', error);
      // Fallback to window.location
      window.location.href = '/login';
    }
  };

  const handleSignUp = () => {
    console.log('Sign Up button clicked, navigating to /register');
    try {
      router.push('/register');
    } catch (error) {
      console.error('Router push failed:', error);
      // Fallback to window.location
      window.location.href = '/register';
    }
  };

  return (
    <div className="flex space-x-2">
      <Link
        href="/login"
        className="text-sm text-link hover:text-link-hover px-3 py-1 rounded transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary-hover transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
