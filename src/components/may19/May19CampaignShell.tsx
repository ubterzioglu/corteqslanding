import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import logo from "@/assets/corteqs-logo.png";

type May19CampaignShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primaryCta?: {
    label: string;
    to: string;
  };
  secondaryCta?: {
    label: string;
    to: string;
  };
  children: ReactNode;
};

const internalNavClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 py-2 text-center text-[11px] font-bold tracking-[0.01em] transition sm:text-xs";

const campaignLinks = [
  {
    label: "19 Mayıs Etkinlikleri",
    to: "/19051919",
    className:
      "border-rose-300 bg-[linear-gradient(135deg,#ef4444_0%,#f43f5e_55%,#fb7185_100%)] text-white shadow-[0_14px_32px_rgba(244,63,94,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(244,63,94,0.34)]",
  },
  {
    label: "Kayıt Ol!",
    to: "/19051919#katilim-formu",
    className:
      "border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] text-orange-700 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50",
  },
  {
    label: "Founding 1000",
    to: "/founding-1000",
    className:
      "border-amber-200 bg-[linear-gradient(135deg,#fffbea_0%,#fef3c7_100%)] text-amber-800 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50",
  },
  {
    label: "Blogger Yarışması",
    to: "/blogger-yarismasi",
    className:
      "border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fed7aa_100%)] text-orange-800 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50",
  },
  {
    label: "Vlogger Yarışması",
    to: "/vlogger-yarismasi",
    className:
      "border-cyan-200 bg-[linear-gradient(135deg,#ecfeff_0%,#cffafe_100%)] text-cyan-800 hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50",
  },
] as const;

export default function May19CampaignShell({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  children,
}: May19CampaignShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#fff_28%,#f8fbff_100%)] text-slate-950">
      <div className="border-b border-orange-100/90 bg-[linear-gradient(180deg,#fffdf9_0%,#fff8f0_100%)]">
        <div className="container mx-auto px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)]"
            >
              <img src={logo} alt="CorteQS" className="h-11 w-11 rounded-full border border-orange-100 bg-white object-contain p-1.5" />
              <div className="pr-1">
                <div className="text-sm font-black tracking-[0.02em] text-slate-900">CorteQS</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">19 Mayıs Kampanyası</div>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              {campaignLinks.map((item) => (
                <Link key={item.label} to={item.to} className={`${internalNavClass} ${item.className}`}>
                  {item.label}
                </Link>
              ))}
              <a
                href="https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD"
                target="_blank"
                rel="noopener noreferrer"
                className={`${internalNavClass} border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] text-emerald-800 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50`}
              >
                Whatsapp Topluluğu
              </a>
            </div>
          </div>
        </div>
      </div>

      <header className="relative overflow-hidden border-b border-orange-100 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_38%,#0b3f52_100%)] text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-orange-400/25 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-rose-400/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 pb-12 pt-5 lg:px-6 lg:pb-16">
          <div className="max-w-4xl pt-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-rose-100">
              <span aria-hidden="true">🇹🇷</span>
              {eyebrow}
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              {description}
            </p>

            {(primaryCta || secondaryCta) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCta ? (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-rose-500 px-6 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(244,63,94,0.32)] hover:bg-rose-600"
                  >
                    <Link to={primaryCta.to}>{primaryCta.label}</Link>
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/25 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white"
                  >
                    <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
