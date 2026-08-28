# OPTI-002: Replace Gemini with OpenRouter

**Objective:** Make OpenRouter the only AI provider using a small server-only `fetch` adapter.

**User value:** Resume tailoring runs through the chosen provider with understandable failures and configurable model selection.

## Scope

- Implement the OpenRouter chat-completions request using `OPENROUTER_API_KEY` and `OPENROUTER_MODEL`.
- Send optional application attribution headers when configured.
- Require structured JSON, extract it defensively, and validate it with the OPTI-001 schema.
- Normalize configuration, authentication, rate-limit, timeout, upstream, and invalid-output failures.
- Remove the Gemini SDK and Gemini-specific implementation after replacement tests pass.

## Not included

- Streaming, model fallback chains, retries across providers, usage accounting, or prompt experimentation infrastructure.

## Acceptance criteria

- [ ] No production code or dependency references Gemini.
- [ ] Tests mock `fetch` and cover success plus representative OpenRouter failures.
- [ ] Neither API keys nor resume/job-description content appears in logs or returned errors.

## Verification

- [ ] Provider tests pass without a live API call.
- [ ] One manual call succeeds with developer-provided OpenRouter configuration.
- [ ] Lint, typecheck, and build pass.

**Dependencies:** OPTI-001
**Estimated scope:** Medium
**Likely areas:** `src/services/ai`, `.env.example`, `package.json`, lockfile
