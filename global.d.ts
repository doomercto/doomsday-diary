interface EthereumProvider {
  isCoinbaseWallet?: boolean;
  isMetaMask?: boolean;
  providers?: ReadonlyArray<EthereumProvider>;
  request: (args: {
    method: String;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};

export type { EthereumProvider };
