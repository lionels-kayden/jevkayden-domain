"use client";

import React from "react";
import { CvData, CvLanguage } from "@/types/cv";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Cpu,
  Radio,
  Code,
  Award,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

interface TemplateProps {
  data: CvData;
  lang: CvLanguage;
}

export const NeoBrutalistTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personalInfo, education, skills, projects, experience, certifications } = data;

  return (
    <div className="a4-pages-stack">
      {/* ================= PAGE 01 // 02 ================= */}
      <section className="a4-sheet bg-[#f4f0ea] text-black font-sans border-4 border-black p-6 flex flex-col justify-between relative overflow-hidden select-none">
        {/* Top Cartridge Strip */}
        <div className="w-full bg-[#1e1e1e] p-1 border-b-2 border-black flex items-center justify-around mb-3">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="w-3 h-2 bg-amber-400 border border-black/60 inline-block"></span>
          ))}
        </div>

        {/* Header: Builder ID, Title & Contact Deck */}
        <header className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] mb-3 relative">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-black text-amber-300 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider border-2 border-black">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                <span>{personalInfo.clearanceLevel || "LEVEL-4 ARCHITECT"}</span>
              </div>

              <h1 className="font-sans text-2xl font-black text-black tracking-tight uppercase leading-tight">
                {personalInfo.fullName}
              </h1>

              <p className="font-sans text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 inline-block border-2 border-black leading-snug">
                {personalInfo.title[lang]}
              </p>
            </div>

            {/* Quick Contact & Links Matrix */}
            <div className="grid grid-cols-2 gap-1 text-[11px] font-bold shrink-0">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1.5 bg-[#f4f0ea] hover:bg-amber-200 px-2 py-1 border border-black"
              >
                <Mail className="w-3 h-3 text-black shrink-0" />
                <span className="truncate max-w-[140px]">{personalInfo.email}</span>
              </a>

              <div className="flex items-center gap-1.5 bg-[#f4f0ea] px-2 py-1 border border-black">
                <Phone className="w-3 h-3 text-black shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#f4f0ea] px-2 py-1 border border-black">
                <MapPin className="w-3 h-3 text-black shrink-0" />
                <span>{personalInfo.location[lang]}</span>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-amber-300 hover:bg-amber-400 px-1.5 py-1 border border-black text-[10px] font-black"
                >
                  <Globe className="w-2.5 h-2.5" />
                  <span>WEB</span>
                </a>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-zinc-200 px-1.5 py-1 border border-black text-[10px] font-black"
                >
                  <GithubIcon className="w-2.5 h-2.5" />
                  <span>GIT</span>
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-white hover:bg-zinc-200 px-1.5 py-1 border border-black text-[10px] font-black"
                >
                  <LinkedinIcon className="w-2.5 h-2.5" />
                  <span>IN</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-black text-[11px] leading-relaxed text-zinc-800 font-medium">
            <p>{personalInfo.summary[lang]}</p>
          </div>
        </header>

        {/* SECTION 1: CORE SKILL MATRIX */}
        <section className="mb-3">
          <div className="flex items-center gap-2 bg-black text-white px-2.5 py-1 font-bold text-xs tracking-normal uppercase border-2 border-black mb-2 shadow-[2px_2px_0px_0px_#000]">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>{"// SECTION 01: TECHNICAL SKILL MATRIX"}</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {skills.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-black font-extrabold text-[10px] text-black uppercase">
                    {idx === 0 ? (
                      <Cpu className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : idx === 1 ? (
                      <Radio className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Code className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    )}
                    <span>{cat.categoryName[lang]}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-[#f4f0ea] text-[10px] font-bold px-1.5 py-0.5 border border-black text-zinc-900"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: FEATURED PROJECT 1 */}
        {projects[0] && (
          <section className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 bg-black text-white px-2.5 py-1 font-bold text-xs tracking-normal uppercase border-2 border-black mb-2 shadow-[2px_2px_0px_0px_#000]">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{"// SECTION 02: FEATURED HARDWARE & IC PROJECTS (CORE WORK)"}</span>
            </div>

            <div className="bg-white border-2 border-black p-3.5 shadow-[3px_3px_0px_0px_#000] flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-black">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-300 text-black px-1.5 py-0.2 border border-black font-mono font-black text-[9px]">
                      {projects[0].tag}
                    </span>
                    <h3 className="font-sans text-sm font-black text-black leading-snug">
                      {projects[0].title[lang]}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 font-mono">
                    <Calendar className="w-3 h-3 text-black" />
                    <span>{projects[0].period}</span>
                  </div>
                </div>

                <div className="text-[11px] font-black text-emerald-800 pt-1.5 pb-0.5">
                  {">_ ROLE: "} {projects[0].role[lang]}
                </div>

                <p className="text-[11px] text-zinc-800 leading-relaxed font-medium mb-2">
                  {projects[0].description[lang]}
                </p>

                <ul className="space-y-1 mb-2 text-[11px] text-zinc-800">
                  {projects[0].highlights[lang].map((hl, hlIdx) => (
                    <li key={hlIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-black">▶</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-zinc-200">
                {projects[0].technologies.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="bg-zinc-100 text-zinc-800 text-[9px] font-mono font-extrabold px-1.5 py-0.5 border border-zinc-500 uppercase"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <span className="a4-page-badge font-mono font-bold text-zinc-600">PAGE 01 // 02</span>
      </section>

      {/* ================= PAGE 02 // 02 ================= */}
      <section className="a4-sheet bg-[#f4f0ea] text-black font-sans border-4 border-black p-6 flex flex-col justify-between relative overflow-hidden select-none">
        {/* Top Continuation Bar */}
        <div className="flex items-center justify-between bg-black text-white px-3 py-1 border-b-2 border-black font-mono text-[10px] mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400"></span>
            <span className="font-black uppercase">{personalInfo.fullName} {"//"} HARDWARE DOSSIER CONTINUATION</span>
          </div>
          <span className="text-amber-300 font-bold">PAGE 02 // 02</span>
        </div>

        {/* SECTION 2 (CONT.): PROJECTS 2 & 3 */}
        <section className="space-y-2 mb-3">
          <div className="flex items-center gap-1.5 bg-black text-white px-2.5 py-0.5 font-bold text-xs tracking-normal uppercase border-2 border-black">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{"// SECTION 02 (CONT.): HARDWARE & TELEMETRY PLATFORMS"}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {projects.slice(1, 3).map((proj, pIdx) => (
              <div
                key={proj.id || pIdx}
                className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-black">
                    <span className="bg-amber-300 text-black px-1.5 py-0.2 border border-black font-mono font-black text-[9px]">
                      {proj.tag}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 font-bold">{proj.period}</span>
                  </div>

                  <h3 className="font-sans text-xs font-black text-black mt-1 leading-snug">
                    {proj.title[lang]}
                  </h3>
                  <div className="text-[10px] font-black text-emerald-800 pb-0.5">
                    {proj.role[lang]}
                  </div>

                  <p className="text-[10px] text-zinc-800 leading-tight mb-1.5">
                    {proj.description[lang]}
                  </p>

                  <ul className="space-y-0.5 text-[10px] text-zinc-700">
                    {proj.highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                      <li key={hlIdx} className="flex items-start gap-1">
                        <span className="text-amber-600 font-black">▶</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1 pt-1.5 border-t border-zinc-200 mt-1">
                  {proj.technologies.slice(0, 4).map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-zinc-100 text-zinc-800 text-[8px] font-mono font-bold px-1 py-0.2 border border-zinc-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: ACADEMIC CREDENTIALS */}
        <section className="mb-3">
          <div className="flex items-center gap-1.5 bg-black text-white px-2.5 py-0.5 font-bold text-xs tracking-normal uppercase border-2 border-black mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{"// SECTION 03: ACADEMIC CREDENTIALS (VNU-UET)"}</span>
          </div>

          {education[0] && (
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-start justify-between gap-2 pb-1 border-b border-black">
                <div>
                  <h3 className="font-sans text-xs font-black text-black leading-snug">
                    {education[0].institution[lang]}
                  </h3>
                  <p className="text-[10px] text-zinc-600 font-bold">
                    {education[0].faculty[lang]} — <span className="text-emerald-800">{education[0].degree[lang]}</span>
                  </p>
                  {education[0].specialization && (
                    <div className="text-[10px] font-bold text-blue-900 mt-0.5">
                      CHUYÊN NGÀNH: {education[0].specialization[lang]}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="bg-black text-white text-[10px] font-mono px-2 py-0.5 font-bold">
                    {education[0].period}
                  </span>
                  <div className="text-[11px] font-mono font-black text-amber-700 mt-0.5">
                    {education[0].gpa}
                  </div>
                </div>
              </div>

              <div className="mt-1.5 text-[10px] text-zinc-700">
                <span className="font-bold text-black uppercase">Core Coursework: </span>
                {education[0].coursework[lang].join(" • ")}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4: CORPORATE EXPERIENCE & LAB ACTIVITIES */}
        <section className="mb-3">
          <div className="flex items-center gap-1.5 bg-black text-white px-2.5 py-0.5 font-bold text-xs tracking-normal uppercase border-2 border-black mb-1.5">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>{"// SECTION 04: ACTIVITIES & CORPORATE IMMERSION"}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {experience.map((exp, expIdx) => (
              <div
                key={exp.id || expIdx}
                className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000]"
              >
                <div className="flex justify-between items-center pb-1 border-b border-zinc-200 text-[10px] font-mono">
                  <span className="font-bold text-black">{exp.title[lang]}</span>
                  <span className="text-zinc-500">{exp.period}</span>
                </div>
                <div className="text-[10px] font-bold text-zinc-600 mt-0.5">{exp.organization[lang]}</div>
                <p className="text-[10px] text-zinc-700 leading-snug mt-0.5">{exp.description[lang]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: CERTIFICATIONS FOOTER */}
        <footer className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000]">
          <div className="font-extrabold text-[10px] text-black uppercase mb-1.5">
            {"// VERIFIED TECHNICAL CERTIFICATIONS:"}
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            {certifications.map((cert, cIdx) => (
              <div key={cert.id || cIdx} className="bg-[#f4f0ea] p-1.5 border border-black">
                <span className="font-bold text-zinc-900 block truncate">{cert.name[lang]}</span>
                <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">
                  {cert.issuer} • {cert.year}
                </span>
              </div>
            ))}
          </div>
        </footer>

        <span className="a4-page-badge font-mono font-bold text-zinc-600">PAGE 02 // 02</span>
      </section>
    </div>
  );
};

