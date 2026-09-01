import { OpenRouterServiceError, ResumeValidationError } from "./errors";

type ErrorDetails = {
  name: string;
  message: string;
  code?: string;
  cause?: unknown;
  validationIssues?: Array<{ path: string; message: string }>;
};

function safeCause(cause: unknown): unknown {
  if (cause instanceof Error) {
    return { name: cause.name, message: cause.message };
  }

  if (cause && typeof cause === "object") {
    return cause;
  }

  return cause ?? undefined;
}

export function describeGenerationError(error: unknown): ErrorDetails {
  if (error instanceof OpenRouterServiceError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
      cause: safeCause(error.cause),
    };
  }

  if (error instanceof ResumeValidationError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
      validationIssues: error.zodError?.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}

export function logGenerationError(error: unknown): void {
  console.error(`[resume-generation] Generation failed ${JSON.stringify(describeGenerationError(error))}`);
}
