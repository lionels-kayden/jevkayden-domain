"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig, SubdomainNode, resolveSubdomainUrl, Language } from "@/data/siteConfig";
import { HubData } from "@/types/hub";
import {
  ExternalLink,
  BookOpen,
  FileText,
  Cpu,
  Lock,
  HardDrive,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface SubdomainGridProps {
  lang: Language;
  hubData?: HubData;
  isProductionRoute: boolean;
  isStandbyModalOpen: boolean;
  onOpenStandbyModal: () => void;
  onCloseStandbyModal: () => void;
}

export const SubdomainGrid: React.FC<SubdomainGridProps> = ({
  lang,
  hubData,
  isProductionRoute,
  isStandbyModalOpen,
  onOpenStandbyModal,
  onCloseStandbyModal,
}) => {
  const router = useRouter();

  const mergedSubdomains: SubdomainNode[] = siteConfig.subdomains.map((baseNode) => {
    const override = hubData?.subdomains?.find((s) => s.id === baseNode.id);
    if (!override) return baseNode;
    return {
      ...baseNode,
      status: override.status || baseNode.status,
      subdomain: override.subdomain || baseNode.subdomain,
      description: override.description || baseNode.description,
    };
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="w-5 h-5 text-black" />;
      case "FileText":
        return <FileText className="w-5 h-5 text-black" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-black" />;
      default:
        return <HardDrive className="w-5 h-5 text-black" />;
    }
  };

  const handleCardClick = (node: SubdomainNode) => {
    if (node.status === "STANDBY") {
      onOpenStandbyModal();
    } else {
      const url = resolveSubdomainUrl(node, isProductionRoute);
      if (url.startsWith("/")) {
        router.push(url);
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <section
      id="subdomains-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 scroll-mt-24"
    >
      {/* Module Title & Hardware Chassis Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b-4 border-black">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-600 mb-1">
            <Layers className="w-4 h-4 text-black" />
            <span>{siteConfig.uiText.busSubtitle[lang]}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-black tracking-tight">
            {siteConfig.uiText.busTitle[lang]}
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="bg-black text-white px-2.5 py-1 border border-black">
            BUS ARCHITECTURE: 3-BAY
          </span>
          <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 border-2 border-black">
            2 / 3 ACTIVE
          </span>
        </div>
      </div>

      {/* 3 Hardware Cartridge Cards - Strict Flexbox & Vertical Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {mergedSubdomains.map((node) => {
          const isStandby = node.status === "STANDBY";
          const resolvedUrl = resolveSubdomainUrl(node, isProductionRoute);

          return (
            <div
              key={node.id}
              onClick={() => handleCardClick(node)}
              className={`group flex flex-col justify-between h-full bg-white border-4 border-black neo-card relative overflow-hidden transition-all duration-150 cursor-pointer ${
                isStandby ? "ring-2 ring-purple-600/30" : ""
              }`}
              style={{
                boxShadow: "6px 6px 0px 0px #000000",
              }}
            >
              {/* Top Section Group */}
              <div className="flex flex-col w-full">
                {/* 1. Retro Cartridge Handle Grip Notch */}
                <div
                  className="w-full py-1.5 px-4 border-b-3 border-black flex items-center justify-between select-none"
                  style={{ backgroundColor: node.accentColor }}
                >
                  {/* Grip ridges */}
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                  </div>

                  <div className="font-mono text-[11px] font-black tracking-widest text-black uppercase">
                    SLOT-0{node.id === "blog" ? "1" : node.id === "cv" ? "2" : "3"} {" // "} {node.category[lang]}
                  </div>

                  {/* Grip ridges */}
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                    <span className="w-1.5 h-3 bg-black"></span>
                  </div>
                </div>

                {/* 2. Standardized Sub-Header Banner (Identical 32px height across all 3 cards) */}
                {node.id === "blog" && (
                  <div className="h-8 bg-amber-100 border-b-2 border-black px-3 flex items-center justify-center font-mono text-[10px] font-black text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-black"></span>
                      {node.subHeaderBanner[lang]}
                    </span>
                  </div>
                )}

                {node.id === "cv" && (
                  <div className="h-8 bg-emerald-100 border-b-2 border-black px-3 flex items-center justify-center font-mono text-[10px] font-black text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-black"></span>
                      {node.subHeaderBanner[lang]}
                    </span>
                  </div>
                )}

                {node.id === "app" && (
                  <div className="h-8 hazard-stripes-purple border-b-2 border-black px-3 flex items-center justify-center">
                    <span className="bg-purple-950 text-purple-200 text-[10px] font-mono font-black px-2 py-0.5 border border-purple-400/40">
                      ⚠ {node.subHeaderBanner[lang]}
                    </span>
                  </div>
                )}

                {/* 3. Main Cartridge Info Area */}
                <div className="p-5 flex flex-col space-y-4">
                  {/* Hostname & Status LED Row (Fixed min-height for perfect alignment) */}
                  <div className="flex items-start justify-between gap-3 min-h-[52px]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 border-2 border-black bg-[#f4f0ea] neo-shadow-sm shrink-0">
                        {getIcon(node.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">
                          {siteConfig.uiText.targetHostname[lang]}
                        </span>
                        <div className="font-mono text-base font-black text-black break-all">
                          {node.subdomain}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className="px-2.5 py-1 border-2 border-black font-mono text-[10px] font-black shrink-0 neo-shadow-sm flex items-center gap-1.5"
                      style={{
                        backgroundColor: node.badgeBg,
                        color: node.badgeText,
                      }}
                    >
                      <span
                        className={`w-2 h-2 rounded-full border border-black ${
                          isStandby
                            ? "bg-purple-500 animate-ping"
                            : "bg-emerald-500 animate-led"
                        }`}
                      ></span>
                      <span>{node.status}</span>
                    </div>
                  </div>

                  {/* Title & Tagline Box (Fixed min-height for horizontal parity) */}
                  <div className="min-h-[96px] flex flex-col justify-start">
                    <h3
                      className="font-display text-base sm:text-lg font-black text-black leading-tight line-clamp-1 truncate h-7 flex items-center"
                      title={node.name[lang]}
                    >
                      {node.name[lang]}
                    </h3>
                    <p className="font-mono text-xs text-zinc-700 font-medium mt-1.5 leading-relaxed line-clamp-2 min-h-[2.75rem]">
                      {node.tagline[lang]}
                    </p>
                  </div>

                  {/* Description Box (Standardized min-height across cards) */}
                  <div className="bg-[#f9f8f5] p-3 border-2 border-black/80 font-mono text-xs text-zinc-800 leading-normal min-h-[6.5rem] flex items-center">
                    <p className="line-clamp-4">{node.description[lang]}</p>
                  </div>

                  {/* Hardware Spec Badges (Tech Stack & Telemetry) */}
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    <div className="flex items-center justify-between text-zinc-600 bg-white p-2 border border-black min-h-[38px]">
                      <span className="font-bold flex items-center gap-1.5 shrink-0">
                        <Activity className="w-3.5 h-3.5 text-black" />
                        {siteConfig.uiText.techStackLabel[lang]}
                      </span>
                      <span className="font-bold text-black text-right text-[11px] truncate pl-2">
                        {node.tech}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-zinc-100 p-1.5 border border-black text-center font-bold text-zinc-700">
                        {node.port}
                      </div>
                      <div className="bg-zinc-100 p-1.5 border border-black text-center font-bold text-zinc-700">
                        {isStandby ? "PING: TIMEOUT" : `PING: ~${node.pingMs}ms`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section Group (Button & Gold Connectors) */}
              <div className="flex flex-col w-full">
                {/* Tactile Action Button */}
                <div className="p-5 pt-0">
                  {isStandby ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenStandbyModal();
                      }}
                      type="button"
                      className="w-full neo-btn py-3 px-4 bg-purple-200 hover:bg-purple-300 text-purple-950 border-2 border-black font-mono font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{siteConfig.uiText.nodeStandby[lang]}</span>
                    </button>
                  ) : resolvedUrl.startsWith("/") ? (
                    <Link
                      href={resolvedUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full neo-btn py-3 px-4 bg-black hover:bg-zinc-900 text-amber-300 border-2 border-black font-mono font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{siteConfig.uiText.mountNode[lang]}</span>
                      <ExternalLink className="w-4 h-4 stroke-[3]" />
                    </Link>
                  ) : (
                    <a
                      href={resolvedUrl}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full neo-btn py-3 px-4 bg-black hover:bg-zinc-900 text-amber-300 border-2 border-black font-mono font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{siteConfig.uiText.mountNode[lang]}</span>
                      <ExternalLink className="w-4 h-4 stroke-[3]" />
                    </a>
                  )}
                </div>

                {/* Bottom Edge Gold Connectors (Hardware ROM PCB aesthetic) */}
                <div className="bg-[#1a1a1a] p-1.5 border-t-3 border-black flex items-center justify-around">
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                  <span className="w-3 h-2 bg-amber-400 border border-black/50"></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RETRO MODAL FOR STANDBY LAB NODE */}
      {isStandbyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-[#f4f0ea] border-4 border-black neo-shadow-lg relative overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Window Title Bar */}
            <div className="bg-purple-900 text-purple-100 px-4 py-2.5 border-b-3 border-black flex items-center justify-between font-mono text-xs select-none">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>{siteConfig.uiText.modalTitle[lang]}</span>
              </div>
              <button
                onClick={onCloseStandbyModal}
                type="button"
                className="w-6 h-6 bg-red-600 hover:bg-red-500 border-2 border-black text-white font-black flex items-center justify-center cursor-pointer active:translate-y-0.5"
                title="Dismiss Alert"
              >
                ✕
              </button>
            </div>

            {/* Modal Hazard Banner */}
            <div className="hazard-stripes-amber py-2 px-4 border-b-2 border-black text-center font-mono text-xs font-black text-black">
              {siteConfig.uiText.modalHazard[lang]}
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 font-mono">
              <div className="bg-white p-4 border-2 border-black neo-shadow-sm">
                <h4 className="font-display text-xl font-black text-black mb-1">
                  {siteConfig.uiText.modalNoticeTitle[lang]}
                </h4>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  {siteConfig.uiText.modalNoticeDesc[lang]}
                </p>
              </div>

              {/* Simulated Compilation Logs */}
              <div className="bg-[#121212] text-zinc-200 p-3.5 border-2 border-black text-[11px] space-y-1.5">
                <div className="text-zinc-500 font-bold">
                  {siteConfig.uiText.modalBuildLogTitle[lang]}
                </div>
                <div className="text-emerald-400 font-semibold">
                  ➜ [COMPILE STAGE 3/5] Building IoT telemetry Docker container...
                </div>
                <div className="text-cyan-300">
                  ➜ [KERNEL] Mounting MQTT broker & sensor telemetry sockets...
                </div>
                <div className="text-amber-300">
                  ➜ [STATUS] FastAPI daemon initializing on internal socket 3000.
                </div>
                <div className="text-zinc-400 animate-pulse">
                  ➜ Simulating semiconductor logic & hardware testbed... [ESTIMATED TIME: IMMINENT]
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onCloseStandbyModal}
                  type="button"
                  className="neo-btn px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-mono font-black text-xs flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{siteConfig.uiText.modalAckBtn[lang]}</span>
                </button>
              </div>
            </div>

            {/* Bottom Status Edge */}
            <div className="bg-zinc-200 px-4 py-1.5 border-t-2 border-black flex items-center justify-between text-[10px] font-mono text-zinc-600">
              <span>ERR_CODE: 202_ACCEPTED_STANDBY</span>
              <span>HOST: app.jevkayden.tech</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
