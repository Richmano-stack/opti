# OPTI-005: Persist one master resume per account

**Objective:** Add the minimum database and server operations required to save one raw-text master resume for each authenticated user.

**User value:** A user's source resume can be reused across future applications.

## Scope

- Add a `master_resumes` table with unique user ownership, raw text, and timestamps.
- Generate and apply a forward Drizzle migration.
- Add authenticated read and upsert operations with server-side validation.
- Prove one user cannot read or overwrite another user's master resume.

## Not included

- Structured master profiles, multiple resumes, version history, guest persistence, or generated-output storage.

## Acceptance criteria

- [x] Each authenticated user can have at most one master resume.
- [x] Create and update preserve ownership and update timestamps correctly.
- [x] Unauthenticated and cross-user access is rejected.

## Verification

- [x] Migration applies successfully to the local PostgreSQL database.
- [x] Persistence and isolation tests pass against PostgreSQL.
- [x] Lint, typecheck, and build pass.

**Audit status (2026-08-31):** Complete. Migration `0005` applies successfully on PostgreSQL 16 at port `5461`. Real-database repository and authenticated Server Action integration tests prove create, reload, update, one-row-per-user behavior, and cross-user isolation.

**Dependencies:** OPTI-001
**Estimated scope:** Medium
**Likely areas:** Drizzle schema/migration, master-resume server operations and tests
