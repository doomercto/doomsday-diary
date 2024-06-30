'use server';

import { desc } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { PostsTable } from '@/drizzle/schema';

import type { InferSelectModel } from 'drizzle-orm';

export interface Post {
  id: number;
  title: string;
  body?: string;
  image?: string;
  display_name?: string;
  wallet?: string;
  timestamp: string;
  nft_url?: string;
}

function toResponse(result: InferSelectModel<typeof PostsTable>): Post {
  return {
    id: result.id,
    title: result.title,
    body: result.body ?? undefined,
    image: result.image ?? undefined,
    display_name: result.display_name ?? undefined,
    wallet: result.wallet ?? undefined,
    timestamp: result.timestamp.toISOString(),
    nft_url: result.nft_url ?? undefined,
  };
}

export async function getPosts({ before }: { before?: string } = {}): Promise<
  Post[]
> {
  const results = await db.query.PostsTable.findMany({
    limit: 10,
    orderBy: [desc(PostsTable.timestamp)],
    where: (posts, { and, eq, lt }) => {
      const approved = eq(posts.status, 'approved');
      if (before) {
        return and(approved, lt(posts.timestamp, new Date(before)));
      }
      return approved;
    },
  });
  return results.map(result => toResponse(result));
}

export async function checkNewPosts({
  after = new Date().toISOString(),
}: { after?: string } = {}) {
  const afterDate = new Date(after);
  afterDate.setSeconds(afterDate.getSeconds() + 5);
  const newPost = await db.query.PostsTable.findFirst({
    where: (posts, { and, eq, gt }) =>
      and(eq(posts.status, 'approved'), gt(posts.timestamp, afterDate)),
    orderBy: [desc(PostsTable.timestamp)],
  });
  return !!newPost;
}
