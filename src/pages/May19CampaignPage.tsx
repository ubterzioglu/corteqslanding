import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Calendar,
  Flag,
  Globe,
  Heart,
  Lightbulb,
  Loader2,
  MapPin,
  PartyPopper,
  Sparkles,
  UserPlus,
} from "lucide-react";

import May19CampaignShell from "@/components/may19/May19CampaignShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import globePinsImage from "@/assets/may19-globe-pins.png";
import ideasImage from "@/assets/may19-ideas.jpg";
import momentsImage from "@/assets/may19-moments.jpg";

type Kind = "map_pin" | "idea" | "moment";

type FormState = {
  fullName: string;
  email: string;
  country: string;
  city: string;
  socialHandle: string;
  title: string;
  description: string;
  message: string;
  link: string;
  consent: boolean;
  showOnMap: boolean;
};

const initialFormState: FormState = {
  fullName: "",
  email: "",
  country: "",
  city: "",
  socialHandle: "",
  title: "",
  description: "",
  message: "",
  link: "",
  consent: false,
  showOnMap: true,
};

const ideaExamples = [
  "Global Türk gençleri için mentorluk ağı",
  "Yurt dışındaki Türk işletmeleri haritası",
  "Türk öğrenciler için şehir rehberleri",
  "Diaspora kadın girişimciler ağı",
];

const momentExamples = [
  "Berlin'den 19 Mayıs selamları.",
  "Melbourne'daki Türk gençleriyle bir bayram anı.",
  "Londra'da diaspora buluşmasından kısa bir kesit.",
];

const inputClass = "h-10 rounded-xl border-slate-200 bg-white/90";
const sectionCardClass =
  "rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5";

function ModuleVisual({ kind }: { kind: Kind }) {
  if (kind === "map_pin") {
    return (
      <div className="relative min-h-[280px] overflow-hidden rounded-[1.5rem] border border-rose-200">
        <img src={globePinsImage} alt="Global diaspora haritası" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.64)_75%,rgba(15,23,42,0.88)_100%)]" />
        <div className="absolute right-0 top-0 rounded-bl-2xl bg-rose-500 px-3 py-1 text-[10px] font-extrabold text-white">
          19 MAYIS
        </div>
        <div className="relative flex h-full flex-col justify-end p-5 text-white">
          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-cyan-300/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100">
            Modül 01
          </div>
          <h3 className="mt-3 text-2xl font-black leading-tight">
            Global Haritada
            <span className="block text-rose-300">Kendini İşaretle</span>
          </h3>
          <p className="mt-2 text-xs leading-6 text-slate-200">
            Dünya üzerindeki yerini seç, 19 Mayıs haftasında diaspora akışına kendi şehrini ekle.
          </p>
        </div>
      </div>
    );
  }

  if (kind === "idea") {
    return (
      <div className="relative min-h-[280px] overflow-hidden rounded-[1.5rem] border border-amber-200">
        <img src={ideasImage} alt="19 Mayıs fikirleri" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(120,53,15,0.1)_0%,rgba(120,53,15,0.55)_60%,rgba(120,53,15,0.88)_100%)]" />
        <div className="absolute right-0 top-0 rounded-bl-2xl bg-amber-400 px-3 py-1 text-[10px] font-extrabold text-amber-950">
          COŞKU HAFTASI
        </div>
        <div className="relative flex h-full flex-col justify-end p-5 text-white">
          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-200/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-100">
            Modül 02
          </div>
          <h3 className="mt-3 text-2xl font-black leading-tight">
            Diasporayı Güçlendirecek
            <span className="block text-amber-300">19 Fikir</span>
          </h3>
          <p className="mt-2 text-xs leading-6 text-amber-50">
            Kampanya haftasında ses getirecek fikirleri toplayalım, sonra canlı sistemle yayına alalım.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-[1.5rem] border border-orange-200">
      <img src={momentsImage} alt="19 Mayıs anları" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(76,5,25,0.12)_0%,rgba(76,5,25,0.55)_58%,rgba(76,5,25,0.88)_100%)]" />
      <div className="absolute right-0 top-0 rounded-bl-2xl bg-orange-500 px-3 py-1 text-[10px] font-extrabold text-white">
        BAYRAM ANI
      </div>
      <div className="relative flex h-full flex-col justify-end p-5 text-white">
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          Modül 03
        </div>
        <h3 className="mt-3 text-2xl font-black leading-tight">
          19 Mayıs ve
          <span className="block text-amber-300">Diaspora Anını Gönder</span>
        </h3>
        <p className="mt-2 text-xs leading-6 text-orange-50">
          Fotoğrafını, videonu ya da kısa notunu şimdi hazırla; backend bağlandığında doğrudan paylaşabilelim.
        </p>
      </div>
    </div>
  );
}

