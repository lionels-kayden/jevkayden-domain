"use client";

import React, { useState, useEffect } from "react";
import { siteConfig, Language } from "@/data/siteConfig";
import { Globe, Radio, ShieldCheck, Cpu, Languages } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

interface TopSystemBarProps {
  lang: Language;
  onToggleLang: () => void;
  isProductionRoute: boolean;
  onToggleRouting: () => void;
}

export const TopSystemBar: React.FC<TopSystemBarProps> = ({
  lang,
  onToggleLang,
  isProductionRoute,
  onToggleRouting,
}) => {
  const [timeString, setTimeString] = useState<string>("--:--:--");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTimeString(`${hours}:${minutes}:${seconds}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f4f0ea] border-b-4 border-black select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2.5 text-xs font-mono overflow-x-auto flex-nowrap whitespace-nowrap">
        {/* Left: System Status & Brand (Strictly 1 single horizontal row) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <BrandLogo variant="hub" size={32} className="shrink-0" />
          <div className="flex items-center gap-1.5 bg-black text-white px-2 py-1 border-2 border-black font-bold tracking-wider neo-shadow-sm">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{"SYS.CORE //"}</span>
            <span>HUB.OS</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 border-2 border-black text-emerald-900 font-semibold neo-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-led inline-block border border-black"></span>
            <span className="font-bold">{siteConfig.uiText.sysOnline[lang]}</span>
            <span className="hidden sm:inline text-emerald-700 text-xs">[200_OK]</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-zinc-600 bg-white/70 px-2 py-1 border border-black/40">
            <Cpu className="w-3 h-3 text-black" />
            <span className="text-xs">115200 BAUD</span>
          </div>
        </div>

        {/* Right: Live Clock, Language Toggle, Routing Switcher & Kernel (Strictly 1 row) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Live Clock with SSR deterministic fallback */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 border-2 border-black neo-shadow-sm">
            <span className="text-zinc-500 text-[11px] font-bold">UTC+7:</span>
            <span
              suppressHydrationWarning
              className="font-bold tracking-wider text-black tabular-nums min-w-[54px] text-xs"
            >
              {timeString}
            </span>
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-blink"></span>
          </div>

          {/* Bilingual Language Switcher Button */}
          <button
            onClick={onToggleLang}
            type="button"
            title="Switch Language / Chuyển đổi ngôn ngữ (EN / VI)"
            className="group flex items-center gap-1 px-2.5 py-1 border-2 border-black font-mono font-black text-xs cursor-pointer neo-btn bg-white hover:bg-zinc-100 text-black shrink-0"
          >
            <Languages className="w-3.5 h-3.5 text-black group-hover:rotate-12 transition-transform" />
            <span className="text-zinc-600">LANG:</span>
            <span className="underline decoration-2 font-extrabold text-black">
              {lang === "en" ? "EN_US" : "VI_VN"}
            </span>
          </button>

          {/* Routing Mode Toggle Badge */}
          <button
            onClick={onToggleRouting}
            type="button"
            title="Click to toggle between Production Domain and Sandbox Preview mode"
            className="group flex items-center gap-1.5 px-2.5 py-1 border-2 border-black font-bold text-xs cursor-pointer neo-btn transition-all bg-amber-300 hover:bg-amber-400 text-black shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-black group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline text-zinc-800">ROUTING:</span>
            <span className="font-extrabold underline decoration-2 decoration-black">
              {isProductionRoute
                ? siteConfig.uiText.routingProd[lang]
                : siteConfig.uiText.routingSandbox[lang]}
            </span>
          </button>

          {/* Kernel Badge */}
          <div className="hidden xl:flex items-center gap-1 bg-zinc-200 px-2 py-1 border-2 border-black text-zinc-800 text-xs font-bold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>v4.19-RT</span>
          </div>
        </div>
      </div>

      {/* Retro yellow sub-stripe */}
      <div className="w-full h-1 bg-amber-400 border-t border-black/20"></div>
    </header>
  );
};
