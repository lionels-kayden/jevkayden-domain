"use client";

import React, { useState, useRef, useEffect } from "react";
import { siteConfig, Language } from "@/data/siteConfig";
import {
  Terminal as TerminalIcon,
  ArrowDown,
  ExternalLink,
  FileCode2,
} from "lucide-react";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "system" | "error" | "success";
  text: string;
  timestamp?: string;
}

interface HeroTerminalProps {
  lang: Language;
  onScrollToPortals: () => void;
  onScrollToContact: () => void;
  onOpenStandbyModal: () => void;
}

export const HeroTerminal: React.FC<HeroTerminalProps> = ({
  lang,
  onScrollToPortals,
  onScrollToContact,
  onOpenStandbyModal,
}) => {
  const [inputVal, setInputVal] = useState<string>("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    {
      id: "init-1",
      type: "system",
      text: "RETRO-OS BOOTLOADER v4.19 [OK] - IC & IOT BUS INDEXED",
    },
    {
      id: "init-2",
      type: "system",
      text: "Type 'help' or click command buttons below to interact with host.",
    },
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleCommandExecution = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    const userLine: TerminalLine = {
      id: `usr-${Date.now()}`,
      type: "input",
      text: trimmed,
      timestamp: time,
    };

    let responseLines: TerminalLine[] = [];
    const normalized = trimmed.toLowerCase();

    if (normalized === "clear" || normalized === "cls") {
      setTerminalHistory([]);
      setInputVal("");
      return;
    } else if (normalized === "help" || normalized === "./help.sh") {
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: "AVAILABLE TERMINAL EXECUTABLES:",
        },
        {
          id: `out-${Date.now()}-2`,
          type: "output",
          text: "  cat profile.json     -> View engineer identity & credentials",
        },
        {
          id: `out-${Date.now()}-3`,
          type: "output",
          text: "  ./check_subdomains.sh-> Ping & diagnose all 3 network nodes",
        },
        {
          id: `out-${Date.now()}-4`,
          type: "output",
          text: "  ./skills.sh          -> Dump IC Design, Embedded & IoT stack",
        },
        {
          id: `out-${Date.now()}-5`,
          type: "output",
          text: "  whoami               -> Current system operator identifier",
        },
        {
          id: `out-${Date.now()}-6`,
          type: "output",
          text: "  blog | cv | app      -> Navigate or query individual nodes",
        },
        {
          id: `out-${Date.now()}-7`,
          type: "output",
          text: "  clear                -> Flush terminal screen buffer",
        },
      ];
    } else if (normalized === "cat profile.json" || normalized === "profile") {
      const jsonSnippet = JSON.stringify(
        {
          fullName: siteConfig.profile.fullName,
          alias: siteConfig.profile.displayAlias,
          role: siteConfig.profile.role[lang],
          faculty: siteConfig.profile.faculty[lang],
          location: siteConfig.profile.location[lang],
          baseDomain: siteConfig.baseDomain,
          email: siteConfig.profile.email,
          clearance: siteConfig.profile.securityClearance,
          activeNodes: `${siteConfig.systemMetrics.activeNodesCount}/${siteConfig.systemMetrics.totalNodesCount}`,
        },
        null,
        2
      );
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "success",
          text: jsonSnippet,
        },
      ];
    } else if (
      normalized === "./check_subdomains.sh" ||
      normalized === "check" ||
      normalized === "subdomains"
    ) {
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "system",
          text: "RUNNING HARDWARE BUS & NETWORK DIAGNOSTICS [TCP_PING]...",
        },
        ...siteConfig.subdomains.map((node, i) => ({
          id: `out-${Date.now()}-${i + 2}`,
          type:
            node.status === "ONLINE"
              ? ("success" as const)
              : ("error" as const),
          text: `[${node.status}] ${node.subdomain.padEnd(24)} :: ${
            node.port
          } (${node.status === "ONLINE" ? `${node.pingMs}ms` : "COMPILING_STANDBY"})`,
        })),
        {
          id: `out-${Date.now()}-99`,
          type: "system",
          text: "DIAGNOSTIC COMPLETE: 2 NODES ONLINE, 1 COMPILING IN STANDBY.",
        },
      ];
    } else if (normalized === "./skills.sh" || normalized === "skills") {
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: "=== VERIFIED IC DESIGN & IOT STACK MATRIX ===",
        },
        {
          id: `out-${Date.now()}-2`,
          type: "success",
          text: "IC DESIGN: Verilog & VHDL, ASIC Synthesis, Logic Simulation",
        },
        {
          id: `out-${Date.now()}-3`,
          type: "success",
          text: "EMBEDDED: C / C++, FreeRTOS, Bare-Metal Firmware Architecture",
        },
        {
          id: `out-${Date.now()}-4`,
          type: "success",
          text: "IOT SYSTEMS: ESP32, STM32, MQTT, TCP/IP, Sensor Telemetry",
        },
        {
          id: `out-${Date.now()}-5`,
          type: "success",
          text: "CIRCUIT & HARDWARE: Circuit Analysis, Schematic & PCB Design",
        },
        {
          id: `out-${Date.now()}-6`,
          type: "success",
          text: "SYSTEMS & AUTOMATION: Linux / Bash, Python (FastAPI), Next.js / TypeScript",
        },
      ];
    } else if (normalized === "whoami") {
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "output",
          text: `OPERATOR: ${siteConfig.profile.displayAlias} @ ${siteConfig.baseDomain} [ACCESS_GRANTED: LEVEL-4]`,
        },
      ];
    } else if (normalized === "blog") {
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "success",
          text: "Opening TECHNICAL BLOG (blog.jevkayden.tech)...",
        },
      ];
      const blogTarget = window.location.hostname.includes("localhost") ? "/blog" : siteConfig.subdomains[0].url;
      window.open(blogTarget, "_blank");
    } else if (normalized === "cv") {
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "success",
          text: "Opening CURRICULUM VITAE (cv.jevkayden.tech)...",
        },
      ];
      window.open("/cv", "_blank");
    } else if (normalized === "app") {
      responseLines = [
        {
          id: `out-${Date.now()}-1`,
          type: "error",
          text: "ALERT: Lab node app.jevkayden.tech is in STANDBY compiling mode.",
        },
      ];
      onOpenStandbyModal();
    } else {
      responseLines = [
        {
          id: `out-${Date.now()}-err`,
          type: "error",
          text: `bash: command not found: '${trimmed}'. Type 'help' for valid commands.`,
        },
      ];
    }

    setTerminalHistory((prev) => [...prev, userLine, ...responseLines]);
    setInputVal("");
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommandExecution(inputVal);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pt-10 sm:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Builder ID Card & Hero Pitch (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Hardware ID Badge Header */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-black text-amber-300 px-3.5 py-1.5 border-2 border-black font-mono text-xs sm:text-sm font-black neo-shadow-sm uppercase tracking-wider">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
              {siteConfig.profile.role[lang]}
            </div>

            <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 border-2 border-black font-mono text-xs font-bold neo-shadow-sm text-zinc-800">
              <span className="text-zinc-500">ID:</span>
              <span className="font-extrabold text-black">
                {siteConfig.profile.fullName}
              </span>
            </div>
          </div>

          {/* Main Headline with Neo-Brutalist Highlight Boxes */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-extrabold tracking-tight leading-[1.2] text-black">
              {siteConfig.profile.headlinePrefix[lang]}
              <span className="inline-block bg-[#fde047] text-black px-2 py-0.5 border-3 border-black neo-shadow-sm rotate-[-1deg]">
                {siteConfig.profile.highlight1[lang]}
              </span>
              {siteConfig.profile.headlineMid[lang]}
              <span className="inline-block bg-[#34d399] text-black px-2 py-0.5 border-3 border-black neo-shadow-sm rotate-[1deg]">
                {siteConfig.profile.highlight2[lang]}
              </span>
              {siteConfig.profile.headlineSuffix[lang]}
            </h1>

            <p className="font-mono text-sm sm:text-base text-zinc-800 font-semibold leading-relaxed bg-white/80 p-3.5 border-2 border-black neo-shadow-sm">
              {siteConfig.profile.bio[lang]}
            </p>
          </div>

          {/* Builder Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-white p-2.5 border-2 border-black neo-shadow-sm">
              <span className="text-zinc-500 font-bold block mb-1">
                {"// BASE LOCALE"}
              </span>
              <span className="font-extrabold text-black">
                {siteConfig.profile.location[lang]}
              </span>
            </div>

            <div className="bg-white p-2.5 border-2 border-black neo-shadow-sm">
              <span className="text-zinc-500 font-bold block mb-1">
                {"// FACULTY"}
              </span>
              <span className="font-extrabold text-black">
                {siteConfig.profile.faculty[lang]}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-emerald-50 p-2.5 border-2 border-black neo-shadow-sm">
              <span className="text-emerald-700 font-bold block mb-1">
                {"// STATUS"}
              </span>
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {siteConfig.profile.status[lang]}
              </span>
            </div>
          </div>

          {/* Primary Tactile Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onScrollToPortals}
              type="button"
              className="neo-btn-lg px-5 py-3 bg-amber-400 hover:bg-amber-500 text-black font-mono font-black text-sm flex items-center gap-2 cursor-pointer"
            >
              <ArrowDown className="w-4 h-4 stroke-[3]" />
              <span>{siteConfig.uiText.exploreSubdomains[lang]}</span>
            </button>

            <a
              href="/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn-lg px-5 py-3 bg-white hover:bg-zinc-100 text-black font-mono font-black text-sm flex items-center gap-2"
            >
              <span>{siteConfig.uiText.dossierCv[lang]}</span>
              <ExternalLink className="w-4 h-4 stroke-[3]" />
            </a>

            <button
              onClick={onScrollToContact}
              type="button"
              className="neo-btn px-4 py-3 bg-zinc-200 hover:bg-zinc-300 text-black font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{siteConfig.uiText.transmitPing[lang]}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: TERMINAL.EXE Component (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="neo-card bg-[#121212] text-zinc-100 rounded-none overflow-hidden relative">
            {/* CRT Screen Scanline Overlay */}
            <div className="crt-overlay absolute inset-0 z-10 pointer-events-none"></div>

            {/* Window Title Bar */}
            <div className="bg-[#242424] border-b-2 border-black px-3 py-2 flex items-center justify-between font-mono text-xs select-none">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span>TERMINAL.EXE - [115200 BAUD]</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-zinc-700 hover:bg-zinc-600 border border-black flex items-center justify-center text-[9px] text-zinc-300 font-bold cursor-pointer">
                  _
                </span>
                <span className="w-3.5 h-3.5 bg-zinc-700 hover:bg-zinc-600 border border-black flex items-center justify-center text-[9px] text-zinc-300 font-bold cursor-pointer">
                  □
                </span>
                <span className="w-3.5 h-3.5 bg-red-600 hover:bg-red-500 border border-black flex items-center justify-center text-[9px] text-white font-bold cursor-pointer">
                  ✕
                </span>
              </div>
            </div>

            {/* Terminal Body with Output Logs */}
            <div
              ref={terminalBodyRef}
              className="p-3.5 h-[280px] sm:h-[320px] overflow-y-auto font-mono text-xs space-y-2 bg-[#0c0c0c] border-b-2 border-black/80"
            >
              {terminalHistory.map((item) => (
                <div key={item.id} className="leading-relaxed break-words">
                  {item.type === "input" && (
                    <div className="text-zinc-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold shrink-0">
                        operator@jev:~$
                      </span>
                      <span className="text-amber-300 font-bold">
                        {item.text}
                      </span>
                      {item.timestamp && (
                        <span className="text-zinc-600 text-[10px] ml-auto shrink-0">
                          {item.timestamp}
                        </span>
                      )}
                    </div>
                  )}

                  {item.type === "output" && (
                    <div className="text-zinc-300 pl-3 border-l-2 border-zinc-700 whitespace-pre-wrap">
                      {item.text}
                    </div>
                  )}

                  {item.type === "system" && (
                    <div className="text-cyan-400 pl-3 border-l-2 border-cyan-800">
                      :: {item.text}
                    </div>
                  )}

                  {item.type === "success" && (
                    <div className="text-emerald-400 font-semibold pl-3 border-l-2 border-emerald-600 whitespace-pre-wrap">
                      {item.text}
                    </div>
                  )}

                  {item.type === "error" && (
                    <div className="text-red-400 font-semibold pl-3 border-l-2 border-red-600">
                      [ERR] {item.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive Command Input Field */}
            <form
              onSubmit={onFormSubmit}
              className="p-2.5 bg-[#181818] border-b-2 border-black flex items-center gap-2 font-mono text-xs"
            >
              <span className="text-emerald-400 font-bold shrink-0">
                operator@jev:~$
              </span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type 'help', 'skills', 'cat profile.json'..."
                className="w-full bg-transparent text-amber-200 outline-none placeholder:text-zinc-600 caret-amber-400 font-mono text-xs"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-black px-2 py-0.5 font-bold uppercase text-[10px] border border-black neo-shadow-sm cursor-pointer"
              >
                EXEC
              </button>
            </form>

            {/* Quick Macro Buttons */}
            <div className="p-2.5 bg-[#1f1f1f] flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="text-zinc-500 font-bold mr-1">{"// MACROS:"}</span>
              <button
                type="button"
                onClick={() => handleCommandExecution("cat profile.json")}
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-600 hover:border-amber-400 rounded-none cursor-pointer font-bold active:translate-y-0.5 transition-transform"
              >
                $ cat profile.json
              </button>

              <button
                type="button"
                onClick={() => handleCommandExecution("./check_subdomains.sh")}
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-zinc-600 hover:border-emerald-400 rounded-none cursor-pointer font-bold active:translate-y-0.5 transition-transform"
              >
                $ ./check_subdomains.sh
              </button>

              <button
                type="button"
                onClick={() => handleCommandExecution("./skills.sh")}
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-600 hover:border-cyan-400 rounded-none cursor-pointer font-bold active:translate-y-0.5 transition-transform"
              >
                $ ./skills.sh
              </button>

              <button
                type="button"
                onClick={() => handleCommandExecution("clear")}
                className="px-2 py-1 bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-300 border border-zinc-600 rounded-none cursor-pointer font-bold ml-auto active:translate-y-0.5 transition-transform"
              >
                $ clear
              </button>
            </div>
          </div>

          {/* Quick Hardware Diagnostic Bar underneath Terminal */}
          <div className="mt-2 bg-white/70 p-2 border-2 border-black flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-zinc-700 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-black" />
              {siteConfig.uiText.ioStream[lang]}
            </span>
            <span className="bg-black text-white px-2 py-0.5 font-bold text-[10px]">
              LATENCY: 0.12ms
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
