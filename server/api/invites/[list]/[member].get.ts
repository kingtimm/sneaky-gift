import {membershipToList} from "~~/server/database/schema";
import {getAuth} from "vue-clerk/server";

export default defineEventHandler(async (evt) => {
  const {userId} = getAuth(evt)

  if (!userId) {
    setResponseStatus(evt, 401)
    return
  }

  const {list, member } = getRouterParams(evt)

  const db = useDrizzle()

  const result = await db.select().from(tables.membershipToList).where(
  and(
    eq(membershipToList.list, list),
    eq(membershipToList.member, member)
  )
  ).innerJoin(tables.lists, eq(tables.membershipToList.list, tables.lists.id)).where(eq(tables.lists.owner, userId)).innerJoin(tables.members, eq(tables.members.id, tables.membershipToList.memberId)).get()

  const currentScenario = JSON.parse(result.lists.currentScenario)
  const pairedMemberPosition = currentScenario[result.membershipToList.position]
  console.log('pairedmember', pairedMemberPosition)
  const pairedMember = await db.select().from(tables.membershipToList).where(
    and(
      eq(membershipToList.list, list),
      eq(membershipToList.position, pairedMemberPosition)
    )
  ).innerJoin(tables.members, eq(tables.membershipToList.memberId, tables.members.id)).get()

  if (pairedMember) {
    return {
      from: result.members,
      to: pairedMember.members
    }
  } else {
    throw createError({
      statusCode: 404,
      message: `Cannot find a match`
    })
  }
})
