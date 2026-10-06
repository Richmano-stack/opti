---
id: TICKET-002
title: "Send verification and password-reset links with Resend"
type: feature
status: done
priority: P1

scope:
  summary: >
    Require email verification before an email-and-password session, and let a
    person set a new password from a link. Both messages are sent through Resend.
  in_scope:
    - "Send the verification link on sign-up and again when the person asks."
    - "Send a password-reset link and accept the new password on /reset-password."
    - "Keep the same success message whether or not the email has an account."
  out_of_scope:
    - "Passwordless sign-in that creates a session from the email alone."
    - "Changing Google sign-in."
    - "A new database migration. The verification table already exists."

files:
  create:
    - "ai/project/features/auth/tickets/TICKET-002-resend-verification-and-reset.md"
    - "src/server/email/send-transactional-email.ts"
    - "src/server/email/send-transactional-email.test.ts"
    - "src/server/email/schedule-auth-email.ts"
    - "src/features/auth/components/forgot-password-form.tsx"
    - "src/features/auth/components/reset-password-form.tsx"
    - "src/app/(auth)/forgot-password/page.tsx"
    - "src/app/(auth)/reset-password/page.tsx"
  modify:
    - "src/server/auth/auth.ts"
    - "src/features/auth/components/signup-form.tsx"
    - "src/features/auth/components/login-form.tsx"
    - "src/features/auth/components/auth-page-shell.tsx"
    - ".env.example"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related: []

acceptance_criteria:
  - "Sign-up does not open a session until the verification link is used."
  - "The sign-up screen can send the verification link again."
  - "Forgot password asks for an email and always confirms the same way."
  - "Reset password reads the token from the link and sets a new password."
  - "Resend is called with the configured from address and does not log the API key."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Accounts created before this change have email_verified false and must use the verification link before they can sign in."

notes: "Production needs RESEND_API_KEY and RESEND_FROM on a domain verified in Resend."
---
