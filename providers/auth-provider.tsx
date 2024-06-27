'use client';

import { useEffect } from 'react';
import { SessionProvider, signIn, useSession } from 'next-auth/react';

import type { ReactNode } from 'react';

function AnonymousSessionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  useEffect(() => {
    // console.log(status);
    // console.log(session);
    if (status === 'unauthenticated') {
      // login as anonymous
      signIn('credentials').then(_data => {
        // async sign-in returned
      });
    }
  }, [status, session]);

  return status !== 'authenticated' ? <div /> : children;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AnonymousSessionProvider>{children}</AnonymousSessionProvider>
    </SessionProvider>
  );
}
