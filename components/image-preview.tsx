import Image from 'next/image';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

import type { Post } from '@/actions/getPosts';

export function ImagePreview({ post }: { post: Post }) {
  if (!post.image) return null;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={post.image}
          alt={post.title}
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="w-full h-auto max-h-[25rem] mx-auto cursor-pointer object-contain rounded-md"
        />
      </SheetTrigger>
      <SheetContent
        className="overflow-y-auto w-full max-w-[100svw] md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg"
        aria-describedby={undefined}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{post.title}</SheetTitle>
        </SheetHeader>
        <Image
          src={post.image}
          alt={post.title}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto p-2"
        />
      </SheetContent>
    </Sheet>
  );
}
