import { sqliteTable as table , AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import * as t  from 'drizzle-orm/sqlite-core'

export const messages = table('messages', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  text: t.text().notNull(),
  createdAt: t.integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const lists = table('lists', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  createdAt: t.integer('created_at', { mode: 'timestamp' }).notNull(),
  owner: t.text().notNull(),
})
