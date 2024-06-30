'use server';

import { getServerSession } from 'next-auth';
import { asc, eq as equals } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { hashEmail } from '@/lib/server-utils';
import { AdminsTable, PostsTable } from '@/drizzle/schema';

import type { InferSelectModel } from 'drizzle-orm';
import type { Post } from './getPosts';

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

export async function addAdmin(email: string, nickname: string) {
  await db.insert(AdminsTable).values({ email: hashEmail(email), nickname });
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

export async function getPendingPosts(): Promise<Post[]> {
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
  await db.update(PostsTable).set({ status }).where(equals(PostsTable.id, id));
  return { success: true };
}
