import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Simple Loan Tracker
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Track who owes you money and who you owe money to. Simple and
            straightforward.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-hover"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-background text-link px-6 py-3 rounded-lg border border-border hover:bg-muted"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-6 rounded-lg shadow border border-border">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Add Loans
            </h3>
            <p className="text-muted-foreground">
              Track money you lent or borrowed from friends and family.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow border border-border">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Track Payments
            </h3>
            <p className="text-muted-foreground">
              Record when payments are made to keep your loans up to date.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow border border-border">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Simple Overview
            </h3>
            <p className="text-muted-foreground">
              See at a glance who owes you money and who you owe money to.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
