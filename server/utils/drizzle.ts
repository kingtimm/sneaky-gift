import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../database/schema'
import { SQLiteTable } from 'drizzle-orm/sqlite-core'
import { getTableColumns, SQL, sql } from 'drizzle-orm'
export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

export const buildConflictUpdateColumns = <
  T extends SQLiteTable,
  Q extends keyof T['_']['columns']
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);
    return acc;
  }, {} as Record<Q, SQL>);
};
