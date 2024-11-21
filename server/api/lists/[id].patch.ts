import { getAuth } from "vue-clerk/server"
import { ListInsertSchema, ListInsertShape } from '~~/shared/types/lists'
import type { InferInsertModel } from "drizzle-orm";
import { randomUUID } from 'uncrypto'
import {buildConflictUpdateColumns} from "~~/server/utils/drizzle";



export default defineEventHandler(async (evt) => {
  const { userId } = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const parse = ListInsertSchema.parse
  const result = await readValidatedBody(evt, parse)
  const { id } = getRouterParams(evt)

  const db = useDrizzle()
  const list = await  db.select().from(tables.lists).where(and(
    eq(tables.lists.owner, userId),
    eq(tables.lists.id, id)
  )).get()

  // list value
  const listValue = {
    createdAt: new Date(),
    owner: userId,
    name: result.name,
    id: id,
    currentScenario: JSON.stringify(result.currentScenario)
  } satisfies InferInsertModel<typeof tables.lists>

  // create the members
  const memberValues = result.members.map(row => {
    const memberRow = {
      name: row.name,
      id: row.id ? row.id.toString() : randomUUID(),
      createdAt: new Date()
    }

    return memberRow
  })

  const memberToListValues = memberValues.map(row => {
    const relatedMember = result.members.find(x => x.name === row.name)
    if (!(relatedMember?.position || relatedMember?.exclusions)) {
      throw createError({
        message: 'unable to relate to an existing member'
      })
    }
    return {
      memberId: row.id,
      list: id,
      position: relatedMember?.position,
      exclusions: JSON.stringify(relatedMember?.exclusions)
    }
  })

  const batchEntry = await db.batch([
    db.update(tables.lists).set({
      name: listValue.name,
      currentScenario: listValue.currentScenario,
    }).where(eq(tables.lists.id, id)),
    db.insert(tables.members).values(memberValues).onConflictDoUpdate({
      target: tables.members.id,
      set: buildConflictUpdateColumns(tables.members, ['name'])
    }),
    db.insert(tables.membershipToList).values(memberToListValues).onConflictDoUpdate({
      target: [tables.membershipToList.memberId, tables.membershipToList.list],
      set:
        buildConflictUpdateColumns(tables.membershipToList, ['position', 'exclusions', 'memberId'])

    })
  ])
  return batchEntry
})
