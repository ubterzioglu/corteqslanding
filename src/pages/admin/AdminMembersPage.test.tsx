import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AdminMembersPage from "@/pages/admin/AdminMembersPage";

const toast = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast,
  }),
}));

type MockSubmission = {
  id: string;
  created_at: string;
  updated_at: string;
  fullname: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  field: string;
  offers_needs: string;
  form_type: "advisor" | "investor" | "talent" | "business";
  category: "diaspora" | "startup" | "student" | "other";
  status: "new" | "contacted" | "archived";
  referral_source: string | null;
  referral_code: string | null;
  whatsapp_interest: boolean;
  contest_interest: boolean;
  source_type: "form" | "chatbot" | "wa";
  contact_phone_reached: boolean;
  contact_whatsapp_reached: boolean;
  contact_instagram_reached: boolean;
  contact_email_reached: boolean;
};

const mockRows: MockSubmission[] = Array.from({ length: 45 }, (_, index) => ({
  id: `member-${index + 1}`,
  created_at: new Date(Date.UTC(2026, 4, 1, 12, 0, index)).toISOString(),
  updated_at: new Date(Date.UTC(2026, 4, 1, 12, 0, index)).toISOString(),
  fullname: `Member ${index + 1}`,
  email: `member${index + 1}@corteqs.test`,
  phone: "+49123456789",
  country: "Germany",
  city: "Berlin",
  field: "AI",
  offers_needs: "Support",
  form_type: "advisor",
  category: "diaspora",
  status: "new",
  referral_source: null,
  referral_code: null,
  whatsapp_interest: false,
  contest_interest: false,
  source_type: "form",
  contact_phone_reached: false,
  contact_whatsapp_reached: false,
  contact_instagram_reached: false,
  contact_email_reached: false,
}));

mockRows[0].phone = "+49 123 456 789";
mockRows[1].phone = "0555 123 12";
mockRows[2].phone = "";

function applyFilters(data: MockSubmission[]) {
  return {
    ilike: () => applyFilters(data),
    eq: () => applyFilters(data),
    gte: () => applyFilters(data),
    lte: () => applyFilters(data),
    order: () => ({
      range: (start: number, end: number) =>
        Promise.resolve({
          data: data.slice(start, end + 1),
          count: data.length,
          error: null,
        }),
    }),
  };
}

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      if (table !== "submissions") {
        throw new Error(`Unexpected table ${table}`);
      }

      return {
        select: (_columns: string, options?: { count?: "exact"; head?: boolean }) => {
          if (options?.head) {
            return {
              eq: (_column: string, value: string) =>
                Promise.resolve({
                  count: mockRows.filter((row) => row.source_type === value).length,
                  error: null,
                }),
            };
          }

          return applyFilters(mockRows);
        },
      };
    },
  },
}));

function renderPage(initialEntry = "/admin/members?page=1&pageSize=20") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/admin/members" element={<AdminMembersPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminMembersPage", () => {
  it("renders a WhatsApp link for valid phone numbers", async () => {
    renderPage();

    const phoneLink = await screen.findByRole("link", { name: "+49 123 456 789" });
    expect(phoneLink).toHaveAttribute("href", "https://wa.me/49123456789");
    expect(phoneLink).toHaveAttribute("target", "_blank");
    expect(phoneLink).toHaveAttribute("rel", "noreferrer");
  });

  it("renders plain text for invalid or empty phone numbers", async () => {
    renderPage();

    await screen.findByText("0555 123 12");
    expect(screen.queryByRole("link", { name: "0555 123 12" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "-" })).not.toBeInTheDocument();
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("keeps the selected page when moving to the next page", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Sonraki" }));

    await waitFor(() => {
      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Önceki" })).toBeEnabled();
  });
});
