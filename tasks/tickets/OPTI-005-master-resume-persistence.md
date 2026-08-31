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
- [ ] Persistence and isolation tests pass against PostgreSQL.
- [x] Lint, typecheck, and build pass.

**Audit status (2026-08-31):** Schema, migration, authenticated operations, and unit tests are implemented. Migration `0005` was applied successfully to local PostgreSQL on port `5461`; existing repository tests still use injected mocks and do not yet prove real-database persistence/isolation.

**Dependencies:** OPTI-001
**Estimated scope:** Medium
**Likely areas:** Drizzle schema/migration, master-resume server operations and tests
