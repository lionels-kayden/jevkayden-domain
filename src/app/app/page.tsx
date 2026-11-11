"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import initialAppsData from "@/data/apps.json";
import { AppsData, AppBladeItem, AppVisualStyle } from "@/types/apps";
import {
  readLiveClientCache,
  fetchFreshestData,
  subscribeToLiveSync,
} from "@/lib/liveClientSync";
import {
  Radio,
  Cpu,
  Bot,
  CircuitBoard,
  GraduationCap,
  Keyboard,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GitBranch,
  Copy,
  Check,
  Layers,
  Terminal,
  Activity,
  SlidersHorizontal,
  ArrowLeft,
  Sparkles,
  Server,
  FileSpreadsheet,
  Box,
} from "lucide-react";

const STYLE_OPTIONS: {
  id: AppVisualStyle;
  code: string;
  name: string;
  shortDesc: string;
}[] = [
  {
    id: "s1",
    code: "S1",
    name: "Neo-Brutalist",
    shortDesc: "Industrial Heavy Border & Offset Shadow",
  },
  {
    id: "s2",
    code: "S2",
    name: "Vercel/Linear Clean SaaS",
    shortDesc: "Minimalist Monochrome & Crisp Hairlines",
  },
  {
    id: "s3",
    code: "S3",
    name: "Silicon Dark Rack",
    shortDesc: "Server Blade Dark Telemetry Matrix",
  },
  {
    id: "s4",
    code: "S4",
    name: "Swiss IEEE Datasheet",
    shortDesc: "Architectural Grid & #00629B Spec Table",
  },
];

function renderAppIcon(iconName: string, className: string = "w-5 h-5") {
  switch (iconName) {
    case "Radio":
      return <Radio className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Bot":
      return <Bot className={className} />;
    case "CircuitBoard":
      return <CircuitBoard className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "Keyboard":
      return <Keyboard className={className} />;
    default:
      return <Server className={className} />;
  }
}

