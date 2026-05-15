import { Link } from "react-router-dom";
import logo from "../../0logomail.png";

const internalNavClass =
  "inline-flex min-h-[42px] flex-none items-center justify-center rounded-full border px-3 py-2 text-center text-[10px] font-bold tracking-[0.01em] transition sm:min-h-[44px] sm:text-[10.5px]";
const uniformNavClass =
  "min-w-[128px] whitespace-nowrap px-3 sm:min-w-[142px] sm:px-3.5";

const navLinks = [
  {
    label: "19 Mayıs Etkinlikleri",
    disabledLabel: "Yakında!",
    className:
      "cursor-not-allowed border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] text-slate-500 shadow-[0_14px_32px_rgba(148,163,184,0.16)]",
  },
  {
    label: "Kayıt Ol!",
    href: "https://corteqs.net/form",
    className:
      "border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] text-orange-700 shadow-[0_14px_32px_rgba(251,146,60,0.25)] hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-[0_18px_38px_rgba(251,146,60,0.32)]",
  },
  {
    label: "Founding 1000",
    to: "/founding-1000",
    className:
      "border-amber-200 bg-[linear-gradient(135deg,#fffbea_0%,#fef3c7_100%)] text-amber-800 shadow-[0_14px_32px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-[0_18px_38px_rgba(245,158,11,0.32)]",
  },
  {
    label: "Blogger Yarışması",
    to: "/blogger-yarismasi",
    className:
      "border-orange-200 bg-[linear-gradient(135deg,#fff7ed_0%,#fed7aa_100%)] text-orange-800 shadow-[0_14px_32px_rgba(234,88,12,0.25)] hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-[0_18px_38px_rgba(234,88,12,0.32)]",
  },
  {
    label: "Vlogger Yarışması",
    to: "/vlogger-yarismasi",
    className:
      "border-cyan-200 bg-[linear-gradient(135deg,#ecfeff_0%,#cffafe_100%)] text-cyan-800 shadow-[0_14px_32px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-[0_18px_38px_rgba(6,182,212,0.32)]",
  },
] as const;

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 border-b border-orange-100/90 bg-[linear-gradient(180deg,#fffdf9_0%,#fff8f0_100%)] backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between gap-4 overflow-hidden">
          <Link
            to="/"
            className="inline-flex w-fit shrink-0 items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] ring-1 ring-slate-100">
              <img
                src={logo}
                alt="CorteQS"
                className="h-[42px] w-[42px] rounded-full object-cover"
              />
            </div>
            <div className="text-left leading-tight">
              <div className="bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_22%,#f59e0b_52%,#f97316_72%,#16a34a_100%)] bg-clip-text text-[1.1rem] font-black tracking-[0.24em] text-transparent drop-shadow-[0_6px_16px_rgba(37,99,235,0.18)] sm:text-[1.22rem]">
                CorteQS
              </div>
              <div className="text-[0.72rem] font-semibold tracking-[0.04em] text-slate-800 sm:text-[0.76rem]">
                Global Türk Diaspora Network
              </div>
            </div>
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-x-auto whitespace-nowrap pb-1">
            {navLinks.map((item) =>
              "to" in item ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`${internalNavClass} ${uniformNavClass} ${item.className}`}
                >
                  {item.label}
                </Link>
              ) : "href" in item ? (
                <a
                  key={item.label}
                  href={item.href}
                  className={`${internalNavClass} ${uniformNavClass} ${item.className}`}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  key={item.label}
                  aria-disabled="true"
                  className={`${internalNavClass} gap-2 ${item.className}`}
                >
                  <span>{item.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                    {item.disabledLabel}
                  </span>
                </span>
              ),
            )}
            <a
              href="https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD"
              target="_blank"
              rel="noopener noreferrer"
              className={`${internalNavClass} ${uniformNavClass} border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] text-emerald-800 shadow-[0_14px_32px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-[0_18px_38px_rgba(16,185,129,0.32)]`}
            >
              Whatsapp Topluluğu
            </a>
            <Link
              to="/"
              className={`${internalNavClass} ${uniformNavClass} border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-800 shadow-[0_14px_32px_rgba(100,116,139,0.2)] hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100 hover:shadow-[0_18px_38px_rgba(100,116,139,0.28)]`}
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
