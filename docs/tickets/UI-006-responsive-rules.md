# UI-006: Define responsive rules

**Status:** Complete

## Goal

Document and implement mobile-first behavior at 320, 375, 768, 1024, and 1440px.

## Responsive contract

Opti uses the existing mobile-first `sm` (640px) and `lg` (1024px) breakpoints. The required widths are verification points, not additional one-off breakpoints.

| Viewport | Navigation and shell | Content and actions | Dialogs and scrolling |
| --- | --- | --- | --- |
| 320px | Bottom navigation and menu trigger are present; persistent sidebar is hidden. The drawer is at most 320px wide and never exceeds the viewport. | One-column flow, 16px container gutters, wrapping text, full-width stacked action groups, and 44px minimum interactive targets. | Dialogs become full-viewport sheets. Long dialog/editor content scrolls inside its bounded content region. |
| 375px | Same compact shell and drawer behavior as 320px. | One-column flow with 16px gutters; card actions stack below card copy. | Full-viewport sheets; page content uses normal document scrolling. |
| 768px | Bottom navigation and drawer remain active; no duplicate persistent sidebar. | Existing `sm` rules provide 24px gutters and allow suitable headers/actions to sit side by side. | Dialogs are centered, bounded surfaces; their body remains the only scrolling region when content is long. |
| 1024px | At the existing `lg` boundary, bottom navigation and drawer trigger disappear and the 240px persistent sidebar appears. | Existing `lg` rules provide 32px container gutters and permit established two-column workspace layouts. | The shell is viewport-bounded; authenticated content scrolls intentionally inside the main pane while sidebar/header remain persistent. |
| 1440px | The same persistent desktop shell is used; no extra navigation mode is introduced. | Content respects its `max-w-*` container and does not stretch indefinitely; established desktop columns remain. | Dialog widths remain capped and long documents/editors scroll internally. |

Across every width, shell and composition roots use `min-width: 0`, long scroll-region text may wrap, and the authenticated shell clips accidental x-axis paint overflow. No authenticated page should increase `documentElement.scrollWidth` beyond `clientWidth`.

## Done when

- [x] Sidebar collapse, stacking, wrapping, sheet behavior, and internal scrolling are explicit.
- [x] No horizontal overflow occurs at the required verification widths.
- [x] Playwright checks cover representative authenticated shell breakpoints.
