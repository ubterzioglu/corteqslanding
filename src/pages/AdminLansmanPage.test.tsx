import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AdminLansmanPage from "@/pages/AdminLansmanPage";

vi.mock("@/components/AdminLansmanTable", () => ({
  default: () => <div>Lansman tablo mock</div>,
}));

describe("AdminLansmanPage", () => {
  afterEach(() => {
    window.sessionStorage.clear();
    vi.unstubAllEnvs();
  });

  it("shows the password gate when access is not granted", () => {
    vi.stubEnv("VITE_ADMIN_PASSWORD", "secret");

    render(<AdminLansmanPage />);

    expect(screen.getByRole("heading", { name: "Lansman Admin" })).toBeInTheDocument();
    expect(screen.getByLabelText("Admin Şifresi")).toBeInTheDocument();
    expect(screen.queryByText("Lansman tablo mock")).not.toBeInTheDocument();
  });

  it("renders the admin table when session access already exists", () => {
    vi.stubEnv("VITE_ADMIN_PASSWORD", "secret");
    window.sessionStorage.setItem("corteqs.lansman.admin.access", "granted");
    window.sessionStorage.setItem("corteqs.lansman.admin.password", "secret");

    render(<AdminLansmanPage />);

    expect(screen.getByRole("heading", { name: "Lansman Yönetimi" })).toBeInTheDocument();
    expect(screen.getByText("Lansman tablo mock")).toBeInTheDocument();
  });

  it("accepts the configured password and stores temporary access", () => {
    vi.stubEnv("VITE_ADMIN_PASSWORD", "secret");

    render(<AdminLansmanPage />);

    fireEvent.change(screen.getByLabelText("Admin Şifresi"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Giriş Yap" }));

    expect(window.sessionStorage.getItem("corteqs.lansman.admin.access")).toBe("granted");
    expect(window.sessionStorage.getItem("corteqs.lansman.admin.password")).toBe("secret");
    expect(screen.getByText("Lansman tablo mock")).toBeInTheDocument();
  });
});
