import { OpenRouterServiceError, InvalidInputError, ResumeValidationError } from "./errors";
import { AI_PROVIDERS, configuredProviders, providerConfig, type AiProvider } from "./ai-provider-config";
import { requestResume } from "./request-resume";
import { generationInputSchema, type OptimizeResumeInput, type OptimizedResume } from "./types";

export { AI_PROVIDERS, GROQ_MODELS, configuredProviders, type AiProvider } from "./ai-provider-config";

const ATTEMPT_TIMEOUT_MS = 30_000;
const REQUEST_BUDGET_MS = 75_000;
const MIN_ATTEMPT_MS = 15_000;
const DEFAULT_COOLDOWN_SECONDS = 60;

const unavailableUntil = new Map<AiProvider, number>();

export function resetProviderAvailability(): void {
  unavailableUntil.clear();
}

function providerOrder(now = Date.now()): AiProvider[] {
  const configured = configuredProviders();
  const preferred = process.env.AI_PROVIDER?.trim().toLowerCase() ?? "";
  const first = AI_PROVIDERS.find((provider) => provider === preferred && configured.includes(provider));
  const ordered = first ? [first, ...configured.filter((provider) => provider !== first)] : configured;
  return ordered.filter((provider) => (unavailableUntil.get(provider) ?? 0) <= now);
}

function soonestCooldownSeconds(now = Date.now()): number | undefined {
  const waits = [...unavailableUntil.values()]
    .filter((until) => until > now)
    .map((until) => Math.ceil((until - now) / 1000));
  return waits.length > 0 ? Math.min(...waits) : undefined;
}

function rememberRateLimit(provider: AiProvider, error: OpenRouterServiceError): number {
  const seconds = error.rateLimit?.retryAfterSeconds ?? DEFAULT_COOLDOWN_SECONDS;
  unavailableUntil.set(provider, Date.now() + seconds * 1000);
  return seconds;
}

export async function optimizeResume(input: OptimizeResumeInput): Promise<OptimizedResume> {
  const parsedInput = generationInputSchema.safeParse(input);
  if (!parsedInput.success) throw new InvalidInputError(parsedInput.error.issues[0]?.message ?? "Invalid generation input.");

  const deadline = Date.now() + REQUEST_BUDGET_MS;
  const rateLimitWaits: number[] = [];
  let lastError: OpenRouterServiceError | ResumeValidationError | undefined;

  for (const provider of providerOrder()) {
    const remaining = deadline - Date.now();
    if (remaining < MIN_ATTEMPT_MS) break;

    try {
      const resume = await requestResume(providerConfig(provider), parsedInput.data, Math.min(ATTEMPT_TIMEOUT_MS, remaining));
      console.info(`[resume-generation] ${provider} completed`);
      return resume;
    } catch (error) {
      if (!(error instanceof OpenRouterServiceError || error instanceof ResumeValidationError)) throw error;
      console.error(`[resume-generation] ${provider} failed: ${error.code}`);
      lastError = error;
      if (error instanceof OpenRouterServiceError && error.code === "OPENROUTER_RATE_LIMITED") {
        rateLimitWaits.push(rememberRateLimit(provider, error));
      }
    }
  }

  if (lastError instanceof OpenRouterServiceError && lastError.code === "OPENROUTER_RATE_LIMITED" && rateLimitWaits.length > 1) {
    const retryAfterSeconds = Math.min(...rateLimitWaits);
    throw new OpenRouterServiceError("OPENROUTER_RATE_LIMITED", "Generation provider rate limit reached.", lastError.cause, { retryAfterSeconds });
  }
  if (lastError) throw lastError;

  const retryAfterSeconds = soonestCooldownSeconds();
  if (retryAfterSeconds) {
    throw new OpenRouterServiceError("OPENROUTER_RATE_LIMITED", "Generation provider rate limit reached.", undefined, { retryAfterSeconds });
  }
  throw new OpenRouterServiceError("OPENROUTER_CONFIGURATION_ERROR", "AI provider is not configured.");
}
