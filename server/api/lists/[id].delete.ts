import {getAuth} from "vue-clerk/server";
import { z } from "zod";
import {deleteList} from "~~/server/utils/lists";

export default defineEventHandler(async (evt) => {
  const { userId } = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const ListDeleteShape = z.object({'id': z.string()})

  const parse = ListDeleteShape.parse
  const {id} = await getValidatedRouterParams(evt, parse)

  return deleteList(id, userId)
})
