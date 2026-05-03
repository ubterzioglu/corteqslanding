import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LansmanPage from "@/pages/LansmanPage";

vi.mock("@/components/LansmanForm", () => ({
  default: () => <div>Lansman form mock</div>,
}));

describe("LansmanPage", () => {
  it("renders the redesigned launch content without the pending list", () => {
    const { container } = render(<LansmanPage />);

    expect(screen.getByText(/Influencer Partner modeliyle global diaspora ağına davetlisin/i)).toBeInTheDocument();
    expect(screen.getByText("Lansman form mock")).toBeInTheDocument();
    expect(screen.queryByText(/Onay Bekleyenler/i)).not.toBeInTheDocument();
    expect(container.querySelector('[class*="sm:grid-cols-2"]')).toBeNull();
    expect(screen.queryByText(/Formu doldur!/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Bu lansmanda neden yer almalısın\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Lansmanda konuşacağımız başlıklar/i)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("min-h-screen", "overflow-hidden");
  });
});
