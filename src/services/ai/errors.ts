import type { ZodError } from "zod";
export type OpenRouterErrorCode = "OPENROUTER_CONFIGURATION_ERROR" | "OPENROUTER_CREDITS_EXHAUSTED" | "OPENROUTER_UNAUTHORIZED" | "OPENROUTER_RATE_LIMITED" | "OPENROUTER_TIMEOUT" | "OPENROUTER_UNAVAILABLE";
export class OpenRouterServiceError extends Error {
  constructor(readonly code: OpenRouterErrorCode, message: string, readonly cause?: unknown) { super(message); this.name = "OpenRouterServiceError"; }
}
export class ResumeValidationError extends Error {
  readonly code = "RESUME_VALIDATION_ERROR" as const;
  constructor(message: string, readonly zodError?: ZodError) { super(message); this.name = "ResumeValidationError"; }
}
export class InvalidInputError extends Error {
  readonly code = "INVALID_INPUT" as const;
  constructor(message: string) { super(message); this.name = "InvalidInputError"; }
}
