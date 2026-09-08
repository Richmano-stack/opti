# Authenticated Workspace — Product and UI Specification

**Status:** Accepted
**Date:** 2026-09-08

## Product intent

Opti’s authenticated home is for managing the user’s persistent master résumé. The master résumé is the factual source document that powers every tailored résumé.

## Responsive strategy

The authenticated experience is designed mobile-first. Mobile defines the content hierarchy and interactions; desktop expands the same system with a persistent sidebar.

## User stories

### Master résumé overview

As an authenticated user, I want to see a polished overview of my master résumé so I understand its state without being confronted by a large form.

Acceptance criteria:

- The dashboard shows a compact résumé mockup/preview card.
- The full résumé text is not visible by default.
- Saved status, last-updated time, and character count are visible.
- The preview does not imply that the résumé is editable inline.

### Edit master résumé

As an authenticated user, I want to intentionally open the résumé editor when I need to change my source document.

Acceptance criteria:

- `Edit master résumé` is a secondary action on the overview card.
- The full editor opens in an accessible dialog/sheet.
- Desktop uses a wide dialog; mobile uses a full-screen sheet.
- Save, cancel, validation, loading, success, and error behavior are preserved.
- Focus returns to the edit trigger after closing.

### Tailor for a role

As an authenticated user, I want to quickly tailor my résumé for a job, so this is the primary dashboard action.

Acceptance criteria:

- `Tailor for a role` is visually primary.
- It links to the authenticated generator.
- It does not modify the master résumé.
- Job descriptions and generated results remain temporary.

### Consistent authenticated shell

As an authenticated user, I want the same navigation structure on every authenticated screen so I always know where I am.

Acceptance criteria:

- Dashboard, generator input, setup-required, loading/error, review, and download states share one shell.
- Desktop has a persistent sidebar.
- Mobile has a collapsible navigation menu.
- The shell has one compact utility header.
- Authenticated pages do not use the marketing footer.
- Navigation is not duplicated between sidebar and header.

## Visual direction

- Keep the existing Horizon color palette.
- Use restrained product typography; avoid landing-page display sizes.
- Use one consistent spacing, radius, border, and elevation hierarchy.
- Keep the generated résumé/document visually dominant during review.
- Avoid page-level scrolling where the shell can contain content; use internal scrolling for long documents/editors.

## Scope constraints

- Preserve account generation behavior and server boundaries.
- Do not add history, scoring, templates, uploads, or persistence of job descriptions/generated results.
- Do not redesign the landing or guest experience in this workstream.
- The authenticated master résumé remains the only persisted source document.

## Verification requirements

- Test at 320px, 768px, 1024px, and 1440px.
- Verify keyboard navigation, dialog semantics, focus restoration, and screen-reader labels.
- Add unit and Playwright coverage for overview, edit, cancel, save, validation, and responsive shell behavior.
