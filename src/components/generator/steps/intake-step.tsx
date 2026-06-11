"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type IntakeStepProps = {
  resumeText: string;
  jobDescriptionText: string;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onSubmit: () => void;
};

export function IntakeStep({
  resumeText,
  jobDescriptionText,
  onResumeChange,
  onJobDescriptionChange,
  onSubmit,
}: IntakeStepProps) {
  const isValid = resumeText.trim().length > 0 && jobDescriptionText.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paste your materials</CardTitle>
        <CardDescription>
          Add your current resume and the job description you are targeting. Both
          fields are required to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="resume-text" className="text-sm font-medium">
              Raw resume
            </label>
            <Textarea
              id="resume-text"
              placeholder="Paste your full resume text here..."
              value={resumeText}
              onChange={(event) => onResumeChange(event.target.value)}
              className="min-h-64"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="job-description-text" className="text-sm font-medium">
              Target job description
            </label>
            <Textarea
              id="job-description-text"
              placeholder="Paste the job description you want to tailor your resume for..."
              value={jobDescriptionText}
              onChange={(event) => onJobDescriptionChange(event.target.value)}
              className="min-h-64"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end border-t-0 bg-transparent">
        <Button type="button" disabled={!isValid} onClick={onSubmit}>
          Optimize Resume
        </Button>
      </CardFooter>
    </Card>
  );
}
