import { useContext, useState } from 'react';

import { getErrorMessage } from '@/lib/utils';
import { WalletContext, withWalletProvider } from '@/providers/wallet-provider';
import { useMediaQuery } from '@/hooks/use-media-query';

import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import WalletAddress from './wallet-address';
import { Drawer, DrawerContent, DrawerTitle } from './ui/drawer';

function GetAddressButton({
  currentAddress,
  onAddress,
}: {
  currentAddress?: string;
  onAddress: (address: string) => void;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [showModal, setShowModal] = useState(false);
  const [pickAddresses, setPickAddresses] = useState<ReadonlyArray<string>>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const { eth, logo } = useContext(WalletContext);

  async function retrieveAddress() {
    try {
      if (!eth) {
        throw new Error('No provider found');
      }
      let addresses = (await eth.request({
        method: 'eth_requestAccounts',
      })) as ReadonlyArray<string>;
      if (!addresses.length) {
        throw new Error('No addresses found');
      }
      addresses = [...new Set(addresses)];
      if (addresses.length > 1) {
        setPickAddresses(addresses);
        setSelectedAddress(currentAddress ?? '');
        setShowModal(true);
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

  const validSelection =
    selectedAddress && pickAddresses.includes(selectedAddress);

  const radioGroup = (
    <div className="p-1 max-h-[75vh] overflow-y-auto">
      <RadioGroup
        value={selectedAddress}
        onValueChange={value => {
          setSelectedAddress(value);
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
    </div>
  );

  const selectButton = (
    <Button
      disabled={!validSelection}
      onClick={() => {
        onAddress(selectedAddress);
        setShowModal(false);
      }}
    >
      Select
    </Button>
  );

  return (
    <>
      {eth && logo && (
        <Button
          variant="secondary"
          className="p-1 w-12"
          onClick={event => {
            event.preventDefault();
            retrieveAddress();
          }}
          aria-label="Get address from Coinbase Wallet"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt="Coinbase Wallet logo"
            className="rounded-lg w-8"
          />
        </Button>
      )}
      <Dialog
        open={showModal && isDesktop}
        onOpenChange={open => {
          if (isDesktop) setShowModal(open);
        }}
      >
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Select a wallet address</DialogTitle>
          {radioGroup}
          <DialogFooter>{selectButton}</DialogFooter>
        </DialogContent>
      </Dialog>
      <Drawer
        open={showModal && !isDesktop}
        onOpenChange={open => {
          if (!isDesktop) setShowModal(open);
        }}
      >
        <DrawerContent className="mb-8 px-6" aria-describedby={undefined}>
          <DrawerTitle className="py-4">Select a wallet address</DrawerTitle>
          <div className="pb-4">{radioGroup}</div>
          {selectButton}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default withWalletProvider(GetAddressButton);
