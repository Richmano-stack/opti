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

## DEC-005: One ink-on-paper résumé layout

**Date:** 2026-10-02
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** DEC-010 (PDF rendering only)

### Context

The preview used the app's brand color for section labels, so the document read as part of the interface. Extra templates and plan gating are not in scope yet.

### Decision

There is one résumé design, shared by the preview and the PDF. It is a single column: centered name, headline, and contact line, then sections with a full-width rule under a small uppercase label. Text is ink on white. The match note stays outside the page. A template registry waits until a second design is needed.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Restyle the current page | One design to judge | Preview and PDF styles are written twice |
| Template registry now | Ready for more designs | Extra structure before the first design is settled |

### Consequences

**Positive:**

- The downloaded PDF matches the page on screen
- The résumé is not colored like the app

**Negative:**

- A second design will need a registry that does not exist yet

### References

- ai/project/features/tailored-resume/tickets/TICKET-007-simple-resume-design.md

## DEC-006: Unified Canva-style resume studio for guest and account tailoring

**Date:** 2026-10-05
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

Previously, `/try` (guest) and `/dashboard/generator` (account) had separate page flows. `/try` forced users through a 2-step marketing/form wizard before showing the preview, while `/dashboard/generator` lived in a dashboard shell. Both flows required a unified, editor-like experience reminiscent of Canva (tools on the left, central paper desk canvas, top app header).

### Decision

Unify guest and authenticated tailoring into a single `ResumeStudio` component. The studio delivers:
1. Direct canvas landing on second 1 (no multi-step wizard screen-flipping).
2. A top application header with target role label, status, and PDF export.
3. A left sidebar containing source inputs (guest inputs both master résumé and job description; account recognizes the saved master résumé and requires only the job description). After generation, the sidebar presents match insights (skills pills, core strengths, and potential gaps).
4. A central paper canvas desk hosting a strictly 1-page ATS ink-on-paper résumé sheet with zoom controls (80%–120%) and copy-to-clipboard.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Separate guest and account editor implementations | Isolates auth from guest code | Code duplication, diverging UX and maintenance overhead |
| Multi-step wizard before editor | Separates data entry from viewing | Feels like a form rather than a creative studio |
| Multi-page canvas layout | Supports long resumes | Complex page breaks and ATS formatting regressions |

### Consequences

**Positive:**

- Single unified studio codebase powers both `/try` and `/dashboard/generator`
- Canva-like paper desk gives instant visual grounding and clear MVP focus
- Strictly 1-page paper constraint ensures clean ATS layout without page break issues

**Negative:**

- Candidates with extensive career history must tailor content to fit the 1-page format

### References

- ai/project/features/tailoring/tickets/TICKET-002-unified-resume-studio.md

## DEC-007: Segmented tabs and stacked preflight buttons in resume studio

**Date:** 2026-10-05
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

Stacking two 30k–50k character textareas in the left studio sidebar forced endless vertical scrolling and double-nested scrollbars. Furthermore, `ContactInformationPreflight` placed two buttons with long text labels side-by-side using `sm:grid-cols-2`, which caused text overlap and collision in narrow sidebar containers (~320px–380px).

### Decision

1. Use segmented tabs in the sidebar (`[ 🎯 Job Description ]  [ 📄 Master Résumé ]`) so only one document textarea is vertically active at a time, with live character count badges and document readiness status. Both inputs remain mounted in the DOM to preserve `FormData` serialization.
2. In `ContactInformationPreflight`, stack action buttons vertically (`flex flex-col gap-2`) with full-width primary ("Add details and continue") using the official Opti `horizon-primary` brand color (`#b42907` terracotta) and outline secondary ("Continue without them") styles, completely removing the legacy `brand-action` sky-blue gradient. Input focus states align with `horizon-secondary`.
3. Fix the sidebar width to a comfortable `380px` (laptop) / `400px` (desktop) to ensure ample breathing room for inputs and canvas centering.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Accordion expand/collapse for both textareas | Keeps both accessible | Clicking accordions repeatedly adds friction |
| Modal dialog for contact preflight | Complete visual separation | Disrupts Canva-like canvas flow with popup overlay |
| Segmented tabs with stacked preflight buttons | Calm layout, zero collisions, zero scroll fatigue | Users switch tabs to review alternate document |

