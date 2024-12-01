import {membershipToList} from "~~/server/database/schema";
import {getAuth} from "vue-clerk/server";
import { useDrizzle, and, eq, tables } from "~~/server/utils/drizzle";


export default defineEventHandler(async (evt) => {

  const {list, member } = getRouterParams(evt)

  const db = useDrizzle()

  const result = await db.select().from(tables.membershipToList).where(
  and(
    eq(membershipToList.list, list),
    eq(membershipToList.memberId, member)
  )
  ).innerJoin(tables.lists, eq(tables.membershipToList.list, tables.lists.id)).innerJoin(tables.members, eq(tables.members.id, tables.membershipToList.memberId)).get()

  if (!result && !result.lists) {
    throw createError({
      status: 400,
      statusText: "Something went wrong"
    });

  }

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
      list: result.lists.name,
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
