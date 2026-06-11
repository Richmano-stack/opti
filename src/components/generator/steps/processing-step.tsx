"use client";

import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ProcessingStepProps = {
  error: string | null;
  isProcessing: boolean;
  onRetry: () => void;
  onBack: () => void;
};

export function ProcessingStep({
  error,
  isProcessing,
  onRetry,
  onBack,
}: ProcessingStepProps) {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircleIcon className="size-5 shrink-0" aria-hidden />
            Optimization failed
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3 border-t-0 bg-transparent sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to intake
          </Button>
          <Button type="button" onClick={onRetry} disabled={isProcessing}>
            Try again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimizing your resume</CardTitle>
        <CardDescription>
          Analyzing keywords, restructuring bullet points, and aligning your
          experience with the target role. This may take a moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
