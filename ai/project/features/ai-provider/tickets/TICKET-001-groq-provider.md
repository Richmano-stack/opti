---
id: TICKET-001
title: "Add Groq as a configurable generation provider"
type: feature
status: done
priority: P1

scope:
  summary: >
    Add Groq beside Gemini and OpenRouter in the existing provider switch. Groq uses the same
    OpenAI-compatible chat completions request, so no SDK is added. The active provider is
    AI_PROVIDER when set, otherwise the first provider whose key is configured.
  in_scope:
    - "Provider id 'groq' with GROQ_API_KEY and GROQ_MODEL."
    - "Supported Groq model: openai/gpt-oss-120b."
    - "JSON mode for Groq, with the résumé JSON schema included in the system prompt."
    - "Pick the provider from configured keys when AI_PROVIDER is not set."
    - "Export the list of configured providers for a future selector."
    - "Parse Groq 429 and 413 token or request limits, including retry-after, into the existing rate-limited error."
    - "Show the retry wait time to the user when the provider gives one."
  out_of_scope:
    - "Streaming responses. Generation returns one validated JSON résumé."
    - "A provider selection dropdown in the UI."
    - "Automatic fallback to another provider after a failure."
    - "Adding the groq-sdk package."

files:
  create:
    - "src/services/ai/groq.test.ts"
  modify:
    - "src/services/ai/optimizeResume.ts"
    - "src/services/ai/errors.ts"
    - "src/services/ai/index.ts"
    - "src/app/actions/generate-resume.ts"
    - "src/app/actions/generate-resume.test.ts"
    - "e2e/account-generation.e2e.ts"
    - ".env.example"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related:
    - "ai/project/features/tailored-resume/tickets/TICKET-001-resume-document-contract.md"

acceptance_criteria:
  - "AI_PROVIDER=groq calls https://api.groq.com/openai/v1/chat/completions with Bearer GROQ_API_KEY."
  - "The Groq model is openai/gpt-oss-120b."
  - "An unsupported GROQ_MODEL fails with a configuration error before fetch."
  - "Groq requests use response_format json_object and include the résumé schema in the system prompt."
  - "With AI_PROVIDER unset, only GROQ_API_KEY configured selects Groq."
  - "A Groq 429 with retry-after maps to OPENROUTER_RATE_LIMITED with the limit type and retry seconds."
  - "The rate-limited user message includes the wait time when one is known."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Provider and generation action tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Groq free-tier tokens-per-minute limits are low. Large résumés can exceed them and return 413 or 429."
  - "Without strict schemas, Groq can return malformed résumé JSON. Zod validation still rejects it."

notes: "Error codes keep the OPENROUTER_ prefix so the existing UI mapping is unchanged."
---
