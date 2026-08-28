# OPTI-001: Define the generation contract

**Objective:** Establish one typed, validated contract between pasted source text, OpenRouter output, preview, and PDF rendering.

**User value:** A generated resume is predictable and cannot reach the UI in an unsupported shape.

## Scope

- Define Zod schemas for generation input and the tailored resume output.
- Preserve only resume fields the preview and PDF actually render.
- Set practical input length bounds and human-readable validation errors.
- Add representative valid and invalid fixtures and focused tests.

## Not included

- OpenRouter requests, UI changes, database changes, or PDF styling.

## Acceptance criteria

- [ ] The same inferred output type is consumed by preview and PDF code.
- [ ] Empty, excessive, malformed, and structurally incomplete values are rejected.
- [ ] Tests prove valid output passes and malformed output fails safely.

## Verification

- [ ] Focused schema tests pass.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass.

**Dependencies:** None
**Estimated scope:** Medium
**Likely areas:** `src/services/ai/schema.ts`, `src/services/ai/types.ts`, fixtures and tests
