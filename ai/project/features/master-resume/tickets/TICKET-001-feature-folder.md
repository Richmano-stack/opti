---
id: TICKET-001
title: "Move the master résumé into src/features"
type: chore
status: done
priority: P2

scope:
  summary: >
    The master résumé is split across app/actions, services, and components.
    Move that closed set under src/features/master-resume and point callers at the new paths.
    Routes stay in src/app.
  in_scope:
    - "Move the workspace, save action, and repository into src/features/master-resume."
    - "Update imports in the dashboard pages, the account generation action, the seed script, and package.json."
  out_of_scope:
    - "Moving marketing, auth, or tailoring."
    - "Moving src/db or src/server/auth."
    - "Changing master-résumé behavior."

files:
  create:
    - "ai/project/features/master-resume/tickets/TICKET-001-feature-folder.md"
  modify:
    - "src/features/master-resume/components/master-resume-workspace.tsx"
    - "src/features/master-resume/components/master-resume-workspace.test.tsx"
    - "src/features/master-resume/actions/save-master-resume.ts"
    - "src/features/master-resume/actions/save-master-resume.test.ts"
    - "src/features/master-resume/actions/save-master-resume.integration.test.ts"
    - "src/features/master-resume/lib/repository.ts"
    - "src/features/master-resume/lib/repository.test.ts"
    - "src/features/master-resume/lib/repository.integration.test.ts"
    - "src/features/master-resume/lib/errors.ts"
    - "src/features/master-resume/lib/index.ts"
    - "src/app/dashboard/page.tsx"
    - "src/app/dashboard/generator/page.tsx"
    - "src/app/actions/generate-account-resume.ts"
    - "src/app/actions/generate-account-resume.test.ts"
    - "src/app/actions/contact-preflight-actions.test.ts"
    - "scripts/seed-dev-users.ts"
    - "package.json"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related: []

acceptance_criteria:
  - "Master résumé workspace, action, and repository live under src/features/master-resume."
  - "src/app/dashboard/page.tsx and src/app/dashboard/generator/page.tsx still render the same routes."
  - "No remaining imports of @/services/master-resume, @/components/master-resume, or @/app/actions/master-resume."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

notes: "Files are moved with git mv. Behavior is unchanged."
---
