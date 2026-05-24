import type { Json, Tables } from "@/integrations/supabase/types";
import type { IndividualFeatureMeta } from "@/lib/features";

type JsonRecord = Record<string, Json | undefined>;

type IndividualProfileRow = Tables<"individual_profile_details">;

type ProfileStep = {
  label: string;
  completed: boolean;
};

type PlacePeriod = {
  label: string;
  period: string;
};

export type IndividualProfileFrontCardPayload = {
  profileImageUrl: string | null;
  passportStatus: string;
  previousCities: PlacePeriod[];
  miniEvent: {
    title: string;
    date: string;
  } | null;
  followRequestState: "locked" | "requested" | "connected";
  followRequestNote: string;
  profilePreviewNote: string;
};

export type IndividualProfileDetailCardPayload = {
  aboutText: string;
  interests: string[];
  languages: string[];
  livedCountries: PlacePeriod[];
  serviceRequests: string[];
  events: string[];
  followsPreview: string[];
  whatsappGroups: string[];
  activities: string[];
  cvRequestEnabled: boolean;
  wishlistStatus: "hidden" | "v2";
};

export type IndividualProfileControlPanelPayload = {
  panelTagline: string;
  panelBadges: string[];
  navActions: string[];
  reminder: string;
  locationSummary: string;
  country: string;
  city: string;
  yearsInCity: string;
  phone: string;
  birthDate: string;
  education: string;
  institution: string;
  bio: string;
  linkedin: string;
  websiteLinks: string[];
  skills: string[];
  profileSteps: ProfileStep[];
};

export type IndividualProfileDetailsCore = {
  userId: string;
  displayName: string;
  email: string;
  tagline: string;
  statusText: string;
  presenceStatus: "online" | "cadde" | "offline";
  visibilityStatus: "open" | "locked";
  followerCount: number;
  followingCount: number;
  eventCount: number;
  activeCity: string;
  activeCountry: string;
  hometown: string;
  phoneVerified: boolean;
  jobSeeking: boolean;
  mentorOptIn: boolean;
  frontCard: IndividualProfileFrontCardPayload;
  detailCard: IndividualProfileDetailCardPayload;
  controlPanel: IndividualProfileControlPanelPayload;
};

export type IndividualProfileModuleState = {
  visibleModules: IndividualFeatureMeta[];
  featuresLoading: boolean;
  featureErrorMessage: string | null;
  featureSourceByKey: Record<string, string>;
};

const isRecord = (value: unknown): value is JsonRecord => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const asRecord = (value: Json | null): JsonRecord => {
  if (!isRecord(value)) return {};
  return value;
};

const readString = (record: JsonRecord, key: string, fallback = ""): string => {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : fallback;
};

const readBoolean = (record: JsonRecord, key: string, fallback = false): boolean => {
  const value = record[key];
  return typeof value === "boolean" ? value : fallback;
};

const readStringArray = (record: JsonRecord, key: string): string[] => {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
};

const readPlacePeriodArray = (record: JsonRecord, key: string): PlacePeriod[] => {
  const value = record[key];
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const cityValue = item.city ?? item.country ?? item.label;
      const label = typeof cityValue === "string" ? cityValue : "";
      const period = typeof item.period === "string" ? item.period : "";
      if (!label) return null;
      return { label, period };
    })
    .filter((item): item is PlacePeriod => Boolean(item));
};

const readProfileSteps = (record: JsonRecord, key: string): ProfileStep[] => {
  const value = record[key];
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!isRecord(item)) return null;
      const label = typeof item.label === "string" ? item.label : "";
      if (!label) return null;
      const completed = typeof item.completed === "boolean" ? item.completed : false;
      return { label, completed };
    })
    .filter((item): item is ProfileStep => Boolean(item));
};

