import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/renderWithTheme";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("should render an accessible loading status", () => {
    render(<Spinner />);

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });
});
