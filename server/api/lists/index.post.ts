import { getAuth } from "vue-clerk/server"
import { ListInsertSchema, ListInsertShape } from '~~/shared/types/lists'
import type { InferInsertModel } from "drizzle-orm";
import { randomUUID } from 'uncrypto'
import { useDrizzle, eq, tables } from "~~/server/utils/drizzle";


export default defineEventHandler(async (evt) => {
  const { userId } = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const parse = ListInsertSchema.parse
  const result = await readValidatedBody(evt, parse)

  const listValue = {
    createdAt: new Date(),
    owner: userId,
    name: result.name,
    id: randomUUID(),
    currentScenario: JSON.stringify(result.currentScenario)
  } satisfies InferInsertModel<typeof tables.lists>


  // create the members
  const memberValues = result.members.map(row => {
    return {
      name: row.name,
      id: randomUUID(),
      createdAt: new Date()
    }
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
      list: listValue.id,
      position: relatedMember?.position,
      exclusions: JSON.stringify(relatedMember?.exclusions)
    }
  })

  const db = useDrizzle()
  const batchEntry = db.batch([
    db.insert(tables.lists).values(listValue).returning(),
    db.insert(tables.members).values(memberValues).returning(),
    db.insert(tables.membershipToList).values(memberToListValues).returning()
  ])
  return batchEntry
})
