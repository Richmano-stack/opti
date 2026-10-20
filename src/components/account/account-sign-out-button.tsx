"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/server/auth/client";
export function AccountSignOutButton() { const router = useRouter(); return <Button type="button" variant="outline" size="lg" onClick={async () => { await authClient.signOut(); router.push("/"); router.refresh(); }}><LogOut aria-hidden data-icon="inline-start" /> Sign out</Button>; }
