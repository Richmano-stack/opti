---
id: TICKET-006
title: "Choose a résumé template in the studio"
type: feature
status: done
priority: P1

scope:
  summary: >
    Let a person pick Modern or Minimal on the studio canvas. The same choice
    is used for the paper preview and the downloaded PDF. Guest and signed-in
    studios share the control.
  in_scope:
    - "A template control on the studio canvas."
    - "Rendering the selected registry template on the paper."
    - "Passing that choice into the PDF download."
  out_of_scope:
    - "Saving the choice on the account."
    - "Changing the guest review page outside the studio."

files:
  create:
    - "ai/project/features/tailoring/tickets/TICKET-006-studio-template-choice.md"
  modify:
    - "src/features/tailoring/components/studio/resume-studio.tsx"
    - "src/features/tailoring/components/studio/resume-studio-canvas.tsx"
    - "src/features/tailoring/components/studio/resume-studio-header.tsx"
    - "src/features/tailoring/components/studio/resume-studio.test.tsx"
    - "src/features/tailoring/pdf/download-resume-pdf.ts"
    - "src/features/tailoring/pdf/resume-pdf-document.tsx"
    - "src/features/tailoring/pdf/resume-pdf-styles.ts"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related:
    - "TICKET-005"

acceptance_criteria:
  - "The studio canvas offers Minimal and Modern before and after a résumé exists."
  - "The paper renders the selected template."
  - "Download PDF uses the same template id."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks: []

notes: "The choice is kept for the session only."
---
