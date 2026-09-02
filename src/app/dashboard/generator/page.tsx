import { redirect } from "next/navigation";

import { AccountGeneratorSetupRequired } from "@/components/account/account-generator-setup-required";
import { AccountTailoringWorkspace } from "@/components/account/account-tailoring-workspace";
import { getServerSession } from "@/server/auth/session";
import { findMasterResumeByUserId } from "@/services/master-resume";

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

