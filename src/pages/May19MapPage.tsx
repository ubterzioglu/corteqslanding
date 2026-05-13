import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { geoDistance } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Line,
  Marker,
  Sphere,
} from "react-simple-maps";
import { ArrowLeft, Globe2, MapPin, Pause, Play, Sparkles, UserPlus } from "lucide-react";

import May19CampaignShell from "@/components/may19/May19CampaignShell";
import { Button } from "@/components/ui/button";
import ataturkMarker from "@/assets/ataturk-marker.png";

type SeedCity = {
  name: string;
  coords: [number, number];
  country: string;
};

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const TURKEY: [number, number] = [32.85, 39.93];
const SAMSUN: [number, number] = [36.33, 41.29];
const TURQUOISE = "hsl(188 78% 43%)";
const TURQUOISE_LIGHT = "hsl(188 85% 63%)";
const ROSE = "hsl(351 83% 61%)";
const NIGHT = "hsl(222 47% 12%)";

const seedCities: SeedCity[] = [
  { name: "Berlin", coords: [13.4, 52.52], country: "Almanya" },
  { name: "Londra", coords: [-0.13, 51.51], country: "Birleşik Krallık" },
  { name: "Paris", coords: [2.35, 48.85], country: "Fransa" },
  { name: "Amsterdam", coords: [4.9, 52.37], country: "Hollanda" },
  { name: "Brüksel", coords: [4.35, 50.85], country: "Belçika" },
  { name: "Stockholm", coords: [18.07, 59.33], country: "İsveç" },
  { name: "Doha", coords: [51.53, 25.29], country: "Katar" },
  { name: "Dubai", coords: [55.3, 25.2], country: "BAE" },
  { name: "New York", coords: [-74.0, 40.71], country: "ABD" },
  { name: "Toronto", coords: [-79.38, 43.65], country: "Kanada" },
  { name: "Sao Paulo", coords: [-46.63, -23.55], country: "Brezilya" },
  { name: "Tokyo", coords: [139.69, 35.69], country: "Japonya" },
  { name: "Seul", coords: [126.98, 37.57], country: "Güney Kore" },
  { name: "Singapur", coords: [103.82, 1.35], country: "Singapur" },
  { name: "Sidney", coords: [151.21, -33.87], country: "Avustralya" },
  { name: "Melbourne", coords: [144.96, -37.81], country: "Avustralya" },
];

