# Opti UI Improvement TODO

## Goal
Make the authenticated experience calmer, easier to navigate, and more focused while preserving existing server behavior and data boundaries.

## 1. Authenticated dashboard shell

- [ ] Add a shared desktop sidebar for authenticated pages.
- [ ] Include navigation for:
  - [ ] Master résumé
  - [ ] Tailor a résumé
  - [ ] Account/profile
  - [ ] Privacy boundary
  - [ ] Sign out
- [ ] Collapse the sidebar into a mobile drawer or compact navigation.
- [ ] Keep the landing page and guest `/try` page sidebar-free.
- [ ] Reuse the same shell across `/dashboard` and `/dashboard/generator`.

## 2. Master résumé overview

- [ ] Replace the always-visible dashboard textarea with a résumé overview card.
- [ ] Show a readable content preview instead of an oversized editable field.
- [ ] Show saved status, last-updated time, and character count.
- [ ] Add an `Edit master résumé` action.
- [ ] Keep `Continue to tailoring` prominent when a résumé exists.
- [ ] Preserve the existing save action and authenticated server boundary.

## 3. Focused résumé editor

- [ ] Create an accessible edit dialog or sheet.
- [ ] Use a wide modal on desktop.
- [ ] Use a full-screen sheet on mobile.
- [ ] Move the existing textarea into the dialog.
- [ ] Preserve Save, Cancel, validation, loading, success, and error states.
- [ ] Keep character count and privacy/storage messaging in the editor.
- [ ] Support Escape, backdrop close, and keyboard navigation.
- [ ] Return focus to `Edit master résumé` after closing.

## 4. Typography refinement

- [ ] Reduce oversized landing hero typography by approximately one scale step.
- [ ] Reduce section heading sizes modestly.
- [ ] Reduce oversized headings on guest `/try`.
- [ ] Reduce authenticated dashboard and generator headings.
- [ ] Preserve a clear hierarchy and readable mobile typography.
- [ ] Keep generated résumé document typography visually dominant after generation.

## 5. Generator alignment

- [ ] Integrate the shared authenticated sidebar into the generator.
- [ ] Keep the generator input state focused.
- [ ] Keep the generated document dominant in review mode.
- [ ] Make the sidebar visually quieter during review and PDF download.
- [ ] Preserve retry, provider-error, validation, and PDF export behavior.

## 6. Responsive and accessibility verification

- [ ] Verify desktop, tablet, and mobile layouts.
- [ ] Confirm there is no horizontal overflow.
- [ ] Add correct dialog semantics and focus management.
- [ ] Verify keyboard navigation and screen-reader labels.
- [ ] Ensure the mobile navigation does not trap users.
- [ ] Verify footer and header consistency across all applicable pages.

## 7. Tests

- [ ] Add dashboard overview rendering tests.
- [ ] Add modal open/close tests.
- [ ] Add Save, Cancel, validation, loading, and error tests.
- [ ] Add sidebar navigation tests.
- [ ] Add mobile responsive Playwright checks.
- [ ] Preserve generator review/download regression coverage.
- [ ] Add visual checks for typography and horizontal overflow.

## 8. Delivery sequence

1. Build the shared authenticated shell and sidebar.
2. Convert the master résumé editor into overview plus dialog.
3. Apply typography scale adjustments.
4. Integrate the sidebar with generator states.
5. Run unit tests, Playwright, lint, TypeScript, and production build.
6. Review desktop and mobile screenshots.
7. Commit the work and open a focused draft PR.

## Constraints

- Do not change account generation behavior.
- Do not change server boundaries unnecessarily.
- Do not add history, scoring, templates, file uploads, or persistence of job descriptions/generated results.
- Guest inputs and generated results remain temporary.
- The authenticated master résumé remains the only persisted source document.
