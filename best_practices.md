# 📘 Project Best Practices

## 1. Project Purpose
A small, client-side Todo application implemented as a single HTML file (index.html) with inline CSS and JavaScript. It stores data locally in the browser using localStorage, prioritizes accessibility (labels, live regions, keyboard focus preservation), and runs entirely offline (no network calls).

## 2. Project Structure
- Single-file application:
  - `index.html`: markup, styles, and logic in one document.
- No build step or external dependencies.
- Recommended evolution (when/if the project grows):
  - `src/`
    - `index.html` (minimal shell with external links)
    - `styles/` → CSS files
    - `js/` → ES modules (state, persistence, rendering, handlers)
  - `tests/` → test files

## 3. Test Strategy
- Current state: no tests.
- Recommended frameworks:
  - Unit tests: Jest with jsdom for DOM-driven logic.
  - E2E: Playwright or Cypress for real browser flows (add/edit/delete, filters, keyboard interactions, focus preservation).
- Structure:
  - `tests/unit/*.test.js` for pure functions (e.g., filtering, ID generation fallback logic).
  - `tests/integration/*.test.js` for DOM rendering and event handling using jsdom.
  - `tests/e2e/*.spec.ts` (Playwright/Cypress) for user flows.
- Mocking guidelines:
  - Mock `localStorage` in unit/integration tests. Verify persistence and error paths (quota errors).
- Philosophy:
  - Unit test core logic (filtering, counts, persistence wrapper) with high coverage.
  - Add E2E coverage for critical accessibility paths (focus restore, keyboard shortcuts, live announcements).

## 4. Code Style
- JavaScript
  - Prefer ES modules if splitting files later.
  - Avoid `innerHTML` for user content. Use `textContent` and `createElement` (already followed).
  - Keep functions small and focused (e.g., `render`, `beginEdit`, `persist`).
  - Name booleans with positive, descriptive terms (e.g., `isActive`).
  - Use early returns for guards.
- Accessibility
  - Use native labels (e.g., `<label for="...">`) and live regions purposefully.
  - Maintain keyboard support and visible focus outlines (`:focus-visible`).
  - Preserve focus when re-rendering (current approach using element tracking is good).
- Error handling
  - Wrap storage interactions in try/catch.
  - Prefer non-fatal fallbacks and console warnings over crashes.
- Data & IDs
  - Use `crypto.randomUUID()` when available; fall back to time+random string.
  - Keep state updates followed by a single `render()` and `persist()` call.
- CSS
  - Centralize color tokens in CSS variables (current `--layer-*` + core tokens).
  - Keep focus outlines accessible (contrast + offset).

## 5. Common Patterns
- Single `render()` function re-creates the list and applies:
  - Filtered view derived from `state.filter`.
  - Pluralized item count and aria-live announcements.
  - Focus restoration for input, checkboxes, and action buttons.
- `makeIconButton()` helper to reduce duplication when creating action buttons.
- `persist()` encapsulates localStorage writes with error handling.
- `filteredItems()` cleanly separates filtering logic from rendering.

## 6. Do's and Don'ts
- ✅ Do
  - Keep DOM updates safe and minimal; prefer `textContent` over `innerHTML`.
  - Maintain accessibility: labels, `role="status"`, keyboard flows, focus outlines.
  - Guard storage calls; assume storage may be unavailable.
  - Use descriptive, consistent names; avoid shadowing variables.
  - Update only what’s needed; consider targeted DOM updates if the list grows large.
- ❌ Don’t
  - Don’t introduce frameworks/libraries unless necessary for scope.
  - Don’t remove focus indicators or keyboard interactions.
  - Don’t trust persisted data blindly; avoid assuming shape/type without minimal checks.
  - Don’t mix inline styles with behavior (prefer CSS classes).

## 7. Tools & Dependencies
- External libraries: none required to run.
- Browser APIs used: `localStorage`, `crypto.randomUUID`, DOM APIs.
- Run instructions: open `index.html` in a modern browser.
- Production hardening (if deployed):
  - Externalize CSS/JS and replace inline CSP with nonce/hash-based policies.
  - Consider module bundling only if splitting files or adding dependencies.

## 8. Other Notes
- Keep the single-file simplicity unless the scope expands.
- When adding features, preserve the current accessibility level and focus management.
- If you split files, continue to avoid `innerHTML` for dynamic content; sanitize any externally sourced strings.
- For LLM-generated changes: maintain the patterns here (id generation, persistence guard, render contract, focus preservation) and avoid introducing unnecessary complexity.
