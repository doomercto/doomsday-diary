'use server';

import { getServerSession } from 'next-auth';

import { db } from '@/drizzle/db';
import { PostsTable } from '@/drizzle/schema';
import { hashEmail, sendTelegramMessage } from '@/lib/server-utils';

import type { formSchema } from '@/components/post-form';
import type { z } from 'zod';

export async function createPost({
  title,
  body,
  anonymous,
  image,
  wallet,
  display_name,
}: z.infer<typeof formSchema>) {
  const session = await getServerSession();

  if (!display_name || !session?.user?.email) {
    anonymous = true;
  }
  if (anonymous !== false) {
    display_name = undefined;
  }

  await db.insert(PostsTable).values({
    title,
    body,
    image,
    wallet,
    display_name: anonymous === false ? display_name : null,
    email: session?.user?.email ? hashEmail(session.user.email) : null,
  });

  await sendTelegramMessage({
    chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
    text: `📢 New post to approve: ${title}`,
  }).catch(err => {
    console.warn('Failed to send message to Telegram:', err.message || err);
  });

  return { status: 'success' };
}
