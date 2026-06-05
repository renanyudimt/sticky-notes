import { createContext } from "react";

import type { NotesStore } from "../createNotesStore";

export const NotesStoreContext = createContext<NotesStore | null>(null);
