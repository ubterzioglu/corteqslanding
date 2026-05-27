import { Link } from "react-router-dom";
import logo from "../../newlogo.png";

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 border-b border-orange-100/90 bg-[linear-gradient(180deg,#fffdf9_0%,#fff8f0_100%)] backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex w-fit shrink-0 items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] ring-1 ring-slate-100">
              <img
                src={logo}
                alt="CorteQS"
                className="h-[50px] w-[50px] rounded-full object-contain"
              />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[1.1rem] font-black tracking-[0.24em] text-slate-900 sm:text-[1.22rem]">
                CorteQS
              </div>
              <div className="text-[0.72rem] font-semibold tracking-[0.04em] text-slate-800 sm:text-[0.76rem]">
                Global Türk Diaspora Network
              </div>
            </div>
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-right">
              <p className="text-sm font-semibold tracking-[0.03em] text-slate-800 sm:text-base">
                Türk Diasporasını Birleştiren Platform
              </p>
              <span
                aria-hidden="true"
                className="hidden h-5 w-px bg-slate-300/80 sm:block"
              />
              <Link
                to="/founders"
                onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                className="text-sm font-semibold text-primary transition-colors hover:text-accent sm:text-base"
              >
                Biz kimiz?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
