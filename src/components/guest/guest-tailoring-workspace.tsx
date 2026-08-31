"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type DragEvent, type ChangeEvent } from "react";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Lock,
  Shield,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

import {
  submitGuestResume,
  type GuestGenerationState,
} from "@/app/actions/generate-resume";
import { GuestResumePreview } from "@/components/guest/guest-resume-preview";
import { Button } from "@/components/ui/button";

const initialState: GuestGenerationState = { status: "idle" };

// Opti 4-Point Star Sparkle Logo
function OptiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 text-brand-ink"
        aria-hidden="true"
      >
        <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900">Opti</span>
    </div>
  );
}

// Decorative 3D-styled isometric hero illustration matching the design mockup
function HeroIllustration() {
  return (
    <div className="relative hidden w-72 h-44 select-none lg:block" aria-hidden="true">
      {/* Ambient background glow */}
      <div className="absolute -inset-2 rounded-3xl bg-brand-soft/50 blur-xl -z-10" />

      {/* Back document card */}
      <div className="absolute right-0 top-0 w-44 rounded-xl border border-brand-border/80 bg-white/90 p-3 shadow-md backdrop-blur-sm transform rotate-6 opacity-75">
        <div className="h-2 w-16 rounded-full bg-brand-border mb-2" />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-slate-100" />
          <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
          <div className="h-1.5 w-3/4 rounded-full bg-slate-100" />
        </div>
      </div>

      {/* Main front document card */}
      <div className="absolute left-6 top-3 w-56 rounded-2xl border border-brand-border bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex size-7 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-20 rounded-full bg-slate-200" />
            <div className="h-1.5 w-12 rounded-full bg-slate-100" />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="h-2.5 w-full rounded-md bg-brand-action" />
          <div className="h-1.5 w-full rounded-full bg-slate-100" />
          <div className="h-1.5 w-5/6 rounded-full bg-slate-100" />
          <div className="h-1.5 w-4/6 rounded-full bg-slate-100" />
        </div>
      </div>

      {/* Floating pill badge / search bar */}
      <div className="absolute -bottom-1 left-2 flex items-center gap-2 rounded-xl border border-brand-border bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md">
        <div className="size-3.5 rounded-md border border-brand-muted" />
        <div className="h-1.5 w-10 rounded-full bg-brand-border" />
      </div>

      {/* Sparkles */}
      <div className="absolute -top-1 right-24 text-brand-muted animate-pulse">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
        </svg>
      </div>
      <div className="absolute top-10 right-4 text-brand-muted">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
          <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
        </svg>
      </div>
    </div>
  );
}

interface DropZoneProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  placeholderTitle: string;
  maxChars: number;
  disabled?: boolean;
}

function DropZone({
  id,
  name,
  value,
  onChange,
  title,
  subtitle,
  icon,
  placeholderTitle,
  maxChars,
  disabled,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFile = (file: File) => {
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) onChange(text);
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) onChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 text-brand-ink">{icon}</div>
        <div>
          <label htmlFor={id} className="block text-sm font-bold text-slate-900 cursor-pointer">
            {title}
          </label>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border border-dashed transition-all cursor-text overflow-hidden ${
          isDragging
            ? "border-brand-muted bg-brand-soft/80 ring-2 ring-brand-muted/30"
            : value.length > 0
            ? "border-brand-border/80 bg-white"
            : "border-brand-border bg-[#f7faff] hover:bg-brand-soft/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".txt,.md,.pdf,.docx"
          className="hidden"
          disabled={disabled}
        />

        {/* Decorative empty-state overlay — pointer-events-none so clicks reach the textarea */}
        {value.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 py-8 text-center">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-border text-brand-ink mb-2.5">
              <Upload className="size-4" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{placeholderTitle}</p>
            <p className="mt-0.5 text-xs text-slate-400">Paste plain text to continue</p>
          </div>
        ) : null}

        {/* Always-visible textarea — MVP: click anywhere to type or paste */}
        <textarea
          id={id}
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxChars}
          required
          disabled={disabled}
          placeholder=""
          className="relative z-10 w-full min-h-[140px] resize-y bg-transparent p-3 text-xs leading-relaxed text-slate-800 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
        <span>Plain text only</span>
        <span>
          {value.length.toLocaleString()} / {maxChars.toLocaleString()} characters
        </span>
      </div>
    </div>
  );
}

