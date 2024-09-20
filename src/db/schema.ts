// src/db/schema.ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  priority: string;
  createdAt: string;
  updatedAt: string;
};

export type NewTask = {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
};

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  dueDate: text('due_date').notNull(),
  isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
  priority: text('priority').notNull().default('Medium'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// export type Task = typeof tasks.$inferSelect;
// export type NewTask = typeof tasks.$inferInsert;