import { memo } from 'react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ImagePreview } from './image-preview';
import RelativeTime from './relative-time';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import WalletAddress from './wallet-address';
import TruncatedText from './truncated-text';

import type { Post } from '@/actions/getPosts';

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="m-1 md:m-2">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        {post.body && (
          <CardDescription className="text-card-foreground">
            <TruncatedText text={post.body} />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ImagePreview post={post} />
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">
        <small className="text-muted-foreground">
          {post.display_name ?? 'Anonymous'}
        </small>
        <Separator orientation="vertical" className="h-5" />
        <small
          className="text-muted-foreground"
          title={new Date(post.timestamp).toLocaleString()}
        >
          <RelativeTime date={post.timestamp} />
        </small>
        <div className="grow" />
        {post.nft_url && (
          <Link href={post.nft_url} target="_blank">
            <Badge>Mint as NFT</Badge>
          </Link>
        )}
        <WalletAddress address={post.wallet} />
      </CardFooter>
    </Card>
  );
}

export default memo(PostCard);