export function GuestTailoringWorkspace() {
  const [state, formAction, isPending] = useActionState(submitGuestResume, initialState);
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === "success") resultHeading.current?.focus();
  }, [state]);

  return (
    <div className="page-sky-gradient min-h-screen text-slate-900 antialiased selection:bg-brand-soft selection:text-slate-800">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <OptiLogo />
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Shield className="size-4 text-slate-400" />
              <span>Your data stays private</span>
            </div>
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Hero Section */}
        <div className="flex items-start justify-between gap-8 pb-8">
          <div>
            <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink border border-brand-border">
              Guest workspace
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Tailor your résumé for this role
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base leading-relaxed max-w-xl">
              Paste your résumé and the job description.
              <br className="hidden sm:inline" /> Opti will tailor your experience to match the role.
            </p>
          </div>

          <HeroIllustration />
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid items-start gap-6 lg:grid-cols-12">
          {/* Left Column: Source Material Form */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-6 items-center justify-center rounded-full bg-brand-action text-xs font-bold text-slate-900 shadow-sm shadow-sky-200/30">
                1
              </div>
              <h2 className="text-base font-bold text-slate-900">Your source material</h2>
            </div>

            <form action={formAction} className="space-y-5">
              <DropZone
                id="guest-resume"
                name="resume"
                value={resume}
                onChange={setResume}
                title="Master résumé"
                subtitle="Add your full, unedited résumé."
                icon={<FileText className="size-4" />}
                placeholderTitle="Paste your résumé here"
                maxChars={50_000}
                disabled={isPending}
              />

              <DropZone
                id="guest-job-description"
                name="jobDescription"
                value={jobDescription}
                onChange={setJobDescription}
                title="Job description"
                subtitle="Paste the full job description."
                icon={<Briefcase className="size-4" />}
                placeholderTitle="Paste the job description here"
                maxChars={30_000}
                disabled={isPending}
              />

              {state.status === "error" ? (
                <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                  {state.error.message}
                </p>
              ) : null}

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-11 rounded-xl bg-brand-action hover:bg-brand-action-hover text-slate-900 font-semibold text-sm shadow-sm shadow-sky-200/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending || !resume.trim() || !jobDescription.trim()}
                >
                  {isPending ? (
                    <>
                      <LoaderCircle aria-hidden className="size-4 animate-spin" />
                      Tailoring your résumé…
                    </>
                  ) : (
                    <>
                      <Sparkles aria-hidden className="size-4" />
                      Tailor my résumé
                    </>
                  )}
                </Button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <Lock aria-hidden className="size-3.5 text-slate-400" />
                  Nothing is saved. Everything stays in this browser session.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Tailored Résumé Output & Highlights */}
          <div className="space-y-4 lg:col-span-6">
            <section
              aria-live="polite"
              aria-busy={isPending}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] min-h-[440px] flex flex-col"
            >
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex size-6 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                  <Sparkles className="size-3.5" />
                </div>
                <h2
                  ref={resultHeading}
                  tabIndex={-1}
                  className="text-base font-bold text-slate-900 outline-none"
                >
                  Your tailored résumé
                </h2>
              </div>

              {state.status === "success" ? (
                <div className="flex-1 overflow-auto">
                  <GuestResumePreview resume={state.data} />
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center p-6 sm:p-10 my-auto">
                  <div className="relative mb-4 flex size-16 items-center justify-center rounded-2xl bg-brand-soft/80 text-brand-ink">
                    <FileText className="size-8 stroke-[1.5]" />
                    <Sparkles className="absolute -top-1.5 -right-1.5 size-4 text-brand-muted animate-pulse" />
                    <Sparkles className="absolute -bottom-1 -left-1.5 size-3.5 text-brand-muted" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Your tailored résumé will appear here
                  </h3>
                  <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
                    We&apos;ll highlight your most relevant experience, skills, and achievements for
                    this role.
                  </p>
                </div>
              )}
            </section>

            {/* Bottom 3 Feature Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                  <Shield className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Private & secure</h4>
                  <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
                    Your data never leaves your browser session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                  <Zap className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">ATS-friendly</h4>
                  <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
                    Optimized formatting that passes ATS scans.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">You&apos;re in control</h4>
                  <p className="mt-0.5 text-[11px] leading-tight text-slate-500">
                    Review and edit everything before you use it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}