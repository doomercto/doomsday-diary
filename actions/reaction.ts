'use server';

import { getServerSession } from 'next-auth';
import { and, eq } from 'drizzle-orm';

import { ReactionsTable } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { getAnonId, hashEmail, verifyCaptcha } from '@/lib/server-utils';

import type { Reaction } from './getPosts';

export async function addReaction(
  post_id: number,
  reaction: Reaction['name'],
  token: string
) {
  const session = await getServerSession();

  let email;
  if (session?.user?.email) {
    email = hashEmail(session.user.email);
  }
  if (!email) {
    const valid = await verifyCaptcha(token, 'add_reaction');
    if (!valid) {
      return { success: false, errorReason: 'login' };
    }
    email = getAnonId(true);
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

  let email;
  if (session?.user?.email) {
    email = hashEmail(session.user.email);
  }
  if (!email) {
    email = getAnonId();
  }
  if (!email) {
    return { success: false, errorReason: 'login' };
  }

  await db
    .delete(ReactionsTable)
    .where(
      and(
        eq(ReactionsTable.post_id, post_id),
        eq(ReactionsTable.email, email),
        eq(ReactionsTable.reaction, reaction)
      )
    );

  return { success: true };
}
