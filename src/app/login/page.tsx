import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-link hover:text-link-hover"
            >
              create a new account
            </Link>
          </p>
        </div>
        <div className="bg-background py-8 px-6 shadow rounded-lg border border-border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
