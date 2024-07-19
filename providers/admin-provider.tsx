'use client';

import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

import { isAdmin as isAdminRaw } from '@/actions/admin';

import type { ReactNode } from 'react';

export const AdminContext = createContext<boolean>(false);

async function getIsAdmin(...args: Parameters<typeof isAdminRaw>) {
  try {
    const admin = await isAdminRaw(...args);
    return admin;
  } catch (err) {
    return false;
  }
}

export default function AdminProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      setIsAdmin(await getIsAdmin());
    })();
  }, [session?.user?.email]);

  return (
    <AdminContext.Provider value={isAdmin}>{children}</AdminContext.Provider>
  );
}
