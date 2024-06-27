import Header from '@/components/header';
import AuthProvider from '@/providers/auth-provider';

import type { ReactNode } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 md:gap-8 break-words">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
