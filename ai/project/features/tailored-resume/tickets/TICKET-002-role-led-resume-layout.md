---
id: TICKET-002
title: "Render the tailored résumé as roles first"
type: feature
status: done
priority: P1

scope:
  summary: >
    Draw the evolved résumé contract as a résumé. The on-screen preview and the PDF
    use the same order, lead with roles, and show certifications and projects only
    when the résumé has them.
  in_scope:
    - "Shared section order: name, latest role, contact, summary, experience, skills, education, certifications, projects."
    - "Experience blocks with the title and dates on one row and the company underneath."
    - "A compact skills line after experience."
    - "Omit education, certifications, and projects when those arrays are empty or missing."
    - "PDF bullets drawn as marks, not leading hyphens."
  out_of_scope:
    - "Changing the generation prompt or JSON schema."
    - "A template gallery or multi-column résumé."
    - "Guest workspace chrome."

files:
  create: []
  modify:
    - "src/components/guest/guest-resume-preview.tsx"
    - "src/components/guest/guest-resume-preview.test.tsx"
    - "src/components/pdf/resume-pdf-document.tsx"
    - "src/components/pdf/resume-pdf-styles.ts"
    - "src/components/pdf/resume-pdf-document.test.tsx"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-001"
  related: []

acceptance_criteria:
  - "The preview places Experience before Skills."
  - "The preview shows the first role title under the name."
  - "The preview omits Certifications and Projects when those fields are absent."
  - "The preview shows a certification and a project when they are present."
  - "The PDF renderer still produces a PDF for a résumé that includes certifications and projects."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Preview and PDF tests pass"
  - "Only files listed in this ticket were modified for this ticket"

risks:
  - "Preview and PDF can drift if only one renderer is updated. Both are in this ticket so the order stays the same."

notes: "Depends on the contract from TICKET-001. Implement immediately after that contract."
---
