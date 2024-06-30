import { getSession } from 'next-auth/react';
import { and, eq } from 'drizzle-orm';

import { ReactionsTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { hashEmail } from '@/lib/server-utils';

import type { Reaction } from './getPosts';

export async function addReaction(post_id: number, reaction: Reaction['name']) {
  const session = await getSession();
  if (!session?.user?.email) {
    return { success: false };
  }

  await db.insert(ReactionsTable).values({
    post_id,
    email: hashEmail(session.user.email),
    reaction,
  });

  return { success: true };
}

export async function removeReaction(
  post_id: number,
  reaction: Reaction['name']
) {
  const session = await getSession();
  if (!session?.user?.email) {
    return { success: false };
  }

  await db
    .delete(ReactionsTable)
    .where(
      and(
        eq(ReactionsTable.post_id, post_id),
        eq(ReactionsTable.email, hashEmail(session.user.email)),
        eq(ReactionsTable.reaction, reaction)
      )
    );

  return { success: true };
}
