---
id: TICKET-003
title: "Provide default parameter for LandingNavbar and render as JSX in LandingPage"
type: fix
status: done
priority: P1

scope:
  summary: >
    Fix runtime TypeError where LandingNavbar fails with 'Cannot read properties of
    undefined (reading guest)' when called with no arguments in LandingPage or other consumers.
  in_scope:
    - "Add default parameter `{ guest = false, floating = true }: LandingNavbarProps = {}` to `LandingNavbar`."
    - "Render `<LandingNavbar />` as standard JSX inside `LandingPage`."
    - "Update `KNOWN_ISSUES.md` to mark ISSUE-001 as resolved."
  out_of_scope:
    - "Redesigning navbar links or styling."

files:
  create:
    - "ai/project/features/marketing/tickets/TICKET-003-landing-navbar-default-props.md"
  modify:
    - "src/features/marketing/components/landing-navbar.tsx"
    - "src/features/marketing/components/landing-page.tsx"
    - "ai/project/memory/KNOWN_ISSUES.md"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related: []

acceptance_criteria:
  - "LandingNavbar can be rendered or called with zero arguments without throwing TypeError."
  - "LandingPage renders LandingNavbar via JSX element."
  - "Typecheck, lint, and marketing test suites pass."

definition_of_done:
  - "Lint passes"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks: "None; minimal signature fallback addition."

notes: "Resolves runtime issue ISSUE-001."
---
