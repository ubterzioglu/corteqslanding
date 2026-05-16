import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AddWhatsAppPage from "@/pages/AddWhatsAppPage";

const toastSpy = vi.fn();
const listLandingsSpy = vi.fn();
const getLandingSpy = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastSpy,
  }),
}));

vi.mock("@/lib/whatsapp-landings", () => ({
  listLandings: (...args: unknown[]) => listLandingsSpy(...args),
  getLanding: (...args: unknown[]) => getLandingSpy(...args),
  submitLanding: vi.fn(),
  createJoinRequest: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
      }),
    },
  },
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

function renderPage(initialEntry = "/addwa") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/addwa" element={<AddWhatsAppPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AddWhatsAppPage", () => {
  beforeEach(() => {
    listLandingsSpy.mockResolvedValue(listFixture);
    getLandingSpy.mockResolvedValue(listFixture[0]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the listing view and filters by search", async () => {
    renderPage();

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Grup, şehir veya açıklama ara/i), {
      target: { value: "Tokyo" },
    });

    expect(screen.getByText(/Filtreye uygun grup bulunamadi/i)).toBeInTheDocument();
  });

  it("renders the landing detail when group query exists", async () => {
    renderPage("/addwa?group=berlin-girisim");

    expect(await screen.findByText("Berlin Girisimciler")).toBeInTheDocument();
    expect(screen.getByText(/Katıl ve ağını büyüt/i)).toBeInTheDocument();
  });

  it("shows not found state for an unknown landing slug", async () => {
    getLandingSpy.mockResolvedValue(null);

    renderPage("/addwa?group=olmayan");

    expect(await screen.findByText(/Landing sayfasi bulunamadi/i)).toBeInTheDocument();
  });
});
