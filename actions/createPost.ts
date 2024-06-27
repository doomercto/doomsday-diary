'use server';

import type { z } from 'zod';
import type { formSchema } from '@/components/post-form';

export async function createPost({
  title,
  description,
  anonymous,
  image,
}: z.infer<typeof formSchema>) {
  return { status: 'success', title, description, anonymous, image };
}
