import { pgTable, uuid, text, decimal, date, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { campaignInfluencers } from "./campaign-influencers"

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  userId: uuid("user_id").notNull(), // References auth.users(id)
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  campaignInfluencers: many(campaignInfluencers),
}))

export type Campaign = typeof campaigns.$inferSelect
export type NewCampaign = typeof campaigns.$inferInsert
