"use client";

import React from "react";
import { CvData, CvLanguage } from "@/types/cv";

interface TemplateProps {
  data: CvData;
  lang: CvLanguage;
}

export const DatasheetTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personalInfo, education, skills, projects, certifications } = data;

  return (
    <div className="a4-pages-stack">
      {/* ================= PAGE 01 // 02 ================= */}
      <section className="a4-sheet bg-white text-black font-mono p-6 border-2 border-black flex flex-col justify-between relative overflow-hidden select-none text-xs leading-normal">
        <div>
          {/* DATASHEET TOP HEADER BANNER */}
          <div className="border-b-4 border-black pb-2 mb-3">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-700 text-white font-black px-1.5 py-0.2 text-[10px] uppercase">
                    TEXAS INSTRUMENTS STYLE
                  </span>
                  <span className="text-[9px] text-zinc-600 font-bold">
                    SEMICONDUCTOR TECHNICAL DATA
                  </span>
                </div>
                <h1 className="text-xl font-black tracking-tight text-black mt-0.5 leading-snug">
                  PART NO: NQT-IC-2026
                </h1>
                <p className="text-xs font-bold text-zinc-800 font-sans">
                  {personalInfo.fullName} {" // "} {personalInfo.title[lang]}
                </p>
              </div>

              <div className="text-right shrink-0 text-[10px] space-y-0.2">
                <div className="font-bold">DOC: DS-NQT-REV4.19</div>
                <div className="text-zinc-600">REVISED: OCTOBER 2026</div>
                <div className="text-zinc-800 font-bold">{personalInfo.email}</div>
                <div className="text-zinc-600">{personalInfo.location[lang]}</div>
              </div>
            </div>
          </div>

          {/* BLOCK DIAGRAM / PINOUT ASCII BOX */}
          <div className="bg-zinc-50 border border-black p-2 mb-3">
            <div className="text-[9px] font-bold uppercase text-zinc-600 mb-0.5">
              FIGURE 1: FUNCTIONAL PINOUT & CONTACT BUS CONFIGURATION
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-bold border border-zinc-400 bg-white p-1.5">
              <span>[PIN 01: VCC_3V3]</span>
              <span>[PIN 02: {personalInfo.email}]</span>
              <span>[PIN 03: {personalInfo.phone}]</span>
              <span>[PIN 04: {personalInfo.website}]</span>
              <span>[PIN 05: GND]</span>
            </div>
          </div>

          {/* SECTION 1: FEATURES */}
          <section className="mb-3">
            <h2 className="text-[11px] font-black uppercase bg-zinc-200 text-black px-1.5 py-0.5 border border-black mb-1 leading-snug">
              1. FEATURES & ARCHITECTURAL SUMMARY
            </h2>
            <p className="text-[11px] text-justify mb-1 leading-relaxed font-sans">
              {personalInfo.summary[lang]}
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] list-disc list-inside">
              <li>32-Bit Pipelined RTL Design with Hazard Mitigation</li>
              <li>FreeRTOS Industrial Telemetry on ESP32 & STM32</li>
              <li>Low-Power Deep-Sleep Quiescent Current: &lt;14.5µA</li>
              <li>Self-Checking Testbench with 98.7% Code Coverage</li>
            </ul>
          </section>

          {/* SECTION 2: ABSOLUTE MAXIMUM RATINGS TABLE */}
          <section className="mb-3">
            <h2 className="text-[11px] font-black uppercase bg-zinc-200 text-black px-1.5 py-0.5 border border-black mb-1">
              2. ABSOLUTE MAXIMUM RATINGS & SYSTEM SPECIFICATIONS
            </h2>

            <div className="border border-black">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-zinc-100 border-b border-black font-black">
                    <th className="p-1 border-r border-black">PARAMETER</th>
                    <th className="p-1 border-r border-black">TEST CONDITION</th>
                    <th className="p-1 border-r border-black">MIN / TYP</th>
                    <th className="p-1 border-r border-black">MAX RATING</th>
                    <th className="p-1">UNIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-300">
                  <tr>
                    <td className="p-1 border-r border-black font-bold">Operating Frequency (FPGA)</td>
                    <td className="p-1 border-r border-black">Xilinx Artix-7 Synthesis</td>
                    <td className="p-1 border-r border-black">50</td>
                    <td className="p-1 border-r border-black font-bold">100</td>
                    <td className="p-1">MHz</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-r border-black font-bold">Functional Code Coverage</td>
                    <td className="p-1 border-r border-black">50k Random Verification Vectors</td>
                    <td className="p-1 border-r border-black">95.0</td>
                    <td className="p-1 border-r border-black font-bold">98.7</td>
                    <td className="p-1">%</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-r border-black font-bold">Academic GPA Rating</td>
                    <td className="p-1 border-r border-black">VNU-UET // FET (Scale 4.0)</td>
                    <td className="p-1 border-r border-black">3.2</td>
                    <td className="p-1 border-r border-black font-bold">3.62</td>
                    <td className="p-1">GPA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 3: ELECTRICAL CHARACTERISTICS / SKILLS */}
          <section className="mb-3">
            <h2 className="text-[11px] font-black uppercase bg-zinc-200 text-black px-1.5 py-0.5 border border-black mb-1">
              3. ELECTRICAL CHARACTERISTICS & TECHNICAL SKILL MATRIX
            </h2>

            <div className="space-y-1 border border-black p-2 bg-zinc-50">
              {skills.map((cat, idx) => (
                <div key={idx} className="pb-1 border-b border-zinc-300 last:border-none">
                  <span className="font-black text-black uppercase text-[10px]">
                    § 3.{idx + 1} {cat.categoryName[lang]}:
                  </span>
                  <div className="text-[10px] text-zinc-800 pl-2 pt-0.2">
                    {cat.skills.join(" // ")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: APPLICATION CIRCUITS - BLOCK 4.1 */}
          {projects[0] && (
            <section>
              <h2 className="text-[11px] font-black uppercase bg-zinc-200 text-black px-1.5 py-0.5 border border-black mb-1">
                4. APPLICATION CIRCUITS & FUNCTIONAL BLOCKS (PART 1)
              </h2>

              <div className="border border-black p-2.5 bg-white">
                <div className="flex justify-between items-baseline font-black pb-0.5 border-b border-zinc-400">
                  <span className="text-[11px]">
                    BLOCK 4.1: {projects[0].title[lang]} [{projects[0].tag}]
                  </span>
                  <span className="text-[9px] text-zinc-600 font-bold">
                    {projects[0].period}
                  </span>
                </div>

                <div className="text-[10px] font-bold text-zinc-700 py-0.5 font-sans">
                  ENGINEER ROLE: {projects[0].role[lang]}
                </div>

                <p className="text-[10px] text-zinc-800 leading-snug mb-1 font-sans">
                  {projects[0].description[lang]}
                </p>

                <div className="text-[10px] space-y-0.2 mb-1 font-sans">
                  {projects[0].highlights[lang].map((hl, hlIdx) => (
                    <div key={hlIdx} className="flex items-start gap-1">
                      <span className="font-bold">→</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[9px] font-bold text-zinc-600 pt-0.5 border-t border-dashed border-zinc-300 font-mono">
                  REGISTERED TECH: {projects[0].technologies.join(", ")}
                </div>
              </div>
            </section>
          )}
        </div>

        <span className="a4-page-badge font-mono font-bold text-zinc-600">PAGE 01 // 02</span>
      </section>

      {/* ================= PAGE 02 // 02 ================= */}
      <section className="a4-sheet bg-white text-black font-mono p-6 border-2 border-black flex flex-col justify-between relative overflow-hidden select-none text-xs leading-normal">
        <div>
          {/* Top Continuation Banner */}
          <div className="flex justify-between items-center border-b-2 border-black pb-1 mb-3 text-[10px] font-bold">
            <span className="bg-black text-white px-1.5 py-0.2 uppercase">
              {"TEXAS INSTRUMENTS STYLE // DS-NQT-REV4.19 CONTINUATION"}
            </span>
            <span className="font-mono text-zinc-700">PAGE 02 // 02</span>
          </div>

          {/* SECTION 4 (CONT.): BLOCKS 4.2 & 4.3 */}
          <section className="mb-3">
            <h2 className="text-[11px] font-black uppercase bg-zinc-200 text-black px-1.5 py-0.5 border border-black mb-1.5">
              4. APPLICATION CIRCUITS (CONTINUED)
            </h2>

            <div className="space-y-2">
              {projects.slice(1, 3).map((proj, idx) => (
                <div key={idx} className="border border-black p-2.5 bg-white">
                  <div className="flex justify-between items-baseline font-black pb-0.5 border-b border-zinc-400">
                    <span className="text-[11px]">
                      BLOCK 4.{idx + 2}: {proj.title[lang]} [{proj.tag}]
                    </span>
                    <span className="text-[9px] text-zinc-600 font-bold">
                      {proj.period}
                    </span>
                  </div>

                  <div className="text-[10px] font-bold text-zinc-700 py-0.5 font-sans">
                    ENGINEER ROLE: {proj.role[lang]}
                  </div>

                  <p className="text-[10px] text-zinc-800 leading-snug mb-1 font-sans">
                    {proj.description[lang]}
                  </p>

                  <div className="text-[10px] space-y-0.2 mb-1 font-sans">
                    {proj.highlights[lang].map((hl, hlIdx) => (
                      <div key={hlIdx} className="flex items-start gap-1">
                        <span className="font-bold">→</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] font-bold text-zinc-600 pt-0.5 border-t border-dashed border-zinc-300 font-mono">
                    REGISTERED TECH: {proj.technologies.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: EDUCATION & CERTIFICATIONS */}
          <section className="mb-3">
            <h2 className="text-[11px] font-black uppercase bg-zinc-200 text-black px-1.5 py-0.5 border border-black mb-1 leading-snug">
              5. ACADEMIC SPECIFICATION & CERTIFICATION LOGS
            </h2>

            <div className="border border-black p-2.5 bg-zinc-50 space-y-1.5">
              <div>
                <div className="font-black text-xs font-sans">
                  {education[0]?.degree[lang]} — {education[0]?.institution[lang]}
                </div>
                <div className="text-[10px] text-zinc-700 font-sans">
                  Faculty: {education[0]?.faculty[lang]} | Period: {education[0]?.period} | Score: {education[0]?.gpa}
                </div>
                {education[0]?.specialization && (
                  <div className="text-[10px] font-bold text-zinc-900 font-sans mt-0.5">
                    Track: {education[0]?.specialization[lang]}
                  </div>
                )}
                <div className="text-[9px] text-zinc-600 mt-0.5 font-sans">
                  Coursework: {education[0]?.coursework[lang].join(" • ")}
                </div>
              </div>

              <div className="pt-1.5 border-t border-zinc-300">
                <span className="font-bold text-[10px] block mb-0.5">
                  VERIFIED CERTIFICATIONS:
                </span>
                <div className="text-[10px] space-y-0.5 font-sans">
                  {certifications.map((c, idx) => (
                    <div key={idx}>
                      [{c.year}] {c.name[lang]} — {c.issuer}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* DATASHEET FOOTER */}
        <div>
          <div className="border-t-2 border-black pt-1 flex justify-between text-[9px] text-zinc-600 font-bold">
            <span>{"CONFIDENTIAL // PRE-SILICON SPECIFICATION"}</span>
            <span>{"COPYRIGHT © 2026 NGUYỄN QUANG THẮNG"}</span>
          </div>
          <span className="a4-page-badge font-mono font-bold text-zinc-600">PAGE 02 // 02</span>
        </div>
      </section>
    </div>
  );
};
