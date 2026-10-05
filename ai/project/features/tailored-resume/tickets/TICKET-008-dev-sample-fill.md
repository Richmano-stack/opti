---
id: TICKET-008
title: "Fill the tailoring forms with sample documents in development"
type: feature
status: done
priority: P2

scope:
  summary: >
    Testing generation requires pasting a master résumé and job description on every
    browser session. Add one development-only control that fills those fields from the
    existing sample fixtures.
  in_scope:
    - "A development-only route that returns the sample résumé and job description."
    - "A Fill sample button on the guest try form, the account job-description field, and the master résumé editor."
    - "The button is omitted when NODE_ENV is not development."
  out_of_scope:
    - "Saving the sample into an account."
    - "Showing the control in production."
    - "Changing generation behavior."

files:
  create:
    - "ai/project/features/tailored-resume/tickets/TICKET-008-dev-sample-fill.md"
    - "src/services/dev/sample-inputs.ts"
    - "src/services/dev/load-sample-inputs.ts"
    - "src/services/dev/sample-inputs.test.ts"
    - "src/app/api/dev/sample-inputs/route.ts"
    - "src/components/dev/dev-sample-fill.tsx"
  modify:
    - "src/components/guest/guest-tailoring-workspace.tsx"
    - "src/components/guest/guest-tailoring-workspace.test.tsx"
    - "src/components/account/account-tailoring-workspace.tsx"
    - "src/components/account/account-tailoring-workspace.test.tsx"
    - "src/components/master-resume/master-resume-workspace.tsx"
    - "src/components/master-resume/master-resume-workspace.test.tsx"
    - "src/services/ai/fixtures/sample-resume.txt"
    - "src/services/ai/fixtures/sample-jd.txt"
  delete: []

dependencies:
  blocks: []
  blocked_by: []
  related: []

acceptance_criteria:
  - "The sample loader returns the fixture résumé and job description."
  - "The route responds 404 when it is not running in development."
  - "The guest, account, and master résumé screens can fill from that sample in development."
  - "Rendered screens do not include Fill sample when NODE_ENV is not development."

definition_of_done:
  - "Lint passes for the scoped files"
  - "Type check passes"
  - "Tests pass"
  - "Only files listed in this ticket were modified"

risks:
  - "The route file ships with the server build. It returns 404 outside development, and the button is compiled out of the client."

notes: "Uses src/services/ai/fixtures/sample-resume.txt and sample-jd.txt."
---
