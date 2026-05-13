import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import May19SharedHeader from "@/components/may19/May19SharedHeader";

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
      <May19SharedHeader />

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
