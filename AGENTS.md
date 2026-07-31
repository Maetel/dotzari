# Repository agent instructions

## Product and architecture SSOT

- Before planning or implementing product work, read `docs/product-spec.md` completely.
- `docs/product-spec.md` is the single source of truth for product intent, scope, behavior, architecture, priorities, and acceptance criteria.
- Base all implementation plans, code, tests, examples, and documentation on the current SSOT.
- When a user discussion changes or clarifies a requirement, update the relevant SSOT section and its decision record before or together with implementation.
- Do not silently decide an item marked unresolved. Surface the ambiguity and get agreement before implementing work that depends on it.
- If code, tests, README content, or another document conflicts with the SSOT, report the conflict and align them with the SSOT unless the user explicitly revises the SSOT.
- Keep unresolved questions, decisions, and superseded decisions traceable; do not erase decision history.

## Visual design verification

- Treat related UI capabilities as one coherent workspace when the user says they should be combined; do not present them as mutually exclusive proposals unless the user explicitly asks for alternatives.
- Before completing any HTML, demo, or UI checkpoint, render it in a real browser at 1024×768, 1280×900, and 1440×900 and inspect both supported themes.
- Inspect screenshots and DOM geometry for panel overlap, clipping, unintended page overflow, canvas bounds, node placement, and edge endpoints. Source parsing or HTTP success alone is not visual verification.
- Diagram edges must derive their endpoints from measured node bounds or shared geometry. Do not use independently tuned percentages, widths, and rotations for lines that must stay attached to nodes.
- Check the browser console and key interactions after visual inspection. Record the verified viewports and outcomes in the checkpoint evidence.

## Checkpoint commits and pushes

- Treat each coherent, user-visible increment that has been verified as a work checkpoint.
- At every checkpoint, inspect the intended scope, stage only the checkpoint files, create a terse commit, and push the current branch before starting the next checkpoint.
- Do not create noisy commits for individual keystrokes or incomplete states; a checkpoint must be reviewable and internally consistent.
- If unrelated user changes are present, preserve them and exclude them from the checkpoint unless the user explicitly includes them.
- If a commit or push cannot complete, stop before the next checkpoint and report the exact blocker.
- Never claim a checkpoint was committed or pushed unless both operations succeeded.
