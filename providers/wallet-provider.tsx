'use client';

import { createContext, useEffect, useState } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

import type { EthereumProvider } from '@/global';
import type { ReactNode, ComponentType } from 'react';

export interface WalletProviders {
  cb?: EthereumProvider;
}

export const WalletContext = createContext<WalletProviders>({});

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [providers, setProviders] = useState<WalletProviders>({});
  useEffect(() => {
    const providersMap: WalletProviders = {};
    if (window?.ethereum) {
      if (window.ethereum.providers) {
        providersMap.cb = window.ethereum.providers.find(
          p => p.isCoinbaseWallet
        );
      } else if (window.ethereum.isCoinbaseWallet) {
        providersMap.cb = window.ethereum;
      }
    }
    if (!providersMap.cb) {
      const cb = new CoinbaseWalletSDK({
        appName: 'The Doomsday Diary',
        appLogoUrl: `${location.origin}/icon.png`,
      });
      providersMap.cb = cb.makeWeb3Provider() as unknown as EthereumProvider;
    }
    setProviders(providersMap);
  }, []);
  return (
    <WalletContext.Provider value={providers}>
      {children}
    </WalletContext.Provider>
  );
}

export function withWalletProvider<P extends {}>(Component: ComponentType<P>) {
  return function WalletProviderComponent(props: P) {
    return <WalletProvider>{<Component {...props} />}</WalletProvider>;
  };
}
