# Implementation Plan: Print the résumé template to PDF

## Overview

The studio paper and the downloaded file use the same HTML template. Download sends the résumé to a server route, Chromium opens a Letter print page of that template, and the route returns the PDF. `@react-pdf/renderer` stays until that download is verified, then it is removed.

Approving this plan starts implementation. No code changes happen before that.

## Architecture decisions

- The registry template (`ModernTemplate` or `MinimalTemplate`) is the only layout.
- The studio canvas keeps rendering that component. The preview does not become an embedded PDF.
- Download stays a client save of a blob. `downloadOptimizedResumePdf(resume, filename?, templateId?)` keeps its signature. Studio, guest header, and tailored-result buttons keep calling it.
- The PDF is produced on the Node server with Playwright `chromium` and `page.pdf()`. Text stays selectable. The page is Letter, margins are 0, and backgrounds print.
- Chromium loads a real Next.js print page so Tailwind from `globals.css` applies. The résumé is not passed in the query string. The route stores it under a random token in process memory for 30 seconds. Playwright opens `/print/resume?token=…` on the same origin, then the token is deleted.
- The print page is one Letter sheet. Content past 11 inches is clipped. The product is already strictly one page.
- Screen chrome on the template (`border`, `shadow-sm`) is suppressed on the print page only.
- Invalid bodies fail Zod validation and return 400. The client keeps the current error text: "Your PDF could not be created. Please try again."
- Callers that omit `templateId` download Minimal.
- The production process that runs `next start` must be able to launch Chromium (`playwright install chromium`). This route cannot run in a serverless function that has no browser.

## Flow

```text
Download click
  -> POST /api/resume-pdf { resume, templateId }
       -> Zod: optimizedResumeSchema + template id
       -> store payload under a random token (30s)
       -> Chromium opens /print/resume?token=…
            -> print page renders getTemplate(id).Component
            -> page.pdf (Letter, background, zero margin)
       -> delete token
       -> application/pdf bytes
  -> browser saves the blob with the existing filename helper
```

## Out of scope

- Saving the template choice on the account.
- Replacing `GuestResumePreview` on the guest review page. That page's download will use the Minimal HTML template; its on-screen preview stays as it is.
- An executive template, categorized skills, or a second résumé schema.
- Multi-page résumés.
- Vendoring Georgia and Segoe UI. See risks.
- Rate limiting the print route.
- Showing the PDF inside the studio canvas.

## Task list

### Task 1: Record the ticket and the decision

**Description:** Add TICKET-007 and DEC-010 before any application code. DEC-010 records that the HTML template is the PDF layout and supersedes the react-pdf portion of DEC-005.

**Acceptance criteria:**

- [ ] TICKET-007 lists the files below and the acceptance criteria in this plan.
- [ ] DEC-010 is in `ai/project/memory/DECISIONS_LOG.md`.

**Verification:**

- [ ] The ticket file list matches the files later tasks touch.

**Dependencies:** None

**Files likely touched:**

- `ai/project/features/tailoring/tickets/TICKET-007-html-resume-pdf.md`
- `ai/project/memory/DECISIONS_LOG.md`

**Estimated scope:** Small

### Task 2: Letter print document

**Description:** Add a print wrapper that renders the selected registry template on one Letter page and suppresses the screen border and shadow.

**Acceptance criteria:**

- [ ] Modern and Minimal both render through the wrapper from the same `getTemplate` lookup the studio uses.
- [ ] The wrapper is 8.5in by 11in and marks the sheet for print.
- [ ] An unknown template id throws the existing registry error.

**Verification:**

- [ ] `pnpm exec vitest run src/features/tailoring/pdf/resume-print-document.test.tsx`
- [ ] Markup includes the résumé name and the template-specific skills layout.

**Dependencies:** Task 1

**Files likely touched:**

- `src/features/tailoring/pdf/resume-print-document.tsx`
- `src/features/tailoring/pdf/resume-print-document.test.tsx`

**Estimated scope:** Small

### Task 3: One-time print job and print page

**Description:** Store the validated résumé in memory and serve it from a print route that has no studio chrome.

**Acceptance criteria:**

- [ ] A token resolves to its résumé until it expires or is deleted.
- [ ] An expired or unknown token does not render a résumé.
- [ ] `/print/resume` renders the print document for that token and no app shell.

**Verification:**

- [ ] `pnpm exec vitest run src/features/tailoring/pdf/print-job.test.ts`
- [ ] Print page markup test renders the template name from a stored job.

**Dependencies:** Task 2

**Files likely touched:**

- `src/features/tailoring/pdf/print-job.ts`
- `src/features/tailoring/pdf/print-job.test.ts`
- `src/app/print/resume/page.tsx`
- `src/app/print/resume/page.test.tsx`

**Estimated scope:** Medium

### Task 4: Chromium PDF route

