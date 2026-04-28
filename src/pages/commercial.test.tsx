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

  it("links the ambassador card to the standalone HTML document", () => {
    renderAtRoute("/commercial");

    expect(screen.getByRole("link", { name: /ambassador/i })).toHaveAttribute(
      "href",
      "/commercial/ambassador/",
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

  it("redirects the short contributor route into the commercial flow", () => {
    renderAtRoute("/contributor");

    expect(window.location.pathname).toBe("/commercial/contributor");
    expect(screen.getByRole("heading", { name: "Contributor" })).toBeInTheDocument();
  });

  it("renders the ambassador route as a standalone HTML handoff", () => {
    renderAtRoute("/commercial/ambassador");

    expect(screen.getByRole("heading", { name: "Ambassador" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /standalone ambassador dokümanını aç/i }),
    ).toHaveAttribute(
      "href",
      "/commercial/ambassador/",
    );
  });

  it("redirects the short ambassador route into the commercial flow", () => {
    renderAtRoute("/ambassador");

    expect(window.location.pathname).toBe("/commercial/ambassador");
    expect(screen.getByRole("heading", { name: "Ambassador" })).toBeInTheDocument();
  });

  it("renders not found for an unknown commercial document", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderAtRoute("/commercial/unknown-doc");

    expect(screen.getByRole("heading", { name: /bu sayfa/i })).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
