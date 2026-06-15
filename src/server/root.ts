import { healthRouter } from "./routers/health";
import { resumeRouter } from "./routers/resume";
import { transactionRouter } from "./routers/transaction";
import { usageRouter } from "./routers/usage";
import { router } from "./trpc";

export const appRouter = router({
  health: healthRouter,
  resume: resumeRouter,
  transaction: transactionRouter,
  usage: usageRouter,
});

export type AppRouter = typeof appRouter;
