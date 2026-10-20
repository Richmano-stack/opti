"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { AppSidebar } from "@/components/app-sidebar";
import { useSidebarOpenState } from "@/components/horizon/sidebar-open-state";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ACCOUNT_HOME } from "@/features/auth/lib/callback-url";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/server/auth/types";

interface AuthenticatedAppShellProps {
  children: ReactNode;
  user: AuthUser;
  title: string;
  /** Page-level heading shown as the last breadcrumb, after the title. */
  heading?: ReactNode;
  actions?: ReactNode;
  /** Lock the page to the viewport so a tool can manage its own scrolling. */
  fill?: boolean;
}

export function AuthenticatedAppShell({ children, user, title, heading, actions, fill = false }: AuthenticatedAppShellProps) {
  const sidebarState = useSidebarOpenState();

  return (
    <SidebarProvider
      open={sidebarState?.open}
      onOpenChange={sidebarState?.setOpen}
      className={cn(fill && "h-dvh overflow-hidden")}
    >
      <AppSidebar user={user} />
      <SidebarInset className={cn(fill && "min-h-0 overflow-hidden")}>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink render={<Link href={ACCOUNT_HOME} />}>
                    Opti
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {heading ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">{title}</BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="min-w-0 text-foreground">{heading}</BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem className="min-w-0">
                    <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
          </div>
        </header>
        <div className={cn("min-w-0", fill ? "flex min-h-0 flex-1 flex-col overflow-hidden" : "flex-1")}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
