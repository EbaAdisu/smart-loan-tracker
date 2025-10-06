import AuthButton from '@/components/auth/AuthButton';
import ThemeToggle from '@/components/theme/ThemeToggle';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Smart Loan Tracker',
  description: 'Simple person-to-person loan tracking application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mono-light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="var(--primary)"
          height={3}
          showSpinner={false}
          crawl={true}
          speed={200}
          easing="ease"
        />
        <nav className="bg-background shadow-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <h1 className="text-xl font-semibold text-foreground">
                  Smart Loan Tracker
                </h1>
                <div className="hidden md:flex items-center gap-6">
                  <a
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/payments"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Payments
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AuthButton />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
