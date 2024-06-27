'use server';

import { loremIpsum } from 'lorem-ipsum';
import { v4 as uuid } from 'uuid';

export interface Post {
  userId: string;
  id: string;
  title: string;
  body?: string;
  image?: string;
  display_name?: string;
  wallet?: string;
  timestamp: string;
  nft_url?: string;
}

const imgurUrls = [
  'https://i.imgur.com/f5LQpNN.jpeg',
  'https://i.imgur.com/jBA3Gt1.jpg',
  'https://i.imgur.com/DeN7zDK.jpeg',
  'https://i.imgur.com/y1dd8Z9.jpeg',
  'https://i.imgur.com/z83SjCv.gif',
  'https://i.imgur.com/9L7kXuh.jpeg',
];

let nextPostDate = new Date();

function generateMockPost(): Post {
  nextPostDate.setTime(
    nextPostDate.getTime() -
      Math.random() * 1000 * 60 * 60 * (Math.random() > 0.5 ? 0.1 : 6)
  );

  return {
    userId: uuid(),
    id: uuid(),
    title: loremIpsum({ count: 1, units: 'sentences' }),
    display_name:
      Math.random() > 0.5
        ? loremIpsum({ count: 1, units: 'words' })
        : undefined,
    body:
      Math.random() > 0.4
        ? loremIpsum({ count: 1, units: 'paragraphs' })
        : undefined,
    timestamp: nextPostDate.toISOString(),
    image:
      Math.random() > 0.7
        ? imgurUrls[Math.floor(Math.random() * imgurUrls.length)]
        : undefined,
    wallet:
      Math.random() > 0.6
        ? Math.random() > 0.5
          ? '0x1985ea6e9c68e1c272d8209f3b478ac2fdb25c87'
          : 'fe26bae1ab8376bf9e664e01493a3ae2626b64ea'
        : undefined,
  };
}

export async function getPosts({
  before = new Date().toISOString(),
}: { before?: string } = {}) {
  nextPostDate = new Date(before);

  const posts = Array.from({ length: 10 }, generateMockPost);

  return posts;
}

export async function checkNewPosts({
  after = new Date().toISOString(),
}: { after?: string } = {}) {
  return new Date(after).getTime() < new Date().getTime();
}
