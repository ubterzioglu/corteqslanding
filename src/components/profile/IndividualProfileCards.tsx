import { type ComponentType, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Linkedin,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INDIVIDUAL_FEATURE_KEYS, type IndividualFeatureMeta } from "@/lib/features";
import type { IndividualProfileDetailsCore } from "@/lib/individual-profile";

type IndividualProfileCardsProps = {
  details: IndividualProfileDetailsCore;
  visibleModules: IndividualFeatureMeta[];
  featureSources: Record<string, string>;
  isFeaturesLoading: boolean;
  featureErrorMessage: string | null;
};

type TabItem = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const ChipList = ({ items, emptyLabel }: { items: string[]; emptyLabel: string }) => {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} variant="outline" className="text-[11px]">
          {item}
        </Badge>
      ))}
    </div>
  );
};

const PlaceList = ({ items, emptyLabel }: { items: { label: string; period: string }[]; emptyLabel: string }) => {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <p key={`${item.label}-${item.period}`} className="text-xs text-muted-foreground">
          {item.period ? `${item.label} (${item.period})` : item.label}
        </p>
      ))}
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <p className="text-sm">
    <span className="font-medium">{label}:</span> {value}
  </p>
);

const presenceLabelMap = {
  online: "Online",
  cadde: "Cadde'de",
  offline: "Offline",
} as const;

