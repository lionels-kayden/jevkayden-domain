"use client";

import React, { useState } from "react";
import {
  AppsData,
  AppBladeItem,
  AppVisualStyle,
  AppStatus,
} from "@/types/apps";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Server,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

interface AppWorkspaceProps {
  appsData: AppsData;
  onChangeAppsData: React.Dispatch<React.SetStateAction<AppsData>>;
  appNodeStatus: "ONLINE" | "STANDBY" | "MAINTENANCE";
  onToggleHubNodeStatus: () => void;
}

const ICON_OPTIONS = [
  "Radio",
  "Cpu",
  "Bot",
  "CircuitBoard",
  "GraduationCap",
  "Keyboard",
  "Server",
];

const CATEGORY_PRESETS = [
  "IOT & EMBEDDED",
  "IC & SILICON",
  "AI & AUTOMATION",
  "EDA & PCB",
  "ACADEMIC & HID",
];

export const AppWorkspace: React.FC<AppWorkspaceProps> = ({
  appsData,
  onChangeAppsData,
  appNodeStatus,
  onToggleHubNodeStatus,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(
    appsData.apps[0]?.id || ""
  );

  const selectedApp =
    appsData.apps.find((a) => a.id === selectedAppId) || appsData.apps[0] || null;

  const updatePortalMeta = (field: keyof AppsData, value: string) => {
    onChangeAppsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSelectedApp = (patch: Partial<AppBladeItem>) => {
    if (!selectedApp) return;
    onChangeAppsData((prev) => ({
      ...prev,
      apps: prev.apps.map((item) =>
        item.id === selectedApp.id ? { ...item, ...patch } : item
      ),
    }));
  };

  const handleAddApp = () => {
    const nextNum = appsData.apps.length + 1;
    const formattedIndex = String(nextNum).padStart(2, "0");
    const newId = `app-${Date.now()}`;
    const newApp: AppBladeItem = {
      id: newId,
      index: formattedIndex,
      icon: "Cpu",
      code: `SYS-APP-${formattedIndex}`,
      category: "IC & SILICON",
      name: `Ứng dụng Kỹ thuật Mới #${formattedIndex}`,
      domain: `node${formattedIndex}.jevkayden.tech`,
      url: `https://node${formattedIndex}.jevkayden.tech`,
      repoUrl: "https://github.com/lionels-kayden/jevkayden-domain",
      status: "ONLINE",
      isLive: true,
      version: "v1.0.0",
      latency: "10ms",
      tagline: "Mô tả tóm tắt chức năng kỹ thuật của ứng dụng web con.",
      problemSolved:
        "Mô tả bài toán kỹ thuật cốt lõi mà ứng dụng này giải quyết và kiến trúc xử lý dữ liệu.",
      architecture: [
        "Input Layer / Hardware Sensor Interface",
        "Core Processing / Simulation Kernel",
        "WebSocket / REST API Telemetry Bus",
        "Next.js Interactive Visualization UI",
      ],
      features: [
        "Tính năng kỹ thuật cốt lõi số 1",
        "Tính năng kỹ thuật cốt lõi số 2",
        "Tính năng kỹ thuật cốt lõi số 3",
      ],
      techStack: ["Next.js", "TypeScript", "Verilog", "FastAPI"],
      metrics: [
        { label: "LATENCY", value: "10", unit: "ms" },
        { label: "UPTIME", value: "99.9%", unit: "SLA" },
        { label: "THROUGHPUT", value: "5,000", unit: "req/s" },
        { label: "VERSION", value: "v1.0", unit: "Stable" },
      ],
    };

    onChangeAppsData((prev) => ({
      ...prev,
      apps: [...prev.apps, newApp],
    }));
    setSelectedAppId(newId);
  };

  const handleDeleteApp = (id: string) => {
    if (appsData.apps.length <= 1) {
      alert("Cần giữ lại ít nhất 1 ứng dụng trong danh sách.");
      return;
    }
    const target = appsData.apps.find((a) => a.id === id);
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa ứng dụng "${target?.name || id}" (${target?.domain})?`
      )
    ) {
      return;
    }

    onChangeAppsData((prev) => {
      const remaining = prev.apps
        .filter((a) => a.id !== id)
        .map((a, idx) => ({
          ...a,
          index: String(idx + 1).padStart(2, "0"),
        }));
      if (selectedAppId === id && remaining[0]) {
        setSelectedAppId(remaining[0].id);
      }
      return {
        ...prev,
        apps: remaining,
      };
    });
  };

  const handleMoveApp = (id: string, direction: "up" | "down") => {
    onChangeAppsData((prev) => {
      const idx = prev.apps.findIndex((a) => a.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.apps.length) return prev;

      const copy = [...prev.apps];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);

      const reindexed = copy.map((item, i) => ({
        ...item,
        index: String(i + 1).padStart(2, "0"),
      }));

      return {
        ...prev,
        apps: reindexed,
      };
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#ece7df] p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5 overflow-y-auto">
      {/* ================================================================= */}
      {/* 1. PORTAL HEADER & DEFAULT VISUAL STYLE CONFIG                    */}
      {/* ================================================================= */}
      <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#00629B] text-white font-mono text-[10px] font-black uppercase">
                NODE 03 // APP.JEVKAYDEN.TECH
              </span>
              <span
                className={`px-2 py-0.5 font-mono text-[10px] font-black border ${
                  appNodeStatus === "ONLINE"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-700"
                    : "bg-amber-100 text-amber-900 border-amber-700"
                }`}
              >
                HUB STATUS: {appNodeStatus}
              </span>
            </div>
            <h1 className="font-sans font-black text-xl sm:text-2xl uppercase text-black mt-1">
              QUẢN TRỊ HỆ SINH THÁI ỨNG DỤNG CON (L3 SERVER BLADES CMS)
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleHubNodeStatus}
              className={`px-3 py-2 font-mono text-xs font-black uppercase border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_#000] ${
                appNodeStatus === "ONLINE"
                  ? "bg-emerald-300 hover:bg-emerald-400 text-black"
                  : "bg-amber-300 hover:bg-amber-400 text-black"
              }`}
            >
              {appNodeStatus === "ONLINE"
                ? "● CỔNG HUB: ONLINE"
                : "⏸ CỔNG HUB: STANDBY"}
            </button>

            <a
              href="/app"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-[#00629B] hover:bg-[#004b78] text-white font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] inline-flex items-center gap-1.5"
            >
              <span>MỞ /APP (L3 PORTAL)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Portal Metadata Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 font-mono text-xs">
          <div className="md:col-span-5">
            <label className="text-[11px] font-black text-zinc-700 block mb-1">
              TIÊU ĐỀ CỔNG (PORTAL TITLE):
            </label>
            <input
              type="text"
              value={appsData.portalTitle}
              onChange={(e) => updatePortalMeta("portalTitle", e.target.value)}
              className="w-full p-2 bg-zinc-50 border-2 border-black font-bold text-black"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-[11px] font-black text-zinc-700 block mb-1">
              MÃ TÀI LIỆU CHUẨN (DOCUMENT CODE):
            </label>
            <input
              type="text"
              value={appsData.documentCode}
              onChange={(e) => updatePortalMeta("documentCode", e.target.value)}
              className="w-full p-2 bg-zinc-50 border-2 border-black font-bold text-black"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-[11px] font-black text-zinc-700 block mb-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>GIAO DIỆN MẶC ĐỊNH:</span>
            </label>
            <select
              value={appsData.defaultStyle || "s4"}
              onChange={(e) =>
                updatePortalMeta(
                  "defaultStyle",
                  e.target.value as AppVisualStyle
                )
              }
              className="w-full p-2 bg-amber-50 border-2 border-black font-black text-black cursor-pointer"
            >
              <option value="s4">S4: Swiss IEEE Datasheet (Mặc định)</option>
              <option value="s1">S1: Neo-Brutalist</option>
              <option value="s2">S2: Vercel/Linear Clean SaaS</option>
              <option value="s3">S3: Silicon Dark Rack</option>
            </select>
          </div>

          <div className="md:col-span-12">
            <label className="text-[11px] font-black text-zinc-700 block mb-1">
              MÔ TẢ PHỤ (PORTAL SUBTITLE):
            </label>
            <input
              type="text"
              value={appsData.portalSubtitle}
              onChange={(e) =>
                updatePortalMeta("portalSubtitle", e.target.value)
              }
              className="w-full p-2 bg-zinc-50 border-2 border-black font-medium text-black"
            />
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. MASTER-DETAIL EDITOR: LEFT BLADE LIST (4 COL) + RIGHT FORM (8) */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: 6+ Child Web Apps List */}
        <div className="lg:col-span-4 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase">
              <Server className="w-4 h-4 text-[#00629B]" />
              <span>DANH SÁCH BLADES ({appsData.apps.length})</span>
            </div>
            <button
              type="button"
              onClick={handleAddApp}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-300 hover:bg-amber-400 text-black font-mono text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>THÊM APP</span>
            </button>
          </div>

          <div className="space-y-2">
            {appsData.apps.map((item, idx) => {
              const isSelected = selectedApp?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedAppId(item.id)}
                  className={`p-3 border-2 border-black cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-[#00629B] text-white shadow-[3px_3px_0px_0px_#000]"
                      : "bg-zinc-50 hover:bg-amber-50 text-black"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-black">
                      <span
                        className={`px-1.5 py-0.2 border ${
                          isSelected
                            ? "bg-white text-[#00629B] border-white"
                            : "bg-black text-amber-300 border-black"
                        }`}
                      >
                        {item.index}
                      </span>
                      <span className="truncate">{item.domain}</span>
                      <span
                        className={`px-1 py-0.2 text-[9px] ${
                          item.status === "STANDBY"
                            ? "bg-amber-200 text-black"
                            : "bg-emerald-300 text-black"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="font-sans font-bold text-xs truncate mt-1">
                      {item.name}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveApp(item.id, "up")}
                      className="p-1 bg-white text-black border border-black disabled:opacity-30 cursor-pointer"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === appsData.apps.length - 1}
                      onClick={() => handleMoveApp(item.id, "down")}
                      className="p-1 bg-white text-black border border-black disabled:opacity-30 cursor-pointer"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteApp(item.id)}
                      className="p-1 bg-rose-100 hover:bg-rose-300 text-rose-900 border border-black cursor-pointer"
                      title="Xóa ứng dụng"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Blade Editor */}
        {selectedApp && (
          <div className="lg:col-span-8 bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] space-y-5 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#00629B] text-white font-black text-sm">
                  BLADE {selectedApp.index}
                </span>
                <div>
                  <h2 className="font-sans font-black text-base text-black uppercase">
                    {selectedApp.name}
                  </h2>
                  <span className="text-[11px] text-[#00629B] font-bold">
                    {selectedApp.domain} ({selectedApp.code})
                  </span>
                </div>
              </div>

              <a
                href={selectedApp.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-300 hover:bg-emerald-400 text-black font-black border-2 border-black inline-flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
              >
                <span>TEST LINK ↗</span>
              </a>
            </div>

            {/* Row 1: Identity & Subdomain Links */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  INDEX:
                </label>
                <input
                  type="text"
                  value={selectedApp.index}
                  onChange={(e) =>
                    updateSelectedApp({ index: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-black"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  MÃ SPEC (CODE):
                </label>
                <input
                  type="text"
                  value={selectedApp.code}
                  onChange={(e) => updateSelectedApp({ code: e.target.value })}
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  CHUYÊN MỤC (CATEGORY):
                </label>
                <input
                  type="text"
                  list="app-category-presets"
                  value={selectedApp.category}
                  onChange={(e) =>
                    updateSelectedApp({ category: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold"
                />
                <datalist id="app-category-presets">
                  {CATEGORY_PRESETS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  BIỂU TƯỢNG (ICON):
                </label>
                <select
                  value={selectedApp.icon}
                  onChange={(e) => updateSelectedApp({ icon: e.target.value })}
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold cursor-pointer"
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Name, Subdomain, Target URL, Repo URL */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-12">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  TÊN ỨNG DỤNG KỸ THUẬT (APPLICATION NAME):
                </label>
                <input
                  type="text"
                  value={selectedApp.name}
                  onChange={(e) => updateSelectedApp({ name: e.target.value })}
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold text-sm"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  SUBDOMAIN (VD: iot.jevkayden.tech):
                </label>
                <input
                  type="text"
                  value={selectedApp.domain}
                  onChange={(e) =>
                    updateSelectedApp({ domain: e.target.value })
                  }
                  className="w-full p-2 bg-sky-50 border-2 border-black font-black text-[#00629B]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  TARGET URL (LINK KHI BẤM LAUNCH):
                </label>
                <input
                  type="text"
                  value={selectedApp.url}
                  onChange={(e) => updateSelectedApp({ url: e.target.value })}
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  GITHUB REPO URL:
                </label>
                <input
                  type="text"
                  value={selectedApp.repoUrl}
                  onChange={(e) =>
                    updateSelectedApp({ repoUrl: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold"
                />
              </div>
            </div>

            {/* Row 3: Status, Version, Latency */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  TRẠNG THÁI (STATUS):
                </label>
                <select
                  value={selectedApp.status}
                  onChange={(e) =>
                    updateSelectedApp({
                      status: e.target.value as AppStatus,
                      isLive: e.target.value !== "STANDBY",
                    })
                  }
                  className="w-full p-2 bg-emerald-50 border-2 border-black font-black cursor-pointer"
                >
                  <option value="PRODUCTION">PRODUCTION</option>
                  <option value="ONLINE">ONLINE</option>
                  <option value="BETA">BETA</option>
                  <option value="STANDBY">STANDBY</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  PHIÊN BẢN (VERSION):
                </label>
                <input
                  type="text"
                  value={selectedApp.version}
                  onChange={(e) =>
                    updateSelectedApp({ version: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  ĐỘ TRỄ / TELEMETRY (LATENCY):
                </label>
                <input
                  type="text"
                  value={selectedApp.latency}
                  onChange={(e) =>
                    updateSelectedApp({ latency: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-bold"
                />
              </div>
            </div>

            {/* Row 4: Tagline & Problem Solved */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  MÔ TẢ NGẮN TRÊN THANH BLADE (TAGLINE):
                </label>
                <textarea
                  rows={2}
                  value={selectedApp.tagline}
                  onChange={(e) =>
                    updateSelectedApp({ tagline: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-sans text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  BÀI TOÁN KỸ THUẬT GIẢI QUYẾT (DRAWER COL 1 — PROBLEM SOLVED):
                </label>
                <textarea
                  rows={3}
                  value={selectedApp.problemSolved}
                  onChange={(e) =>
                    updateSelectedApp({ problemSolved: e.target.value })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-sans text-xs font-medium"
                />
              </div>
            </div>

            {/* Row 5: Architecture Pipeline, Features & Tech Stack (Line-separated) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-zinc-600 block mb-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#00629B]" />
                  <span>CHUỖI KIẾN TRÚC PIPELINE (MỖI DÒNG 1 BƯỚC):</span>
                </label>
                <textarea
                  rows={4}
                  value={selectedApp.architecture.join("\n")}
                  onChange={(e) =>
                    updateSelectedApp({
                      architecture: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-600 block mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>TÍNH NĂNG KỸ THUẬT (MỖI DÒNG 1 Ý):</span>
                </label>
                <textarea
                  rows={4}
                  value={selectedApp.features.join("\n")}
                  onChange={(e) =>
                    updateSelectedApp({
                      features: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-sans text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-zinc-600 block mb-1">
                  TECH STACK (PHÂN CÁCH BẰNG DẤU PHẨY):
                </label>
                <input
                  type="text"
                  value={selectedApp.techStack.join(", ")}
                  onChange={(e) =>
                    updateSelectedApp({
                      techStack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full p-2 bg-zinc-50 border-2 border-black font-mono text-xs font-bold"
                />
              </div>
            </div>

            {/* Row 6: 4 Telemetry Metrics Editor */}
            <div className="space-y-2 pt-2 border-t-2 border-black/20">
              <label className="text-[10px] font-black text-zinc-600 block">
                CHỈ SỐ TELEMETRY TRONG NGĂN KÉO SỐ 3 (4 METRICS):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {selectedApp.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-2.5 bg-zinc-50 border-2 border-black space-y-1.5"
                  >
                    <input
                      type="text"
                      value={m.label}
                      placeholder="Nhãn (VD: LATENCY)"
                      onChange={(e) => {
                        const nextMetrics = [...selectedApp.metrics];
                        nextMetrics[mIdx] = {
                          ...nextMetrics[mIdx],
                          label: e.target.value,
                        };
                        updateSelectedApp({ metrics: nextMetrics });
                      }}
                      className="w-full p-1 bg-white border border-black text-[10px] font-bold uppercase"
                    />
                    <input
                      type="text"
                      value={m.value}
                      placeholder="Giá trị (VD: 11.4)"
                      onChange={(e) => {
                        const nextMetrics = [...selectedApp.metrics];
                        nextMetrics[mIdx] = {
                          ...nextMetrics[mIdx],
                          value: e.target.value,
                        };
                        updateSelectedApp({ metrics: nextMetrics });
                      }}
                      className="w-full p-1 bg-white border border-black text-xs font-black text-[#00629B]"
                    />
                    <input
                      type="text"
                      value={m.unit || ""}
                      placeholder="Đơn vị (VD: ms)"
                      onChange={(e) => {
                        const nextMetrics = [...selectedApp.metrics];
                        nextMetrics[mIdx] = {
                          ...nextMetrics[mIdx],
                          unit: e.target.value,
                        };
                        updateSelectedApp({ metrics: nextMetrics });
                      }}
                      className="w-full p-1 bg-white border border-black text-[10px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
