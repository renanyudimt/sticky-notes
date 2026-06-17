import { act, render, screen } from "@/test/renderWithTheme";
import userEvent from "@testing-library/user-event";
import { useEffect, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRenderCounter, RenderProbe } from "@/test/renderCount";

import { resetNotesStores, useNoteActions, useNoteIds } from "../../store";
import { NoteEditorConnector } from "./NoteEditorConnector";

function Seed({ children }: { children: (id?: string) => ReactNode }) {
  const actions = useNoteActions();
  const ids = useNoteIds();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          actions.addNote({ position: { x: 0, y: 0 }, text: "hello" })
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
    resetNotesStores();
  });

  it("should render the note's text sourced from the store", async () => {
    const user = userEvent.setup();
    render(
      <Seed>{(id) => (id ? <NoteEditorConnector id={id} /> : null)}</Seed>,
    );

    await user.click(screen.getByRole("button", { name: "add" }));

    expect(
      await screen.findByRole("textbox", { name: "Note content" }),
    ).toHaveValue("hello");
  });

  it("should reflect typed text driven by the store", async () => {
    const user = userEvent.setup();
    render(
      <Seed>{(id) => (id ? <NoteEditorConnector id={id} /> : null)}</Seed>,
    );

    await user.click(screen.getByRole("button", { name: "add" }));
    const textarea = await screen.findByRole("textbox", {
      name: "Note content",
    });

    await user.clear(textarea);
    await user.type(textarea, "x");

    expect(textarea).toHaveValue("x");
  });

  it("should not re-render when an unrelated note's text changes", () => {
    const counter = createRenderCounter();
    const actionsRef: { current: ReturnType<typeof useNoteActions> | null } = {
      current: null,
    };

    function Capture() {
      const actions = useNoteActions();
      useEffect(() => {
        actionsRef.current = actions;
      }, [actions]);
      return null;
    }

    function Editors() {
      const ids = useNoteIds();
      return (
        <>
          {ids.map((id) => (
            <RenderProbe key={id} id={id} onRender={counter.onRender}>
              <NoteEditorConnector id={id} />
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
    );

    let a = "";
    let b = "";
    act(() => {
      a = actionsRef.current!.addNote({ position: { x: 0, y: 0 } }).id;
      b = actionsRef.current!.addNote({ position: { x: 0, y: 0 } }).id;
    });

    counter.reset();
    act(() => {
      actionsRef.current!.editNoteText(a, "typed");
    });

    expect(counter.count(a)).toBeGreaterThan(0);
    expect(counter.count(b)).toBe(0);
  });
});
