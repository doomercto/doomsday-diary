import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const postStatusEnum = pgEnum('post_status', [
  'pending',
  'approved',
  'rejected',
]);

export const PostsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  body: varchar('body', { length: 2048 }),
  display_name: varchar('display_name', { length: 1024 }),
  email: varchar('email', { length: 1024 }),
  image: varchar('image', { length: 1024 }),
  nft_url: varchar('nft_url', { length: 1024 }),
  status: postStatusEnum('status').default('pending').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  wallet: varchar('wallet', { length: 1024 }),
});

export const AdminsTable = pgTable('admins', {
  email: varchar('email', { length: 1024 }).primaryKey(),
  nickname: varchar('nickname', { length: 1024 }).notNull(),
});
