import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  MapPin,
  MessageSquare,
  PlusCircle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  createJoinRequest,
  getLanding,
  listLandings,
  submitLanding,
  type LandingCategory,
  type LandingMode,
  type WhatsAppLanding,
} from "@/lib/whatsapp-landings";

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
    label: "Doktor / Saglik",
    chipClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  hobi: {
    icon: Heart,
    label: "Hobi",
    chipClass: "border-cyan-500/20 bg-cyan-500/10 text-cyan-700",
  },
  is: {
    icon: Users,
    label: "Is Grubu",
    chipClass: "border-amber-500/20 bg-amber-500/10 text-amber-800",
  },
  yatirim: {
    icon: TrendingUp,
    label: "Yatirim & Girisim",
    chipClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  girisim: {
    icon: TrendingUp,
    label: "Yatirim & Girisim",
    chipClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  },
  akademik: {
    icon: Globe,
    label: "Akademik",
    chipClass: "border-indigo-500/20 bg-indigo-500/10 text-indigo-700",
  },
  dayanisma: {
    icon: HandHeart,
    label: "Dayanisma",
    chipClass: "border-rose-500/20 bg-rose-500/10 text-rose-700",
  },
  diger: {
    icon: Sparkles,
    label: "Diğer",
    chipClass: "border-border bg-muted text-muted-foreground",
  },
};

type GroupFormState = {
  groupName: string;
  category: LandingCategory;
  otherCategory: string;
  country: string;
  city: string;
  whatsappLink: string;
  description: string;
  createLanding: boolean;
  mode: LandingMode;
  heroImage: string;
  tagline: string;
  callToActionText: string;
  conditions: string;
  adminName: string;
  adminContact: string;
  consent: boolean;
};