export default function May19CampaignPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Kind>("map_pin");
  const [forms, setForms] = useState<Record<Kind, FormState>>({
    map_pin: initialFormState,
    idea: initialFormState,
    moment: initialFormState,
  });
  const [submittingKind, setSubmittingKind] = useState<Kind | null>(null);

  const statItems = useMemo(
    () => [
      { icon: MapPin, label: "5 Kıta" },
      { icon: Calendar, label: "19 Mayıs Bayram Haftası" },
      { icon: UserPlus, label: "Frontend Demo Fazı" },
    ],
    [],
  );

  const updateForm = <K extends keyof FormState>(kind: Kind, field: K, value: FormState[K]) => {
    setForms((current) => ({
      ...current,
      [kind]: {
        ...current[kind],
        [field]: value,
      },
    }));
  };

  const handleDisabledSubmit = (kind: Kind) => {
    setSubmittingKind(kind);
    window.setTimeout(() => {
      setSubmittingKind((current) => (current === kind ? null : current));
      toast({
        title: "Yakında aktif",
        description: "19 Mayıs gönderim altyapısı bir sonraki backend fazında açılacak.",
      });
    }, 250);
  };

  const renderForm = (kind: Kind) => {
    const form = forms[kind];

    return (
      <div className="grid grid-cols-2 gap-3">
        {kind === "idea" ? (
          <details className="col-span-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-slate-700">
            <summary className="cursor-pointer font-semibold text-amber-800">Fikir örnekleri</summary>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {ideaExamples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </details>
        ) : null}

        {kind === "moment" ? (
          <details className="col-span-2 rounded-xl border border-orange-200 bg-orange-50/80 px-3 py-2 text-xs text-slate-700">
            <summary className="cursor-pointer font-semibold text-orange-800">Örnek içerikler</summary>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {momentExamples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </details>
        ) : null}

        <div className={kind === "map_pin" || kind === "moment" ? "col-span-2" : ""}>
          <Label className="mb-1.5 block text-xs font-semibold text-slate-600">Ad Soyad</Label>
          <Input
            className={inputClass}
            value={form.fullName}
            onChange={(event) => updateForm(kind, "fullName", event.target.value)}
          />
        </div>
        <div className={kind === "idea" ? "" : "col-span-2 sm:col-span-1"}>
          <Label className="mb-1.5 block text-xs font-semibold text-slate-600">E-posta</Label>
          <Input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(event) => updateForm(kind, "email", event.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs font-semibold text-slate-600">Ülke</Label>
          <Input
            className={inputClass}
            value={form.country}
            onChange={(event) => updateForm(kind, "country", event.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs font-semibold text-slate-600">Şehir</Label>
          <Input
            className={inputClass}
            value={form.city}
            onChange={(event) => updateForm(kind, "city", event.target.value)}
          />
        </div>

        {kind !== "map_pin" ? (
          <div className="col-span-2">
            <Label className="mb-1.5 block text-xs font-semibold text-slate-600">
              {kind === "idea" ? "Fikir başlığı" : "İçerik başlığı"}
            </Label>
            <Input
              className={inputClass}
              value={form.title}
              onChange={(event) => updateForm(kind, "title", event.target.value)}
            />
          </div>
        ) : null}

        <div className="col-span-2">
          <Label className="mb-1.5 block text-xs font-semibold text-slate-600">
            {kind === "map_pin" ? "Kısa mesaj" : kind === "idea" ? "Fikir açıklaması" : "Kısa açıklama"}
          </Label>
          <Textarea
            rows={3}
            className="rounded-xl border-slate-200 bg-white/90 text-sm"
            value={kind === "map_pin" ? form.message : form.description}
            onChange={(event) =>
              updateForm(kind, kind === "map_pin" ? "message" : "description", event.target.value)
            }
          />
        </div>

        {kind === "idea" ? (
          <div className="col-span-2">
            <Label className="mb-1.5 block text-xs font-semibold text-slate-600">Diasporayı nasıl güçlendirir?</Label>
            <Textarea
              rows={2}
              className="rounded-xl border-slate-200 bg-white/90 text-sm"
              value={form.message}
              onChange={(event) => updateForm(kind, "message", event.target.value)}
            />
          </div>
        ) : null}

        {kind !== "map_pin" ? (
          <div className="col-span-2">
            <Label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Google Drive veya sosyal medya post linki
            </Label>
            <Input
              className={inputClass}
              value={form.link}
              onChange={(event) => updateForm(kind, "link", event.target.value)}
              placeholder="https://drive.google.com/... veya https://instagram.com/p/..."
            />
          </div>
        ) : null}

        <div className="col-span-2">
          <Label className="mb-1.5 block text-xs font-semibold text-slate-600">Sosyal medya</Label>
          <Input
            className={inputClass}
            value={form.socialHandle}
            onChange={(event) => updateForm(kind, "socialHandle", event.target.value)}
            placeholder="@kullaniciadi"
          />
        </div>

        <label className="col-span-2 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-700">
          <Checkbox
            checked={kind === "map_pin" ? form.showOnMap : form.consent}
            onCheckedChange={(checked) =>
              updateForm(kind, kind === "map_pin" ? "showOnMap" : "consent", Boolean(checked))
            }
            className="mt-0.5"
          />
          <span>
            {kind === "map_pin"
              ? "Backend açıldığında harita üzerinde görünmek istiyorum."
              : "Bu içeriğin CorteQS tarafından incelenip kampanya içinde kullanılmasına izin veriyorum."}
          </span>
        </label>

        <div className="col-span-2 flex flex-wrap gap-3 pt-2">
          <Button
            type="button"
            size="sm"
            onClick={() => handleDisabledSubmit(kind)}
            className={
              kind === "map_pin"
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
                : kind === "idea"
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-orange-500 text-white hover:bg-orange-600"
            }
          >
            {submittingKind === kind ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {kind === "map_pin" ? "Haritada Yerimi İşaretle" : kind === "idea" ? "Fikrimi Gönder" : "Anımı Gönder"}
          </Button>

          <Button asChild type="button" variant="outline" size="sm" className="rounded-full">
            <Link to="/form">Ön Kayıt Formu</Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <May19CampaignShell
      eyebrow="19 MAYIS ATATÜRK'Ü ANMA, GENÇLİK VE SPOR BAYRAMI"
      title={
        <>
          19 Mayıs
          <span className="block bg-[linear-gradient(135deg,#fda4af_0%,#fdba74_46%,#67e8f9_100%)] bg-clip-text text-transparent">
            Global Diaspora Buluşması
          </span>
        </>
      }
      description="Bayram coşkusunu dünyanın dört bir yanındaki Türklerle aynı ekranda topluyoruz. Haritada yerini işaretle, diasporayı güçlendirecek fikrini paylaş ve 19 Mayıs anını bir sonraki yayına hazırlamaya başla."
      primaryCta={{ label: "Modüllere İn", to: "/19051919#modules" }}
      secondaryCta={{ label: "Global Harita", to: "/19051919/harita" }}
    >
      <main className="container mx-auto px-4 pb-16 pt-10 lg:px-6 lg:pb-20">
        <section className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {statItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-rose-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="modules" className="mx-auto mt-10 max-w-5xl">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Kind)}>
            <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3">
              <TabsTrigger
                value="map_pin"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
              >
                <span className="flex flex-col items-center gap-1 text-center">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-semibold leading-tight">1. Dünya Üzerinde Yerini İşaretle</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="idea"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <span className="flex flex-col items-center gap-1 text-center">
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-xs font-semibold leading-tight">2. 19 Kelimelik Fikrini Gönder</span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="moment"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <span className="flex flex-col items-center gap-1 text-center">
                  <Camera className="h-4 w-4" />
                  <span className="text-xs font-semibold leading-tight">3. 19 Mayıs Anını Paylaş</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map_pin">
              <div className={`${sectionCardClass} mt-4 grid gap-5 md:grid-cols-[minmax(260px,0.94fr)_minmax(0,1.12fr)]`}>
                <ModuleVisual kind="map_pin" />
                {renderForm("map_pin")}
              </div>
            </TabsContent>

            <TabsContent value="idea">
              <div className={`${sectionCardClass} mt-4 grid gap-5 md:grid-cols-[minmax(260px,0.94fr)_minmax(0,1.12fr)]`}>
                <ModuleVisual kind="idea" />
                {renderForm("idea")}
              </div>
            </TabsContent>

            <TabsContent value="moment">
              <div className={`${sectionCardClass} mt-4 grid gap-5 md:grid-cols-[minmax(260px,0.94fr)_minmax(0,1.12fr)]`}>
                <ModuleVisual kind="moment" />
                {renderForm("moment")}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(30,41,59,0.96)_42%,rgba(17,94,89,0.94)_100%)] px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                <Flag className="h-3.5 w-3.5 text-rose-300" />
                19 Mayıs Haftası
              </div>
              <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                Frontend hazır, veri akışı bir sonraki fazda eklenecek.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Şu anda kampanya deneyimini görüyor, modülleri inceliyor ve akışın nasıl çalışacağını test ediyoruz.
                Admin moderasyonu, veritabanı ve canlı yayın bağlantıları ayrı backend fazında açılacak.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                <Link to="/19051919/harita">
                  <Globe className="mr-2 h-4 w-4" />
                  Haritayı Aç
                </Link>
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                onClick={() =>
                  toast({
                    title: "Backend fazı bekleniyor",
                    description: "Canlı pinler, yükleme ve kayıt verisi sonraki adımda bağlanacak.",
                  })
                }
              >
                <PartyPopper className="mr-2 h-4 w-4" />
                Sonraki Faz Notu
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <MapPin className="h-5 w-5 text-cyan-600" />
            <h3 className="mt-3 text-lg font-bold text-slate-950">Harita Modülü</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Statik globe deneyimiyle şehirleri gösteriyoruz; approved pinler ikinci aşamada bağlanacak.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="mt-3 text-lg font-bold text-slate-950">Fikir Havuzu</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Diasporayı güçlendirecek fikirler için arayüz hazır; veri kayıt ve moderasyon sonra açılacak.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <Heart className="h-5 w-5 text-rose-500" />
            <h3 className="mt-3 text-lg font-bold text-slate-950">Anı Paylaşımı</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Fotoğraf ve video akışı için link tabanlı UX burada hazırlandı; upload/storage sonra eklenecek.
            </p>
          </div>
        </section>
      </main>
    </May19CampaignShell>
  );
}