function colorForGeography(id: string) {
  const palette = [
    "hsl(190 62% 38%)",
    "hsl(16 73% 50%)",
    "hsl(43 84% 52%)",
    "hsl(268 51% 53%)",
    "hsl(215 66% 52%)",
    "hsl(335 63% 53%)",
    "hsl(154 51% 41%)",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

export default function May19MapPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [rotation, setRotation] = useState<[number, number, number]>([-28, -14, 0]);
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const tick = (time: number) => {
      if (!lastRef.current) {
        lastRef.current = time;
      }

      const delta = time - lastRef.current;
      lastRef.current = time;

      if (!paused && !hovered) {
        setRotation((current) => [((current[0] + delta * 0.012) % 360) as number, current[1], current[2]]);
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [hovered, paused]);

  const arcs = useMemo(
    () => seedCities.map((city, index) => ({ ...city, delay: (index * 180) % 5000 })),
    [],
  );

  const center: [number, number] = [-rotation[0], -rotation[1]];
  const isVisible = (coords: [number, number]) => geoDistance(coords, center) < Math.PI / 2 - 0.05;

  return (
    <May19CampaignShell
      eyebrow="GLOBAL DIASPORA HARİTASI"
      title={
        <>
          19 Mayıs
          <span className="block bg-[linear-gradient(135deg,#67e8f9_0%,#fdba74_52%,#fda4af_100%)] bg-clip-text text-transparent">
            Canlı Globe Deneyimi
          </span>
        </>
      }
      description="Frontend fazında dünya kendi ekseninde dönerken diaspora şehirleri kampanya estetiğiyle görünür oluyor. Canlı approved pinler ve gerçek katılımcı verisi bir sonraki backend fazında eklenecek."
      primaryCta={{ label: "Ana Kampanyaya Dön", to: "/19051919" }}
      secondaryCta={{ label: "Modüllere Git", to: "/19051919#modules" }}
    >
      <main className="relative overflow-hidden bg-[linear-gradient(180deg,#050816_0%,#071422_52%,#08111d_100%)] text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[38rem] w-[38rem] rounded-full bg-rose-500/12 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-45" aria-hidden="true">
            <defs>
              <pattern id="stars" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="30" r="0.7" fill="white" opacity="0.65" />
                <circle cx="80" cy="60" r="0.45" fill="white" opacity="0.4" />
                <circle cx="48" cy="100" r="0.5" fill="white" opacity="0.55" />
                <circle cx="100" cy="22" r="0.35" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)" />
          </svg>
        </div>

        <div className="container relative mx-auto px-4 pb-6 pt-8 lg:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link to="/19051919" className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" />
                19 Mayıs ana kampanyasına dön
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                Demo Globe
              </div>
              <h2 className="mt-4 text-2xl font-black sm:text-4xl">
                Global Diaspora Haritası
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Şehirlerin üzerine gelerek hangi coğrafyalarda diaspora akışını görünür kılacağımızı izleyin.
                Şimdilik demo pinlerle çalışıyor; sonraki fazda approved katılımcılar eklenecek.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="sm"
                onClick={() => setPaused((current) => !current)}
                className="rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                {paused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                {paused ? "Döndür" : "Durdur"}
              </Button>
              <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200">
                16 demo şehir · backend bağlantısı bekleniyor
              </div>
            </div>
          </div>
        </div>

        <section className="relative mx-auto w-full max-w-[1600px] px-3 pb-12 sm:px-4 lg:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="absolute left-4 top-4 z-10 max-w-xs">
              <Link to="/19051919#modules" className="block">
                <div className="rounded-2xl border border-cyan-300/30 bg-[linear-gradient(135deg,rgba(34,211,238,0.24)_0%,rgba(59,130,246,0.14)_58%,rgba(244,63,94,0.18)_100%)] px-4 py-3 shadow-lg transition hover:scale-[1.01]">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                    <UserPlus className="h-3.5 w-3.5" />
                    Haritaya Katıl
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-5 text-white">
                    Demo akışı gördükten sonra ana kampanya ekranına dönüp modülleri inceleyin.
                  </p>
                </div>
              </Link>
            </div>

            <div className="h-[72vh] min-h-[560px] w-full">
              <ComposableMap
                projection="geoOrthographic"
                projectionConfig={{ scale: 335, rotate: rotation }}
                style={{ width: "100%", height: "100%" }}
              >
                <defs>
                  <radialGradient id="may19-atmo" cx="50%" cy="50%" r="50%">
                    <stop offset="84%" stopColor={TURQUOISE} stopOpacity="0" />
                    <stop offset="100%" stopColor={TURQUOISE} stopOpacity="0.55" />
                  </radialGradient>
                  <radialGradient id="may19-ocean" cx="35%" cy="35%" r="75%">
                    <stop offset="0%" stopColor="hsl(217 44% 21%)" />
                    <stop offset="100%" stopColor="hsl(220 46% 10%)" />
                  </radialGradient>
                </defs>

                <Sphere fill="url(#may19-atmo)" stroke="none" />
                <Sphere fill="url(#may19-ocean)" stroke="hsl(188 78% 43% / 0.28)" strokeWidth={0.6} />
                <Graticule stroke="hsl(188 78% 43% / 0.12)" strokeWidth={0.45} />

                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const baseColor = colorForGeography(String(geo.rsmKey || geo.id || geo.properties?.name || ""));
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={baseColor}
                          stroke="hsl(0 0% 100% / 0.34)"
                          strokeWidth={0.45}
                          style={{
                            default: {
                              outline: "none",
                              opacity: 0.82,
                              transition: "all 0.35s ease",
                            } as CSSProperties,
                            hover: {
                              outline: "none",
                              opacity: 1,
                              stroke: "white",
                              strokeWidth: 1.1,
                              filter: "drop-shadow(0 0 7px rgba(255,255,255,0.55))",
                              transform: "scale(1.04)",
                              cursor: "pointer",
                            } as CSSProperties,
                            pressed: { outline: "none" } as CSSProperties,
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {arcs.map((city) =>
                  isVisible(city.coords) ? (
                    <Line
                      key={`arc-${city.name}`}
                      from={TURKEY}
                      to={city.coords}
                      stroke={TURQUOISE_LIGHT}
                      strokeWidth={0.75}
                      strokeOpacity={0.42}
                      strokeLinecap="round"
                      strokeDasharray="2 4"
                      style={
                        {
                          animation: "may19DashFlow 6s linear infinite",
                          animationDelay: `${city.delay}ms`,
                        } as CSSProperties
                      }
                    />
                  ) : null,
                )}

                {isVisible(TURKEY) ? (
                  <Marker coordinates={TURKEY}>
                    <circle r={9} fill={ROSE} opacity={0.24}>
                      <animate attributeName="r" from="6" to="22" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.55" to="0" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle r={5} fill={ROSE} stroke="white" strokeWidth={1.5} />
                    <text
                      y={-12}
                      textAnchor="middle"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        fontWeight: 800,
                        fill: "white",
                        paintOrder: "stroke",
                        stroke: NIGHT,
                        strokeWidth: 3,
                      }}
                    >
                      Türkiye
                    </text>
                  </Marker>
                ) : null}

                {isVisible(SAMSUN) ? (
                  <Marker coordinates={SAMSUN}>
                    <circle r={14} fill={ROSE} opacity={0.2}>
                      <animate attributeName="r" from="10" to="26" dur="2.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    <circle r={11} fill="white" stroke={ROSE} strokeWidth={1.5} />
                    <image href={ataturkMarker} x={-9} y={-10} width={18} height={18} preserveAspectRatio="xMidYMid meet" />
                    <text
                      y={22}
                      textAnchor="middle"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 10,
                        fontWeight: 800,
                        fill: "white",
                        paintOrder: "stroke",
                        stroke: NIGHT,
                        strokeWidth: 3,
                      }}
                    >
                      Samsun · 19 Mayıs 1919
                    </text>
                  </Marker>
                ) : null}

                {arcs.map((city, index) =>
                  isVisible(city.coords) ? (
                    <Marker
                      key={city.name}
                      coordinates={city.coords}
                      onMouseEnter={() => setHovered(city.name)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <circle r={3} fill={TURQUOISE} opacity={0.35}>
                        <animate
                          attributeName="r"
                          from="2"
                          to="10"
                          dur="2.6s"
                          begin={`${(index % 12) * 0.18}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.55"
                          to="0"
                          dur="2.6s"
                          begin={`${(index % 12) * 0.18}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        r={hovered === city.name ? 3.6 : 2.5}
                        fill={hovered === city.name ? "white" : TURQUOISE_LIGHT}
                        stroke="white"
                        strokeWidth={0.7}
                        style={{ cursor: "pointer", transition: "r 0.2s ease" }}
                      />
                      <text
                        x={5}
                        y={-5}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: hovered === city.name ? 11 : 8.5,
                          fontWeight: hovered === city.name ? 800 : 600,
                          fill: hovered === city.name ? "white" : "hsl(0 0% 92%)",
                          paintOrder: "stroke",
                          stroke: NIGHT,
                          strokeWidth: hovered === city.name ? 3 : 2.2,
                          pointerEvents: "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {city.name}
                      </text>
                      {hovered === city.name ? (
                        <text
                          x={5}
                          y={6}
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 8,
                            fontWeight: 700,
                            fill: TURQUOISE_LIGHT,
                            paintOrder: "stroke",
                            stroke: NIGHT,
                            strokeWidth: 2.2,
                            pointerEvents: "none",
                          }}
                        >
                          {city.country}
                        </text>
                      ) : null}
                    </Marker>
                  ) : null,
                )}
              </ComposableMap>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-4 text-xs text-slate-300">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.85)]" />
                  Türkiye
                </span>
                <span className="inline-flex items-center gap-2">
                  <img src={ataturkMarker} alt="" className="h-3.5 w-3.5" />
                  Samsun · 19 Mayıs 1919
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.85)]" />
                  Diaspora şehri
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="h-3.5 w-3.5 text-cyan-300" />
                  16 demo şehir
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-300" />
                  canlı pinler sonraki fazda
                </span>
              </div>
            </div>
          </div>
        </section>

        <style>{`
          @keyframes may19DashFlow {
            to {
              stroke-dashoffset: -120;
            }
          }
        `}</style>
      </main>
    </May19CampaignShell>
  );
}
