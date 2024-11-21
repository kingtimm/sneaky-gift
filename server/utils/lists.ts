import {lists, type members, type membershipToList} from "~~/server/database/schema";

type List = typeof lists.$inferSelect
type MembershipToList = typeof membershipToList.$inferSelect
type Member = typeof members.$inferSelect

type Input = List & {
  membershipToList: (MembershipToList & {
    member: Member
  })[]
}


export function flattenListResponse(input: Input) {
  const { membershipToList, ...rest } = input

  return {
    ...rest,
    members: input.membershipToList.map((row) => {
      return {
        name: row.member.name,
        id: row.member.id,
        exclusions: row.exclusions,
        position: row.position,
      }
    })
  }
}

export function deleteList(id: string, owner: string) {
  const db = useDrizzle()
  return db.delete(tables.lists).where(and(eq(tables.lists.id, id), eq(tables.lists.owner, owner))).returning()
}
