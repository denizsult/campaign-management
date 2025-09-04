import { z } from "zod"
import { router, protectedProcedure } from "../server"
import { TRPCError } from "@trpc/server"

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
      // First, verify the campaign belongs to the user
      const { data: campaign, error: campaignError } = await ctx.supabase
        .from("campaigns")
        .select("id")
        .eq("id", input.campaignId)
        .eq("user_id", ctx.user.id)
        .single()

      if (campaignError || !campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found or access denied",
        })
      }

      // Assign the influencer to the campaign
      const { data, error } = await ctx.supabase
        .from("campaign_influencers")
        .insert({
          campaign_id: input.campaignId,
          influencer_id: input.influencerId,
        })
        .select()
        .single()

      if (error) {
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

      return data
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
      // First, verify the campaign belongs to the user
      const { data: campaign, error: campaignError } = await ctx.supabase
        .from("campaigns")
        .select("id")
        .eq("id", input.campaignId)
        .eq("user_id", ctx.user.id)
        .single()

      if (campaignError || !campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found or access denied",
        })
      }

      // Remove the assignment
      const { error } = await ctx.supabase
        .from("campaign_influencers")
        .delete()
        .eq("campaign_id", input.campaignId)
        .eq("influencer_id", input.influencerId)

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unassign influencer",
        })
      }

      return { success: true }
    }),
})
