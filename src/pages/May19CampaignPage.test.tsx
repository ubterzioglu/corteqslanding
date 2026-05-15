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

    expect(screen.getByText(/19 Mayıs Coşkusunu Birlikte Yaşayalım!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/1\. Dünya üzerindeki yerini işaretleyerek diaspora haritasında görünür ol\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2\. 19 kelimelik fikrini paylaşarak topluluğa yeni bir katkı sun\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/3\. 19 Mayıs anını göndererek bayram coşkusunu birlikte büyüt\./i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Modüllere İn/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Global Harita/i })).not.toBeInTheDocument();
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
