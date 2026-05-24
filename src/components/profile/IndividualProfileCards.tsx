import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IndividualFeatureMeta } from "@/lib/features";
import type { IndividualProfileDetailsCore } from "@/lib/individual-profile";

type IndividualProfileCardsProps = {
  details: IndividualProfileDetailsCore;
  visibleModules: IndividualFeatureMeta[];
  featureSources: Record<string, string>;
  isFeaturesLoading: boolean;
  featureErrorMessage: string | null;
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

const visibilityLabelMap = {
  open: "Profil Açık",
  locked: "Profil Kilitli",
} as const;

export const IndividualProfileCards = ({
  details,
  visibleModules,
  featureSources,
  isFeaturesLoading,
  featureErrorMessage,
}: IndividualProfileCardsProps) => {
  const front = details.frontCard;
  const detail = details.detailCard;
  const panel = details.controlPanel;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Ön Kart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {details.displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-[220px] flex-1 space-y-2">
              <p className="text-lg font-semibold">{details.displayName}</p>
              <p className="text-sm text-muted-foreground">{details.tagline}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{presenceLabelMap[details.presenceStatus]}</Badge>
                <Badge variant="outline">{visibilityLabelMap[details.visibilityStatus]}</Badge>
                {details.jobSeeking ? <Badge>İş Arıyorum</Badge> : null}
                {details.mentorOptIn ? <Badge variant="secondary">Gönüllü Mentör</Badge> : null}
              </div>
            </div>
          </div>

          <div className="grid gap-2 text-sm md:grid-cols-2">
            <Field label="Pasaport" value={front.passportStatus} />
            <Field label="Durum" value={details.statusText} />
            <Field label="Bulunduğu Yer" value={`${details.activeCity}, ${details.activeCountry}`} />
            <Field label="Memleket" value={details.hometown} />
            <Field label="Takipçi" value={`${details.followerCount}`} />
            <Field label="Takip" value={`${details.followingCount}`} />
            <Field label="Etkinlik" value={`${details.eventCount}`} />
            <Field label="Takip Durumu" value={front.followRequestNote} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Önceki Şehirler</p>
              <PlaceList items={front.previousCities} emptyLabel="Kayıt yok" />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Mini Takvim</p>
              {front.miniEvent ? (
                <p className="text-sm">{`${front.miniEvent.title} - ${front.miniEvent.date}`}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Yakın etkinlik bulunmuyor</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{front.profilePreviewNote}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Detay Kart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-md border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hakkında</p>
            <p className="text-sm text-muted-foreground">{detail.aboutText}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Diller</p>
              <ChipList items={detail.languages} emptyLabel="Dil bilgisi eklenmemiş" />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">İlgi Alanları</p>
              <ChipList items={detail.interests} emptyLabel="İlgi alanı yok" />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Yaşanılan Ülkeler</p>
              <PlaceList items={detail.livedCountries} emptyLabel="Ülke geçmişi yok" />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Son 3 Aktivite</p>
              <PlaceList
                items={detail.activities.map((activity) => ({ label: activity, period: "" }))}
                emptyLabel="Aktivite bulunmuyor"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hizmet Talepleri</p>
              <ChipList items={detail.serviceRequests} emptyLabel="Talep bulunmuyor" />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Etkinlikler</p>
              <ChipList items={detail.events} emptyLabel="Etkinlik bulunmuyor" />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Takip</p>
              <ChipList items={detail.followsPreview} emptyLabel="Takip listesi boş" />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">WhatsApp</p>
              <ChipList items={detail.whatsappGroups} emptyLabel="Grup bilgisi yok" />
            </div>
          </div>

          <div className="rounded-md border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Feature Modülleri</p>
            {isFeaturesLoading ? <p className="text-xs text-muted-foreground">Modüller yükleniyor...</p> : null}
            {!isFeaturesLoading && featureErrorMessage ? (
              <p className="text-xs text-muted-foreground">Feature verisi alınamadı, modüller güvenli modda gizlenmiştir.</p>
            ) : null}
            {!isFeaturesLoading && !featureErrorMessage && visibleModules.length === 0 ? (
              <p className="text-xs text-muted-foreground">Aktif modül bulunmuyor.</p>
            ) : null}
            {!isFeaturesLoading && !featureErrorMessage && visibleModules.length > 0 ? (
              <div className="space-y-2">
                {visibleModules.map((feature) => (
                  <div key={feature.key} className="flex items-start justify-between gap-3 rounded-md border p-2">
                    <div>
                      <p className="text-sm font-medium">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      kaynak: {featureSources[feature.key] ?? "fallback"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : null}
            <p className="mt-3 text-xs text-muted-foreground">
              CV İste: {detail.cvRequestEnabled ? "Açık" : "Kapalı"} | Wishlist:{" "}
              {detail.wishlistStatus === "v2" ? "V2'de eklenecek" : "Gizli"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Kontrol Paneli & Profil Ayarları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{panel.panelTagline}</Badge>
            <Badge variant="outline">{details.phoneVerified ? "Telefon Doğrulandı" : "Telefon Doğrulanmadı"}</Badge>
            {panel.panelBadges.map((badge) => (
              <Badge key={badge} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{panel.reminder}</p>

          <div className="rounded-md border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Panel Aksiyonları</p>
            <ChipList items={panel.navActions} emptyLabel="Aksiyon tanımı yok" />
          </div>

          <div className="grid gap-2 rounded-md border p-3 md:grid-cols-2">
            <Field label="Ülke" value={panel.country} />
            <Field label="Şehir" value={panel.city} />
            <Field label="Kaç Yıldır Burada" value={panel.yearsInCity} />
            <Field label="Telefon" value={panel.phone} />
            <Field label="Doğum Tarihi" value={panel.birthDate} />
            <Field label="Öğrenim Durumu" value={panel.education} />
            <Field label="Kurum" value={panel.institution} />
            <Field label="LinkedIn" value={panel.linkedin} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bio / Hakkında</p>
              <p className="text-sm text-muted-foreground">{panel.bio}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">İlgi / Yetenek</p>
              <ChipList items={panel.skills} emptyLabel="Yetenek etiketi yok" />
            </div>
          </div>

          <div className="rounded-md border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profil Tamamlama Adımları</p>
            <div className="space-y-1">
              {panel.profileSteps.map((step) => (
                <p key={step.label} className="text-sm">
                  {step.completed ? "Tamam" : "Bekliyor"} - {step.label}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
