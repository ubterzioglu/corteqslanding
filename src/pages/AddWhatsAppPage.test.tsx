import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AddWhatsAppPage from "@/pages/AddWhatsAppPage";
import { TooltipProvider } from "@/components/ui/tooltip";

const toastSpy = vi.fn();
const listLandingsSpy = vi.fn();
const getLandingSpy = vi.fn();
const getEditableLandingForCurrentUserSpy = vi.fn();
const canCurrentUserEditLandingSpy = vi.fn();
const useAuthMock = vi.fn();
const signInWithOAuthMock = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastSpy,
  }),
}));

vi.mock("@/components/auth/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithOAuth: (...args: unknown[]) => signInWithOAuthMock(...args),
    },
  },
}));

vi.mock("@/lib/whatsapp-landings", () => ({
  listLandings: (...args: unknown[]) => listLandingsSpy(...args),
  getLanding: (...args: unknown[]) => getLandingSpy(...args),
  getEditableLandingForCurrentUser: (...args: unknown[]) => getEditableLandingForCurrentUserSpy(...args),
  canCurrentUserEditLanding: (...args: unknown[]) => canCurrentUserEditLandingSpy(...args),
  submitLanding: vi.fn(),
  createJoinRequest: vi.fn(),
  uploadWhatsAppLandingHeroImage: vi.fn(),
  normalizeLandingCategory: (value?: string | null) =>
    value === "girisim" ? "yatirim" : value === "alumni" || value === "hobi" || value === "is" ||
      value === "doktor" || value === "yatirim" || value === "akademik" || value === "dayanisma" ||
      value === "hr" || value === "kisisel-gelisim" || value === "diger"
      ? value
      : "diger",
}));

const listFixture = [
  {
    id: "berlin-girisim",
    dbId: "db-1",
    groupName: "Berlin Girisimciler",
    category: "yatirim",
    country: "Almanya",
    city: "Berlin",
    mode: "visual",
    heroImage: "https://example.com/hero.jpg",
    tagline: "Berlin'de is ve network",
    callToActionText: "Katıl ve ağını büyüt",
    conditions: "Reklam yasak",
    whatsappLink: "https://chat.whatsapp.com/test",
    adminName: "Burak",
    adminContact: "info@example.com",
    createdAt: "2026-05-15T00:00:00Z",
  },
] as const;

function renderPage(initialEntry = "/addcom") {
  return render(
    <TooltipProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/addcom" element={<AddWhatsAppPage />} />
        </Routes>
      </MemoryRouter>
    </TooltipProvider>,
  );
}

describe("AddWhatsAppPage", () => {
  beforeEach(() => {
    listLandingsSpy.mockResolvedValue(listFixture);
    getLandingSpy.mockResolvedValue(listFixture[0]);
    getEditableLandingForCurrentUserSpy.mockResolvedValue(undefined);
    canCurrentUserEditLandingSpy.mockResolvedValue(false);
    signInWithOAuthMock.mockResolvedValue({ error: null });
    useAuthMock.mockReturnValue({ user: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the listing view and filters by search", async () => {
    renderPage();

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();
    expect(screen.queryByText("Kategori")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Topluluk ara/i), {
      target: { value: "Tokyo" },
    });

    expect(screen.getByText(/Filtreye uygun grup bulunamadı/i)).toBeInTheDocument();
  });

  it("starts Google OAuth when anonymous user wants to add a community", async () => {
    renderPage();

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Topluluk eklemek istiyorum/i }));

    expect(signInWithOAuthMock).toHaveBeenCalledTimes(1);
    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/addcom?openGroupForm=1`,
      },
    });
  });

  it("opens the form for authenticated users after button click", async () => {
    useAuthMock.mockReturnValue({ user: { id: "u-1" } });
    renderPage();

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Topluluk eklemek istiyorum/i }));

    expect(screen.getByText("Kategori")).toBeInTheDocument();
    expect(screen.getByText("İsteğe bağlı kategori seç")).toBeInTheDocument();
    expect(signInWithOAuthMock).not.toHaveBeenCalled();
  });

  it("renders the landing detail when group query exists", async () => {
    renderPage("/addcom?group=berlin-girisim");

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();
    expect(screen.getByText(/Katıl ve ağını büyüt/i)).toBeInTheDocument();
  });

  it("renders legacy girisim categories without crashing", async () => {
    listLandingsSpy.mockResolvedValue([
      {
        ...listFixture[0],
        category: "girisim",
      },
    ]);
    getLandingSpy.mockResolvedValue({
      ...listFixture[0],
      category: "girisim",
    });

    renderPage("/addcom?group=berlin-girisim");

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();
    expect(screen.getAllByText("Yatırım & Girişim").length).toBeGreaterThan(0);
  });

  it("renders placeholder detail pages for legacy slugs", async () => {
    getLandingSpy.mockResolvedValue(null);

    renderPage("/addcom?group=placeholder-berlin-girisim");

    expect(await screen.findByText("Berlin Girişim Ağı")).toBeInTheDocument();
    expect(screen.getAllByText("Yatırım & Girişim").length).toBeGreaterThan(0);
  });

  it("shows '-' for manager when admin name is missing", async () => {
    getLandingSpy.mockResolvedValue({
      ...listFixture[0],
      adminName: undefined,
    });

    renderPage("/addcom?group=berlin-girisim");

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();
    expect(screen.getByText("Yönetici")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("shows not found state for an unknown landing slug", async () => {
    getLandingSpy.mockResolvedValue(null);

    renderPage("/addcom?group=olmayan");

    expect(await screen.findByText(/Landing sayfası bulunamadı/i)).toBeInTheDocument();
  });
});
