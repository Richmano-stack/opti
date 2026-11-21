# Ticket 04: Copy Output and Clean Reset

**Goal:** Add clipboard copy utility and clean state reset without page reloads.

**User value:** Users can copy tailored text directly into job application forms and tailor another job description without clunky page reloads or manually erasing fields.

---

## Scope

- `src/components/pdf/tailored-resume-result.tsx`
- `src/components/guest/guest-tailoring-workspace.tsx`
- `src/components/account/account-tailoring-workspace.tsx`

---

## Acceptance Criteria

- [x] Add a "Copy Text" (or "Copy Markdown") button alongside "Download PDF" in `TailoredResumeResult`.
- [x] Clicking "Copy Text" formats the tailored resume cleanly for clipboard use and shows a temporary "Copied!" feedback state.
- [x] In guest mode (`GuestTailoringWorkspace`), add a "Tailor Another Job" action that resets the job description input and generated result while preserving the user's master resume input.
- [x] In authenticated mode (`AccountTailoringWorkspace`), replace `window.location.reload()` with a clean client-side state reset that clears the job description and result state without a browser reload.
- [x] Zero backend modifications and zero TypeScript compilation errors.

---

## Verification

- [x] Generate a tailored resume, click "Copy Text", and paste into an external text editor: verify formatted text includes contact info, summary, experience, and education.
- [x] In guest mode, click "Tailor Another Job": verify master resume input remains populated while job description and preview reset to initial state.
- [x] In authenticated mode, click "Tailor another": verify UI smoothly transitions back to the input form without full page refresh.
