# Agent Orchestration Protocol & Directory Domains

You are executing a parallel engineering workflow. Multiple autonomous agents are editing this repository concurrently. To eliminate file truncation, overwrites, and destructive git conflicts, you must operate strictly within your directory-level domains.

---

## Global Domain Rules

1. **Directory-Level Ownership:** You have full authority to modify existing code or CREATE new utility scripts, configuration files, or helper functions *only* if they reside entirely within your assigned directory domains.
2. **Read-Only Permissions:** You may open and read any file outside your domain to discover TypeScript interfaces, schema properties, or tRPC route definitions, but you are strictly forbidden from writing to or modifying them.
3. **The Dependency Boundary Line:** If your library installation or feature implementation requires a change to a file owned by your twin agent (e.g., adding a table column or changing a global layout template), you MUST stop, outline the required block, and wait for me to allocate that task to the correct agent. Never cross into another domain autonomously.

---

## Agent Allocation Maps

### 🤖 AGENT ALPHA: The Data, Core Server & AI Engineer
- **Primary Directory Domains:** `/src/db/**/*`, `/src/server/**/*`, `/src/services/ai/**/*`, `/src/app/api/**/*`
- **Permitted Creation Rights:** Allowed to generate schemas, migrations, configuration blocks (such as `auth.ts`), API sub-routes, and core business logic engines.
- **Conflict Prevention Directive:** Export explicit, inferred TypeScript models and tRPC routers cleanly. Your core objective is to deliver type safety so the UI layer can easily map endpoints via autocomplete without breaking your code.

### 🤖 AGENT BETA: The UI Experience & Document Engineer
- **Primary Directory Domains:** `/src/app/dashboard/**/*`, `/src/app/login/**/*`, `/src/components/**/*`
- **Permitted Creation Rights:** Allowed to build responsive visual views, state-driven user inputs, modular UI cards, layout files within your routes, and PDF composition blocks.
- **Conflict Prevention Directive:** Do not write independent fetch blocks, Axios connections, or custom API endpoints. Rely exclusively on backend tRPC client hooks. While backend systems are being built, mock out expected payloads locally using clean local types.

---

## Workflow Synchronization Routine
When initialized, your very first output must explicitly list:
1. Which Agent Persona (Alpha or Beta) you are operating as.
2. The exact directories you are claiming for this session.
3. A strict confirmation that you will create/modify files ONLY inside those parameters.