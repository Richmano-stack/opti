# Authenticated UI verification foundation

**Status:** In progress — final verification waits for UI-003, UI-006, UI-007, and UI-008.

## Purpose

This guide defines the checks used to verify the mobile-first authenticated Opti workspace. It is intentionally reusable: implementation tickets use the same viewport, console, overflow, keyboard, and screenshot expectations rather than adding ad hoc checks per page.

## Automated foundation

- `e2e/support/ui-verification.ts` supplies the shared authenticated viewport list, browser-error collector, and horizontal-overflow assertion.
- `e2e/authenticated-ui-foundation.e2e.ts` verifies the current authenticated shell at representative mobile and desktop widths.
- Future authenticated UI tests must collect `console` and `pageerror` events before navigation, assert no horizontal overflow after each state change, and use the shared viewport list.

## Responsive matrix

| Viewport | Shell expectation | Must verify |
| --- | --- | --- |
| 320 × 640 | Mobile header, drawer, and bottom navigation | Controls remain reachable; no horizontal overflow |
| 375 × 812 | Mobile content hierarchy | Sheet/dialog and document regions fit the viewport |
| 768 × 1024 | Expanded mobile/tablet layout | Actions wrap cleanly; no duplicated navigation |
| 1024 × 768 | Persistent desktop sidebar | Main content remains usable beside the sidebar |
| 1440 × 960 | Wide desktop workspace | Content containers do not become excessively wide |

## Interaction and accessibility conventions

- Test a logical Tab sequence for each new interactive state. Assert focus is visibly and programmatically placed on the expected control.
- For every dialog or sheet: verify `role="dialog"`, an accessible name, `aria-modal="true"`, initial focus, Tab containment, Escape close, and focus restoration to its trigger.
- Test buttons and navigation by accessible name. Do not rely on CSS selectors for user-facing behavior.
- Do not use color alone for status. State components must expose meaningful text and appropriate ARIA semantics.

## Visual-review conventions

- Capture desktop and mobile screenshots for every finished screen state. Use descriptive names: `<route>-<state>-<viewport>.png`.
- Review the screenshot for hierarchy, clipping, overlap, contrast, focus visibility, and empty space before accepting a visual change.
- Keep screenshot assertions deliberate. Add a Playwright visual baseline only once the relevant page design is accepted; do not snapshot an in-progress redesign.

## Final verification matrix

| Area | UI-003 | UI-006 | UI-007 | UI-008 | Final UI-009 pass |
| --- | --- | --- | --- | --- | --- |
| Unit/component tests | Required | Required | Required | Required | Run all |
| TypeScript and ESLint | Required | Required | Required | Required | Run all |
| 320–1440px screenshots | State components | Shell | Dashboard and edit sheet | Input, blocked, loading, error, review | Review all |
| Keyboard and dialog focus | State actions | Drawer/sheet behavior | Edit résumé flow | Retry/download flows | Recheck all |
| Console errors and overflow | Representative checks | All shell widths | Dashboard states | Generator states | Recheck all |
| Playwright | N/A unless interactive | Shell breakpoints | Overview/edit/save/cancel | Input through PDF download | Run full suite |

## Required final commands

```powershell
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
infisical run --env=dev --path=/ -- pnpm test:e2e
```

Record any environment-dependent skipped test, visual exception, or known limitation in the final UI-009 ticket update. UI-009 must not be marked complete until UI-003, UI-006, UI-007, and UI-008 have merged and the matrix has been rerun.
