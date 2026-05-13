import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import May19CampaignShell from "@/components/may19/May19CampaignShell";

describe("May19CampaignShell", () => {
  it("renders the shared campaign header links", () => {
    render(
      <MemoryRouter>
        <May19CampaignShell eyebrow="19 Mayıs" title="Test Başlık" description="Test açıklama">
          <div>Test içerik</div>
        </May19CampaignShell>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /corteqs/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /19 mayıs etkinlikleri/i })).toHaveAttribute("href", "/19051919");
    expect(screen.getByRole("link", { name: /kayıt ol!/i })).toHaveAttribute("href", "/19051919#katilim-formu");
    expect(screen.getByRole("link", { name: /founding 1000/i })).toHaveAttribute("href", "/founding-1000");
    expect(screen.getByRole("link", { name: /blogger yarışması/i })).toHaveAttribute("href", "/blogger-yarismasi");
    expect(screen.getByRole("link", { name: /vlogger yarışması/i })).toHaveAttribute("href", "/vlogger-yarismasi");
  });

  it("keeps the WhatsApp community link external and safe", () => {
    render(
      <MemoryRouter>
        <May19CampaignShell eyebrow="19 Mayıs" title="Test Başlık" description="Test açıklama">
          <div>Test içerik</div>
        </May19CampaignShell>
      </MemoryRouter>,
    );

    const whatsappLink = screen.getByRole("link", { name: /whatsapp topluluğu/i });

    expect(whatsappLink).toHaveAttribute("href", "https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD");
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
