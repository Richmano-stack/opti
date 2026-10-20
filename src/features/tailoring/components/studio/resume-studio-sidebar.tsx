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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DevSampleFill } from "@/features/devtools/components/dev-sample-fill";
import type { DevSampleInput } from "@/features/devtools/lib/sample-inputs";
import { ContactInformationPreflight } from "@/features/tailoring/components/contact-information-preflight";
import { cn } from "@/lib/utils";
import { readJobTarget } from "@/features/tailoring/lib/read-job-target";
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
    <div className="group grid gap-1.5">
      {label ? (
        <Label htmlFor={id} className="text-xs font-bold">
          {label}
        </Label>
      ) : null}
      <Textarea
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
        className={cn("resize-y bg-white text-xs leading-5", minHeightClass)}
      />
      <div
        id={descriptionId}
        className="flex items-center justify-between px-0.5 text-[11px] font-medium text-muted-foreground"
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
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value === "jd" || value === "resume") setActiveTab(value);
        }}
      >
        <TabsList aria-label="Source documents" className="grid h-auto w-full grid-cols-2">
          <TabsTrigger value="jd" className="text-xs">
            <BriefcaseBusiness aria-hidden className="size-3.5" />
            Job description
            {jdLength > 0 ? (
              <Badge variant="secondary" className="px-1.5 text-[10px]">
                {jdLength >= 1000 ? `${(jdLength / 1000).toFixed(1)}k` : jdLength}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="resume" className="text-xs">
            <FileText aria-hidden className="size-3.5" />
            Master résumé
            {mode === "account" ? (
              <span
                title="Saved in your account"
                className="size-1.5 rounded-full bg-emerald-500"
              />
            ) : resumeLength > 0 ? (
              <Badge variant="secondary" className="px-1.5 text-[10px]">
                {resumeLength >= 1000 ? `${(resumeLength / 1000).toFixed(1)}k` : resumeLength}
              </Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Panels: Both inputs stay rendered in DOM for FormData submission */}
      <div className={activeTab === "jd" ? "block space-y-1.5" : "hidden"}>
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="studio-job-description" className="text-xs font-bold">
            Job description
          </Label>
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
            <Label htmlFor="studio-resume" className="text-xs font-bold">
              Master résumé
            </Label>
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
          <Card className="bg-white py-4 shadow-sm">
            <CardContent className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-horizon-primary/10 text-horizon-primary">
                  <FileText aria-hidden className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">
                    Using your saved master résumé
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {masterResumeUpdatedAt
                      ? `Last updated ${masterResumeUpdatedAt}`
                      : "Stored securely in your account"}
                  </p>
                </div>
              </div>
              <Button variant="link" size="sm" nativeButton={false} render={<Link href="/dashboard" />} className="shrink-0 px-0 text-xs">
                Edit
              </Button>
            </CardContent>
          </Card>
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
          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-[11px]"
            onClick={() => setActiveTab(activeTab === "jd" ? "resume" : "jd")}
          >
            View {activeTab === "jd" ? "résumé" : "job post"} →
          </Button>
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
          <Button type="submit" disabled={isPending || !isReady} className="h-10 w-full px-5 text-xs font-bold">
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
          </Button>
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
      className={cn(
        "flex w-full min-w-0 flex-col overflow-y-auto border-b border-slate-200 p-4 sm:p-5 md:w-[380px] md:shrink-0 md:border-b-0 md:border-r lg:w-[400px]",
        mode === "guest" && "bg-slate-50/80",
      )}
    >
      {resume ? (
        <div className="space-y-4">
          {/* Target Role Card */}
          <Card className="bg-white py-4 shadow-sm">
            <CardContent>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Target role
              </p>
              <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">
                {target.title}
              </h2>
              <p className="mt-0.5 text-xs text-slate-600">{target.company}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onToggleEditingSources}
                aria-expanded={editingSources}
                className="mt-3 rounded-full text-xs"
              >
                <Pencil aria-hidden className="size-3" />
                {editingSources ? "Hide source inputs" : "Edit source inputs"}
              </Button>
            </CardContent>
          </Card>

          {/* Collapsible Source Fields */}
          <div className={editingSources ? "block" : "hidden"}>
            <Card className="bg-white py-4 shadow-sm">
              <CardContent>{inputsSection}</CardContent>
            </Card>
          </div>

          {/* Match Insights Card */}
          <Card className="bg-white py-4 shadow-sm">
            <CardContent>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Match insights
            </h2>
            <p className="mt-2 text-xs font-bold text-slate-900">
              {resume.skills.length} {resume.skills.length === 1 ? "skill" : "skills"} carried into this draft
            </p>

            {resume.skills.length > 0 ? (
              <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Matching skills">
                {resume.skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="secondary">{skill}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}

            {resume.matchNote ? (
              <div className="mt-4 space-y-3 text-xs leading-5 text-slate-700">
                <Separator />
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
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="bg-white py-4 shadow-sm">
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="bg-white py-4 shadow-sm">
            <CardContent>{inputsSection}</CardContent>
          </Card>
        </div>
      )}
    </aside>
  );
}
