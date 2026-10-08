---
id: TICKET-003
title: "Keep the server alive until Resend accepts the auth email"
type: bug
status: done
priority: P1

scope:
  summary: >
    Resend verification from production returns success and writes no error, but
    the message never arrives. The send is started after the response and the
    host is not asked to wait for it.
  in_scope:
    - "Return the Resend request from the after() task so the host waits for it."
    - "Log acceptance, and log the failure name and message without the API key or recipient."
    - "Trim the Resend key and from address before the request is built."
  out_of_scope:
    - "Changing who must verify before sign-in."
    - "A database update of existing users."

files:
  create:
    - "ai/project/features/auth/tickets/TICKET-003-wait-for-resend.md"
    - "src/server/email/schedule-auth-email.test.ts"
  modify:
    - "src/server/email/schedule-auth-email.ts"
    - "src/server/email/send-transactional-email.ts"
    - "src/server/email/send-transactional-email.test.ts"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related:
    - "TICKET-002"

acceptance_criteria:
  - "The function passed to after() returns the promise that finishes when Resend responds."
  - "A failed send logs the error message and does not log the API key or the recipient."
  - "A trailing newline on RESEND_API_KEY or RESEND_FROM is removed before the request."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks: []

notes: "Production must be redeployed before a resend attempt will wait for Resend."
---
