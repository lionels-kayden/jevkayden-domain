"use client";

import React, { useState, useEffect } from "react";
import initialCvData from "@/data/cvData.json";
import { CvData, CvLanguage } from "@/types/cv";
import { CvControlDeck, TemplateId } from "@/components/cv/CvControlDeck";
import { NeoBrutalistTemplate } from "@/components/cv/NeoBrutalistTemplate";
import { ExecutiveTemplate } from "@/components/cv/ExecutiveTemplate";
import { AtsClassicTemplate } from "@/components/cv/AtsClassicTemplate";
import { BentoSiliconTemplate } from "@/components/cv/BentoSiliconTemplate";
import { DatasheetTemplate } from "@/components/cv/DatasheetTemplate";
import { SwissTypoTemplate } from "@/components/cv/SwissTypoTemplate";
import {
  readLiveClientCache,
  fetchFreshestData,
  subscribeToLiveSync,
} from "@/lib/liveClientSync";

export default function CvPage() {
  const [cvData, setCvData] = useState<CvData>(initialCvData as CvData);
  const [template, setTemplate] = useState<TemplateId>("t1");
  const [lang, setLang] = useState<CvLanguage>("vi");
  const [printMode, setPrintMode] = useState<"color" | "bw">("color");
  const [showColorToast, setShowColorToast] = useState(false);

  // Instant 0ms live sync from localStorage/cookie + cache-busted /api/cv fetch + BroadcastChannel listener
  useEffect(() => {
    const localSnapshot = readLiveClientCache<CvData>(
      "jev_live_cv_data",
      initialCvData as CvData
    );
    if (localSnapshot?.data?.personalInfo) {
      setCvData(localSnapshot.data);
    }

    fetchFreshestData<CvData>(
      "/api/cv",
      "jev_live_cv_data",
      initialCvData as CvData
    ).then((freshest) => {
      if (freshest && freshest.personalInfo) {
        setCvData(freshest);
      }
    });

    return subscribeToLiveSync<CvData>(
      "jev_live_cv_data",
      "/api/cv",
      initialCvData as CvData,
      (freshest) => {
        if (freshest && freshest.personalInfo) {
          setCvData(freshest);
        }
      }
    );
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "vi" ? "en" : "vi"));
  };

  const handleExportStyledPdf = () => {
    setPrintMode("color");
    setShowColorToast(true);
    setTimeout(() => {
      window.print();
    }, 120);
    setTimeout(() => {
      setShowColorToast(false);
    }, 7000);
  };

  const handleExportAtsPdf = () => {
    setPrintMode("bw");
    setTemplate("t3");
    setShowColorToast(false);
    // Short timeout to let React render T3 before invoking print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#ece7df] text-black py-4 sm:py-8 px-2 sm:px-4 print:bg-white print:p-0">
      {/* Sticky Top Control Deck (Hidden on print) with Dedicated Spacer */}
      <div className="w-full mb-8 print:hidden no-print">
        <CvControlDeck
          currentTemplate={template}
          onSelectTemplate={setTemplate}
          lang={lang}
          onToggleLang={toggleLanguage}
          onExportStyledPdf={handleExportStyledPdf}
          onExportAtsPdf={handleExportAtsPdf}
        />
      </div>

      {/* Dynamic Template Canvas */}
      <main
        id="cv-printable-area"
        className={`w-full max-w-full overflow-x-auto flex justify-center items-start print:block print:w-full relative z-0 ${
          printMode === "bw" ? "ats-bw-mode" : ""
        }`}
      >
        {template === "t1" && <NeoBrutalistTemplate data={cvData} lang={lang} />}
        {template === "t2" && <ExecutiveTemplate data={cvData} lang={lang} />}
        {template === "t3" && <AtsClassicTemplate data={cvData} lang={lang} />}
        {template === "t4" && <BentoSiliconTemplate data={cvData} lang={lang} />}
        {template === "t5" && <DatasheetTemplate data={cvData} lang={lang} />}
        {template === "t6" && <SwissTypoTemplate data={cvData} lang={lang} />}
      </main>

      {/* Floating Bottom Quick Stamp (Hidden in print) */}
      <footer className="w-full max-w-4xl mx-auto mt-8 pt-4 border-t-2 border-black/20 text-center font-mono text-xs text-zinc-600 print:hidden no-print">
        <span>ELECTRONICS & TELECOMMUNICATIONS // IC DESIGN & IOT LAB</span>
        <span className="mx-2">•</span>
        <span>JEVKAYDEN.TECH/CV</span>
        <span className="mx-2">•</span>
        <span>LAST SYNC: {cvData.lastUpdated ? cvData.lastUpdated.slice(0, 10) : "2026-10-20"}</span>
      </footer>

      {/* Helper Toast Notification for Color PDF Export */}
      {showColorToast && (
        <aside
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[9999] max-w-md bg-amber-300 border-4 border-black p-3.5 shadow-[6px_6px_0px_0px_#000] text-xs font-mono no-print print:hidden flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-start gap-2.5">
            <span className="text-xl leading-none">🖨️</span>
            <div>
              <p className="font-black text-black text-xs uppercase tracking-tight">
                {lang === "vi" ? "MẸO XUẤT PDF MÀU [A4]" : "FULL COLOR A4 PDF TIP"}
              </p>
              <p className="text-zinc-900 font-bold mt-1 text-[11px] leading-snug">
                {lang === "vi"
                  ? "Chọn 'Lưu dưới dạng PDF (Save as PDF)' ở mục Máy in đích để xuất file PDF đầy đủ màu sắc."
                  : "Select 'Save as PDF' as the Destination printer to export full-color PDF."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowColorToast(false)}
            className="text-black font-black hover:bg-black hover:text-white px-1.5 py-0.5 border-2 border-black cursor-pointer text-xs shrink-0"
            title={lang === "vi" ? "Đóng thông báo" : "Close"}
          >
            ✕
          </button>
        </aside>
      )}
    </div>
  );
}
