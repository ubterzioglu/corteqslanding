import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Outlet } from "react-router-dom";

import App from "@/App";

vi.mock("@/pages/AdminLansmanPage.tsx", () => ({
  default: () => <div>Standalone Lansman Admin Page</div>,
}));

vi.mock("@/components/admin/AdminLayout", () => ({
  default: () => (
    <div>
      <div>Shared Admin Layout</div>
      <Outlet />
    </div>
  ),
}));

describe("App founders routing", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/founders");
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the founders page on /founders", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "CorteQS Global Türk Diaspora Network" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Burak Akçakanat" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Umut Barış Terzioğlu" })).toBeInTheDocument();
    expect(screen.getAllByText("Profesyonel Arka Plan")).toHaveLength(2);
    expect(screen.getByAltText("CorteQS kurucular logosu")).toBeInTheDocument();
    expect(screen.getByAltText("Burak Akçakanat profil fotoğrafı")).toBeInTheDocument();
    expect(screen.getByAltText("Umut Barış Terzioğlu profil fotoğrafı")).toBeInTheDocument();
    expect(screen.queryByText("Coğrafi Bağlam")).not.toBeInTheDocument();
    expect(screen.queryByText("Kurucu Tezi")).not.toBeInTheDocument();
    expect(screen.queryByText("Kurucu Perspektifi")).not.toBeInTheDocument();
  });
});
