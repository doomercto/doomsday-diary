'use server';

import { desc } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

import { db } from '@/drizzle/db';
import { PostsTable } from '@/drizzle/schema';
import { hashEmail } from '@/lib/server-utils';

import type { ReactionsTable } from '@/drizzle/schema';
import type { InferSelectModel } from 'drizzle-orm';

const REACTIONS = ['fire', 'heart', 'laugh', 'cry', 'bulb'] as const;

export interface Reaction {
  name: (typeof REACTIONS)[number];
  count: number;
  user_liked: boolean;
}

export interface Post {
  id: number;
  title: string;
  body?: string;
  image?: string;
  display_name?: string;
  wallet?: string;
  timestamp: string;
  nft_url?: string;
  reactions?: Reaction[];
}

function toReactions(
  reactions: InferSelectModel<typeof ReactionsTable>[],
  hashedEmail?: string
) {
  const reactionMap = new Map<Reaction['name'], Reaction>();
  for (const reactionName of REACTIONS) {
    reactionMap.set(reactionName, {
      name: reactionName,
      count: 0,
      user_liked: false,
    });
  }
  for (const reactionEntry of reactions) {
    const reaction = reactionMap.get(
      reactionEntry.reaction as Reaction['name']
    );
    if (!reaction) {
      continue;
    }
    reaction.count++;
    if (reactionEntry.email === hashedEmail) {
      reaction.user_liked = true;
    }
  }
  return Array.from(reactionMap.values());
}

function toResponse(
  result: InferSelectModel<typeof PostsTable> & {
    reactions?: InferSelectModel<typeof ReactionsTable>[];
  },
  hashedEmail?: string
): Post {
  return {
    id: result.id,
    title: result.title,
    body: result.body ?? undefined,
    image: result.image ?? undefined,
    display_name: result.display_name ?? undefined,
    wallet: result.wallet ?? undefined,
    timestamp: result.timestamp.toISOString(),
    nft_url: result.nft_url ?? undefined,
    reactions: result.reactions
      ? toReactions(result.reactions, hashedEmail)
      : undefined,
  };
}

export async function getPosts({ before }: { before?: string } = {}): Promise<
  Post[]
> {
  const sessionPromise = getServerSession();
  const resultsPromise = db.query.PostsTable.findMany({
    limit: 10,
    orderBy: [desc(PostsTable.timestamp)],
    where: (posts, { and, eq, lt }) => {
      const approved = eq(posts.status, 'approved');
      if (before) {
        return and(approved, lt(posts.timestamp, new Date(before)));
      }
      return approved;
    },
    with: {
      reactions: true,
    },
  });
  const [session, results] = await Promise.all([
    sessionPromise,
    resultsPromise,
  ]);
  let hashedEmail: string | undefined;
  if (session?.user?.email) {
    hashedEmail = hashEmail(session.user.email);
  }
  return results.map(result => toResponse(result, hashedEmail));
}

export async function checkNewPosts({
  after = new Date().toISOString(),
  v2,
}: { after?: string; v2?: boolean } = {}) {
  if (!v2) {
    console.log('ignoring request from outdated client');
    return false;
  }
  const afterDate = new Date(after);
  afterDate.setSeconds(afterDate.getSeconds() + 5);
  const newPost = await db.query.PostsTable.findFirst({
    where: (posts, { and, eq, gt }) =>
      and(eq(posts.status, 'approved'), gt(posts.timestamp, afterDate)),
    orderBy: [desc(PostsTable.timestamp)],
  });
  return !!newPost;
}
