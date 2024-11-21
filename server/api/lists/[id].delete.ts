import {getAuth} from "vue-clerk/server";
import { z } from "zod";

export default defineEventHandler(async (evt) => {
  const { userId } = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const ListDeleteShape = z.object({'id': z.string()})

  const parse = ListDeleteShape.parse
  const result = await readValidatedBody(evt, parse)
  const { id } = getRouterParams(evt)

  return deleteList(id, userId)
})
