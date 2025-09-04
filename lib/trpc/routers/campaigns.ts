import { z } from "zod"
import { router, protectedProcedure } from "../server"
import { TRPCError } from "@trpc/server"
import { eq, and, desc } from "drizzle-orm"
import { campaigns } from "@/lib/db/schema"

const createCampaignSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  budget: z.number().positive("Budget must be positive").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const updateCampaignSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  budget: z.number().positive("Budget must be positive").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const campaignsRouter = router({
  // Get all campaigns for the authenticated user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select()
        .from(campaigns)
        .where(eq(campaigns.userId, ctx.user.id))
        .orderBy(desc(campaigns.createdAt))

      return data
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch campaigns",
      })
    }
  }),

  // Get a single campaign by ID
  getById: protectedProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db
        .select()
        .from(campaigns)
        .where(and(eq(campaigns.id, input.id), eq(campaigns.userId, ctx.user.id)))
        .limit(1)

      if (data.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        })
      }

      return data[0]
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch campaign",
      })
    }
  }),

  // Create a new campaign
  create: protectedProcedure.input(createCampaignSchema).mutation(async ({ ctx, input }) => {
    const { data, error } = await ctx.supabase
      .from("campaigns")
      .insert({
        ...input,
        user_id: ctx.user.id,
        start_date: input.startDate || null,
        end_date: input.endDate || null,
      })
      .select()
      .single()

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create campaign",
      })
    }

    return data
  }),

  // Update a campaign
  update: protectedProcedure.input(updateCampaignSchema).mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input

    const { data, error } = await ctx.supabase
      .from("campaigns")
      .update({
        ...updateData,
        start_date: updateData.startDate || undefined,
        end_date: updateData.endDate || undefined,
      })
      .eq("id", id)
      .eq("user_id", ctx.user.id)
      .select()
      .single()

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update campaign",
      })
    }

    return data
  }),

  // Delete a campaign
  delete: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    const { error } = await ctx.supabase.from("campaigns").delete().eq("id", input.id).eq("user_id", ctx.user.id)

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete campaign",
      })
    }

    return { success: true }
  }),
})
