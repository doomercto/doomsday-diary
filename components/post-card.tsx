'use client';

import { memo, useContext } from 'react';
import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AdminContext } from '@/providers/admin-provider';

import { ImagePreview } from './image-preview';
import RelativeTime from './relative-time';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import WalletAddress from './wallet-address';
import TruncatedText from './truncated-text';
import ReactionsBar from './reactions-bar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

import type { Post } from '@/actions/getPosts';

function PostCard({
  post,
  hideExtras = false,
  truncate = true,
}: {
  post: Post;
  hideExtras?: boolean;
  truncate?: boolean;
}) {
  const isAdmin = useContext(AdminContext);

  return (
    <Card className="m-1 md:m-2">
      <CardHeader>
        <div className="flex">
          <CardTitle className="flex-1 max-w-full">{post.title}</CardTitle>
          {isAdmin && !hideExtras && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4 p-0 h-6 w-6">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(
                        `${location.origin}/post/${post.id}`
                      );
                      toast({
                        title: 'Post URL copied to clipboard',
                      });
                    } catch (err) {
                      toast({
                        title: 'Something went wrong',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  Share post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {post.body && (
          <div className="text-sm text-card-foreground pt-6">
            <TruncatedText text={post.body} truncate={truncate} />
          </div>
        )}
      </CardHeader>
      <CardContent className={cn(!post.image && 'pb-2')}>
        <ImagePreview post={post} />
      </CardContent>
      <CardFooter className="gap-2 flex-wrap">
        {!hideExtras && (
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
