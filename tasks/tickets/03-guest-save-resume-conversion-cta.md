# Ticket 03: Guest Save Resume Conversion CTA

**Goal:** Add a clear "Save to free account" conversion prompt on the guest tailored resume result.

**User value:** Guests who experience the value of a tailored resume get a frictionless, contextual invitation to create an account and save their work.

---

## Scope

- `src/components/pdf/tailored-resume-result.tsx`
- `src/components/guest/guest-workspace-ui.tsx`

---

## Acceptance Criteria

- [ ] Render a prominent, contextual conversion callout above or beside the tailored resume preview upon successful generation in guest mode.
- [ ] Callout copy clearly communicates value: saving the master resume and tailored version to return to anytime without losing work.
- [ ] Primary button directs user to `/signup?intent=save_draft` (or equivalent callback).
- [ ] Persist current draft state to storage via `src/lib/guest-session-storage.ts` before navigation triggers.
- [ ] Existing `Download PDF` functionality continues working with zero regressions.
- [ ] No changes to backend generation or PDF rendering pipelines.

---

## Verification

- [ ] On `/try`, generate a resume and confirm the conversion CTA appears in the success state.
- [ ] Confirm clicking the conversion CTA stores draft in session and navigates to signup.
- [ ] Confirm `Download PDF` still generates and downloads the correct PDF document.
- [ ] Verify responsive layout across mobile and desktop breakpoints.