**Description:** Accept the résumé JSON, open the print page in headless Chromium, and return a PDF. Playwright is a production dependency and is left external to the Next bundle.

**Acceptance criteria:**

- [ ] A valid body returns `application/pdf`.
- [ ] An invalid résumé or template id returns 400 and launches no browser.
- [ ] The token is deleted after the PDF is built, including when Chromium fails.
- [ ] Unit tests mock Chromium. They do not download a browser.

**Verification:**

- [ ] `pnpm exec vitest run src/app/api/resume-pdf/route.test.ts src/features/tailoring/pdf/render-resume-pdf.test.ts`
- [ ] `next.config.ts` lists `playwright` in `serverExternalPackages`.

**Dependencies:** Task 3

**Files likely touched:**

- `src/features/tailoring/pdf/render-resume-pdf.ts`
- `src/features/tailoring/pdf/render-resume-pdf.test.ts`
- `src/app/api/resume-pdf/route.ts`
- `src/app/api/resume-pdf/route.test.ts`
- `next.config.ts`
- `package.json`

**Estimated scope:** Medium

### Checkpoint: After Tasks 2–4

- [ ] Route tests pass with Chromium mocked.
- [ ] Typecheck passes.
- [ ] The existing Download button still uses react-pdf, so the app still downloads if this checkpoint fails.

### Task 5: Point Download at the print route

**Description:** `downloadOptimizedResumePdf` POSTs the résumé and template id, then saves the returned blob with the current filename helper.

**Acceptance criteria:**

- [ ] Studio Download sends the selected template id.
- [ ] Guest header and tailored-result Download send Minimal when they omit the id.
- [ ] A non-OK response throws, and the existing error message stays.

**Verification:**

- [ ] `pnpm exec vitest run src/features/tailoring/pdf/download-resume-pdf.test.ts`
- [ ] Browser: on `/try`, tailor a sample, switch Modern and Minimal, download each, and compare the file to the paper.

**Dependencies:** Task 4

**Files likely touched:**

- `src/features/tailoring/pdf/download-resume-pdf.ts`
- `src/features/tailoring/pdf/download-resume-pdf.test.ts`

**Estimated scope:** Small

### Checkpoint: Browser proof before deletion

- [ ] Modern on screen and the Modern file show the same columns, accent header, and sections.
- [ ] Minimal on screen and the Minimal file show the same single column and comma-separated skills.
- [ ] The PDF text can be selected.
- [ ] The file is one Letter page.
- [ ] A failed print shows "Your PDF could not be created. Please try again."

### Task 6: Remove react-pdf

**Description:** Delete the react-pdf document, its styles and tests, the fixture script, and `pdfTheme`. Remove the dependency. Export only the download function and the filename helper from the pdf barrel.

**Acceptance criteria:**

- [ ] No source file imports `@react-pdf/renderer`.
- [ ] `package.json` no longer depends on it.
- [ ] Download still uses the print route.

**Verification:**

- [ ] `pnpm exec vitest run src/features/tailoring/pdf src/templates`
- [ ] `pnpm exec tsc --noEmit`
- [ ] `pnpm exec eslint` on the files this ticket touched
- [ ] Browser download once more after the dependency is gone.

**Dependencies:** Task 5 and the browser checkpoint

**Files likely touched:**

- `src/features/tailoring/pdf/resume-pdf-document.tsx` (delete)
- `src/features/tailoring/pdf/resume-pdf-document.test.tsx` (delete)
- `src/features/tailoring/pdf/resume-pdf-styles.ts` (delete)
- `scripts/render-pdf-fixtures.tsx` (delete)
- `src/features/tailoring/pdf/index.ts`
- `src/templates/theme.ts`
- `package.json`

**Estimated scope:** Medium

### Checkpoint: Complete

- [ ] Studio Download and the on-screen paper are the same template.
- [ ] `@react-pdf/renderer` is gone.
- [ ] Lint, typecheck, and the focused tests pass.

## Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Production cannot launch Chromium | Download fails in production | Approve this plan only if `next start` runs on a machine that can install Playwright's Chromium. Do not deploy Task 5 until that install is done. |
| Georgia and Segoe UI are missing on a Linux server | The file uses fallback fonts while the studio still shows the design fonts | Accept that for this ticket. A follow-up can ship the same font files to the template and the print page. |
| The token map lives in one Node process | A second server instance would 404 the print page | This app runs as one Node server. Do not add a shared store in this ticket. |
| Dev compile of the print page resets module state | First local download can miss the token | Delete the token only after `page.pdf()` returns. Retry once in dev if the print page 404s. |
| A long résumé is taller than 11 inches | The bottom is clipped | The product is one page. The print sheet uses `overflow: hidden`. |
| First Chromium launch is slow | Download takes a few seconds | Keep the existing loading state on the Download button. |

## Open questions

None. Approval means the Chromium requirement and the clipped one-page rule are accepted.
