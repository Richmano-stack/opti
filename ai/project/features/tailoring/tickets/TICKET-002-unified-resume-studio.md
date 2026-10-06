---
id: TICKET-002
title: "Unify guest and account tailoring into a Canva-style resume studio"
type: feature
status: done
priority: P1

scope:
  summary: >
    Replace the separate guest and account tailoring workspaces with a single
    shared Canva-style Resume Studio. The studio provides a unified layout: a top app header
    with target role and PDF export, a left sidebar for inputs (handling guest paste vs.
    account saved master resume) and match insights, and a central paper canvas desk
    displaying a strictly 1-page paper sheet with zoom controls.
  in_scope:
    - "Build a shared ResumeStudio component supporting 'guest' and 'account' modes."
    - "Top header showing Opti branding, detected role target, status indicator, and Download PDF."
    - "Left sidebar containing source document inputs (master resume textarea for guest, saved master resume card for account, and job description textarea for both), plus DevSampleFill in development."
    - "Left sidebar showing match insights (skills pills, core strengths, potential gaps) after generation."
    - "Center paper canvas desk hosting a strictly 1-page paper document with zoom controls (80%-120%) and empty/loading/ready states."
    - "Support contact preflight modal/fields when required."
    - "Wire up /try and /dashboard/generator to use the unified studio."
    - "Unit and static markup tests covering both guest and account studio modes."
  out_of_scope:
    - "Multi-page resume overflowing."
    - "Rich text WYSIWYG inline editing inside the canvas for MVP."
    - "Database mutations for guest mode."
    - "Multiple template picker."

files:
  create:
    - "ai/project/features/tailoring/tickets/TICKET-002-unified-resume-studio.md"
    - "src/features/tailoring/components/studio/resume-studio.tsx"
    - "src/features/tailoring/components/studio/resume-studio-header.tsx"
    - "src/features/tailoring/components/studio/resume-studio-sidebar.tsx"
    - "src/features/tailoring/components/studio/resume-studio-canvas.tsx"
    - "src/features/tailoring/components/studio/resume-studio.test.tsx"
  modify:
    - "src/app/try/page.tsx"
    - "src/app/dashboard/generator/page.tsx"
    - "src/features/tailoring/components/guest/guest-tailoring-workspace.tsx"
    - "src/features/tailoring/components/account-tailoring-workspace.tsx"
    - "src/features/tailoring/components/guest/guest-tailoring-workspace.test.tsx"
    - "src/features/tailoring/components/account-tailoring-workspace.test.tsx"
    - "ai/project/memory/DECISIONS_LOG.md"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related:
    - "TICKET-001"
    - "TICKET-007"
    - "TICKET-008"

acceptance_criteria:
  - "Both /try (guest) and /dashboard/generator (account) render the Canva-style studio layout directly on page load."
  - "Guest mode allows pasting a master résumé and job description; account mode recognizes the saved master résumé and requests the job description."
  - "The top header shows the detected target role label, status, and PDF download."
  - "The center stage provides a Canva-style paper sheet canvas with zoom controls (80%–120%) and copy text."
  - "After generation, match insights (skills, core strengths, potential gaps) are shown in the left panel."
  - "The paper preview remains strictly a 1-page paper sheet."
  - "Preflight contact collection works for both guest and authenticated flows."
  - "Tests pass for guest and account studio workspaces."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "Form action states differ between guest and account actions; ResumeStudio cleanly abstracts action binding based on mode."

notes: "Unified Canva-style workspace MVP."
---
