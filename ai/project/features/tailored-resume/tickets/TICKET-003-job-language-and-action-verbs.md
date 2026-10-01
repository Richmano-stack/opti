---
id: TICKET-003
title: "Mirror job wording and lead bullets with action verbs"
type: feature
status: done
priority: P1

scope:
  summary: >
    Tailored résumés describe the right experience but in the source's generic wording,
    and bullets do not start with action verbs. Tighten the prompt so it reuses the job
    description's terminology where the source supports it, and opens every bullet with
    a strong verb, without weakening source grounding.
  in_scope:
    - "Use job-description terminology only for work the source résumé already shows."
    - "Never use job wording to add a frequency, method, scope, or standard the source does not state."
    - "Open every experience and project bullet with a varied action verb."
    - "Do not claim eligibility such as right to work, clearance, licences, or travel unless the source states it."
  out_of_scope:
    - "Markdown section headings. Output stays JSON and the renderer draws headings."
    - "A gap analysis or match summary."
    - "Changes to the résumé JSON schema, preview, or PDF."

files:
  create:
    - "ai/project/features/tailored-resume/tickets/TICKET-003-job-language-and-action-verbs.md"
  modify:
    - "src/services/ai/prompts.ts"
    - "src/services/ai/prompts.test.ts"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-001"
  related: []

acceptance_criteria:
  - "The system prompt tells the model to reuse job-description terminology only when the source shows the same work."
  - "The system prompt forbids job wording that adds an unstated frequency, method, scope, or standard."
  - "The system prompt requires every experience and project bullet to start with an action verb."
  - "The system prompt forbids claiming unstated eligibility requirements."
  - "The user prompt asks the model to identify the job's key terms before rewriting."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Prompt tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Keyword mirroring can drift into claims the source does not support. The grounding rules stay first and the new rules name the forbidden additions."

notes: "Follows feedback from an MSC Contact Center Supervisor run."
---
