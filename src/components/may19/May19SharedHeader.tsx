import { Link } from "react-router-dom";

import logo from "@/assets/corteqs-logo.png";

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

export default function May19SharedHeader() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-3"
          >
            <img 
              src={logo} 
              alt="CorteQS" 
              className="h-10 w-auto" 
            />
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] px-4 py-2 text-emerald-800 text-sm font-semibold hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
            >
              Whatsapp Topluluğu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
