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

  return (
    <div className="a4-pages-stack">
      {/* ================= PAGE 01 // 02 ================= */}
      <section className="a4-sheet bg-[#09090b] text-zinc-100 font-sans p-6 flex flex-col justify-between relative overflow-hidden select-none border border-zinc-800">
        {/* Background Silicon Glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          {/* HEADER BENTO: Silicon Hero Card */}
          <div className="grid grid-cols-12 gap-3 mb-3">
            {/* Main Identity Card (8 cols) */}
            <div className="col-span-8 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-[10px] font-mono font-bold">
                  <Cpu className="w-3 h-3 animate-pulse" />
                  <span>{lang === "vi" ? "KIẾN TRÚC VI MẠCH & BÁN DẪN" : "SILICON & EMBEDDED ARCHITECTURE"}</span>
                </div>

                <h1 className="text-2xl font-black text-white tracking-tight leading-snug">
                  {personalInfo.fullName}
                </h1>

                <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 leading-snug">
                  {personalInfo.title[lang]}
                </p>

                <p className="text-[11px] text-zinc-400 leading-relaxed pt-0.5">
                  {personalInfo.summary[lang]}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2 text-[10px] font-mono text-zinc-400 border-t border-zinc-800/80 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {personalInfo.location[lang]}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  {personalInfo.email}
                </span>
              </div>
            </div>

            {/* Quick Link Bento Deck (4 cols) */}
            <div className="col-span-4 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5 text-[10px]">
                <a
                  href={personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/80 text-zinc-200"
                >
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span className="font-semibold">jevkayden.tech</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                </a>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/80 text-zinc-200"
                >
                  <div className="flex items-center gap-1.5">
                    <GithubIcon className="w-3 h-3 text-zinc-300" />
                    <span className="font-semibold">GitHub</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">@jevkayden</span>
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/80 text-zinc-200"
                >
                  <div className="flex items-center gap-1.5">
                    <LinkedinIcon className="w-3 h-3 text-blue-400" />
                    <span className="font-semibold">LinkedIn</span>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                </a>
              </div>

              {/* Academic Badge */}
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-800/50 text-[10px] space-y-0.5">
                <div className="flex items-center justify-between font-bold text-emerald-300">
                  <span>{education[0]?.degree[lang]}</span>
                  <span className="font-mono text-emerald-400">{education[0]?.gpa.split(" ")[0]}</span>
                </div>
                <div className="text-zinc-300 text-[9px] truncate">
                  {education[0]?.institution[lang]}
                </div>
              </div>
            </div>
          </div>

          {/* 4 GLOWING SILICON METRIC CARDS */}
          {keyMetrics && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {keyMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center"
                >
                  <div className="text-[9px] font-mono font-bold uppercase text-zinc-400">
                    {m.label[lang]}
                  </div>
                  <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mt-0.5">
                    {m.value}
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono">
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
                className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono uppercase text-cyan-300">
                  {idx === 0 ? <Cpu className="w-3 h-3" /> : idx === 1 ? <Radio className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                  <span className="truncate">{cat.categoryName[lang]}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-200 border border-zinc-700/80"
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
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {projects[0].tag}
                  </span>
                  <h3 className="font-bold text-xs text-white">
                    {projects[0].title[lang]}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  {projects[0].period}
                </span>
              </div>

              <div className="text-[11px] font-semibold text-teal-400">
                {projects[0].role[lang]}
              </div>

              <p className="text-[11px] text-zinc-400 leading-snug">
                {projects[0].description[lang]}
              </p>

              <ul className="text-[10px] text-zinc-300 space-y-0.5 pt-0.5">
                {projects[0].highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                  <li key={hlIdx} className="flex items-start gap-1">
                    <span className="text-cyan-400">◆</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1 pt-1 border-t border-zinc-800 mt-1">
                {projects[0].technologies.slice(0, 5).map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="a4-page-badge font-mono font-bold text-zinc-500">PAGE 01 // 02</span>
      </section>

      {/* ================= PAGE 02 // 02 ================= */}
      <section className="a4-sheet bg-[#09090b] text-zinc-100 font-sans p-6 flex flex-col justify-between relative overflow-hidden select-none border border-zinc-800">
        <div>
          {/* Top Continuation Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-bold text-white uppercase">{personalInfo.fullName} {"//"} SILICON SPECIFICATION CONTINUATION</span>
            </div>
            <span className="text-cyan-400 font-bold">PAGE 02 // 02</span>
          </div>

          {/* BENTO PROJECTS 2 & 3 */}
          <div className="space-y-2.5 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 uppercase">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === "vi" ? "DỰ ÁN PHẦN CỨNG & VI MẠCH (TIẾP THEO)" : "SILICON & EMBEDDED WORK (CONT.)"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {projects.slice(1, 3).map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {proj.tag}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{proj.period}</span>
                    </div>

                    <h3 className="font-bold text-xs text-white leading-snug">
                      {proj.title[lang]}
                    </h3>
                    <div className="text-[10px] font-semibold text-teal-400">
                      {proj.role[lang]}
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      {proj.description[lang]}
                    </p>

                    <ul className="text-[10px] text-zinc-300 space-y-0.5">
                      {proj.highlights[lang].slice(0, 2).map((hl, hlIdx) => (
                        <li key={hlIdx} className="flex items-start gap-1">
                          <span className="text-cyan-400 text-[10px]">◆</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1.5 border-t border-zinc-800 mt-1">
                    {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[8px] font-mono px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
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
          <div className="grid grid-cols-2 gap-2.5 mb-2">
            {/* Experience Bento */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === "vi" ? "HOẠT ĐỘNG LAB & DOANH NGHIỆP" : "LAB & CORPORATE EXPERIENCE"}</span>
              </div>

              <div className="space-y-2">
                {experience.map((exp, eIdx) => (
                  <div key={eIdx} className="space-y-0.5">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{exp.title[lang]}</span>
                      <span className="text-zinc-500 font-mono text-[10px]">{exp.period}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-cyan-300">{exp.organization[lang]}</div>
                    <p className="text-[10px] text-zinc-400 leading-tight">{exp.description[lang]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Academic Coursework Bento */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === "vi" ? "CHỨNG CHỈ & ĐÀO TẠO" : "CERTIFICATIONS"}</span>
                </div>

                <div className="space-y-1.5">
                  {certifications.map((c, cIdx) => (
                    <div key={cIdx} className="text-[10px] text-zinc-300 flex items-start gap-1.5">
                      <span className="text-cyan-400">✔</span>
                      <div>
                        <span className="font-semibold text-white block">{c.name[lang]}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">
                          {c.issuer} ({c.year})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1.5 border-t border-zinc-800/80 text-[9px] font-mono text-zinc-500">
                CHIPSET SPEC: NQT-SILICON-2026 // RETRO-OS v4.19
              </div>
            </div>
          </div>
        </div>

        <span className="a4-page-badge font-mono font-bold text-zinc-500">PAGE 02 // 02</span>
      </section>
    </div>
  );
};
