# UI-003: Build shared state components

**Status:** Complete

## Goal

Create Empty, Loading, Error, Success, Blocked/setup, validation, toast, and confirmation components.

## Done when

- [x] Each state has consistent hierarchy and accessible semantics.
- [x] Components support the dashboard and generator states.
- [x] Unit tests cover meaningful content and interactions.

## Delivered

- Composable empty, error/retry, success, and setup-required state panels.
- Accessible loading regions and decorative skeleton blocks.
- Validation summaries with field links and field-level messages.
- A focus-managed confirmation dialog using existing Horizon primitives.
- A Horizon-configured Sonner host and typed toast helper.
