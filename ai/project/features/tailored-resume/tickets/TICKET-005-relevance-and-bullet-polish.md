---
id: TICKET-005
title: "Trim unrelated bullets, adopt close job synonyms, and punctuate bullets"
type: feature
status: done
priority: P1

scope:
  summary: >
    A Contact Centre Supervisor run kept full-stack and security-testing bullets and tools,
    used generic wording where the job had a close synonym, opened bullets with weak verbs,
    and left bullets without closing periods. Tighten the prompt and end every bullet with
    a period in validation.
  in_scope:
    - "Keep roles unrelated to the target job, but cut them to one or two bullets of transferable work, without unrelated tools."
    - "Leave unrelated technical tools out of the skills list."
    - "Replace source wording with the job's term when it is a close synonym for the same work."
    - "Name weak openers to avoid, such as Delivered, Coordinated, Assisted, Helped, Worked on, Responsible for."
    - "End every experience and project bullet with a period, in the prompt and in schema normalisation."
    - "The match note names job terms that could not be used because the source does not support them."
  out_of_scope:
    - "Adding a method, time, metric, or framework from the job description that the source does not state."
    - "Removing whole roles from the résumé."
    - "Inventing metrics to make bullets measurable."

files:
  create:
    - "ai/project/features/tailored-resume/tickets/TICKET-005-relevance-and-bullet-polish.md"
  modify:
    - "src/services/ai/prompts.ts"
    - "src/services/ai/prompts.test.ts"
    - "src/services/ai/types.ts"
    - "src/services/ai/generation-contract.test.ts"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-004"
  related: []

acceptance_criteria:
  - "The system prompt limits unrelated roles to one or two transferable bullets and drops their unrelated tools."
  - "The system prompt keeps unrelated technical tools out of skills."
  - "The system prompt gives close-synonym examples and keeps the ban on added methods, times, metrics, and frameworks."
  - "The system prompt lists weak opening verbs to avoid."
  - "Validated experience and project bullets end with terminal punctuation; a missing period is added."
  - "The match note instructions cover job terms the source does not support."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Trimming by relevance is model judgement and can cut a bullet the candidate wanted. Roles stay, so employment history is unchanged."
  - "Synonym swaps can drift into added claims. The existing ban on added frequency, method, scope, standard, or framework stays."

notes: "Follows a second MSC Contact Centre Supervisor run. The product owner chose close synonyms only; SMART, morning, and Pre-Travel NPS stay out unless the source states them."
---
