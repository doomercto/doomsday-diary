import PostList from '@/components/post-list';

export function generateStaticParams() {
  return [{ recent: ['recent'] }, { recent: [] }];
}

export const dynamicParams = false;

export default function RecentFeed() {
  return <PostList />;
}
