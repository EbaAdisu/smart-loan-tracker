import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-link hover:text-link-hover"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <div className="bg-background py-8 px-6 shadow rounded-lg border border-border">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