### Consequences

**Positive:**

- Eliminates nested scrollbars and scroll fatigue
- Eliminates button collision bug permanently
- Clear document readiness indicators and character counts on tabs

**Negative:**

- User toggles tabs to switch between viewing résumé and job posting text

### References

- ai/project/features/tailoring/tickets/TICKET-003-studio-ux-refinement.md

## DEC-008: Signed-in hub and studio share the try frame

**Date:** 2026-10-06
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

`/try` is a full-screen studio. `/dashboard` and the missing-source state of `/dashboard/generator` still mounted `AuthenticatedAppShell`, with a workspace sidebar and a second header. The signed-in product read as a different app from the guest studio.

### Decision

Both signed-in pages use a full-screen frame. `AccountBar` carries the Opti mark, the page title, optional actions, the user's initials, and sign out. `/dashboard` shows the saved master résumé on the same paper sheet as the studio, with Tailor for a role as the primary action and editing in the existing dialog. `/dashboard/generator` keeps `ResumeStudio`. Its account header adds a link back to the master résumé. A user with no saved source sees that same frame and one action back to the hub. `AuthenticatedAppShell` stays in the codebase and is no longer mounted by these routes.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Keep the dashboard shell around the studio | Familiar app navigation | Two headers and a sidebar beside a full-screen editor |
| Fold the master résumé editor into the studio sidebar | One URL | The source and the tailored draft compete for the same rail |

### Consequences

**Positive:**

- Guest and signed-in tailoring share one studio
- The hub is a source page in the same visual system

**Negative:**

- Moving between the hub and the studio is a page change, not a sidebar click

### References

- ai/project/features/tailoring/tickets/TICKET-004-aligned-account-pages.md

## DEC-009: Verification and password reset use Resend links

**Date:** 2026-10-06
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

Email-and-password accounts were created without confirming the address, and there was no way to set a new password. Better Auth 1.6 already stores verification tokens and can require a verified email before a session. The product needed a sender for those links.

### Decision

Resend sends both messages through `POST https://api.resend.com/emails`, using `RESEND_API_KEY` and `RESEND_FROM`. Sign-up sends a verification link and does not create a session until that link is opened. Sign-in of an unverified account returns forbidden and the sign-in screen can send the verification link again. Forgot password calls Better Auth `requestPasswordReset` with an absolute `redirectTo` of `/reset-password`. The emailed URL is Better Auth's reset callback, which lands on that page with `?token=`. The same confirmation is shown whether or not the email has an account. Passwordless session sign-in is not part of this flow.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Better Auth magic-link plugin as the session | No password | Replaces the password accounts already in use |
| Resend SDK | Typed client | Extra dependency for one POST |
| Await the Resend call inside the auth handler | Simpler control flow | Response time can reveal whether the address exists |

### Consequences

**Positive:**

- A new account cannot open a session until the address is confirmed
- A lost password is replaced from the link without a support step

**Negative:**

- Accounts created before this change have `emailVerified` false and must use a verification link before they can sign in
- Production mail fails until `RESEND_API_KEY` and a verified `RESEND_FROM` are set

### References

- ai/project/features/auth/tickets/TICKET-002-resend-verification-and-reset.md
- https://www.better-auth.com/docs/authentication/email-password
- https://resend.com/docs/api-reference/emails/send-email

## DEC-010: The HTML template is the PDF

**Date:** 2026-10-09
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** DEC-005 (PDF rendering only)
**Superseded by:** N/A

### Context

