import { useContext, useState } from 'react';

import { getErrorMessage } from '@/lib/utils';
import { WalletContext } from '@/providers/wallet-provider';
import { useMediaQuery } from '@/hooks/use-media-query';

import CoinbaseWalletLogo from './coinbase-wallet-logo';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import MetamaskLogo from './metamask-logo';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

export default function GetAddressButton({
  currentAddress,
  onAddress,
}: {
  currentAddress?: string;
  onAddress: (address: string) => void;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [pickAddresses, setPickAddresses] = useState<ReadonlyArray<string>>([]);

  const { cb, mm } = useContext(WalletContext);

  async function retrieveAddress(provider: any) {
    try {
      // @ts-ignore
      let addresses: ReadonlyArray<string> = await provider.request({
        method: 'eth_requestAccounts',
      });
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
        <DialogContent className="maax-w-xs" aria-describedby={undefined}>
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
                <Label className="font-mono" htmlFor={`radio-${address}`}>
                  {isDesktop
                    ? address
                    : `${address.slice(0, 6)}…${address.slice(-4)}`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    </>
  );
}
