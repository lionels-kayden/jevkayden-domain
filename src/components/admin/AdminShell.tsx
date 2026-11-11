"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  Save,
  Loader2,
  ExternalLink,
  Rocket,
} from "lucide-react";
import { getAdminPasscode } from "@/lib/adminAuth";
import { BrandLogo } from "@/components/BrandLogo";
import { readLiveClientCache } from "@/lib/liveClientSync";

export interface AdminShellProps {
  children: React.ReactNode;
  activeRoute: "launchpad" | "hub" | "cv" | "blog" | "app" | "sync";
  title?: string;
  onSave?: () => Promise<void> | void;
  isSaving?: boolean;
  saveStatus?: string | null;
  previewHref?: string;
  previewLabel?: string;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  activeRoute,
  title,
  onSave,
  isSaving = false,
  saveStatus = null,
  previewHref,
  previewLabel = "XEM TRANG ↗",
}) => {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string>("");

  // Sync auth state with sessionStorage and localStorage across admin routes
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const isUnlockedLocal = localStorage.getItem("jevkayden_admin_unlocked") === "true";
        const isUnlockedSession = sessionStorage.getItem("jevkayden_admin_unlocked") === "true";
        const storedPasscode =
          sessionStorage.getItem("jevkayden_admin_passcode") ||
          localStorage.getItem("jevkayden_admin_passcode");

        if ((isUnlockedLocal || isUnlockedSession) && storedPasscode) {
          try {
            const res = await fetch("/api/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ passcode: storedPasscode }),
            });
            if (res.ok) {
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem("jevkayden_admin_unlocked");
              sessionStorage.removeItem("jevkayden_admin_unlocked");
              localStorage.removeItem("jevkayden_admin_passcode");
              sessionStorage.removeItem("jevkayden_admin_passcode");
              setIsAuthenticated(false);
            }
          } catch {
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.warn("Storage access warning:", e);
      } finally {
        setIsCheckingAuth(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishBanner, setPublishBanner] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim();
    if (!cleanPass) {
      setPasscodeError("VUI LÒNG NHẬP MẬT MÃ QUẢN TRỊ.");
      return;
    }

    setIsLoggingIn(true);
    setPasscodeError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: cleanPass }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        try {
          localStorage.setItem("jevkayden_admin_unlocked", "true");
          sessionStorage.setItem("jevkayden_admin_unlocked", "true");
          localStorage.setItem("jevkayden_admin_passcode", cleanPass);
          sessionStorage.setItem("jevkayden_admin_passcode", cleanPass);
        } catch { }
        setIsAuthenticated(true);
        setPasscodeError("");
      } else {
        setPasscodeError(data.error || "MẬT MÃ XÁC THỰC KHÔNG CHÍNH XÁC.");
      }
    } catch {
      setPasscodeError("KHÔNG THỂ KẾT NỐI ĐẾN CỔNG XÁC THỰC.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("jevkayden_admin_unlocked");
      sessionStorage.removeItem("jevkayden_admin_unlocked");
      localStorage.removeItem("jevkayden_admin_passcode");
      sessionStorage.removeItem("jevkayden_admin_passcode");
    } catch { }
    setIsAuthenticated(false);
  };

  const handleGitPublish = async () => {
    setIsPublishing(true);
    setPublishBanner("⏳ Đang lưu thay đổi và đồng bộ dữ liệu lên Cloud / GitHub...");
    try {
      if (onSave) {
        await onSave();
      }
      const authCode = getAdminPasscode();
      const siteSnapshot = readLiveClientCache("jev_live_hub_data")?.data;
      const cvSnapshot = readLiveClientCache("jev_live_cv_data")?.data;
      const blogSnapshot = readLiveClientCache("jev_live_blog_data")?.data;
      const appsSnapshot = readLiveClientCache("jev_live_apps_data")?.data;

      const res = await fetch(`/api/publish?t=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({
          passcode: authCode,
          ...(siteSnapshot ? { siteData: siteSnapshot } : {}),
          ...(cvSnapshot ? { cvData: cvSnapshot } : {}),
          ...(blogSnapshot ? { blogData: blogSnapshot } : {}),
          ...(appsSnapshot ? { appsData: appsSnapshot } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      const msg =
        data.githubCommitted === false && data.status === "VERCEL_INSTANT_CACHE"
          ? "ĐÃ LƯU TRÊN TRÌNH DUYỆT & BỘ ĐỆM! (Thêm GITHUB_TOKEN trên Vercel để commit vĩnh viễn lên GitHub)"
          : data.message ||
            (data.ok ? "✓ Đã đồng bộ lên GitHub thành công!" : data.error || "Lỗi khi đồng bộ.");
      setPublishBanner(msg);
      setTimeout(() => setPublishBanner(null), 9000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPublishBanner(`✖ Lỗi kết nối tới /api/publish: ${msg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Prevent flash while checking stored credentials
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#ece7df] text-black flex items-center justify-center font-mono select-none">
        <div className="flex items-center gap-2 p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <Loader2 className="w-5 h-5 animate-spin text-[#00629B]" />
          <span className="text-xs font-bold uppercase">ĐANG KIỂM TRA PHIÊN LÀM VIỆC...</span>
        </div>
      </div>
    );
  }

  // Passcode gate if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#ece7df] text-black flex items-center justify-center p-4 font-mono select-none">
        <div className="w-full max-w-md bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_#000]">
          <div className="flex items-center gap-2 bg-black text-amber-300 p-2.5 font-bold text-xs uppercase mb-6">
            <Lock className="w-4 h-4 text-red-400" />
            <span>CENTRAL ADMIN CMS // 2-STAGE ACCESS GATE</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center py-2">
              <div className="w-16 h-16 rounded-none bg-amber-300 border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                <KeyRound className="w-8 h-8 text-black" />
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-xl font-black uppercase text-black font-sans">
                TRUNG TÂM QUẢN TRỊ NỘI BỘ
              </h1>
              <p className="text-xs text-zinc-600 mt-1 font-sans">
                Hạ tầng Multi-Site 2 cấp: Điều phối toàn bộ các phân hệ Jev Kayden Domain.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  MẬT MÃ XÁC THỰC:
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Nhập mật mã quản trị..."
                  autoFocus
                  disabled={isLoggingIn}
                  className="w-full p-2.5 bg-zinc-50 border-2 border-black font-mono text-sm font-bold text-black outline-none focus:bg-amber-50 disabled:opacity-50"
                />
              </div>

              {passcodeError && (
                <div className="text-xs text-red-600 font-bold bg-red-50 p-2 border border-red-300 font-sans">
                  {passcodeError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-black hover:bg-zinc-800 disabled:bg-zinc-700 text-amber-300 font-bold text-xs uppercase border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-0.5 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>ĐANG XÁC THỰC...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>MỞ KHÓA TRUY CẬP [ENTER]</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs font-bold text-zinc-500 hover:text-black underline font-sans"
              >
                ← Quay lại trang chủ công khai
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Derive title from activeRoute if not supplied
  const displayTitle =
    title ||
    (activeRoute === "hub"
      ? "NODE 00 // MAIN HUB"
      : activeRoute === "cv"
        ? "NODE 01 // CV DOSSIER"
        : activeRoute === "blog"
          ? "NODE 02 // BLOG GARDEN"
          : activeRoute === "app"
            ? "NODE 03 // APP LAB"
            : activeRoute === "sync"
              ? "SYS // MULTI-SYNC CLOUD"
              : "ADMIN COMMAND CENTER");

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#ece7df] text-black font-mono flex flex-col">
      {/* ========================================================= */}
      {/* 1. SINGLE-ROW TOP ADMIN COMMAND BAR (H-14, SHRINK-0) */}
      {/* ========================================================= */}
      <header className="h-14 shrink-0 bg-black text-white px-3 sm:px-4 flex items-center justify-between border-b-2 border-black z-50 select-none">
        {/* Left Section: Back to Launchpad & Route Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {activeRoute !== "launchpad" ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#fff] cursor-pointer active:translate-y-0.5 transition-colors shrink-0"
                title="Quay lại sảnh chính /admin"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-black stroke-[3]" />
                <span className="hidden sm:inline">QUAY LẠI SẢNH CHÍNH</span>
                <span className="sm:hidden">SẢNH CHÍNH</span>
              </Link>
              <BrandLogo variant="admin" size={28} className="shrink-0 hidden xs:inline-block" />
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <BrandLogo variant="admin" size={28} className="shrink-0" />
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
              <span className="font-black text-amber-300 text-xs sm:text-sm tracking-wider uppercase">
                ADMIN.JEVKAYDEN.TECH
              </span>
            </div>
          )}

          {/* Quick Route Switcher Pills */}
          <nav className="hidden md:inline-flex items-center gap-1 bg-zinc-900 border border-zinc-700 p-0.5 text-xs font-mono shrink-0">
            <Link
              href="/admin/hub"
              className={`px-2 py-0.5 font-bold transition-colors ${activeRoute === "hub" || pathname === "/admin/hub"
                  ? "bg-amber-300 text-black font-black"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              00. HUB
            </Link>
            <Link
              href="/admin/cv"
              className={`px-2 py-0.5 font-bold transition-colors ${activeRoute === "cv" || pathname === "/admin/cv"
                  ? "bg-amber-300 text-black font-black"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              01. CV
            </Link>
            <Link
              href="/admin/blog"
              className={`px-2 py-0.5 font-bold transition-colors ${activeRoute === "blog" || pathname === "/admin/blog"
                  ? "bg-amber-300 text-black font-black"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              02. BLOG
            </Link>
            <Link
              href="/admin/app"
              className={`px-2 py-0.5 font-bold transition-colors ${activeRoute === "app" || pathname === "/admin/app"
                  ? "bg-amber-300 text-black font-black"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              03. APPS
            </Link>
          </nav>

          {activeRoute !== "launchpad" && (
            <span className="font-black text-amber-300 text-xs tracking-wide hidden xl:inline truncate max-w-xs">
              {"//"} {displayTitle}
            </span>
          )}
        </div>

        {/* Right Section: Sync indicator, Save button, External preview, Lock */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-bold text-amber-300 animate-pulse bg-zinc-900 px-2 py-1 border border-zinc-700 font-sans hidden sm:inline-block">
              {saveStatus}
            </span>
          )}

          {/* Quick Git Push to Vercel Deploy Button */}
          <button
            onClick={handleGitPublish}
            disabled={isPublishing}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#fff] cursor-pointer active:translate-y-0.5 transition-colors disabled:opacity-50 shrink-0"
            title="Đẩy dữ liệu src/data và uploads lên GitHub để kích hoạt Vercel auto-deploy"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span className="hidden md:inline">ĐANG ĐẨY...</span>
              </>
            ) : (
              <>
                <Rocket className="w-3.5 h-3.5 text-black" />
                <span className="hidden md:inline">ĐỒNG BỘ VERCEL [GIT PUSH]</span>
                <span className="md:hidden">GIT PUSH</span>
              </>
            )}
          </button>

          {/* Save Button (when onSave is provided) */}
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#fff] cursor-pointer active:translate-y-0.5 transition-colors disabled:opacity-50 shrink-0"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span className="hidden sm:inline">ĐANG LƯU...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-black" />
                  <span>LƯU & XUẤT BẢN [SAVE]</span>
                </>
              )}
            </button>
          )}

          {/* Context External Preview Link */}
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-600 transition-colors shrink-0"
              title="Xem trang web ở tab mới"
            >
              <span className="hidden sm:inline">{previewLabel}</span>
              <ExternalLink className="w-3.5 h-3.5 sm:hidden" />
            </a>
          )}

          {/* Lock / Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-700 cursor-pointer transition-colors"
            title="Đăng xuất / Khóa cổng quản trị"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {publishBanner && (
        <div
          onClick={() => setPublishBanner(null)}
          className="bg-amber-300 text-black border-b-2 border-black px-4 py-2 text-xs font-mono font-bold flex items-center justify-between gap-3 cursor-pointer shrink-0 z-40"
        >
          <span>{publishBanner}</span>
          <span className="text-[10px] bg-black text-amber-300 px-2 py-0.5 uppercase font-black shrink-0">
            ĐÓNG [×]
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE VIEWPORT */}
      {/* ========================================================= */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};
