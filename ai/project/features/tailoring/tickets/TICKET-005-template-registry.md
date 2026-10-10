---
id: TICKET-005
title: "Add a resume template registry for web preview"
type: feature
status: done
priority: P1

scope:
  summary: >
    Add a registry of resume templates that render the existing Zod-verified
    OptimizedResume. Shared tokens cover web CSS variables and PDF point values.
    Modern and Minimal are the first templates. The current studio preview and
    PDF document stay as they are.
  in_scope:
    - "Registry with modern and minimal, plus getTemplate and listTemplates."
    - "Shared theme tokens for web and PDF."
    - "Shared header, experience, education, and skills sections."
    - "Modern and Minimal web templates that skip empty optional sections."
  out_of_scope:
    - "Replacing the studio preview or the current PDF document."
    - "An executive template."
    - "Categorized skills. The schema stores a flat skill list."

files:
  create:
    - "ai/project/features/tailoring/tickets/TICKET-005-template-registry.md"
    - "src/templates/types.ts"
    - "src/templates/theme.ts"
    - "src/templates/registry.ts"
    - "src/templates/registry.test.ts"
    - "src/templates/common/header-section.tsx"
    - "src/templates/common/experience-item.tsx"
    - "src/templates/common/education-item.tsx"
    - "src/templates/common/skills-section.tsx"
    - "src/templates/common/resume-section.tsx"
    - "src/templates/modern-template.tsx"
    - "src/templates/minimal-template.tsx"
    - "src/templates/modern-template.test.tsx"
    - "public/templates/modern.svg"
    - "public/templates/minimal.svg"
  modify: []
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related: []

acceptance_criteria:
  - "listTemplates returns modern and minimal with name, description, and thumbnail path."
  - "getTemplate rejects an unknown id."
  - "ModernTemplate renders OptimizedResume and omits empty projects and education."
  - "Theme exports the same spacing numbers for CSS variables and PDF points."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks: []

notes: "ResumeData is an alias of OptimizedResume from the tailoring Zod schema."
---
