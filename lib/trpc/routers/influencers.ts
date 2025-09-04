import { z } from "zod"
import { router, protectedProcedure } from "../server"
import { TRPCError } from "@trpc/server"

export const influencersRouter = router({
  // Get all influencers (available to all authenticated users)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("influencers")
      .select("*")
      .order("follower_count", { ascending: false })

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch influencers",
      })
    }

    return data
  }),

  // Get a single influencer by ID
  getById: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase.from("influencers").select("*").eq("id", input.id).single()

    if (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Influencer not found",
      })
    }

    return data
  }),

  // Get influencers assigned to a specific campaign
  getByCampaign: protectedProcedure.input(z.object({ campaignId: z.string().uuid() })).query(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from("campaign_influencers")
      .select(`
          influencer_id,
          assigned_at,
          influencers (
            id,
            name,
            follower_count,
            engagement_rate
          )
        `)
      .eq("campaign_id", input.campaignId)

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch campaign influencers",
      })
    }

    return data.map((item) => ({
      ...item.influencers,
      assigned_at: item.assigned_at,
    }))
  }),
})
