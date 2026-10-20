import type { ReactNode } from "react";
import { cookies } from "next/headers";

import { SidebarOpenStateProvider } from "@/components/horizon/sidebar-open-state";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const initialOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return <SidebarOpenStateProvider initialOpen={initialOpen}>{children}</SidebarOpenStateProvider>;
}
