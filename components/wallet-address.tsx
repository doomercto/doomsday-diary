import Link from 'next/link';

import { useMediaQuery } from '@/hooks/use-media-query';

import { Badge } from './ui/badge';

export default function WalletAddress({ address }: { address?: string }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!address) {
    return null;
  }

  const addressTruncated = isDesktop
    ? address
    : `${address.slice(0, address.startsWith('0x') ? 6 : 4)}…${address.slice(-4)}`;

  return (
    <Link href={`https://basescan.org/address/${address}`} target="_blank">
      <Badge>{addressTruncated}</Badge>
    </Link>
  );
}
