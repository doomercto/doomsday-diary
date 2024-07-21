import Link from 'next/link';

import { useMediaQuery } from '@/hooks/use-media-query';

import { Badge } from './ui/badge';

export default function WalletAddress({
  address,
  asBadge = true,
}: {
  address?: string;
  asBadge?: boolean;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!address) {
    return null;
  }

  const addressTruncated = isDesktop
    ? address
    : `${address.slice(0, address.startsWith('0x') ? 6 : 4)}…${address.slice(-4)}`;

  const content = <span className="font-mono">{addressTruncated}</span>;

  if (!asBadge) {
    return content;
  }

  return (
    <Link href={`https://basescan.org/address/${address}`} target="_blank">
      <Badge>{content}</Badge>
    </Link>
  );
}
