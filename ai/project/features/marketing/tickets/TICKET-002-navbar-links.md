---
id: TICKET-002
title: "Use Next.js Link for landing navbar section links"
type: fix
status: done
priority: P2

scope:
  summary: >
    Replace the landing navbar anchors to /#benefits, /#how-it-works, and
    /#privacy with next/link so production lint passes.
  in_scope:
    - "Switch those three navbar links to Link."
  out_of_scope:
    - "Changing same-page hash links inside the landing page footer."

files:
  create:
    - "ai/project/features/marketing/tickets/TICKET-002-navbar-links.md"
  modify:
    - "src/features/marketing/components/landing-navbar.tsx"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related: []

acceptance_criteria:
  - "pnpm lint reports no no-html-link-for-pages errors in the landing navbar."
  - "Why Opti still opens /#benefits."

definition_of_done:
  - "Lint passes"

notes: ""
---
