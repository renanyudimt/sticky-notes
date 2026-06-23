# 🗒️ Sticky Notes

Single-page sticky‑notes board built with **React 19 + TypeScript (strict)** and
**Vite**. All the core interactions (create, move, resize, delete‑by‑drag) are
implemented **from scratch on top of Pointer Events** — no drag/resize libraries.
The surrounding chrome is styled with **styled-components** on top of a small set
of **hand‑rolled UI primitives** (button, dialog, popover, spinner, toast).

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
- **V** — switchable data source (`local` vs simulated `api` with latency),
  modeled through React Query

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

Feature‑oriented modules, each folder with a barrel `index.ts`, co‑located tests
and a clear separation of responsibilities (SOLID). Imports use the `@` alias for
`src/`.

```
src/
├── components/
│   ├── board/        # the canvas: Board, Toolbar, TrashZone, CreatePreview,
│   │   │             #   ThemeToggle, ClearAllDialog, InfoDialog, ActivityIndicator
│   │   ├── hooks/    # useBoardController, useCreateNoteDrag
│   │   └── utils/    # normalizeRect, toBoardRect
│   ├── notes/        # NoteCard(+Header), NoteEditor, NoteColorPicker,
│   │   │             #   ResizeHandle, DeleteNoteDialog
│   │   ├── hooks/    # useNoteMove, useNoteResize
│   │   ├── store/    # Zustand stores + fine‑grained selector hooks
│   │   └── utils/    # pure geometry: clampSize/Position, resizeRect, rectsIntersect…
│   └── shared/       # hand‑rolled UI primitives (button, dialog, popover, spinner, toast)
├── services/notes/   # React Query data layer: queries, mutations, keys,
│                     #   repository (localStorage) and types
├── query/            # createQueryClient (shared QueryClient factory)
├── hooks/            # cross‑cutting: usePointerDrag, useDebounce, useSystemTheme
├── lib/              # framework‑agnostic helpers (slot, debounce)
└── theme/            # styled-components GlobalStyles + ThemeModeProvider (light/dark)
```

### Design notes

- **Pointer Events primitive.** `usePointerDrag` tracks a single pointer via
  window listeners (so a gesture survives leaving the element) and reports
  deltas. Move, resize and create‑by‑drag are all built on it.
- **State.** UI/interaction state lives in focused **Zustand** stores
  (`notesLocalStore`, `dataSourceStore`, `dragStore`, `activityStore`), each
  exposing fine‑grained selector hooks to keep re‑renders minimal. The async data
  layer is handled by **TanStack React Query** (queries/mutations under
  `services/notes`).
- **Persistence.** `notesRepository` reads/writes notes to `localStorage`. The
  `local` and `api` data sources use separate storage keys; `api` adds a
  simulated latency to exercise loading/error states through React Query, and the
  active source is switchable from the toolbar.
- **Styling.** styled-components with a typed theme and a `ThemeModeProvider`
  (light/dark, following the system preference), plus a small set of accessible UI
  primitives built in‑house rather than pulled from a component library.
- **Testing.** 300+ Vitest + Testing‑Library tests, ~95% line coverage. Logic is
  tested at the unit level (utils, stores, hooks) and components by behavior.
