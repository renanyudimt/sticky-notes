import { act, render, screen, waitFor } from "@/test/renderWithTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { useEffect, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createRenderCounter, RenderProbe } from "@/test/renderCount";
import {
  notesLocalStore,
  resetDataSourceStore,
  resetNotesStore,
  useNoteIds,
  useNotesMutations,
  type NotesMutations,
} from "@/components/notes";
import type { Note } from "@/services/notes";

import { NoteCardConnector } from "./NoteCardConnector";

const handlers = {
  zIndex: 0,
  getBoardRect: () => null,
  onFocus: vi.fn(),
  onMoveStart: vi.fn(),
  onMove: vi.fn(),
  onMoveEnd: vi.fn(),
  onResize: vi.fn(),
  onResizeEnd: vi.fn(),
  onColorChange: vi.fn(),
  onEditText: vi.fn(),
  onDelete: vi.fn(),
};

const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 0, y: 0 },
  size: { width: 220, height: 220 },
  text: "",
  color: "yellow",
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

function Seed({ children }: { children: (id?: string) => ReactNode }) {
  const mutations = useNotesMutations();
  const ids = useNoteIds();
  return (
    <>
      <button
        type="button"
        onClick={() => mutations.createNote({ position: { x: 12, y: 34 } })}
      >
        add
      </button>
      {children(ids[0])}
    </>
  );
}

describe("NoteCardConnector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    resetDataSourceStore();
    window.localStorage.clear();
  });

  it("should render nothing for an unknown id", () => {
    render(<NoteCardConnector id="missing" {...handlers} />, {
      wrapper: createWrapper(),
    });
    expect(screen.queryByRole("article", { name: "Note" })).toBeNull();
  });

  it("should render the note it sources from the query", async () => {
    const user = userEvent.setup();
    render(
      <Seed>
        {(id) => (id ? <NoteCardConnector id={id} {...handlers} /> : null)}
      </Seed>,
      { wrapper: createWrapper() },
    );

    expect(screen.queryByRole("article", { name: "Note" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "add" }));

    const note = await screen.findByRole("article", { name: "Note" });
    expect(note).toHaveStyle({ left: "12px", top: "34px" });
  });

  // The core win of the granular subscriptions: moving one note re-renders only
  // its own connector. The probes share a parent that subscribes to the (stable)
  // id list, so a sibling's probe fires only if the sibling itself commits.
  it("should re-render only the moved note's connector", async () => {
    notesLocalStore.setState({
      notes: [createMockNote({ id: "a" }), createMockNote({ id: "b" })],
    });
    const counter = createRenderCounter();
    const mutationsRef: { current: NotesMutations | null } = { current: null };

    function Capture() {
      const mutations = useNotesMutations();
      useEffect(() => {
        mutationsRef.current = mutations;
      }, [mutations]);
      return null;
    }

    function Cards() {
      const ids = useNoteIds();
      return (
        <>
          {ids.map((id) => (
            <RenderProbe key={id} id={id} onRender={counter.onRender}>
              <NoteCardConnector id={id} {...handlers} />
            </RenderProbe>
          ))}
        </>
      );
    }

    render(
      <>
        <Capture />
        <Cards />
      </>,
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(mutationsRef.current).not.toBeNull());

    counter.reset();
    act(() => {
      mutationsRef.current!.patchNote("a", { position: { x: 200, y: 200 } });
    });

    await waitFor(() => expect(counter.count("a")).toBeGreaterThan(0));
    expect(counter.count("b")).toBe(0);
  });
});
