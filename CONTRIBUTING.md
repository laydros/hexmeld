# Contributing to Hexmeld

Thank you for your interest in improving Hexmeld! This document describes how to report issues, propose changes, and test updates locally while keeping the project fully offline-friendly.

## Reporting Issues

When opening an issue, please include the following details so maintainers can triage quickly:

- **Summary:** One sentence describing the problem or request.
- **Steps to reproduce:** Numbered list that allows us to follow the exact actions that led to the problem.
- **Expected vs. actual behavior:** Clarify what you thought would happen and what actually occurred.
- **Environment:** Browser name and version, operating system, and whether the game was installed as a PWA or run directly from the HTML file.
- **Screenshots or recordings (optional):** Provide visual context if it helps illustrate the issue.

Apply the most appropriate label when filing an issue:

- `bug` — Gameplay or UI defects.
- `enhancement` — Feature requests or UX improvements.
- `documentation` — Gaps or inaccuracies in docs.
- `question` — Clarifications about behavior, design, or usage.

If you are unsure which label fits, leave a comment in the issue body and a maintainer will help classify it.

## Submitting Pull Requests

1. **Branch naming:** Use short, descriptive branch names such as `feature/improved-preview`, `fix/pathfinding-bug`, or `docs/update-readme`.
2. **Sync with main:** Pull the latest `main` branch before creating your branch.
3. **Scope:** Keep pull requests focused—multiple unrelated changes should be split into separate PRs.
4. **Coding conventions:**
   - Follow the existing HTML, CSS, and JavaScript style patterns in [`index.html`](index.html). Inline modules, `const`/`let`, arrow functions, template literals, and compact CSS selectors are preferred.【F:index.html†L1-L87】【F:index.html†L88-L119】
   - Keep the application self-contained without third-party dependencies so the game remains offline-ready.【F:game-spec-002.md†L1-L52】【F:game-spec-002.md†L88-L112】
   - Increment the `GAME_VERSION` constant in `index.html` whenever you change user-facing behavior or assets, and mention the new version in your PR description.【F:index.html†L107-L117】
5. **Reviews:** Request a review from at least one maintainer. Expect at least one round of feedback. Address feedback with follow-up commits rather than force-pushing unless asked.
6. **Testing:** Document how you verified your changes (see [Local Setup & Testing](#local-setup--testing)).
7. **PR description:** Summarize what changed, why, and any follow-up work. Reference related issues using `Fixes #123` when applicable.

## Local Setup & Testing

Hexmeld is a static web application. To work on it locally:

1. Clone the repository and create a feature branch.
2. Open [`index.html`](index.html) directly in a modern browser to verify gameplay changes. Because the project is built as a single-file application with no external dependencies, it runs entirely offline.【F:game-spec-002.md†L1-L52】【F:game-spec-002.md†L88-L112】
3. Optional: start a lightweight HTTP server (e.g., `python3 -m http.server`) if you need to test PWA behaviors like the manifest.
4. When updating instructions or strategy documentation, also preview [`instructions.html`](instructions.html) to ensure visual consistency.【F:instructions.html†L1-L80】
5. Before submitting, reload the page with your changes to confirm there are no console errors and that UI elements render as expected.

## Respecting the Offline Goal

Hexmeld is intentionally designed to run without network access. Please avoid introducing code or assets that require external CDNs or runtime connectivity so the game continues to function offline.【F:game-spec-002.md†L88-L112】 If you need new assets, commit them to the repository.

Thanks again for helping make Hexmeld better!
