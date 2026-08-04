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

- Do not replace affordance with instructional copy. A concept reference, expandable detail, navigation path, or retained context must reveal itself through shape, placement, state, focus, pointer/touch feedback, and a concise label where needed. Remove sentences that merely narrate what the visible interaction already communicates, and never repeat the same action or outcome across headings, intro copy, cards, and hints.
- Before completing a UI checkpoint, audit every visible sentence. Keep only content the user is here to learn, a decision they must make, or guidance that cannot be expressed safely through the interaction itself. Reclaim the space from redundant explanatory copy for the primary content.
- Design explorations must use realistic instructional material and representative graph complexity. Placeholder terms, shallow word chains, and decorative sample nodes are not sufficient evidence that information density, hierarchy, semantic zoom, concept preview, or mobile adaptation works.
- Concept references use a close dotted underline rather than a solid rule. Their preview is a shared top-level overlay anchored beside the activating text or virtual canvas region; it must not be clipped by a node, canvas, phone mockup, transform, or overflow container. DOM, SVG, and canvas-backed references must use the same visual component and interaction states.
- Treat related UI capabilities as one coherent workspace when the user says they should be combined; do not present them as mutually exclusive proposals unless the user explicitly asks for alternatives.
- Before completing any HTML, demo, or UI checkpoint, render it in a real browser at 1024×768, 1280×900, and 1440×900 and inspect both supported themes.
- Before changing canvas layout, pan, zoom, step focus, or mobile Viewer behavior, read `docs/canvas-coordinate-system.md`. Mobile and desktop use the same world coordinates. Never derive camera position from a step index, document width, `window.innerWidth`, or device screen width; use the measured world bounds and the intersection of the canvas content rect with `visualViewport`. `clientWidth` alone is not the visible canvas width when browser zoom is active.
- For mobile canvas checkpoints, verify direct entry to the first, a middle, and the final step at 390×844 and 430×932. Record current-node client bounds, page overflow, canvas overflow, and scroll offsets immediately after pointer up and after settling.
- Also verify an in-place viewport-width transition from 590px to 390px. Before user pan/zoom the current step must refocus using the final canvas width; after user pan/zoom the same resize must preserve the user's camera.
- At 390×844, also verify browser page scale 1.3 (a 300px `visualViewport`) and scale 1. The current and next-step node bounds must be centered in the visible intersection at both scales, with no document overflow or runtime errors.
- Inspect screenshots and DOM geometry for panel overlap, clipping, unintended page overflow, canvas bounds, node placement, and edge endpoints. Source parsing or HTTP success alone is not visual verification.
- Diagram edges must derive their endpoints from measured node bounds or shared geometry. Do not use independently tuned percentages, widths, and rotations for lines that must stay attached to nodes.
- When a design uses semantic zoom, nested nodes, or computed grouping, verify every supported zoom level for node overlap, content clipping, group transitions, and measured edge attachment. Do not validate only the default zoom.
- When a design offers alternate child-node presentations or drag-and-drop authoring, verify every supported child mode in both Editor and Viewer. Exercise a real drag, the click or keyboard fallback, open and close behavior, and geometry after content has been added.
- For child nodes embedded inside a parent, verify that the UI visibly communicates that more detail is available and that mouse, touch-equivalent click, and keyboard can open, close, and enter the focused child view without triggering the parent canvas gesture.
- For automatic clustering, start from nodes without manually authored groups. Verify zoom-out suggestions, name and membership edits, highlight-on-original-nodes review, override persistence after zoom changes, and stable geometry when suggestions are recalculated.
- Check the browser console and key interactions after visual inspection. Record the verified viewports and outcomes in the checkpoint evidence.

## Checkpoint commits and pushes

- Treat each coherent, user-visible increment that has been verified as a work checkpoint.
- At every checkpoint, inspect the intended scope, stage only the checkpoint files, create a terse commit, and push the current branch before starting the next checkpoint.
- Do not create noisy commits for individual keystrokes or incomplete states; a checkpoint must be reviewable and internally consistent.
- If unrelated user changes are present, preserve them and exclude them from the checkpoint unless the user explicitly includes them.
- If a commit or push cannot complete, stop before the next checkpoint and report the exact blocker.
- Never claim a checkpoint was committed or pushed unless both operations succeeded.
