import { createInsertSchema } from "drizzle-zod";
import * as schema from "~~/server/database/schema"
import type { z } from 'zod'

export const ListInsertShape = createInsertSchema(schema.lists)

export type ListInsertType = z.infer<typeof ListInsertShape>