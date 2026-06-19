import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";

if (import.meta.env.DEV && import.meta.env.VITE_REACT_SCAN === "true") {
  const { scan } = await import("react-scan");
  scan({ enabled: true });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
