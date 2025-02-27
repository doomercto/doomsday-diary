'use server';

import { getServerSession } from 'next-auth';
import { asc, eq as equals } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/drizzle/db';
import { hashEmail, sendTelegramMessage } from '@/lib/server-utils';
import { AdminsTable, PostsTable } from '@/drizzle/schema';

import type { InferSelectModel } from 'drizzle-orm';
import type { Post } from './getPosts';

function toResponse(result: InferSelectModel<typeof PostsTable>): Post {
  return {
    id: result.id,
    title: result.title,
    body: result.body?.trim() ?? undefined,
    image: result.image ?? undefined,
    display_name: result.display_name ?? undefined,
    wallet: result.wallet ?? undefined,
    timestamp: result.timestamp.toISOString(),
    nft_url: result.nft_url ?? undefined,
  };
}

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession();
  const email = session?.user?.email;
  if (!email) return false;
  const admin = await db.query.AdminsTable.findFirst({
    where: (admins, { eq }) => eq(admins.email, hashEmail(email)),
  });
  return !!admin;
}

export async function addAdmin(email: string, nickname: string) {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Not an admin');
  }
  await db.insert(AdminsTable).values({ email: hashEmail(email), nickname });
}

export async function getPendingPosts(): Promise<Post[]> {
  const admin = await isAdmin();
  if (!admin) {
    return [];
  }
  const results = await db.query.PostsTable.findMany({
    where: (posts, { eq }) => eq(posts.status, 'pending'),
    orderBy: [asc(PostsTable.timestamp)],
  });
  return results.map(result => toResponse(result));
}

export async function updatePostStatus(
  id: number,
  status: 'approved' | 'rejected' | 'pending'
) {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false };
  }
  await db.update(PostsTable).set({ status }).where(equals(PostsTable.id, id));
  revalidatePath('/admin');

  if (status === 'approved') {
    await sendTelegramMessage({
      chat_id: process.env.TELEGRAM_NEWPOST_CHAT_ID,
      text: `📢 NEW DOOMSDAY DIARY POST: https://diary.doomercto.xyz/post/${id}`,
    }).catch(err => {
      console.warn('Failed to send message to Telegram:', err.message || err);
    });
  }

  return { success: true };
}
