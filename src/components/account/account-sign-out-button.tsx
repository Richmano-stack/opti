"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/server/auth/client";
export function AccountSignOutButton() { const router = useRouter(); return <button type="button" onClick={async () => { await authClient.signOut(); router.push("/"); router.refresh(); }} className="horizon-button-ghost h-10 px-4 text-xs"><LogOut aria-hidden className="size-3.5" /> Sign out</button>; }
