"use client";

import React from "react";
import { CvData, CvLanguage } from "@/types/cv";
import { ExternalLink } from "lucide-react";

interface TemplateProps {
  data: CvData;
  lang: CvLanguage;
}

export const SwissTypoTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personalInfo, education, skills, projects, experience, certifications } = data;

  return (
    <div className="a4-pages-stack">
      {/* ================= PAGE 01 // 02 ================= */}
      <section
        style={{ backgroundColor: "#faf9f6" }}
        className="a4-sheet bg-[#faf9f6] text-black font-sans p-8 border-t-8 border-[#FF4F00] flex flex-col justify-between relative overflow-hidden select-none"
      >
        <div>
          {/* 01 / IDENTITY */}
          <header className="border-b-4 border-black pb-5">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#FF4F00] uppercase block mb-3">
                  {"01 // ARCHITECT DOSSIER"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-black leading-[1.18] pt-1">
                  {personalInfo.fullName}
                </h1>
                <p className="text-base font-bold tracking-tight text-neutral-800 leading-snug mt-1.5">
                  {personalInfo.title[lang]}
                </p>
              </div>

              <div className="text-right shrink-0 text-[11px] font-bold space-y-1 text-neutral-700 pt-0.5">
                <div>{personalInfo.location[lang]}</div>
                <div className="text-black font-black">{personalInfo.email}</div>
                <div>{personalInfo.phone}</div>
                <div className="text-[#FF4F00] font-black">{personalInfo.website}</div>
              </div>
            </div>

            {/* Swiss Statement Banner */}
            <div className="grid grid-cols-12 gap-4 mt-4 pt-4 border-t border-black/20 text-xs">
              <div className="col-span-3 font-black uppercase text-[#FF4F00] tracking-normal text-[11px]">
                {"// THESIS"}
              </div>
              <div className="col-span-9 font-medium text-neutral-900 leading-relaxed text-justify">
                {personalInfo.summary[lang]}
              </div>
            </div>
          </header>

          {/* 02 / ACADEMICS */}
          <section className="border-b-4 border-black py-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <span className="text-[10px] font-black tracking-normal text-[#FF4F00] uppercase block">
                  {"02 // ACADEMICS"}
                </span>
                <h2 className="text-lg font-black uppercase tracking-tight text-black mt-0.5 leading-snug">
                  {lang === "vi" ? "HỌC VẤN" : "EDUCATION"}
                </h2>
              </div>

              <div className="col-span-9 space-y-2.5">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-black text-black leading-snug">
                        {edu.degree[lang]}
                      </h3>
                      <span className="text-xs font-black text-[#FF4F00] font-mono shrink-0">
                        {edu.period}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-neutral-800 leading-snug text-pretty">
                      <span className="inline-block">{edu.institution[lang]}</span>
                      <span className="mx-1.5 text-neutral-400">—</span>
                      <span className="inline-block">{edu.faculty[lang]}</span>
                    </div>

                    {edu.specialization && (
                      <div className="text-xs font-black text-black leading-snug">
                        <span className="text-[#FF4F00]">■ </span>
                        {edu.specialization[lang]}
                      </div>
                    )}

                    {edu.majorDescription && (
                      <p className="text-[11px] text-neutral-700 leading-snug text-pretty">
                        {edu.majorDescription[lang]}
                      </p>
                    )}

                    <div className="inline-block bg-black text-white text-[10px] font-black px-2 py-0.5 font-mono">
                      {edu.gpa}
                    </div>

                    <div className="text-[11px] text-neutral-700 pt-0.5 leading-relaxed">
                      <span className="font-bold text-black uppercase">Coursework: </span>
                      {edu.coursework[lang].join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 03 / TECHNICAL SPECIFICATION (SKILLS) */}
          <section className="border-b-4 border-black py-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <span className="text-[10px] font-black tracking-normal text-[#FF4F00] uppercase block">
                  {"03 // SPECS"}
                </span>
                <h2 className="text-lg font-black uppercase tracking-tight text-black mt-0.5 leading-snug">
                  {lang === "vi" ? "NĂNG LỰC" : "SKILL MATRIX"}
                </h2>
              </div>

              <div className="col-span-9 grid grid-cols-3 gap-4 text-xs">
                {skills.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h4 className="font-black text-[11px] uppercase tracking-normal text-black pb-1 border-b-2 border-black leading-snug">
                      {cat.categoryName[lang]}
                    </h4>
                    <ul className="space-y-1 text-neutral-800 text-[10px] font-medium">
                      {cat.skills.map((s, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5 leading-snug">
                          <span className="w-1.5 h-1.5 bg-[#FF4F00] shrink-0 mt-1"></span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <span className="a4-page-badge font-mono font-bold text-neutral-600">PAGE 01 // 02</span>
      </section>

      {/* ================= PAGE 02 // 02 ================= */}
      <section
        style={{ backgroundColor: "#faf9f6" }}
        className="a4-sheet bg-[#faf9f6] text-black font-sans p-8 border-t-8 border-black flex flex-col justify-between relative overflow-hidden select-none"
      >
        <div>
          {/* Top Continuation Bar */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-black font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#FF4F00]"></span>
              <span className="font-black uppercase">{personalInfo.fullName} {"//"} SWISS DOSSIER CONTINUATION</span>
            </div>
            <span className="text-[#FF4F00] font-black">PAGE 02 // 02</span>
          </div>

          {/* 04 / PROJECTS */}
          <section className="border-b-4 border-black py-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <span className="text-[10px] font-black tracking-normal text-[#FF4F00] uppercase block">
                  {"04 // WORKS"}
                </span>
                <h2 className="text-lg font-black uppercase tracking-tight text-black mt-0.5 leading-snug">
                  {lang === "vi" ? "DỰ ÁN" : "PROJECTS"}
                </h2>
              </div>

              <div className="col-span-9 space-y-3.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2 border-b border-neutral-300 pb-0.5">
                      <h3 className="text-xs font-black text-black flex items-center gap-1.5">
                        <span>{proj.title[lang]}</span>
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer" className="text-[#FF4F00]">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </h3>
                      <span className="text-[10px] font-bold text-neutral-600 font-mono shrink-0">
                        {proj.period}
                      </span>
                    </div>

                    <div className="text-[11px] font-extrabold text-[#FF4F00]">
                      {proj.role[lang]}
                    </div>

                    <p className="text-[11px] text-neutral-800 leading-snug text-justify">
                      {proj.description[lang]}
                    </p>

                    <ul className="space-y-0.5 text-[10px] text-neutral-700">
                      {proj.highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                        <li key={hlIdx} className="flex items-start gap-1.5">
                          <span className="font-black text-[#FF4F00]">—</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.slice(0, 5).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 border border-black bg-white"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 05 / EXPERIENCE & CERTIFICATIONS */}
          <section className="py-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <span className="text-[10px] font-black tracking-normal text-[#FF4F00] uppercase block">
                  {"05 // ARCHIVE"}
                </span>
                <h2 className="text-lg font-black uppercase tracking-tight text-black mt-0.5 leading-snug">
                  {lang === "vi" ? "HOẠT ĐỘNG" : "ENGAGEMENT"}
                </h2>
              </div>

              <div className="col-span-9 space-y-3">
                <div className="space-y-2.5">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline text-xs font-black">
                        <span className="text-xs">{exp.title[lang]}</span>
                        <span className="text-neutral-600 font-mono text-[10px] shrink-0">{exp.period}</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#FF4F00]">
                        {exp.organization[lang]} — {exp.role[lang]}
                      </div>
                      <p className="text-[10px] text-neutral-700 leading-snug text-justify">
                        {exp.description[lang]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-black/20 text-xs">
                  <span className="font-black uppercase text-black text-[10px] block mb-1.5">
                    {lang === "vi" ? "CHỨNG CHỈ TIÊU BIỂU:" : "VERIFIED CREDENTIALS:"}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {certifications.map((c, idx) => (
                      <div key={idx} className="border border-black p-1.5 bg-white">
                        <div className="font-bold text-black text-[10px] leading-tight">{c.name[lang]}</div>
                        <div className="text-[9px] text-neutral-600 font-mono mt-0.5">{c.issuer} ({c.year})</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <span className="a4-page-badge font-mono font-bold text-neutral-600">PAGE 02 // 02</span>
      </section>
    </div>
  );
};