const readMiniEvent = (record: JsonRecord): { title: string; date: string } | null => {
  const raw = record.mini_event;
  if (!isRecord(raw)) return null;
  const title = typeof raw.title === "string" ? raw.title : "";
  const date = typeof raw.date === "string" ? raw.date : "";
  if (!title && !date) return null;
  return { title, date };
};

const toPositiveInteger = (value: number | null | undefined): number => {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) return 0;
  return Math.floor(value);
};

const normalizePresence = (value: string | null | undefined): "online" | "cadde" | "offline" => {
  if (value === "online" || value === "cadde") return value;
  return "offline";
};

const normalizeVisibility = (value: string | null | undefined): "open" | "locked" => {
  if (value === "open") return "open";
  return "locked";
};

export const buildFallbackIndividualProfileDetails = (input: {
  userId: string;
  displayName: string;
  email: string;
}): IndividualProfileDetailsCore => {
  return {
    userId: input.userId,
    displayName: input.displayName,
    email: input.email,
    tagline: "Tagline henüz eklenmedi.",
    statusText: "Profil alanları tamamlandıkça burası güncellenecek.",
    presenceStatus: "offline",
    visibilityStatus: "locked",
    followerCount: 0,
    followingCount: 0,
    eventCount: 0,
    activeCity: "-",
    activeCountry: "-",
    hometown: "-",
    phoneVerified: false,
    jobSeeking: false,
    mentorOptIn: false,
    frontCard: {
      profileImageUrl: null,
      passportStatus: "Pasaport / doğrulama bilgisi yok",
      previousCities: [],
      miniEvent: null,
      followRequestState: "locked",
      followRequestNote: "Profil kilitli",
      profilePreviewNote: "Ön izleme modu",
    },
    detailCard: {
      aboutText: "Kullanıcı henüz hakkında bölümünü doldurmadı.",
      interests: [],
      languages: [],
      livedCountries: [],
      serviceRequests: [],
      events: [],
      followsPreview: [],
      whatsappGroups: [],
      activities: [],
      cvRequestEnabled: false,
      wishlistStatus: "v2",
    },
    controlPanel: {
      panelTagline: "Bireysel Panelim",
      panelBadges: [],
      navActions: [
        "Hizmet Talepleri",
        "Hizmet Talepleri Yönetimi",
        "Taşınma Yönetimi",
        "Takvim",
        "Etkinlikler",
        "Kuponlar",
        "Takip",
        "Whatsapp Waadd.",
        "Bildirimler",
        "Mesaj Kutusu",
        "Profil Ayarları",
      ],
      reminder: "Panel kilitliyse profil ayarlarınızı tamamlayın.",
      locationSummary: "-",
      country: "-",
      city: "-",
      yearsInCity: "-",
      phone: "-",
      birthDate: "-",
      education: "-",
      institution: "-",
      bio: "Bio / Hakkında alanı henüz doldurulmadı.",
      linkedin: "-",
      websiteLinks: [],
      skills: [],
      profileSteps: [
        { label: "Telefon Doğrulama", completed: false },
        { label: "Profil Fotoğrafı", completed: false },
        { label: "Bio / Hakkında", completed: false },
        { label: "İlgi Alanları", completed: false },
      ],
    },
  };
};

