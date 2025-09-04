import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { campaigns } from "./campaigns"
import { influencers } from "./influencers"

export const campaignInfluencers = pgTable("campaign_influencers", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  influencerId: uuid("influencer_id").notNull().references(() => influencers.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  uniqueCampaignInfluencer: unique().on(table.campaignId, table.influencerId),
}))

export const campaignInfluencersRelations = relations(campaignInfluencers, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignInfluencers.campaignId],
    references: [campaigns.id],
  }),
  influencer: one(influencers, {
    fields: [campaignInfluencers.influencerId],
    references: [influencers.id],
  }),
}))

export type CampaignInfluencer = typeof campaignInfluencers.$inferSelect
export type NewCampaignInfluencer = typeof campaignInfluencers.$inferInsert
