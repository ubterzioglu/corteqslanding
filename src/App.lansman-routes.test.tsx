import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

vi.mock("@/pages/AdminLansmanPage.tsx", () => ({
  default: () => <div>Standalone Lansman Admin Page</div>,
}));

vi.mock("@/components/admin/AdminLayout", () => ({
  default: () => <div>Shared Admin Layout</div>,
}));

describe("App lansman admin routing", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/admin/lansman");
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the standalone lansman admin route outside the shared admin shell", () => {
    render(<App />);

    expect(screen.getByText("Standalone Lansman Admin Page")).toBeInTheDocument();
    expect(screen.queryByText("Shared Admin Layout")).not.toBeInTheDocument();
  });
});
