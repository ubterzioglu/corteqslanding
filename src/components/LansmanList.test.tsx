import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LansmanList from "@/components/LansmanList";

const getPendingRegistrationsMock = vi.fn();

vi.mock("@/lib/lansman", () => ({
  getPendingRegistrations: () => getPendingRegistrationsMock(),
}));

describe("LansmanList", () => {
  it("renders initials only for pending registrations", async () => {
    getPendingRegistrationsMock.mockResolvedValue([
      {
        id: "1",
        initials: "UB",
        status: "pending",
        created_at: "2026-05-03T10:00:00.000Z",
      },
    ]);

    render(<LansmanList />);

    await waitFor(() => {
      expect(screen.getByText("UB")).toBeInTheDocument();
    });

    expect(screen.getByText("Onay Bekliyor")).toBeInTheDocument();
    expect(screen.queryByText(/Ugur/i)).not.toBeInTheDocument();
  });
});
