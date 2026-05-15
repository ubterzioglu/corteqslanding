import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import SiteHeader from "@/components/SiteHeader";

describe("SiteHeader", () => {
  it("points the register CTA to the public form URL and shows the updated brand text", () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Kayıt Ol!" })).toHaveAttribute("href", "https://corteqs.net/form");
    expect(screen.getByText("CorteQS")).toBeInTheDocument();
    expect(screen.getByText("Global Türk Diaspora Network")).toBeInTheDocument();
  });
});
