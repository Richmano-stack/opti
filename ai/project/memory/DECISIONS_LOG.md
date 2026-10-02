> **Type: PROJECT-SPECIFIC** | Customize for your product. Update as requirements and context evolve.

# Decisions Log

---

## Purpose

The decisions log records **significant architectural and technical decisions** with context, rationale, and consequences. It prevents re-litigating settled choices and gives AI agents historical context.

**Update this file when:**

- A non-trivial technical choice is made (framework, pattern, data model approach)
- An existing decision is superseded by a new one
- A deliberate trade-off is accepted with documented reasoning

**Do not log:**

- Routine implementation choices obvious from existing patterns
- Ticket-level bug fix approaches
- Formatting or style preferences (those belong in TECH_RULES.md)

---

## Instructions

1. **Use ADR (Architecture Decision Record) format** for each entry.
2. **Assign a sequential ID:** `DEC-001`, `DEC-002`, etc.
3. **Include status:** `proposed`, `accepted`, `deprecated`, `superseded`.
4. **Write for a future reader** who was not in the discussion.
5. **Document consequences** — both positive and negative.
6. **Link superseded entries** to their replacement.
7. **Keep entries immutable.** Do not edit accepted decisions; add a new entry that supersedes them.

---

## Template

```markdown
# Decisions Log

**Last updated:** 2026-10-02

---

## DEC-<!-- FILL: 001 -->: <!-- FILL: Short decision title -->

**Date:** <!-- FILL: YYYY-MM-DD -->
**Status:** <!-- FILL: proposed | accepted | deprecated | superseded -->
**Deciders:** <!-- FILL: names or roles -->
**Supersedes:** <!-- FILL: DEC-xxx or N/A -->
**Superseded by:** <!-- FILL: DEC-xxx or N/A -->

### Context

<!-- FILL: What situation or problem prompted this decision? -->

### Decision

<!-- FILL: What was decided? State clearly and specifically. -->

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

### Consequences

**Positive:**

- <!-- FILL -->

**Negative:**

- <!-- FILL -->

**Neutral:**

- <!-- FILL -->

### References

- <!-- FILL: Links to tickets, PRs, docs -->
```

---

## Examples

> **Note:** Fictional example for format demonstration only.

```markdown
## DEC-001: Use Server Actions for all mutations

**Date:** 2026-01-10
**Status:** accepted
**Deciders:** Tech Lead, Backend Engineer
**Supersedes:** N/A
**Superseded by:** N/A

### Context

The MVP requires create, update, and delete operations for tasks. We need to choose between API Route Handlers and Server Actions for mutations.

### Decision

All data mutations will use your framework Server Actions with Zod validation. API Route Handlers are reserved for webhooks and third-party callbacks only.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Server Actions | Type-safe, colocated with features, built-in CSRF | Less familiar to some team members |
| API Route Handlers | RESTful, familiar pattern | More boilerplate, separate type contracts |
| tRPC | End-to-end type safety | Additional dependency, overkill for MVP scope |

### Consequences

**Positive:**

- Mutations are colocated in feature modules
- Zod schemas serve as single validation source
- No separate API contract to maintain

**Negative:**

- Team must learn Server Action error handling patterns
- Harder to expose mutations to non-your framework clients (acceptable for MVP)

### References

- Ticket: TICKET-003
- PR: #12
```

## DEC-001: Keep one grounded résumé and lead it with roles

**Date:** 2026-09-30
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

Tailored output was a required skills list of up to 50 phrases, followed by experience. Certifications had no section, so they landed in skills and the page read as an inventory.

### Decision

Evolve the existing tailored-résumé contract. Cap skills at 12 and role bullets at 6. Add optional certifications and projects. Allow education to be empty. Do not add a headline field; renderers use the latest role title. Grounding rules stay in force.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| New résumé product with templates | More visual range | New surface before the current output is readable |
| Prompt-only rewrite | Smaller diff | Schema still requires a long skills list and prints it first |
| Role-led contract | Same generator, résumé-shaped document | Providers must return the new arrays |

