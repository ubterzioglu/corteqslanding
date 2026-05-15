import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import HeroSection from "@/components/HeroSection";

describe("HeroSection", () => {
  it("shows the 19 Mayis coming soon pill only in the homepage hero", () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );

    expect(screen.getByText("19 Mayıs Etkinlikleri")).toBeInTheDocument();
    expect(screen.getAllByText("Yakında!").length).toBeGreaterThan(0);
  });
});
