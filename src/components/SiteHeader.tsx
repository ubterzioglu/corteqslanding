import { Link } from "react-router-dom";
import logo from "@/assets/corteqs-logo.png";

const internalNavClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 py-2 text-center text-[11px] font-bold tracking-[0.01em] transition sm:text-xs";

const navLinks = [
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

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 border-b border-orange-100/90 bg-[linear-gradient(180deg,#fffdf9_0%,#fff8f0_100%)] backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)]"
          >
            <img
              src={logo}
              alt="CorteQS"
              className="h-11 w-11 rounded-full border border-orange-100 bg-white object-contain p-1.5"
            />
            <div className="pr-1">
              <div className="text-sm font-black tracking-[0.02em] text-slate-900">
                CorteQS
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Türk Diasporası Platformu
              </div>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`${internalNavClass} ${item.className}`}
              >
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
  );
}
