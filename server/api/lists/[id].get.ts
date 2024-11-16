import { getAuth } from "vue-clerk/server"
import { eq, and, getTableColumns } from 'drizzle-orm'
import type { member, membershipToList } from "~~/server/database/schema";
import { lists } from "~~/server/database/schema"
import {flattenListResponse} from "~~/server/utils/lists";

export default defineEventHandler(async (evt) => {
  const { userId } = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const { id } = getRouterParams(evt)

  const db = useDrizzle()

  const qbResult = await db.query.lists.findFirst({
    where: and(eq(lists.id, id), eq(lists.owner, userId)),
    with: {
      membershipToList: {
        with: {
          member: true
        }
      },

    }

  }).then((result) => {
    if (!result) { return undefined }
    return flattenListResponse(result)
  })

if (qbResult) {
  return qbResult
} else {
  throw createError({
    statusCode: 404,
    message: `Cannot find a match for ${id}`
  })
}
})
