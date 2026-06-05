# 🗒️ Sticky Notes

Single-page sticky‑notes board built with **React 19 + TypeScript (strict)** and **Vite**.
All the core interactions (create, move, resize, delete‑by‑drag) are implemented
**from scratch on top of Pointer Events** — no drag/resize libraries. Tailwind v4
and a couple of shadcn/ui primitives are used only for the surrounding chrome.

## Features

1. **Create** a note at a position and size — draw a rubber‑band rectangle on the
   board, or double click to drop a default‑sized note.
2. **Resize** a note by dragging any of its **8 handles** (edges + corners), with
   min/max clamping and board‑boundary limits.
3. **Move** a note by dragging its header.
4. **Delete** a note by dragging it over the **trash zone** (highlights on hover).

**Bonus**

- **I** — inline text editing
- **II** — bring note to front on interaction (z‑ordering)
- **III** — persistence to `localStorage` (restored on reload)
- **IV** — per‑note colors (palette popover)
- **V** — async mock REST backend (simulated latency), switchable from the toolbar

## Requirements

- Node.js ≥ 20 (developed on Node 22)

## Getting started

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:5175
```

## Scripts

| Script                  | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server (port **5175**)                   |
| `npm run build`         | Type‑check (`tsc -b`) and build for production into `dist/` |
| `npm run preview`       | Preview the production build                                |
| `npm run lint`          | Run ESLint                                                  |
| `npm run test`          | Run the unit test suite (Vitest)                            |
| `npm run test:watch`    | Run tests in watch mode                                     |
| `npm run test:coverage` | Run tests with a coverage report                            |

## Browser support

Latest Chrome (Win/Mac), Firefox (all platforms) and Edge, at a minimum
resolution of 1024×768 (desktop‑first).

## Architecture

Domain‑oriented modules under `src/modules`, each with a barrel `index.ts`,
co‑located tests and a clear separation of responsibilities (SOLID):

```
src/modules/
├── notes/         # domain: model, store (Zustand), interaction hooks, UI
│   ├── store/     # createNotesStore (factory) + NotesProvider + useNotes
│   ├── hooks/     # useNoteMove, useNoteResize
│   ├── utils/     # pure geometry: clampSize/Position, resizeRect, nextZIndex…
│   └── components/# NoteCard, NoteEditor, NoteColorPicker, ResizeHandle
├── board/         # the canvas: Board, Toolbar, TrashZone, CreatePreview
│   └── hooks/     # useCreateNoteDrag, useBoardController
├── persistence/   # NotesRepository interface + localStorage & mock‑REST impls
└── shared/        # usePointerDrag primitive, cn/debounce, shadcn ui, theme
```

### Design notes

- **Pointer Events primitive.** `usePointerDrag` tracks a single pointer via
  window listeners (so a gesture survives leaving the element) and reports
  deltas. Move, resize and create‑by‑drag are all built on it.
- **State.** A Zustand store created per‑provider (`createNotesStore`) keeps the
  app testable and injects the repository (Dependency Inversion). Saves are
  debounced; hydration is async with loading/error states.
- **Persistence.** The board depends only on the `NotesRepository` interface;
  `localStorage` and the async mock‑REST backend are interchangeable
  implementations selectable from the toolbar.
- **Testing.** 120+ Vitest + Testing‑Library tests, ~94% coverage. Logic is
  tested at the unit level (utils, store, hooks) and components by behavior.
