import { memo } from 'react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { ImagePreview } from './image-preview';
import RelativeTime from './relative-time';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import WalletAddress from './wallet-address';
import TruncatedText from './truncated-text';
import ReactionsBar from './reactions-bar';

import type { Post } from '@/actions/getPosts';

function PostCard({
  post,
  hideReactions = false,
}: {
  post: Post;
  hideReactions?: boolean;
}) {
  return (
    <Card className="m-1 md:m-2">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        {post.body && (
          <div className="text-sm text-card-foreground pt-6">
            <TruncatedText text={post.body} />
          </div>
        )}
      </CardHeader>
      <CardContent className={cn(!post.image && 'pb-2')}>
        <ImagePreview post={post} />
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">
        {!hideReactions && (
          <ReactionsBar post_id={post.id} reactions={post.reactions} />
        )}
        <small className="text-muted-foreground max-w-full">
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
