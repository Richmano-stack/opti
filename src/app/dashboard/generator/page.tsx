import { redirect } from "next/navigation";

import { AccountGeneratorSetupRequired } from "@/features/tailoring/components/account-generator-setup-required";
import { ResumeStudio } from "@/features/tailoring/components/studio/resume-studio";
import { getServerSession } from "@/server/auth/session";
import { findMasterResumeByUserId } from "@/features/master-resume/lib";
import { isTemplateId, type TemplateId } from "@/templates/registry";

export const dynamic = "force-dynamic";

export default async function AccountGeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string | string[] }>;
}) {
  const session = await getServerSession();

  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent("/dashboard/generator")}`);

  const masterResume = await findMasterResumeByUserId(session.user.id);

  if (!masterResume) {
    return <AccountGeneratorSetupRequired user={session.user} />;
  }

  const requested = (await searchParams).template;
  const requestedId = Array.isArray(requested) ? requested[0] : requested;
  const initialTemplateId: TemplateId = requestedId && isTemplateId(requestedId) ? requestedId : "minimal";

  return (
    <ResumeStudio
      mode="account"
      user={session.user}
      masterResumeUpdatedAt={new Date(masterResume.updatedAt).toLocaleTimeString()}
      initialTemplateId={initialTemplateId}
    />
  );
}
