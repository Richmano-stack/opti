import type { ZodError } from "zod";

export class GeminiServiceError extends Error {
  readonly code = "GEMINI_SERVICE_ERROR" as const;

  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "GeminiServiceError";
  }
}

export class ResumeValidationError extends Error {
  readonly code = "RESUME_VALIDATION_ERROR" as const;

  constructor(
    message: string,
    readonly zodError?: ZodError,
    readonly rawPayload?: unknown,
  ) {
    super(message);
    this.name = "ResumeValidationError";
  }
}

export class InvalidInputError extends Error {
  readonly code = "INVALID_INPUT" as const;

  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}
