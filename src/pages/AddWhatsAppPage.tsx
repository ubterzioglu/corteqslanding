import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  MapPin,
  MessageSquare,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  createJoinRequest,
  getLanding,
  listLandings,
  submitLanding,
  uploadWhatsAppLandingHeroImage,
  type LandingCategory,
  type WhatsAppLanding,
} from "@/lib/whatsapp-landings";
import messagingHeroImage from "../../addwaimage.png";
import waPlaceholderImage from "../../waplaceholder.png";

const categoryMeta: Record<
  LandingCategory,
  { icon: typeof Users; label: string; chipClass: string }
> = {
  alumni: {
    icon: GraduationCap,
    label: "Alumni",
    chipClass: "border-primary/20 bg-primary/10 text-primary",
  },
  doktor: {
    icon: Stethoscope,
    label: "Doktor / Sağlık",
    chipClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  hobi: {
    icon: Heart,
    label: "Hobi",
    chipClass: "border-cyan-500/20 bg-cyan-500/10 text-cyan-700",
  },
  is: {
    icon: Users,
    label: "İş Grubu",
    chipClass: "border-amber-500/20 bg-amber-500/10 text-amber-800",
  },
  yatirim: {
    icon: TrendingUp,
    label: "Yatırım & Girişim",
    chipClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  girisim: {
    icon: TrendingUp,
    label: "Yatırım & Girişim",
    chipClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  akademik: {
    icon: Globe,
    label: "Akademik",
    chipClass: "border-indigo-500/20 bg-indigo-500/10 text-indigo-700",
  },
  dayanisma: {
    icon: HandHeart,
    label: "Dayanışma",
    chipClass: "border-rose-500/20 bg-rose-500/10 text-rose-700",
  },
  diger: {
    icon: Sparkles,
    label: "Diğer",
    chipClass: "border-border bg-muted text-muted-foreground",
  },
};

const placeholderLandings: WhatsAppLanding[] = [
  {
    id: "placeholder-berlin-girisim",
    groupName: "Berlin Girisim Agi",
    platform: "Discord",
    category: "girisim",
    country: "Almanya",
    city: "Berlin",
    mode: "visual",
    heroImage: waPlaceholderImage,
    tagline: "",
    callToActionText: "Topluluk; girisimciler, operatorler ve yatirim odakli profesyoneller icin tanisma ve bilgi paylasim alani.",
    conditions: "",
    whatsappLink: "#",
    description: "Erken asama girisimlerden buyume evresindeki projelere kadar nitelikli baglantilar kurmak isteyenler icin.",
    submitterRole: "manager",
    status: "approved",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "placeholder-dubai-yatirim",
    groupName: "Dubai Yatirim Cevresi",
    platform: "LinkedIn",
    category: "yatirim",
    country: "Birlesik Arap Emirlikleri",
    city: "Dubai",
    mode: "visual",
    heroImage: waPlaceholderImage,
    tagline: "",
    callToActionText: "Melek yatirim, fonlar ve girisim ekosistemi etrafinda bulusan Turk profesyoneller icin secili topluluk.",
    conditions: "",
    whatsappLink: "#",
    description: "Yatirim, ortaklik ve bolgesel network gelistirmek isteyenler icin tasarlandi.",
    submitterRole: "manager",
    status: "approved",
    createdAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "placeholder-londra-kariyer",
    groupName: "Londra Kariyer ve Is Iliskileri",
    platform: "WhatsApp",
    category: "is",
    country: "Birlesik Krallik",
    city: "Londra",
    mode: "visual",
    heroImage: waPlaceholderImage,
    tagline: "",
    callToActionText: "Kurumsal kariyer, is gelistirme ve sektor ici baglantilar icin aktif Turk profesyonel toplulugu.",
    conditions: "",
    whatsappLink: "#",
    description: "Deneyim paylasimi, yonlendirme ve is birlikleri odakli bir ag.",
    submitterRole: "member",
    status: "approved",
    createdAt: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "placeholder-amsterdam-akademik",
    groupName: "Amsterdam Akademik Turkler",
    platform: "Telegram",
    category: "akademik",
    country: "Hollanda",
    city: "Amsterdam",
    mode: "visual",
    heroImage: waPlaceholderImage,
    tagline: "",
    callToActionText: "Arastirmacilar, yuksek lisans ogrencileri ve akademisyenler icin bilgi ve duyuru toplulugu.",
    conditions: "",
    whatsappLink: "#",
    description: "Konferans, burs ve ortak calisma firsatlari etrafinda bulusan akademik cevre.",
    submitterRole: "manager",
    status: "approved",
    createdAt: "2026-01-04T00:00:00.000Z",
  },
  {
    id: "placeholder-toronto-dayanisma",
    groupName: "Toronto Dayanisma Hatti",
    platform: "Facebook",
    category: "dayanisma",
    country: "Kanada",
    city: "Toronto",
    mode: "visual",
    heroImage: waPlaceholderImage,
    tagline: "",
    callToActionText: "Yeni tasinanlar ve yerlesik uyeler arasinda hizli destek, yonlendirme ve yardimlasma icin kuruldu.",
    conditions: "",
    whatsappLink: "#",
    description: "Sehirde hayata uyum, sosyal destek ve guvenilir tavsiyeler icin canli topluluk.",
    submitterRole: "member",
    status: "approved",
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "placeholder-paris-hobi",
    groupName: "Paris Sosyal ve Hobi Kulubu",
    platform: "Instagram",
    category: "hobi",
    country: "Fransa",
    city: "Paris",
    mode: "visual",
    heroImage: waPlaceholderImage,
    tagline: "",
    callToActionText: "Etkinlik, kultur, hafta sonu planlari ve ortak ilgi alanlari etrafinda bulusan sosyal grup.",
    conditions: "",
    whatsappLink: "#",
    description: "Gundelik sosyallesme ve sehirde birlikte aktivite yapmak isteyenler icin.",
    submitterRole: "manager",
    status: "approved",
    createdAt: "2026-01-06T00:00:00.000Z",
  },
];

const approvalBadgeMeta = {
  member: {
    label: "Üye onaylı!",
    tooltip: "Bu topluluk kaydı bir topluluk üyesi tarafından gönderildi.",
    className: "border-sky-200 bg-sky-100 text-sky-800",
  },
  admin: {
    label: "Admin onaylı!",
    tooltip: "Bu topluluk CorteQS admin ekibi tarafından incelenip onaylandı.",
    className: "border-orange-200 bg-orange-100 text-orange-800",
  },
} as const;

const platformOptions = [
  "WhatsApp",
  "Telegram",
  "Discord",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "X",
  "TikTok",
  "YouTube",
  "Reddit",
] as const;

const platformMarkMeta: Record<string, { short: string; className: string }> = {
  WhatsApp: { short: "WA", className: "bg-[#e7f9ee] text-[#1f9d55]" },
  Telegram: { short: "TG", className: "bg-[#e7f4ff] text-[#229ED9]" },
  Discord: { short: "DS", className: "bg-[#eef0ff] text-[#5865F2]" },
  Facebook: { short: "f", className: "bg-[#ecf3ff] text-[#1877F2]" },
  Instagram: { short: "IG", className: "bg-[#fff0f6] text-[#E1306C]" },
  LinkedIn: { short: "in", className: "bg-[#eef7ff] text-[#0A66C2]" },
  X: { short: "X", className: "bg-slate-900 text-white" },
  TikTok: { short: "TT", className: "bg-slate-100 text-slate-900" },
  YouTube: { short: "YT", className: "bg-[#fff0f0] text-[#FF0000]" },
  Reddit: { short: "R", className: "bg-[#fff3ea] text-[#FF5700]" },
};

type GroupFormState = {
  submitterRole: "manager" | "member";
  platform: string;
  groupName: string;
  country: string;
  whatsappLink: string;
  description: string;
  callToActionText: string;
  conditions: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
};

type JoinFormState = {
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

const initialGroupForm: GroupFormState = {
  submitterRole: "manager",
  platform: "",
  groupName: "",
  country: "",
  whatsappLink: "",
  description: "",
  callToActionText: "",
  conditions: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
};

const initialJoinForm: JoinFormState = {
  fullName: "",
  email: "",
  phone: "",
  note: "",
};

export default function AddWhatsAppPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const groupSlug = searchParams.get("group")?.trim() ?? "";

  const [landings, setLandings] = useState<WhatsAppLanding[]>([]);
  const [selectedLanding, setSelectedLanding] = useState<WhatsAppLanding | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingLanding, setLoadingLanding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submittingGroup, setSubmittingGroup] = useState(false);
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [groupForm, setGroupForm] = useState<GroupFormState>(initialGroupForm);
  const [joinForm, setJoinForm] = useState<JoinFormState>(initialJoinForm);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const heroImageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);

    listLandings()
      .then((rows) => {
        if (!cancelled) setLandings(rows);
      })
      .finally(() => {
        if (!cancelled) setLoadingList(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!groupSlug) {
      setSelectedLanding(null);
      return;
    }

    let cancelled = false;
    setLoadingLanding(true);

    getLanding(groupSlug)
      .then((landing) => {
        if (!cancelled) {
          const placeholderLanding = placeholderLandings.find((item) => item.id === groupSlug);
          setSelectedLanding(landing ?? placeholderLanding ?? null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingLanding(false);
      });

    return () => {
      cancelled = true;
    };
  }, [groupSlug]);

  const filteredLandings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const mergedLandings = landings.length >= 6 ? landings : [...landings, ...placeholderLandings.slice(0, 6 - landings.length)];

    return mergedLandings.filter((landing) => {
      if (!query) return true;

      const haystack = [
        landing.groupName,
        landing.tagline,
        landing.country,
        landing.city,
        landing.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [landings, searchQuery]);

  const selectedConditionItems = useMemo(
    () =>
      selectedLanding?.conditions
        ?.split("\n")
        .map((condition) => condition.trim())
        .filter(Boolean) ?? [],
    [selectedLanding],
  );

  const updateGroupForm = <K extends keyof GroupFormState>(field: K, value: GroupFormState[K]) => {
    setGroupForm((current) => ({ ...current, [field]: value }));
  };

  const updateJoinForm = <K extends keyof JoinFormState>(field: K, value: JoinFormState[K]) => {
    setJoinForm((current) => ({ ...current, [field]: value }));
  };

  const ensureSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) return true;

    toast({
      title: "Giriş gerekli",
      description: "Mevcut giriş ekranı yeni sekmede açılıyor. Giriş yaptıktan sonra bu sekmeye geri dönebilirsin.",
    });
    window.open("/admin", "_blank", "noopener");
    return false;
  };

  const resetGroupForm = () => {
    setGroupForm(initialGroupForm);
    setHeroImageFile(null);
  };

  const handleGroupSubmit = async () => {
    if (!groupForm.platform.trim() || !groupForm.groupName.trim() || !groupForm.country.trim() || !groupForm.whatsappLink.trim()) {
      toast({
        title: "Eksik alan",
        description: "Platform, grup adı, ülke ve topluluk linki zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (groupForm.submitterRole === "manager" && !groupForm.adminName.trim()) {
      toast({
        title: "Yönetici bilgisi eksik",
        description: "Topluluk yöneticisi adı soyad alanını doldurun.",
        variant: "destructive",
      });
      return;
    }

    if (!(await ensureSignedIn())) return;

    setSubmittingGroup(true);
    try {
      let heroImageUrl: string | undefined;
      if (groupForm.submitterRole === "manager" && heroImageFile) {
        heroImageUrl = await uploadWhatsAppLandingHeroImage(heroImageFile);
      }

      const adminContact = [groupForm.adminEmail.trim() ? `E-posta: ${groupForm.adminEmail.trim()}` : "", groupForm.adminPhone.trim() ? `Telefon: ${groupForm.adminPhone.trim()}` : ""]
        .filter(Boolean)
        .join("\n");

      await submitLanding({
        groupName: groupForm.groupName,
        category: "diger",
        country: groupForm.country,
        city: "Genel",
        mode: groupForm.submitterRole === "manager" ? "visual" : "text",
        heroImage: groupForm.submitterRole === "manager" ? heroImageUrl ?? waPlaceholderImage : undefined,
        callToActionText: groupForm.callToActionText || groupForm.description,
        conditions: groupForm.conditions,
        whatsappLink: groupForm.whatsappLink,
        adminName: groupForm.adminName,
        adminContact,
        description: `[Platform: ${groupForm.platform}] [Başvuru tipi: ${groupForm.submitterRole === "manager" ? "Topluluk Yöneticisiyim" : "Topluluk Üyesiyim"}] ${groupForm.description}`.trim(),
      });

      toast({
        title: "Başvurun alındı",
        description: groupForm.submitterRole === "manager"
          ? "Landing sayfan admin onayından sonra /addcom altında görünecek."
          : "Grubun onay sonrası listede yayınlanacak.",
      });

      resetGroupForm();
    } catch (error) {
      toast({
        title: "Gönderilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen hata",
        variant: "destructive",
      });
    } finally {
      setSubmittingGroup(false);
    }
  };

  const handleJoinSubmit = async () => {
    if (!selectedLanding?.dbId) {
      toast({
        title: "Kayıt bulunamadı",
        description: "Bu grup için aktif katılım kaydı bulunamadı.",
      });
      return;
    }

    if (groupForm.submitterRole === "manager" && !groupForm.adminEmail.trim()) {
      toast({
        title: "Yönetici bilgisi eksik",
        description: "Topluluk yöneticisi mail adresini doldurun.",
        variant: "destructive",
      });
      return;
    }

    if (groupForm.submitterRole === "manager" && !groupForm.adminPhone.trim()) {
      toast({
        title: "Yönetici bilgisi eksik",
        description: "Topluluk yöneticisi telefon alanını doldurun.",
        variant: "destructive",
      });
      return;
    }

    if (!joinForm.fullName.trim() || !joinForm.email.trim()) {
      toast({
        title: "Eksik alan",
        description: "Ad ve e-posta zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (!(await ensureSignedIn())) return;

    setSubmittingJoin(true);
    try {
      await createJoinRequest({
        landingDbId: selectedLanding.dbId,
        fullName: joinForm.fullName,
        email: joinForm.email,
        phone: joinForm.phone,
        note: joinForm.note,
      });

      toast({
        title: "Talebin alındı",
        description: "Yönetici bilgilendirildi. Onay sonrası iletişime geçilecek.",
      });
      setJoinDialogOpen(false);
      setJoinForm(initialJoinForm);
    } catch (error) {
      toast({
        title: "Talep gönderilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen hata",
        variant: "destructive",
      });
    } finally {
      setSubmittingJoin(false);
    }
  };

  const handleShare = async () => {
    if (!selectedLanding) return;

    const shareUrl = `${window.location.origin}/addcom?group=${encodeURIComponent(selectedLanding.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedLanding.groupName,
          text: selectedLanding.tagline,
          url: shareUrl,
        });
        return;
      } catch {
        // Fall through to clipboard.
      }
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link kopyalandı",
      description: "Landing sayfası artık yeni /addcom adresi ile paylaşılabilir.",
    });
    window.setTimeout(() => setCopied(false), 1800);
  };

  const backToList = () => {
    setSearchParams({});
    navigate("/addcom", { replace: true });
  };

  const renderApprovalBadges = (landing: WhatsAppLanding, isDetailView = false) => {
    const badges = [];

    if (landing.memberApproved) {
      badges.push(approvalBadgeMeta.member);
    }

    if (landing.adminApproved) {
      badges.push(approvalBadgeMeta.admin);
    }

    if (badges.length === 0) return null;

    const badgeSize = isDetailView ? "text-sm font-semibold" : "text-xs font-medium";

    return (
      <div className="flex flex-col gap-2">
        {badges.map((badge) => (
          <Tooltip key={badge.label}>
            <TooltipTrigger asChild>
              <Badge className={`flex w-full cursor-default justify-center border px-3 py-1.5 text-center ${badgeSize} ${badge.className}`}>
                {badge.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{badge.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  };

  const renderDetailMetaBadges = (landing: WhatsAppLanding) => {
    const badges: JSX.Element[] = [];

    // Approval badges (detail view style)
    if (landing.memberApproved) {
      badges.push(
        <Tooltip key="member-badge">
          <TooltipTrigger asChild>
            <Badge className={`flex w-full cursor-default justify-center border px-3 py-1.5 text-center text-sm font-semibold ${approvalBadgeMeta.member.className}`}>
              {approvalBadgeMeta.member.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{approvalBadgeMeta.member.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    if (landing.adminApproved) {
      badges.push(
        <Tooltip key="admin-badge">
          <TooltipTrigger asChild>
            <Badge className={`flex w-full cursor-default justify-center border px-3 py-1.5 text-center text-sm font-semibold ${approvalBadgeMeta.admin.className}`}>
              {approvalBadgeMeta.admin.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{approvalBadgeMeta.admin.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    // Category badge (vibrant colors)
    const Icon = categoryMeta[landing.category].icon;
    badges.push(
      <Badge key="category" className={`flex w-full cursor-default justify-center border px-3 py-1.5 text-center text-sm font-semibold ${categoryMeta[landing.category].chipClass}`}>
        <Icon className="mr-2 h-4 w-4" />
        {categoryMeta[landing.category].label}
      </Badge>
    );

    // City badge (slate colors)
    badges.push(
      <Badge key="city" className="flex w-full cursor-default justify-center border border-slate-200 bg-slate-100 px-3 py-1.5 text-center text-sm font-semibold text-slate-700">
        <MapPin className="mr-2 h-4 w-4" />
        {landing.city}, {landing.country}
      </Badge>
    );

    // Admin badge (if present, violet colors)
    if (landing.adminName) {
      badges.push(
        <Badge key="admin" className="flex w-full cursor-default justify-center border border-violet-200 bg-violet-100 px-3 py-1.5 text-center text-sm font-semibold text-violet-800">
          <Users className="mr-2 h-4 w-4" />
          Yönetici: {landing.adminName}
        </Badge>
      );
    }

    if (badges.length === 0) return null;

    return <div className="flex flex-col gap-2">{badges}</div>;
  };

  const renderPlatformLogo = (platform?: string) => {
    if (!platform) return null;

    const platformLogoMap: Record<string, { svg: JSX.Element; className: string }> = {
      WhatsApp: {
        className: "bg-[#e7f9ee]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#1f9d55" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.471 1.338h-11a5.5 5.5 0 0 0-5.5 5.5v11a5.5 5.5 0 0 0 5.5 5.5h11a5.5 5.5 0 0 0 5.5-5.5v-11a5.5 5.5 0 0 0-5.5-5.5zm-5.486 15.633a3.37 3.37 0 0 1-2.145-.7l-1.532.537.547-1.5a3.35 3.35 0 0 1-.487-1.8 3.37 3.37 0 1 1 3.617 3.463zm0-6.25a2.87 2.87 0 0 0-2.868 2.87 2.87 2.87 0 1 0 2.868-2.87z" />
          </svg>
        ),
      },
      Telegram: {
        className: "bg-[#e7f4ff]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#229ED9" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.869 4.332-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.461c.54-.203 1.01.132.84.943z" />
          </svg>
        ),
      },
      Discord: {
        className: "bg-[#eef0ff]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.294.075.075 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .079.009c.12.098.246.198.373.295a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.076.076 0 0 0-.041.107c.36.699.77 1.364 1.225 1.994a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.057c.5-4.761-.838-8.895-3.549-12.55a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.960-2.157 2.157-2.157 1.198 0 2.167.964 2.157 2.157 0 1.19-.96 2.155-2.157 2.155zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.960-2.157 2.157-2.157 1.198 0 2.167.964 2.157 2.157 0 1.19-.959 2.155-2.157 2.155z" />
          </svg>
        ),
      },
      Facebook: {
        className: "bg-[#ecf3ff]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        ),
      },
      Instagram: {
        className: "bg-[#fff0f6]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#E1306C" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.63c-.79.297-1.427.645-2.03 1.24-.595.593-.943 1.232-1.24 2.02-.297.788-.5 1.658-.56 2.936C.035 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.263 2.148.56 2.936.297.787.645 1.427 1.24 2.02.593.595 1.232.943 2.02 1.24.788.297 1.659.5 2.936.56C8.333 23.965 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.263 2.936-.56.787-.297 1.427-.645 2.02-1.24.595-.593.943-1.232 1.24-2.02.297-.788.5-1.659.56-2.936.057-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.263-2.148-.56-2.936-.297-.787-.645-1.427-1.24-2.02-.593-.595-1.232-.943-2.02-1.24-.788-.297-1.659-.5-2.936-.56C15.667.048 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.805.244 2.227.408.56.217.96.477 1.382.896.419.42.679.822.896 1.381.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07z" />
            <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 0-2.881 1.44 1.44 0 0 1 0 2.881z" />
          </svg>
        ),
      },
      LinkedIn: {
        className: "bg-[#eef7ff]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        ),
      },
      X: {
        className: "bg-slate-900",
        svg: (
          <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.07-6.63-5.848 6.63H2.42l7.723-8.835L1.254 2.25h6.554l4.882 6.268L18.244 2.25zM17.51 19.31h1.828L5.84 4.126H3.863L17.51 19.31z" />
          </svg>
        ),
      },
      TikTok: {
        className: "bg-slate-100",
        svg: (
          <svg viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.498 4.667c-1.625-1.44-1.562-3.643-1.562-3.667h-3.33v12.3c0 1.36-1.088 2.46-2.444 2.46-1.36 0-2.46-1.1-2.46-2.46 0-1.36 1.1-2.46 2.46-2.46.28 0 .56.04.814.12v-3.3a5.844 5.844 0 0 0-.814-.06c-3.4 0-6.166 2.76-6.166 6.16s2.766 6.166 6.166 6.166c3.4 0 6.166-2.766 6.166-6.166V9.3c1.242.872 2.746 1.35 4.404 1.35v-3.328c-.986 0-1.922-.22-2.768-.656z" />
          </svg>
        ),
      },
      YouTube: {
        className: "bg-[#fff0f0]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        ),
      },
      Reddit: {
        className: "bg-[#fff3ea]",
        svg: (
          <svg viewBox="0 0 24 24" fill="#FF5700" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.385 4.859-7.563 4.859-4.178 0-7.562-2.165-7.562-4.859 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.53l.375-1.844z" />
          </svg>
        ),
      },
    };

    const logoMeta = platformLogoMap[platform];
    if (!logoMeta) return null;

    return (
      <div
        title={platform}
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full shadow-md ring-2 ring-white ${logoMeta.className}`}
      >
        <div className="h-7 w-7">{logoMeta.svg}</div>
      </div>
    );
  };

  if (groupSlug) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-5xl px-4 pb-16 pt-10">
          {loadingLanding ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
              Landing yükleniyor...
            </div>
          ) : !selectedLanding ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <h1 className="text-2xl font-bold text-foreground">Landing sayfası bulunamadı</h1>
              <p className="mt-3 text-muted-foreground">
                Bu slug için yayınlanmış bir grup sayfası yok veya henüz onaylanmamış olabilir.
              </p>
              <Button className="mt-6" variant="outline" onClick={backToList}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tüm gruplara dön
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <Link
                to="/addcom"
                onClick={(event) => {
                  event.preventDefault();
                  backToList();
                }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Tüm gruplar
              </Link>

              {selectedLanding.heroImage ? (
                <section className="relative overflow-hidden rounded-[2rem] border border-border">
                  <img
                    src={selectedLanding.heroImage}
                    alt={selectedLanding.groupName}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
                  <div className="absolute left-6 top-6 z-10 w-56 md:left-8 md:top-8">
                    {renderDetailMetaBadges(selectedLanding)}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                    <h1 className="text-3xl font-black leading-tight md:text-5xl">{selectedLanding.groupName}</h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-100 md:text-lg">{selectedLanding.tagline}</p>
                  </div>
                </section>
              ) : (
                <section className="rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_55%,#f8fafc_100%)] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                  <div className="mb-4 w-full max-w-sm">{renderDetailMetaBadges(selectedLanding)}</div>
                  <h1 className="text-3xl font-black text-foreground md:text-5xl">{selectedLanding.groupName}</h1>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-xl">
                    {selectedLanding.tagline}
                  </p>
                </section>
              )}

              <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
                <h2 className="text-xl font-bold text-foreground">Grubun çağrı metni</h2>
                <p className="mt-4 whitespace-pre-line text-foreground/85">{selectedLanding.callToActionText}</p>

                <div className="mt-6 flex flex-col gap-3">
                  <Button size="lg" asChild className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                    <a href={selectedLanding.whatsappLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5" />
                      Platforma git!
                    </a>
                  </Button>

                  <Button size="lg" className="w-full gap-2 bg-orange-500 text-white hover:bg-orange-600" onClick={() => void handleShare()}>
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Kopyalandı" : "Sayfayı Paylaş"}
                  </Button>
                </div>
              </section>

              {selectedConditionItems.length > 0 ? (
                <section className="rounded-[1.75rem] border border-border bg-card p-2 md:p-3">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="group-conditions" className="border-none">
                      <AccordionTrigger className="rounded-[1.25rem] px-4 py-4 text-left text-lg font-bold text-foreground hover:no-underline md:px-5">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-emerald-600" />
                          Grup koşulları
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-1 md:px-5">
                        <ul className="space-y-2">
                          {selectedConditionItems.map((condition) => (
                            <li key={condition} className="flex items-start gap-2 text-sm text-foreground/85">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              ) : null}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdfa_0%,#f9fafb_100%)]">
      <main className="container mx-auto px-4 pb-16 pt-6">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,#f1fbf8_0%,#f7fafc_45%,#ffffff_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.06),transparent_45%,rgba(14,165,233,0.08))]" />
          <div className="relative">
            <img
              src={messagingHeroImage}
              alt="Türk diaspora topluluklarını temsil eden mesajlaşma grupları görseli"
              className="h-[24rem] w-full object-cover md:h-[30rem]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.92)_22%,rgba(255,255,255,0.72)_40%,rgba(255,255,255,0.34)_58%,rgba(255,255,255,0.08)_72%,rgba(255,255,255,0)_82%)]" />
            <div className="absolute inset-y-0 left-0 flex w-full items-center p-6 md:w-[52%] md:p-10">
              <div className="max-w-full text-slate-950">
                <h1 className="flex items-start gap-3 text-[1.9rem] font-black tracking-tight md:text-[3rem]">
                  <MessageSquare className="mt-1 h-7 w-7 shrink-0 text-emerald-600 md:h-9 md:w-9" />
                  <span className="flex flex-col leading-[0.95]">
                    <span className="bg-[linear-gradient(90deg,#059669_0%,#06b6d4_30%,#2563eb_65%)] bg-clip-text text-transparent drop-shadow-[0_3px_14px_rgba(255,255,255,0.52)]">
                      Sosyal Medya
                    </span>
                    <span className="bg-[linear-gradient(90deg,#2563eb_0%,#7c3aed_45%,#f97316_100%)] bg-clip-text text-transparent drop-shadow-[0_3px_14px_rgba(255,255,255,0.52)]">
                      Türk Toplulukları
                    </span>
                  </span>
                </h1>
                <div className="mt-4 grid max-w-[28rem] grid-cols-2 gap-3 sm:grid-cols-3">
                  <Badge className="flex w-full justify-center border border-emerald-200/70 bg-white/88 px-4 py-1.5 text-center text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur-sm">
                    WhatsApp
                  </Badge>
                  <Badge className="flex w-full justify-center border border-sky-200/70 bg-white/88 px-4 py-1.5 text-center text-sm font-semibold text-sky-700 shadow-sm backdrop-blur-sm">
                    Telegram
                  </Badge>
                  <Badge className="flex w-full justify-center border border-indigo-200/70 bg-white/88 px-4 py-1.5 text-center text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur-sm">
                    Discord
                  </Badge>
                  <Badge className="flex w-full justify-center border border-blue-200/70 bg-white/88 px-4 py-1.5 text-center text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                    Facebook
                  </Badge>
                  <Badge className="flex w-full justify-center border border-pink-200/70 bg-white/88 px-4 py-1.5 text-center text-sm font-semibold text-pink-700 shadow-sm backdrop-blur-sm">
                    Instagram
                  </Badge>
                  <Badge className="flex w-full justify-center border border-orange-200/70 bg-white/88 px-4 py-1.5 text-center text-sm font-semibold text-orange-700 shadow-sm backdrop-blur-sm">
                    LinkedIn
                  </Badge>
                </div>
                <div className="mt-5 space-y-2">
                  <p className="text-[1.05rem] font-semibold text-slate-900 md:text-[1.22rem] md:whitespace-nowrap">
                    Dünyadaki Türk topluluklarını keşfet.
                  </p>
                  <p className="text-[1.05rem] font-bold text-slate-950 md:text-[1.22rem] md:whitespace-nowrap">
                    Her konuda toplulukları saniyeler içinde bul.
                  </p>
                  <p className="text-[1.05rem] font-bold text-slate-950 md:text-[1.22rem] md:whitespace-nowrap">
                    Sana uygun topluluğa katıl!
                  </p>
                  <p className="text-[1.05rem] font-bold text-slate-950 md:text-[1.22rem] md:whitespace-nowrap">
                    Toplulukları ücretsiz ekle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-[1.75rem] border border-emerald-200/60 bg-white/90 p-3 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
          <Accordion type="single" collapsible defaultValue={undefined} className="w-full">
            <AccordionItem value="addwa-form" className="border-b-0">
              <AccordionTrigger className="min-h-[56px] py-0 hover:no-underline">
                <div className="flex min-h-[56px] items-center gap-3 text-left">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
                  <div className="flex items-center">
                    <h2 className="text-base font-bold text-foreground md:text-lg">Topluluk Ekle</h2>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">1. Grup Bilgileri</h3>
                    <div>
                      <Label>Başvuru Tipi</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={groupForm.submitterRole === "manager" ? "default" : "outline"}
                          onClick={() => updateGroupForm("submitterRole", "manager")}
                        >
                          Topluluk Yöneticisiyim
                        </Button>
                        <Button
                          type="button"
                          variant={groupForm.submitterRole === "member" ? "default" : "outline"}
                          onClick={() => updateGroupForm("submitterRole", "member")}
                        >
                          Topluluk Üyesiyim
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="platform">Platform *</Label>
                      <Select value={groupForm.platform} onValueChange={(value) => updateGroupForm("platform", value)}>
                        <SelectTrigger id="platform" className="mt-1">
                          <SelectValue placeholder="Platform seç" />
                        </SelectTrigger>
                        <SelectContent>
                          {platformOptions.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="group-name">Grup Adı *</Label>
                      <Input
                        id="group-name"
                        value={groupForm.groupName}
                        onChange={(event) => updateGroupForm("groupName", event.target.value)}
                        placeholder="Örn: Berlin Türk Girişimciler"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp-link">Topluluk Linki *</Label>
                      <Input
                        id="whatsapp-link"
                        value={groupForm.whatsappLink}
                        onChange={(event) => updateGroupForm("whatsappLink", event.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Ülke *</Label>
                      <Input
                        id="country"
                        value={groupForm.country}
                        onChange={(event) => updateGroupForm("country", event.target.value)}
                        placeholder="Almanya"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Kısa Açıklama</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        value={groupForm.description}
                        onChange={(event) => updateGroupForm("description", event.target.value)}
                        placeholder="Grup hakkında 1-2 cümle"
                      />
                    </div>
                  </div>

                  {groupForm.submitterRole === "manager" ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        2. Topluluk Kartı Özelliklerini Belirtin (Sadece Yöneticiler İçindir.)
                      </h3>

                      <div>
                        <Label htmlFor="hero-image-file">Topluluk Kartı İçin Görsel Yükle</Label>
                        <input
                          ref={heroImageInputRef}
                          id="hero-image-file"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(event) => setHeroImageFile(event.target.files?.[0] ?? null)}
                        />
                        <button
                          type="button"
                          onClick={() => heroImageInputRef.current?.click()}
                          className="ml-3 inline-flex h-11 items-center gap-2 rounded-xl border border-orange-200 bg-orange-500 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_16px_36px_rgba(249,115,22,0.28)]"
                        >
                          Dosya Seç
                        </button>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {heroImageFile
                              ? `Seçilen dosya: ${heroImageFile.name}`
                              : "Dosya tipi: JPG, PNG, WEBP, GIF. Önerilen oran: 16:9 yatay. Maksimum dosya boyutu: 5 MB."}
                          </p>
                      </div>

                      <div>
                        <Label htmlFor="cta-text">Yeni üyeler için mesaj</Label>
                        <Textarea
                          id="cta-text"
                          rows={4}
                          value={groupForm.callToActionText}
                          onChange={(event) => updateGroupForm("callToActionText", event.target.value)}
                          placeholder="Yeni üyelere çağrı amacıyla metin yaz."
                        />
                      </div>

                      <div>
                        <Label htmlFor="conditions">Topluluk Kuralları</Label>
                        <Textarea
                          id="conditions"
                          rows={4}
                          value={groupForm.conditions}
                          onChange={(event) => updateGroupForm("conditions", event.target.value)}
                          placeholder={"Her satıra bir kural yazın\nÖrn: Grup içi reklam yasak"}
                        />
                      </div>

                      <div>
                        <Label htmlFor="admin-name">Topluluk Yöneticisi Adı Soyad *</Label>
                        <Input
                          id="admin-name"
                          value={groupForm.adminName}
                          onChange={(event) => updateGroupForm("adminName", event.target.value)}
                          placeholder="Ad Soyad"
                        />
                      </div>

                      <div>
                        <Label htmlFor="admin-email">Topluluk Yöneticisi Mail Adresi *</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={groupForm.adminEmail}
                          onChange={(event) => updateGroupForm("adminEmail", event.target.value)}
                          placeholder="ornek@email.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="admin-phone">Topluluk Yöneticisi Telefon *</Label>
                        <Input
                          id="admin-phone"
                          value={groupForm.adminPhone}
                          onChange={(event) => updateGroupForm("adminPhone", event.target.value)}
                          placeholder="+49 ..."
                        />
                      </div>
                    </div>
                  ) : null}

                  <Button
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => void handleGroupSubmit()}
                    disabled={submittingGroup}
                  >
                    {submittingGroup ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <section className="mt-8">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9"
              placeholder="Topluluk ara!"
            />
          </div>

          <div className="mt-5">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Katılabileceğin Topluluklar</h2>
            </div>
          </div>

          <div className="mt-6">
            {loadingList ? (
              <div className="rounded-[1.75rem] border border-border bg-card p-10 text-center text-muted-foreground">
                Gruplar yükleniyor...
              </div>
            ) : filteredLandings.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-card p-10 text-center">
                <h3 className="text-lg font-bold text-foreground">Filtreye uygun grup bulunamadı</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aramayı temizleyebilir veya ilk başvurulardan birini siz gönderebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredLandings.map((landing) => {
                  const Icon = categoryMeta[landing.category].icon;
                  const cardSummary =
                    landing.callToActionText?.trim() ||
                    landing.description
                      ?.replace(/\[Platform:\s*[^\]]+\]\s*/gi, "")
                      .replace(/\[Başvuru tipi:[^\]]+\]\s*/gi, "")
                      .replace(/\[Badge member:\s*(true|false)\]\s*/gi, "")
                      .replace(/\[Badge admin:\s*(true|false)\]\s*/gi, "")
                      .trim() ||
                    "Topluluk detaylarını görmek için karta tıkla.";

                  return (
                    <Link
                      key={landing.id}
                      to={`/addcom?group=${encodeURIComponent(landing.id)}`}
                      className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-1"
                    >
                      {landing.heroImage ? (
                        <div className="relative">
                          <img
                            src={landing.heroImage}
                            alt={landing.groupName}
                            className="aspect-video w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                        </div>
                      ) : null}

                      <div className="p-5">
                        <div className="flex flex-col gap-2">
                          {renderApprovalBadges(landing)}
                          <Badge className={`flex w-full justify-center border ${categoryMeta[landing.category].chipClass}`}>
                            <Icon className="mr-1 h-3 w-3" />
                            {categoryMeta[landing.category].label}
                          </Badge>
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-foreground group-hover:text-emerald-700">
                          {landing.groupName}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{cardSummary}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {landing.city}, {landing.country}
                          </span>
                          {renderPlatformLogo(landing.platform)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
