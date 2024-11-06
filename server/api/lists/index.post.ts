import { getAuth } from "vue-clerk/server"
import { ListInsertShape} from '~~/shared/types/lists'
import type { InferInsertModel} from "drizzle-orm";

export default defineEventHandler( async (evt) => {
  const {userId} = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const parse = ListInsertShape.pick({name: true}).parse
  const result = await readValidatedBody(evt, parse)
  console.log('test ', result)

  const vals = {
    createdAt: new Date(),
    owner: userId,
    name: result.name,
  } satisfies InferInsertModel<typeof tables.lists>

  return await useDrizzle().insert(tables.lists).values(vals)

})