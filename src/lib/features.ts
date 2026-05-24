export const INDIVIDUAL_FEATURE_KEYS = {
  about: "individual.about",
  serviceRequests: "individual.service_requests",
  events: "individual.events",
  follows: "individual.follows",
  whatsapp: "individual.whatsapp",
  messages: "individual.messages",
  activity: "individual.activity",
  cvRequest: "individual.cv_request",
} as const;

export type IndividualFeatureKey = (typeof INDIVIDUAL_FEATURE_KEYS)[keyof typeof INDIVIDUAL_FEATURE_KEYS];

export type FeatureSource = "override" | "role_default" | "fallback";

export type IndividualFeatureMeta = {
  key: IndividualFeatureKey;
  label: string;
  description: string;
};

export const INDIVIDUAL_FEATURES: IndividualFeatureMeta[] = [
  {
    key: INDIVIDUAL_FEATURE_KEYS.about,
    label: "Hakkında",
    description: "Profil özeti ve tanıtım alanı",
  },
  {
    key: INDIVIDUAL_FEATURE_KEYS.serviceRequests,
    label: "Hizmet Talepleri",
    description: "Kullanıcının hizmet talebi alanı",
  },
  {
    key: INDIVIDUAL_FEATURE_KEYS.events,
    label: "Etkinlikler",
    description: "Etkinlik listesi ve katılım alanı",
  },
  {
    key: INDIVIDUAL_FEATURE_KEYS.follows,
    label: "Takipler",
    description: "Takip edilen kişi ve içerikler",
  },
  {
    key: INDIVIDUAL_FEATURE_KEYS.whatsapp,
    label: "WhatsApp",
    description: "WhatsApp grup/iletişim modülü",
  },
  {
    key: INDIVIDUAL_FEATURE_KEYS.messages,
    label: "Mesajlar",
    description: "Platform içi mesajlaşma",
  },
  {
    key: INDIVIDUAL_FEATURE_KEYS.activity,
    label: "Aktivite",
    description: "Son aktiviteler ve akış",
  },
  {
    key: INDIVIDUAL_FEATURE_KEYS.cvRequest,
    label: "CV Talebi",
    description: "CV/özgeçmiş talep modülü",
  },
];

export const INDIVIDUAL_FEATURE_KEY_LIST = INDIVIDUAL_FEATURES.map((feature) => feature.key);

export const isIndividualFeatureKey = (value: string): value is IndividualFeatureKey => {
  return INDIVIDUAL_FEATURE_KEY_LIST.includes(value as IndividualFeatureKey);
};
