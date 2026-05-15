import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";

import App from "@/App";

vi.mock("@/pages/AddWhatsAppPage.tsx", () => ({
  default: () => {
    const location = useLocation();
    return <div>{`AddWA Route ${location.pathname}${location.search}`}</div>;
  },
}));

describe("App /addwa routing", () => {
  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("renders the public /addwa route", () => {
    window.history.pushState({}, "", "/addwa");

    render(<App />);

    expect(screen.getByText("AddWA Route /addwa")).toBeInTheDocument();
  });

  it("redirects /whatsapp-groups to /addwa", () => {
    window.history.pushState({}, "", "/whatsapp-groups");

    render(<App />);

    expect(screen.getByText("AddWA Route /addwa")).toBeInTheDocument();
  });

  it("redirects /whatsapp-groups/:id to /addwa?group=:id", () => {
    window.history.pushState({}, "", "/whatsapp-groups/berlin-grubu");

    render(<App />);

    expect(screen.getByText("AddWA Route /addwa?group=berlin-grubu")).toBeInTheDocument();
  });
});
