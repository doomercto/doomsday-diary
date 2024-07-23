'use client';

import { createContext, useEffect, useState } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

import type { ProviderInterface } from '@coinbase/wallet-sdk';
import type { ReactNode, ComponentType } from 'react';

interface InjectedProvider extends ProviderInterface {
  isCoinbaseWallet?: boolean;
  providers?: ReadonlyArray<InjectedProvider>;
}

interface EthereumWindow extends Window {
  ethereum?: InjectedProvider;
}

export interface WalletContextObj {
  eth?: ProviderInterface;
  logo?: string;
}

export const WalletContext = createContext<WalletContextObj>({});

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<WalletContextObj>({});
  useEffect(() => {
    const contextObj: WalletContextObj = {};

    const sdk = new CoinbaseWalletSDK({
      appName: 'The Doomsday Diary',
      appLogoUrl: `${location.origin}/icon.png`,
    });

    const ethWindow = window as EthereumWindow;

    if (ethWindow?.ethereum) {
      if (ethWindow.ethereum.providers) {
        contextObj.eth = ethWindow.ethereum.providers.find(
          p => p.isCoinbaseWallet
        );
      } else if (ethWindow.ethereum.isCoinbaseWallet) {
        contextObj.eth = ethWindow.ethereum;
      }
    }
    if (!contextObj.eth) {
      contextObj.eth = sdk.makeWeb3Provider();
    }

    contextObj.logo = sdk.getCoinbaseWalletLogo('standard');

    setContext(contextObj);
  }, []);
  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  );
}

export function withWalletProvider<P extends {}>(Component: ComponentType<P>) {
  return function WalletProviderComponent(props: P) {
    return <WalletProvider>{<Component {...props} />}</WalletProvider>;
  };
}
