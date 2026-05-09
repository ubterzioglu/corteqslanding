import { Globe, Network, Sparkles } from "lucide-react";
import { BarChart3, Megaphone, MonitorPlay, Radio, ScrollText, Users } from "lucide-react";

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

export const otherActionNavItems = [
  { to: "/admin/marquee", label: "Haber Bandı", icon: Radio },
  { to: "/admin/social-media", label: "Sosyal Medya", icon: Megaphone },
  { to: "/admin/about", label: "Güncellemeler", icon: ScrollText },
] as const;

export const otherRecordNavItems = [
  { to: "/admin/lansman", label: "Lansman Katılım", icon: MonitorPlay },
] as const;

export const adminPanelNavItems = [
  { key: "wiki", href: "https://dashboard.corteqs.net/", label: "WikiDash", icon: BarChart3 },
  {
    key: "meetings-actions",
    href: "https://dashboard.corteqs.net/toplantiozet",
    label: "Toplantılar / Aksiyonlar",
    icon: Users,
  },
  {
    key: "legacy-todo",
    href: "https://dashboard.corteqs.net/todolist",
    label: "TODO Listesi (Legacy)",
    icon: ScrollText,
  },
  {
    key: "legacy-meetings",
    href: "https://dashboard.corteqs.net/toplantiozet",
    label: "Toplantı Özetleri (Legacy)",
    icon: Users,
  },
  { key: "hr", href: "https://dashboard.corteqs.net/insankaynaklari", label: "IK Dökümanları", icon: Users },
  { key: "r-and-d", href: "https://dashboard.corteqs.net/arge", label: "ARGE Dökümanları", icon: BarChart3 },
  { key: "links", href: "https://dashboard.corteqs.net/links", label: "Dosyalar ve Linkler", icon: Globe },
  { key: "dashboard-home", href: "https://dashboard.corteqs.net/", label: "Dashboard Anasayfa", icon: BarChart3 },
] as const;
