import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AdminHomePage from "@/pages/admin/AdminHomePage";

function renderAdminHomePage(onLogout = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <Outlet
              context={{
                session: {
                  user: {
                    email: "admin@corteqs.test",
                  },
                },
                onLogout,
              }}
            />
          }
        >
          <Route index element={<AdminHomePage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminHomePage", () => {
  it("shows all header areas on the admin landing page", () => {
    renderAdminHomePage();

    expect(screen.getByText("Üye Takibi")).toBeInTheDocument();
    expect(screen.getByText("Ref Kod")).toBeInTheDocument();
    expect(screen.getByText("Muhasebe")).toBeInTheDocument();
    expect(screen.getByText("Engine")).toBeInTheDocument();
    expect(screen.getByText("Globe")).toBeInTheDocument();
    expect(screen.getByText("Founders")).toBeInTheDocument();
    const externalLinks = screen.getAllByRole("link", { name: /Bağlantıyı Aç/i });
    expect(externalLinks[0]).toHaveAttribute("href", "https://eng.corteqs.net");
    expect(externalLinks[1]).toHaveAttribute("href", "https://globe.corteqs.ret");
    expect(externalLinks[2]).toHaveAttribute("href", "https://corteqs.net/founders");
    expect(screen.getByText("Diğer İşlemler")).toBeInTheDocument();
    expect(screen.getByText("Haber Bandı")).toBeInTheDocument();
    expect(screen.getByText("Sosyal Medya")).toBeInTheDocument();
    expect(screen.getByText("Güncellemeler")).toBeInTheDocument();
    expect(screen.getByText("Diğer Kayıtlar")).toBeInTheDocument();
    expect(screen.getByText("Lansman Katılım")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("WikiDash")).toBeInTheDocument();
    expect(screen.getByText("Toplantılar / Aksiyonlar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Çıkış/i })).toBeInTheDocument();
  });

  it("uses the shared logout action", () => {
    const onLogout = vi.fn();

    renderAdminHomePage(onLogout);
    fireEvent.click(screen.getByRole("button", { name: /Çıkış/i }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
