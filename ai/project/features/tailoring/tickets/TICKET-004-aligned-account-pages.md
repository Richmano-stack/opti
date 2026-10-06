---
id: TICKET-004
title: "Align the signed-in hub and studio with the try studio"
type: feature
status: done
priority: P1

scope:
  summary: >
    Make /dashboard and /dashboard/generator use the same full-screen frame as /try.
    Drop the dashboard sidebar on both pages. The hub shows the saved source on a
    paper sheet. The studio header adds a master-résumé link, initials, and sign out.
  in_scope:
    - "A shared account bar: Opti, page title, optional actions, initials, and sign out."
    - "Master résumé hub as a paper desk with one Tailor action and the existing edit dialog."
    - "Signed-in studio header uses that bar and keeps tailor and download."
    - "The missing-source screen uses the same full-screen frame."
  out_of_scope:
    - "Removing AuthenticatedAppShell from the codebase."
    - "Changing generation, saving, or the résumé document."
    - "A new navigation destination."

files:
  create:
    - "ai/project/features/tailoring/tickets/TICKET-004-aligned-account-pages.md"
    - "src/components/horizon/account-bar.tsx"
  modify:
    - "src/features/master-resume/components/master-resume-workspace.tsx"
    - "src/features/master-resume/components/master-resume-workspace.test.tsx"
    - "src/features/tailoring/components/studio/resume-studio-header.tsx"
    - "src/features/tailoring/components/studio/resume-studio.test.tsx"
    - "src/features/tailoring/components/account-generator-setup-required.tsx"
    - "src/features/tailoring/components/account-tailoring-workspace.test.tsx"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-002"
  related:
    - "TICKET-003"

acceptance_criteria:
  - "The master résumé page has no workspace sidebar and shows the saved source on a paper sheet."
  - "Tailor for a role is the primary action when a source exists, and it is absent until one does."
  - "The signed-in studio header links back to the master résumé and offers initials and sign out."
  - "A signed-in user with no master résumé sees a full-screen prompt back to the hub, not the dashboard shell."
  - "Guest /try still shows Sign in and does not show Sign out."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "AuthenticatedAppShell remains for its own tests but is no longer mounted by these two routes."

notes: ""
---