### Consequences

**Positive:**

- Experience is the body of the document
- Certifications and projects no longer inflate skills

**Negative:**

- Older model output with more than 12 skills or 6 bullets fails validation

### References

- ai/project/features/tailored-resume/tickets/TICKET-001-resume-document-contract.md
- ai/project/features/tailored-resume/tickets/TICKET-002-role-led-resume-layout.md

## DEC-002: Show gaps as a private note, never in the résumé

**Date:** 2026-10-01
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

Candidates could not see which job requirements their résumé did not show, such as right to work in the UK. A gap analysis at the top of the résumé would print in the PDF sent to employers. The product spec excludes scoring.

### Decision

The model returns an optional two-sentence `matchNote`: the strongest matches, then the missing requirements with eligibility first. `TailoredResumeResult` shows it above the résumé with a label saying it is not in the PDF. The résumé preview and PDF never read it. It carries no score, percentage, or keyword count, and it is not persisted.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Gap analysis at the top of the résumé | One place to read | Prints gaps into the employer-facing PDF |
| Match score | Familiar in other tools | Excluded by the product spec; implies precision it lacks |
| Private prose note | Flags dealbreakers before applying | One more field the model must write |

### Consequences

**Positive:**

- Dealbreakers are visible before the candidate downloads

**Negative:**

- The note is model judgement and can miss a requirement

### References

- ai/project/features/tailored-resume/tickets/TICKET-004-match-note.md

## DEC-003: Target-domain headline and structured match note

**Date:** 2026-10-01
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** DEC-001 (headline rule only), DEC-002 (note format only)
**Superseded by:** N/A

### Context

The header showed the latest role title, which misled when the candidate was changing domain, for example a developer applying to supervise a contact centre. The two-sentence match note was harder to scan than labelled points.

### Decision

The model returns an optional `headline` aligned with the target job's domain, limited to the level and credentials the master résumé supports. Preview and PDF show it under the name and fall back to the latest role title. `matchNote` becomes `{ strengths, gaps }`, rendered as "Core strengths" and "Potential gaps" bullets in the review panel only. Everything else in DEC-001 and DEC-002 stands.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Keep the latest role title | Always factual | Wrong domain for career changers |
| Copy the job title verbatim | Strongest ATS match | Claims a role or level the candidate may not hold |
| Model-chosen headline with grounding limits | Matches the job's domain truthfully | Model judgement on level |

### Consequences

**Positive:**

- The header reads in the target job's language
- Strengths and gaps scan as two labelled points

**Negative:**

- A headline is model judgement and must be reviewed before download

### References

- ai/project/features/tailored-resume/tickets/TICKET-006-domain-aware-prompt.md

## DEC-004: Fall back across configured generation providers

**Date:** 2026-10-02
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

Gemini, Groq, and OpenRouter can each fail independently through rate limits, timeouts, or malformed JSON. A failure from the first provider ended the request even when another configured key could answer.

### Decision

`optimizeResume` tries each configured provider at most once. `AI_PROVIDER` is tried first when its key is set; otherwise the order is Gemini, Groq, then OpenRouter. Rate limits, timeouts, transport failures, credential and credit errors, and invalid JSON move to the next provider. A rate limit is remembered in process memory until its retry time, or 60 seconds when the provider gives none. The request budget is 75 seconds, and each attempt is capped at 30 seconds. Invalid input is rejected before any provider is called.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Retry the same provider | Simple | Repeats a failure the model is likely to repeat, and waits out a rate limit |
| Fail over immediately | Uses the keys the user already configured | A request can take longer, and wording varies by model |
| Queue until the rate limit lifts | One model stays consistent | The user waits while another key is idle |

### Consequences

**Positive:**

- One busy or broken key no longer stops generation
- Later requests skip a provider until its retry window passes

**Negative:**

- The cooldown is per server process, so another instance can still call a limited provider
- A fallback résumé can read differently from the preferred model's wording

### References

- ai/project/features/ai-provider/tickets/TICKET-002-provider-fallback.md
