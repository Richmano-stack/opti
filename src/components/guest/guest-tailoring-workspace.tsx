"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft, LoaderCircle, ShieldCheck, Sparkles } from "lucide-react";

import {
  submitGuestResume,
  type GuestGenerationState,
} from "@/app/actions/generate-resume";
import { GuestResumePreview } from "@/components/guest/guest-resume-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const initialState: GuestGenerationState = { status: "idle" };

export function GuestTailoringWorkspace() {
  const [state, formAction, isPending] = useActionState(submitGuestResume, initialState);
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === "success") resultHeading.current?.focus();
  }, [state]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft aria-hidden className="size-4" />
            <span>Back to Opti</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Guest workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Tailor your résumé for this role</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Paste both documents below. Your text stays in this browser session and is not saved to your account or our database.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Your source material</CardTitle>
              <CardDescription>Use your complete, truthful résumé and the full job description.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <Field data-invalid={state.status === "error" && state.error.code === "INVALID_INPUT"}>
                  <FieldLabel htmlFor="guest-resume">Master résumé</FieldLabel>
                  <Textarea
                    id="guest-resume"
                    name="resume"
                    value={resume}
                    onChange={(event) => setResume(event.target.value)}
                    placeholder="Paste your standard résumé here…"
                    className="min-h-56 resize-y bg-background"
                    maxLength={50_000}
                    required
                    disabled={isPending}
                  />
                  <FieldDescription>{resume.length.toLocaleString()} / 50,000 characters</FieldDescription>
                </Field>

                <Field data-invalid={state.status === "error" && state.error.code === "INVALID_INPUT"}>
                  <FieldLabel htmlFor="guest-job-description">Job description</FieldLabel>
                  <Textarea
                    id="guest-job-description"
                    name="jobDescription"
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    placeholder="Paste the role description here…"
                    className="min-h-48 resize-y bg-background"
                    maxLength={30_000}
                    required
                    disabled={isPending}
                  />
                  <FieldDescription>{jobDescription.length.toLocaleString()} / 30,000 characters</FieldDescription>
                </Field>

                {state.status === "error" ? <FieldError>{state.error.message}</FieldError> : null}

                <Button type="submit" size="lg" className="h-11 w-full" disabled={isPending || !resume.trim() || !jobDescription.trim()}>
                  {isPending ? <><LoaderCircle aria-hidden className="animate-spin" /> Tailoring your résumé…</> : <><Sparkles aria-hidden /> Generate tailored résumé</>}
                </Button>

                <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck aria-hidden className="size-4" /> Guest documents are not persisted.
                </p>
              </form>
            </CardContent>
          </Card>

          <section aria-live="polite" aria-busy={isPending}>
            {state.status === "success" ? (
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">Ready to review</p>
                    <h2 ref={resultHeading} tabIndex={-1} className="mt-1 text-xl font-bold outline-none">Your tailored résumé</h2>
                  </div>
                  <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">Not saved</span>
                </div>
                <GuestResumePreview resume={state.data} />
              </div>
            ) : (
              <Card className="min-h-[460px] justify-center border-dashed">
                <CardContent className="mx-auto max-w-md text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Sparkles aria-hidden className="size-5" /></div>
                  <h2 className="mt-5 text-lg font-semibold">Your tailored résumé will appear here</h2>
                  <p className="mt-2 leading-6 text-muted-foreground">
                    Opti will focus your existing experience on the role without inventing employers, qualifications, or achievements.
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}