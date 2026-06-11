import { createFetchHandler } from "@/server/handler";

const handler = createFetchHandler("/api/trpc");

export { handler as GET, handler as POST };
