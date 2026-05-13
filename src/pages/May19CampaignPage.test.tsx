import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import May19CampaignPage from "@/pages/May19CampaignPage";

const toastSpy = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastSpy,
  }),
}));

describe("May19CampaignPage", () => {
  it("renders the campaign page and links to the map", () => {
    render(
      <MemoryRouter>
        <May19CampaignPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Global Diaspora Buluşması/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Global Harita/i })[0]).toHaveAttribute("href", "/19051919/harita");
  });

  it("keeps submit actions frontend-only and shows a toast", async () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <May19CampaignPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Haritada Yerimi İşaretle/i }));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Yakında aktif",
      }),
    );

    vi.useRealTimers();
  });
});
