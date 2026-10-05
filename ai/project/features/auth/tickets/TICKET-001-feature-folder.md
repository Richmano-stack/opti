---
id: TICKET-001
title: "Move sign-in and sign-up into src/features/auth"
type: chore
status: done
priority: P2

scope:
  summary: >
    Move the login form, signup form, auth shell, and callback URL helper under
    src/features/auth. Leave Better Auth in src/server/auth. Login and signup routes stay in src/app.
  in_scope:
    - "Move auth UI into src/features/auth/components."
    - "Move the callback URL helper into src/features/auth/lib."
    - "Update the login and signup pages."
  out_of_scope:
    - "Moving src/server/auth."
    - "Moving tailoring."
    - "Changing sign-in behavior."

files:
  create:
    - "ai/project/features/auth/tickets/TICKET-001-feature-folder.md"
  modify:
    - "src/features/auth/components/login-form.tsx"
    - "src/features/auth/components/signup-form.tsx"
    - "src/app/(auth)/login/page.tsx"
    - "src/app/(auth)/signup/page.tsx"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "marketing TICKET-001"
  related: []

acceptance_criteria:
  - "Auth screens live under src/features/auth/components."
  - "getSafeCallbackUrl lives under src/features/auth/lib."
  - "No remaining imports of @/components/login-form, @/components/signup-form, @/components/auth, or @/lib/auth/callback-url."
  - "/login and /signup still render the same screens."

definition_of_done:
  - "Tests pass"
  - "Only files listed in this ticket were modified"

notes: "src/server/auth stays in place."
---
