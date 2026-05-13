import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "@/App";

vi.mock("@/pages/May19CampaignPage.tsx", () => ({
  default: () => <div>May19 Campaign Route</div>,
}));

vi.mock("@/pages/May19MapPage.tsx", () => ({
  default: () => <div>May19 Map Route</div>,
}));

describe("App 19 Mayis routing", () => {
  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the public 19051919 route", () => {
    window.history.pushState({}, "", "/19051919");

    render(<App />);

    expect(screen.getByText("May19 Campaign Route")).toBeInTheDocument();
  });

  it("renders the public 19051919 harita route", () => {
    window.history.pushState({}, "", "/19051919/harita");

    render(<App />);

    expect(screen.getByText("May19 Map Route")).toBeInTheDocument();
  });
});
