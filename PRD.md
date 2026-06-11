# Product Requirements Document (PRD): AI ATS Resume Optimizer

## 1. The Core Problem & Value Proposition
* **The Problem:** Job seekers apply to hundreds of roles but get rejected automatically by Applicant Tracking Systems (ATS) because their resumes lack the exact keywords, semantic phrasing, and formatting required by corporate parsing algorithms.
* **The Solution:** This application allows a user to paste their existing resume along with a target job description. Using advanced AI (Gemini), the system instantly re-writes, tailors, and restructures the resume to mirror the job's core competencies, guaranteeing a passing score through ATS filtration while outputting a cleanly styled, single-column PDF.

---

## 2. Target User Experience (The 3-Step Journey)
1.  **The Intake:** An authenticated user lands on a clean, minimal dashboard containing two side-by-side text areas: one for their current raw resume and one for the target job description.
2.  **The Processing:** The user clicks "Optimize Resume". The screen displays a loading skeleton while a server-side AI pipeline processes the match, extracts keywords, and rebuilds the resume nodes.
3.  **The Deliverable:** The user is presented with a side-by-side preview screen showing the newly optimized text layout and a prominent button to download the print-ready, single-column ATS-compliant PDF.

---

## 3. Core Functional Requirements & Logic

### AI Optimization Logic (The Prompting Strategy)
When the backend executes the Gemini AI script, the internal prompt instructions must force the model to act as a world-class executive recruiter. It must:
* Identify missing hard skills, software tools, and certifications from the job description and weave them contextually into the user's work experience bullet points.
* Convert passive language into high-impact, results-driven bullet points using the **XYZ Formula** (e.g., *Accomplished [X] as measured by [Y], by doing [Z]*).
* **Strict Preservation:** The AI must *never* hallucinate fake jobs, fake companies, or fake degrees. It must strictly rephrase and adapt the *existing* experience data to match the target job description.

### ATS Parsing Technical Requirements
To guarantee a 100% parsing success rate, the output file must follow strict engineering rules:
* **Selectable Text:** The output PDF cannot be compressed or rendered as flat vector shapes. A computer algorithm must be able to highlight and copy the text inside the file.
* **Layout Structure:** Standard ATS parsers read left-to-right, top-to-bottom. Columns confuse the parsing flow. The output document layout must be strictly single-column.
* **No Text Boxes or Tables for Content:** Do not wrap work experience nodes in complex invisible grids or graphic dividers, as this fragments the reading order of automated scanners.

---

## 4. Phase 1 MVP Scope Constraints

### In-Scope (What MUST be built):
* Email/Password and Magic Link registration via Better Auth.
* A history dashboard where users can view and re-download previously generated resumes.
* A simple usage metric tracker (e.g., count how many optimizations a user has left).

### Out-of-Scope (Deferred to later phases):
* Paid premium tiers or Stripe checkout subscriptions.
* Custom theme styling or resume templates (only the standard, professional single-column layout is allowed for the MVP).
* Interactive drag-and-drop resume section block sorting.

---

## 5. High-Level System Design & Data Flow (Anti-Over-Engineering)

To ensure the MVP remains lightweight, fast, and maintainable, the system follows an ultra-lean, single-pipeline architecture. There are no background worker queues, complex object parsers, or heavily broken-out relational tables. Everything is handled in a single synchronous loop.

### A. The Visual Data Flow
Raw Text Inputs (Forms) ➔ tRPC Mutation ➔ Gemini API (Structured JSON Mode) ➔ Drizzle Save (Postgres JSONB Column) ➔ @react-pdf/renderer (Client Download).

### B. Architectural Guardrails (Strict Boundaries)
1. **Raw Text Inputs:** The frontend dashboard (`/src/app/dashboard/generator/page.tsx`) collects raw text using two standard `<textarea>` elements—one for the user's current resume and one for the target job description. No complex file parsing or upload dropzones are required for the MVP.
2. **Structured AI Response:** The backend service (`/src/services/ai.ts`) invokes the Gemini API using **Structured JSON Output Mode**, enforcing a strict JSON schema that maps perfectly to the UI requirements. 
3. **Flat Database Storage:** To prevent relational data bloat, the database does not use separate tables for work history, skills, or education. The `resumes` table stores the entire finalized resume layout inside a single `jsonb` column (PostgreSQL).
4. **Client-Side Document Compilation:** The application delegates all rendering overhead to the client. The frontend receives the raw JSON payload from the database and feeds it directly into `@react-pdf/renderer` as a single prop. The PDF compiles instantly on the user's device and triggers a local browser download.