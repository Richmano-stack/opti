"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  Info,
  LoaderCircle,
  Lock,
  Pencil,
  Sparkles,
} from "lucide-react";

import { DevSampleFill } from "@/features/devtools/components/dev-sample-fill";
import type { DevSampleInput } from "@/features/devtools/lib/sample-inputs";
import { ContactInformationPreflight } from "@/features/tailoring/components/contact-information-preflight";
import { cn } from "@/lib/utils";
import { readJobTarget } from "./resume-studio-header";
import type { ContactField } from "@/features/tailoring/lib/contact-info";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

function notePoints(text: string): string[] {
  const points = text
    .split(";")
    .map((point) => point.trim().replace(/^[•\-]\s*/, "").replace(/\.$/, ""))
    .filter(Boolean);
  return points.length > 0 ? points : [text];
}

export function StudioTextAreaField({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  maxChars,
  disabled,
  minHeightClass = "min-h-[260px] sm:min-h-[300px]",
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder: string;
  maxChars: number;
  disabled: boolean;
  minHeightClass?: string;
}) {
  const descriptionId = `${id}-description`;

  return (
    <div className="group">
      {label ? (
        <label htmlFor={id} className="text-xs font-bold text-slate-800">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxChars}
        required
        disabled={disabled}
        placeholder={placeholder}
        aria-label={label ? undefined : placeholder}
        aria-describedby={descriptionId}
        className={cn(
          "mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-xs leading-5 text-horizon-ink outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-horizon-secondary focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-not-allowed disabled:bg-slate-100",
          minHeightClass,
        )}
      />
      <div
        id={descriptionId}
        className="mt-1 flex items-center justify-between px-0.5 text-[11px] font-medium text-slate-500"
      >
        <span>Plain text only</span>
        <span>
          {value.length.toLocaleString()} / {maxChars.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export function ResumeStudioSidebar({
  mode,
  masterResumeUpdatedAt,
  resumeText,
  onResumeTextChange,
  jobDescription,
  onJobDescriptionChange,
  isPending,
  isReady,
  missingFields,
  errorMessage,
  editingSources,
  onToggleEditingSources,
  onFillSample,
  resume,
}: {
  mode: "guest" | "account";
  masterResumeUpdatedAt?: string;
  resumeText: string;
  onResumeTextChange: (value: string) => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  isPending: boolean;
  isReady: boolean;
  missingFields?: ContactField[];
  errorMessage?: string;
  editingSources: boolean;
  onToggleEditingSources: () => void;
  onFillSample: (sample: DevSampleInput) => void;
  resume?: OptimizedResume;
}) {
  const [activeTab, setActiveTab] = useState<"jd" | "resume">("jd");

  const target = readJobTarget(jobDescription);
  const hasResult = Boolean(resume);

  const jdLength = jobDescription.trim().length;
  const resumeLength = resumeText.trim().length;

  const inputsSection = (
    <div className="space-y-3.5">
      {/* Segmented Tab Navigation for Documents */}
      <div
        className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-medium"
        role="tablist"
        aria-label="Source documents"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "jd"}
          onClick={() => setActiveTab("jd")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition",
            activeTab === "jd"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <BriefcaseBusiness aria-hidden className="size-3.5" />
          <span>Job description</span>
          {jdLength > 0 ? (
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
              {jdLength >= 1000 ? `${(jdLength / 1000).toFixed(1)}k` : jdLength}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "resume"}
          onClick={() => setActiveTab("resume")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition",
            activeTab === "resume"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <FileText aria-hidden className="size-3.5" />
          <span>Master résumé</span>
          {mode === "account" ? (
            <span
              title="Saved in your account"
              className="size-1.5 rounded-full bg-emerald-500"
            />
          ) : resumeLength > 0 ? (
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
              {resumeLength >= 1000
                ? `${(resumeLength / 1000).toFixed(1)}k`
                : resumeLength}
            </span>
          ) : null}
        </button>
      </div>

      {/* Tab Panels: Both inputs stay rendered in DOM for FormData submission */}
      <div className={activeTab === "jd" ? "block space-y-1.5" : "hidden"}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800">Job description</span>
          <DevSampleFill
            disabled={isPending}
            onFill={(sample) => {
              if (mode === "guest") onFillSample(sample);
              else onJobDescriptionChange(sample.jobDescription);
            }}
          />
        </div>
        <StudioTextAreaField
          id="studio-job-description"
          name="jobDescription"
          value={jobDescription}
          onChange={onJobDescriptionChange}
          placeholder="Paste the complete job posting here"
          maxChars={30_000}
          disabled={isPending}
        />
      </div>

      {mode === "guest" ? (
        <div className={activeTab === "resume" ? "block space-y-1.5" : "hidden"}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800">Master résumé</span>
            <DevSampleFill disabled={isPending} onFill={onFillSample} />
          </div>
          <StudioTextAreaField
            id="studio-resume"
            name="resume"
            value={resumeText}
            onChange={onResumeTextChange}
            placeholder="Paste your complete résumé here"
            maxChars={50_000}
            disabled={isPending}
          />
        </div>
      ) : (
        <div className={activeTab === "resume" ? "block" : "hidden"}>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-horizon-primary/10 text-horizon-primary">
                  <FileText aria-hidden className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">
                    Using your saved master résumé
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {masterResumeUpdatedAt
                      ? `Last updated ${masterResumeUpdatedAt}`
                      : "Stored securely in your account"}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="shrink-0 text-xs font-bold text-horizon-primary hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Readiness Indicator */}
      <div className="flex items-center justify-between rounded-lg bg-slate-100/90 px-3 py-2 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className={cn(
              "size-2 rounded-full",
              isReady ? "bg-emerald-500" : "bg-amber-400",
            )}
          />
          {isReady
            ? "Both documents ready"
            : mode === "guest"
              ? !resumeLength
                ? "Master résumé needed"
                : "Job description needed"
              : "Job description needed"}
        </span>
        {mode === "guest" ? (
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "jd" ? "resume" : "jd")}
            className="font-semibold text-horizon-primary hover:underline"
          >
            View {activeTab === "jd" ? "résumé" : "job post"} →
          </button>
        ) : null}
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
        >
          {errorMessage}
        </p>
      ) : null}

      {/* Preflight Missing Contact Information */}
      {missingFields && missingFields.length > 0 ? (
        <ContactInformationPreflight
          missingFields={missingFields}
          canSave={mode === "account"}
          isPending={isPending}
        />
      ) : (
        <div className="pt-1">
          <button
            type="submit"
            disabled={isPending || !isReady}
            className="horizon-button-primary h-10 w-full px-5 text-xs font-bold disabled:pointer-events-none disabled:opacity-45"
          >
            {isPending ? (
              <>
                <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
                Tailoring your résumé...
              </>
            ) : (
              <>
                <Sparkles aria-hidden className="size-3.5" />
                {hasResult ? "Refine tailored résumé" : "Tailor my résumé"}
                <ArrowRight aria-hidden className="ml-1 size-3.5" />
              </>
            )}
          </button>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Lock aria-hidden className="size-3 text-horizon-secondary" />
            {mode === "guest"
              ? "Nothing is saved after this session."
              : "Job descriptions and generated résumés are not saved."}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <aside
      aria-label="Studio source inputs and insights"
      className="flex w-full min-w-0 flex-col overflow-y-auto border-b border-slate-200 bg-slate-50/80 p-4 sm:p-5 md:w-[380px] md:shrink-0 md:border-b-0 md:border-r lg:w-[400px]"
    >
      {resume ? (
        <div className="space-y-4">
          {/* Target Role Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Target role
            </p>
            <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">
              {target.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">{target.company}</p>
            <button
              type="button"
              onClick={onToggleEditingSources}
              aria-expanded={editingSources}
              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
            >
              <Pencil aria-hidden className="size-3" />
              {editingSources ? "Hide source inputs" : "Edit source inputs"}
            </button>
          </div>

          {/* Collapsible Source Fields */}
          <div
            className={
              editingSources
                ? "space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                : "hidden"
            }
          >
            {inputsSection}
          </div>

          {/* Match Insights Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Match insights
            </h2>
            <p className="mt-2 text-xs font-bold text-slate-900">
              {resume.skills.length} {resume.skills.length === 1 ? "skill" : "skills"} carried into this draft
            </p>

            {resume.skills.length > 0 ? (
              <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Matching skills">
                {resume.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            ) : null}

            {resume.matchNote ? (
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">Core strengths</p>
                  <ul className="mt-1 space-y-1">
                    {notePoints(resume.matchNote.strengths).map((point) => (
                      <li key={point} className="flex items-start gap-1.5">
                        <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-slate-900">Potential gaps</p>
                  <ul className="mt-1 space-y-1">
                    {notePoints(resume.matchNote.gaps).map((point) => (
                      <li key={point} className="flex items-start gap-1.5">
                        <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[10px] text-slate-500">
                  For you only. This note is not in your PDF.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-horizon-secondary">
              Source documents
            </p>
            <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">
              {mode === "guest" ? "Add your source material" : "Start with the role"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              {mode === "guest"
                ? "Both master résumé and job description are required."
                : "Paste the complete job description to tailor against your master résumé."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {inputsSection}
          </div>
        </div>
      )}
    </aside>
  );
}
