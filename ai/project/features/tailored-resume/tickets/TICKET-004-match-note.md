---
id: TICKET-004
title: "Show a two-sentence match note beside the tailored résumé"
type: feature
status: done
priority: P1

scope:
  summary: >
    Candidates cannot see which job requirements their résumé does not show, including
    dealbreakers such as right to work or travel. Ask the model for a two-sentence note
    for the candidate and show it on screen above the résumé. The note is never part of
    the résumé preview or the PDF.
  in_scope:
    - "Add an optional `matchNote` string (max 600 characters) to the generation output."
    - "Require `matchNote` in the provider JSON schema so the model always writes one."
    - "Prompt: sentence one names the strongest source-backed matches; sentence two names job requirements the source does not show, eligibility requirements first."
    - "Render the note in `TailoredResumeResult`, above the PDF controls, for guest and account flows."
  out_of_scope:
    - "Scores, percentages, ratings, or keyword counts."
    - "Printing the note in the résumé preview or the PDF."
    - "Persisting the note."
    - "Advice to add requirements the source does not show."

files:
  create:
    - "ai/project/features/tailored-resume/tickets/TICKET-004-match-note.md"
  modify:
    - "src/services/ai/types.ts"
    - "src/services/ai/openrouter-schema.ts"
    - "src/services/ai/openrouter.test.ts"
    - "src/services/ai/generation-contract.test.ts"
    - "src/services/ai/prompts.ts"
    - "src/services/ai/prompts.test.ts"
    - "src/components/pdf/tailored-resume-result.tsx"
    - "src/components/pdf/tailored-resume-result.test.tsx"
    - "src/components/guest/guest-resume-preview.test.tsx"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-003"
  related: []

acceptance_criteria:
  - "The provider schema requires `matchNote` as a string of at most 600 characters."
  - "Output without `matchNote` still validates, and a note over 600 characters fails."
  - "The system prompt describes the two sentences and forbids scores and invented experience."
  - "The review panel shows the note under a 'Match note' label with text saying it is not in the PDF."
  - "The résumé preview does not render the note, and the PDF document does not read it."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "The product spec excludes scoring. The note is prose with no score, and DEC-002 records this."
  - "The model may soften gaps into suggestions to claim them. The prompt names the gap as missing and forbids advice to add it."

notes: "Follows feedback from an MSC Contact Center Supervisor run, where right to work in the UK and travel-industry experience were unflagged."
---
