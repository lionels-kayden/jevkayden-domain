"use client";

import React from "react";
import { CvData, CvLanguage } from "@/types/cv";
import {
  Cpu,
  Radio,
  Code,
  Layers,
  Award,
  Activity,
  Globe,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

interface TemplateProps {
  data: CvData;
  lang: CvLanguage;
}

export const BentoSiliconTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personalInfo, education, skills, projects, experience, certifications, keyMetrics } = data;
  const primaryEdu = education[0];
  const shortGpa = primaryEdu?.gpa ? primaryEdu.gpa.split("[")[0].replace(/^GPA\s*:?\s*/i, "").trim() : "3.62 / 4.0";
  const eduPeriod = primaryEdu?.period ? primaryEdu.period.replace("-", "–") : "2025 – 2029";

  return (
    <div className="a4-pages-stack">
      {/* ================= PAGE 01 // 02 ================= */}
      <section
        style={{ backgroundColor: "#ffffff" }}
        className="a4-sheet bg-white text-[#1d1d1f] font-sans p-6 flex flex-col justify-between relative overflow-hidden select-none border border-black/[0.08]"
      >
        <div>
          {/* HEADER BENTO: Cupertino Hero Card + Right Stack */}
          <div className="grid grid-cols-12 gap-3 mb-3">
            {/* Main Identity Card (7 cols) */}
            <div className="col-span-7 p-4 rounded-[22px] bg-gradient-to-br from-[#f5f5f7] via-[#eef2f6] to-[#e8f0fe] border border-[#0066cc]/15 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#0066cc]/20 text-[#0066cc] text-[10px] font-mono font-bold shadow-2xs">
                  <Cpu className="w-3 h-3 text-[#0066cc]" />
                  <span>{lang === "vi" ? "KIẾN TRÚC VI MẠCH & BÁN DẪN" : "SILICON & EMBEDDED ARCHITECTURE"}</span>
                </div>

                <h1 className="text-2xl font-black text-[#1d1d1f] tracking-tight leading-snug">
                  {personalInfo.fullName}
                </h1>

                <p className="text-xs font-extrabold text-[#0066cc] leading-snug">
                  {personalInfo.title[lang]}
                </p>

                <p className="text-[11px] text-[#515154] leading-relaxed pt-0.5">
                  {personalInfo.summary[lang]}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 text-[10px] font-mono text-[#515154] border-t border-black/[0.08] mt-2">
                <span className="flex items-center gap-1 font-medium text-[#1d1d1f]">
                  <MapPin className="w-3 h-3 text-[#0066cc]" />
                  {personalInfo.location[lang]}
                </span>
                <span className="flex items-center gap-1 font-medium text-[#1d1d1f]">
                  <Mail className="w-3 h-3 text-[#0066cc]" />
                  {personalInfo.email}
                </span>
              </div>
            </div>

            {/* Quick Link & Education Bento Deck (5 cols) */}
            <div className="col-span-5 p-3.5 rounded-[20px] bg-[#f5f5f7] border border-black/[0.07] flex flex-col justify-between space-y-2.5">
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white border border-black/[0.08] text-[#1d1d1f] shadow-2xs"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <Globe className="w-3 h-3 text-[#0066cc] shrink-0" />
                    <span className="font-bold truncate">Web</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-[#515154] shrink-0" />
                </a>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white border border-black/[0.08] text-[#1d1d1f] shadow-2xs"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <GithubIcon className="w-3 h-3 text-[#1d1d1f] shrink-0" />
                    <span className="font-bold truncate">GitHub</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-[#515154] shrink-0" />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white border border-black/[0.08] text-[#1d1d1f] shadow-2xs"
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <LinkedinIcon className="w-3 h-3 text-[#0066cc] shrink-0" />
                    <span className="font-bold truncate">LinkedIn</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-[#515154] shrink-0" />
                </a>
              </div>

              {/* Top-Right Education Bento Card (Stacked Full-Width Layout) */}
              <div className="p-3 rounded-[16px] bg-white border border-black/[0.08] shadow-2xs flex flex-col gap-1.5">
                {/* Top row: Two compact badges side-by-side */}
                <div className="flex items-center justify-between gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f5f5f7] border border-black/[0.07] text-[9.5px] font-mono font-bold text-[#0066cc]">
                    🎓 VNU-UET // {eduPeriod}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-600/20 text-[9.5px] font-mono font-extrabold text-emerald-700 shrink-0">
                    GPA {shortGpa}
                  </span>
                </div>

                {/* Middle row (Full 100% width): Degree title + University name */}
                <div className="w-full space-y-0.5 pt-0.5">
                  <div className="text-[12.5px] font-extrabold text-[#1d1d1f] leading-snug w-full">
                    {primaryEdu?.degree[lang]}
                  </div>
                  <div className="text-[10.5px] font-medium text-[#515154] leading-snug w-full">
                    {primaryEdu?.institution[lang]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 CUPERTINO SPEC METRIC CARDS */}
          {keyMetrics && (
            <div className="grid grid-cols-4 gap-2.5 mb-3">
              {keyMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-[20px] bg-[#f5f5f7] border border-black/[0.07] text-center"
                >
                  <div className="text-[9px] font-mono font-bold uppercase text-[#0066cc] tracking-tight">
                    {m.label[lang]}
                  </div>
                  <div className="text-lg font-black text-[#1d1d1f] mt-0.5 tracking-tight">
                    {m.value}
                  </div>
                  <div className="text-[9px] text-[#515154] font-mono font-semibold">
                    {m.subtext[lang]}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BENTO SECTION: SKILL CHIPS */}
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {skills.map((cat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-[20px] bg-[#f5f5f7] border border-black/[0.07] space-y-2"
              >
                <div className="flex items-start gap-1.5 text-[10.5px] font-extrabold font-mono uppercase text-[#0066cc] leading-tight">
                  {idx === 0 ? (
                    <Cpu className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#0066cc]" />
                  ) : idx === 1 ? (
                    <Radio className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#0066cc]" />
                  ) : (
                    <Code className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#0066cc]" />
                  )}
                  <span className="leading-snug text-[#1d1d1f]">{cat.categoryName[lang]}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white text-[#1d1d1f] border border-black/[0.08] shadow-2xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BENTO SECTION: SILICON PROJECT 1 */}
          {projects[0] && (
            <div className="p-4 rounded-[20px] bg-[#f5f5f7] border border-black/[0.07] space-y-1.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.07]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-white text-[#0066cc] border border-[#0066cc]/20 shadow-2xs">
                    {projects[0].tag}
                  </span>
                  <h3 className="font-extrabold text-xs text-[#1d1d1f]">
                    {projects[0].title[lang]}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0066cc] shrink-0">
                  {projects[0].period}
                </span>
              </div>

              <div className="text-[11px] font-bold text-emerald-700">
                {projects[0].role[lang]}
              </div>

              <p className="text-[11px] text-[#515154] leading-snug">
                {projects[0].description[lang]}
              </p>

              <ul className="text-[10px] text-[#1d1d1f] space-y-0.5 pt-0.5">
                {projects[0].highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                  <li key={hlIdx} className="flex items-start gap-1.5">
                    <span className="text-[#0066cc]">◆</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-black/[0.07] mt-1">
                {projects[0].technologies.slice(0, 5).map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white text-[#1d1d1f] border border-black/[0.08] shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="a4-page-badge font-mono font-bold text-[#515154]">PAGE 01 // 02</span>
      </section>

      {/* ================= PAGE 02 // 02 ================= */}
      <section
        style={{ backgroundColor: "#ffffff" }}
        className="a4-sheet bg-white text-[#1d1d1f] font-sans p-6 flex flex-col justify-between relative overflow-hidden select-none border border-black/[0.08]"
      >
        <div>
          {/* Top Continuation Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-black/[0.08] font-mono text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#0066cc]" />
              <span className="font-extrabold text-[#1d1d1f] uppercase">{personalInfo.fullName} {"//"} CUPERTINO SILICON SPEC (CONT.)</span>
            </div>
            <span className="text-[#0066cc] font-bold">PAGE 02 // 02</span>
          </div>

          {/* BENTO PROJECTS 2 & 3 */}
          <div className="space-y-2.5 mb-3.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#1d1d1f] uppercase">
              <Layers className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>{lang === "vi" ? "DỰ ÁN PHẦN CỨNG & VI MẠCH (TIẾP THEO)" : "SILICON & EMBEDDED WORK (CONT.)"}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {projects.slice(1, 3).map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="p-3.5 rounded-[20px] bg-[#f5f5f7] border border-black/[0.07] flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-black/[0.07]">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-white text-[#0066cc] border border-[#0066cc]/20 shadow-2xs">
                        {proj.tag}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#0066cc]">{proj.period}</span>
                    </div>

                    <h3 className="font-extrabold text-xs text-[#1d1d1f] leading-snug">
                      {proj.title[lang]}
                    </h3>
                    <div className="text-[10px] font-bold text-emerald-700">
                      {proj.role[lang]}
                    </div>
                    <p className="text-[10px] text-[#515154] leading-snug">
                      {proj.description[lang]}
                    </p>

                    <ul className="text-[10px] text-[#1d1d1f] space-y-0.5">
                      {proj.highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                        <li key={hlIdx} className="flex items-start gap-1">
                          <span className="text-[#0066cc] text-[10px]">◆</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-black/[0.07] mt-2">
                    {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[8.5px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-white text-[#1d1d1f] border border-black/[0.08] shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BENTO FOOTER: Experience & Certifications */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            {/* Experience Bento */}
            <div className="p-3.5 rounded-[20px] bg-[#f5f5f7] border border-black/[0.07] space-y-2">
              <div className="text-[11px] font-mono font-extrabold uppercase text-[#0066cc] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#0066cc]" />
                <span>{lang === "vi" ? "HOẠT ĐỘNG LAB & DOANH NGHIỆP" : "LAB & CORPORATE EXPERIENCE"}</span>
              </div>

              <div className="space-y-2.5">
                {experience.map((exp, eIdx) => (
                  <div key={eIdx} className="p-2.5 rounded-2xl bg-white border border-black/[0.08] shadow-2xs space-y-0.5">
                    <div className="flex justify-between items-baseline gap-2 text-xs font-extrabold text-[#1d1d1f]">
                      <span>{exp.title[lang]}</span>
                      <span className="text-[#0066cc] font-mono text-[10px] shrink-0">{exp.period}</span>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700">{exp.organization[lang]}</div>
                    <p className="text-[10px] text-[#515154] leading-snug">{exp.description[lang]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Academic Coursework Bento */}
            <div className="p-3.5 rounded-[20px] bg-[#f5f5f7] border border-black/[0.07] space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-extrabold uppercase text-[#0066cc] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#0066cc]" />
                  <span>{lang === "vi" ? "CHỨNG CHỈ & ĐÀO TẠO" : "CERTIFICATIONS"}</span>
                </div>

                <div className="space-y-1.5">
                  {certifications.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2 rounded-xl bg-white border border-black/[0.08] shadow-2xs text-[10px] text-[#1d1d1f] flex items-start gap-1.5"
                    >
                      <span className="text-emerald-700 font-bold">✔</span>
                      <div>
                        <span className="font-bold text-[#1d1d1f] block leading-snug">{c.name[lang]}</span>
                        <span className="text-[9.5px] text-[#515154] font-mono">
                          {c.issuer} ({c.year})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-black/[0.08] text-[9px] font-mono font-semibold text-[#515154]">
                CUPERTINO SPEC: NQT-SILICON-2026 // APPLE BENTO A4
              </div>
            </div>
          </div>
        </div>

        <span className="a4-page-badge font-mono font-bold text-[#515154]">PAGE 02 // 02</span>
      </section>
    </div>
  );
};
