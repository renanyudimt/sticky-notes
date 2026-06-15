# Performance tooling

How to tell if a component/page is performant in this project: few rerenders,
catch bugs early, and know where memoization is missing. React 19 here, so the
React Compiler rules do the memoization analysis for you — as **lint**, not as a
build transform (memoization stays manual).

The four layers:

| Goal | Tool | Where |
|---|---|---|
| See rerenders live (who/why/how slow) | **react-scan** + React DevTools Profiler | runtime, dev only |
| Catch bugs + missing/useless memo statically | **eslint-plugin-react-hooks** (compiler rules) | `npm run lint` |
| Lock render counts against regression | **render-count tests** | `npm test` |
| Watch bundle weight | `vite build` output | `npm run build` |

---

## 1. react-scan — live rerender overlay

Enabled automatically in dev via [src/main.tsx](src/main.tsx) (guarded by
`import.meta.env.DEV`, so it never ships to production — confirmed: not in the
`vite build` bundle).

```bash
npm run dev   # open http://localhost:5175
```

What you get on screen:

- A badge on every component that re-renders, with a **render count**.
- **Slow renders** flashed in red.
- Click the toolbar to inspect a component and see **why** it re-rendered
  (which prop/state changed, whether it was an "unnecessary" render).

How to read it: interact with the area you care about (e.g. drag a note on the
board). If components **far from your interaction** light up, that's a wasted
rerender — a candidate for `React.memo` on the leaf and stable callbacks/`useMemo`
on what you pass it.

### React DevTools Profiler (complementary)

Install the React DevTools browser extension → **Profiler** tab → record an
interaction → read the **flamegraph** (commit duration per component) and the
**ranked** chart (slowest first). Toggle "Highlight updates when components
render" in DevTools settings for a quick visual of render churn.

---

## 2. ESLint — bugs + memoization analysis (React Compiler as a linter)

The config in [eslint.config.js](eslint.config.js) enables the React Compiler
rules in **lint-only** mode. They run the same analysis the compiler does, but
only report — they do **not** transform the build, so memoization stays manual.

```bash
npm run lint
```

What each rule tells you:

| Rule | Tells you |
|---|---|
| `react-hooks/exhaustive-deps` | a `useEffect`/`useMemo`/`useCallback` is missing a dependency (stale-closure **bug**) |
| `react-hooks/use-memo` | a value would benefit from `useMemo` (missing memoization) |
| `react-hooks/preserve-manual-memoization` | an existing `useMemo`/`useCallback` is wrong or useless |
| `react-hooks/static-components` | a component is declared inside another (recreated every render) |
| `react-hooks/set-state-in-render` | `setState` during render (render-loop **bug**) |
| `react-hooks/set-state-in-effect` | a setState-in-effect that causes an extra render |
| `react-hooks/purity` / `immutability` / `refs` | code that breaks the Rules of React (mutates props/state, misuses refs) |

A clean `npm run lint` means: no missing/wrong memoization the analyzer can see,
and no Rules-of-React violations. That is your "memoization is fine" signal —
you do **not** need to sprinkle `useMemo`/`useCallback` defensively.

> Why not turn on the React Compiler build transform? It would auto-memoize at
> runtime. We chose manual memoization + lint for explicit control. To revisit,
> add `babel-plugin-react-compiler` to `@vitejs/plugin-react` in
> [vite.config.ts](vite.config.ts) — the lint rules already enforce the
> preconditions, so the codebase is compiler-ready.

---

## 3. Render-count tests — regression guard

Helper: [src/test/renderCount](src/test/renderCount). `createRenderCounter()`
tallies commits via a `<RenderProbe>` (a thin `<Profiler>` wrapper).

```tsx
import { createRenderCounter, RenderProbe } from '@/test/renderCount';

const counter = createRenderCounter();
render(
  <RenderProbe id="note-card" onRender={counter.onRender}>
    <NoteCard {...props} />
  </RenderProbe>,
);
expect(counter.count('note-card')).toBeLessThanOrEqual(2);
```

Example in
[NoteCard.test.tsx](src/components/notes/components/NoteCard/NoteCard.test.tsx)
(`describe('NoteCard render count')`): asserts the card mounts without a render
loop. Note it commits **twice** on mount — the second commit is the Radix
`Popover` trigger inside `NoteColorPicker` settling, which is expected
third-party behavior, not a bug.

Use this pattern to pin down a verified win: once you memoize a component so a
sibling no longer re-renders, add a test that `reset()`s the counter, triggers
the action, and asserts the sibling's count stayed at `0`.

```bash
npm test            # run once
npm run test:watch  # watch mode while profiling
```

---

## Workflow when "is this component performant?"

1. `npm run dev`, reproduce the interaction, watch **react-scan** for unexpected
   or slow rerenders.
2. `npm run lint` — fix any memoization/Rules-of-React findings.
3. Found a real wasted rerender? Apply manual `React.memo` / `useMemo` /
   `useCallback`, then add a **render-count test** so it can't regress.
4. `npm run build` — sanity-check bundle size in the output.
