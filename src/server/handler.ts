import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "./root";
import { createContext } from "./trpc";

export const trpcHandlerOptions = {
  router: appRouter,
  createContext,
};

export function createFetchHandler(endpoint: string) {
  return (req: Request) =>
    fetchRequestHandler({
      endpoint,
      req,
      router: appRouter,
      createContext,
    });
}
