import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { commercialDocuments } from "@/lib/commercial-documents";

const renderAtRoute = (path: string) => {
  window.history.pushState({}, "", path);
  return render(<App />);
};

describe("commercial routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the commercial index page", () => {
    renderAtRoute("/commercial");

    expect(
      screen.getByRole("heading", {
        name: /paylaşım ve teklif görüşmeleri için/i,
      }),
    ).toBeInTheDocument();

    for (const document of commercialDocuments) {
      expect(screen.getByRole("link", { name: new RegExp(document.title, "i") })).toBeInTheDocument();
    }
  });

  it("links the contributor card to the standalone HTML document", () => {
    renderAtRoute("/commercial");

    expect(screen.getByRole("link", { name: /contributor/i })).toHaveAttribute(
      "href",
      "/commercial/contributor/",
    );
  });

  it("renders the contributor route as a standalone HTML handoff", () => {
    renderAtRoute("/commercial/contributor");

    expect(screen.getByRole("heading", { name: "Contributor" })).toBeInTheDocument();
    expect(screen.queryByTitle(/contributor document/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /standalone contributor dokümanını aç/i }),
    ).toHaveAttribute(
      "href",
      "/commercial/contributor/",
    );
  });

  it("renders a known embedded commercial document", () => {
    renderAtRoute("/commercial/ambassador");

    expect(screen.getByRole("heading", { name: "Ambassador" })).toBeInTheDocument();
    expect(screen.getByText(/replace this html with the final ambassador document when ready/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /commercial alanına dön/i })).toHaveAttribute(
      "href",
      "/commercial",
    );
  });

  it("renders not found for an unknown commercial document", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderAtRoute("/commercial/unknown-doc");

    expect(screen.getByRole("heading", { name: /bu sayfa/i })).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
