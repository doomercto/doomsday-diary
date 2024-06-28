'use server';

import { getServerSession } from 'next-auth';

import { db } from '@/drizzle/db';
import { PostsTable } from '@/drizzle/schema';

import type { formSchema } from '@/components/post-form';
import type { z } from 'zod';

export async function createPost({
  title,
  body,
  anonymous,
  image,
  wallet,
}: z.infer<typeof formSchema>) {
  const session = await getServerSession();

  await db.insert(PostsTable).values({
    title,
    body,
    anonymous,
    image,
    wallet,
    display_name: session?.user?.name,
    email: session?.user?.email,
  });

  return { status: 'success' };
}
