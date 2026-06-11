import { z } from "zod";

import { publicProcedure, router } from "../trpc";

const healthCheckOutputSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
});

export type HealthCheckOutput = z.infer<typeof healthCheckOutputSchema>;

export const healthRouter = router({
  check: publicProcedure.output(healthCheckOutputSchema).query((): HealthCheckOutput => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),
});
