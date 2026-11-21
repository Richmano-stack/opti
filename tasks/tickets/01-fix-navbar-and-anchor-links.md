# Ticket 01: Fix Navbar and Anchor Links

**Goal:** Fix missing Sign Up / Dashboard navigation and dead anchor links.

**User value:** Users can seamlessly navigate between landing, auth, and the application dashboard without dead ends or missing links.

---

## Scope

- `src/components/landing/landing-navbar.tsx`
- `src/components/horizon/authenticated-app-shell.tsx`
- `src/app/dashboard/page.tsx` (or `src/components/master-resume/master-resume-workspace.tsx`)

---

## Acceptance Criteria

- [x] Logged-in users in `landing-navbar.tsx` see a prominent "Go to Dashboard" CTA linking to `/dashboard`.
- [x] Logged-out users in `landing-navbar.tsx` see "Log in" (`/login`), "Sign up" (`/signup`), and "Try it free" (`/try`).
- [x] The `/dashboard#account` and `/dashboard#privacy` links in `authenticated-app-shell.tsx` resolve to real, accessible target sections or modal dialogs on `/dashboard`.
- [x] Mobile navigation drawer in `authenticated-app-shell.tsx` also reflects valid destinations without dead anchor links.
- [x] Zero backend changes, zero database modifications, and zero TypeScript errors (`npx tsc --noEmit`).

---

## Verification

- [x] Test navbar as an unauthenticated guest: verify "Log in", "Sign up", and "Try it free" links render and route correctly.
- [x] Test navbar as an authenticated user: verify session is detected and "Go to Dashboard" CTA appears.
- [x] Click `/dashboard#account` and `/dashboard#privacy` links in both desktop and mobile layouts: verify targets exist and scroll or focus cleanly without console errors.
