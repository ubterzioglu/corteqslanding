import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AdminLayout from "@/components/admin/AdminLayout";

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock("@/lib/admin", () => ({
  userIsAdmin: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      }),
      getSession: () =>
        Promise.resolve({
          data: {
            session: {
              user: {
                id: "admin-user",
                email: "admin@corteqs.test",
              },
            },
          },
        }),
      signInWithPassword: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

function renderAdminLayout(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="members" element={<div>Members Content</div>} />
          <Route path="lansman" element={<div>Lansman Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminLayout", () => {
  it("shows global actions on the members page", async () => {
    renderAdminLayout("/admin/members");

    await waitFor(() => {
      expect(screen.getByText("Members Content")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: "Lansman Katılım" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Yeni kayıt ekle/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Referral oluştur/i })).toBeInTheDocument();
  });

  it("hides global actions outside the members page", async () => {
    renderAdminLayout("/admin/lansman");

    await waitFor(() => {
      expect(screen.getByText("Lansman Content")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: "Lansman Katılım" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Yeni kayıt ekle/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Referral oluştur/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Export \/ Import/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Toplu işlem/i })).not.toBeInTheDocument();
  });
});
