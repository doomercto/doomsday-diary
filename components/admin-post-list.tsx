'use client';

import { useCallback, useState } from 'react';

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

  const handleUpdatePostStatus = useCallback(
    async (id: number, status: 'approved' | 'rejected') => {
      const success = await updatePostStatus(id, status);
      if (success) {
        toast({
          title: `Post ${status}`,
        });
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      }
    },
    []
  );

  if (!posts.length) {
    return <div className="p-4 md:p-10 text-center">No pending posts</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="bg-slate-500 rounded-lg shadow-md p-2">
          <PostCard post={post} hideReactions />
          <div className="flex items-center gap-2 m-1 md:m-2">
            <Button
              className="flex-grow"
              variant="destructive"
              onClick={() => handleUpdatePostStatus(post.id, 'rejected')}
            >
              Reject
            </Button>
            <Button
              className="flex-grow"
              variant="default"
              onClick={() => handleUpdatePostStatus(post.id, 'approved')}
            >
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
