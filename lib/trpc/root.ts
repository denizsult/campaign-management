import { router } from "./server"
import { campaignsRouter } from "./routers/campaigns"
import { influencersRouter } from "./routers/influencers"
import { assignmentsRouter } from "./routers/assignments"

export const appRouter = router({
  campaigns: campaignsRouter,
  influencers: influencersRouter,
  assignments: assignmentsRouter,
})

export type AppRouter = typeof appRouter
