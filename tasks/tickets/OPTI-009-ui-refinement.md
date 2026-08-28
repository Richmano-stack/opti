# OPTI-009: Apply the sky design system and refine the workflow

**Objective:** Turn the functional workflow into a coherent, modern, light product experience using the approved shadcn-compatible tokens.

**User value:** The app feels trustworthy, focused, and pleasant without obscuring the task.

## Scope

- Apply the sky theme at the application boundary and remove legacy dark/violet styling.
- Refine the guest, setup, generator, preview, authentication, and navigation surfaces.
- Establish consistent spacing, typography, responsive behavior, focus states, and loading/error feedback.
- Prefer existing shadcn primitives; add only primitives needed by the workflow.
- Verify keyboard use, labels, contrast, and reduced-motion behavior.

## Not included

- Marketing experiments, decorative animation systems, custom component frameworks, or new product features.

## Acceptance criteria

- [ ] All MVP screens use semantic tokens with no meaningful legacy dark-theme remnants.
- [ ] Core journeys are usable at mobile and desktop widths.
- [ ] Keyboard navigation, visible focus, labels, and contrast meet the accessibility baseline.

## Verification

- [ ] Browser checks cover primary screens and responsive widths.
- [ ] No blocking console or hydration errors occur.
- [ ] Lint, typecheck, and build pass.

**Dependencies:** OPTI-004, OPTI-007, OPTI-008, merged sky-token foundation
**Estimated scope:** Medium; implement screen-by-screen in atomic commits
**Likely areas:** global theme boundary, app shell, shadcn components, auth and generator UI
