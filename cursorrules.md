# Global Technical Standards & Code Style Rules

You must strictly adhere to the structural architecture, development syntax, and quality benchmarks defined below. Do not deviate under any circumstances.

---

## 1. Core Stack Constraints (2026 Engine Rules)
- **Framework Architecture:** Next.js 15 utilizing the App Router directory layout exclusively.
- **TypeScript Quality:** Set to strict mode. The use of `any` is prohibited. All server outputs, parameters, and query responses must carry explicit types.
- **Database Logic:** Drizzle ORM syntax exclusively. Leverage relational select statements (`db.query`) for standard fetch queries.
- **API Communication Network:** tRPC v11 hooks handle all frontend data manipulation. Traditional REST fetch utilities or custom Axios structures are prohibited.
- **AI Processing Layer:** Connect to Gemini models using the official Google AI Studio SDK. Every prompt execution routine must enforce a structural JSON schema output constraint to ensure predictable data parsing.

---

## 2. Component & UI Framework (Strict shadcn/ui Mandate)
- **shadcn/ui Requirement:** You MUST use **shadcn/ui** primitives for every single user interface element that is available in that library. 
- **Prohibited Custom UI Work:** Do not build custom buttons, inputs, dialog tools, alert modals, forms, dropdown cards, tabs, or skeleton screens from scratch if a corresponding component exists within shadcn/ui. Install them via the standard CLI command sequence.
- **Tailwind Consistency:** Use Tailwind utility classes strictly to handle alignments, paddings, margins, and custom grid spacings on top of the shadcn/ui core building blocks.

---

## 3. Specific ATS Engine & Design Simplicity Directives
- **AI Response Standardization:** The AI layer must execute structural validation ensuring returned JSON fields map directly to a flat layout data block containing text objects for sections, summaries, experiences, and skills.
- **Single-Column PDF Formatting:** ATS parsers read strings linearly left-to-right. Multi-column PDF grids fragment text parsing. The `@react-pdf/renderer` layer must be compiled into a standard, clean, top-to-bottom single-column page format without tables or hidden grids wrapping the core content fields.
- **Font Selection Integrity:** Use only native, web-safe structural fonts (Helvetica, Times New Roman, or Arial). Do not utilize canvas icons or custom typographic glyphs that obscure selectable text string characters.

---

## 4. Prohibited Engineering Practices
- **No Client-Side Secret Exposure:** Never execute AI prompt logic or reference Google AI Studio API tokens on client-side components. All generation routines must occur securely on the server side.
- **No Relational Overhead Bloat:** Do not separate work history, schools, or bullet points into distinct database tables with cross-relational keys. Keep all generated resume outputs packed flat into a single PostgreSQL `jsonb` column.
- **No Duplicate Type Declarations:** Do not write matching standalone interfaces for database rows. Export and use native Drizzle type inferences (`inferSelectModel`, `inferInsertModel`) directly to the frontend.

---

## 5. Pre-Flight Verification Routine
Before outputting code changes, run this validation sequence:
1. Does the script break TypeScript compilation or introduce typing errors?
2. Are all inputs and output structures explicitly typed?
3. Does the PDF generator layer preserve selectable text encoding without masking alphanumeric symbols?