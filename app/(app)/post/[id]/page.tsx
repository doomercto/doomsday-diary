import Link from 'next/link';

import { getPost } from '@/actions/getPosts';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/post-card';
import { metadata } from '@/app/layout';

import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return metadata;
  }

  let post;
  try {
    post = await getPost(id);
    if (!post?.title) {
      throw new Error('Post not found');
    }
  } catch (error) {
    return metadata;
  }

  return {
    ...metadata,
    title: metadata.title ? `${post.title} | ${metadata.title}` : post.title,
    openGraph: {
      ...metadata.openGraph,
      title: metadata.openGraph?.title
        ? `${post.title} | ${metadata.openGraph.title}`
        : post.title,
      url: `https://diary.doomercto.xyz/post/${id}`,
      images: post.image ? [post.image] : metadata.openGraph?.images,
    },
    twitter: {
      ...metadata.twitter,
      title: metadata.twitter?.title
        ? `${post.title} | ${metadata.twitter.title}`
        : post.title,
      images: post.image ? [post.image] : metadata.twitter?.images,
    },
  };
}

const NotFound = () => (
  <div className="p-4 md:p-8 max-w-6xl 2xl:max-w-7xl self-center text-center space-y-4">
    <h1 className="font-semibold text-2xl min-[375px]:text-3xl md:text-4xl">
      Post not found
    </h1>
    <div>
      <Button asChild>
        <Link href="/feed">Feed</Link>
      </Button>
    </div>
  </div>
);

export default async function Post({ params }: Props) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return <NotFound />;
  }

  let post;
  try {
    post = await getPost(id);
    if (!post) {
      throw new Error('Post not found');
    }
  } catch (error) {
    return <NotFound />;
  }

  return (
    <div className="p-4 md:p-10 md:pt-2 lg:pt-4 mb-12 max-w-6xl 2xl:max-w-7xl w-full self-center">
      <small>
        <Link
          className="p-1 m-3 text-muted-foreground transition-colors hover:text-foreground"
          href="/feed"
        >
          ← Back to feed
        </Link>
      </small>
      <PostCard post={post} truncate={false} />
    </div>
  );
}
