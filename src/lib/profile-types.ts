export const profileTypes = [
  "bireysel",
  "danisman",
  "isletme",
  "kurulus-dernek",
  "blogger-vlogger-youtuber",
  "sehir-elcisi",
] as const;

export type ProfileType = (typeof profileTypes)[number];

export const defaultProfileType: ProfileType = "bireysel";

export type ProfileTypeOption = {
  type: ProfileType;
  title: string;
  description: string;
};

export const profileTypeOptions: ProfileTypeOption[] = [
  {
    type: "bireysel",
    title: "Bireysel Kullanıcı",
    description: "Hizmet almak, etkinliklere katılmak ve diaspora ağınızı keşfetmek için",
  },
  {
    type: "danisman",
    title: "Danışman",
    description: "Profesyonel danışmanlık hizmetleri sunmak ve müşteri portföyünüzü büyütmek için",
  },
  {
    type: "isletme",
    title: "İşletme",
    description: "İşletmenizi tanıtmak, ilan vermek ve diaspora müşterilerine ulaşmak için",
  },
  {
    type: "kurulus-dernek",
    title: "Kuruluş / Dernek",
    description: "Kuruluşunuzu yönetmek, etkinlikler düzenlemek ve üyelerinize ulaşmak için",
  },
  {
    type: "blogger-vlogger-youtuber",
    title: "Blogger / Vlogger / YouTuber",
    description: "İçerik üretmek, yarışmalara katılmak ve diaspora kitlenizi büyütmek için",
  },
  {
    type: "sehir-elcisi",
    title: "Şehir Elçisi",
    description: "Şehrinizde CorteQS ağını kurmak, topluluk yönetmek ve gelir paylaşımından kazanmak için",
  },
];

export const isProfileType = (value: string): value is ProfileType => {
  return (profileTypes as readonly string[]).includes(value);
};
