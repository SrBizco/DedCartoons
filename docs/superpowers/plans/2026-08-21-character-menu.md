# Character Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver an accessible static Ded Cartoons menu that launches the supplied Keladd and Dander clips.

**Architecture:** A dependency-free HTML shell loads a small JavaScript state controller. The controller maps character selection to asset paths and controls a dialog video element; CSS positions responsive visual hotspots above the supplied menu composition.

**Tech Stack:** HTML, CSS, ES modules, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-21-character-menu-design.md`

## Global Constraints

- Use supplied assets only.
- Do not perform commits, pushes, branches, or worktrees.
- Use no production dependencies.
- The videos must not autoplay until a visitor selects a character.

---

### Task 1: Player state controller

**Files:**
- Create: `src/player.js`
- Test: `test/player.test.js`

**Interfaces:**
- Produces: `createCharacterPlayer({ dialog, video, title, closeButton, triggerButtons })`
- Produces: controller methods `open(character)`, `close()`, and `destroy()`.

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createCharacterPlayer } from '../src/player.js';

test('opens the selected character video and closes it cleanly', () => {
  // Build small DOM-like fakes, open 'keladd', then assert the matching
  // source is selected and close restores the dialog state.
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because `src/player.js` does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
export function createCharacterPlayer(elements) {
  return { open(character) {}, close() {}, destroy() {} };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`

Expected: PASS.

### Task 2: Responsive menu page

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/main.js`
- Create: `public/assets/MENU-1.png`
- Create: `public/assets/TITULO.png`
- Create: `public/assets/Keladd-Selec.mp4`
- Create: `public/assets/Dander-Selec.mp4`

**Interfaces:**
- Consumes: `createCharacterPlayer` from `src/player.js`.
- Produces: browser entry page with `data-character` triggers and a `dialog` player.

- [ ] **Step 1: Wire semantic HTML and asset paths**
- [ ] **Step 2: Add responsive CSS with desktop hotspot coordinates and a narrow-screen layout**
- [ ] **Step 3: Connect page elements to the tested controller**
- [ ] **Step 4: Run `npm test` and manually open `index.html` in a browser**
