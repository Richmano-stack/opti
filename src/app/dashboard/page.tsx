import { redirect } from "next/navigation";

import { getServerSession } from "@/server/auth/session";
import { MasterResumeWorkspace } from "@/features/master-resume/components/master-resume-workspace";
import { findMasterResumeByUserId } from "@/features/master-resume/lib";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/dashboard")}`);
  }

  const masterResume = await findMasterResumeByUserId(session.user.id);

  return (
    <MasterResumeWorkspace
      user={session.user}
      initialContent={masterResume?.content ?? ""}
      initialUpdatedAt={
        masterResume?.updatedAt
          ? new Date(masterResume.updatedAt).toLocaleTimeString()
          : undefined
      }
    />
  );
}

