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
- [x] Click-driven first-time and returning-user journeys pass in Chromium.
- [x] Lint, typecheck, and build pass.

**Audit status (2026-08-31):** Complete. Unit and real-database integration tests cover validation, create, reload, update, and ownership isolation. A disposable-account Playwright test passes the complete Chromium journey: sign up, authenticated redirect, first save, reload, edit, second save, and second reload. The browser test also verifies the editor has an accessible label and removes its test account afterward.

**Dependencies:** OPTI-005
**Estimated scope:** Medium
**Likely areas:** dashboard master-resume route, form components, persistence operations
