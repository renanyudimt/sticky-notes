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

import { NoteEditorConnector } from "./NoteEditorConnector";
import { createMockNote } from "@/test/createMockNote";

const onEditText = vi.fn();

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
        onClick={() =>
          mutations.createNote({ position: { x: 0, y: 0 }, text: "hello" })
        }
      >
        add
      </button>
      {children(ids[0])}
    </>
  );
}

describe("NoteEditorConnector", () => {
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

  it("should render the note's committed text", async () => {
    const user = userEvent.setup();
    render(
      <Seed>
        {(id) =>
          id ? <NoteEditorConnector id={id} onEditText={onEditText} /> : null
        }
      </Seed>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "add" }));

    expect(
      await screen.findByRole("textbox", { name: "Note content" }),
    ).toHaveValue("hello");
  });

  it("should reflect typed text locally", async () => {
    const user = userEvent.setup();
    render(
      <Seed>
        {(id) =>
          id ? <NoteEditorConnector id={id} onEditText={onEditText} /> : null
        }
      </Seed>,
      { wrapper: createWrapper() },
    );

    await user.click(screen.getByRole("button", { name: "add" }));
    const textarea = await screen.findByRole("textbox", {
      name: "Note content",
    });

    await user.clear(textarea);
    await user.type(textarea, "x");

    expect(textarea).toHaveValue("x");
  });

  it("should not re-render when an unrelated note's text changes", async () => {
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

    function Editors() {
      const ids = useNoteIds();
      return (
        <>
          {ids.map((id) => (
            <RenderProbe key={id} id={id} onRender={counter.onRender}>
              <NoteEditorConnector id={id} onEditText={onEditText} />
            </RenderProbe>
          ))}
        </>
      );
    }

    render(
      <>
        <Capture />
        <Editors />
      </>,
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(mutationsRef.current).not.toBeNull());

    counter.reset();
    act(() => {
      mutationsRef.current!.patchNote("a", { text: "typed" });
    });

    await waitFor(() => expect(counter.count("a")).toBeGreaterThan(0));
    expect(counter.count("b")).toBe(0);
  });
});
