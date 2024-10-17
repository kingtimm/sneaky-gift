import { getAuth } from "vue-clerk/server"

export default defineEventHandler( async (evt) => {
  const {userId} = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  return await useDrizzle().select().from(tables.lists).all()

})