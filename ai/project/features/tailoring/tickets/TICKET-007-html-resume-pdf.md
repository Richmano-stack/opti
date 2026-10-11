---
id: TICKET-007
title: "Print the résumé template to PDF"
type: feature
status: done
priority: P1

scope:
  summary: >
    The downloaded PDF is a Chromium print of the same HTML template shown on
    the studio paper. After that download is verified, @react-pdf/renderer is
    removed.
  in_scope:
    - "A Letter print wrapper around the registry template."
    - "A short-lived in-memory print job and a print page."
    - "A POST route that returns a PDF from headless Chromium."
    - "Download uses that route and still saves a file in the browser."
    - "Removal of the react-pdf document, styles, fixture script, and dependency after the download matches the paper."
  out_of_scope:
    - "Saving the template choice on the account."
    - "Replacing GuestResumePreview on the guest review page."
    - "Vendoring Georgia and Segoe UI."
    - "Multi-page résumés, an executive template, or a second résumé schema."
    - "Rate limiting the print route."
    - "Showing the PDF inside the studio canvas."

files:
  create:
    - "ai/project/features/tailoring/tickets/TICKET-007-html-resume-pdf.md"
    - "src/features/tailoring/pdf/resume-print-document.tsx"
    - "src/features/tailoring/pdf/resume-print-document.test.tsx"
    - "src/features/tailoring/pdf/print-job.ts"
    - "src/features/tailoring/pdf/print-job.test.ts"
    - "src/app/print/resume/page.tsx"
    - "src/app/print/resume/page.test.tsx"
    - "src/features/tailoring/pdf/render-resume-pdf.ts"
    - "src/features/tailoring/pdf/render-resume-pdf.test.ts"
    - "src/app/api/resume-pdf/route.ts"
    - "src/app/api/resume-pdf/route.test.ts"
  modify:
    - "ai/project/memory/DECISIONS_LOG.md"
    - "src/features/tailoring/pdf/download-resume-pdf.ts"
    - "src/features/tailoring/pdf/download-resume-pdf.test.ts"
    - "src/features/tailoring/pdf/index.ts"
    - "src/templates/theme.ts"
    - "next.config.ts"
    - "package.json"
    - "pnpm-lock.yaml"
  delete:
    - "src/features/tailoring/pdf/resume-pdf-document.tsx"
    - "src/features/tailoring/pdf/resume-pdf-document.test.tsx"
    - "src/features/tailoring/pdf/resume-pdf-styles.ts"
    - "scripts/render-pdf-fixtures.tsx"

dependencies:
  blocks: []
  blocked_by: []
  related:
    - "TICKET-005"
    - "TICKET-006"

acceptance_criteria:
  - "Download returns a PDF printed from the selected registry template."
  - "Modern and Minimal on the studio paper and in the file use the same component."
  - "An invalid résumé or template id is rejected before Chromium launches."
  - "The PDF is one Letter page with selectable text."
  - "No source file imports @react-pdf/renderer after the browser check."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "The Node server must be able to launch Playwright Chromium."
  - "A Linux server may lack Georgia and Segoe UI, so the file can fall back to other fonts."
  - "Content past 11 inches is clipped."

notes: "The print job lives in one Node process for 30 seconds. Callers that omit a template id download Minimal."
---
