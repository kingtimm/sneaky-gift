import { z } from 'zod'
import { getPossibility, getTotalPossibilites } from '../utils/matching';

export default defineEventHandler(async (event) => {
  const MemberListShape = z.object(
    {
      memberList: z.array(z.number()).refine((items) => new Set(items).size === items.length, {
        message: 'All items must be unique, no duplicate values allowed',
      }),
      exclusions: z.array(z.array(z.number()).length(2))
    })

  const { memberList, exclusions } = await readValidatedBody(event, MemberListShape.parse)

  return {
    total: getTotalPossibilites(memberList, exclusions),
    possibility: getPossibility(memberList, exclusions)
  }

})
