# OPTI-008: Verify and finish PDF export

**Objective:** Ensure every validated tailored resume can be downloaded as a clean, readable PDF.

**User value:** The final artifact is immediately usable for a job application.

## Scope

- Use the shared structured resume contract for PDF rendering.
- Keep selectable text and a conventional single-column reading order.
- Handle page breaks, long sections, missing optional fields, and safe filenames.
- Make download available from both guest and account result states.
- Add representative document tests and visually inspect rendered output.

## Not included

- Multiple templates, DOCX export, cloud storage, or pixel-perfect matching of the web preview.

## Acceptance criteria

- [ ] Both modes download a valid PDF without server-side file persistence.
- [ ] Text can be selected and extracted in sensible order.
- [ ] Long and sparse fixtures render without clipped or overlapping content.

## Verification

- [ ] PDF-focused automated tests pass.
- [ ] Rendered fixture PDFs receive manual visual inspection.
- [ ] Lint, typecheck, and build pass.

**Dependencies:** OPTI-004, OPTI-007
**Estimated scope:** Medium
**Likely areas:** `src/components/pdf`, result UI, PDF fixtures/tests
