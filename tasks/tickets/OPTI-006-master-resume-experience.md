# OPTI-006: Build the account master-resume experience

**Objective:** Give authenticated users a straightforward screen to create, review, and edit their saved master-resume text.

**User value:** Users enter their career source material once and can maintain it later.

## Scope

- Show first-time setup when no master resume exists.
- Show an editable saved-resume view when one exists.
- Validate, save, and confirm changes without losing entered text on failure.
- Provide a clear path from successful setup to tailoring.

## Not included

- File uploads, rich-text editing, structured field editors, resume scoring, or multiple versions.

## Acceptance criteria

- [x] An authenticated user can create and later edit one master resume.
- [x] Reloading restores the saved text.
- [x] Empty or excessive input is rejected with an accessible message.

## Verification

- [x] UI and server-operation tests cover empty, create, update, and error states.
- [ ] Manual first-time and returning-user journeys pass.
- [x] Lint, typecheck, and build pass.

**Audit status (2026-08-31):** The dashboard editor, authenticated save/load operations, and migration are implemented. Unit and real-database integration tests cover validation, create, reload, update, and ownership isolation. A disposable Better Auth session also passed the first-time, created-resume reload, and updated-resume reload journey over localhost HTTP. Click-driven browser verification remains pending because the local browser automation runtime could not start.

**Dependencies:** OPTI-005
**Estimated scope:** Medium
**Likely areas:** dashboard master-resume route, form components, persistence operations
