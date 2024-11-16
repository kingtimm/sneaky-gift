import {getAuth} from "vue-clerk/server"
import {membershipToList} from "~~/server/database/schema";
import {flattenListResponse} from "~~/server/utils/lists";

export default defineEventHandler(async (evt) => {
  const {userId} = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const results = useDrizzle().query.lists.findMany({
    where: eq(tables.lists.owner, userId),
    with: {
      membershipToList: {
        with: {
          member: true
        }
      }
    }
  }).then((result) => {
    return result.map( row => {
      const listRow = {...flattenListResponse(row), members: row.membershipToList.length}
      return listRow
    })
  })



  return results

})
