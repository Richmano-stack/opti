# Master Dependency Roadmap: AI-Powered ATS Resume Optimizer

This document tracks the strict sequential building phases of the application. Tasks within a single phase are designed to have zero directory-level conflicts and MUST be developed in parallel.

---

## 2026 Tech Stack Core
- Next.js 15 (App Router), TypeScript, Tailwind CSS, Drizzle ORM, Supabase (PostgreSQL), tRPC v11, Better Auth, @react-pdf/renderer, and Google AI Studio SDK (Gemini API).

---

## PHASE 1: Base Environment Setup & Isolated AI Scripts (Parallel)
> **Dependency:** None. Initial code repository state.
> **Exit Condition:** Dev environment compiles, tRPC core architecture is active, and the core AI generation scripts execute via test scripts.

### [Task 1.A] Application Framework & API Network Core
- **Scope:** Initialize the full-stack Next.js 15 setup, install TypeScript/Tailwind, and configure core tRPC v11 server wrappers and client providers.
- **Assigned Directory Domain:** `/src/server/*`, `/src/utils/**/*`, `package.json`

### [Task 1.B] Isolated AI Prompt Engineering Pipeline
- **Scope:** Build an isolated service layer to communicate with the Gemini API via Google AI Studio SDK. It must accept raw text strings (Resume + Job Description) and return a clean, structured JSON response optimized for ATS.
- **Assigned Directory Domain:** `/src/services/ai/**/*`

---

## PHASE 2: Data Modeling & Presentation Wireframes (Parallel)
> **Dependency:** Requires Phase 1 setup to compile cleanly.
> **Exit Condition:** Relational schemas deployed to Supabase; multi-step input form wireframes operational with local state.

### [Task 2.A] Minimalist Database Schema Deployment
- **Scope:** Model the PostgreSQL schemas for Users (managed by Better Auth) and Resumes using Drizzle ORM. The `resumes` table must store data flatly inside a single `jsonb` data column. Generate and execute database migrations to the Supabase cloud instance.
- **Assigned Directory Domain:** `/src/db/**/*`

### [Task 2.B] Multi-Step Resume Input Dashboard UI
- **Scope:** Design the multi-step multi-input generator dashboard interface using shadcn/ui components. Use local React state for mock data visualization.
- **Assigned Directory Domain:** `/src/app/dashboard/generator/**/*` (Presentation only)

---

## PHASE 3: Identity Guardrails & Communication Bridges (Parallel)
> **Dependency:** Requires Phase 2 data models and UI frames to exist.
> **Exit Condition:** App middleware secures protected routes; tRPC routers expose CRUD operations and AI calls to the frontend.

### [Task 3.A] Better Auth Implementation & Route Guarding
- **Scope:** Connect Better Auth to the existing Drizzle schemas. Build the user registration/login API handlers, shadcn/ui login panels, and middleware blocks to secure the dashboard.
- **Assigned Directory Domain:** `/src/server/auth/**/*`, `/src/app/api/auth/**/*`, `/src/app/login/**/*`, `/src/middleware.ts`, and `/src/db/schema.ts` (Permitted schema additions)

### [Task 3.B] tRPC Business Logic Routers
- **Scope:** Construct the server-side tRPC procedures to handle saving user history, fetching saved resumes, and executing the Phase 1 Gemini AI processing engine.
- **Assigned Directory Domain:** `/src/server/routers/**/*`

---

## PHASE 4: Document Generation & Full Integration (Synthesis)
> **Dependency:** Requires all Phase 3 endpoints and auth layers to be functional.
> **Exit Condition:** End-to-end data processing operational: inputs convert to AI results, saving to database and exporting to an ATS-parsed PDF.

### [Task 4.A] Global State Binding & AI Engine Activation
- **Scope:** Replace all mock React state hooks in the presentation dashboard with active tRPC query and mutation hooks. Handle multi-step processing states and real-time database savings.
- **Assigned Directory Domain:** `/src/app/dashboard/generator/**/*` (Integration hook layer)

### [Task 4.B] ATS-Compliant PDF Export Generator
- **Scope:** Leverage `@react-pdf/renderer` to pass the structured JSON resume data model into a strict, single-column, cleanly searchable PDF layout built exclusively for ATS parsing.
- **Assigned Directory Domain:** `/src/components/pdf/**/*`