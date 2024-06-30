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

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    await Promise.race([
      fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: `📢 New post to approve: ${title}`,
          }),
        }
      ).catch(() => {}),
      new Promise(resolve => setTimeout(resolve, 5000)),
    ]);
  }

  return { status: 'success' };
}
