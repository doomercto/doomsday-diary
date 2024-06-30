import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
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

export const ReactionsTable = pgTable(
  'reactions',
  {
    post_id: integer('post_id')
      .notNull()
      .references(() => PostsTable.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 1024 }).notNull(),
    reaction: varchar('reaction', { length: 1024 }).notNull(),
  },
  table => ({
    pk: primaryKey({ columns: [table.post_id, table.email, table.reaction] }),
  })
);

export const postsRelations = relations(PostsTable, ({ many }) => ({
  reactions: many(ReactionsTable),
}));

export const reactionsRelations = relations(ReactionsTable, ({ one }) => ({
  post: one(PostsTable, {
    fields: [ReactionsTable.post_id],
    references: [PostsTable.id],
  }),
}));
