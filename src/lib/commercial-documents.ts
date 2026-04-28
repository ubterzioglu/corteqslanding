export interface CommercialDocument {
  slug: string;
  title: string;
  summary: string;
  html?: string;
  standalonePath?: string;
  isPublic?: boolean;
}

export const commercialDocuments: CommercialDocument[] = [
  {
    slug: "contributor",
    title: "Contributor",
    summary: "CorteQS contributor yapısının rolü, katkı alanları ve birlikte çalışma biçimi.",
    standalonePath: "/commercial/contributor/",
    isPublic: true,
  },
  {
    slug: "ambassador",
    title: "Ambassador",
    summary: "Ambassador rolünün temsil, topluluk büyütme ve lokal network geliştirme beklentileri.",
    standalonePath: "/commercial/ambassador/",
    isPublic: false,
  },
];

export const commercialDocumentMap = new Map(
  commercialDocuments.map((document) => [document.slug, document]),
);

export const publicCommercialDocuments = commercialDocuments.filter(
  (document) => document.isPublic !== false,
);

export const getCommercialDocumentBySlug = (slug: string) =>
  commercialDocumentMap.get(slug);
