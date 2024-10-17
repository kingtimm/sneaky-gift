
export default eventHandler(async (event) => {
  const { text } = await readBody(event)
  const db = useDrizzle()

  await db.insert(tables.messages).values({
    text: text,
    createdAt: new Date()
  }).returning().get()

  return {}
})
