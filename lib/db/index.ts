import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Supabase PostgreSQL connection
const connectionString = process.env.NEXT_DATABASE_URL!


if (!process.env.NEXT_DATABASE_URL) {
  throw new Error("Database URL is required")
}

// Create connection optimized for Supabase
const client = postgres(connectionString, { 
  prepare: false, // Required for Supabase
  max: 10, // Connection pool size
  ssl: 'require', // SSL required for Supabase
  connection: {
    options: `--search_path=public,auth`,
  },
})

export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === "development"
})

export type Database = typeof db
export { schema }
