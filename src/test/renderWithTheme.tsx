/* eslint-disable react-refresh/only-export-components -- test-only render helper, not a Fast Refresh module */
import { render as rtlRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import { lightTheme } from "@/theme";

/**
 * Drop-in replacement for Testing Library's `render` that wraps the tree in the
 * styled-components ThemeProvider, composing any caller-supplied wrapper inside.
 */
function render(ui: ReactElement, options?: RenderOptions) {
  const { wrapper: CustomWrapper, ...rest } = options ?? {};

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={lightTheme}>
      {CustomWrapper ? <CustomWrapper>{children}</CustomWrapper> : children}
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...rest });
}

export * from "@testing-library/react";
export { render };
