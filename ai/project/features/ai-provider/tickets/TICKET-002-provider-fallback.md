---
id: TICKET-002
title: "Fall back to the next configured provider after a failed generation"
type: feature
status: done
priority: P1

scope:
  summary: >
    One failed provider currently fails the whole request. Try the configured providers in
    order, starting with AI_PROVIDER when it is set, and return the first valid résumé.
    Remember a rate limit so later requests skip that provider until it can be tried again.
  in_scope:
    - "Order: the AI_PROVIDER value first when it is configured, then gemini, groq, and openrouter."
    - "Try the next provider after a rate limit, timeout, network error, 5xx, rejected credentials, exhausted credits, or invalid model JSON."
    - "Stop before any provider when the résumé or job description is invalid."
    - "Try each provider at most once per request, with a 30 second attempt limit and a 75 second budget. Skip a new attempt when under 15 seconds remain."
    - "Remember rate limits in process memory, defaulting to 60 seconds when the provider gives no retry time."
    - "When every provider is rate limited, report the soonest retry time."
    - "Log the provider that answered and each provider that failed, without response bodies."
  out_of_scope:
    - "A second attempt against the same provider in one request."
    - "A provider selector in the UI."
    - "Persisting rate limits across server processes."
    - "Changes to the prompt or the résumé schema."

files:
  create:
    - "ai/project/features/ai-provider/tickets/TICKET-002-provider-fallback.md"
    - "src/services/ai/provider-fallback.test.ts"
  modify:
    - "src/services/ai/optimizeResume.ts"
    - "src/services/ai/groq.test.ts"
    - "src/services/ai/openrouter.test.ts"
    - "src/services/ai/openrouter-errors.test.ts"
    - ".env.example"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-001"
  related: []

acceptance_criteria:
  - "A rate-limited provider is followed by the next configured provider, and that provider's résumé is returned."
  - "Malformed JSON from one provider is followed by a valid résumé from the next."
  - "When every provider is rate limited, the error is rate limited and its wait is the shortest retry time."
  - "A later request does not call a provider that is still inside its retry window."
  - "Invalid input throws before any provider is called."
  - "AI_PROVIDER still chooses the first attempt."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Fallback can take up to 75 seconds. Each attempt is capped at 30 seconds so one stalled provider cannot use the whole budget."
  - "The cooldown map is per server process. Another instance can still call a rate-limited provider once."

notes: "Gemini stays first when AI_PROVIDER is blank because its JSON schema is enforced by the provider. Groq is second. OpenRouter is last."
---
