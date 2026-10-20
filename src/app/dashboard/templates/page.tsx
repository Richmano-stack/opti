import { redirect } from "next/navigation";

import { TemplateGallery } from "@/features/tailoring/components/template-gallery";
import { ACCOUNT_HOME } from "@/features/auth/lib/callback-url";
import { getServerSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export default async function ChooseTemplatePage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(ACCOUNT_HOME)}`);
  }

  return <TemplateGallery user={session.user} />;
}
