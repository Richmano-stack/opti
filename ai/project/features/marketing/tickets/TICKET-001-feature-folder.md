---
id: TICKET-001
title: "Move the landing page into src/features/marketing"
type: chore
status: done
priority: P2

scope:
  summary: >
    Move the landing sections under src/features/marketing. Move BrandMark to
    src/components because auth, the app shell, and the account chrome use it.
    The home route stays in src/app.
  in_scope:
    - "Move landing components into src/features/marketing/components."
    - "Move BrandMark to src/components/brand-mark.tsx."
    - "Update imports in the home page, guest try page, auth shell, and account chrome."
  out_of_scope:
    - "Moving auth or tailoring."
    - "Changing landing behavior."

files:
  create:
    - "ai/project/features/marketing/tickets/TICKET-001-feature-folder.md"
  modify:
    - "src/components/brand-mark.tsx"
    - "src/features/marketing/components/landing-page.tsx"
    - "src/features/marketing/components/landing-navbar.tsx"
    - "src/app/page.tsx"
    - "src/components/guest/guest-tailoring-workspace.tsx"
    - "src/components/auth/auth-page-shell.tsx"
    - "src/components/horizon/authenticated-app-shell.tsx"
    - "src/components/account/authenticated-sidebar.tsx"
    - "src/components/account/authenticated-footer.tsx"
    - "src/components/account/account-generator-header.tsx"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "master-resume TICKET-001"
  related: []

acceptance_criteria:
  - "Landing sections live under src/features/marketing/components."
  - "BrandMark lives at src/components/brand-mark.tsx."
  - "No remaining imports of @/components/landing."
  - "The home route still renders the landing page."

definition_of_done:
  - "Tests pass"
  - "Only files listed in this ticket were modified"

notes: "Files are moved with git mv. Behavior is unchanged."
---