export default function AppBladePortalPage() {
  const [appsData, setAppsData] = useState<AppsData>(
    initialAppsData as unknown as AppsData
  );
  const [visualStyle, setVisualStyle] = useState<AppVisualStyle>("s4");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    iot: true,
  });
  const [copiedDomainId, setCopiedDomainId] = useState<string | null>(null);

  // Instant 0ms live sync from localStorage + cache-busted /api/apps fetch + BroadcastChannel listener
  useEffect(() => {
    const localSnapshot = readLiveClientCache<AppsData>(
      "jev_live_apps_data",
      initialAppsData as unknown as AppsData
    );
    if (localSnapshot?.data?.apps) {
      setAppsData(localSnapshot.data);
      if (localSnapshot.data.defaultStyle) {
        setVisualStyle(localSnapshot.data.defaultStyle);
      }
    }

    fetchFreshestData<AppsData>(
      "/api/apps",
      "jev_live_apps_data",
      initialAppsData as unknown as AppsData
    ).then((freshest) => {
      if (freshest && Array.isArray(freshest.apps)) {
        setAppsData(freshest);
      }
    });

    return subscribeToLiveSync<AppsData>(
      "jev_live_apps_data",
      "/api/apps",
      initialAppsData as unknown as AppsData,
      (freshest) => {
        if (freshest && Array.isArray(freshest.apps)) {
          setAppsData(freshest);
        }
      }
    );
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set((appsData.apps || []).map((a) => a.category).filter(Boolean))
    );
    return ["ALL", ...unique];
  }, [appsData.apps]);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (appsData.apps || []).filter((app) => {
      const matchesCategory =
        selectedCategory === "ALL" || app.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.domain.toLowerCase().includes(q) ||
        app.code.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.problemSolved.toLowerCase().includes(q) ||
        app.techStack.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [appsData.apps, selectedCategory, searchQuery]);

  const allFilteredExpanded =
    filteredApps.length > 0 &&
    filteredApps.every((app) => Boolean(expandedIds[app.id]));

  const toggleRow = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpandAll = () => {
    if (allFilteredExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      filteredApps.forEach((a) => {
        next[a.id] = true;
      });
      setExpandedIds(next);
    }
  };

  const handleCopyDomain = (e: React.MouseEvent, app: AppBladeItem) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`https://${app.domain}`).catch(() => {});
    setCopiedDomainId(app.id);
    setTimeout(() => {
      setCopiedDomainId((prev) => (prev === app.id ? null : prev));
    }, 2000);
  };

  // Theme wrapper classes based on S1..S4
  const pageBgClass =
    visualStyle === "s1"
      ? "bg-[#ece7df] text-black font-sans"
      : visualStyle === "s2"
      ? "bg-[#fafafa] text-zinc-900 font-sans"
      : visualStyle === "s3"
      ? "bg-[#080c14] text-slate-100 font-sans"
      : "bg-[#f4f7fa] text-[#0f172a] font-sans";

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${pageBgClass}`}>
      {/* ================================================================= */}
      {/* 1. TOP COMMAND & L3 STYLE SWITCHER BAR (S1..S4)                   */}
      {/* ================================================================= */}
      <header
        className={
          visualStyle === "s1"
            ? "sticky top-0 z-50 bg-[#f4f0ea] border-b-4 border-black"
            : visualStyle === "s2"
            ? "sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200"
            : visualStyle === "s3"
            ? "sticky top-0 z-50 bg-[#0b111e]/95 backdrop-blur-md border-b border-cyan-500/30"
            : "sticky top-0 z-50 bg-[#00629B] text-white border-b-2 border-[#004269] shadow-sm"
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Hub & Subdomain Identity */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={
                visualStyle === "s1"
                  ? "inline-flex items-center gap-1.5 px-3 py-1 bg-amber-300 hover:bg-amber-400 text-black font-mono text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                  : visualStyle === "s2"
                  ? "inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-mono text-xs font-semibold rounded-md border border-zinc-300"
                  : visualStyle === "s3"
                  ? "inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-xs font-bold rounded border border-cyan-500/40"
                  : "inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#00629B] hover:bg-sky-50 font-mono text-xs font-black tracking-wider uppercase"
              }
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>HUB // JEVKAYDEN.TECH</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 font-mono text-xs">
              <span
                className={
                  visualStyle === "s4"
                    ? "px-2 py-0.5 bg-[#004b78] text-sky-100 font-bold border border-white/20"
                    : visualStyle === "s3"
                    ? "px-2 py-0.5 bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30"
                    : "px-2 py-0.5 bg-black text-white font-bold"
                }
              >
                NODE 03 // APP.JEVKAYDEN.TECH
              </span>
              <span
                className={
                  visualStyle === "s4"
                    ? "text-sky-100 font-semibold"
                    : visualStyle === "s3"
                    ? "text-slate-400"
                    : "text-zinc-600 font-semibold"
                }
              >
                {appsData.documentCode || "IEEE-STD-JEV-2026 // L3 BLADE RACK"}
              </span>
            </div>
          </div>

          {/* Right: 4-Style Switcher Bar (S1..S4) + Quick Links */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1 opacity-80 hidden sm:inline" />
              <span className="font-bold uppercase mr-1 hidden xl:inline opacity-85">
                L3 VISUAL ENGINE:
              </span>
              <div
                className={
                  visualStyle === "s1"
                    ? "inline-flex bg-white border-2 border-black p-0.5 gap-0.5"
                    : visualStyle === "s2"
                    ? "inline-flex bg-zinc-100 border border-zinc-200 rounded-lg p-0.5 gap-0.5"
                    : visualStyle === "s3"
                    ? "inline-flex bg-[#090d16] border border-slate-700 rounded p-0.5 gap-0.5"
                    : "inline-flex bg-[#00456e] border border-white/25 p-0.5 gap-0.5"
                }
              >
                {STYLE_OPTIONS.map((opt) => {
                  const active = visualStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVisualStyle(opt.id)}
                      title={`${opt.code}: ${opt.name} — ${opt.shortDesc}`}
                      className={`px-2.5 py-1 text-[11px] font-mono transition-all cursor-pointer ${
                        active
                          ? visualStyle === "s1"
                            ? "bg-black text-amber-300 font-black"
                            : visualStyle === "s2"
                            ? "bg-zinc-900 text-white font-bold rounded-md shadow-2xs"
                            : visualStyle === "s3"
                            ? "bg-cyan-500 text-slate-950 font-black rounded-xs"
                            : "bg-white text-[#00629B] font-black shadow-2xs"
                          : visualStyle === "s4"
                          ? "text-sky-100 hover:bg-white/10 font-semibold"
                          : visualStyle === "s3"
                          ? "text-slate-400 hover:text-white font-medium"
                          : "text-zinc-600 hover:text-black font-semibold"
                      }`}
                    >
                      <span className="font-black">{opt.code}:</span>{" "}
                      <span className="hidden sm:inline">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Link
              href="/admin/app"
              className={
                visualStyle === "s4"
                  ? "px-2.5 py-1 bg-[#00456e] hover:bg-[#003657] text-amber-300 border border-white/25 font-mono text-[11px] font-bold"
                  : visualStyle === "s3"
                  ? "px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 font-mono text-[11px] font-bold"
                  : "px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-mono text-[11px] font-bold"
              }
            >
              CMS ⚙
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. MAIN CONTENT CONTAINER                                         */}
      {/* ================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* --------------------------------------------------------------- */}
        {/* 2A. ARCHITECTURAL / DATASHEET HERO HEADER                       */}
        {/* --------------------------------------------------------------- */}
        {visualStyle === "s4" && (
          <section className="bg-white border-2 border-[#00629B] shadow-xs">
            {/* Top IEEE Datasheet Identification Strip */}
            <div className="bg-[#00629B] text-white px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs border-b-2 border-[#00629B]">
              <div className="flex items-center gap-2 font-bold">
                <FileSpreadsheet className="w-4 h-4 text-sky-200" />
                <span>IEEE ENGINEERING SPECIFICATION // L3 HORIZONTAL SERVER BLADE DIRECTORY</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-sky-100 font-semibold">
                <span>DOC ID: {appsData.documentCode || "IEEE-STD-JEV-2026"}</span>
                <span>•</span>
                <span>ACTIVE BLADES: {appsData.apps.length} / 06</span>
              </div>
            </div>

            {/* Divided Architectural Header Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-[#00629B]/25">
              <div className="lg:col-span-8 p-5 sm:p-6 space-y-2.5">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#00629B] bg-[#f0f7fc] px-2.5 py-1 border border-[#00629B]/30">
                  <span className="w-2 h-2 rounded-full bg-[#00629B]"></span>
                  <span>SUBDOMAIN CLUSTER // APP.JEVKAYDEN.TECH</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0f172a] uppercase leading-tight">
                  {appsData.portalTitle}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {appsData.portalSubtitle}
                </p>
              </div>

              {/* Right Specification Summary Table */}
              <div className="lg:col-span-4 bg-[#f8fafc] p-5 sm:p-6 font-mono text-xs flex flex-col justify-between space-y-3">
                <div className="text-[11px] font-black uppercase text-[#00629B] border-b border-[#00629B]/25 pb-1.5 flex items-center justify-between">
                  <span>SYSTEM TELEMETRY SUMMARY</span>
                  <span>[REV 4.2]</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white p-2.5 border border-[#00629B]/25">
                    <span className="text-[10px] text-slate-500 block font-bold">ARCHITECTURE</span>
                    <span className="text-sm font-black text-[#00629B]">L3 BLADE RACK</span>
                  </div>
                  <div className="bg-white p-2.5 border border-[#00629B]/25">
                    <span className="text-[10px] text-slate-500 block font-bold">CHILD DOMAINS</span>
                    <span className="text-sm font-black text-emerald-700">
                      0{appsData.apps.filter((a) => a.isLive).length} ONLINE
                    </span>
                  </div>
                  <div className="bg-white p-2.5 border border-[#00629B]/25">
                    <span className="text-[10px] text-slate-500 block font-bold">AVG LATENCY</span>
                    <span className="text-sm font-black text-slate-900">~8.6 ms (EDGE)</span>
                  </div>
                  <div className="bg-white p-2.5 border border-[#00629B]/25">
                    <span className="text-[10px] text-slate-500 block font-bold">OPERATOR</span>
                    <span className="text-sm font-black text-slate-900">N.Q. THẮNG</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {visualStyle === "s1" && (
          <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-black text-amber-300 px-3 py-1 font-mono text-xs font-black uppercase">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>STYLE S1 // NEO-BRUTALIST INDUSTRIAL SERVER BLADES</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
                  {appsData.portalTitle}
                </h1>
                <p className="text-sm text-zinc-700 font-medium max-w-3xl">
                  {appsData.portalSubtitle}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs shrink-0">
                <div className="bg-amber-300 border-2 border-black p-3 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black block">TOTAL BLADES</span>
                  <span className="text-xl font-black">0{appsData.apps.length} NODES</span>
                </div>
                <div className="bg-emerald-300 border-2 border-black p-3 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black block">BUS STATUS</span>
                  <span className="text-xl font-black">200 OK</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {visualStyle === "s2" && (
          <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>STYLE S2 // VERCEL & LINEAR CLEAN SAAS BLADE DIRECTORY</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                  {appsData.portalTitle}
                </h1>
                <p className="text-sm text-zinc-600 max-w-3xl leading-relaxed">
                  {appsData.portalSubtitle}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                <div className="px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 block">ACTIVE ENDPOINTS</span>
                  <span className="text-lg font-bold text-zinc-900">0{appsData.apps.length} Subdomains</span>
                </div>
                <div className="px-4 py-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block">EDGE NETWORK</span>
                  <span className="text-lg font-bold text-emerald-800">99.94% SLA</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {visualStyle === "s3" && (
          <section className="bg-[#0e1525] border border-cyan-500/30 rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>STYLE S3 // SILICON DARK RACK TELEMETRY CONSOLE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                  {appsData.portalTitle}
                </h1>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {appsData.portalSubtitle}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs shrink-0">
                <div className="p-3 rounded-lg bg-[#141d33] border border-cyan-500/30">
                  <span className="text-[10px] text-cyan-300 block">MOUNTED BLADES</span>
                  <span className="text-lg font-black text-white">0{appsData.apps.length} UNITS</span>
                </div>
                <div className="p-3 rounded-lg bg-[#141d33] border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 block">BUS CLOCK</span>
                  <span className="text-lg font-black text-emerald-400">125 MHz OK</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --------------------------------------------------------------- */}
        {/* 2B. FILTER, SEARCH & EXPAND/COLLAPSE CONTROL BAR                */}
        {/* --------------------------------------------------------------- */}
        <section
          className={
            visualStyle === "s1"
              ? "bg-white border-3 border-black p-4 shadow-[5px_5px_0px_0px_#000] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3"
              : visualStyle === "s2"
              ? "bg-white border border-zinc-200 rounded-xl p-3.5 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3"
              : visualStyle === "s3"
              ? "bg-[#0e1525] border border-slate-800 rounded-xl p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3"
              : "bg-white border-2 border-[#00629B] p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3"
          }
        >
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === "ALL"
                  ? appsData.apps.length
                  : appsData.apps.filter((a) => a.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-xs transition-all cursor-pointer ${
                    isSelected
                      ? visualStyle === "s1"
                        ? "bg-black text-amber-300 font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                        : visualStyle === "s2"
                        ? "bg-zinc-900 text-white font-semibold rounded-lg"
                        : visualStyle === "s3"
                        ? "bg-cyan-500 text-slate-950 font-black rounded"
                        : "bg-[#00629B] text-white font-black border border-[#00629B]"
                      : visualStyle === "s1"
                      ? "bg-zinc-100 hover:bg-amber-100 text-black font-bold border-2 border-black"
                      : visualStyle === "s2"
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-lg"
                      : visualStyle === "s3"
                      ? "bg-[#141d33] hover:bg-slate-800 text-slate-300 font-medium rounded border border-slate-700"
                      : "bg-[#f0f7fc] hover:bg-[#e0effa] text-[#00629B] font-bold border border-[#00629B]/30"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="ml-1.5 opacity-75">[{count}]</span>
                </button>
              );
            })}
          </div>

          {/* Right: Instant Search + Expand/Collapse All */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search
                className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                  visualStyle === "s3" ? "text-cyan-400" : "text-slate-400"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm blade, domain, công nghệ..."
                className={
                  visualStyle === "s1"
                    ? "w-full pl-9 pr-3 py-1.5 bg-zinc-50 border-2 border-black font-mono text-xs font-bold text-black outline-none focus:bg-amber-50"
                    : visualStyle === "s2"
                    ? "w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-xs text-zinc-900 outline-none focus:border-zinc-900"
                    : visualStyle === "s3"
                    ? "w-full pl-9 pr-3 py-1.5 bg-[#090d16] border border-slate-700 rounded font-mono text-xs text-white outline-none focus:border-cyan-400"
                    : "w-full pl-9 pr-3 py-1.5 bg-[#f8fafc] border border-[#00629B]/40 font-mono text-xs font-semibold text-slate-900 outline-none focus:border-[#00629B] focus:bg-white"
                }
              />
            </div>

            <button
              type="button"
              onClick={toggleExpandAll}
              className={
                visualStyle === "s1"
                  ? "px-3.5 py-1.5 bg-amber-300 hover:bg-amber-400 text-black font-mono text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer shrink-0"
                  : visualStyle === "s2"
                  ? "px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-mono text-xs font-semibold rounded-lg border border-zinc-300 cursor-pointer shrink-0"
                  : visualStyle === "s3"
                  ? "px-3.5 py-1.5 bg-[#141d33] hover:bg-slate-800 text-cyan-300 font-mono text-xs font-bold rounded border border-cyan-500/40 cursor-pointer shrink-0"
                  : "px-3.5 py-1.5 bg-[#00629B] hover:bg-[#004e7c] text-white font-mono text-xs font-bold cursor-pointer shrink-0"
              }
            >
              {allFilteredExpanded ? "THU GỌN TẤT CẢ [-]" : "MỞ RỘNG TẤT CẢ [+]"}
            </button>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* 2C. L3 HORIZONTAL SERVER BLADE ACCORDION MATRIX                 */}
        {/* --------------------------------------------------------------- */}
        <section
          className={
            visualStyle === "s4"
              ? "bg-white border-2 border-[#00629B] shadow-xs"
              : "space-y-4"
          }
        >
          {/* Formal Specification Table Header for Style S4 (Swiss IEEE Datasheet) */}
          {visualStyle === "s4" && (
            <div className="hidden lg:grid lg:grid-cols-12 bg-[#00629B] text-white font-mono text-[11px] font-bold uppercase tracking-wider border-b-2 border-[#00629B] divide-x divide-white/20">
              <div className="col-span-1 px-3 py-2.5 text-center">INDEX</div>
              <div className="col-span-5 px-4 py-2.5">
                BLADE MODULE // ENGINEERING SPECIFICATION
              </div>
              <div className="col-span-2 px-3 py-2.5">SUBDOMAIN ENDPOINT</div>
              <div className="col-span-2 px-3 py-2.5">CATEGORY // TELEMETRY</div>
              <div className="col-span-2 px-3 py-2.5 text-right">
                STATUS // ACTION
              </div>
            </div>
          )}

          {filteredApps.length === 0 ? (
            <div className="p-12 text-center font-mono text-sm opacity-75">
              Không tìm thấy ứng dụng kỹ thuật nào khớp với từ khóa tìm kiếm.
            </div>
          ) : (
            <div
              className={
                visualStyle === "s4"
                  ? "divide-y-2 divide-[#00629B]/30"
                  : "space-y-4"
              }
            >
              {filteredApps.map((app) => {
                const isExpanded = Boolean(expandedIds[app.id]);
                const isCopied = copiedDomainId === app.id;

                return (
                  <article
                    key={app.id}
                    className={
                      visualStyle === "s1"
                        ? "bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden transition-all"
                        : visualStyle === "s2"
                        ? "bg-white border border-zinc-200 rounded-2xl shadow-2xs overflow-hidden transition-all hover:border-zinc-300"
                        : visualStyle === "s3"
                        ? "bg-[#0e1525] border border-slate-800 hover:border-cyan-500/40 rounded-xl overflow-hidden transition-all"
                        : "bg-white overflow-hidden transition-colors"
                    }
                  >
                    {/* ===================================================== */}
                    {/* HORIZONTAL SERVER BLADE SUMMARY ROW (CLICK TO EXPAND) */}
                    {/* ===================================================== */}
                    <div
                      onClick={() => toggleRow(app.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleRow(app.id);
                        }
                      }}
                      className={`w-full cursor-pointer select-none transition-colors ${
                        visualStyle === "s4"
                          ? isExpanded
                            ? "bg-[#f0f7fc]"
                            : "hover:bg-[#f8fafc]"
                          : visualStyle === "s1"
                          ? isExpanded
                            ? "bg-amber-50/90"
                            : "hover:bg-zinc-50"
                          : visualStyle === "s2"
                          ? isExpanded
                            ? "bg-zinc-50/80"
                            : "hover:bg-zinc-50/50"
                          : isExpanded
                          ? "bg-[#131d33]"
                          : "hover:bg-[#111a2e]"
                      }`}
                    >
                      <div
                        className={
                          visualStyle === "s4"
                            ? "grid grid-cols-1 lg:grid-cols-12 items-stretch lg:divide-x lg:divide-[#00629B]/20"
                            : "grid grid-cols-1 lg:grid-cols-12 items-center p-4 sm:p-5 gap-4"
                        }
                      >
                        {/* COL 1: Giant 01..06 Index Number */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-1 p-4 flex lg:flex-col items-center justify-between lg:justify-center bg-[#f8fafc] border-b lg:border-b-0 border-[#00629B]/20"
                              : "lg:col-span-1 flex items-center gap-3"
                          }
                        >
                          <span
                            className={
                              visualStyle === "s4"
                                ? "text-3xl sm:text-4xl font-black font-mono text-[#00629B] tracking-tighter leading-none"
                                : visualStyle === "s1"
                                ? "text-2xl sm:text-3xl font-black font-mono bg-black text-amber-300 px-2.5 py-1 border-2 border-black"
                                : visualStyle === "s2"
                                ? "text-2xl sm:text-3xl font-extrabold font-mono text-zinc-400"
                                : "text-2xl sm:text-3xl font-black font-mono text-cyan-400"
                            }
                          >
                            {app.index}
                          </span>
                          <span
                            className={
                              visualStyle === "s4"
                                ? "text-[10px] font-mono font-bold text-slate-500 mt-1"
                                : "lg:hidden font-mono text-xs font-bold opacity-75"
                            }
                          >
                            {app.code}
                          </span>
                        </div>

                        {/* COL 2: Module Name, Icon & Engineering Tagline */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-5 p-4 flex flex-col justify-center space-y-1.5"
                              : "lg:col-span-5 space-y-1"
                          }
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={
                                visualStyle === "s4"
                                  ? "p-1.5 bg-[#00629B] text-white"
                                  : visualStyle === "s1"
                                  ? "p-1.5 bg-amber-300 text-black border-2 border-black"
                                  : visualStyle === "s2"
                                  ? "p-1.5 bg-zinc-100 text-zinc-800 rounded-lg border border-zinc-200"
                                  : "p-1.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-500/30"
                              }
                            >
                              {renderAppIcon(app.icon, "w-4 h-4")}
                            </span>
                            <h2
                              className={
                                visualStyle === "s3"
                                  ? "text-base sm:text-lg font-extrabold text-white leading-snug"
                                  : "text-base sm:text-lg font-black text-slate-950 leading-snug"
                              }
                            >
                              {app.name}
                            </h2>
                          </div>
                          <p
                            className={
                              visualStyle === "s3"
                                ? "text-xs text-slate-300 leading-relaxed line-clamp-2"
                                : "text-xs text-slate-600 leading-relaxed line-clamp-2"
                            }
                          >
                            {app.tagline}
                          </p>
                        </div>

                        {/* COL 3: Subdomain Endpoint & Copy Button */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-2 p-4 flex flex-col justify-center space-y-1 border-t lg:border-t-0 border-[#00629B]/15"
                              : "lg:col-span-2 flex flex-col justify-center space-y-1"
                          }
                        >
                          <span className="text-[10px] font-mono font-bold uppercase opacity-60">
                            ENDPOINT HOST
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={
                                visualStyle === "s4"
                                  ? "font-mono text-xs font-black text-[#00629B] break-all"
                                  : visualStyle === "s3"
                                  ? "font-mono text-xs font-bold text-cyan-300 break-all"
                                  : "font-mono text-xs font-black text-black break-all"
                              }
                            >
                              {app.domain}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyDomain(e, app)}
                              title="Sao chép URL tên miền con"
                              className="p-1 rounded hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 opacity-60" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] font-mono opacity-70">
                            {app.version}
                          </span>
                        </div>

                        {/* COL 4: Category & Latency Telemetry */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-2 p-4 flex flex-col justify-center space-y-1.5 border-t lg:border-t-0 border-[#00629B]/15"
                              : "lg:col-span-2 flex flex-col justify-center space-y-1.5"
                          }
                        >
                          <span
                            className={
                              visualStyle === "s4"
                                ? "inline-block self-start px-2 py-0.5 text-[10px] font-mono font-bold bg-[#f0f7fc] text-[#00629B] border border-[#00629B]/30"
                                : visualStyle === "s1"
                                ? "inline-block self-start px-2 py-0.5 text-[10px] font-mono font-black bg-amber-200 text-black border border-black"
                                : visualStyle === "s2"
                                ? "inline-block self-start px-2 py-0.5 text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-700 rounded-md border border-zinc-200"
                                : "inline-block self-start px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 rounded border border-slate-700"
                            }
                          >
                            {app.category}
                          </span>
                          <div className="font-mono text-[11px] flex items-center gap-1.5">
                            <Activity className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="opacity-75">LATENCY:</span>
                            <span className="font-bold">{app.latency}</span>
                          </div>
                        </div>

                        {/* COL 5: Status Badge, Direct Launch & Accordion Toggle */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-2 p-4 flex items-center justify-between lg:justify-end gap-2 border-t lg:border-t-0 border-[#00629B]/15"
                              : "lg:col-span-2 flex items-center justify-between lg:justify-end gap-2"
                          }
                        >
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-black uppercase ${
                              app.status === "STANDBY"
                                ? "bg-amber-100 text-amber-900 border border-amber-500"
                                : app.status === "BETA"
                                ? "bg-purple-100 text-purple-900 border border-purple-500"
                                : "bg-emerald-100 text-emerald-900 border border-emerald-600"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                app.status === "STANDBY"
                                  ? "bg-amber-500"
                                  : "bg-emerald-600 animate-pulse"
                              }`}
                            ></span>
                            {app.status}
                          </span>

                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Mở ${app.domain} ở tab mới`}
                            className={
                              visualStyle === "s4"
                                ? "p-2 bg-[#00629B] hover:bg-[#004b78] text-white transition-colors"
                                : visualStyle === "s1"
                                ? "p-2 bg-black hover:bg-zinc-800 text-amber-300 border-2 border-black"
                                : visualStyle === "s2"
                                ? "p-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg"
                                : "p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded"
                            }
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <div
                            className={
                              visualStyle === "s4"
                                ? "p-1.5 border border-[#00629B]/40 text-[#00629B]"
                                : "p-1.5 opacity-75"
                            }
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ===================================================== */}
                    {/* 3-COLUMN TECHNICAL SPECIFICATION ACCORDION DRAWER     */}
                    {/* ===================================================== */}
                    {isExpanded && (
                      <div
                        className={
                          visualStyle === "s4"
                            ? "border-t-2 border-[#00629B] bg-white grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-[#00629B]/25"
                            : visualStyle === "s1"
                            ? "border-t-4 border-black bg-[#faf8f5] p-5 grid grid-cols-1 lg:grid-cols-12 gap-6"
                            : visualStyle === "s2"
                            ? "border-t border-zinc-200 bg-zinc-50/60 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
                            : "border-t border-slate-800 bg-[#0a0f1c] p-5 grid grid-cols-1 lg:grid-cols-12 gap-6"
                        }
                      >
                        {/* ------------------------------------------------- */}
                        {/* DRAWER COL 1: PROBLEM & ARCHITECTURE PIPELINE     */}
                        {/* ------------------------------------------------- */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-4 p-5 space-y-4"
                              : "lg:col-span-4 space-y-4"
                          }
                        >
                          <div
                            className={
                              visualStyle === "s4"
                                ? "font-mono text-xs font-black uppercase text-[#00629B] border-b border-[#00629B]/25 pb-1.5 flex items-center justify-between"
                                : visualStyle === "s3"
                                ? "font-mono text-xs font-bold uppercase text-cyan-400 border-b border-slate-800 pb-1.5"
                                : "font-mono text-xs font-black uppercase text-black border-b-2 border-black pb-1.5"
                            }
                          >
                            <span>01 // PROBLEM & ARCHITECTURE PIPELINE</span>
                            <Layers className="w-3.5 h-3.5" />
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase opacity-70 block">
                              ENGINEERING PROBLEM SOLVED:
                            </span>
                            <p
                              className={
                                visualStyle === "s3"
                                  ? "text-xs text-slate-300 leading-relaxed text-justify"
                                  : "text-xs text-slate-700 leading-relaxed text-justify"
                              }
                            >
                              {app.problemSolved}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-mono font-bold uppercase opacity-70 block">
                              SIGNAL & DATAFLOW PIPELINE:
                            </span>
                            <div className="space-y-1.5">
                              {app.architecture.map((stage, sIdx) => (
                                <div
                                  key={sIdx}
                                  className={
                                    visualStyle === "s4"
                                      ? "p-2 bg-[#f8fafc] border border-[#00629B]/30 font-mono text-[11px] flex items-center gap-2.5"
                                      : visualStyle === "s1"
                                      ? "p-2 bg-white border-2 border-black font-mono text-[11px] font-bold flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#000]"
                                      : visualStyle === "s2"
                                      ? "p-2 bg-white border border-zinc-200 rounded-lg font-mono text-[11px] flex items-center gap-2.5"
                                      : "p-2 bg-[#11192c] border border-slate-800 rounded font-mono text-[11px] text-slate-200 flex items-center gap-2.5"
                                  }
                                >
                                  <span
                                    className={
                                      visualStyle === "s4"
                                        ? "px-1.5 py-0.5 bg-[#00629B] text-white font-black text-[10px] shrink-0"
                                        : visualStyle === "s3"
                                        ? "px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold text-[10px] shrink-0"
                                        : "px-1.5 py-0.5 bg-black text-amber-300 font-black text-[10px] shrink-0"
                                    }
                                  >
                                    S0{sIdx + 1}
                                  </span>
                                  <span className="leading-snug">{stage}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* ------------------------------------------------- */}
                        {/* DRAWER COL 2: FEATURES & TECH STACK               */}
                        {/* ------------------------------------------------- */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-4 p-5 space-y-4"
                              : "lg:col-span-4 space-y-4"
                          }
                        >
                          <div
                            className={
                              visualStyle === "s4"
                                ? "font-mono text-xs font-black uppercase text-[#00629B] border-b border-[#00629B]/25 pb-1.5 flex items-center justify-between"
                                : visualStyle === "s3"
                                ? "font-mono text-xs font-bold uppercase text-cyan-400 border-b border-slate-800 pb-1.5"
                                : "font-mono text-xs font-black uppercase text-black border-b-2 border-black pb-1.5"
                            }
                          >
                            <span>02 // KEY SPECIFICATIONS & TECH STACK</span>
                            <Box className="w-3.5 h-3.5" />
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase opacity-70 block">
                              VERIFIED CAPABILITIES:
                            </span>
                            <ul className="space-y-2 text-xs">
                              {app.features.map((feat, fIdx) => (
                                <li
                                  key={fIdx}
                                  className="flex items-start gap-2 leading-snug"
                                >
                                  <span
                                    className={
                                      visualStyle === "s4"
                                        ? "font-mono font-black text-[#00629B] shrink-0"
                                        : visualStyle === "s3"
                                        ? "font-mono font-bold text-cyan-400 shrink-0"
                                        : "font-mono font-black text-emerald-700 shrink-0"
                                    }
                                  >
                                    ■
                                  </span>
                                  <span
                                    className={
                                      visualStyle === "s3"
                                        ? "text-slate-300"
                                        : "text-slate-800"
                                    }
                                  >
                                    {feat}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2 pt-1">
                            <span className="text-[10px] font-mono font-bold uppercase opacity-70 block">
                              HARDWARE & SOFTWARE STACK:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {app.techStack.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className={
                                    visualStyle === "s4"
                                      ? "px-2.5 py-1 text-[11px] font-mono font-bold bg-[#f0f7fc] text-[#00629B] border border-[#00629B]/35"
                                      : visualStyle === "s1"
                                      ? "px-2.5 py-1 text-[11px] font-mono font-black bg-white text-black border-2 border-black"
                                      : visualStyle === "s2"
                                      ? "px-2.5 py-1 text-[11px] font-mono font-medium bg-white text-zinc-800 rounded-md border border-zinc-200 shadow-2xs"
                                      : "px-2.5 py-1 text-[11px] font-mono font-semibold bg-[#141d33] text-cyan-300 rounded border border-cyan-500/30"
                                  }
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* ------------------------------------------------- */}
                        {/* DRAWER COL 3: TELEMETRY METRICS & LAUNCH CTA      */}
                        {/* ------------------------------------------------- */}
                        <div
                          className={
                            visualStyle === "s4"
                              ? "lg:col-span-4 p-5 bg-[#f8fafc] flex flex-col justify-between space-y-4"
                              : "lg:col-span-4 flex flex-col justify-between space-y-4"
                          }
                        >
                          <div className="space-y-4">
                            <div
                              className={
                                visualStyle === "s4"
                                  ? "font-mono text-xs font-black uppercase text-[#00629B] border-b border-[#00629B]/25 pb-1.5 flex items-center justify-between"
                                  : visualStyle === "s3"
                                  ? "font-mono text-xs font-bold uppercase text-cyan-400 border-b border-slate-800 pb-1.5"
                                  : "font-mono text-xs font-black uppercase text-black border-b-2 border-black pb-1.5"
                              }
                            >
                              <span>03 // TELEMETRY BENCHMARKS & LAUNCH</span>
                              <Activity className="w-3.5 h-3.5" />
                            </div>

                            {/* 2x2 Telemetry Metric Grid */}
                            <div className="grid grid-cols-2 gap-2.5">
                              {app.metrics.map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className={
                                    visualStyle === "s4"
                                      ? "p-3 bg-white border border-[#00629B]/30"
                                      : visualStyle === "s1"
                                      ? "p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000]"
                                      : visualStyle === "s2"
                                      ? "p-3 bg-white border border-zinc-200 rounded-xl shadow-2xs"
                                      : "p-3 bg-[#11192c] border border-slate-800 rounded-lg"
                                  }
                                >
                                  <span className="text-[9.5px] font-mono font-bold uppercase opacity-65 block">
                                    {m.label}
                                  </span>
                                  <div
                                    className={
                                      visualStyle === "s4"
                                        ? "text-lg font-black font-mono text-[#00629B] mt-0.5"
                                        : visualStyle === "s3"
                                        ? "text-lg font-black font-mono text-white mt-0.5"
                                        : "text-lg font-black font-mono text-black mt-0.5"
                                    }
                                  >
                                    {m.value}
                                  </div>
                                  {m.unit && (
                                    <span className="text-[10px] font-mono opacity-75">
                                      {m.unit}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Deployment & Source Action Buttons */}
                          <div className="space-y-2 pt-2">
                            <a
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={
                                visualStyle === "s4"
                                  ? "w-full py-3 px-4 bg-[#00629B] hover:bg-[#004b78] text-white font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition-colors shadow-xs"
                                  : visualStyle === "s1"
                                  ? "w-full py-3 px-4 bg-amber-300 hover:bg-amber-400 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2"
                                  : visualStyle === "s2"
                                  ? "w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2"
                                  : "w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-black uppercase rounded-lg flex items-center justify-center gap-2"
                              }
                            >
                              <span>LAUNCH {app.domain.toUpperCase()}</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            <div className="grid grid-cols-2 gap-2">
                              <a
                                href={app.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                  visualStyle === "s4"
                                    ? "py-2 px-3 bg-white hover:bg-slate-100 text-[#00629B] border border-[#00629B]/40 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5"
                                    : visualStyle === "s3"
                                    ? "py-2 px-3 bg-[#141d33] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded font-mono text-[11px] font-bold flex items-center justify-center gap-1.5"
                                    : "py-2 px-3 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5"
                                }
                              >
                                <GitBranch className="w-3.5 h-3.5" />
                                <span>SOURCE REPO</span>
                              </a>

                              <button
                                type="button"
                                onClick={(e) => handleCopyDomain(e, app)}
                                className={
                                  visualStyle === "s4"
                                    ? "py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-[#00629B]/40 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                                    : visualStyle === "s3"
                                    ? "py-2 px-3 bg-[#141d33] hover:bg-slate-800 text-slate-200 border border-slate-700 rounded font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                                    : "py-2 px-3 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                                }
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>ĐÃ CHÉP URL</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>COPY DOMAIN</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ================================================================= */}
      {/* 3. TECHNICAL FOOTER                                               */}
      {/* ================================================================= */}
      <footer
        className={
          visualStyle === "s4"
            ? "border-t-2 border-[#00629B] bg-white py-5 px-4 sm:px-6 font-mono text-xs text-slate-600"
            : visualStyle === "s3"
            ? "border-t border-slate-800 bg-[#0b111e] py-5 px-4 sm:px-6 font-mono text-xs text-slate-400"
            : "border-t-2 border-black/15 py-5 px-4 sm:px-6 font-mono text-xs text-zinc-600"
        }
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>APP.JEVKAYDEN.TECH // L3 SERVER BLADE ARCHITECTURE</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-bold">
            <Link href="/" className="hover:underline">
              00. MAIN HUB
            </Link>
            <Link href="/cv" className="hover:underline">
              01. CV DOSSIER
            </Link>
            <Link href="/blog" className="hover:underline">
              02. BLOG GARDEN
            </Link>
            <Link href="/admin/app" className="hover:underline text-[#00629B]">
              03. ADMIN APP STUDIO
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

