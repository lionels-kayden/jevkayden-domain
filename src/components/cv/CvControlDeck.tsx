"use client";

import React from "react";
import Link from "next/link";
import { CvLanguage } from "@/types/cv";
import {
  Printer,
  FileCheck,
  Languages,
  ArrowLeft,
  SlidersHorizontal,
  Info,
} from "lucide-react";

export type TemplateId = "t1" | "t2" | "t3" | "t4" | "t5" | "t6";

interface CvControlDeckProps {
  currentTemplate: TemplateId;
  onSelectTemplate: (t: TemplateId) => void;
  lang: CvLanguage;
  onToggleLang: () => void;
  onExportStyledPdf: () => void;
  onExportAtsPdf: () => void;
}

export const CvControlDeck: React.FC<CvControlDeckProps> = ({
  currentTemplate,
  onSelectTemplate,
  lang,
  onToggleLang,
  onExportStyledPdf,
  onExportAtsPdf,
}) => {
  const templates: { id: TemplateId; shortId: string; label: string; badge: string }[] = [
    { id: "t1", shortId: "T1", label: "NEO-BRUTALIST", badge: "TACTILE" },
    { id: "t2", shortId: "T2", label: "EXECUTIVE", badge: "CORP" },
    { id: "t3", shortId: "T3", label: "ATS CLASSIC", badge: "ATS 100%" },
    { id: "t4", shortId: "T4", label: "APPLE BENTO", badge: "SILICON" },
    { id: "t5", shortId: "T5", label: "DATASHEET", badge: "IEEE/TI" },
    { id: "t6", shortId: "T6", label: "SWISS TYPO", badge: "SWISS" },
  ];

  return (
    <aside
      aria-label="CV Control Deck"
      className="sticky top-2 z-50 w-full max-w-5xl mx-auto px-2 sm:px-4 mb-8 print:hidden no-print select-none"
    >
      <div className="bg-[#f4f0ea] border-4 border-black p-3 sm:p-4 shadow-[6px_6px_0px_0px_#000] flex flex-col gap-3 font-mono">
        {/* Top Control Bar Row */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 pb-2 border-b-2 border-black/80">
          {/* Left: Brand Badge & Return Home */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white font-mono text-xs font-bold border-2 border-black active:translate-y-0.5 transition-transform"
              title="Return to Main Ecosystem Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === "vi" ? "VỀ HUB CHÍNH" : "RETURN TO HUB"}</span>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-1.5 bg-amber-300 px-2.5 py-1 border-2 border-black text-xs font-black">
              <SlidersHorizontal className="w-3.5 h-3.5 text-black" />
              <span>CV ENGINE [6-TEMPLATES]</span>
            </div>
          </div>

          {/* Right: Language Toggle & Dual PDF Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 text-black border-2 border-black text-xs font-black active:translate-y-0.5 transition-transform cursor-pointer shadow-[2px_2px_0px_0px_#000]"
              title="Toggle Language (VI / EN)"
            >
              <Languages className="w-3.5 h-3.5 text-black" />
              <span>{lang === "vi" ? "LANG: VI_VN" : "LANG: EN_US"}</span>
            </button>

            {/* BUTTON 1: Export Styled PDF */}
            <div className="relative group inline-block">
              <button
                onClick={onExportStyledPdf}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black border-2 border-black text-xs font-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all"
                title={
                  lang === "vi"
                    ? "Chọn 'Lưu dưới dạng PDF (Save as PDF)' ở mục Máy in đích để xuất file PDF đầy đủ màu sắc."
                    : "Select 'Save as PDF' as the Destination printer to export full-color PDF."
                }
              >
                <Printer className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>{lang === "vi" ? "XUẤT PDF MÀU [A4]" : "PRINT COLOR [A4]"}</span>
              </button>

              {/* Hover Tooltip */}
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-72 p-2.5 bg-black text-white text-[11px] font-sans border-2 border-amber-400 shadow-[3px_3px_0px_0px_#000] z-50 pointer-events-none">
                <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 font-mono">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{lang === "vi" ? "LƯU Ý XUẤT MÀU" : "COLOR EXPORT TIP"}</span>
                </p>
                <p className="text-zinc-200 leading-snug">
                  {lang === "vi"
                    ? "Chọn 'Lưu dưới dạng PDF (Save as PDF)' ở mục Máy in đích để xuất file PDF đầy đủ màu sắc."
                    : "Select 'Save as PDF' as the Destination printer to export full-color PDF."}
                </p>
              </div>
            </div>

            {/* BUTTON 2: Export ATS Classic B&W */}
            <button
              onClick={onExportAtsPdf}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white border-2 border-black text-xs font-black shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 cursor-pointer transition-all"
              title="Auto switch to ATS Classic Harvard/IEEE template and open print dialog"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span>{lang === "vi" ? "XUẤT ATS [B&W]" : "PRINT ATS [B&W]"}</span>
            </button>
          </div>
        </div>

        {/* Color Print Helper Banner */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-amber-200/90 border-2 border-black text-[11px] text-black">
          <div className="flex items-center gap-2">
            <span className="font-black bg-black text-amber-300 px-1.5 py-0.5 text-[10px]">LƯU Ý</span>
            <span className="font-semibold">
              {lang === "vi"
                ? "Chọn 'Lưu dưới dạng PDF (Save as PDF)' ở mục Máy in đích để xuất file PDF đầy đủ màu sắc."
                : "Select 'Save as PDF' in Destination to export full-color PDF."}
            </span>
          </div>
          <span className="text-[10px] text-zinc-800 hidden md:inline font-mono">
            {lang === "vi" ? "A4 Portrait // Tự động khóa bố cục" : "A4 Portrait // Auto Layout Lock"}
          </span>
        </div>

        {/* Bottom Template Switcher 6-Col Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full text-xs">
          {templates.map((tpl) => {
            const isActive = currentTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl.id)}
                type="button"
                className={`flex flex-col items-start justify-between p-2 text-left w-full overflow-hidden border-2 border-black transition-all cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-[2px_2px_0px_0px_#f59e0b] -translate-y-0.5"
                    : "bg-white hover:bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_#000]"
                }`}
              >
                {/* Top mini-row */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono opacity-80">
                  <span className="font-extrabold">{tpl.shortId}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-xs font-mono font-bold ${
                      isActive ? "bg-amber-400 text-black" : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    {tpl.badge}
                  </span>
                </div>

                {/* Bottom main label */}
                <div className="text-xs font-bold tracking-tight truncate w-full mt-0.5">
                  {tpl.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
