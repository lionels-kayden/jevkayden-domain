"use client";

import React, { useState } from "react";
import {
  CvData,
  CvLanguage,
  CvProjectItem,
  CvEducationItem,
  CvSkillCategory,
  CvExperienceItem,
} from "@/types/cv";
import { TemplateId } from "@/components/cv/CvControlDeck";
import { NeoBrutalistTemplate } from "@/components/cv/NeoBrutalistTemplate";
import { ExecutiveTemplate } from "@/components/cv/ExecutiveTemplate";
import { AtsClassicTemplate } from "@/components/cv/AtsClassicTemplate";
import { BentoSiliconTemplate } from "@/components/cv/BentoSiliconTemplate";
import { DatasheetTemplate } from "@/components/cv/DatasheetTemplate";
import { SwissTypoTemplate } from "@/components/cv/SwissTypoTemplate";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface CvWorkspaceProps {
  cvData: CvData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
}

type CvTab = "profile" | "education" | "skills" | "projects" | "experience";

// Helper for moving items in arrays
function moveItem<T>(arr: T[], index: number, direction: "up" | "down"): T[] {
  const newArr = [...arr];
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= newArr.length) return newArr;
  const temp = newArr[index];
  newArr[index] = newArr[targetIndex];
  newArr[targetIndex] = temp;
  return newArr;
}

