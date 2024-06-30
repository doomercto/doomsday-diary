'use server';

import { getPendingPosts, isAdmin } from '@/actions/admin';
import AdminPostList from '@/components/admin-post-list';

export default async function Admin() {
  const admin = await isAdmin();

  if (!admin) {
    return <div className="p-4 md:p-10 text-center">Not an admin</div>;
  }

  const pendingPosts = await getPendingPosts();

  return (
    <div className="p-4 md:p-10">
      <AdminPostList posts={pendingPosts} />
    </div>
  );
}
