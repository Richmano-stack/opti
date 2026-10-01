---
id: TICKET-001
title: "Evolve the tailored résumé into a role-led document"
type: feature
status: done
priority: P1

scope:
  summary: >
    The tailored résumé is an evolution of the current generator, not a new product surface.
    The model still returns one grounded JSON résumé. This ticket changes that contract so
    experience leads, skills stay short, and certifications and projects have their own
    optional sections instead of being dumped into the skills list.
  in_scope:
    - "Cap skills at 12 and experience bullets at 6."
    - "Allow education to be an empty array."
    - "Add optional certifications and projects, including empty arrays."
    - "Tell the model to lead with experience and keep certifications out of skills."
    - "Keep every claim grounded in the source résumé."
  out_of_scope:
    - "Preview and PDF layout."
    - "A new page, template picker, or provider."
    - "Inventing employers, titles, dates, metrics, or a target-role headline field."

files:
  create:
    - "src/services/ai/prompts.test.ts"
  modify:
    - "src/services/ai/types.ts"
    - "src/services/ai/openrouter-schema.ts"
    - "src/services/ai/prompts.ts"
    - "src/services/ai/generation-contract.test.ts"
    - "src/services/ai/generation-contract-limits.test.ts"
    - "src/services/ai/openrouter.test.ts"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks:
    - "TICKET-002"
  blocked_by: []
  related: []

acceptance_criteria:
  - "A résumé with 13 skills fails validation, and one with 12 skills passes."
  - "A role with 7 bullets fails validation."
  - "A résumé with an empty education array passes validation."
  - "Certifications and projects are accepted when present and may be omitted."
  - "The system prompt orders sections as contact, summary, experience, skills, education, certifications, projects."
  - "The Gemini schema still omits additionalProperties, and nullable certification fields are not required."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Contract and provider tests pass"
  - "Only files listed in this ticket were modified for this ticket"

risks:
  - "Strict JSON schema must list the new arrays as required so providers return empty arrays instead of dropping the keys. Zod still accepts omission so existing fixtures keep parsing."

notes: "Feature evolvement of the existing tailored résumé. The headline under the name is derived at render time from the latest role, not stored on this contract."
---
