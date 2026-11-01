"use client";

import React from "react";
import {
  Globe,
  FileText,
  BookOpen,
  Cpu,
  Database,
  Plus,
  ArrowRight,
  Activity,
  Terminal,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FolderTree,
  Archive,
  Rocket,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export type AdminTenant = "launchpad" | "hub" | "cv" | "blog" | "app" | "sync";

export interface LaunchpadViewProps {
  onSelectTenant: (tenant: AdminTenant) => void;
  cvUpdated: string;
  cvProjectsCount: number;
  blogCount: number;
  categoryCount: number;
  subCategoryCount: number;
  siteStatus: string;
  marqueeCount: number;
  pagerChannel: string;
  subdomainStatuses: {
    blog: "ONLINE" | "STANDBY" | "MAINTENANCE";
    cv: "ONLINE" | "STANDBY" | "MAINTENANCE";
    app: "ONLINE" | "STANDBY" | "MAINTENANCE";
  };
  onExportBackup: () => void;
  onRestoreBackupClick: () => void;
  isBackingUp: boolean;
  isRestoring: boolean;
  backupMessage: { type: "success" | "error" | "info"; text: string } | null;
  onGitPublish?: () => void;
  isPublishing?: boolean;
  publishStatus?: { type: "success" | "error" | "info"; text: string } | null;
}

export const LaunchpadView: React.FC<LaunchpadViewProps> = ({
  onSelectTenant,
  cvUpdated,
  cvProjectsCount,
  blogCount,
  categoryCount,
  subCategoryCount,
  siteStatus,
  marqueeCount,
  pagerChannel,
  subdomainStatuses,
  onExportBackup,
  onRestoreBackupClick,
  isBackingUp,
  isRestoring,
  backupMessage,
  onGitPublish,
  isPublishing = false,
  publishStatus = null,
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 select-none">
      {/* 1. HERO BANNER / LAUNCHPAD HEADER */}
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-black text-amber-300 font-mono text-xs font-black px-4 py-1.5 uppercase border-b-2 border-l-2 border-black flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>STAGE 1 // MULTI-SITE LAUNCHPAD</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-100 border-2 border-black text-[11px] font-mono font-black text-black">
            <Terminal className="w-3.5 h-3.5" />
            <span>CENTRAL MULTI-SITE COMMAND CENTER [CLEAN 3-NODE ARCHITECTURE]</span>
          </div>

          <div className="flex items-center gap-3">
            <BrandLogo variant="admin" size={38} />
            <h1 className="text-2xl sm:text-4xl font-black font-sans uppercase tracking-tight text-black">
              TRUNG TÂM ĐIỀU HÀNH TOÀN CỤC // SẢNH CHÍNH ADMIN
            </h1>
          </div>

          <p className="font-sans text-sm sm:text-base text-zinc-700 max-w-3xl leading-relaxed">
            Hạ tầng quản trị 2 cấp độc lập. Chọn một phân hệ tên miền sản xuất bên dưới để vào{" "}
            <strong>Dedicated Workspace</strong> hoặc sử dụng tiện ích sao lưu/khôi phục toàn hệ thống bên dưới.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t-2 border-black/10 font-mono text-xs">
            <div className="p-2.5 bg-zinc-50 border-2 border-black">
              <span className="text-zinc-500 text-[10px] block font-bold">NODE 00 (HUB):</span>
              <span className="text-sm font-black text-black">ONLINE // 3 DOMAINS</span>
            </div>
            <div className="p-2.5 bg-zinc-50 border-2 border-black">
              <span className="text-zinc-500 text-[10px] block font-bold">NODE 01 (CV):</span>
              <span className="text-sm font-black text-emerald-700">
                {cvProjectsCount} DỰ ÁN // {cvUpdated ? new Date(cvUpdated).toLocaleDateString("vi-VN") : "SYNC READY"}
              </span>
            </div>
            <div className="p-2.5 bg-zinc-50 border-2 border-black">
              <span className="text-zinc-500 text-[10px] block font-bold">NODE 02 (BLOG):</span>
              <span className="text-sm font-black text-sky-700">
                {blogCount} BÀI // {categoryCount} CHUYÊN MỤC
              </span>
            </div>
            <div className="p-2.5 bg-zinc-50 border-2 border-black">
              <span className="text-zinc-500 text-[10px] block font-bold">HỆ THỐNG LƯU TRỮ:</span>
              <span className="text-sm font-black text-amber-700">REST API + JSON DISK</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT 3-NODE CORE PRODUCTION WORKSPACES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black"></div>
            <h2 className="font-mono text-xs font-black uppercase tracking-wider text-black">
              KHÔNG GIAN LÀM VIỆC CHUYÊN BIỆT CHÍNH // CORE PRODUCTION WORKSPACES
            </h2>
          </div>
          <span className="font-mono text-[11px] text-zinc-500 font-bold">3 ACTIVE WORKSPACES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 0: NODE 00 // MAIN HUB */}
          <div
            onClick={() => onSelectTenant("hub")}
            className="group bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-300 border-2 border-black flex items-center justify-center font-black">
                    <Globe className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black text-zinc-500 block">NODE 00</span>
                    <span className="font-sans font-black text-base text-black">MAIN HUB</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border-2 border-emerald-700 text-emerald-900 font-mono text-[10px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  ONLINE
                </span>
              </div>

              <div className="bg-amber-50 border-2 border-black px-2.5 py-1.5 font-mono text-xs font-bold text-black mb-3 flex items-center justify-between">
                <span>jevkayden.tech</span>
                <span className="text-[10px] text-amber-800 uppercase font-black">PORT :443</span>
              </div>

              <p className="font-sans text-xs text-zinc-600 leading-relaxed mb-4">
                Cổng chào định danh kỹ thuật, cấu hình Hero Terminal, Bio VNU-UET, biểu ngữ Tech Marquee và trạng thái bật/tắt 3 subdomain.
              </p>

              {/* Dynamic Live Metrics */}
              <div className="space-y-1.5 font-mono text-xs bg-zinc-50 p-2.5 border-2 border-black/20">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">TRẠNG THÁI BIO:</span>
                  <span className="font-black text-emerald-700 truncate max-w-[140px]" title={siteStatus}>
                    {siteStatus || "SẴN SÀNG"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">TECH BADGES:</span>
                  <span className="font-black text-black">{marqueeCount} CHIP & PHẦN CỨNG</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">PAGER CHANNEL:</span>
                  <span className="font-black text-amber-700">{pagerChannel || "CH-04"}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-black">
                TRUY CẬP WORKSPACE
              </span>
              <div className="w-8 h-8 bg-black text-amber-300 border-2 border-black flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* CARD 1: NODE 01 // CV DOSSIER */}
          <div
            onClick={() => onSelectTenant("cv")}
            className="group bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-300 border-2 border-black flex items-center justify-center font-black">
                    <FileText className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black text-zinc-500 block">NODE 01</span>
                    <span className="font-sans font-black text-base text-black">CV DOSSIER</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border-2 border-emerald-700 text-emerald-900 font-mono text-[10px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  {subdomainStatuses.cv}
                </span>
              </div>

              <div className="bg-emerald-50 border-2 border-black px-2.5 py-1.5 font-mono text-xs font-bold text-black mb-3 flex items-center justify-between">
                <span>cv.jevkayden.tech</span>
                <span className="text-[10px] text-emerald-800 uppercase font-black">PORT :8080</span>
              </div>

              <p className="font-sans text-xs text-zinc-600 leading-relaxed mb-4">
                Hệ thống hồ sơ kỹ sư 6 mẫu giao diện (T1–T6) chuẩn công nghiệp, in ấn A4 dual-mode màu & đen trắng tối ưu ATS.
              </p>

              {/* Dynamic Live Metrics */}
              <div className="space-y-1.5 font-mono text-xs bg-zinc-50 p-2.5 border-2 border-black/20">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">DỰ ÁN PHẦN CỨNG:</span>
                  <span className="font-black text-emerald-700">{cvProjectsCount} DỰ ÁN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">GIAO DIỆN IN ẤN:</span>
                  <span className="font-black text-black">6 TEMPLATES ATS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">LẦN ĐỒNG BỘ:</span>
                  <span className="font-black text-zinc-700">
                    {cvUpdated ? new Date(cvUpdated).toLocaleDateString("vi-VN") : "SẴN SÀNG"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-black">
                TRUY CẬP WORKSPACE
              </span>
              <div className="w-8 h-8 bg-black text-amber-300 border-2 border-black flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* CARD 2: NODE 02 // TECHNICAL ARCHIVE (BLOG) */}
          <div
            onClick={() => onSelectTenant("blog")}
            className="group bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-sky-300 border-2 border-black flex items-center justify-center font-black">
                    <BookOpen className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black text-zinc-500 block">NODE 02</span>
                    <span className="font-sans font-black text-base text-black">TECHNICAL ARCHIVE</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border-2 border-emerald-700 text-emerald-900 font-mono text-[10px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  {subdomainStatuses.blog}
                </span>
              </div>

              <div className="bg-sky-50 border-2 border-black px-2.5 py-1.5 font-mono text-xs font-bold text-black mb-3 flex items-center justify-between">
                <span>blog.jevkayden.tech</span>
                <span className="text-[10px] text-sky-800 uppercase font-black">PORT :443</span>
              </div>

              <p className="font-sans text-xs text-zinc-600 leading-relaxed mb-4">
                Vườn tri thức số, nghiên cứu vi mạch RISC-V, hệ thống nhúng & trình soạn thảo Markdown tương thích Obsidian.
              </p>

              {/* Dynamic Live Metrics */}
              <div className="space-y-1.5 font-mono text-xs bg-zinc-50 p-2.5 border-2 border-black/20">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">TỔNG BÀI VIẾT:</span>
                  <span className="font-black text-sky-700">{blogCount} BÀI VIẾT SẴN SÀNG</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">CÂY CHUYÊN MỤC:</span>
                  <span className="font-black text-black">
                    {categoryCount} GỐC + {subCategoryCount} NHÁNH CON
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-[11px]">ĐỊNH DẠNG HỖ TRỢ:</span>
                  <span className="font-black text-zinc-700">MD / LATEX / MERMAID</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t-2 border-black flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-black">
                TRUY CẬP WORKSPACE
              </span>
              <div className="w-8 h-8 bg-black text-amber-300 border-2 border-black flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AUXILIARY / EXTENSIBLE NODES */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 bg-zinc-400"></div>
          <h3 className="font-mono text-[11px] font-black uppercase tracking-wider text-zinc-600">
            PHÂN HỆ BỔ TRỢ & KHÔNG GIAN MỞ RỘNG // AUXILIARY LAB & CLOUD NODES
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CARD 3: 03 // APP LAB */}
          <div
            onClick={() => onSelectTenant("app")}
            className="group bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-200 border-2 border-black flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-zinc-500">NODE 03</span>
                  <span className="font-sans font-black text-xs text-black">APP LAB</span>
                  <span className="px-1.5 py-0.2 bg-amber-100 border border-amber-600 text-amber-900 font-mono text-[9px] font-black">
                    STANDBY
                  </span>
                </div>
                <span className="font-mono text-[11px] text-zinc-600">app.jevkayden.tech</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
          </div>

          {/* CARD 4: SYS // MULTI-SYNC CLOUD */}
          <div
            onClick={() => onSelectTenant("sync")}
            className="group bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-200 border-2 border-black flex items-center justify-center">
                <Database className="w-5 h-5 text-rose-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-zinc-500">SYS</span>
                  <span className="font-sans font-black text-xs text-black">MULTI-SYNC</span>
                  <span className="px-1.5 py-0.2 bg-blue-100 border border-blue-600 text-blue-900 font-mono text-[9px] font-black">
                    READY
                  </span>
                </div>
                <span className="font-mono text-[11px] text-zinc-600">cloud.jevkayden.tech</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
          </div>

          {/* CARD 5: + [EXTENSIBLE SLOT] */}
          <div className="bg-zinc-100 border-2 border-dashed border-zinc-400 p-4 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-200 border border-zinc-400 flex items-center justify-center">
                <Plus className="w-4 h-4 text-zinc-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-black text-zinc-500">NODE 04+</span>
                  <span className="font-sans font-black text-xs text-zinc-600">RESERVED SLOT</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">future.jevkayden.tech</span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold text-zinc-400">[OPEN]</span>
          </div>
        </div>
      </div>

      {/* 4. SYSTEM BACKUP & SNAPSHOT UTILITY PANEL */}
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center">
              <Archive className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-mono text-xs font-black text-amber-800 uppercase block">
                SYSTEM SNAPSHOT & DISASTER RECOVERY
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight text-black">
                TIỆN ÍCH SAO LƯU & KHÔI PHỤC TOÀN HỆ THỐNG
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] bg-zinc-100 border-2 border-black px-3 py-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-black text-black">TIÊU CHUẨN JSON SNAPSHOT V1.0</span>
          </div>
        </div>

        <p className="font-sans text-sm text-zinc-700 leading-relaxed max-w-4xl">
          Xuất hoặc khôi phục đồng thời toàn bộ dữ liệu cấu hình của cả 3 phân hệ cốt lõi:{" "}
          <strong>Main Site Hub</strong> (<code className="bg-zinc-100 px-1 py-0.5 border border-black/20 text-xs">/api/site</code>),{" "}
          <strong>Hồ sơ Kỹ sư CV</strong> (<code className="bg-zinc-100 px-1 py-0.5 border border-black/20 text-xs">/api/cv</code>), và{" "}
          <strong>Vườn Tri Thức Blog</strong> (<code className="bg-zinc-100 px-1 py-0.5 border border-black/20 text-xs">/api/blog</code>) 
          thành một tệp sao lưu JSON độc lập an toàn.
        </p>

        {/* 1-Click Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Git Publish to Vercel Button */}
          {onGitPublish && (
            <button
              onClick={onGitPublish}
              disabled={isPublishing || isBackingUp || isRestoring}
              type="button"
              className="group relative flex items-center justify-between p-4 bg-sky-300 hover:bg-sky-400 active:translate-x-0.5 active:translate-y-0.5 text-black border-3 border-black font-mono font-black text-xs sm:text-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black text-sky-300 flex items-center justify-center border border-black">
                  {isPublishing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-300" />
                  ) : (
                    <Rocket className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left">
                  <span className="block font-black tracking-tight">
                    {isPublishing ? "ĐANG ĐẨY LÊN GITHUB..." : "[🚀 ĐỒNG BỘ VERCEL (GIT PUSH)]"}
                  </span>
                  <span className="font-normal text-[11px] text-zinc-800 block">
                    Commit JSON & uploads, kích hoạt Vercel auto-deploy
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Export Button */}
          <button
            onClick={onExportBackup}
            disabled={isBackingUp || isRestoring}
            type="button"
            className="group relative flex items-center justify-between p-4 bg-amber-300 hover:bg-amber-400 active:translate-x-0.5 active:translate-y-0.5 text-black border-3 border-black font-mono font-black text-xs sm:text-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-amber-300 flex items-center justify-center border border-black">
                {isBackingUp ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </div>
              <div className="text-left">
                <span className="block font-black tracking-tight">
                  {isBackingUp ? "ĐANG XUẤT SAO LƯU..." : "[📥 XUẤT SAO LƯU (.JSON)]"}
                </span>
                <span className="font-normal text-[11px] text-zinc-800 block">
                  Đóng gói Site, CV, và Blog vào tệp JSON
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Restore Button */}
          <button
            onClick={onRestoreBackupClick}
            disabled={isBackingUp || isRestoring}
            type="button"
            className="group relative flex items-center justify-between p-4 bg-emerald-300 hover:bg-emerald-400 active:translate-x-0.5 active:translate-y-0.5 text-black border-3 border-black font-mono font-black text-xs sm:text-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-emerald-300 flex items-center justify-center border border-black">
                {isRestoring ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </div>
              <div className="text-left">
                <span className="block font-black tracking-tight">
                  {isRestoring ? "ĐANG KHÔI PHỤC DỮ LIỆU..." : "[📤 KHÔI PHỤC (.JSON)]"}
                </span>
                <span className="font-normal text-[11px] text-zinc-800 block">
                  Tải lên sao lưu và ghi đè tự động qua REST API
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Live Feedback / Publish Status Banner */}
        {publishStatus && (
          <div
            className={`p-4 border-3 border-black font-mono text-xs font-bold flex items-start gap-3 shadow-[4px_4px_0px_0px_#000] ${
              publishStatus.type === "success"
                ? "bg-emerald-100 text-emerald-950 border-emerald-900"
                : publishStatus.type === "error"
                ? "bg-rose-100 text-rose-950 border-rose-900"
                : "bg-sky-100 text-sky-950 border-sky-900"
            }`}
          >
            {publishStatus.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : publishStatus.type === "error" ? (
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            ) : (
              <RefreshCw className="w-5 h-5 text-sky-700 shrink-0 animate-spin mt-0.5" />
            )}
            <div className="flex-1">
              <div className="uppercase tracking-wide font-black mb-0.5">
                {publishStatus.type === "success"
                  ? "ĐỒNG BỘ THÀNH CÔNG"
                  : publishStatus.type === "error"
                  ? "LỖI ĐỒNG BỘ GITHUB"
                  : "ĐANG ĐẨY DỮ LIỆU LÊN GITHUB"}
              </div>
              <p className="font-sans font-medium text-xs leading-relaxed">{publishStatus.text}</p>
            </div>
          </div>
        )}

        {/* Live Feedback / Notification Banner */}
        {backupMessage && (
          <div
            className={`p-4 border-3 border-black font-mono text-xs font-bold flex items-start gap-3 shadow-[4px_4px_0px_0px_#000] ${
              backupMessage.type === "success"
                ? "bg-emerald-100 text-emerald-950 border-emerald-900"
                : backupMessage.type === "error"
                ? "bg-rose-100 text-rose-950 border-rose-900"
                : "bg-amber-100 text-amber-950 border-amber-900"
            }`}
          >
            {backupMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : backupMessage.type === "error" ? (
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            ) : (
              <RefreshCw className="w-5 h-5 text-amber-700 shrink-0 animate-spin mt-0.5" />
            )}
            <div className="flex-1">
              <div className="uppercase tracking-wide font-black mb-0.5">
                {backupMessage.type === "success"
                  ? "THAO TÁC THÀNH CÔNG"
                  : backupMessage.type === "error"
                  ? "LỖI HỆ THỐNG"
                  : "ĐANG XỬ LÝ"}
              </div>
              <p className="font-sans font-medium text-xs leading-relaxed">{backupMessage.text}</p>
            </div>
          </div>
        )}

        {/* Technical Backup Schema Specification */}
        <div className="bg-zinc-50 border-2 border-black p-4 font-mono text-xs space-y-2">
          <div className="font-black text-[11px] text-zinc-500 uppercase flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5" />
            <span>CẤU TRÚC GÓI ĐỒNG BỘ DỮ LIỆU (SNAPSHOT SCHEMA DETAILS)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 bg-white border border-black/30">
              <span className="font-bold text-amber-900 block">• siteData:</span>
              <span className="text-zinc-600 text-[10px]">
                Hero Terminal, Bio VNU-UET, Subdomains, Tech Marquee, Motorola Pager.
              </span>
            </div>
            <div className="p-2 bg-white border border-black/30">
              <span className="font-bold text-emerald-900 block">• cvData:</span>
              <span className="text-zinc-600 text-[10px]">
                Thông tin cá nhân, Học vấn FET, Dự án vi mạch, Kỹ năng kỹ thuật, 6 Templates.
              </span>
            </div>
            <div className="p-2 bg-white border border-black/30">
              <span className="font-bold text-sky-900 block">• blogData:</span>
              <span className="text-zinc-600 text-[10px]">
                Toàn bộ bài viết kỹ thuật (.md), Cây chuyên mục mẹ/con, Tags & Metadata.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
