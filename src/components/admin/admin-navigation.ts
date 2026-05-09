import { Globe, Network, Sparkles } from "lucide-react";

export const primaryAdminNavItems = [
  { to: "/admin/members", label: "Üye Takibi", icon: Network },
  { to: "/admin/referral", label: "Ref Kod", icon: Sparkles },
  { to: "/admin/muhasebe", label: "Muhasebe", icon: Globe },
] as const;

export const externalAdminNavItems = [
  { href: "https://eng.corteqs.net", label: "Engine" },
  { href: "https://globe.corteqs.ret", label: "Globe" },
  { href: "https://corteqs.net/founders", label: "Founders" },
] as const;
