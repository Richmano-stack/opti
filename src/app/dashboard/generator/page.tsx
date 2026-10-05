import { redirect } from "next/navigation";

import { AccountGeneratorSetupRequired } from "@/features/tailoring/components/account-generator-setup-required";
import { AccountTailoringWorkspace } from "@/features/tailoring/components/account-tailoring-workspace";
import { getServerSession } from "@/server/auth/session";
import { findMasterResumeByUserId } from "@/features/master-resume/lib";

export const dynamic = "force-dynamic";

export default async function AccountGeneratorPage() {
  const session = await getServerSession();

  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent("/dashboard/generator")}`);

  const masterResume = await findMasterResumeByUserId(session.user.id);

  if (!masterResume) {
    return <AccountGeneratorSetupRequired user={session.user} />;
  }

  return (
    <AccountTailoringWorkspace
      user={session.user}
      masterResumeUpdatedAt={new Date(masterResume.updatedAt).toLocaleTimeString()}
    />
  );
}

