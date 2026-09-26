import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { getServerSession } from "@/server/auth/session";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="horizon-page relative flex h-dvh max-h-dvh flex-col overflow-hidden text-horizon-ink">
      <div aria-hidden="true" className="horizon-aurora">
        <div className="horizon-orb horizon-orb-primary" />
        <div className="horizon-orb horizon-orb-secondary" />
        <div className="horizon-orb horizon-orb-tertiary" />
      </div>

      {children}

      <Toaster richColors closeButton position="top-center" />
    </div>
  );
}
