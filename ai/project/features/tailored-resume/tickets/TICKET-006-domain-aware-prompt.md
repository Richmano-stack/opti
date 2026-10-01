---
id: TICKET-006
title: "Domain-aware prompt, target headline, and structured match summary"
type: feature
status: done
priority: P1

scope:
  summary: >
    Generalise the tailoring prompt so it works for any domain. The model identifies the
    job's primary domain, filters unrelated jargon and tools in either direction, writes a
    target professional headline, and returns a two-part match summary (strengths and gaps)
    shown beside the résumé.
  in_scope:
    - "Add an optional `headline` (max 120 characters) aligned with the target job, rendered under the name in preview and PDF, falling back to the latest role title."
    - "Prompt: identify the job's primary domain, strip tools and jargon foreign to it, reframe out-of-domain roles with transferable skills."
    - "Prompt: domain-neutral terminology-mirroring examples; keep the ban on added methods, metrics, and frameworks."
    - "Prompt: every bullet opens with a past-tense action verb and ends with a period."
    - "Replace the two-sentence `matchNote` string with `{ strengths, gaps }`, rendered as two labelled bullets."
    - "Prompt input tags renamed to `<master_resume>` and `<job_description>`."
  out_of_scope:
    - "Renaming the `resume` and `jobDescription` input fields used by forms and actions."
    - "Printing the match summary in the résumé or PDF."
    - "Scores or percentages."
    - "Changing preserved job titles inside experience entries."

files:
  create:
    - "ai/project/features/tailored-resume/tickets/TICKET-006-domain-aware-prompt.md"
  modify:
    - "src/services/ai/prompts.ts"
    - "src/services/ai/prompts.test.ts"
    - "src/services/ai/types.ts"
    - "src/services/ai/generation-contract.test.ts"
    - "src/services/ai/openrouter-schema.ts"
    - "src/services/ai/openrouter.test.ts"
    - "src/components/guest/guest-resume-preview.tsx"
    - "src/components/guest/guest-resume-preview.test.tsx"
    - "src/components/pdf/resume-pdf-document.tsx"
    - "src/components/pdf/resume-pdf-document.test.tsx"
    - "src/components/pdf/tailored-resume-result.tsx"
    - "src/components/pdf/tailored-resume-result.test.tsx"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-005"
  related: []

acceptance_criteria:
  - "The provider schema requires `headline` and `matchNote.strengths` / `matchNote.gaps`."
  - "Preview and PDF show `headline` under the name, or the latest role title when it is absent."
  - "The prompt forbids a headline from a different domain and any seniority or credential the source does not show."
  - "The prompt's domain-filtering rules are symmetric and contain no single-role rules."
  - "The review panel shows 'Core strengths' and 'Potential gaps' bullets, and neither appears in the preview or PDF."
  - "Bullets still normalise to a closing period."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "A target headline can overstate the candidate. The prompt limits it to the level and domain the source supports."
  - "Supersedes the no-headline part of DEC-001; recorded as DEC-003."
  - "Past tense for every bullet includes a current role, at the product owner's request."
---
