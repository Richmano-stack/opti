"use client"

import Link from "next/link"
import { FileTextIcon, LayoutTemplateIcon, PenLineIcon } from "lucide-react"

import * as React from "react"

import { BrandMark } from "@/components/brand-mark"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ACCOUNT_HOME } from "@/features/auth/lib/callback-url"
import type { AuthUser } from "@/server/auth/types"

const navMain = [
  {
    title: "Templates",
    url: "/dashboard/templates",
    icon: <LayoutTemplateIcon />,
  },
  {
    title: "Master résumé",
    url: "/dashboard",
    icon: <FileTextIcon />,
  },
  {
    title: "Tailor",
    url: "/dashboard/generator",
    icon: <PenLineIcon />,
  },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AuthUser }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Opti"
              render={<Link href={ACCOUNT_HOME} aria-label="Opti home" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center">
                <BrandMark compact className="[&_svg]:size-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Opti</span>
                <span className="truncate text-xs">Résumé tailoring</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
