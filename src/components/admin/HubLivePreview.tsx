"use client";

import React, { useState } from "react";
import { HubData } from "@/types/hub";
import {
  Globe,
  Terminal,
  Activity,
  Cpu,
  BookOpen,
  FileText,
  Radio,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Clock,
} from "lucide-react";

interface HubLivePreviewProps {
  hubData: HubData;
}

export const HubLivePreview: React.FC<HubLivePreviewProps> = ({ hubData }) => {
  const [previewLang, setPreviewLang] = useState<"vi" | "en">("vi");
  const [terminalOutput, setTerminalOutput] = useState<string>(
    "RETRO-OS BOOTLOADER v4.19 [OK] — IC & IOT BUS INDEXED. Ready for commands."
  );

  const hero = hubData.hero;
  const subdomains = hubData.subdomains;
  const marquee = hubData.techMarquee;
  const pager = hubData.pagerContact;

  const handleTerminalCmd = (cmd: string) => {
    switch (cmd) {
      case "bio":
        setTerminalOutput(`BIO: ${hero.bio[previewLang]}`);
        break;
      case "role":
        setTerminalOutput(`ROLE: ${hero.role[previewLang]} — ${hero.subRole[previewLang]}`);
        break;
      case "faculty":
        setTerminalOutput(`FACULTY: ${hero.faculty[previewLang]} [${hero.location[previewLang]}]`);
        break;
      case "status":
        setTerminalOutput(`STATUS: ${hero.status[previewLang]}`);
        break;
      case "help":
      default:
        setTerminalOutput("COMMANDS: 'bio', 'role', 'faculty', 'status'. Click buttons below to inspect.");
        break;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Control Deck Header */}
      <div className="bg-black text-white px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 border-2 border-black shrink-0 text-xs font-mono select-none sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-amber-300">LIVE PREVIEW // JEVKAYDEN.TECH</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="inline-flex border border-zinc-700 bg-zinc-900">
            <button
              type="button"
              onClick={() => setPreviewLang("vi")}
              className={`px-2 py-0.5 text-[11px] font-bold cursor-pointer transition-colors ${
                previewLang === "vi"
                  ? "bg-amber-400 text-black"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              🇻🇳 VI
            </button>
            <button
              type="button"
              onClick={() => setPreviewLang("en")}
              className={`px-2 py-0.5 text-[11px] font-bold cursor-pointer transition-colors ${
                previewLang === "en"
                  ? "bg-amber-400 text-black"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              🇺🇸 EN
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-[10px] font-bold transition-colors"
            title="Mở trang chủ thật trong tab mới"
          >
            <span>MỞ TRANG THẬT</span>
            <ExternalLink className="w-3 h-3 text-amber-300" />
          </a>
        </div>
      </div>

      {/* Simulated Browser Frame */}
      <div className="border-3 border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
        {/* Browser Top Bar */}
        <div className="bg-zinc-900 text-zinc-300 px-3 py-1.5 flex items-center justify-between border-b-2 border-black text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          </div>
          <div className="bg-zinc-800 border border-zinc-700 px-3 py-0.5 text-[11px] text-amber-300 truncate font-mono max-w-xs text-center">
            https://jevkayden.tech
          </div>
          <span className="text-[10px] font-bold text-emerald-400 hidden sm:inline">● 200 OK</span>
        </div>

        {/* Live Content Body */}
        <div className="p-4 sm:p-5 bg-[#ece7df] text-black font-sans space-y-5">
          {/* Top Retro System Bar */}
          <div className="bg-white border-2 border-black p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-[2px_2px_0px_0px_#000] text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="font-bold text-black uppercase">RETRO-OS // CORE v4.19</span>
            </div>
            <div className="text-[11px] font-bold text-zinc-600 bg-amber-100 px-2 py-0.5 border border-black">
              {hero.status[previewLang]}
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white border-4 border-black p-4 sm:p-6 shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">
                  HARDWARE ARCHITECTURE // FET VNU-UET
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-sans text-black uppercase tracking-tight">
                  {hero.fullName}{" "}
                  <span className="text-amber-600 font-mono text-base font-bold">
                    ({hero.alias})
                  </span>
                </h1>
              </div>

              <span className="px-2.5 py-1 bg-amber-300 text-black border-2 border-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                {hero.role[previewLang]}
              </span>
            </div>

            {/* Sub-Role & Faculty */}
            <div className="text-xs font-mono space-y-1 text-zinc-700 bg-zinc-50 p-2.5 border-2 border-black">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-black shrink-0" />
                <span className="font-bold text-black">{hero.subRole[previewLang]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{hero.faculty[previewLang]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{hero.location[previewLang]}</span>
              </div>
            </div>

            {/* Headline Slogan */}
            <div className="text-base sm:text-lg font-black font-sans uppercase leading-snug text-black">
              <span>{hero.headlinePrefix[previewLang]} </span>
              <span className="bg-amber-300 px-1 border border-black shadow-[2px_2px_0px_0px_#000] inline-block my-0.5">
                {hero.highlight1[previewLang]}
              </span>{" "}
              <span>{hero.headlineMid[previewLang]} </span>
              <span className="bg-amber-300 px-1 border border-black shadow-[2px_2px_0px_0px_#000] inline-block my-0.5">
                {hero.highlight2[previewLang]}
              </span>{" "}
              <span>{hero.headlineSuffix[previewLang]}</span>
            </div>

            {/* Bio text */}
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans text-justify border-l-4 border-black pl-3 py-1">
              {hero.bio[previewLang]}
            </p>

            {/* Mini Interactive Terminal Box */}
            <div className="bg-black text-emerald-400 p-3 font-mono text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-[10px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>TERMINAL.EXE — HOST INTERACTION</span>
                </div>
                <span>BAUD: 115200</span>
              </div>

              <div className="text-[11px] leading-relaxed min-h-[36px] text-emerald-300 break-words font-mono">
                {terminalOutput}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">CMD:</span>
                {(["help", "bio", "role", "faculty", "status"] as const).map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => handleTerminalCmd(cmd)}
                    className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 text-[10px] font-mono cursor-pointer transition-colors active:translate-y-0.5"
                  >
                    ${cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Infinite Tech Marquee Ticker */}
          <div className="bg-black text-white p-2.5 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-zinc-700 font-mono text-[10px] text-amber-300">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="font-bold uppercase">
                TECH MARQUEE // HARDWARE & EMBEDDED STACK ({marquee.length} ITEMS)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {marquee.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-white font-mono text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <span className="text-amber-400">#</span>
                  <span>{item.name}</span>
                  <span className="text-[9px] text-zinc-500 bg-zinc-800 px-1 rounded-none">
                    {item.tag}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* 3 Hardware Cartridges / Subdomains */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-black uppercase">
              <Globe className="w-3.5 h-3.5 text-[#00629B]" />
              <span>SUBDOMAIN HARDWARE CARTRIDGES (3 NODES)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {subdomains.map((sub) => {
                const isOnline = sub.status === "ONLINE";
                return (
                  <div
                    key={sub.id}
                    className="bg-white border-3 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          {sub.id === "cv" ? (
                            <FileText className="w-4 h-4 text-emerald-600" />
                          ) : sub.id === "blog" ? (
                            <BookOpen className="w-4 h-4 text-sky-600" />
                          ) : (
                            <Cpu className="w-4 h-4 text-purple-600" />
                          )}
                          <span className="font-mono text-xs font-black text-black">
                            {sub.id.toUpperCase()}
                          </span>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-mono font-black border ${
                            isOnline
                              ? "bg-emerald-100 text-emerald-950 border-emerald-600"
                              : "bg-amber-100 text-amber-950 border-amber-600"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-zinc-600 font-bold mb-1 truncate">
                        {sub.subdomain}
                      </div>

                      <p className="text-[11px] text-zinc-600 leading-snug line-clamp-3">
                        {sub.description[previewLang]}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500">
                      <span>NODE PORTAL</span>
                      <ChevronRight className="w-3 h-3 text-black" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motorola Pager Footer Preview */}
          <div className="bg-zinc-900 border-4 border-black p-4 text-white shadow-[5px_5px_0px_0px_#000] space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs uppercase text-amber-300">
                  MOTOROLA BRAVO PLUS // PAGER TRANSMISSION
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 border border-zinc-700">
                ID: {pager.pagerId} • CH: {pager.channel}
              </span>
            </div>

            {/* Pager LCD Screen */}
            <div className="bg-[#8da372] text-[#1c2c15] p-3 border-2 border-[#5b6f48] shadow-inner font-mono">
              <div className="flex items-center justify-between text-[10px] font-bold border-b border-[#70845a] pb-1 mb-1">
                <span>[INCOMING TRANSMISSION]</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{pager.operatingHours}</span>
                </span>
              </div>
              <div className="text-xs font-bold leading-relaxed py-1">
                &gt; &quot;{pager.statusMessage[previewLang]}&quot;
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
              <span>DEVICE ID: BRAVO-2026-FET</span>
              <span className="text-emerald-400">● SIGNAL STRONG (100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
