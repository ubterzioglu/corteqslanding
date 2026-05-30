import { useEffect, useMemo, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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

type GroupFormState = {
  submitterRole: "manager" | "member";
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
        if (!cancelled) setSelectedLanding(landing ?? null);
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

    return landings.filter((landing) => {
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
    if (!groupForm.groupName.trim() || !groupForm.country.trim() || !groupForm.whatsappLink.trim()) {
      toast({
        title: "Eksik alan",
        description: "Grup adı, ülke ve WhatsApp linki zorunludur.",
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
        heroImage: groupForm.submitterRole === "manager" ? heroImageUrl ?? messagingHeroImage : undefined,
        tagline: groupForm.description,
        callToActionText: groupForm.callToActionText || groupForm.description,
        conditions: groupForm.conditions,
        whatsappLink: groupForm.whatsappLink,
        adminName: groupForm.adminName,
        adminContact,
        description: `[Başvuru tipi: ${groupForm.submitterRole === "manager" ? "Topluluk Yöneticisiyim" : "Topluluk Üyesiyim"}] ${groupForm.description}`.trim(),
      });

      toast({
        title: "Başvurun alındı",
        description: groupForm.submitterRole === "manager"
          ? "Landing sayfan admin onayından sonra /addwa altında görünecek."
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
      title: "Link kopyalandı",
      description: "Landing sayfası artık yeni /addwa adresi ile paylaşılabilir.",
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
                to="/addwa"
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
                            placeholder="Adınız Soyadınız"
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
                            placeholder="Kendinizden kısaca bahsedin"
                          />
                        </div>

                        <Button
                          className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() => void handleJoinSubmit()}
                          disabled={submittingJoin}
                        >
                          {submittingJoin ? "Gönderiliyor..." : "Talebi Gönder"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="lg" variant="outline" className="gap-2" onClick={() => void handleShare()}>
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Kopyalandı" : "Sayfayı Paylaş"}
                  </Button>
                </div>
              </section>

              {selectedLanding.conditions ? (
                <section className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-foreground">Grup koşulları</h2>
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
        <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-[radial-gradient(circle_at_top_left,#f1fbf8_0%,#f7fafc_45%,#ffffff_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.06),transparent_45%,rgba(14,165,233,0.08))]" />
          <div className="relative">
            <img
              src={messagingHeroImage}
              alt="Türk diaspora topluluklarını temsil eden mesajlaşma grupları görseli"
              className="h-[28rem] w-full object-cover md:h-[36rem]"
            />
            <div className="absolute inset-y-0 left-0 flex w-full items-center p-6 md:w-1/2 md:p-8">
              <div className="max-w-full text-slate-950">
                <h1 className="flex items-center gap-3 text-[2rem] font-black tracking-tight md:text-[3.25rem] md:whitespace-nowrap">
                  <MessageSquare className="h-7 w-7 shrink-0 text-sky-600 md:h-9 md:w-9" />
                  <span className="bg-[linear-gradient(90deg,#0f766e_0%,#0284c7_45%,#f97316_100%)] bg-clip-text text-transparent">
                    Mesajlaşma Toplulukları
                  </span>
                </h1>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Badge className="border-0 bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">WhatsApp</Badge>
                  <Badge className="border-0 bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">Telegram</Badge>
                  <Badge className="border-0 bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-700">Diaspora Ağı</Badge>
                </div>
                <div className="mt-4 space-y-1.5">
                  <p className="text-base font-medium md:text-[1.1rem] md:whitespace-nowrap">
                    Dünyadaki Türk WhatsApp ve Telegram topluluklarını keşfet.
                  </p>
                  <p className="text-lg font-semibold md:text-[1.45rem] md:whitespace-nowrap">
                    Her konuda grupları saniyeler içinde bul.
                  </p>
                  <p className="text-lg font-semibold md:text-[1.45rem] md:whitespace-nowrap">
                    Sana uygun gruba katıl!
                  </p>
                  <p className="text-lg font-semibold md:text-[1.45rem] md:whitespace-nowrap">
                    Grubunu ücretsiz ekle.
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
                      <Label htmlFor="group-name">Grup Adı *</Label>
                      <Input
                        id="group-name"
                        value={groupForm.groupName}
                        onChange={(event) => updateGroupForm("groupName", event.target.value)}
                        placeholder="Örn: Berlin Türk Girişimciler"
                      />
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
          <div className="relative w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-9"
              placeholder="Grup, ülke veya açıklama ara"
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

                  return (
                    <Link
                      key={landing.id}
                      to={`/addwa?group=${encodeURIComponent(landing.id)}`}
                      className="group overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition-transform duration-200 hover:-translate-y-1"
                    >
                      {landing.heroImage ? (
                        <div className="relative">
                          <img
                            src={landing.heroImage}
                            alt={landing.groupName}
                            className="h-44 w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                        </div>
                      ) : null}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <Badge className={`border ${categoryMeta[landing.category].chipClass}`}>
                            <Icon className="mr-1 h-3 w-3" />
                            {categoryMeta[landing.category].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Onaylı</span>
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-foreground group-hover:text-emerald-700">
                          {landing.groupName}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">{landing.tagline}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {landing.city}, {landing.country}
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