type JoinFormState = {
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

const initialGroupForm: GroupFormState = {
  groupName: "",
  category: "alumni",
  otherCategory: "",
  country: "",
  city: "",
  whatsappLink: "",
  description: "",
  createLanding: true,
  mode: "visual",
  heroImage: "",
  tagline: "",
  callToActionText: "",
  conditions: "",
  adminName: "",
  adminContact: "",
  consent: false,
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
  const [countryFilter, setCountryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submittingGroup, setSubmittingGroup] = useState(false);
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [groupForm, setGroupForm] = useState<GroupFormState>(initialGroupForm);
  const [joinForm, setJoinForm] = useState<JoinFormState>(initialJoinForm);

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
    setCityFilter("all");
  }, [countryFilter]);

  useEffect(() => {
    if (!groupSlug) {
      setSelectedLanding(null);
      return;
    }

    let cancelled = false;
    setLoadingLanding(true);

    getLanding(groupSlug)
      .then((landing) => {
        if (!cancelled) setSelectedLanding(landing ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoadingLanding(false);
      });

    return () => {
      cancelled = true;
    };
  }, [groupSlug]);

  const countryOptions = useMemo(() => {
    return Array.from(new Set(landings.map((landing) => landing.country))).sort((a, b) => a.localeCompare(b, "tr"));
  }, [landings]);

  const cityOptions = useMemo(() => {
    const source =
      countryFilter === "all" ? landings : landings.filter((landing) => landing.country === countryFilter);

    return Array.from(new Set(source.map((landing) => landing.city))).sort((a, b) => a.localeCompare(b, "tr"));
  }, [countryFilter, landings]);

  const filteredLandings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return landings.filter((landing) => {
      if (countryFilter !== "all" && landing.country !== countryFilter) return false;
      if (cityFilter !== "all" && landing.city !== cityFilter) return false;
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
  }, [cityFilter, countryFilter, landings, searchQuery]);

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
      title: "Giris gerekli",
      description: "Mevcut giris ekrani yeni sekmede aciliyor. Giris yaptiktan sonra bu sekmeye geri donebilirsin.",
    });
    window.open("/admin", "_blank", "noopener");
    return false;
  };

  const resetGroupForm = () => {
    setGroupForm(initialGroupForm);
  };

  const handleGroupSubmit = async () => {
    if (!groupForm.groupName.trim() || !groupForm.country.trim() || !groupForm.city.trim() || !groupForm.whatsappLink.trim()) {
      toast({
        title: "Eksik alan",
        description: "Grup adi, ulke, sehir ve WhatsApp linki zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (groupForm.category === "diger" && !groupForm.otherCategory.trim()) {
      toast({
        title: "Kategori eksik",
        description: "Diğer kategorisini seçerseniz açıklama gerekir.",
        variant: "destructive",
      });
      return;
    }

    if (!groupForm.consent) {
      toast({
        title: "Onay gerekli",
        description: "Basvuru icin KVKK/GDPR onay kutusunu isaretleyin.",
        variant: "destructive",
      });
      return;
    }

    if (!(await ensureSignedIn())) return;

    setSubmittingGroup(true);
    try {
      await submitLanding({
        groupName: groupForm.groupName,
        category: groupForm.category,
        country: groupForm.country,
        city: groupForm.city,
        mode: groupForm.createLanding ? groupForm.mode : "text",
        heroImage: groupForm.createLanding && groupForm.mode === "visual" ? groupForm.heroImage : undefined,
        tagline: groupForm.tagline || groupForm.description,
        callToActionText: groupForm.callToActionText || groupForm.description,
        conditions: groupForm.conditions,
        whatsappLink: groupForm.whatsappLink,
        adminName: groupForm.adminName,
        adminContact: groupForm.adminContact,
        description:
          groupForm.category === "diger" && groupForm.otherCategory.trim()
            ? `[Kategori: ${groupForm.otherCategory.trim()}] ${groupForm.description}`
            : groupForm.description,
      });

      toast({
        title: "Basvurun alindi",
        description: groupForm.createLanding
          ? "Landing sayfan admin onayindan sonra /addwa altinda gorunecek."
          : "Grubun onay sonrasi listede yayinlanacak.",
      });

      setDialogOpen(false);
      resetGroupForm();
    } catch (error) {
      toast({
        title: "Gonderilemedi",
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
        title: "Demo landing",
        description: "Demo kartlarda katilim talebi yerine dogrudan WhatsApp linki kullanilir.",
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
        title: "Talebin alindi",
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

    const shareUrl = `${window.location.origin}/addwa?group=${encodeURIComponent(selectedLanding.id)}`;
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
      title: "Link kopyalandi",
      description: "Landing sayfasi artik yeni /addwa adresi ile paylasilabilir.",
    });
    window.setTimeout(() => setCopied(false), 1800);
  };

  const backToList = () => {
    setSearchParams({});
    navigate("/addwa", { replace: true });
  };

  if (groupSlug) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-5xl px-4 pb-16 pt-10">
          {loadingLanding ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
              Landing yukleniyor...
            </div>
          ) : !selectedLanding ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <h1 className="text-2xl font-bold text-foreground">Landing sayfasi bulunamadi</h1>
              <p className="mt-3 text-muted-foreground">
                Bu slug icin yayinlanmis bir grup sayfasi yok veya henuz onaylanmamis olabilir.
              </p>
              <Button className="mt-6" variant="outline" onClick={backToList}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tum gruplara don
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <Link
                to="/addwa"
                onClick={(event) => {
                  event.preventDefault();
                  backToList();
                }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Tum gruplar
              </Link>

              {selectedLanding.mode === "visual" && selectedLanding.heroImage ? (
                <section className="relative overflow-hidden rounded-[2rem] border border-border">
                  <img
                    src={selectedLanding.heroImage}
                    alt={selectedLanding.groupName}
                    className="h-72 w-full object-cover md:h-96"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                    <Badge className="mb-3 border-0 bg-emerald-500 text-white">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      {categoryMeta[selectedLanding.category].label}
                    </Badge>
                    <h1 className="text-3xl font-black leading-tight md:text-5xl">{selectedLanding.groupName}</h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-100 md:text-lg">{selectedLanding.tagline}</p>
                  </div>
                </section>
              ) : (
                <section className="rounded-[2rem] border border-border bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_55%,#f8fafc_100%)] p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                  <Badge className={`mb-4 border ${categoryMeta[selectedLanding.category].chipClass}`}>
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {categoryMeta[selectedLanding.category].label}
                  </Badge>
                  <h1 className="text-3xl font-black text-foreground md:text-5xl">{selectedLanding.groupName}</h1>
                  <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-xl">
                    {selectedLanding.tagline}
                  </p>
                </section>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedLanding.city}, {selectedLanding.country}
                </span>
                {selectedLanding.adminName ? (
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Yönetici: {selectedLanding.adminName}
                  </span>
                ) : null}
              </div>

              <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-8">
                <h2 className="text-xl font-bold text-foreground">Grubun çağrı metni</h2>
                <p className="mt-4 whitespace-pre-line text-foreground/85">{selectedLanding.callToActionText}</p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {selectedLanding.dbId ? (
                    <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="flex-1 gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                          <UserPlus className="h-5 w-5" />
                          Katılma Talebi Gönder
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{selectedLanding.groupName} - Katılma Talebi</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="join-full-name">Ad Soyad *</Label>
                            <Input
                              id="join-full-name"
                              value={joinForm.fullName}
                              onChange={(event) => updateJoinForm("fullName", event.target.value)}
                              placeholder="Adiniz Soyadiniz"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="join-email">E-posta *</Label>
                            <Input
                              id="join-email"
                              type="email"
                              value={joinForm.email}
                              onChange={(event) => updateJoinForm("email", event.target.value)}
                              placeholder="ornek@email.com"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="join-phone">Telefon</Label>
                            <Input
                              id="join-phone"
                              value={joinForm.phone}
                              onChange={(event) => updateJoinForm("phone", event.target.value)}
                              placeholder="+49 ..."
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="join-note">Not</Label>
                            <Textarea
                              id="join-note"
                              rows={3}
                              value={joinForm.note}
                              onChange={(event) => updateJoinForm("note", event.target.value)}
                              placeholder="Kendinizden kisaca bahsedin"
                            />
                          </div>

                          <Button
                            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={() => void handleJoinSubmit()}
                            disabled={submittingJoin}
                          >
                            {submittingJoin ? "Gonderiliyor..." : "Talebi Gonder"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <a href={selectedLanding.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button size="lg" className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                        <MessageSquare className="h-5 w-5" />
                        WhatsApp Linkini Ac
                      </Button>
                    </a>
                  )}

                  <Button size="lg" variant="outline" className="gap-2" onClick={() => void handleShare()}>
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Kopyalandi" : "Sayfayi Paylas"}
                  </Button>
                </div>
              </section>

              {selectedLanding.conditions ? (
                <section className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-foreground">Grup kosullari</h2>
                  </div>
                  <ul className="space-y-2">
                    {selectedLanding.conditions
                      .split("\n")
                      .map((condition) => condition.trim())
                      .filter(Boolean)
                      .map((condition) => (
                        <li key={condition} className="flex items-start gap-2 text-sm text-foreground/85">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{condition}</span>
                        </li>
                      ))}
                  </ul>
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
        <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
              <MessageSquare className="h-7 w-7 text-emerald-500" />
              Mesajlaşma Grupları
            </h1>
            <p className="mt-2 text-sm text-slate-600 md:text-base">
              Diasporanın WhatsApp ve Telegram gruplarını ülke ve şehir bazında filtrele.
            </p>
          </div>
          <div className="grid w-full gap-2 sm:max-w-sm">
            <select
              value={countryFilter}
              onChange={(event) => setCountryFilter(event.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="all">🌍 Tüm Ülkeler</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="all">📍 Tüm Şehirler</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[1.5rem] border border-cyan-100 bg-[linear-gradient(120deg,#e8f6f4_0%,#f5f8fb_100%)] p-6 shadow-[0_18px_56px_rgba(15,23,42,0.08)] md:p-10">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            <Badge className="border-0 bg-emerald-100 text-emerald-700">WhatsApp</Badge>
            <Badge className="border-0 bg-sky-100 text-sky-700">Telegram</Badge>
            <Badge className="border-0 bg-orange-100 text-orange-700">Diaspora Ağı</Badge>
          </div>
          <h2 className="mx-auto max-w-5xl text-center text-3xl font-black leading-tight text-slate-900 md:text-5xl">
            Diasporanın WhatsApp & Telegram Gruplarını
            <span className="text-orange-500"> Tek Çatı Altında Bul</span>
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-center text-base leading-8 text-slate-600 md:text-2xl">
            Alumni, doktor, hobi ve iş gruplarına saniyeler içinde katıl ya da kendi
            WhatsApp/Telegram grubun için ücretsiz bir landing sayfası yayınla.
          </p>
          <div className="mt-6 flex justify-center">
            <Badge className="border-0 bg-emerald-100 px-4 py-1.5 text-emerald-700">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Grup listeleme ve landing page tamamen ücretsiz
            </Badge>
          </div>
        </section>

        <div className="mt-8 rounded-[1.75rem] border border-emerald-200/60 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-foreground md:text-xl">Grubunu listele, istersen landing sayfasi da ac</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ornek kartlar demo olarak gorunebilir. Gercek basvurular admin onayindan sonra listelenir.
              </p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                <PlusCircle className="h-4 w-4" />
                Grubunu Listele + Landing Page Olustur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Grubunu Paylas</DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">1. Grup Bilgileri</h3>
                  <div>
                    <Label htmlFor="group-name">Grup Adi *</Label>
                    <Input
                      id="group-name"
                      value={groupForm.groupName}
                      onChange={(event) => updateGroupForm("groupName", event.target.value)}
                      placeholder="Orn: Berlin Turk Girisimciler"
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <select
                        id="category"
                        value={groupForm.category}
                        onChange={(event) => updateGroupForm("category", event.target.value as LandingCategory)}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="alumni">Alumni</option>
                        <option value="doktor">Doktor / Saglik</option>
                        <option value="hobi">Hobi</option>
                        <option value="is">Is Grubu</option>
                        <option value="yatirim">Yatirim & Girisim</option>
                        <option value="akademik">Akademik</option>
                        <option value="dayanisma">Dayanisma</option>
                        <option value="diger">Diğer</option>
                      </select>
                      {groupForm.category === "diger" ? (
                        <Input
                          className="mt-2"
                          value={groupForm.otherCategory}
                          onChange={(event) => updateGroupForm("otherCategory", event.target.value)}
                          placeholder="Orn: Spor, Muzik, Aile"
                        />
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="whatsapp-link">WhatsApp Linki *</Label>
                      <Input
                        id="whatsapp-link"
                        value={groupForm.whatsappLink}
                        onChange={(event) => updateGroupForm("whatsappLink", event.target.value)}
                        placeholder="https://chat.whatsapp.com/..."
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor="country">Ulke *</Label>
                      <Input
                        id="country"
                        value={groupForm.country}
                        onChange={(event) => updateGroupForm("country", event.target.value)}
                        placeholder="Almanya"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Sehir *</Label>
                      <Input
                        id="city"
                        value={groupForm.city}
                        onChange={(event) => updateGroupForm("city", event.target.value)}
                        placeholder="Berlin"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Kısa Açıklama</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={groupForm.description}
                      onChange={(event) => updateGroupForm("description", event.target.value)}
                      placeholder="Grup hakkinda 1-2 cumle"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <Checkbox
                      checked={groupForm.createLanding}
                      onCheckedChange={(value) => updateGroupForm("createLanding", Boolean(value))}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-foreground">Bu grup icin landing sayfasi da olustur</p>
                      <p className="text-sm text-muted-foreground">
                        Onay sonrasi grup sayfasi /addwa?group=slug adresinde yayinlanir.
                      </p>
                    </div>
                  </label>
                </div>

                {groupForm.createLanding ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">2. Landing Icerigi</h3>
                    <div>
                      <Label>Gorunum Tipi</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={groupForm.mode === "visual" ? "default" : "outline"}
                          onClick={() => updateGroupForm("mode", "visual")}
                        >
                          Gorselli
                        </Button>
                        <Button
                          type="button"
                          variant={groupForm.mode === "text" ? "default" : "outline"}
                          onClick={() => updateGroupForm("mode", "text")}
                        >
                          Sade Metin
                        </Button>
                      </div>
                    </div>

                    {groupForm.mode === "visual" ? (
                      <div>
                        <Label htmlFor="hero-image">Hero Gorsel URL</Label>
                        <Input
                          id="hero-image"
                          value={groupForm.heroImage}
                          onChange={(event) => updateGroupForm("heroImage", event.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    ) : null}

                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={groupForm.tagline}
                        onChange={(event) => updateGroupForm("tagline", event.target.value)}
                        placeholder="Kısa ve net bir başlık"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta-text">Cagri Metni</Label>
                      <Textarea
                        id="cta-text"
                        rows={4}
                        value={groupForm.callToActionText}
                        onChange={(event) => updateGroupForm("callToActionText", event.target.value)}
                        placeholder="Bu gruba neden katilinmali?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="conditions">Kosullar</Label>
                      <Textarea
                        id="conditions"
                        rows={4}
                        value={groupForm.conditions}
                        onChange={(event) => updateGroupForm("conditions", event.target.value)}
                        placeholder={"Her satira bir kural yazin\nOrn: Grup ici reklam yasak"}
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <Label htmlFor="admin-name">Yönetici Adı</Label>
                        <Input
                          id="admin-name"
                          value={groupForm.adminName}
                          onChange={(event) => updateGroupForm("adminName", event.target.value)}
                          placeholder="Yönetici ismi"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admin-contact">Yönetici İletişimi</Label>
                        <Input
                          id="admin-contact"
                          value={groupForm.adminContact}
                          onChange={(event) => updateGroupForm("adminContact", event.target.value)}
                          placeholder="E-posta veya telefon"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/20 p-3">
                  <Checkbox
                    checked={groupForm.consent}
                    onCheckedChange={(value) => updateGroupForm("consent", Boolean(value))}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-muted-foreground">
                    Verilerin admin incelemesi ve grup yonetimi amaciyla islenmesini kabul ediyorum.
                  </span>
                </label>

                <Button
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => void handleGroupSubmit()}
                  disabled={submittingGroup}
                >
                  {submittingGroup ? "Gonderiliyor..." : "Basvuruyu Gonder"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <section className="relative mt-8 rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_46%),#ffffff] p-8 text-center shadow-[0_16px_48px_rgba(15,23,42,0.06)]">
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-emerald-300 bg-white/90 p-7">
            <PlusCircle className="mx-auto h-10 w-10 text-emerald-500" />
            <h3 className="mt-3 text-2xl font-bold text-slate-900">Grubunuzu ekleyin</h3>
            <p className="mt-2 text-sm text-slate-600">
              Alumni, Doktor, Hobi ve daha fazlası. Kendi grubunu ücretsiz listele.
            </p>
            <Button
              type="button"
              className="mt-5 rounded-full bg-emerald-500 px-6 text-white hover:bg-emerald-600"
              onClick={() => setDialogOpen(true)}
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Grubunu Listele
            </Button>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Yayında Olan Gruplar</h2>
              <p className="text-sm text-slate-600">Grup adı, kategori, şehir veya ülke ile arama yap.</p>
            </div>
            <div className="grid w-full gap-3 lg:max-w-md">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Grup, şehir veya açıklama ara"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            {loadingList ? (
              <div className="rounded-[1.75rem] border border-border bg-card p-10 text-center text-muted-foreground">
                Gruplar yukleniyor...
              </div>
            ) : filteredLandings.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-card p-10 text-center">
                <h3 className="text-lg font-bold text-foreground">Filtreye uygun grup bulunamadi</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Aramayı temizleyebilir veya ilk başvurulardan birini siz gönderebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredLandings.map((landing) => {
                  const Icon = categoryMeta[landing.category].icon;

                  return (
                    <Link
                      key={`${landing.id}-${landing.dbId ?? "demo"}`}
                      to={`/addwa?group=${encodeURIComponent(landing.id)}`}
                      className="group rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Badge className={`border ${categoryMeta[landing.category].chipClass}`}>
                          <Icon className="mr-1 h-3 w-3" />
                          {categoryMeta[landing.category].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{landing.dbId ? "Onayli" : "Demo"}</span>
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-foreground group-hover:text-emerald-700">
                        {landing.groupName}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{landing.tagline}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {landing.city}, {landing.country}
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
