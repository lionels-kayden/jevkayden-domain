"use client";

import React, { useState } from "react";
import { siteConfig, Language } from "@/data/siteConfig";
import {
  Copy,
  Check,
  Mail,
  Radio,
  ArrowUpRight,
  Terminal,
  Wifi,
  AlertCircle,
} from "lucide-react";

// Clean, accurate Brand SVGs
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SocialMessageIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

interface PagerContactProps {
  lang: Language;
  onScrollToTop: () => void;
  onOpenStandbyModal: () => void;
}

export const PagerContact: React.FC<PagerContactProps> = ({
  lang,
  onScrollToTop,
  onOpenStandbyModal,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [pendingToast, setPendingToast] = useState<string | null>(null);
  const emailAddress = siteConfig.profile.email;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSocialClick = (url: string, platform: string) => {
    if (url === "#" || !url) {
      setPendingToast(
        `[${platform}] ${siteConfig.uiText.unconfiguredLinkToast[lang]}`
      );
      setTimeout(() => {
        setPendingToast(null);
      }, 3500);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <footer
      id="contact-section"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 scroll-mt-24"
    >
      {/* RETRO PAGER / BEEPER HARDWARE CASING */}
      <div className="bg-[#222222] border-4 border-black p-5 sm:p-8 neo-shadow-lg text-white relative">
        {/* Pager Top Clip / Belt Mount Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-zinc-700">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-led border border-black"></div>
            <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-emerald-400">
              {siteConfig.uiText.pagerUnitTitle[lang]}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              RF SIGNAL: 99.8%
            </span>
            <span className="bg-zinc-800 px-2 py-0.5 border border-zinc-600 text-amber-300">
              CH-07
            </span>
          </div>
        </div>

        {/* Pager LCD Screen (Classic Vintage Dot-Matrix / Backlit Green Display) */}
        <div className="bg-[#1a3a2a] border-3 border-black p-4 sm:p-6 neo-shadow-sm mb-6 relative overflow-hidden">
          {/* Subtle Grid on LCD */}
          <div className="absolute inset-0 bg-[radial-gradient(#2ee57a_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none"></div>

          <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400/90 pb-2 border-b border-emerald-800/60 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>[MSG 01/01] // PRIORITY DISPATCH</span>
            </div>
            <span suppressHydrationWarning className="text-emerald-300 font-bold">
              11:45 AM UTC+7
            </span>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-sm sm:text-base font-bold text-emerald-300 tracking-wide leading-relaxed">
              {siteConfig.uiText.pagerMsg[lang]}
            </p>
            <p className="font-mono text-xs text-emerald-400/80">
              {siteConfig.uiText.pagerReadyDeploy[lang]} {emailAddress}
            </p>
          </div>
        </div>

        {/* Tactile Control Buttons & Action Bus */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Left: 1-Click Copy Email Button (7 cols) */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyEmail}
              type="button"
              className={`neo-btn-lg px-5 py-3.5 font-mono font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-400 text-black border-2 border-black"
                  : "bg-amber-300 hover:bg-amber-400 text-black border-2 border-black"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-black stroke-[3]" />
                  <span>{siteConfig.uiText.copiedSuccessBtn[lang]}</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-black stroke-[3]" />
                  <span>{siteConfig.uiText.copyEmailBtn[lang]}</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${emailAddress}`}
              className="neo-btn px-4 py-3.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>{siteConfig.uiText.openClientBtn[lang]}</span>
            </a>
          </div>

          {/* Right: Social Portals (5 cols) with Retro Notification on Unconfigured Links */}
          <div className="md:col-span-5 flex flex-wrap items-center justify-start md:justify-end gap-2.5">
            {siteConfig.socials.map((s) => (
              <button
                key={s.platform}
                onClick={() => handleSocialClick(s.url, s.platform)}
                type="button"
                className="neo-btn px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 border border-zinc-600 cursor-pointer"
              >
                {s.platform === "GitHub" && <GithubIcon className="w-4 h-4 text-amber-300" />}
                {s.platform === "LinkedIn" && <LinkedinIcon className="w-4 h-4 text-emerald-400" />}
                {s.platform.includes("Facebook") && <SocialMessageIcon className="w-4 h-4 text-cyan-400" />}
                <span>{s.platform.toUpperCase()}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Retro Alert Toast for Unconfigured Social Links */}
        {pendingToast && (
          <div className="mt-4 p-3 bg-amber-400 text-black border-2 border-black font-mono text-xs font-black flex items-center gap-2 animate-in fade-in neo-shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-black" />
            <span>{pendingToast}</span>
          </div>
        )}

        {/* Pager Hardware Speaker Grille (Vintage Cutouts) */}
        <div className="mt-8 pt-6 border-t-2 border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-12 h-1 bg-zinc-700"></span>
            <span className="w-12 h-1 bg-zinc-700"></span>
            <span className="w-12 h-1 bg-zinc-700"></span>
            <span className="text-[11px] text-zinc-500 font-bold ml-2">
              SPEAKER GRILLE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onScrollToTop}
              type="button"
              className="hover:text-amber-300 underline font-bold cursor-pointer"
            >
              {siteConfig.uiText.returnToRoot[lang]}
            </button>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-500 font-bold">
              BUILD: {siteConfig.profile.buildHash}
            </span>
          </div>
        </div>
      </div>

      {/* Subdomain Quick Navigation Footbar */}
      <div className="mt-8 bg-[#f4f0ea] p-4 border-2 border-black flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-zinc-700 font-bold flex-wrap">
          <Terminal className="w-4 h-4 text-black shrink-0" />
          <span>{siteConfig.uiText.directHostJump[lang]}</span>
          <a
            href={siteConfig.subdomains[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black underline font-extrabold text-black"
          >
            blog.{siteConfig.baseDomain}
          </a>
          <span>·</span>
          <a
            href={siteConfig.subdomains[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black underline font-extrabold text-black"
          >
            cv.{siteConfig.baseDomain}
          </a>
          <span>·</span>
          <button
            onClick={onOpenStandbyModal}
            type="button"
            className="hover:text-black underline font-extrabold cursor-pointer text-purple-900"
          >
            app.{siteConfig.baseDomain} [STANDBY]
          </button>
        </div>

        <div className="text-zinc-600 text-[11px] font-bold">
          © 2026 {siteConfig.profile.fullName} {"//"} {siteConfig.uiText.rightsReserved[lang]}
        </div>
      </div>
    </footer>
  );
};