export const CvWorkspace: React.FC<CvWorkspaceProps> = ({ cvData, setCvData }) => {
  const [activeTab, setActiveTab] = useState<CvTab>("profile");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId>("t1");
  const [previewLang, setPreviewLang] = useState<CvLanguage>("vi");

  // Proportional Live Preview controls
  const [zoomScale, setZoomScale] = useState<0.75 | 1>(0.75);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Common typography & input classes
  const inputSansClass =
    "w-full p-2.5 border-2 border-black bg-white font-sans text-sm font-semibold text-black leading-relaxed focus:bg-amber-50/50 outline-none";
  const inputMonoClass =
    "w-full p-2.5 border-2 border-black bg-white font-mono text-xs font-bold text-black focus:bg-amber-50/50 outline-none";
  const textareaSansClass =
    "w-full p-3 border-2 border-black bg-white font-sans text-sm font-normal text-black leading-relaxed min-h-[100px] focus:bg-amber-50/50 outline-none";
  const labelClass =
    "font-mono text-[11px] font-black uppercase text-zinc-700 block mb-1 tracking-wide";

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#ece7df]">
      {/* LEFT PANE: Visual Editor Tabs */}
      <div
        className={`${isExpanded ? "hidden" : "lg:col-span-5 xl:col-span-5"
          } h-full overflow-y-auto border-r-2 border-black bg-white flex flex-col`}
      >
        {/* Tab Selector Buttons - Sticky at top */}
        <div className="grid grid-cols-5 gap-1 p-2 sticky top-0 z-20 bg-white border-b-2 border-black shrink-0 select-none shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-1 py-1.5 font-mono font-black text-center border-2 border-black text-[11px] leading-tight cursor-pointer transition-colors ${activeTab === "profile"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
          >
            01. IDENTITY
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("education")}
            className={`px-1 py-1.5 font-mono font-black text-center border-2 border-black text-[11px] leading-tight cursor-pointer transition-colors ${activeTab === "education"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
          >
            02. ACADEMICS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`px-1 py-1.5 font-mono font-black text-center border-2 border-black text-[11px] leading-tight cursor-pointer transition-colors ${activeTab === "skills"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
          >
            03. SKILLS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`px-1 py-1.5 font-mono font-black text-center border-2 border-black text-[11px] leading-tight cursor-pointer transition-colors ${activeTab === "projects"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
          >
            04. PROJECTS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("experience")}
            className={`px-1 py-1.5 font-mono font-black text-center border-2 border-black text-[11px] leading-tight cursor-pointer transition-colors ${activeTab === "experience"
                ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              }`}
          >
            05. TIMELINE
          </button>
        </div>

        {/* Tab Body Content - Full-height panel with zero canvas void */}
        <div className="flex-1 p-5 space-y-4 bg-white">
          {/* TAB 1: PROFILE & CONTACT */}
          {activeTab === "profile" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>HỌ VÀ TÊN / FULL NAME:</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, fullName: e.target.value },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>BÍ DANH / HANDLE:</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.handle}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, handle: e.target.value },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>CLEARANCE / BADGE:</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.clearanceLevel || ""}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, clearanceLevel: e.target.value },
                      })
                    }
                    placeholder="LEVEL-4 ARCHITECT"
                    className={inputMonoClass}
                  />
                </div>
              </div>

              {/* Professional Title VI & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>CHỨC DANH (VI):</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.title.vi}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: {
                          ...cvData.personalInfo,
                          title: { ...cvData.personalInfo.title, vi: e.target.value },
                        },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>PROFESSIONAL TITLE (EN):</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.title.en}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: {
                          ...cvData.personalInfo,
                          title: { ...cvData.personalInfo.title, en: e.target.value },
                        },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              {/* Location VI & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>ĐỊA ĐIỂM (VI):</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.location.vi}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: {
                          ...cvData.personalInfo,
                          location: { ...cvData.personalInfo.location, vi: e.target.value },
                        },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>LOCATION (EN):</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.location.en}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: {
                          ...cvData.personalInfo,
                          location: { ...cvData.personalInfo.location, en: e.target.value },
                        },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>EMAIL LIÊN HỆ:</label>
                  <input
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, email: e.target.value },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>SỐ ĐIỆN THOẠI:</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.phone}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, phone: e.target.value },
                      })
                    }
                    className={inputSansClass}
                  />
                </div>
              </div>

              {/* Website, GitHub, LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>WEBSITE CÁ NHÂN:</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.website}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, website: e.target.value },
                      })
                    }
                    className={inputMonoClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>GITHUB URL:</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.github}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, github: e.target.value },
                      })
                    }
                    className={inputMonoClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>LINKEDIN URL:</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.linkedin}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, linkedin: e.target.value },
                      })
                    }
                    className={inputMonoClass}
                  />
                </div>
              </div>

              {/* Summary VI & EN */}
              <div>
                <label className={labelClass}>TỔNG QUAN NĂNG LỰC / MỤC TIÊU NGHỀ NGHIỆP (VI):</label>
                <textarea
                  rows={4}
                  value={cvData.personalInfo.summary.vi}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: {
                        ...cvData.personalInfo,
                        summary: { ...cvData.personalInfo.summary, vi: e.target.value },
                      },
                    })
                  }
                  className={textareaSansClass}
                />
              </div>

              <div>
                <label className={labelClass}>SUMMARY / CAREER OBJECTIVE (EN):</label>
                <textarea
                  rows={4}
                  value={cvData.personalInfo.summary.en}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: {
                        ...cvData.personalInfo,
                        summary: { ...cvData.personalInfo.summary, en: e.target.value },
                      },
                    })
                  }
                  className={textareaSansClass}
                />
              </div>
            </div>
          )}

          {/* TAB 2: EDUCATION & VNU-UET HIERARCHY */}
          {activeTab === "education" && (
            <div className="space-y-5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                <span className="font-mono font-black text-sm text-black uppercase">
                  DANH SÁCH HỌC VẤN & BẰNG CẤP VNU-UET ({cvData.education.length})
                </span>
                <button
                  onClick={() => {
                    const newEdu: CvEducationItem = {
                      id: `edu-${Date.now()}`,
                      institution: {
                        vi: "Trường Đại học Công nghệ – Đại học Quốc gia Hà Nội (VNU-UET)",
                        en: "University of Engineering and Technology – VNU Hanoi (VNU-UET)",
                      },
                      faculty: {
                        vi: "Khoa Điện tử Viễn thông (FET)",
                        en: "Faculty of Electronics and Telecommunications (FET)",
                      },
                      degree: {
                        vi: "Kỹ sư Công nghệ Kỹ thuật Điện tử – Viễn thông",
                        en: "B.Eng. in Electronics and Telecommunications Engineering",
                      },
                      specialization: {
                        vi: "Định hướng Thiết kế Vi mạch Bán dẫn (IC Design / VLSI) & Hệ thống Nhúng IoT",
                        en: "Specialization in Semiconductor IC Design (VLSI/RTL) & Embedded IoT Systems",
                      },
                      majorDescription: {
                        vi: "Chương trình đào tạo kỹ sư chất lượng cao tập trung vào thiết kế vi mạch số/tương tự, kiến trúc vi xử lý (ARM/RISC-V), hệ thống nhúng thời gian thực (RTOS).",
                        en: "Core engineering program focused on digital/analog integrated circuit design, microprocessor architectures (ARM/RISC-V), and real-time embedded firmware.",
                      },
                      period: "2025 - 2029",
                      location: {
                        vi: "Hà Nội, Việt Nam",
                        en: "Hanoi, Vietnam",
                      },
                      gpa: "3.62 / 4.0",
                      coursework: {
                        vi: ["Thiết kế Vi mạch Số & Verilog HDL", "Hệ điều hành Thời gian thực (RTOS)"],
                        en: ["Digital IC Design & Verilog HDL", "Real-Time Operating Systems (RTOS)"],
                      },
                    };
                    setCvData({ ...cvData, education: [...cvData.education, newEdu] });
                  }}
                  type="button"
                  className="inline-flex items-center gap-1.5 bg-black text-amber-300 px-3 py-1.5 text-xs font-bold border-2 border-black cursor-pointer hover:bg-zinc-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>THÊM HỌC VẤN</span>
                </button>
              </div>

              {cvData.education.map((edu, idx) => (
                <div key={edu.id || idx} className="p-4 border-2 border-black bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black bg-zinc-100 p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs bg-black text-amber-300 px-2 py-0.5">
                        #{idx + 1}
                      </span>
                      <span className="font-sans font-bold text-sm text-black">
                        {edu.degree.vi || "Bằng cấp"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = moveItem(cvData.education, idx, "up");
                          setCvData({ ...cvData, education: updated });
                        }}
                        className="p-1 bg-white hover:bg-zinc-200 border border-black disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === cvData.education.length - 1}
                        onClick={() => {
                          const updated = moveItem(cvData.education, idx, "down");
                          setCvData({ ...cvData, education: updated });
                        }}
                        className="p-1 bg-white hover:bg-zinc-200 border border-black disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Xóa mục học vấn này?")) {
                            const updated = cvData.education.filter((_, i) => i !== idx);
                            setCvData({ ...cvData, education: updated });
                          }
                        }}
                        className="p-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Institution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>TRƯỜNG ĐẠI HỌC (VI):</label>
                      <input
                        type="text"
                        value={edu.institution.vi}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            institution: { ...updated[idx].institution, vi: e.target.value },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>INSTITUTION (EN):</label>
                      <input
                        type="text"
                        value={edu.institution.en}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            institution: { ...updated[idx].institution, en: e.target.value },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  {/* Faculty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>KHOA ĐÀO TẠO (VI):</label>
                      <input
                        type="text"
                        value={edu.faculty.vi}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            faculty: { ...updated[idx].faculty, vi: e.target.value },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>FACULTY (EN):</label>
                      <input
                        type="text"
                        value={edu.faculty.en}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            faculty: { ...updated[idx].faculty, en: e.target.value },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  {/* Degree */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>NGÀNH HỌC / BẰNG CẤP (VI):</label>
                      <input
                        type="text"
                        value={edu.degree.vi}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            degree: { ...updated[idx].degree, vi: e.target.value },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>DEGREE (EN):</label>
                      <input
                        type="text"
                        value={edu.degree.en}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            degree: { ...updated[idx].degree, en: e.target.value },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>ĐỊNH HƯỚNG CHUYÊN NGÀNH (VI):</label>
                      <input
                        type="text"
                        value={edu.specialization?.vi || ""}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            specialization: {
                              vi: e.target.value,
                              en: updated[idx].specialization?.en || "",
                            },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>SPECIALIZATION (EN):</label>
                      <input
                        type="text"
                        value={edu.specialization?.en || ""}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            specialization: {
                              vi: updated[idx].specialization?.vi || "",
                              en: e.target.value,
                            },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  {/* Major Description */}
                  <div>
                    <label className={labelClass}>MÔ TẢ ĐỊNH HƯỚNG NGÀNH HỌC (VI):</label>
                    <textarea
                      rows={3}
                      value={edu.majorDescription?.vi || ""}
                      onChange={(e) => {
                        const updated = [...cvData.education];
                        updated[idx] = {
                          ...updated[idx],
                          majorDescription: {
                            vi: e.target.value,
                            en: updated[idx].majorDescription?.en || "",
                          },
                        };
                        setCvData({ ...cvData, education: updated });
                      }}
                      className={textareaSansClass}
                    />
                  </div>

                  {/* Period, GPA, Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>NIÊN KHÓA / PERIOD:</label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = { ...updated[idx], period: e.target.value };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputMonoClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>ĐIỂM GPA / XẾP LOẠI:</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = { ...updated[idx], gpa: e.target.value };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputMonoClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>ĐỊA ĐIỂM (VI):</label>
                      <input
                        type="text"
                        value={edu.location.vi}
                        onChange={(e) => {
                          const updated = [...cvData.education];
                          updated[idx] = {
                            ...updated[idx],
                            location: { ...updated[idx].location, vi: e.target.value },
                          };
                          setCvData({ ...cvData, education: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  {/* Coursework list */}
                  <div>
                    <label className={labelClass}>CHUYÊN ĐỀ HỌC PHẦN (PHÂN TÁCH BẰNG DẤU PHẨY) [VI]:</label>
                    <input
                      type="text"
                      value={edu.coursework.vi.join(", ")}
                      onChange={(e) => {
                        const updated = [...cvData.education];
                        updated[idx] = {
                          ...updated[idx],
                          coursework: {
                            ...updated[idx].coursework,
                            vi: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          },
                        };
                        setCvData({ ...cvData, education: updated });
                      }}
                      className={inputSansClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                <span className="font-mono font-black text-sm text-black uppercase">
                  NHÓM KỸ NĂNG CỐT LÕI ({cvData.skills.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newCat: CvSkillCategory = {
                      id: `cat-${Date.now()}`,
                      categoryName: { vi: "Nhóm kỹ năng mới", en: "New Skill Group" },
                      skills: ["Kỹ năng 1", "Kỹ năng 2"],
                    };
                    setCvData({ ...cvData, skills: [...cvData.skills, newCat] });
                  }}
                  className="inline-flex items-center gap-1.5 bg-black text-amber-300 px-3 py-1.5 text-xs font-bold border-2 border-black cursor-pointer hover:bg-zinc-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>THÊM NHÓM KỸ NĂNG</span>
                </button>
              </div>

              {cvData.skills.map((cat, idx) => (
                <div key={cat.id || idx} className="p-4 border-2 border-black bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black bg-zinc-100 p-2">
                    <span className="font-mono font-black text-xs bg-black text-amber-300 px-2 py-0.5">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Xóa nhóm kỹ năng này?")) {
                          setCvData({
                            ...cvData,
                            skills: cvData.skills.filter((_, i) => i !== idx),
                          });
                        }
                      }}
                      className="p-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>TÊN NHÓM (VI):</label>
                      <input
                        type="text"
                        value={cat.categoryName.vi}
                        onChange={(e) => {
                          const updated = [...cvData.skills];
                          updated[idx] = {
                            ...updated[idx],
                            categoryName: { ...updated[idx].categoryName, vi: e.target.value },
                          };
                          setCvData({ ...cvData, skills: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>CATEGORY NAME (EN):</label>
                      <input
                        type="text"
                        value={cat.categoryName.en}
                        onChange={(e) => {
                          const updated = [...cvData.skills];
                          updated[idx] = {
                            ...updated[idx],
                            categoryName: { ...updated[idx].categoryName, en: e.target.value },
                          };
                          setCvData({ ...cvData, skills: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>DANH SÁCH KỸ NĂNG (CÁCH NHAU BẰNG DẤU PHẨY):</label>
                    <input
                      type="text"
                      value={cat.skills.join(", ")}
                      onChange={(e) => {
                        const updated = [...cvData.skills];
                        updated[idx] = {
                          ...updated[idx],
                          skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        };
                        setCvData({ ...cvData, skills: updated });
                      }}
                      className={inputSansClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                <span className="font-mono font-black text-sm text-black uppercase">
                  DỰ ÁN TIÊU BIỂU ({cvData.projects.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newProj: CvProjectItem = {
                      id: `proj-${Date.now()}`,
                      title: { vi: "Dự án mới", en: "New Project" },
                      tag: "HARDWARE",
                      role: { vi: "Trưởng nhóm thiết kế", en: "Lead Designer" },
                      period: "2026",
                      description: { vi: "Mô tả dự án...", en: "Project description..." },
                      highlights: { vi: ["Điểm nổi bật 1"], en: ["Highlight 1"] },
                      technologies: ["Verilog", "FPGA"],
                    };
                    setCvData({ ...cvData, projects: [...cvData.projects, newProj] });
                  }}
                  className="inline-flex items-center gap-1.5 bg-black text-amber-300 px-3 py-1.5 text-xs font-bold border-2 border-black cursor-pointer hover:bg-zinc-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>THÊM DỰ ÁN</span>
                </button>
              </div>

              {cvData.projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 border-2 border-black bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black bg-zinc-100 p-2">
                    <span className="font-mono font-black text-xs bg-black text-amber-300 px-2 py-0.5">
                      #{idx + 1} {proj.title.vi}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = moveItem(cvData.projects, idx, "up");
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className="p-1 bg-white hover:bg-zinc-200 border border-black disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === cvData.projects.length - 1}
                        onClick={() => {
                          const updated = moveItem(cvData.projects, idx, "down");
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className="p-1 bg-white hover:bg-zinc-200 border border-black disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Xóa dự án này?")) {
                            setCvData({
                              ...cvData,
                              projects: cvData.projects.filter((_, i) => i !== idx),
                            });
                          }
                        }}
                        className="p-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>TÊN DỰ ÁN (VI):</label>
                      <input
                        type="text"
                        value={proj.title.vi}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx] = {
                            ...updated[idx],
                            title: { ...updated[idx].title, vi: e.target.value },
                          };
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>PROJECT TITLE (EN):</label>
                      <input
                        type="text"
                        value={proj.title.en}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx] = {
                            ...updated[idx],
                            title: { ...updated[idx].title, en: e.target.value },
                          };
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>TAG / PHÂN LOẠI:</label>
                      <input
                        type="text"
                        value={proj.tag}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx] = { ...updated[idx], tag: e.target.value };
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className={inputMonoClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>VAI TRÒ (VI):</label>
                      <input
                        type="text"
                        value={proj.role.vi}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx] = {
                            ...updated[idx],
                            role: { ...updated[idx].role, vi: e.target.value },
                          };
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>THỜI GIAN / PERIOD:</label>
                      <input
                        type="text"
                        value={proj.period}
                        onChange={(e) => {
                          const updated = [...cvData.projects];
                          updated[idx] = { ...updated[idx], period: e.target.value };
                          setCvData({ ...cvData, projects: updated });
                        }}
                        className={inputMonoClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>MÔ TẢ CHI TIẾT (VI):</label>
                    <textarea
                      rows={3}
                      value={proj.description.vi}
                      onChange={(e) => {
                        const updated = [...cvData.projects];
                        updated[idx] = {
                          ...updated[idx],
                          description: { ...updated[idx].description, vi: e.target.value },
                        };
                        setCvData({ ...cvData, projects: updated });
                      }}
                      className={textareaSansClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>CÔNG NGHỆ SỬ DỤNG (CÁCH NHAU BẰNG DẤU PHẨY):</label>
                    <input
                      type="text"
                      value={proj.technologies.join(", ")}
                      onChange={(e) => {
                        const updated = [...cvData.projects];
                        updated[idx] = {
                          ...updated[idx],
                          technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        };
                        setCvData({ ...cvData, projects: updated });
                      }}
                      className={inputSansClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                <span className="font-mono font-black text-sm text-black uppercase">
                  KINH NGHIỆM & HOẠT ĐỘNG ({cvData.experience?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newExp: CvExperienceItem = {
                      id: `exp-${Date.now()}`,
                      title: { vi: "Vị trí mới", en: "New Role" },
                      organization: { vi: "Tổ chức / Lab", en: "Organization / Lab" },
                      period: "2026",
                      role: { vi: "Thành viên nghiên cứu", en: "Research Member" },
                      description: { vi: "Mô tả công việc...", en: "Work description..." },
                    };
                    setCvData({
                      ...cvData,
                      experience: [...(cvData.experience || []), newExp],
                    });
                  }}
                  className="inline-flex items-center gap-1.5 bg-black text-amber-300 px-3 py-1.5 text-xs font-bold border-2 border-black cursor-pointer hover:bg-zinc-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>THÊM KINH NGHIỆM</span>
                </button>
              </div>

              {(cvData.experience || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 border-2 border-black bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black bg-zinc-100 p-2">
                    <span className="font-mono font-black text-xs bg-black text-amber-300 px-2 py-0.5">
                      #{idx + 1} {exp.title.vi}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Xóa kinh nghiệm này?")) {
                          setCvData({
                            ...cvData,
                            experience: (cvData.experience || []).filter((_, i) => i !== idx),
                          });
                        }
                      }}
                      className="p-1 bg-red-100 hover:bg-red-200 text-red-700 border border-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>CHỨC DANH / VAI TRÒ (VI):</label>
                      <input
                        type="text"
                        value={exp.title.vi}
                        onChange={(e) => {
                          const updated = [...(cvData.experience || [])];
                          updated[idx] = {
                            ...updated[idx],
                            title: { ...updated[idx].title, vi: e.target.value },
                          };
                          setCvData({ ...cvData, experience: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>ĐƠN VỊ / TỔ CHỨC (VI):</label>
                      <input
                        type="text"
                        value={exp.organization.vi}
                        onChange={(e) => {
                          const updated = [...(cvData.experience || [])];
                          updated[idx] = {
                            ...updated[idx],
                            organization: { ...updated[idx].organization, vi: e.target.value },
                          };
                          setCvData({ ...cvData, experience: updated });
                        }}
                        className={inputSansClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>MÔ TẢ CÔNG VIỆC & HOẠT ĐỘNG (VI):</label>
                    <textarea
                      rows={3}
                      value={exp.description.vi}
                      onChange={(e) => {
                        const updated = [...(cvData.experience || [])];
                        updated[idx] = {
                          ...updated[idx],
                          description: { ...updated[idx].description, vi: e.target.value },
                        };
                        setCvData({ ...cvData, experience: updated });
                      }}
                      className={textareaSansClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Scaled Proportional A4 Live Preview (75% / 100%) */}
      <div
        className={`${isExpanded ? "lg:col-span-12" : "lg:col-span-7 xl:col-span-7"
          } h-full flex flex-col min-h-0 overflow-hidden bg-[#F4F6F9]`}
      >
        {/* Preview Control Deck */}
        <div className="bg-black text-white px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 border-b-2 border-black shrink-0 text-xs font-mono select-none sticky top-0 z-20">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-amber-300">LIVE PREVIEW:</span>
            <div className="inline-flex border border-zinc-700 bg-zinc-900">
              <button
                type="button"
                onClick={() => setPreviewLang("vi")}
                className={`px-2 py-0.5 text-[11px] font-bold cursor-pointer ${previewLang === "vi" ? "bg-amber-400 text-black" : "text-zinc-300 hover:text-white"
                  }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang("en")}
                className={`px-2 py-0.5 text-[11px] font-bold cursor-pointer ${previewLang === "en" ? "bg-amber-400 text-black" : "text-zinc-300 hover:text-white"
                  }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Template Selector T1-T6 */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(["t1", "t2", "t3", "t4", "t5", "t6"] as TemplateId[]).map((tId) => (
              <button
                key={tId}
                type="button"
                onClick={() => setPreviewTemplate(tId)}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase border cursor-pointer ${previewTemplate === tId
                    ? "bg-amber-300 text-black border-amber-300 font-black"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                  }`}
              >
                {tId.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Zoom and Expand */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoomScale((prev) => (prev === 0.75 ? 1 : 0.75))}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 text-[10px] cursor-pointer"
            >
              {zoomScale === 0.75 ? <ZoomIn className="w-3 h-3" /> : <ZoomOut className="w-3 h-3" />}
              <span>{zoomScale === 0.75 ? "75% FIT" : "100% REAL"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 cursor-pointer"
              title={isExpanded ? "Thu nhỏ về 2 cột" : "Mở rộng toàn màn hình"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live A4 Scaled Container */}
        <div className="flex-1 h-full overflow-y-auto overflow-x-auto p-4 sm:p-6 flex justify-center items-start bg-[#F4F6F9]">
          <div
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-in-out",
            }}
            className="w-[210mm] shrink-0 mb-8 max-w-full"
          >
            {previewTemplate === "t1" && (
              <NeoBrutalistTemplate data={cvData} lang={previewLang} />
            )}
            {previewTemplate === "t2" && (
              <ExecutiveTemplate data={cvData} lang={previewLang} />
            )}
            {previewTemplate === "t3" && (
              <AtsClassicTemplate data={cvData} lang={previewLang} />
            )}
            {previewTemplate === "t4" && (
              <BentoSiliconTemplate data={cvData} lang={previewLang} />
            )}
            {previewTemplate === "t5" && (
              <DatasheetTemplate data={cvData} lang={previewLang} />
            )}
            {previewTemplate === "t6" && (
              <SwissTypoTemplate data={cvData} lang={previewLang} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
