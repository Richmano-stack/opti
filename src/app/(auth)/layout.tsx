import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { getServerSession } from "@/server/auth/session";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="horizon-page relative flex min-h-svh flex-col overflow-hidden text-horizon-ink">
      <div aria-hidden="true" className="horizon-aurora">
        <div className="horizon-orb horizon-orb-primary" />
        <div className="horizon-orb horizon-orb-secondary" />
        <div className="horizon-orb horizon-orb-tertiary" />
      </div>
`r`n
      {children}

      <footer className="relative z-10 px-6 pb-6 text-center text-[11px] text-horizon-muted">
        Your master resume is saved to your account. Guest sessions are temporary.
      </footer>

      <Toaster richColors closeButton position="top-center" />
    </div>
  );
}


