import { desc } from "drizzle-orm"

export default eventHandler(async () => {
  const db = useDrizzle()


  // const { results } = await db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()

  const results = db.select().from(tables.messages).orderBy(desc(tables.messages.createdAt)).all()

  return results
})
