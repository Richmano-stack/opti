import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { ACCOUNT_HOME } from "@/features/auth/lib/callback-url";
import { getServerSession } from "@/server/auth/session";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (session?.user) {
    redirect(ACCOUNT_HOME);
  }

  return (
    <>
      {children}
      <Toaster richColors closeButton position="top-center" />
    </>
  );
}


