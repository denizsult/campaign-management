import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema/*",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  // Supabase specific settings
  schemaFilter: ["public", "auth"],
  tablesFilter: ["!*_realtime_*"],
})
