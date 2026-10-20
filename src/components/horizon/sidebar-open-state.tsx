"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarOpenState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarOpenStateContext = createContext<SidebarOpenState | null>(null);

/** Keeps the desktop sidebar's collapsed state alive across page navigations. */
export function SidebarOpenStateProvider({ initialOpen, children }: { initialOpen: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(initialOpen);
  return <SidebarOpenStateContext.Provider value={{ open, setOpen }}>{children}</SidebarOpenStateContext.Provider>;
}

export function useSidebarOpenState() {
  return useContext(SidebarOpenStateContext);
}
