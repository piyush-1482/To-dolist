# MyTodo — Responsive Vanilla JS To‑Do App

A minimal, accessible, responsive To‑Do list built with plain HTML, CSS and vanilla JavaScript. No frameworks or build tools — drop into any static web server or open index.html in a browser.

## Features
- Add tasks (press Enter or click Add)
- Mark tasks complete / incomplete (checkbox)
- Inline edit (double‑click or Edit button). Enter saves, Esc cancels
- Delete task with confirmation
- Filter views: All | Active | Completed (filter choice persisted)
- Clear all completed tasks (confirmation)
- Persist tasks and order via localStorage (loads on refresh)
- Drag‑and‑drop reorder (HTML5 Drag API)
- Accessible: semantic markup, labels, ARIA live region, keyboard support

## Files
- `index.html` — main page (semantic layout + navbar + footer)
- `styles.css` — BEM CSS, responsive styles, variables
- `script.js` — app logic (IIFE, no globals, localStorage, DnD)
- `README.md` — this file

## How to run
1. Place the files in a folder (already at `c:\Users\piyus\OneDrive\Desktop\ToDolist`).
2. Open `index.html` in any modern browser OR run a local static server (VS Code Live Server recommended).
3. Start adding tasks.

## Usage quick guide
- Add: type in input then press Enter or click Add.
- Edit: double‑click a task text or click ✏️; Enter saves, Esc cancels.
- Toggle: use the checkbox to mark complete/incomplete.
- Delete: click 🗑️ and confirm.
- Filter: click All / Active / Completed (selection is saved).
- Clear completed: click "Clear completed" and confirm.
- Reorder: drag a list item to reorder; order is saved.

## Accessibility & Keyboard
- Semantic elements: main, header, section, footer.
- Labels for inputs and an ARIA live status region for announcements.
- Keyboard: Enter to add/save, Esc to cancel editing. Tab order follows visual order.

## Known limitations
- No undo for deletions.
- Drag‑and‑drop experience may vary on small touch devices.
- Minimal input sanitization — text is stored as plain strings.

## Troubleshooting
- If tasks don't persist, ensure browser has localStorage enabled and not in strict privacy mode.
- If JavaScript errors occur, open DevTools Console (F12) and paste any error messages for debugging.

## License
MIT — adapt as you like.

```// filepath: c:\Users\piyus\OneDrive\Desktop\ToDolist\README.md
# MyTodo — Responsive Vanilla JS To‑Do App

A minimal, accessible, responsive To‑Do list built with plain HTML, CSS and vanilla JavaScript. No frameworks or build tools — drop into any static web server or open index.html in a browser.

## Features
- Add tasks (press Enter or click Add)
- Mark tasks complete / incomplete (checkbox)
- Inline edit (double‑click or Edit button). Enter saves, Esc cancels
- Delete task with confirmation
- Filter views: All | Active | Completed (filter choice persisted)
- Clear all completed tasks (confirmation)
- Persist tasks and order via localStorage (loads on refresh)
- Drag‑and‑drop reorder (HTML5 Drag API)
- Accessible: semantic markup, labels, ARIA live region, keyboard support

## Files
- `index.html` — main page (semantic layout + navbar + footer)
- `styles.css` — BEM CSS, responsive styles, variables
- `script.js` — app logic (IIFE, no globals, localStorage, DnD)
- `README.md` — this file

## How to run
1. Place the files in a folder (already at `c:\Users\piyus\OneDrive\Desktop\ToDolist`).
2. Open `index.html` in any modern browser OR run a local static server (VS Code Live Server recommended).
3. Start adding tasks.

## Usage quick guide
- Add: type in input then press Enter or click Add.
- Edit: double‑click a task text or click ✏️; Enter saves, Esc cancels.
- Toggle: use the checkbox to mark complete/incomplete.
- Delete: click 🗑️ and confirm.
- Filter: click All / Active / Completed (selection is saved).
- Clear completed: click "Clear completed" and confirm.
- Reorder: drag a list item to reorder; order is saved.

## Accessibility & Keyboard
- Semantic elements: main, header, section, footer.
- Labels for inputs and an ARIA live status region for announcements.
- Keyboard: Enter to add/save, Esc to cancel editing. Tab order follows visual order.

## Known limitations
- No undo for deletions.
- Drag‑and‑drop experience may vary on small touch devices.
- Minimal input sanitization — text is stored as plain strings.

## Troubleshooting
- If tasks don't persist, ensure browser has localStorage enabled and not in strict privacy mode.
- If JavaScript errors occur, open DevTools Console (F12) and paste any error messages for debugging.

## License
MIT — adapt
