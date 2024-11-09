import { sqliteTable as table } from 'drizzle-orm/sqlite-core'
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

export const member = table('members', {
  id: t.text().primaryKey().unique().notNull(),
  name: t.text(),
  createdAt: t.integer('created_at', { mode: 'timestamp' }).notNull(),
  clerkId: t.text().primaryKey()
})

export const membershipToList = table('membershipToList', {
  memberId: t.text().references(() => member.id),
  list: t.text().references(() => lists.id),
  position: t.integer().notNull().unique(),
  exclusions: t.text('exclusions', {mode: 'json'}) // expecting a array of numbers here
})

export const scenario = table('scenario', {
  id: t.text().primaryKey().unique().notNull(),
  active: t.integer(),
  list: t.integer().references(()=>lists.id)
})

export const memberPair = table('memberPair', {
  gifter: t.text().references(()=>member.id),
  giftee: t.text().references(()=>member.id),
  scenario: t.text().references(()=>scenario.id)
}, (table) => {
  return {
    pk: t.primaryKey({columns: [table.giftee, table.gifter, table.scenario]})
  }
})