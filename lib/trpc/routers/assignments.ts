import { z } from "zod"
import { router, protectedProcedure } from "../server"
import { TRPCError } from "@trpc/server"
import { eq, and } from "drizzle-orm"
import { campaigns, campaignInfluencers } from "@/lib/db/schema"

export const assignmentsRouter = router({
  // Assign an influencer to a campaign
  assign: protectedProcedure
    .input(
      z.object({
        campaignId: z.string().uuid(),
        influencerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First, verify the campaign belongs to the user
        const campaign = await ctx.db
          .select({ id: campaigns.id })
          .from(campaigns)
          .where(and(eq(campaigns.id, input.campaignId), eq(campaigns.userId, ctx.user.id)))
          .limit(1)

        if (campaign.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found or access denied",
          })
        }

        // Assign the influencer to the campaign
        const data = await ctx.db
          .insert(campaignInfluencers)
          .values({
            campaignId: input.campaignId,
            influencerId: input.influencerId,
          })
          .returning()

        return data[0]
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error
        }
        if (error.code === "23505") {
          // Unique constraint violation
          throw new TRPCError({
            code: "CONFLICT",
            message: "Influencer is already assigned to this campaign",
          })
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to assign influencer",
        })
      }
    }),

  // Remove an influencer from a campaign
  unassign: protectedProcedure
    .input(
      z.object({
        campaignId: z.string().uuid(),
        influencerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First, verify the campaign belongs to the user
        const campaign = await ctx.db
          .select({ id: campaigns.id })
          .from(campaigns)
          .where(and(eq(campaigns.id, input.campaignId), eq(campaigns.userId, ctx.user.id)))
          .limit(1)

        if (campaign.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Campaign not found or access denied",
          })
        }

        // Remove the assignment
        const data = await ctx.db
          .delete(campaignInfluencers)
          .where(
            and(
              eq(campaignInfluencers.campaignId, input.campaignId),
              eq(campaignInfluencers.influencerId, input.influencerId)
            )
          )
          .returning()

        if (data.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignment not found",
          })
        }

        return { success: true }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unassign influencer",
        })
      }
    }),
})
