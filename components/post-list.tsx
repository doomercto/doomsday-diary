'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LoaderCircle } from 'lucide-react';

import {
  checkNewPosts as checkNewPostsRaw,
  getPosts as getPostsRaw,
  type Post,
} from '@/actions/getPosts';
import { getErrorMessage } from '@/lib/utils';

import PostCard from './post-card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

async function checkNewPosts(...args: Parameters<typeof checkNewPostsRaw>) {
  try {
    const newPosts = await checkNewPostsRaw(...args);
    return newPosts;
  } catch (error) {
    return false;
  }
}

async function getPosts(...args: Parameters<typeof getPostsRaw>) {
  try {
    const posts = await getPostsRaw(...args);
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

export default function PostList() {
  const topRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState([] as Post[]);
  const [showLoading, setShowLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNew, setHasNew] = useState(false);
  const { ref: bottomRef, inView: bottomInView } = useInView();

  const loadMore = async () => {
    const oldestTimestamp = posts[posts.length - 1]?.timestamp;
    const newPosts = await getPosts({ before: oldestTimestamp });
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    }
    setShowLoading(false);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (bottomInView && hasMore && !loading) {
      setShowLoading(true);
      setLoading(true);
      loadMore();
    }
  }, [bottomInView, hasMore, loading]);

  const firstPost = posts[0];

  useEffect(() => {
    if (!firstPost || hasNew) {
      return () => {};
    }
    const id = setInterval(
      async () => {
        const newPosts = await checkNewPosts({ after: firstPost.timestamp });
        setHasNew(newPosts);
      },
      1000 * 60 * 2
    );

    return () => clearInterval(id);
  }, [firstPost, hasNew]);

  return (
    <>
      <div ref={topRef} className="relative -top-16" />
      {hasNew && (
        <div className="flex flex-col items-center sticky top-20">
          <Button
            className="backdrop-blur-lg m-1 md:m-2 shadow-2xl z-20"
            onClick={async () => {
              setHasNew(false);
              topRef.current?.scrollIntoView({ behavior: 'smooth' });
              const newPosts = await getPosts();
              setPosts(newPosts);
            }}
          >
            New posts
          </Button>
        </div>
      )}
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
