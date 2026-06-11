import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type WizardStepId = "intake" | "processing" | "deliverable";

const STEPS: { id: WizardStepId; label: string; number: number }[] = [
  { id: "intake", label: "Intake", number: 1 },
  { id: "processing", label: "Processing", number: 2 },
  { id: "deliverable", label: "Deliverable", number: 3 },
];

type WizardStepperProps = {
  currentStep: WizardStepId;
};

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Resume optimization progress" className="w-full">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <Badge
                  variant={isCurrent ? "default" : isComplete ? "secondary" : "outline"}
                  className={cn(
                    "size-7 justify-center rounded-full p-0 text-xs font-semibold",
                    isCurrent && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                  )}
                >
                  {step.number}
                </Badge>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className={cn(
                    "hidden h-px w-8 sm:block sm:w-16",
                    isComplete ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
