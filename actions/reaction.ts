'use server';

import { randomUUID } from 'crypto';

import { getServerSession } from 'next-auth';
import { and, eq } from 'drizzle-orm';

import { ReactionsTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { hashEmail } from '@/lib/server-utils';

import type { Reaction } from './getPosts';

export async function addReaction(post_id: number, reaction: Reaction['name']) {
  const session = await getServerSession();

  let email = `anon-${randomUUID()}`;
  if (session?.user?.email) {
    email = hashEmail(session.user.email);
  }

  await db.insert(ReactionsTable).values({
    post_id,
    email,
    reaction,
  });

  return { success: true };
}

export async function removeReaction(
  post_id: number,
  reaction: Reaction['name']
) {
  const session = await getServerSession();
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
