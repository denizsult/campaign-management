import { pgTable, uuid, text, integer, decimal, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { campaignInfluencers } from "./campaign-influencers"

export const influencers = pgTable("influencers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  followerCount: integer("follower_count").notNull().default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const influencersRelations = relations(influencers, ({ many }) => ({
  campaignInfluencers: many(campaignInfluencers),
}))

export type Influencer = typeof influencers.$inferSelect
export type NewInfluencer = typeof influencers.$inferInsert
