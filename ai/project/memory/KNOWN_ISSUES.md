> **Type: PROJECT-SPECIFIC** | Customize for your product. Update as requirements and context evolve.

# Known Issues

---

## Purpose

KNOWN_ISSUES.md tracks **bugs, technical debt, and workarounds** that agents and developers must be aware of. It prevents rediscovering known problems and guides safe parallel execution.

**Update this file when:**

- A bug is found but not yet fixed (especially if it blocks or affects other work)
- A workaround is implemented that future code must respect
- Technical debt is identified and accepted temporarily
- An issue is resolved (move to Resolved section with date)

**Do not log:**

- Issues fixed in the same ticket they were found
- Style preferences or minor nitpicks
- Feature requests (use USER_STORIES.md)

---

## Instructions

1. **Assign a sequential ID:** `ISSUE-001`, `ISSUE-002`, etc.
2. **Set severity:** `critical`, `high`, `medium`, `low`.
3. **Set status:** `open`, `in_progress`, `resolved`, `wont_fix`.
4. **Describe the impact** — what breaks, what is affected, what to avoid.
5. **Document workarounds** if a fix is not yet available.
6. **Link to tickets** when issues are being addressed.
7. **Move resolved issues** to the Resolved section; do not delete them.
8. **Review before parallel ticket execution** — shared issues may block parallelism.

---

## Template

```markdown
# Known Issues

**Last updated:** <!-- FILL: YYYY-MM-DD -->

---

## Open Issues

*(No open issues)*

---

## Technical Debt

### DEBT-<!-- FILL: 001 -->: <!-- FILL: Short title -->

**Priority:** <!-- FILL: high | medium | low -->
**Status:** <!-- FILL: open | in_progress -->
**Identified:** <!-- FILL: YYYY-MM-DD -->
**Affected areas:** <!-- FILL -->

**Description:**

<!-- FILL: What should be improved and why? -->

**Acceptance criteria for resolution:**

- [ ] <!-- FILL -->

---

## Resolved Issues

### ISSUE-001: LandingNavbar called with no arguments crashes in LandingPage

**Resolved:** 2026-10-05
**Resolution:** Added default argument `= {}` to `LandingNavbar({ guest = false, floating = true }: LandingNavbarProps = {})` and converted call site in `LandingPage` to `<LandingNavbar />`. Fixed in `TICKET-003-landing-navbar-default-props.md`.
```

---

## Examples

> **Note:** Fictional example for format demonstration only.

```markdown
## Open Issues

### ISSUE-001: Task list does not refresh after status update

**Severity:** medium
**Status:** open
**Reported:** 2026-01-28
**Affected areas:** `src/features/tasks/`, dashboard page
**Ticket:** TICKET-042

**Description:**

After updating a task status via the dropdown, the kanban board does not reflect the change until a manual page refresh.

**Impact:**

Users may think the update failed and attempt duplicate updates.

**Workaround:**

Instruct users to refresh the page. Do not add client-side cache invalidation until TICKET-042 is addressed — partial fixes may conflict with the planned revalidation approach.

---

## Technical Debt

### DEBT-001: Auth session check duplicated across Server Actions

**Priority:** medium
**Status:** open
**Identified:** 2026-01-25
**Affected areas:** `src/features/tasks/actions/`, `src/features/auth/`

**Description:**

Each Server Action manually checks session validity. A shared `requireAuth()` helper should be extracted to `src/features/auth/lib/`.

**Acceptance criteria for resolution:**

- [ ] `requireAuth()` helper created and tested
- [ ] All Server Actions use the helper
- [ ] No duplicate session-check logic remains
```
