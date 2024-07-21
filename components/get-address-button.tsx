import { useContext, useState } from 'react';

import { getErrorMessage } from '@/lib/utils';
import { WalletContext, withWalletProvider } from '@/providers/wallet-provider';

import CoinbaseWalletLogo from './coinbase-wallet-logo';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import MetamaskLogo from './metamask-logo';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import WalletAddress from './wallet-address';

import type { EthereumProvider } from '@/global';

function GetAddressButton({
  currentAddress,
  onAddress,
}: {
  currentAddress?: string;
  onAddress: (address: string) => void;
}) {
  const [pickAddresses, setPickAddresses] = useState<ReadonlyArray<string>>([]);

  const { cb, mm } = useContext(WalletContext);

  async function retrieveAddress(provider: EthereumProvider) {
    try {
      let addresses = (await provider.request({
        method: 'eth_requestAccounts',
      })) as ReadonlyArray<string>;
      if (!addresses.length) {
        throw new Error('No addresses found');
      }
      addresses = [...new Set(addresses)];
      if (addresses.length > 1) {
        setPickAddresses(addresses);
      } else {
        onAddress(addresses[0]);
      }
    } catch (error) {
      toast({
        title: 'Failed to retrieve wallet address',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }
  return (
    <>
      {cb && (
        <Button
          variant="secondary"
          className="p-2"
          onClick={event => {
            event.preventDefault();
            retrieveAddress(cb);
          }}
          aria-label="Get address from Coinbase Wallet"
        >
          <CoinbaseWalletLogo height="2rem" width="2rem" />
        </Button>
      )}
      {mm && (
        <Button
          variant="secondary"
          className="p-2"
          onClick={event => {
            event.preventDefault();
            retrieveAddress(mm);
          }}
          aria-label="Get address from Metamask"
        >
          <MetamaskLogo height="2rem" width="2rem" />
        </Button>
      )}
      <Dialog
        open={pickAddresses.length > 0}
        onOpenChange={open => {
          if (!open) {
            setPickAddresses([]);
          }
        }}
      >
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Select a wallet address</DialogTitle>
          <RadioGroup
            defaultValue={currentAddress}
            onValueChange={value => {
              onAddress(value);
              setPickAddresses([]);
            }}
          >
            {pickAddresses.map(address => (
              <div className="flex items-center space-x-2" key={address}>
                <RadioGroupItem value={address} id={`radio-${address}`} />
                <Label htmlFor={`radio-${address}`}>
                  <WalletAddress address={address} asBadge={false} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withWalletProvider(GetAddressButton);
