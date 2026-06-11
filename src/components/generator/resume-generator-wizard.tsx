"use client";

import { useCallback, useState } from "react";
import type { OptimizedResume } from "@/services/ai/types";
import { trpc } from "@/utils/trpc/client";
import { DeliverableStep } from "@/components/generator/steps/deliverable-step";
import { getTrpcErrorMessage } from "@/components/generator/get-trpc-error-message";
import { IntakeStep } from "@/components/generator/steps/intake-step";
import { ProcessingStep } from "@/components/generator/steps/processing-step";
import {
  WizardStepper,
  type WizardStepId,
} from "@/components/generator/wizard-stepper";

function deriveResumeTitle(resume: OptimizedResume): string {
  return `${resume.contact.name} — Optimized Resume`;
}

export function ResumeGeneratorWizard() {
  const utils = trpc.useUtils();
  const { data: usageStats } = trpc.usage.getStats.useQuery();

  const optimizeMutation = trpc.resume.optimize.useMutation();
  const saveMutation = trpc.resume.save.useMutation();

  const [step, setStep] = useState<WizardStepId>("intake");
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(
    null
  );
  const [processingError, setProcessingError] = useState<string | null>(null);

  const isProcessing = optimizeMutation.isPending || saveMutation.isPending;

  const runOptimizationPipeline = useCallback(async () => {
    setProcessingError(null);

    try {
      const optimized = await optimizeMutation.mutateAsync({
        resume: resumeText.trim(),
        jobDescription: jobDescriptionText.trim(),
      });

      const saved = await saveMutation.mutateAsync({
        data: optimized,
        title: deriveResumeTitle(optimized),
      });

      setOptimizedResume(saved.data);
      void utils.usage.getStats.invalidate();
      void utils.resume.list.invalidate();
      setStep("deliverable");
    } catch (error) {
      setProcessingError(getTrpcErrorMessage(error));
    }
  }, [
    jobDescriptionText,
    optimizeMutation,
    resumeText,
    saveMutation,
    utils.resume.list,
    utils.usage.getStats,
  ]);

  const handleIntakeSubmit = useCallback(() => {
    setStep("processing");
    void runOptimizationPipeline();
  }, [runOptimizationPipeline]);

  const handleProcessingRetry = useCallback(() => {
    void runOptimizationPipeline();
  }, [runOptimizationPipeline]);

  const handleProcessingBack = useCallback(() => {
    setProcessingError(null);
    optimizeMutation.reset();
    saveMutation.reset();
    setStep("intake");
  }, [optimizeMutation, saveMutation]);

  const handleStartOver = useCallback(() => {
    setStep("intake");
    setResumeText("");
    setJobDescriptionText("");
    setOptimizedResume(null);
    setProcessingError(null);
    optimizeMutation.reset();
    saveMutation.reset();
  }, [optimizeMutation, saveMutation]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Resume Optimizer
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Tailor your resume to any job description with ATS-friendly formatting.
        </p>
        {usageStats ? (
          <p className="text-xs text-muted-foreground">
            {usageStats.totalOptimizations === 0
              ? "No optimized resumes saved yet."
              : `${usageStats.totalOptimizations} optimized resume${usageStats.totalOptimizations === 1 ? "" : "s"} saved to your history.`}
          </p>
        ) : null}
      </header>

      <WizardStepper currentStep={step} />

      {step === "intake" ? (
        <IntakeStep
          resumeText={resumeText}
          jobDescriptionText={jobDescriptionText}
          onResumeChange={setResumeText}
          onJobDescriptionChange={setJobDescriptionText}
          onSubmit={handleIntakeSubmit}
        />
      ) : null}

      {step === "processing" ? (
        <ProcessingStep
          error={processingError}
          isProcessing={isProcessing}
          onRetry={handleProcessingRetry}
          onBack={handleProcessingBack}
        />
      ) : null}

      {step === "deliverable" && optimizedResume ? (
        <DeliverableStep
          resumeText={resumeText}
          jobDescriptionText={jobDescriptionText}
          optimizedResume={optimizedResume}
          onStartOver={handleStartOver}
        />
      ) : null}
    </div>
  );
}
