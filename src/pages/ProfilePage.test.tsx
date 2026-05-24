import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { IndividualProfileDetailsCore } from "@/lib/individual-profile";
import ProfilePage from "@/pages/ProfilePage";

const useAuthMock = vi.fn();
const useFeatureFlagsMock = vi.fn();
const useIndividualProfileDetailsMock = vi.fn();
const maybeSingleMock = vi.fn();
const eqMock = vi.fn();
const selectMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/components/auth/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/hooks/useFeatureFlags", () => ({
  useFeatureFlags: (...args: unknown[]) => useFeatureFlagsMock(...args),
}));

vi.mock("@/hooks/useIndividualProfileDetails", () => ({
  useIndividualProfileDetails: (...args: unknown[]) => useIndividualProfileDetailsMock(...args),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
    auth: {
      signOut: vi.fn(),
    },
  },
}));

describe("ProfilePage", () => {
  const baseDetails: IndividualProfileDetailsCore = {
    userId: "u-1",
    displayName: "firmascope",
    email: "firmascope@gmail.com",
    tagline: "Londra'da Pazarlama Uzmanı",
    statusText: "Diaspora için iş birliği ve mentorluk fırsatlarına açığım.",
    presenceStatus: "online",
    visibilityStatus: "open",
    followerCount: 10,
    followingCount: 12,
    eventCount: 3,
    activeCity: "Londra",
    activeCountry: "Birleşik Krallık",
    hometown: "İzmir",
    phoneVerified: true,
    jobSeeking: true,
    mentorOptIn: true,
    frontCard: {
      profileImageUrl: null,
      passportStatus: "Doğrulandı",
      previousCities: [],
      miniEvent: null,
      followRequestState: "connected",
      followRequestNote: "Takiptesin",
      profilePreviewNote: "Ön izleme",
      worldMessage: "Toplulukla birlikte büyüyoruz.",
      corteqsPassport: false,
      linkedinUrl: null,
      linkedinVisible: true,
      cvDoc: null,
      presentationDoc: null,
      birthdayDays: null,
      giftAcceptance: false,
    },
    detailCard: {
      aboutText: "Hakkında metni",
      interests: [],
      languages: [],
      livedCountries: [],
      serviceRequests: [],
      events: [],
      followsPreview: [],
      whatsappGroups: [],
      activities: [],
      recentEvents: [],
      countriesLived: [],
      relocation: { enabled: false, country: "", city: "" },
      cvRequestEnabled: false,
      wishlistStatus: "v2",
    },
    controlPanel: {
      panelTagline: "Bireysel Panelim",
      panelBadges: [],
      navActions: [],
      reminder: "Hatırlatma",
      locationSummary: "Londra",
      country: "Birleşik Krallık",
      city: "Londra",
      yearsInCity: "5",
      phone: "+44",
      birthDate: "1992-04-18",
      education: "Yüksek Lisans",
      school: "Westminster",
      institution: "University of Westminster",
      bio: "Bio",
      linkedin: "https://linkedin.com/in/firmascope",
      websiteLinks: [],
      websites: [],
      skills: [],
      profileVisible: true,
      profileSteps: [],
    },
  };

  it("falls back to bireysel on invalid slug", async () => {
    useFeatureFlagsMock.mockReturnValue({
      isLoading: false,
      errorMessage: null,
      featureSources: {},
      isFeatureEnabled: () => false,
    });
    useIndividualProfileDetailsMock.mockReturnValue({
      isLoading: false,
      errorMessage: null,
      details: null,
    });
    useAuthMock.mockReturnValue({
      user: { id: "u-1", email: "user@test.com", user_metadata: {} },
    });

    render(
      <MemoryRouter initialEntries={["/profile/invalid"]}>
        <Routes>
          <Route path="/profile/:type" element={<ProfilePage />} />
          <Route path="/profile/bireysel" element={<div>Bireysel Profil</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Bireysel Profil")).toBeInTheDocument();
  });

  it("redirects to assigned profile type", async () => {
    useFeatureFlagsMock.mockReturnValue({
      isLoading: false,
      errorMessage: null,
      featureSources: {},
      isFeatureEnabled: () => false,
    });
    useIndividualProfileDetailsMock.mockReturnValue({
      isLoading: false,
      errorMessage: null,
      details: null,
    });
    useAuthMock.mockReturnValue({
      user: { id: "u-1", email: "user@test.com", user_metadata: {} },
    });

    maybeSingleMock.mockResolvedValue({ data: { profile_type: "danisman" } });
    eqMock.mockReturnValue({ maybeSingle: maybeSingleMock });
    selectMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });

    render(
      <MemoryRouter initialEntries={["/profile/isletme"]}>
        <Routes>
          <Route path="/profile/:type" element={<ProfilePage />} />
          <Route path="/profile/danisman" element={<div>Danisman Profil</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Danisman Profil")).toBeInTheDocument();
  });

  it("renders individual visual cards for bireysel users", async () => {
    useFeatureFlagsMock.mockReturnValue({
      isLoading: false,
      errorMessage: null,
      featureSources: {},
      isFeatureEnabled: () => false,
    });
    useIndividualProfileDetailsMock.mockReturnValue({
      isLoading: false,
      errorMessage: null,
      details: baseDetails,
    });
    useAuthMock.mockReturnValue({
      user: { id: "u-1", email: "firmascope@gmail.com", user_metadata: { name: "firmascope" } },
    });

    maybeSingleMock.mockResolvedValue({ data: { profile_type: "bireysel" } });
    eqMock.mockReturnValue({ maybeSingle: maybeSingleMock });
    selectMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });

    render(
      <MemoryRouter initialEntries={["/profile/bireysel"]}>
        <Routes>
          <Route path="/profile/:type" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Profil Ayarlari")).toBeInTheDocument();
    expect(screen.getByText("Toplulukla birlikte büyüyoruz.")).toBeInTheDocument();
    expect(screen.getByText("Londra'da Pazarlama Uzmanı")).toBeInTheDocument();
  });
});
