import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LansmanPage from "@/pages/LansmanPage";

vi.mock("@/components/LansmanForm", () => ({
  default: () => <div>Lansman form mock</div>,
}));

describe("LansmanPage", () => {
  it("renders the redesigned launch content without the pending list", () => {
    render(<LansmanPage />);

    expect(screen.getByText(/Influencer Partner modeliyle global diaspora ağına davetlisin/i)).toBeInTheDocument();
    expect(screen.getByText("Lansman form mock")).toBeInTheDocument();
    expect(screen.queryByText(/Onay Bekleyenler/i)).not.toBeInTheDocument();
  });
});
