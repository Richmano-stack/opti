# Product Requirements Document: Opti

## Product definition

Opti turns a truthful master resume into a tailored PDF resume for a specific job application.

The product removes repeated work: save a master resume once, paste a new job description, review the tailored result, and download the PDF. A guest can test the same core result without creating an account by pasting both inputs for that session.

## Users and modes

### Guest mode

1. Paste master-resume text.
2. Paste a job description.
3. Generate and review the tailored resume.
4. Download the PDF.

No account is required and no input or generated output is persisted.

### Account mode

1. Create an email/password account.
2. Paste and save one master resume.
3. For each application, paste only the job description.
4. Generate, review, and download the tailored PDF.

Only the master-resume text is saved. Job descriptions, generated resumes, and PDFs are not persisted in the MVP.

## Product principles

- **Save once, reuse often.** The saved master resume is the product's core advantage.
- **Demo without friction.** Guest mode demonstrates the real transformation without requiring registration.
- **Truth before keyword coverage.** Opti may rephrase and prioritize source facts but must not invent employers, roles, dates, education, credentials, skills, or metrics.
- **Review before export.** AI output remains visible before PDF download.
- **Simple documents.** The default PDF uses selectable text and a conventional single-column reading order.
- **Private by default.** Persist only what enables the core returning-user advantage.
- **No outcome guarantees.** Opti does not promise ATS passage, interviews, or employment.

## MVP scope

### Included

- Guest tailoring from pasted master-resume and job-description text.
- Email/password authentication.
- One saved raw-text master resume per authenticated user.
- Master-resume creation and editing.
- Job-description-only generation for returning users.
- OpenRouter-backed structured resume tailoring.
- Validated preview and single-column PDF export.
- Clear loading, validation, provider-failure, and retry states.
- Responsive, accessible light sky-blue interface built with shadcn primitives.

### Excluded

- File upload, document parsing, and external file storage.
- Generated-resume or job-description history.
- Stored PDFs and re-download history.
- Magic-link authentication.
- Multiple master resumes or visual templates.
- Billing, subscriptions, quotas, teams, or enterprise accounts.
- ATS scoring, job-board automation, DOCX export, and public APIs.

## AI requirements

- OpenRouter is the sole AI provider and is called only from the server.
- The model is selected through `OPENROUTER_MODEL`; the application does not hard-code a provider-specific model.
- The master resume is the only factual source.
- Job requirements must never become claimed qualifications unless supported by the source resume.
- Employer names, titles, institutions, credentials, dates, and numerical results must not be invented.
- Model output must be structured JSON validated with Zod before preview or rendering.
- Resume text, job descriptions, generated output, and API credentials must not be logged.

## PDF requirements

- Text remains selectable and searchable.
- Content follows a top-to-bottom, single-column reading order.
- Long and sparse resumes render without clipped or overlapping content.
- The PDF downloads immediately and is not stored by Opti.

## Success criteria

The MVP is successful when:

- A guest can paste two text inputs and download a valid tailored PDF without registering.
- A returning account user can paste only a job description and download a valid tailored PDF using the saved master resume.
- Only authenticated master-resume text is persisted.
- Both workflows handle common failures without losing the user's current input.
