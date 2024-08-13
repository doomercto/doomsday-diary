'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LoaderCircle } from 'lucide-react';

import { getErrorMessage } from '@/lib/utils';
import { getPostsByIds as getPostsByIdsRaw } from '@/actions/getPosts';

import { toast } from './ui/use-toast';
import PostCard from './post-card';

import type { Post } from '@/actions/getPosts';

async function getPostsByIds(...args: Parameters<typeof getPostsByIdsRaw>) {
  try {
    const posts = await getPostsByIdsRaw(...args);
    return posts;
  } catch (err) {
    toast({
      title: 'Failed to fetch posts',
      description: getErrorMessage(err),
      variant: 'destructive',
    });
    return [];
  }
}

const BATCH_SIZE = 10;

export default function TopPostList({ postIds }: { postIds: number[] }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref: bottomRef, inView: bottomInView } = useInView();

  const loadMore = async () => {
    const newPosts = await getPostsByIds({
      postIds: postIds.slice(loaded, loaded + BATCH_SIZE),
    });
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setShowLoading(false);
    setLoaded(prevLoaded => prevLoaded + BATCH_SIZE);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (bottomInView && loaded < postIds.length && !loading) {
      setShowLoading(true);
      setLoading(true);
      loadMore();
    }
  }, [bottomInView, loaded, postIds.length, loading]);

  if (postIds.length === 0) {
    return <div className="p-4 md:p-10 text-center">No posts to display</div>;
  }

  return (
    <>
      <div className="flex flex-col">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="h-12 mb-0 md:mb-4">
        {showLoading && (
          <LoaderCircle className="animate-spin h-12 w-12 mx-auto" />
        )}
      </div>
    </>
  );
}
