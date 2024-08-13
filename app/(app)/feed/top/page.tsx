import TopPostList from '@/components/top-post-list';
import { getTopPostIds as getTopPostIdsRaw } from '@/actions/getPosts';

async function getTopPostIds(...args: Parameters<typeof getTopPostIdsRaw>) {
  try {
    const postIds = await getTopPostIdsRaw(...args);
    return postIds;
  } catch (err) {
    return [];
  }
}

export default async function TopFeed() {
  const topPostIds = await getTopPostIds();
  return <TopPostList postIds={topPostIds} />;
}
