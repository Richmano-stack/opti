---
id: TICKET-003
title: "Refine Resume Studio UX: tabbed inputs and stacked contact preflight"
type: improvement
status: done
priority: P1

scope:
  summary: >
    Refine the left sidebar of the Canva-style Resume Studio by introducing a segmented
    tab control for source inputs (switching between Job Description and Master Résumé)
    and fixing the Contact Information Preflight action buttons layout to prevent horizontal
    text collision and nested double-scrolling.
  in_scope:
    - "Add segmented tabs in ResumeStudioSidebar to toggle between Job Description and Master Résumé without unmounting form inputs."
    - "Display character counts and readiness indicators on input tabs."
    - "Fix ContactInformationPreflight buttons to stack vertically with full-width primary and ghost styles, preventing horizontal collision in narrow sidebars."
    - "Clean up sidebar sizing and padding to eliminate nested scroll fatigue."
    - "Maintain full form action compatibility for both guest and authenticated tailoring."
    - "Update test suites for studio, guest, and account components."
  out_of_scope:
    - "Changes to tailoring AI prompt or server generation logic."
    - "Database schema changes."
    - "WYSIWYG document editing."

files:
  create:
    - "ai/project/features/tailoring/tickets/TICKET-003-studio-ux-refinement.md"
  modify:
    - "src/features/tailoring/components/contact-information-preflight.tsx"
    - "src/features/tailoring/components/studio/resume-studio-sidebar.tsx"
    - "src/features/tailoring/components/studio/resume-studio.tsx"
    - "src/features/tailoring/components/studio/resume-studio.test.tsx"
    - "src/features/tailoring/components/guest/guest-tailoring-workspace.test.tsx"
    - "src/features/tailoring/components/account-tailoring-workspace.test.tsx"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by:
    - "TICKET-002"
  related:
    - "TICKET-002"

acceptance_criteria:
  - "The sidebar features segmented tabs allowing users to toggle between Job Description and Master Résumé."
  - "Form inputs for both documents remain submitted in FormData regardless of which tab is visually active."
  - "ContactInformationPreflight buttons stack vertically with clear text ('Add details and continue' / 'Continue without them') without text truncation or overlap."
  - "Nested vertical scrolling is replaced with a single comfortable textarea view for the active tab."
  - "All unit and component tests pass, lint passes with zero errors, and typecheck passes."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Toggling tabs must keep form inputs in the DOM (e.g. via hidden attribute or CSS display:none) so FormData receives both resume and jobDescription."

notes: "Refines the Canva-style studio based on visual feedback."
---
