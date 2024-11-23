import { createInsertSchema } from "drizzle-zod";
import * as schema from "~~/server/database/schema"
import { z } from 'zod'

export const ListInsertShape = createInsertSchema(schema.lists)

export type ListInsertType = z.infer<typeof ListInsertShape>

export const ListMemberZSchema = z.object({
  name: z.string()
    .min(1, "Name must be at least 1 character")
    .max(35, "Name must be fewer than 36 Characters"),
  exclusions: z.array(z.number()),
  id: z.string().optional()
})

export const StateZSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be fewer than 30 characters"),
  id: z.string().optional(),
  suggestedSpend: z.number(),
  members: z.array(ListMemberZSchema).refine(items => new Set(items).size === items.length, { message: "Must be a unique name" })
})
export type InputStateSchema = z.output<typeof StateZSchema>

export const ExclusionRowSchema = z.array(
  z.array(z.number()).length(2))
  // .refine(
  //   items => new Set(items).size === items.length,
  //   { message: "Must not already be a rule for this" })
  .refine(items => {
    for (const pair of items) {
      if (typeof pair[0] === 'number' && typeof pair[1] === 'number') {
        return pair[0] !== pair[1]}
    }
  }, { message: "Secret Santa already prevents self-gifting" })


  export const MemberInsertSchema = z.object({
    position: z.number(),
    id: z.string().optional()
  }).merge(ListMemberZSchema.pick({'name': true, 'exclusions': true}))

  export const ListInsertSchema = ListInsertShape.pick({name: true}).merge(z.object({
    members: z.array(MemberInsertSchema),
    createdDate: z.date().optional(),
    currentScenario: z.array(z.number())
  }))

  export type ListInsertSchemaType = z.infer<typeof ListInsertSchema>
  export type MemberInsertSchemaType = z.infer<typeof MemberInsertSchema>
