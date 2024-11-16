import { relations } from 'drizzle-orm'
import { sqliteTable as table } from 'drizzle-orm/sqlite-core'
import * as t  from 'drizzle-orm/sqlite-core'

export const messages = table('messages', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  text: t.text().notNull(),
  createdAt: t.integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const lists = table('lists', {
  id: t.text().primaryKey().unique().notNull(),
  name: t.text().notNull(),
  createdAt: t.integer('created_at', { mode: 'timestamp' }).notNull(),
  owner: t.text().notNull(),
  currentScenario: t.text('currentScenario', {mode: 'json'})
})

export const member = table('members', {
  id: t.text().primaryKey().unique().notNull(),
  name: t.text(),
  createdAt: t.integer('created_at', { mode: 'timestamp' }).notNull(),
  clerkId: t.text()
})

export const membershipToList = table('membershipToList', {
  memberId: t.text().references(() => member.id).notNull(),
  list: t.text().references(() => lists.id),
  position: t.integer().notNull().unique(),
  exclusions: t.text('exclusions', {mode: 'json'}) // expecting a array of numbers here
})

export const listRelations = relations(lists, ({many})=>({
  membershipToList: many(membershipToList)
}))

export const membershipRelations = relations(membershipToList, ({ one })=> ({
  list: one(lists, { fields: [membershipToList.list], references: [lists.id]}),
  member: one(member, { fields: [membershipToList.memberId], references: [member.id]}),
}))
