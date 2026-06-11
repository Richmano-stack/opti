"use client";

import { useState } from "react";
import { DownloadIcon, RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";
import { downloadOptimizedResumePdf } from "@/components/pdf/download-resume-pdf";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OptimizedResume } from "@/services/ai/types";
import { OptimizedResumePreview } from "@/components/generator/optimized-resume-preview";

type DeliverableStepProps = {
  resumeText: string;
  jobDescriptionText: string;
  optimizedResume: OptimizedResume;
  onStartOver: () => void;
};

function truncateText(text: string, maxLength = 280): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function DeliverableStep({
  resumeText,
  jobDescriptionText,
  optimizedResume,
  onStartOver,
}: DeliverableStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadOptimizedResumePdf(optimizedResume);
    } catch {
      toast.error("Failed to generate PDF", {
        description: "Please try again in a moment.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your optimized resume</CardTitle>
          <CardDescription>
            Review the AI-tailored output alongside your original inputs, then
            download the ATS-compliant PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Original inputs</h3>
                <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Resume
                    </p>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {truncateText(resumeText)}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Job description
                    </p>
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                      {truncateText(jobDescriptionText)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Optimized preview</h3>
              <div className="rounded-lg border bg-card p-4">
                <OptimizedResumePreview resume={optimizedResume} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t-0 bg-transparent sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" onClick={onStartOver}>
            <RotateCcwIcon data-icon="inline-start" />
            Start Over
          </Button>
          <Button
            type="button"
            onClick={() => void handleDownloadPdf()}
            disabled={isDownloading}
          >
            <DownloadIcon data-icon="inline-start" />
            {isDownloading ? "Generating PDF…" : "Download PDF"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
