// @ts-nocheck

'use client';

import { createContext, useEffect, useState } from 'react';

import type { ReactNode } from 'react';

export interface WalletProviders {
  cb?: any;
  mm?: any;
}

export const WalletContext = createContext<WalletProviders>({});

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<WalletProviders>({});
  useEffect(() => {
    const providersMap: WalletProviders = {};
    if (!window?.ethereum) {
      setProviders(providersMap);
      return;
    }
    if (window.ethereum.providers) {
      providersMap.cb = window.ethereum.providers.find(p => p.isCoinbaseWallet);
      providersMap.mm = window.ethereum.providers.find(p => p.isMetaMask);
    } else if (window.ethereum.isCoinbaseWallet) {
      providersMap.cb = window.ethereum;
    } else if (window.ethereum.isMetaMask) {
      providersMap.mm = window.ethereum;
    }
    setProviders(providersMap);
  }, []);
  return (
    <WalletContext.Provider value={providers}>
      {children}
    </WalletContext.Provider>
  );
}
