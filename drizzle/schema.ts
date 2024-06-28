import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const PostsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  anonymous: boolean('anonymous').default(false).notNull(),
  body: varchar('body', { length: 1024 }),
  display_name: varchar('display_name', { length: 1024 }),
  email: varchar('email', { length: 1024 }),
  image: varchar('image', { length: 1024 }),
  nft_url: varchar('nft_url', { length: 1024 }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  wallet: varchar('wallet', { length: 1024 }),
});
