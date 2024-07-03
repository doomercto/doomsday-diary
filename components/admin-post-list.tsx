'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { updatePostStatus as updatePostStatusRaw } from '@/actions/admin';
import { getErrorMessage } from '@/lib/utils';

import PostCard from './post-card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

import type { Post } from '@/actions/getPosts';

async function updatePostStatus(
  ...args: Parameters<typeof updatePostStatusRaw>
) {
  try {
    const result = await updatePostStatusRaw(...args);
    if (!result?.success) {
      throw new Error();
    }
    return true;
  } catch (err) {
    toast({
      title: 'Failed to update post status',
      description: getErrorMessage(err),
      variant: 'destructive',
    });
    return false;
  }
}

export default function AdminPostList({
  posts: initialPosts,
}: {
  posts: Post[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  const handleUpdatePostStatus = useCallback(
    async (id: number, status: 'approved' | 'rejected') => {
      setLoading(true);
      const success = await updatePostStatus(id, status);
      if (success) {
        toast({
          title: `Post ${status}`,
        });
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      }
      setLoading(false);
    },
    []
  );

  return (
    <AnimatePresence mode="popLayout">
      {posts.map(post => (
        <motion.div
          layout
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'tween' }}
          key={post.id}
          className="bg-slate-500 rounded-lg shadow-md p-2 mb-4 md:mb-6"
        >
          <PostCard post={post} hideReactions />
          <div className="flex items-center gap-2 m-1 md:m-2">
            <Button
              className="flex-grow"
              disabled={loading}
              variant="destructive"
              onClick={() => handleUpdatePostStatus(post.id, 'rejected')}
            >
              Reject
            </Button>
            <Button
              className="flex-grow"
              disabled={loading}
              variant="default"
              onClick={() => handleUpdatePostStatus(post.id, 'approved')}
            >
              Approve
            </Button>
          </div>
        </motion.div>
      ))}
      {!posts.length && (
        <motion.div
          layout
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'tween' }}
          className="p-4 md:p-10 text-center"
        >
          No pending posts
        </motion.div>
      )}
    </AnimatePresence>
  );
}
