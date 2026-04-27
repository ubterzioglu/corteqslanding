import contributorOnepagerHtml from "../../corteqs-local-contributor-onepager.html?raw";

export interface CommercialDocument {
  slug: string;
  title: string;
  summary: string;
  html?: string;
  srcDoc?: string;
}

export const commercialDocuments: CommercialDocument[] = [
  {
    slug: "contributor",
    title: "Contributor",
    summary: "CorteQS contributor yapısının rolü, katkı alanları ve birlikte çalışma biçimi.",
    srcDoc: contributorOnepagerHtml,
  },
  {
    slug: "ambassador",
    title: "Ambassador",
    summary: "Ambassador rolünün temsil, topluluk büyütme ve lokal network geliştirme beklentileri.",
    html: `
      <h2>Ambassador Overview</h2>
      <p>
        Ambassador pages are meant to help people quickly understand the positioning, value, and
        responsibilities of the role before a commercial or partnership conversation.
      </p>
      <p>
        A CorteQS ambassador typically acts as a trusted local bridge between the platform and a city,
        community, or network segment.
      </p>
      <h3>Core Responsibilities</h3>
      <ul>
        <li>Represent CorteQS clearly and consistently</li>
        <li>Open relevant introductions in target communities</li>
        <li>Support awareness, trust, and local visibility</li>
        <li>Share feedback from the field back into the team</li>
      </ul>
      <h3>Why This Role Matters</h3>
      <p>
        CorteQS grows through trusted relationships. Ambassadors help shorten the path between community
        discovery, local credibility, and meaningful activation.
      </p>
      <p>
        Replace this HTML with the final ambassador document when ready. The page supports plain HTML
        documentation formatting and will preserve simple structure.
      </p>
    `,
  },
];

export const commercialDocumentMap = new Map(
  commercialDocuments.map((document) => [document.slug, document]),
);

export const getCommercialDocumentBySlug = (slug: string) =>
  commercialDocumentMap.get(slug);
