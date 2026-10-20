"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, Check, FileText, Info, Lock, Sparkles } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DevSampleFill } from "@/features/devtools/components/dev-sample-fill";
import type { DevSampleInput } from "@/features/devtools/lib/sample-inputs";
import { ContactInformationPreflight } from "@/features/tailoring/components/contact-information-preflight";
import { cn } from "@/lib/utils";
import { readJobTarget } from "@/features/tailoring/lib/read-job-target";
import type { ContactField } from "@/features/tailoring/lib/contact-info";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

type StudioTab = "job" | "resume" | "match";

function notePoints(text: string): string[] {
  const points = text
    .split(";")
    .map((point) => point.trim().replace(/^[•\-]\s*/, "").replace(/\.$/, ""))
    .filter(Boolean);
  return points.length > 0 ? points : [text];
}

function SourceField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  hint,
  maxChars,
  disabled,
  onFillSample,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint: string;
  maxChars: number;
  disabled: boolean;
  onFillSample: (sample: DevSampleInput) => void;
}) {
  const descriptionId = `${id}-description`;

  return (
    <Field className="min-h-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <DevSampleFill disabled={disabled} onFill={onFillSample} />
      </div>
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxChars}
        required
        disabled={disabled}
        placeholder={placeholder}
        aria-describedby={descriptionId}
        className="min-h-40 flex-1 resize-none [field-sizing:fixed]"
      />
      <FieldDescription id={descriptionId} className="flex items-center justify-between gap-2">
        <span>{hint}</span>
        <span className="shrink-0 tabular-nums">
          {value.length.toLocaleString()} / {maxChars.toLocaleString()}
        </span>
      </FieldDescription>
    </Field>
  );
}

function MatchInsights({ resume, jobDescription }: { resume: OptimizedResume; jobDescription: string }) {
  const target = readJobTarget(jobDescription);

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm">
        <CardHeader>
          <CardDescription>Target role</CardDescription>
          <CardTitle>{target.title}</CardTitle>
          <CardDescription>{target.company}</CardDescription>
        </CardHeader>
      </Card>

      <section aria-labelledby="studio-skills-heading" className="flex flex-col gap-2">
        <h2 id="studio-skills-heading" className="text-sm font-medium">
          {resume.skills.length} {resume.skills.length === 1 ? "skill" : "skills"} carried into this draft
        </h2>
        {resume.skills.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Matching skills">
            {resume.skills.map((skill) => (
              <li key={skill}>
                <Badge variant="secondary">{skill}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {resume.matchNote ? (
        <section aria-label="Match note" className="flex flex-col gap-2">
          <Accordion defaultValue={["strengths", "gaps"]}>
            <AccordionItem value="strengths">
              <AccordionTrigger>Core strengths</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-1.5">
                  {notePoints(resume.matchNote.strengths).map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="gaps">
              <AccordionTrigger>Potential gaps</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-1.5">
                  {notePoints(resume.matchNote.gaps).map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="text-xs text-muted-foreground">For you only. This note is not in your PDF.</p>
        </section>
      ) : null}
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
  onFillSample: (sample: DevSampleInput) => void;
  resume?: OptimizedResume;
}) {
  const [tab, setTab] = useState<StudioTab>("job");
  const [shownResume, setShownResume] = useState(resume);
  if (resume !== shownResume) {
    setShownResume(resume);
    setTab(resume ? "match" : "job");
  }

  const hasResult = Boolean(resume);
  const needsContactReview = Boolean(missingFields && missingFields.length > 0);
  const readinessHint =
    mode === "guest" && !resumeText.trim()
      ? "Add your master résumé to continue."
      : "Paste a job description to continue.";

  return (
    <aside
      aria-label="Studio source inputs and insights"
      className={cn("flex h-full min-h-0 w-full min-w-0 flex-col", mode === "guest" && "bg-slate-50/80")}
    >
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (value === "job" || value === "resume" || value === "match") setTab(value);
        }}
        className="min-h-0 flex-1 gap-0"
      >
        <div className="px-4 pt-4">
          <TabsList aria-label="Studio panels" className="w-full">
            <TabsTrigger value="job">Job</TabsTrigger>
            {mode === "guest" ? <TabsTrigger value="resume">Résumé</TabsTrigger> : null}
            <TabsTrigger value="match" disabled={!hasResult}>
              Match
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          {needsContactReview && missingFields ? (
            <div className="mb-4">
              <ContactInformationPreflight
                missingFields={missingFields}
                canSave={mode === "account"}
                isPending={isPending}
              />
            </div>
          ) : null}

          <TabsContent value="job" keepMounted className="flex min-h-0 flex-col">
            <FieldGroup className="min-h-0 flex-1 gap-4">
              <SourceField
                id="studio-job-description"
                name="jobDescription"
                label="Job description"
                value={jobDescription}
                onChange={onJobDescriptionChange}
                placeholder="Paste the complete job posting here"
                hint="Include the requirements and responsibilities."
                maxChars={30_000}
                disabled={isPending}
                onFillSample={(sample) => {
                  if (mode === "guest") onFillSample(sample);
                  else onJobDescriptionChange(sample.jobDescription);
                }}
              />
              {mode === "account" ? (
                <Item variant="outline" size="sm">
                  <ItemMedia variant="icon">
                    <FileText aria-hidden />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Using your saved master résumé</ItemTitle>
                    <ItemDescription>
                      {masterResumeUpdatedAt ? `Last updated ${masterResumeUpdatedAt}` : "Stored securely in your account"}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/dashboard" />}>
                      Edit
                    </Button>
                  </ItemActions>
                </Item>
              ) : null}
            </FieldGroup>
          </TabsContent>

          {mode === "guest" ? (
            <TabsContent value="resume" keepMounted className="flex min-h-0 flex-col">
              <SourceField
                id="studio-resume"
                name="resume"
                label="Master résumé"
                value={resumeText}
                onChange={onResumeTextChange}
                placeholder="Paste your complete résumé here"
                hint="Plain text works best."
                maxChars={50_000}
                disabled={isPending}
                onFillSample={onFillSample}
              />
            </TabsContent>
          ) : null}

          <TabsContent value="match">
            {resume ? <MatchInsights resume={resume} jobDescription={jobDescription} /> : null}
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex flex-col gap-2 border-t p-4">
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertCircle aria-hidden />
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        ) : null}

        {needsContactReview ? null : (
          <Button type="submit" size="lg" disabled={isPending || !isReady} className="w-full">
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" aria-hidden />
                Tailoring your résumé…
              </>
            ) : (
              <>
                <Sparkles aria-hidden data-icon="inline-start" />
                {hasResult ? "Refine tailored résumé" : "Tailor my résumé"}
              </>
            )}
          </Button>
        )}

        {!isReady && !isPending && !needsContactReview ? (
          <p className="text-center text-xs text-muted-foreground">{readinessHint}</p>
        ) : null}
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock aria-hidden className="size-3" />
          {mode === "guest"
            ? "Nothing is saved after this session."
            : "Job descriptions and generated résumés are not saved."}
        </p>
      </div>
    </aside>
  );
}
