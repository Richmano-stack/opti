---
id: TICKET-007
title: "Give the résumé a simple paper layout"
type: feature
status: done
priority: P1

scope:
  summary: >
    The preview and PDF read as an app list. Restyle both as one simple résumé page:
    a centered name, a quiet headline and contact line, and sections separated by
    a full-width rule. Keep the same content and section order.
  in_scope:
    - "Restyle the on-screen preview as a single sheet of paper in ink, not brand color."
    - "Match that layout in the PDF: name, headline, contact, then ruled section labels."
    - "Keep section order and the existing text, including optional sections."
  out_of_scope:
    - "A template registry, a picker, or plan gating."
    - "Changes to the résumé JSON schema or the prompt."
    - "The match note. It stays outside the page."

files:
  create:
    - "ai/project/features/tailored-resume/tickets/TICKET-007-simple-resume-design.md"
  modify:
    - "src/components/guest/guest-resume-preview.tsx"
    - "src/components/pdf/resume-pdf-document.tsx"
    - "src/components/pdf/resume-pdf-styles.ts"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related: []

acceptance_criteria:
  - "The preview shows the name, then the headline, then one contact line."
  - "Section labels are small, uppercase, and underlined by a full-width rule."
  - "The PDF uses the same header and ruled section labels."
  - "Experience still precedes skills, and empty optional sections stay hidden."
  - "The match note is still outside the preview."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Preview CSS and react-pdf styles cannot be shared, so the two layouts can drift. This ticket sets them to the same measurements by hand."

notes: "Plans and extra templates wait. This is the only design."
---
