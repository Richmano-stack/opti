# Product Requirements Document: Opti

## Product definition

Opti turns a reusable master resume into a tailored PDF resume for a specific job application.

The user saves their complete, truthful career history once. For each application, they paste a job description. Opti selects and rewrites the most relevant material, presents it for review, and exports a clean PDF.

## Core workflow

### First-time setup

1. Create an account.
2. Paste or upload a standard resume.
3. Review and save the reusable master resume.

### Every job application

1. Paste a target job description.
2. Opti loads the saved master resume.
3. AI selects and rewrites the most relevant source material without inventing facts.
4. Review the tailored resume.
5. Download a single-column PDF.
6. Find the generated resume later in application history.

## Product principles

- **Save once, reuse often.** Users should not re-enter the same resume for every application.
- **Truth before keyword coverage.** Opti may rephrase and prioritize existing facts but must not invent employers, roles, dates, education, skills, certifications, or metrics.
- **Job-specific output.** Each generated resume emphasizes the experience relevant to one job description.
- **Review before export.** AI output remains visible before PDF generation.
- **Simple documents.** The default output uses selectable text and a conventional single-column reading order.
- **No outcome guarantees.** Opti improves relevance and readability but does not guarantee ATS passage, interviews, or employment.

## MVP scope

### Included

- Email/password and magic-link authentication.
- One reusable master resume per user.
- Master-resume creation and editing.
- Job-description intake for each new application.
- Structured AI generation grounded in the master resume.
- Tailored-resume preview and single-column PDF export.
- Generated-resume history and re-download.

### Deferred

- Multiple visual templates.
- ATS scores presented as objective guarantees.
- Billing, subscriptions, and usage quotas.
- Team, organization, and enterprise accounts.
- Public API access and automatic job-board applications.

## Domain model

### Master resume

The canonical source of truth for a user's contact details, skills, work history, education, and source achievements.

### Generated resume

An application-specific output derived from a master resume and job description. It stores the tailored structured resume, source job description, useful title, and timestamps.

## AI requirements

- Treat the saved master resume as the only factual source.
- Never convert a job requirement into a claimed qualification unless supported by the master resume.
- Preserve employer names, role titles, institutions, credentials, and dates.
- Do not invent numerical results.
- Prefer relevant source material over including everything.
- Return structured JSON validated by the server before persistence or rendering.

## PDF requirements

- Text remains selectable and searchable.
- Content follows a top-to-bottom, single-column reading order.
- Avoid content tables, text boxes, canvas-rendered text, and structures that fragment extraction.
- Use conventional section headings and readable typography.

## Success criterion

The MVP succeeds when a returning user can paste only a job description and receive a truthful, tailored PDF without re-entering their standard resume.

## Current implementation gap

The existing generator accepts resume text plus a job description, calls Gemini, validates structured output, saves it, previews it, and exports a PDF. The next product phase must separate the reusable master resume from application-specific generated resumes.