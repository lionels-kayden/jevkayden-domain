"use client";

import React from "react";
import { CvData, CvLanguage } from "@/types/cv";

interface TemplateProps {
  data: CvData;
  lang: CvLanguage;
}

export const AtsClassicTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personalInfo, education, skills, projects, experience, certifications } = data;

  return (
    <div className="a4-pages-stack">
      {/* ================= PAGE 01 // 02 ================= */}
      <section className="a4-sheet bg-white text-black font-serif p-8 flex flex-col justify-between relative overflow-hidden select-none">
        <div>
          {/* HEADER: Centered ATS Standard */}
          <header className="text-center pb-3 mb-3 border-b border-black">
            <h1 className="text-2xl font-bold uppercase tracking-normal text-black leading-snug">
              {personalInfo.fullName}
            </h1>
            <div className="text-xs font-semibold italic text-black mt-0.5 leading-snug">
              {personalInfo.title[lang]}
            </div>

            {/* Contact Links Bar */}
            <div className="text-[11px] text-black mt-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 font-sans">
              <span>{personalInfo.location[lang]}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              <span>•</span>
              <a href={`mailto:${personalInfo.email}`} className="underline">
                {personalInfo.email}
              </a>
              <span>•</span>
              <a href={personalInfo.website} className="underline">
                jevkayden.tech
              </a>
              <span>•</span>
              <a href={personalInfo.github} className="underline">
                github.com/jevkayden
              </a>
              <span>•</span>
              <a href={personalInfo.linkedin} className="underline">
                linkedin.com/in/nguyenquangthang
              </a>
            </div>
          </header>

          {/* PROFESSIONAL SUMMARY */}
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-normal text-black border-b border-black pb-0.5 mb-1 leading-snug font-sans">
              {lang === "vi" ? "TỔNG QUAN NĂNG LỰC" : "PROFESSIONAL SUMMARY"}
            </h2>
            <p className="text-[11px] text-justify leading-relaxed">
              {personalInfo.summary[lang]}
            </p>
          </section>

          {/* EDUCATION */}
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-normal text-black border-b border-black pb-0.5 mb-1 leading-snug font-sans">
              {lang === "vi" ? "HỌC VẤN" : "EDUCATION"}
            </h2>

            {education.map((edu, idx) => (
              <div key={idx} className="mb-1.5">
                <div className="flex justify-between items-baseline text-xs font-bold font-sans">
                  <span>{edu.institution[lang]}</span>
                  <span>{edu.period}</span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] italic">
                  <span>
                    {edu.degree[lang]} — {edu.faculty[lang]}
                  </span>
                  <span className="not-italic font-semibold font-sans">{edu.gpa}</span>
                </div>
                {edu.specialization && (
                  <div className="text-[10px] text-zinc-900 font-sans font-medium">
                    <span className="font-semibold">{lang === "vi" ? "Chuyên ngành: " : "Specialization: "}</span>
                    <span>{edu.specialization[lang]}</span>
                  </div>
                )}
                {edu.majorDescription && (
                  <div className="text-[10px] text-zinc-700 leading-snug italic mt-0.5">
                    {edu.majorDescription[lang]}
                  </div>
                )}
                <div className="text-[10px] mt-0.5 text-black font-sans">
                  <span className="font-semibold">
                    {lang === "vi" ? "Học phần tiêu biểu: " : "Core Coursework: "}
                  </span>
                  <span>{edu.coursework[lang].join(", ")}.</span>
                </div>
              </div>
            ))}
          </section>

          {/* TECHNICAL SKILLS */}
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-normal text-black border-b border-black pb-0.5 mb-1 leading-snug font-sans">
              {lang === "vi" ? "KỸ NĂNG CHUYÊN MÔN" : "TECHNICAL SKILLS"}
            </h2>

            <div className="space-y-0.5 text-[11px] font-sans">
              {skills.map((cat, idx) => (
                <div key={idx} className="flex items-baseline">
                  <span className="font-bold w-44 shrink-0">
                    {cat.categoryName[lang]}:
                  </span>
                  <span className="text-black flex-1">
                    {cat.skills.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* KEY ENGINEERING PROJECTS (PART 1) */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-normal text-black border-b border-black pb-0.5 mb-1 leading-snug font-sans">
              {lang === "vi" ? "DỰ ÁN KỸ THUẬT TIÊU BIỂU (PHẦN 1)" : "KEY ENGINEERING PROJECTS (PART 1)"}
            </h2>

            <div className="space-y-2">
              {projects.slice(0, 2).map((proj, pIdx) => (
                <div key={pIdx}>
                  <div className="flex justify-between items-baseline text-xs font-bold font-sans">
                    <span>{proj.title[lang]}</span>
                    <span>{proj.period}</span>
                  </div>
                  <div className="text-[11px] italic text-black mb-0.5">
                    <span>Role: {proj.role[lang]}</span>
                    <span className="not-italic font-normal text-[10px] ml-2 font-mono">
                      [Tech: {proj.technologies.join(", ")}]
                    </span>
                  </div>
                  <p className="text-[11px] text-justify mb-0.5 leading-snug">
                    {proj.description[lang]}
                  </p>
                  <ul className="list-disc list-inside text-[10px] space-y-0.5">
                    {proj.highlights[lang].map((hl, hlIdx) => (
                      <li key={hlIdx} className="leading-snug">
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <span className="a4-page-badge font-sans font-bold text-zinc-500">PAGE 01 // 02</span>
      </section>

      {/* ================= PAGE 02 // 02 ================= */}
      <section className="a4-sheet bg-white text-black font-serif p-8 flex flex-col justify-between relative overflow-hidden select-none">
        <div>
          {/* Top Continuation Header */}
          <div className="flex justify-between items-baseline border-b border-black pb-1 mb-3 text-xs font-bold font-sans">
            <span>{personalInfo.fullName.toUpperCase()} — CURRICULUM VITAE</span>
            <span className="text-[10px] font-mono text-zinc-600">CONTINUATION — PAGE 2</span>
          </div>

          {/* Project 3 */}
          {projects[2] && (
            <section className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-normal text-black border-b border-black pb-0.5 mb-1 leading-snug font-sans">
                {lang === "vi" ? "DỰ ÁN KỸ THUẬT TIÊU BIỂU (TIẾP THEO)" : "KEY ENGINEERING PROJECTS (CONT.)"}
              </h2>

              <div>
                <div className="flex justify-between items-baseline text-xs font-bold font-sans">
                  <span>{projects[2].title[lang]}</span>
                  <span>{projects[2].period}</span>
                </div>
                <div className="text-[11px] italic text-black mb-0.5">
                  <span>Role: {projects[2].role[lang]}</span>
                  <span className="not-italic font-normal text-[10px] ml-2 font-mono">
                    [Tech: {projects[2].technologies.join(", ")}]
                  </span>
                </div>
                <p className="text-[11px] text-justify mb-0.5 leading-snug">
                  {projects[2].description[lang]}
                </p>
                <ul className="list-disc list-inside text-[10px] space-y-0.5">
                  {projects[2].highlights[lang].map((hl, hlIdx) => (
                    <li key={hlIdx} className="leading-snug">
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* EXPERIENCE & ENGAGEMENTS */}
          <section className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-normal text-black border-b border-black pb-0.5 mb-1 leading-snug font-sans">
              {lang === "vi" ? "TRẢI NGHIỆM DOANH NGHIỆP & LAB" : "EXPERIENCE & LAB ENGAGEMENTS"}
            </h2>

            <div className="space-y-2">
              {experience.map((exp, eIdx) => (
                <div key={eIdx}>
                  <div className="flex justify-between items-baseline text-xs font-bold font-sans">
                    <span>{exp.title[lang]}</span>
                    <span>{exp.period}</span>
                  </div>
                  <div className="text-[11px] italic mb-0.5">
                    {exp.organization[lang]} — {exp.role[lang]}
                  </div>
                  <p className="text-[11px] text-justify leading-snug">
                    {exp.description[lang]}
                  </p>
                  {exp.highlights && (
                    <ul className="list-disc list-inside text-[10px] mt-0.5 space-y-0.5">
                      {exp.highlights[lang].map((hl, hlIdx) => (
                        <li key={hlIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CERTIFICATIONS */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-normal text-black border-b border-black pb-0.5 mb-1 leading-snug font-sans">
              {lang === "vi" ? "CHỨNG CHỈ & THÀNH TÍCH" : "CERTIFICATIONS & CREDENTIALS"}
            </h2>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 font-sans">
              {certifications.map((c, cIdx) => (
                <li key={cIdx}>
                  <span className="font-semibold">{c.name[lang]}</span> — {c.issuer} ({c.year})
                </li>
              ))}
            </ul>
          </section>
        </div>

        <span className="a4-page-badge font-sans font-bold text-zinc-500">PAGE 02 // 02</span>
      </section>
    </div>
  );
};

