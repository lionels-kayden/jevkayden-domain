"use client";

import React from "react";
import { CvData, CvLanguage } from "@/types/cv";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

interface TemplateProps {
  data: CvData;
  lang: CvLanguage;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personalInfo, education, skills, projects, experience, certifications } = data;

  return (
    <div className="a4-pages-stack">
      {/* ================= PAGE 01 // 02 ================= */}
      <section className="a4-sheet grid grid-cols-12 overflow-hidden relative text-slate-800 font-sans">
        {/* LEFT COLUMN: Deep Slate/Navy Executive Sidebar (4 cols) */}
        <aside className="col-span-4 bg-[#0f172a] print:bg-[#0f172a] text-slate-200 p-5 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-4">
            {/* Profile Avatar / Initials Shield */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-slate-700/80">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl tracking-wider shadow-lg mb-2">
                NQT
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                {personalInfo.fullName}
              </h2>
              <p className="text-[11px] font-semibold text-cyan-400 mt-0.5">
                {personalInfo.title[lang]}
              </p>
            </div>

            {/* Contact Channels */}
            <div className="space-y-2 text-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800">
                {lang === "vi" ? "THÔNG TIN LIÊN HỆ" : "CONTACT INFORMATION"}
              </h3>

              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                <a href={`mailto:${personalInfo.email}`} className="hover:text-white truncate text-[11px]">
                  {personalInfo.email}
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="text-[11px]">{personalInfo.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="text-[11px]">{personalInfo.location[lang]}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:text-white text-[11px]">
                  jevkayden.tech
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <GithubIcon className="w-3 h-3 text-cyan-400 shrink-0" />
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-white truncate text-[11px]">
                  github.com/jevkayden
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <LinkedinIcon className="w-3 h-3 text-cyan-400 shrink-0" />
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-white truncate text-[11px]">
                  linkedin/nguyenquangthang
                </a>
              </div>
            </div>

            {/* Skills Progress / Groups */}
            <div className="space-y-3 text-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800">
                {lang === "vi" ? "NĂNG LỰC CỐT LÕI" : "CORE COMPETENCIES"}
              </h3>

              {skills.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-semibold text-slate-200 text-[10px] flex items-center justify-between">
                    <span>{cat.categoryName[lang]}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.slice(0, 5).map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-slate-800/90 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>CONFIDENTIAL // EXECUTIVE</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: Executive White Content Area (8 cols) */}
        <main className="col-span-8 p-6 flex flex-col justify-between h-full bg-white space-y-4">
          {/* Executive Header Banner */}
          <div className="border-b-2 border-slate-100 pb-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {personalInfo.fullName}
            </h1>
            <p className="text-sm font-bold text-blue-600 mt-0.5 leading-snug">
              {personalInfo.title[lang]}
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed text-justify">
              {personalInfo.summary[lang]}
            </p>
          </div>

          {/* FEATURED PROJECTS (Part 1: Projects 1 & 2) */}
          <section className="space-y-3 flex-1">
            <div className="flex items-center gap-2 pb-1 border-b-2 border-blue-600">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 leading-snug">
                {lang === "vi" ? "DỰ ÁN KỸ THUẬT TIÊU BIỂU (PHẦN 1)" : "KEY ENGINEERING PROJECTS (PART 1)"}
              </h2>
            </div>

            <div className="space-y-3.5">
              {projects.slice(0, 2).map((proj, pIdx) => (
                <div key={pIdx} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{proj.title[lang]}</span>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono font-medium shrink-0">
                      {proj.period}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-blue-700">
                    {proj.role[lang]}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                    {proj.description[lang]}
                  </p>

                  <ul className="space-y-0.5 text-[11px] text-slate-700 pt-0.5">
                    {proj.highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                      <li key={hlIdx} className="flex items-start gap-1">
                        <ChevronRight className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.slice(0, 5).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-slate-100 text-slate-700 text-[9px] font-semibold px-1.5 py-0.5 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <span className="a4-page-badge text-slate-400">PAGE 01 // 02</span>
        </main>
      </section>

      {/* ================= PAGE 02 // 02 ================= */}
      <section className="a4-sheet grid grid-cols-12 overflow-hidden relative text-slate-800 font-sans">
        {/* LEFT COLUMN: Deep Slate/Navy Executive Sidebar (4 cols) Continuation */}
        <aside className="col-span-4 bg-[#0f172a] print:bg-[#0f172a] text-slate-200 p-5 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-5">
            {/* Top Continuation Badge */}
            <div className="pb-3 border-b border-slate-700/80">
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">
                DOSSIER CONTINUATION
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                {personalInfo.fullName}
              </h3>
            </div>

            {/* Academic Background */}
            <div className="space-y-2.5 text-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>{lang === "vi" ? "HỌC VẤN & TRƯỜNG LỚP" : "ACADEMIC BACKGROUND"}</span>
              </h3>

              {education.map((edu, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-bold text-white text-xs leading-snug">
                    {edu.degree[lang]}
                  </div>
                  <div className="text-cyan-300 text-[11px] leading-tight font-medium">
                    {edu.institution[lang]}
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {edu.faculty[lang]}
                  </div>
                  {edu.specialization && (
                    <div className="text-amber-300 text-[10px] leading-tight font-medium">
                      {edu.specialization[lang]}
                    </div>
                  )}
                  {edu.majorDescription && (
                    <div className="text-slate-400 text-[10px] leading-relaxed">
                      {edu.majorDescription[lang]}
                    </div>
                  )}
                  <div className="text-slate-300 text-[10px] font-mono flex justify-between pt-1">
                    <span>{edu.period}</span>
                    <span className="text-emerald-400 font-bold">{edu.gpa}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified Certifications */}
            <div className="space-y-2 text-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-cyan-400" />
                <span>{lang === "vi" ? "CHỨNG CHỈ TIÊU BIỂU" : "CERTIFICATIONS"}</span>
              </h3>
              <div className="space-y-1.5">
                {certifications.map((c, cIdx) => (
                  <div key={cIdx} className="text-slate-300 text-[10px] leading-tight">
                    <span className="font-semibold text-white block">• {c.name[lang]}</span>
                    <span className="text-[9px] text-slate-400 font-mono ml-2">
                      {c.issuer} ({c.year})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
            VERIFIED SPEC // 2026 EDITION
          </div>
        </aside>

        {/* RIGHT COLUMN: Executive White Content Area (8 cols) Continuation */}
        <main className="col-span-8 p-6 flex flex-col justify-between h-full bg-white space-y-4">
          {/* Top Continuation Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
              {personalInfo.fullName} {"//"} {personalInfo.title[lang]}
            </span>
            <span className="text-[10px] font-mono text-blue-600 font-bold">
              PAGE 02 // 02
            </span>
          </div>

          {/* Project 3 */}
          {projects[2] && (
            <section className="space-y-2">
              <div className="flex items-center gap-2 pb-1 border-b-2 border-blue-600">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 leading-snug">
                  {lang === "vi" ? "DỰ ÁN KỸ THUẬT (TIẾP THEO)" : "KEY ENGINEERING PROJECTS (CONT.)"}
                </h2>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between gap-1">
                  <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>{projects[2].title[lang]}</span>
                    {projects[2].url && (
                      <a
                        href={projects[2].url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono font-medium shrink-0">
                    {projects[2].period}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-blue-700">
                  {projects[2].role[lang]}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                  {projects[2].description[lang]}
                </p>

                <ul className="space-y-0.5 text-[11px] text-slate-700 pt-0.5">
                  {projects[2].highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                    <li key={hlIdx} className="flex items-start gap-1">
                      <ChevronRight className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1 pt-1">
                  {projects[2].technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-slate-100 text-slate-700 text-[9px] font-semibold px-1.5 py-0.5 rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PROFESSIONAL & COMMUNITY EXPERIENCE */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 pb-1 border-b-2 border-blue-600">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 leading-snug">
                {lang === "vi" ? "TRẢI NGHIỆM DOANH NGHIỆP & LAB" : "EXPERIENCE & LAB ENGAGEMENT"}
              </h2>
            </div>

            <div className="space-y-2.5">
              {experience.map((exp, eIdx) => (
                <div key={eIdx} className="space-y-0.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold text-xs text-slate-900">
                      {exp.title[lang]}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">{exp.period}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-blue-700">
                    {exp.organization[lang]}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {exp.description[lang]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* DETAILED COURSEWORK FOOTER */}
          <section className="pt-2 border-t border-slate-100 text-xs">
            <div className="font-bold text-slate-900 uppercase mb-1 flex items-center gap-1.5 text-[11px]">
              <BookOpen className="w-3 h-3 text-blue-600" />
              <span>{lang === "vi" ? "CHUYÊN ĐỀ ĐÀO TẠO ĐÃ HOÀN THÀNH" : "SPECIALIZED COURSEWORK"}</span>
            </div>
            <p className="text-slate-600 text-[10px] leading-relaxed">
              {education[0]?.coursework[lang].join(" • ")}
            </p>
          </section>

          <span className="a4-page-badge text-slate-400">PAGE 02 // 02</span>
        </main>
      </section>
    </div>
  );
};

