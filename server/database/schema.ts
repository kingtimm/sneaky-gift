import {relations} from 'drizzle-orm'
import {primaryKey, sqliteTable as table} from 'drizzle-orm/sqlite-core'
import * as t from 'drizzle-orm/sqlite-core'

export const lists = table('lists', {
  id: t.text().primaryKey().unique().notNull(),
  name: t.text().notNull(),
  createdAt: t.integer('created_at', {mode: 'timestamp'}).notNull(),
  owner: t.text().notNull(),
  currentScenario: t.text('currentScenario', {mode: 'json'})
})

export const members = table('members', {
  id: t.text().primaryKey().unique().notNull(),
  name: t.text(),
  createdAt: t.integer('created_at', {mode: 'timestamp'}).notNull(),
  clerkId: t.text()
})

export const membershipToList = table('membershipToList', {
  memberId: t.text().references(() => members.id, { onDelete: "cascade"}).notNull(),
  list: t.text().references(() => lists.id, { onDelete: "cascade"}),
  position: t.integer().notNull(),
  exclusions: t.text('exclusions', {mode: 'json'})
}, (tlocal) => { return {
  pk: primaryKey({columns: [tlocal.memberId, tlocal.list]})
}}) // expecting a array of numbers here

export const listRelations = relations(lists, ({many}) => ({
  membershipToList: many(membershipToList)
}))

export const membershipRelations = relations(membershipToList, ({one}) => ({
  list: one(lists, {fields: [membershipToList.list], references: [lists.id]}),
  member: one(members, {fields: [membershipToList.memberId], references: [members.id]}),
}))