The studio paper is a Tailwind template from the registry. The download was a separate `@react-pdf/renderer` document, so Modern on screen was two columns and the file was a single column with a colored header. That library cannot use the template's CSS. The résumé is already limited to one Letter page.

### Decision

The registry template is the only layout. Download POSTs the résumé and template id to `/api/resume-pdf`. The route stores them under a random token in process memory for 30 seconds, opens `/print/resume?token=…` in headless Chromium, and returns `page.pdf()` for a Letter page with backgrounds and no margin. The browser saves that blob with the existing filename helper. Callers that omit a template id download Minimal. `@react-pdf/renderer` is removed once that file matches the studio paper.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Preview the react-pdf blob in the studio | Screen and file are the same bytes | Design stays inside the react-pdf flex subset |
| Rasterize the HTML in the browser | No server browser | Text is not selectable, which breaks an ATS read |
| Keep both layout engines | No new runtime | The two pages drift again |

### Consequences

**Positive:**

- A new template is drawn once, in the registry component
- The downloaded text stays selectable

**Negative:**

- The Node server that runs `next start` must be able to launch Chromium
- The token map is local to one process
- Georgia and Segoe UI may be missing on Linux, so the file can use fallback fonts
- Content past 11 inches is clipped

### References

- ai/project/features/tailoring/tickets/TICKET-007-html-resume-pdf.md
- ai/project/features/tailoring/PLAN-html-pdf.md

---

## DEC-011: The studio shows the Letter sheet the PDF prints

**Date:** 2026-10-09
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** N/A
**Superseded by:** N/A

### Context

The registry template is the only résumé layout (DEC-010). The studio still drew that template at its natural height, and the PDF then shrank the sheet to fit one Letter page. The type on screen was larger than the file. A per-template font tweak would drift again as soon as another template was added.

### Decision

Preview and download both render the template inside `ResumeSheet`. That sheet is a fixed Letter page. It measures the template once, applies `resumeFitScale`, and centers the result. Chromium waits until that fit has finished, then prints the page at scale 1. The canvas zoom control scales the finished page visually and does not change the layout. Templates take their column and type size from the sheet container, not from the browser window.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Shrink only the current template's type | Matches this one file | The next template repeats the mismatch |
| Leave the preview unscaled and stop fitting the PDF | Screen type stays large | Long résumés spill off the Letter page |
| Screenshot the preview | Bytes match the screen | The PDF text is no longer selectable |

### Consequences

**Positive:**

- A new registry template is shown and downloaded from the same sheet
- The type size on screen is the type size in the file

**Negative:**

- A résumé taller than Letter is drawn smaller on screen as well as in the file, so the whole page stays visible
- Georgia and Segoe UI may still be missing on Linux, so a server without those fonts can differ from the designer's screen

### References

- src/templates/resume-sheet.tsx
- src/templates/letter-page.ts

---

## DEC-012: A résumé may continue onto the next Letter page

**Date:** 2026-10-09
**Status:** accepted
**Deciders:** Product owner
**Supersedes:** DEC-011 (fit-to-one-page scaling only)
**Superseded by:** N/A

### Context

DEC-011 put the preview and the PDF on one shared Letter sheet, then shrank that sheet until it fit on a single page. The type on screen and in the file matched, and both were smaller than the template's real size. The product owner accepts more than one page.

### Decision

The shared sheet keeps the template's real type size and the Letter width. It does not scale down. Chromium paginates the same sheet onto as many Letter pages as the content needs. The studio shows that full-size sheet. Jobs, education entries, and list lines stay together across a page break.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Keep shrinking to one page | Every file is a single page | The type is smaller than the template |
| Clip anything past 11 inches | One page, full type | The rest of the résumé is missing |

### Consequences

**Positive:**

- Preview and download keep the template's type size
- A long résumé stays complete

**Negative:**

- Some downloads are more than one page
- A page break can still fall between sections

### References

- src/templates/resume-sheet.tsx
