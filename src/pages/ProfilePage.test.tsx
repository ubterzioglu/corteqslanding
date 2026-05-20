import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ProfilePage from "@/pages/ProfilePage";

const useAuthMock = vi.fn();
const maybeSingleMock = vi.fn();
const eqMock = vi.fn();
const selectMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/components/auth/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
    auth: {
      signOut: vi.fn(),
    },
  },
}));

describe("ProfilePage", () => {
  it("falls back to bireysel on invalid slug", async () => {
    useAuthMock.mockReturnValue({
      user: { id: "u-1", email: "user@test.com", user_metadata: {} },
    });

    render(
      <MemoryRouter initialEntries={["/profile/invalid"]}>
        <Routes>
          <Route path="/profile/:type" element={<ProfilePage />} />
          <Route path="/profile/bireysel" element={<div>Bireysel Profil</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Bireysel Profil")).toBeInTheDocument();
  });

  it("redirects to assigned profile type", async () => {
    useAuthMock.mockReturnValue({
      user: { id: "u-1", email: "user@test.com", user_metadata: {} },
    });

    maybeSingleMock.mockResolvedValue({ data: { profile_type: "danisman" } });
    eqMock.mockReturnValue({ maybeSingle: maybeSingleMock });
    selectMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });

    render(
      <MemoryRouter initialEntries={["/profile/isletme"]}>
        <Routes>
          <Route path="/profile/:type" element={<ProfilePage />} />
          <Route path="/profile/danisman" element={<div>Danisman Profil</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Danisman Profil")).toBeInTheDocument();
  });
});
