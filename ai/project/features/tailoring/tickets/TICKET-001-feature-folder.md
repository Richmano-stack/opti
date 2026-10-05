---
id: TICKET-001
title: "Move résumé tailoring into src/features/tailoring"
type: chore
status: done
priority: P2

scope:
  summary: >
    Move generation actions, the AI provider code, contact checks, the guest and
    account tailoring screens, and the PDF into src/features/tailoring.
    /try and /dashboard/generator stay in src/app. Account chrome stays in src/components/account.
  in_scope:
    - "Move services/ai, contact checks, guest screens, PDF, and the tailoring workspaces."
    - "Move the guest and account generation actions."
    - "Update remaining imports, including the dev sample fixture path."
  out_of_scope:
    - "Moving account sidebar, header, footer, or sign-out."
    - "Changing generation behavior."

files:
  create:
    - "ai/project/features/tailoring/tickets/TICKET-001-feature-folder.md"
  modify:
    - "src/app/try/page.tsx"
    - "src/app/dashboard/generator/page.tsx"
    - "src/services/dev/load-sample-inputs.ts"
    - "scripts/render-pdf-fixtures.tsx"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "auth TICKET-001"
  related: []

acceptance_criteria:
  - "Tailoring code lives under src/features/tailoring."
  - "/try and /dashboard/generator still render the same screens."
  - "No remaining imports of @/services/ai, @/components/guest, @/components/pdf, or @/app/actions/generate-resume."

definition_of_done:
  - "Tests pass"
  - "Routes are unchanged"

notes: "Account chrome stays in src/components/account."
---