const featureTabMap = {
  [INDIVIDUAL_FEATURE_KEYS.about]: { key: "about", label: "Hakkinda", icon: Globe },
  [INDIVIDUAL_FEATURE_KEYS.serviceRequests]: { key: "service-requests", label: "Hizmet Talepleri", icon: FileText },
  [INDIVIDUAL_FEATURE_KEYS.events]: { key: "events", label: "Etkinlikler", icon: Calendar },
  [INDIVIDUAL_FEATURE_KEYS.follows]: { key: "following", label: "Takip", icon: Users },
  [INDIVIDUAL_FEATURE_KEYS.whatsapp]: { key: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  [INDIVIDUAL_FEATURE_KEYS.messages]: { key: "messages", label: "Mesaj Kutusu", icon: MessageSquare },
  [INDIVIDUAL_FEATURE_KEYS.activity]: { key: "activity", label: "Aktivite", icon: Calendar },
} as const;

const visibleStateLabel = {
  open: "Profil Acik",
  locked: "Profil Kilitli",
} as const;

export const IndividualProfileCards = ({
  details,
  visibleModules,
  featureSources,
  isFeaturesLoading,
  featureErrorMessage,
}: IndividualProfileCardsProps) => {
  const [activeTab, setActiveTab] = useState<string>("settings");

  const moduleKeySet = useMemo(() => new Set(visibleModules.map((module) => module.key)), [visibleModules]);
  const shouldShowFeatureTabs = !isFeaturesLoading && !featureErrorMessage;

  const tabs = useMemo(() => {
    const next: TabItem[] = [];

    if (shouldShowFeatureTabs) {
      Object.entries(featureTabMap).forEach(([featureKey, tabMeta]) => {
        if (moduleKeySet.has(featureKey)) {
          next.push(tabMeta);
        }
      });
    }

    next.push({ key: "settings", label: "Profil Ayarlari", icon: Settings });
    return next;
  }, [moduleKeySet, shouldShowFeatureTabs]);

  useEffect(() => {
    if (tabs.some((tab) => tab.key === activeTab)) return;
    setActiveTab(tabs[0]?.key ?? "settings");
  }, [activeTab, tabs]);

  const front = details.frontCard;
  const detail = details.detailCard;
  const panel = details.controlPanel;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
              {details.displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-[240px] flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xl font-semibold">{details.displayName}</p>
                <Badge variant="outline">{presenceLabelMap[details.presenceStatus]}</Badge>
                <Badge variant="outline">{visibleStateLabel[details.visibilityStatus]}</Badge>
                {details.jobSeeking ? <Badge>Is Ariyorum</Badge> : null}
                {front.corteqsPassport ? (
                  <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 gap-1">
                    <ShieldCheck className="h-3 w-3" /> CorteQS Pasaportu
                  </Badge>
                ) : null}
                {panel.profileVisible ? (
                  <Badge variant="secondary" className="gap-1">
                    <Eye className="h-3 w-3" /> Gorunur
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <EyeOff className="h-3 w-3" /> Gizli
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{details.tagline}</p>
              {front.worldMessage ? (
                <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">{front.worldMessage}</p>
              ) : null}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                <span>
                  <strong className="text-foreground">{details.followerCount}</strong> takipci
                </span>
                <span>
                  <strong className="text-foreground">{details.followingCount}</strong> takip
                </span>
                <span>
                  <strong className="text-foreground">{details.eventCount}</strong> etkinlik
                </span>
                <span>{[details.activeCity, details.activeCountry].filter(Boolean).join(", ") || "Konum girilmedi"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {front.linkedinUrl && front.linkedinVisible ? (
              <a
                href={front.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-primary hover:bg-muted"
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </a>
            ) : null}
            {front.cvDoc ? (
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> {front.cvDoc.name || "CV"}
              </span>
            ) : null}
            {front.presentationDoc ? (
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> {front.presentationDoc.name || "Sunum"}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.key} value={tab.key} className="gap-1.5 text-xs">
                    <Icon className="h-3.5 w-3.5" /> {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {isFeaturesLoading ? (
              <p className="mt-3 text-xs text-muted-foreground">Feature bilgileri yukleniyor...</p>
            ) : null}
            {featureErrorMessage ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Feature verisi alinamadi. Guvenli mod nedeniyle sadece Profil Ayarlari goruntuleniyor.
              </p>
            ) : null}

            <TabsContent value="about" className="mt-4 space-y-3">
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hakkinda</p>
                <p className="text-sm text-muted-foreground">{detail.aboutText}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Diller</p>
                  <ChipList items={detail.languages} emptyLabel="Dil eklenmedi" />
                </div>
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Yasadigi Ulkeler</p>
                  <PlaceList items={detail.countriesLived} emptyLabel="Kayit yok" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="service-requests" className="mt-4">
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hizmet Talepleri</p>
                <ChipList items={detail.serviceRequests} emptyLabel="Aktif talep yok" />
                <p className="mt-3 text-[11px] text-muted-foreground">
                  kaynak: {featureSources[INDIVIDUAL_FEATURE_KEYS.serviceRequests] ?? "fallback"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <div className="space-y-3 rounded-md border p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Etkinlikler</p>
                <ChipList items={detail.events} emptyLabel="Etkinlik kaydi yok" />
                {detail.recentEvents.length > 0 ? (
                  <div className="space-y-1">
                    {detail.recentEvents.map((event) => (
                      <p key={`${event.title}-${event.date}`} className="text-xs text-muted-foreground">
                        {event.title} - {event.date} {event.city ? `(${event.city})` : ""}
                      </p>
                    ))}
                  </div>
                ) : null}
                <p className="text-[11px] text-muted-foreground">
                  kaynak: {featureSources[INDIVIDUAL_FEATURE_KEYS.events] ?? "fallback"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="following" className="mt-4">
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Takip</p>
                <ChipList items={detail.followsPreview} emptyLabel="Takip edilen profil yok" />
                <p className="mt-3 text-[11px] text-muted-foreground">
                  kaynak: {featureSources[INDIVIDUAL_FEATURE_KEYS.follows] ?? "fallback"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="mt-4">
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">WhatsApp</p>
                <ChipList items={detail.whatsappGroups} emptyLabel="Grup bilgisi yok" />
                <p className="mt-3 text-[11px] text-muted-foreground">
                  kaynak: {featureSources[INDIVIDUAL_FEATURE_KEYS.whatsapp] ?? "fallback"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="mt-4">
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mesaj Kutusu</p>
                <p className="text-xs text-muted-foreground">
                  Mesajlasma ozeti bu fazda read-only gosterilir. Detayli aksiyonlar sonraki fazda acilacak.
                </p>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  kaynak: {featureSources[INDIVIDUAL_FEATURE_KEYS.messages] ?? "fallback"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Aktivite</p>
                <ChipList items={detail.activities} emptyLabel="Aktivite bulunmuyor" />
                <p className="mt-3 text-[11px] text-muted-foreground">
                  kaynak: {featureSources[INDIVIDUAL_FEATURE_KEYS.activity] ?? "fallback"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4 space-y-3">
              <div className="grid gap-2 rounded-md border p-3 md:grid-cols-2">
                <Field label="Ulke" value={panel.country} />
                <Field label="Sehir" value={panel.city} />
                <Field label="Kac Yildir Burada" value={panel.yearsInCity} />
                <Field label="Telefon" value={panel.phone} />
                <Field label="Dogum Tarihi" value={panel.birthDate} />
                <Field label="Egitim" value={panel.education} />
                <Field label="Okul" value={panel.school} />
                <Field label="LinkedIn" value={panel.linkedin} />
              </div>
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bio / Hakkinda</p>
                <p className="text-sm text-muted-foreground">{panel.bio}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Panel Aksiyonlari</p>
                <ChipList items={panel.navActions} emptyLabel="Aksiyon tanimi yok" />
              </div>
              <div className="rounded-md border p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profil Tamamlama Adimlari</p>
                <div className="space-y-1">
                  {panel.profileSteps.map((step) => (
                    <p key={step.label} className="text-xs text-muted-foreground">
                      {step.completed ? "Tamam" : "Bekliyor"} - {step.label}
                    </p>
                  ))}
                </div>
              </div>
              {detail.relocation.enabled ? (
                <div className="rounded-md border p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tasinma Plani</p>
                  <p className="text-xs text-muted-foreground">
                    {[detail.relocation.city, detail.relocation.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
