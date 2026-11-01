"use client";

import React, { useState } from "react";
import { HubData } from "@/types/hub";
import { HubLivePreview } from "./HubLivePreview";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Globe,
  Radio,
  Sparkles,
} from "lucide-react";

interface HubWorkspaceProps {
  hubData: HubData;
  setHubData: React.Dispatch<React.SetStateAction<HubData>>;
}

type HubTab = "hero" | "subdomains" | "marquee" | "pager";

export const HubWorkspace: React.FC<HubWorkspaceProps> = ({ hubData, setHubData }) => {
  const [activeTab, setActiveTab] = useState<HubTab>("hero");

  const inputSansClass =
    "w-full p-2.5 border-2 border-black bg-white font-sans text-sm font-semibold text-black leading-relaxed focus:bg-amber-50/50 outline-none";
  const inputMonoClass =
    "w-full p-2.5 border-2 border-black bg-white font-mono text-xs font-bold text-black focus:bg-amber-50/50 outline-none";
  const textareaSansClass =
    "w-full p-3 border-2 border-black bg-white font-sans text-sm font-normal text-black leading-relaxed min-h-[90px] focus:bg-amber-50/50 outline-none";
  const labelClass =
    "font-mono text-[11px] font-black uppercase text-zinc-700 block mb-1 tracking-wide";

  // Subdomain status toggle
  const toggleSubdomainStatus = (id: "blog" | "cv" | "app") => {
    setHubData((prev) => {
      const updated = prev.subdomains.map((node) => {
        if (node.id === id) {
          const newStatus = node.status === "ONLINE" ? "STANDBY" : "ONLINE";
          return { ...node, status: newStatus as "ONLINE" | "STANDBY" };
        }
        return node;
      });
      return { ...prev, subdomains: updated };
    });
  };

  // Add marquee item
  const handleAddMarqueeItem = () => {
    setHubData((prev) => ({
      ...prev,
      techMarquee: [
        ...prev.techMarquee,
        { name: "New Tech", category: "HARDWARE", tag: "CORE" },
      ],
    }));
  };

  // Delete marquee item
  const handleDeleteMarqueeItem = (index: number) => {
    setHubData((prev) => {
      const updated = [...prev.techMarquee];
      updated.splice(index, 1);
      return { ...prev, techMarquee: updated };
    });
  };

  // Move marquee item
  const handleMoveMarqueeItem = (index: number, direction: "up" | "down") => {
    setHubData((prev) => {
      const updated = [...prev.techMarquee];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[target];
      updated[target] = temp;
      return { ...prev, techMarquee: updated };
    });
  };

  return (
    <div className="flex-1 min-h-0 lg:h-[calc(100vh-56px)] lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#ece7df]">
      {/* ========================================================= */}
      {/* LEFT COLUMN: 5 COLS — SECTION TABS + INDEPENDENT FORM SCROLL */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 h-full overflow-y-auto border-r-2 border-black bg-white flex flex-col">
        {/* Sticky 2x2 Section Tabs INSIDE the Left Column */}
        <div className="sticky top-0 z-20 bg-slate-100 p-2 border-b-2 border-black grid grid-cols-2 gap-1.5 shrink-0 select-none shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`py-2 px-2 font-mono text-[11px] font-black uppercase text-center border-2 border-black cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "hero"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-white hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            <Sparkles className="w-3 h-3 text-black shrink-0" />
            <span>1. HERO & BIO</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subdomains")}
            className={`py-2 px-2 font-mono text-[11px] font-black uppercase text-center border-2 border-black cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "subdomains"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-white hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            <Globe className="w-3 h-3 text-black shrink-0" />
            <span>2. SUBDOMAINS</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("marquee")}
            className={`py-2 px-2 font-mono text-[11px] font-black uppercase text-center border-2 border-black cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "marquee"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-white hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            <Layers className="w-3 h-3 text-black shrink-0" />
            <span>3. MARQUEE ({hubData.techMarquee.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pager")}
            className={`py-2 px-2 font-mono text-[11px] font-black uppercase text-center border-2 border-black cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "pager"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-white hover:bg-zinc-100 text-zinc-700"
            }`}
          >
            <Radio className="w-3 h-3 text-black shrink-0" />
            <span>4. PAGER & CONTACT</span>
          </button>
        </div>

        {/* Active Section Form Body (Full-height white background, no void) */}
        <div className="p-5 flex-1 space-y-5 bg-white">
          {/* TAB 1: HERO & BIO */}
          {activeTab === "hero" && (
            <div className="space-y-4">
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <h2 className="font-sans font-black text-base uppercase text-black">
                  CẤU HÌNH HERO TERMINAL & ĐỊNH DANH
                </h2>
                <span className="font-mono text-[10px] text-zinc-500">HOMEPAGE IDENTITY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>HỌ VÀ TÊN / FULL NAME:</label>
                  <input
                    type="text"
                    value={hubData.hero.fullName}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, fullName: e.target.value },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>BIỆT DANH / ALIAS:</label>
                  <input
                    type="text"
                    value={hubData.hero.alias}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, alias: e.target.value },
                      }))
                    }
                    className={inputMonoClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>CHỨC DANH CHÍNH [VI]:</label>
                  <input
                    type="text"
                    value={hubData.hero.role.vi}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          role: { ...prev.hero.role, vi: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>PRIMARY ROLE [EN]:</label>
                  <input
                    type="text"
                    value={hubData.hero.role.en}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          role: { ...prev.hero.role, en: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>CHỨC DANH CHI TIẾT [VI]:</label>
                  <input
                    type="text"
                    value={hubData.hero.subRole.vi}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          subRole: { ...prev.hero.subRole, vi: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>DETAILED ROLE [EN]:</label>
                  <input
                    type="text"
                    value={hubData.hero.subRole.en}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          subRole: { ...prev.hero.subRole, en: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>KHOA & TRƯỜNG ĐÀO TẠO [VI]:</label>
                  <input
                    type="text"
                    value={hubData.hero.faculty.vi}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          faculty: { ...prev.hero.faculty, vi: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>FACULTY & INSTITUTION [EN]:</label>
                  <input
                    type="text"
                    value={hubData.hero.faculty.en}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          faculty: { ...prev.hero.faculty, en: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>TRẠNG THÁI HOẠT ĐỘNG [VI]:</label>
                  <input
                    type="text"
                    value={hubData.hero.status.vi}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          status: { ...prev.hero.status, vi: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>OPERATIONAL STATUS [EN]:</label>
                  <input
                    type="text"
                    value={hubData.hero.status.en}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          status: { ...prev.hero.status, en: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>ĐỊA ĐIỂM / LOCATION [VI]:</label>
                  <input
                    type="text"
                    value={hubData.hero.location.vi}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          location: { ...prev.hero.location, vi: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>LOCATION [EN]:</label>
                  <input
                    type="text"
                    value={hubData.hero.location.en}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          location: { ...prev.hero.location, en: e.target.value },
                        },
                      }))
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>TIỂU SỬ KỸ THUẬT (BIO) [VI]:</label>
                <textarea
                  value={hubData.hero.bio.vi}
                  onChange={(e) =>
                    setHubData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        bio: { ...prev.hero.bio, vi: e.target.value },
                      },
                    }))
                  }
                  className={textareaSansClass}
                />
              </div>

              <div>
                <label className={labelClass}>TECHNICAL BIO [EN]:</label>
                <textarea
                  value={hubData.hero.bio.en}
                  onChange={(e) =>
                    setHubData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        bio: { ...prev.hero.bio, en: e.target.value },
                      },
                    }))
                  }
                  className={textareaSansClass}
                />
              </div>

              {/* Slogan & Highlights */}
              <div className="border-t-2 border-black pt-3 space-y-3">
                <label className="font-mono text-xs font-black uppercase text-black block">
                  BIỂU NGỮ TRANG CHỦ (HEADLINE SLOGAN & HIGHLIGHTS)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>TIỀN TỐ [VI]:</label>
                    <input
                      type="text"
                      value={hubData.hero.headlinePrefix.vi}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlinePrefix: { ...prev.hero.headlinePrefix, vi: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>PREFIX [EN]:</label>
                    <input
                      type="text"
                      value={hubData.hero.headlinePrefix.en}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlinePrefix: { ...prev.hero.headlinePrefix, en: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>ĐIỂM NHẤN 1 (VÀNG) [VI]:</label>
                    <input
                      type="text"
                      value={hubData.hero.highlight1.vi}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            highlight1: { ...prev.hero.highlight1, vi: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>HIGHLIGHT 1 [EN]:</label>
                    <input
                      type="text"
                      value={hubData.hero.highlight1.en}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            highlight1: { ...prev.hero.highlight1, en: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>CỤM GIỮA [VI]:</label>
                    <input
                      type="text"
                      value={hubData.hero.headlineMid.vi}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlineMid: { ...prev.hero.headlineMid, vi: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>MIDDLE PHRASE [EN]:</label>
                    <input
                      type="text"
                      value={hubData.hero.headlineMid.en}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlineMid: { ...prev.hero.headlineMid, en: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>ĐIỂM NHẤN 2 (VÀNG) [VI]:</label>
                    <input
                      type="text"
                      value={hubData.hero.highlight2.vi}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            highlight2: { ...prev.hero.highlight2, vi: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>HIGHLIGHT 2 [EN]:</label>
                    <input
                      type="text"
                      value={hubData.hero.highlight2.en}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            highlight2: { ...prev.hero.highlight2, en: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>HẬU TỐ [VI]:</label>
                    <input
                      type="text"
                      value={hubData.hero.headlineSuffix.vi}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlineSuffix: { ...prev.hero.headlineSuffix, vi: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>SUFFIX [EN]:</label>
                    <input
                      type="text"
                      value={hubData.hero.headlineSuffix.en}
                      onChange={(e) =>
                        setHubData((prev) => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            headlineSuffix: { ...prev.hero.headlineSuffix, en: e.target.value },
                          },
                        }))
                      }
                      className={inputSansClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBDOMAINS */}
          {activeTab === "subdomains" && (
            <div className="space-y-4">
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <h2 className="font-sans font-black text-base uppercase text-black">
                  TRẠNG THÁI 3 TÊN MIỀN PHÂN HỆ (SUBDOMAINS)
                </h2>
                <span className="font-mono text-[10px] text-zinc-500">EDGE ROUTING</span>
              </div>

              <div className="space-y-4">
                {hubData.subdomains.map((sub) => {
                  const isOnline = sub.status === "ONLINE";
                  return (
                    <div
                      key={sub.id}
                      className="p-4 border-2 border-black bg-zinc-50 shadow-[3px_3px_0px_0px_#000] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2">
                        <div>
                          <span className="font-mono text-xs font-black text-black">
                            {sub.name}
                          </span>
                          <span className="font-mono text-xs text-zinc-500 block">
                            {sub.subdomain}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSubdomainStatus(sub.id)}
                          className={`px-3 py-1 font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-y-0.5 transition-colors ${
                            isOnline
                              ? "bg-emerald-400 hover:bg-emerald-300 text-black"
                              : "bg-amber-300 hover:bg-amber-200 text-black"
                          }`}
                        >
                          {isOnline ? "● ONLINE (ĐANG CHẠY)" : "○ STANDBY (TẠM NGHỈ)"}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className={labelClass}>MÔ TẢ NGẮN [VI]:</label>
                          <input
                            type="text"
                            value={sub.description.vi}
                            onChange={(e) => {
                              const updated = hubData.subdomains.map((s) =>
                                s.id === sub.id
                                  ? {
                                      ...s,
                                      description: { ...s.description, vi: e.target.value },
                                    }
                                  : s
                              );
                              setHubData({ ...hubData, subdomains: updated });
                            }}
                            className={inputSansClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>DESCRIPTION [EN]:</label>
                          <input
                            type="text"
                            value={sub.description.en}
                            onChange={(e) => {
                              const updated = hubData.subdomains.map((s) =>
                                s.id === sub.id
                                  ? {
                                      ...s,
                                      description: { ...s.description, en: e.target.value },
                                    }
                                  : s
                              );
                              setHubData({ ...hubData, subdomains: updated });
                            }}
                            className={inputSansClass}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MARQUEE */}
          {activeTab === "marquee" && (
            <div className="space-y-4">
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <div>
                  <h2 className="font-sans font-black text-base uppercase text-black">
                    TECH MARQUEE ({hubData.techMarquee.length} ITEMS)
                  </h2>
                  <span className="font-mono text-[10px] text-zinc-500">
                    BĂNG CHUYỀN HUY HIỆU CÔNG NGHỆ CHẠY VÔ TẬN
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddMarqueeItem}
                  className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-amber-300 font-mono text-xs font-black border-2 border-black flex items-center gap-1 cursor-pointer active:translate-y-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>THÊM BADGE</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {hubData.techMarquee.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 border-2 border-black bg-zinc-50 flex items-center gap-2 text-xs"
                  >
                    <span className="font-mono font-bold text-zinc-400 w-6">#{idx + 1}</span>

                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...hubData.techMarquee];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setHubData({ ...hubData, techMarquee: updated });
                      }}
                      placeholder="Tên công nghệ (VD: RISC-V)"
                      className="flex-1 p-1.5 border border-black font-sans font-bold bg-white"
                    />

                    <select
                      value={item.category}
                      onChange={(e) => {
                        const updated = [...hubData.techMarquee];
                        updated[idx] = { ...updated[idx], category: e.target.value };
                        setHubData({ ...hubData, techMarquee: updated });
                      }}
                      className="p-1.5 border border-black font-mono text-[11px] bg-white font-bold"
                    >
                      <option value="HARDWARE">HARDWARE</option>
                      <option value="EMBEDDED">EMBEDDED</option>
                      <option value="IOT">IOT</option>
                      <option value="CIRCUIT">CIRCUIT</option>
                      <option value="DEVOPS">DEVOPS</option>
                      <option value="BACKEND">BACKEND</option>
                      <option value="WEB">WEB</option>
                    </select>

                    <input
                      type="text"
                      value={item.tag}
                      onChange={(e) => {
                        const updated = [...hubData.techMarquee];
                        updated[idx] = { ...updated[idx], tag: e.target.value.toUpperCase() };
                        setHubData({ ...hubData, techMarquee: updated });
                      }}
                      placeholder="TAG (VD: CORE)"
                      className="w-20 p-1.5 border border-black font-mono font-bold uppercase bg-white text-center"
                    />

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveMarqueeItem(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 bg-white border border-black hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMarqueeItem(idx, "down")}
                        disabled={idx === hubData.techMarquee.length - 1}
                        className="p-1 bg-white border border-black hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMarqueeItem(idx)}
                        className="p-1 bg-red-100 border border-black hover:bg-red-200 text-red-700 cursor-pointer"
                        title="Xóa mục này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAGER & CONTACT */}
          {activeTab === "pager" && (
            <div className="space-y-4">
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <h2 className="font-sans font-black text-base uppercase text-black">
                  MOTOROLA BRAVO PLUS // PAGER & LIÊN HỆ
                </h2>
                <span className="font-mono text-[10px] text-zinc-500">PAGER TELEMETRY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelClass}>MÃ PAGER (PAGER ID):</label>
                  <input
                    type="text"
                    value={hubData.pagerContact.pagerId}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        pagerContact: {
                          ...prev.pagerContact,
                          pagerId: e.target.value,
                        },
                      }))
                    }
                    className={inputMonoClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>EMAIL LIÊN HỆ:</label>
                  <input
                    type="email"
                    value={hubData.pagerContact.email}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        pagerContact: {
                          ...prev.pagerContact,
                          email: e.target.value,
                        },
                      }))
                    }
                    className={inputMonoClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>KÊNH TRUYỀN (CHANNEL):</label>
                  <input
                    type="text"
                    value={hubData.pagerContact.channel}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        pagerContact: { ...prev.pagerContact, channel: e.target.value },
                      }))
                    }
                    className={inputMonoClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>GIỜ HOẠT ĐỘNG (HOURS):</label>
                  <input
                    type="text"
                    value={hubData.pagerContact.operatingHours}
                    onChange={(e) =>
                      setHubData((prev) => ({
                        ...prev,
                        pagerContact: {
                          ...prev.pagerContact,
                          operatingHours: e.target.value,
                        },
                      }))
                    }
                    className={inputMonoClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>THÔNG ĐIỆP KÊNH [VI]:</label>
                <textarea
                  value={hubData.pagerContact.statusMessage.vi}
                  onChange={(e) =>
                    setHubData((prev) => ({
                      ...prev,
                      pagerContact: {
                        ...prev.pagerContact,
                        statusMessage: {
                          ...prev.pagerContact.statusMessage,
                          vi: e.target.value,
                        },
                      },
                    }))
                  }
                  className={textareaSansClass}
                />
              </div>

              <div>
                <label className={labelClass}>CHANNEL STATUS MESSAGE [EN]:</label>
                <textarea
                  value={hubData.pagerContact.statusMessage.en}
                  onChange={(e) =>
                    setHubData((prev) => ({
                      ...prev,
                      pagerContact: {
                        ...prev.pagerContact,
                        statusMessage: {
                          ...prev.pagerContact.statusMessage,
                          en: e.target.value,
                        },
                      },
                    }))
                  }
                  className={textareaSansClass}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: 7 COLS — FULL INTERACTIVE LIVE HUB PREVIEW */}
      {/* ========================================================= */}
      <div className="lg:col-span-7 h-full overflow-y-auto bg-[#F4F6F9] p-4 sm:p-5">
        <HubLivePreview hubData={hubData} />
      </div>
    </div>
  );
};
