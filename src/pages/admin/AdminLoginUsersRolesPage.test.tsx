import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminLoginUsersRolesPage from "@/pages/admin/AdminLoginUsersRolesPage";

const { toast, setUserRoleAsAdmin } = vi.hoisted(() => ({
  toast: vi.fn(),
  setUserRoleAsAdmin: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast,
  }),
}));

vi.mock("@/lib/admin", () => ({
  setUserRoleAsAdmin,
}));

const roles = [
  { id: "role-bireysel", key: "bireysel", label: "Bireysel Kullanıcı", sort_order: 10, is_active: true },
  { id: "role-danisman", key: "danisman", label: "Danışman", sort_order: 20, is_active: true },
];

const userProfiles = [
  {
    user_id: "user-1",
    email: "ayse@example.com",
    full_name: "Ayşe Yılmaz",
    profile_type: "bireysel",
    auth_provider: "google",
    created_at: "2026-05-24T13:30:04.000Z",
  },
  {
    user_id: "user-2",
    email: "mehmet@example.com",
    full_name: "Mehmet Kara",
    profile_type: "danisman",
    auth_provider: "google",
    created_at: "2026-05-23T13:30:04.000Z",
  },
];

const roleAssignments = [
  { user_id: "user-1", role_id: "role-bireysel" },
  { user_id: "user-2", role_id: "role-danisman" },
];

const pendingApprovals = [{ user_id: "user-1", status: "pending" }];
const overrides = [{ user_id: "user-1", feature_key: "profile-edit" }];

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "roles") {
        return {
          select: () => ({
            eq: () => ({
              order: () => Promise.resolve({ data: roles, error: null }),
            }),
          }),
        };
      }

      if (table === "user_profiles") {
        return {
          select: () => {
            const query = {
              eq: () => query,
              or: () => query,
              gte: () => query,
              lt: () => query,
              order: () => Promise.resolve({ data: userProfiles, error: null }),
            };
            return query;
          },
        };
      }

      if (table === "user_role_assignments") {
        return {
          select: () => ({
            in: () => Promise.resolve({ data: roleAssignments, error: null }),
          }),
        };
      }

      if (table === "approval_requests") {
        return {
          select: () => ({
            eq: () => ({
              in: () => Promise.resolve({ data: pendingApprovals, error: null }),
            }),
          }),
        };
      }

      if (table === "user_feature_overrides") {
        return {
          select: () => ({
            in: () => Promise.resolve({ data: overrides, error: null }),
          }),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    },
  },
}));

const SearchProbe = () => {
  const location = useLocation();
  return <div data-testid="search-probe">{location.search}</div>;
};

const AttributesProbe = () => {
  const location = useLocation();
  return (
    <div>
      <div data-testid="attributes-search">{location.search}</div>
      <div data-testid="attributes-state">{JSON.stringify(location.state)}</div>
    </div>
  );
};

function renderPage(initialEntry = "/admin/new-member/users-roles") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/admin/new-member/users-roles"
          element={
            <>
              <SearchProbe />
              <AdminLoginUsersRolesPage />
            </>
          }
        />
        <Route path="/admin/new-member/attributes" element={<AttributesProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  toast.mockReset();
  setUserRoleAsAdmin.mockReset();
  setUserRoleAsAdmin.mockResolvedValue(undefined);
});

describe("AdminLoginUsersRolesPage", () => {
  it("renders an Attribute action for each listed user and navigates with context", async () => {
    renderPage("/admin/new-member/users-roles?q=ayse&provider=all&from=2026-05-20&to=2026-05-25&sort=name_asc");

    expect(await screen.findByText("Ayşe Yılmaz")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Attribute" })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole("button", { name: "Attribute" })[0]);

    await waitFor(() => {
      expect(screen.getByTestId("attributes-search").textContent).toContain("selectedRoleId=role-bireysel");
    });

    expect(screen.getByTestId("attributes-search").textContent).toContain("q=ayse");
    expect(screen.getByTestId("attributes-search").textContent).toContain("provider=all");
    expect(screen.getByTestId("attributes-search").textContent).toContain("from=2026-05-20");
    expect(screen.getByTestId("attributes-search").textContent).toContain("to=2026-05-25");
    expect(screen.getByTestId("attributes-search").textContent).toContain("sort=name_asc");
    expect(screen.getByTestId("attributes-state").textContent).toContain("\"userId\":\"user-1\"");
    expect(screen.getByTestId("attributes-state").textContent).toContain("\"userName\":\"Ayşe Yılmaz\"");
    expect(screen.getByTestId("attributes-state").textContent).toContain("\"userEmail\":\"ayse@example.com\"");
    expect(screen.getByTestId("attributes-state").textContent).toContain("/admin/new-member/users-roles?q=ayse&provider=all&from=2026-05-20&to=2026-05-25&sort=name_asc");
  });

  it("syncs active filters to the URL", async () => {
    renderPage();

    expect(await screen.findByText("Ayşe Yılmaz")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Örn: ayse / @mail.com"), { target: { value: "mehmet" } });

    await waitFor(() => {
      expect(screen.getByTestId("search-probe")).toHaveTextContent("q=mehmet");
    });
  });

  it("keeps the role edit flow working", async () => {
    renderPage();

    expect(await screen.findByText("Ayşe Yılmaz")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Düzenle" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Kaydet" })).not.toBeInTheDocument();
    });

    expect(setUserRoleAsAdmin).not.toHaveBeenCalled();
  });
});
