import { redirect } from "next/navigation";

import { TemplatesComingSoon } from "@/features/tailoring/components/templates-coming-soon";
import { getServerSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/dashboard/templates")}`);
  }

  return <TemplatesComingSoon user={session.user} />;
}
