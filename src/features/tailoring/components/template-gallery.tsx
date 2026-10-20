import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { listTemplates } from "@/templates/registry";
import type { AuthUser } from "@/server/auth/types";

export function TemplateGallery({ user }: { user: AuthUser }) {
  const templates = listTemplates();

  return (
    <AuthenticatedAppShell user={user} title="Templates">
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-8 sm:px-8 sm:py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Choose a template</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Browse the layouts. Open the one you want to tailor.
        </p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {templates.map((template) => (
            <li key={template.id}>
              <Link
                href={`/dashboard/generator?template=${template.id}`}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full gap-0 bg-white py-0 shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <img
                    src={template.thumbnail}
                    alt=""
                    className="aspect-[4/5] w-full border-b border-border object-cover"
                  />
                  <CardHeader className="pt-4">
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto text-sm font-medium text-primary">
                    Use this template
                    <ArrowRight aria-hidden className="size-4" />
                  </CardFooter>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AuthenticatedAppShell>
  );
}
