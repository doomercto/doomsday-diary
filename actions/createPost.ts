'use server';

import { getServerSession } from 'next-auth';

import { db } from '@/drizzle/db';
import { PostsTable } from '@/drizzle/schema';
import { hashEmail } from '@/lib/server-utils';

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
    image,
    wallet,
    display_name: anonymous === false ? session?.user?.name : null,
    email: session?.user?.email ? hashEmail(session.user.email) : null,
  });

  return { status: 'success' };
}
