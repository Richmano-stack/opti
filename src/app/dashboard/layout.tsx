import { AppShell } from "@/components/layout/app-shell";

/**
 * Dashboard segment layout.
 * All routes under /dashboard automatically receive the AppShell
 * with the sticky navigation header. Auth routes live under (auth)/
 * and are completely isolated from this layout.
 */
export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell header="minimal">{children}</AppShell>;
}
