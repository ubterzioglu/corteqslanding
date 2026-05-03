import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LansmanForm from "@/components/LansmanForm";

const createRegistrationMock = vi.fn();

vi.mock("@/lib/lansman", () => ({
  createRegistration: (...args: unknown[]) => createRegistrationMock(...args),
  isValidWhatsappPhone: (phone: string) => /^\+[1-9]\d{7,14}$/.test(phone.replace(/[\s\-().]/g, "")),
  validateOptionalUrl: (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    new URL(trimmed);
    return trimmed;
  },
}));

describe("LansmanForm", () => {
  it("shows validation errors for required fields and invalid phone", async () => {
    render(<LansmanForm />);

    fireEvent.click(screen.getByRole("button", { name: /kaydı gönder/i }));

    expect(await screen.findByText("Ad alanı zorunludur.")).toBeInTheDocument();
    expect(screen.getByText("Soyad alanı zorunludur.")).toBeInTheDocument();
    expect(screen.getByText("Telefon alanı zorunludur.")).toBeInTheDocument();
  });

  it("disables submit while request is pending and shows success after submit", async () => {
    let resolveRequest: (() => void) | undefined;
    createRegistrationMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = () => resolve(undefined);
        }),
    );

    const onSuccess = vi.fn();
    render(<LansmanForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText("Ad"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Soyad"), { target: { value: "Lovelace" } });
    fireEvent.change(screen.getByLabelText("Telefon"), {
      target: { value: "+491701234567" },
    });

    fireEvent.click(screen.getByRole("button", { name: /kaydı gönder/i }));

    expect(screen.getByRole("button", { name: /gönderiliyor/i })).toBeDisabled();

    resolveRequest?.();

    await waitFor(() => {
      expect(screen.getByText("Kayıt alındı, onay bekliyor.")).toBeInTheDocument();
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