export const mapIndividualProfileRow = (
  row: IndividualProfileRow | null,
  fallback: IndividualProfileDetailsCore,
): IndividualProfileDetailsCore => {
  if (!row) return fallback;

  const frontCard = asRecord(row.front_card);
  const detailCard = asRecord(row.detail_card);
  const controlPanel = asRecord(row.control_panel);
  const profileSettings = asRecord(row.profile_settings);

  const profileImageUrl = frontCard.profile_image_url;
  const followRequestRaw = frontCard.follow_request_state;
  const followRequestState: IndividualProfileFrontCardPayload["followRequestState"] =
    followRequestRaw === "requested" || followRequestRaw === "connected" ? followRequestRaw : "locked";

  const wishlistRaw = detailCard.wishlist_status;
  const wishlistStatus: IndividualProfileDetailCardPayload["wishlistStatus"] = wishlistRaw === "hidden" ? "hidden" : "v2";

  return {
    ...fallback,
    tagline: row.tagline ?? fallback.tagline,
    statusText: row.status_text ?? fallback.statusText,
    presenceStatus: normalizePresence(row.presence_status),
    visibilityStatus: normalizeVisibility(row.visibility_status),
    followerCount: toPositiveInteger(row.follower_count),
    followingCount: toPositiveInteger(row.following_count),
    eventCount: toPositiveInteger(row.event_count),
    activeCity: row.active_city ?? fallback.activeCity,
    activeCountry: row.active_country ?? fallback.activeCountry,
    hometown: row.hometown ?? fallback.hometown,
    phoneVerified: Boolean(row.phone_verified),
    jobSeeking: Boolean(row.job_seeking),
    mentorOptIn: Boolean(row.mentor_opt_in),
    frontCard: {
      ...fallback.frontCard,
      profileImageUrl: typeof profileImageUrl === "string" && profileImageUrl.trim() ? profileImageUrl : null,
      passportStatus: readString(frontCard, "passport_status", fallback.frontCard.passportStatus),
      previousCities: readPlacePeriodArray(frontCard, "previous_cities"),
      miniEvent: readMiniEvent(frontCard),
      followRequestState,
      followRequestNote: readString(frontCard, "follow_request_note", fallback.frontCard.followRequestNote),
      profilePreviewNote: readString(frontCard, "profile_preview_note", fallback.frontCard.profilePreviewNote),
    },
    detailCard: {
      ...fallback.detailCard,
      aboutText: readString(detailCard, "about_text", fallback.detailCard.aboutText),
      interests: readStringArray(detailCard, "interests"),
      languages: readStringArray(detailCard, "languages"),
      livedCountries: readPlacePeriodArray(detailCard, "lived_countries"),
      serviceRequests: readStringArray(detailCard, "service_requests"),
      events: readStringArray(detailCard, "events"),
      followsPreview: readStringArray(detailCard, "follows_preview"),
      whatsappGroups: readStringArray(detailCard, "whatsapp_groups"),
      activities: readStringArray(detailCard, "activities"),
      cvRequestEnabled: readBoolean(detailCard, "cv_request_enabled", fallback.detailCard.cvRequestEnabled),
      wishlistStatus,
    },
    controlPanel: {
      ...fallback.controlPanel,
      panelTagline: readString(controlPanel, "panel_tagline", fallback.controlPanel.panelTagline),
      panelBadges: readStringArray(controlPanel, "panel_badges"),
      navActions: readStringArray(controlPanel, "nav_actions"),
      reminder: readString(controlPanel, "reminder", fallback.controlPanel.reminder),
      locationSummary: readString(controlPanel, "location_summary", fallback.controlPanel.locationSummary),
      country: readString(profileSettings, "country", fallback.controlPanel.country),
      city: readString(profileSettings, "city", fallback.controlPanel.city),
      yearsInCity: readString(profileSettings, "years_in_city", fallback.controlPanel.yearsInCity),
      phone: readString(profileSettings, "phone", fallback.controlPanel.phone),
      birthDate: readString(profileSettings, "birth_date", fallback.controlPanel.birthDate),
      education: readString(profileSettings, "education", fallback.controlPanel.education),
      institution: readString(profileSettings, "institution", fallback.controlPanel.institution),
      bio: readString(profileSettings, "bio", fallback.controlPanel.bio),
      linkedin: readString(profileSettings, "linkedin", fallback.controlPanel.linkedin),
      websiteLinks: readStringArray(profileSettings, "website_links"),
      skills: readStringArray(profileSettings, "skills"),
      profileSteps: readProfileSteps(profileSettings, "profile_steps"),
    },
  };
};
