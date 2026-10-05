---
id: TICKET-001
title: "Move development sample fill into src/features/devtools"
type: chore
status: done
priority: P2

scope:
  summary: >
    Move the Fill sample button and its fixture loader into src/features/devtools.
    The development API route stays in src/app/api/dev.
  in_scope:
    - "Move the Fill sample button into src/features/devtools/components."
    - "Move the sample schema and fixture loader into src/features/devtools/lib."
    - "Update the guest, account, and master résumé callers, and the API route."
  out_of_scope:
    - "Moving the API route out of src/app."
    - "Changing when the button appears or which fixtures it loads."

files:
  create:
    - "ai/project/features/devtools/tickets/TICKET-001-feature-folder.md"
  modify:
    - "src/components/dev/dev-sample-fill.tsx"
    - "src/services/dev/sample-inputs.ts"
    - "src/services/dev/load-sample-inputs.ts"
    - "src/services/dev/sample-inputs.test.ts"
    - "src/app/api/dev/sample-inputs/route.ts"
    - "src/features/tailoring/components/guest/guest-tailoring-workspace.tsx"
    - "src/features/tailoring/components/account-tailoring-workspace.tsx"
    - "src/features/master-resume/components/master-resume-workspace.tsx"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "tailoring TICKET-001"
  related: []

acceptance_criteria:
  - "Fill sample code lives under src/features/devtools."
  - "GET /api/dev/sample-inputs stays at its current route."
  - "No remaining imports of @/components/dev or @/services/dev."

definition_of_done:
  - "Tests pass"
  - "The button still appears only in development"

notes: "The route file stays in src/app/api/dev."
---
