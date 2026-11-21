# Ticket 02: Guest Session Storage and Auth Handoff

**Goal:** Prevent data loss when a guest navigates to login or signup after working in `/try`.

**User value:** Users don't lose their master resume input, job description, or tailored results when deciding to create an account or sign in.

---

## Scope

- `src/lib/guest-session-storage.ts` (new utility)
- `src/components/guest/*` (`guest-tailoring-workspace.tsx`, `guest-workspace-ui.tsx`)
- `src/components/login-form.tsx`
- `src/components/signup-form.tsx`
- `src/components/account/account-tailoring-workspace.tsx`

---

## Acceptance Criteria

- [ ] Create `src/lib/guest-session-storage.ts` with safe browser `sessionStorage` helpers (read, write, clear, schema validation) handling:
  - Guest master resume input text
  - Guest job description input text
  - Generated tailored resume JSON (`OptimizedResume`)
- [ ] Automatically or contextually cache the guest draft payload when navigating from `/try` to `/login` or `/signup`.
- [ ] Post-authentication, detect cached guest draft in `/dashboard` or `/dashboard/generator`, offer to hydrate/restore the draft, and clean up storage once consumed.
- [ ] Gracefully handle SSR / hydration guards (safe window checks, storage quota/disabled errors).
- [ ] Existing backend, database schema, and auth endpoints remain 100% untouched.

---

## Verification

- [ ] Enter a master resume and job description on `/try`, generate a resume, click "Log in" or "Sign up", authenticate, and verify data is preserved rather than lost.
- [ ] Test with `sessionStorage` disabled or unavailable: app degrades gracefully without throwing unhandled exceptions.
- [ ] TypeScript checks and existing automated tests pass.
