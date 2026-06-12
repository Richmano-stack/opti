import { Toaster } from "sonner";

import { AppShell } from "@/components/layout/app-shell";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShell header="minimal">
      {children}
      <Toaster richColors closeButton position="top-center" />
    </AppShell>
  );
}
