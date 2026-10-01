---
id: TICKET-001
title: "Share one header pattern per page family"
type: refactor
status: draft
priority: P2

scope:
  summary: >
    Opti currently paints a different header, background, and frame on the landing page,
    the guest workspace, login and signup, and the signed-in app. Later, when generation
    and the current pages are stable, give each audience one shell and reuse it.
    Do not start this while product behavior is still moving.
  in_scope:
    - "Public shell for unauthenticated product pages: landing and guest workspace (/ and /try) share one header."
    - "Auth shell for /login and /signup: one header, one page pattern, both variants."
    - "App shell for signed-in pages: one header and one sidebar on every authenticated route."
    - "Remove duplicated nav markup once each shell is the only frame for its family."
  out_of_scope:
    - "Redesigning page content, copy, or generation behavior."
    - "Starting this work before the current guest, auth, and dashboard flows are accepted."
    - "A single header used on all three families. Public, auth, and app chrome stay different on purpose."

files:
  create: []
  modify:
    - "src/components/landing/landing-navbar.tsx"
    - "src/components/guest/guest-workspace-ui.tsx"
    - "src/components/auth/auth-page-shell.tsx"
    - "src/components/horizon/authenticated-app-shell.tsx"
    - "src/components/account/authenticated-sidebar.tsx"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related:
    - "docs/tickets/UI-004-authenticated-shell.md"
    - "docs/product/authenticated-workspace-spec.md"

acceptance_criteria:
  - "Landing and /try render the same public header. Guest-only labels may change, the frame does not."
  - "Login and signup render the same auth header and the same page pattern."
  - "Every signed-in page renders the same header and sidebar. No authenticated page invents its own nav."
  - "A page does not mix shells. Public pages have no app sidebar. Auth pages have no marketing footer. Signed-in pages have no public header."

definition_of_done:
  - "Lint passes"
  - "Type check passes"
  - "Tests pass"
  - "Only scoped files modified"
  - "This ticket is moved from draft to ready before any code is written"

risks:
  - "Landing and guest headers differ in links today. Unifying them can hide Log in, guest, or account actions if the shared header is not specified first."
  - "Authenticated shell work already exists in UI-004. This ticket should extend that shell, not add a second one."

notes: |
  Recorded 2026-09-27. Planning only. Do not implement until the user says the current pages work.

  Three families, three shells:

  1. Public — landing and guest workspace. Same header.
  2. Auth — login and signup. Same header and same page pattern.
  3. Authenticated — dashboard and the rest of the signed-in app. Same header and same sidebar.

  Current split, so the later pass has a map:
  - Public landing nav: src/components/landing/landing-navbar.tsx
  - Guest header: GuestWorkspaceHeader in src/components/guest/guest-workspace-ui.tsx
  - Auth frame: src/components/auth/auth-page-shell.tsx
  - Signed-in frame: src/components/horizon/authenticated-app-shell.tsx and src/components/account/authenticated-sidebar.tsx
---
