import { healthRouter } from "./routers/health";
import { resumeRouter } from "./routers/resume";
import { usageRouter } from "./routers/usage";
import { router } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  resume: resumeRouter,
  usage: usageRouter,
});

export type AppRouter = typeof appRouter;