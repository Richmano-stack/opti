# Ticket 05: One-Click Sample Data Feeder

**Goal:** Let first-time visitors test `/try` immediately with sample inputs.

**User value:** Prospective users can evaluate Opti's core value in under 5 seconds without having to locate, prepare, and copy-paste their own resumes and job postings.

---

## Scope

- `src/components/guest/guest-tailoring-workspace.tsx`
- Sample fixture data file (`src/data/sample-resume-fixtures.ts`)

---

## Acceptance Criteria

- [x] Add a visible "Use Sample Resume & Job" action on `/try` (e.g., above or within the source documents section).
- [x] Clicking the button populates the Master Résumé and Job Description fields with realistic, high-quality sample data matching expected schema lengths.
- [x] The populated fields satisfy existing form validation (`isReady` becomes true, enabling the "Tailor my résumé" CTA).
- [x] Users can freely edit or clear the sample data before clicking generate.
- [x] Zero backend changes and zero regressions to manual text input.

---

## Verification

- [x] Visit `/try` in an incognito window with blank inputs.
- [x] Click "Use Sample Resume & Job": verify both fields populate immediately.
- [x] Click "Tailor my résumé": verify generation request triggers successfully with the sample data.
- [x] Run automated tests and TypeScript checks to confirm stability.
