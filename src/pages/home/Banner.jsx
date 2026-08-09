import React from 'react';
import { Link } from 'react-router-dom';
import bannerImg from "../../assets/header.png";

const Banner = () => {
  return (
    <section className="relative w-full overflow-x-clip bg-[#faf8f5] pt-20 pb-16 sm:pt-24 sm:pb-20 lg:py-0">
      <style>{`
        @keyframes sa-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sa-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .sa-rise { animation: sa-rise .9s cubic-bezier(.22,.61,.36,1) both; }
        .sa-fade { animation: sa-fade 1.4s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .sa-rise, .sa-fade { animation: none !important; opacity: 1; transform: none; }
        }
      `}</style>

      {/* Ambient texture + glows — decorative only */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4c5b0' fill-opacity='0.35'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -right-32 -top-40 h-[26rem] w-[26rem] rounded-full bg-[#d4c5b0]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-[#c9a87c]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-12 px-5 sm:px-8 lg:min-h-[88vh] lg:flex-row lg:gap-16 lg:px-12 lg:py-24 xl:gap-24 xl:px-16">

        {/* ── Copy ───────────────────────────────────────────── */}
        <div className="flex w-full flex-col items-center text-center lg:w-[48%] lg:items-start lg:text-left">

          <div className="sa-rise flex items-center gap-4" style={{ animationDelay: '.05s' }}>
            <span className="h-px w-10 bg-[#c9a87c]" />
            <span className="text-[10px] font-light uppercase tracking-[0.45em] text-[#c9a87c] sm:text-[11px]">
              Categories
            </span>
          </div>

          <h1 className="sa-rise mt-6 font-serif font-light text-[#2c241e]" style={{ animationDelay: '.15s' }}>
            <span className="block text-[2.75rem] leading-[0.95] tracking-[-0.02em] sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem]">
              Wrap yourself
            </span>
            <span className="mt-2 block font-serif text-[2rem] italic leading-[1.1] tracking-[0.01em] text-[#c9a87c] sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]">
              in elegance
            </span>
          </h1>

          <div className="mt-7 flex max-w-md items-start gap-4">
            <span aria-hidden className="mt-[0.7rem] hidden h-px w-8 shrink-0 bg-[#c9a87c]/50 lg:block" />
            <p className="sa-rise text-[0.95rem] font-light leading-relaxed text-[#5a4f47] sm:text-base lg:text-lg" style={{ animationDelay: '.25s' }}>
            Elevate your everyday style with premium scarves and hijabs crafted for comfort, elegance, and timeless modesty.
            </p>
          </div>

          <div className="sa-rise mt-10 w-full sm:w-auto" style={{ animationDelay: '.35s' }}>
            <Link
              to="/shop"
              className="group inline-flex w-full items-center justify-center gap-4 border border-[#c9a87c] bg-[#c9a87c] px-10 py-4 text-[11px] font-light uppercase tracking-[0.3em] text-white transition-colors duration-500 hover:bg-[#b8966a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c241e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#faf8f5] sm:w-auto sm:px-12"
            >
              Shop the collection
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* ── Image ──────────────────────────────────────────── */}
        <div className="flex w-full justify-center lg:w-[52%] lg:justify-end">
          {/*
            Padded shell: every decorative layer lives INSIDE this box,
            so nothing can escape the column or get clipped at any width.
          */}
          <div className="sa-fade relative w-full max-w-[20rem] p-4 pb-14 sm:max-w-sm sm:p-5 sm:pb-16 lg:max-w-[28rem] lg:p-6 lg:pb-6 xl:max-w-[31rem]">

            {/* Offset hairline frame — sits in the padding gutter */}
            <div aria-hidden className="absolute inset-0 border border-[#c9a87c]/35" />

            {/* Photo */}
            <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#efe9e1] sm:aspect-[4/3] lg:aspect-[4/5]">
              <img
                src={bannerImg}
                alt="ScarfAura handcrafted scarves"
                loading="eager"
                className="h-full w-full object-cover object-center"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-[#2c241e]/10 via-transparent to-[#faf8f5]/10" />
            </div>

            {/* Stat plate — anchored in the bottom gutter, never overflows */}
            <div className="absolute bottom-0 left-4 border border-[#d4c5b0] bg-[#faf8f5] px-6 py-4 sm:left-5 lg:left-auto lg:right-0 lg:translate-x-4 lg:translate-y-3 lg:bg-white/95 lg:backdrop-blur-sm">
              <p className="text-center text-[9px] font-light uppercase tracking-[0.35em] text-[#2c241e] sm:text-[10px]">
                <span className="block font-serif text-3xl font-light tracking-normal text-[#c9a87c] lg:text-4xl">
                  200+
                </span>
                Signature styles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Base rule */}
      <div aria-hidden className="absolute bottom-0 left-0 z-10 h-px w-full bg-gradient-to-r from-[#c9a87c] via-[#c9a87c]/25 to-transparent" />
    </section>
  );
};

export default Banner;