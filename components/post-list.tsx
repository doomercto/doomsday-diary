'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
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
  const top = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState([] as Post[]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasNew, setHasNew] = useState(false);
  const { ref: ref1, inView: inView1 } = useInView();
  const { ref: ref2, inView: inView2 } = useInView();
  const { ref: ref3, inView: inView3 } = useInView();

  const loadMore = async () => {
    const oldestTimestamp = posts[posts.length - 1]?.timestamp;
    const newPosts = await getPosts({ before: oldestTimestamp });
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    if ((inView1 || inView2 || inView3) && hasMore && !loading) {
      setLoading(true);
      loadMore();
    }
  }, [inView1, inView2, inView3, hasMore, loading]);

  const firstPost = posts[0];

  useEffect(() => {
    if (!firstPost || hasNew) {
      return () => {};
    }
    const id = setInterval(async () => {
      const newPosts = await checkNewPosts({ after: firstPost.timestamp });
      setHasNew(newPosts);
    }, 1000 * 60);

    return () => clearInterval(id);
  }, [firstPost, hasNew]);

  return (
    <>
      <div ref={top} className="relative -top-16" />
      {hasNew && (
        <div className="flex flex-col items-center sticky top-20">
          <Button
            className="backdrop-blur-lg m-1 md:m-2 shadow-2xl z-20"
            onClick={async () => {
              setHasNew(false);
              top.current?.scrollIntoView({ behavior: 'smooth' });
              const newPosts = await getPosts();
              setPosts(newPosts);
            }}
          >
            New posts
          </Button>
        </div>
      )}
      {loading && !posts.length && (
        <LoaderCircle className="animate-spin h-12 w-12 mx-auto" />
      )}
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1 }}>
        <Masonry>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          <div ref={ref1} className="grow" />
          <div ref={ref2} className="grow" />
          <div ref={ref3} className="grow" />
        </Masonry>
      </ResponsiveMasonry>
    </>
  );
}
