import { z } from "zod"
import { router, protectedProcedure } from "../server"
import { TRPCError } from "@trpc/server"
import { eq, desc } from "drizzle-orm"
import { influencers, campaignInfluencers } from "@/lib/db/schema"

export const influencersRouter = router({
  // Get all influencers (available to all authenticated users)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select()
        .from(influencers)
        .orderBy(desc(influencers.followerCount))

      return data
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch influencers",
      })
    }
  }),

  // Get a single influencer by ID
  getById: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db
        .select()
        .from(influencers)
        .where(eq(influencers.id, input.id))
        .limit(1)

      if (data.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Influencer not found",
        })
      }

      return data[0]
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch influencer",
      })
    }
  }),

  // Get influencers assigned to a specific campaign
  getByCampaign: protectedProcedure.input(z.object({ campaignId: z.string().uuid() })).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db
        .select({
          id: influencers.id,
          name: influencers.name,
          followerCount: influencers.followerCount,
          engagementRate: influencers.engagementRate,
          assignedAt: campaignInfluencers.assignedAt,
        })
        .from(campaignInfluencers)
        .innerJoin(influencers, eq(campaignInfluencers.influencerId, influencers.id))
        .where(eq(campaignInfluencers.campaignId, input.campaignId))

      return data.map((item) => ({
        id: item.id,
        name: item.name,
        follower_count: item.followerCount,
        engagement_rate: item.engagementRate,
        assigned_at: item.assignedAt,
      }))
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch campaign influencers",
      })
    }
  }),
})
