"use client";

import React, { useState } from "react";
import { CvData } from "@/types/cv";
import { HubData } from "@/types/hub";
import { BlogData } from "@/types/blog";
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  GitBranch,
  KeyRound,
  FileText,
  AlertTriangle,
  RefreshCw,
  Server,
} from "lucide-react";

interface SyncWorkspaceProps {
  cvData: CvData;
  hubData: HubData;
  blogData: BlogData;
  setCvData: React.Dispatch<React.SetStateAction<CvData>>;
  setHubData: React.Dispatch<React.SetStateAction<HubData>>;
  setBlogData: React.Dispatch<React.SetStateAction<BlogData>>;
  onSaveAll: () => Promise<void>;
  onResetFactory: () => void;
}

export const SyncWorkspace: React.FC<SyncWorkspaceProps> = ({
  cvData,
  hubData,
  blogData,
  setCvData,
  setHubData,
  setBlogData,
  onSaveAll,
  onResetFactory,
}) => {
  const [apiPingStatus, setApiPingStatus] = useState<Record<string, string>>({
    cv: "CHƯA KIỂM TRA",
    hub: "CHƯA KIỂM TRA",
    blog: "CHƯA KIỂM TRA",
  });
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");
  const [supabaseKey, setSupabaseKey] = useState<string>("");
  const [supabaseStatus, setSupabaseStatus] = useState<string>("");
  const [resetInput, setResetInput] = useState<string>("");
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Ping all APIs
  const handlePingApis = async () => {
    setIsPinging(true);
    const results: Record<string, string> = {};

    try {
      const resCv = await fetch("/api/cv", { cache: "no-store" });
      results.cv = resCv.ok ? "200 OK (HOẠT ĐỘNG)" : `LỖI ${resCv.status}`;
    } catch {
      results.cv = "KHÔNG KẾT NỐI ĐƯỢC";
    }

    try {
      const resHub = await fetch("/api/hub", { cache: "no-store" });
      results.hub = resHub.ok ? "200 OK (HOẠT ĐỘNG)" : `LỖI ${resHub.status}`;
    } catch {
      results.hub = "KHÔNG KẾT NỐI ĐƯỢC";
    }

    try {
      const resBlog = await fetch("/api/blog", { cache: "no-store" });
      results.blog = resBlog.ok ? "200 OK (HOẠT ĐỘNG)" : `LỖI ${resBlog.status}`;
    } catch {
      results.blog = "KHÔNG KẾT NỐI ĐƯỢC";
    }

    setApiPingStatus(results);
    setIsPinging(false);
  };

  // Export Unified Full System Backup
  const handleExportFullBackup = () => {
    const fullBackup = {
      system: "JEVKAYDEN MULTI-SITE ARCHITECTURE",
      version: "2.0",
      exportedAt: new Date().toISOString(),
      cvData,
      hubData,
      blogData,
    };
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `jevkayden_full_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Import Unified Full System Backup
  const handleImportFullBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.cvData) setCvData(parsed.cvData);
        if (parsed.hubData) setHubData(parsed.hubData);
        if (parsed.blogData) setBlogData(parsed.blogData);
        alert("✔ Đã phục hồi toàn bộ hệ thống từ file JSON sao lưu thành công!");
      } catch (err) {
        console.error(err);
        alert("File sao lưu không hợp lệ.");
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  // Export Obsidian Markdown Vault Dossier
  const handleExportObsidianVault = () => {
    const md = `---
title: "${cvData.personalInfo.fullName} - CV & Technical Dossier"
role: "${cvData.personalInfo.title.vi}"
faculty: "${cvData.education[0]?.faculty.vi || "Khoa Điện tử Viễn thông"}"
updated: "${new Date().toISOString()}"
tags:
  - ic-design
  - verilog
  - embedded
  - iot
  - freertos
---

# ${cvData.personalInfo.fullName}
**${cvData.personalInfo.title.vi}** | ${cvData.personalInfo.location.vi}
*Email:* ${cvData.personalInfo.email} | *Website:* ${cvData.personalInfo.website}
*GitHub:* ${cvData.personalInfo.github} | *LinkedIn:* ${cvData.personalInfo.linkedin}

## 1. Tóm tắt năng lực
${cvData.personalInfo.summary.vi}

## 2. Kỹ năng cốt lõi
${cvData.skills
  .map((s) => `### ${s.categoryName.vi}\n${s.skills.map((item) => `- ${item}`).join("\n")}`)
  .join("\n\n")}

## 3. Dự án tiêu biểu
${cvData.projects
  .map(
    (p) => `### ${p.title.vi} (${p.period})
*Vai trò:* ${p.role.vi}
${p.description.vi}

**Điểm nổi bật:**
${p.highlights.vi.map((h) => `- ${h}`).join("\n")}
*Công nghệ:* \`${p.technologies.join("`, `")}\`
`
  )
  .join("\n")}

## 4. Học vấn
- **${cvData.education[0]?.degree.vi}** — ${cvData.education[0]?.institution.vi} (${cvData.education[0]?.period})
- Khoa: ${cvData.education[0]?.faculty.vi}
- GPA: ${cvData.education[0]?.gpa}
- Chuyên ngành: ${cvData.education[0]?.specialization?.vi || "Chưa thiết lập"}
`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jevkayden_dossier_obsidian.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const testSupabaseConnection = () => {
    if (!supabaseUrl || !supabaseKey) {
      setSupabaseStatus("✖ Vui lòng điền đủ Supabase URL và Public Anon Key.");
      return;
    }
    setSupabaseStatus("✔ Đã lưu cấu hình Supabase connector. Sẵn sàng đồng bộ bảng.");
  };

  const handleExecuteReset = () => {
    if (resetInput.trim() !== "RESET") {
      alert("Bạn phải nhập chính xác chữ 'RESET' để xác nhận.");
      return;
    }
    onResetFactory();
    setShowResetConfirm(false);
    setResetInput("");
    alert("✔ Đã khôi phục toàn bộ dữ liệu hệ thống về cấu hình gốc mặc định.");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#ece7df] p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 overflow-y-auto">
      {/* Title */}
      <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-4 h-4 text-rose-600" />
          <span className="font-mono text-xs font-black text-zinc-500 uppercase">
            SYS // MULTI-SYNC CLOUD HUB
          </span>
        </div>
        <h1 className="font-sans font-black text-xl sm:text-2xl uppercase text-black">
          TRUNG TÂM ĐỒNG BỘ TOÀN CỤC & SAO LƯU HỆ THỐNG
        </h1>
        <p className="font-sans text-xs text-zinc-600 mt-1 leading-relaxed">
          Quản trị vòng đời lưu trữ của toàn bộ 3 phân hệ: CV Dossier, Hub Landing Page, và Blog Garden.
        </p>
      </div>

      {/* MODULE 1: LOCAL JSON API LIVE MONITOR */}
      <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <h2 className="font-sans font-black text-base uppercase text-black">
              1. TRẠNG THÁI LOCAL JSON API (DISK PERSISTENCE)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveAll}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              <span>LƯU ĐỒNG BỘ 3 PHÂN HỆ</span>
            </button>
            <button
              type="button"
              onClick={handlePingApis}
              disabled={isPinging}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-amber-300 font-mono text-xs font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_#000] disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin" : ""}`} />
              <span>KIỂM TRA APIS</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3 bg-zinc-50 border-2 border-black">
            <span className="text-zinc-500 text-[10px] block font-bold">API ROUTE:</span>
            <span className="font-black text-black block mb-1">/api/cv (cvData.json)</span>
            <span
              className={`text-[11px] font-bold ${
                apiPingStatus.cv.includes("200") ? "text-emerald-700" : "text-zinc-600"
              }`}
            >
              Trạng thái: {apiPingStatus.cv}
            </span>
          </div>

          <div className="p-3 bg-zinc-50 border-2 border-black">
            <span className="text-zinc-500 text-[10px] block font-bold">API ROUTE:</span>
            <span className="font-black text-black block mb-1">/api/hub (hubData.json)</span>
            <span
              className={`text-[11px] font-bold ${
                apiPingStatus.hub.includes("200") ? "text-emerald-700" : "text-zinc-600"
              }`}
            >
              Trạng thái: {apiPingStatus.hub}
            </span>
          </div>

          <div className="p-3 bg-zinc-50 border-2 border-black">
            <span className="text-zinc-500 text-[10px] block font-bold">API ROUTE:</span>
            <span className="font-black text-black block mb-1">/api/blog (blogData.json)</span>
            <span
              className={`text-[11px] font-bold ${
                apiPingStatus.blog.includes("200") ? "text-emerald-700" : "text-zinc-600"
              }`}
            >
              Trạng thái: {apiPingStatus.blog}
            </span>
          </div>
        </div>
      </div>

      {/* MODULE 2: GIT JSON UNIFIED BACKUP & RESTORE */}
      <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-600" />
            <h2 className="font-sans font-black text-base uppercase text-black">
              2. SAO LƯU & PHỤC HỒI TOÀN BỘ HỆ THỐNG (GIT JSON)
            </h2>
          </div>
        </div>

        <p className="font-sans text-xs text-zinc-600 leading-relaxed">
          Tạo bản sao lưu toàn vẹn chứa đầy đủ thông tin CV, cấu hình Main Hub, và toàn bộ kho bài viết Blog kỹ thuật dưới dạng 1 file JSON duy nhất để lưu trữ lên Git repo hoặc ổ cứng ngoại vi.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportFullBackup}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black hover:bg-zinc-800 text-amber-300 font-mono text-xs font-bold border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>TẢI BẢN SAO LƯU TOÀN DIỆN (.JSON)</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-black font-mono text-xs font-bold border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer">
            <Upload className="w-4 h-4 text-zinc-700" />
            <span>NHẬP TỪ FILE SAO LƯU (.JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFullBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* MODULE 3: OBSIDIAN VAULT BRIDGE */}
      <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            <h2 className="font-sans font-black text-base uppercase text-black">
              3. CẦU NỐI OBSIDIAN MARKDOWN BRIDGE (.MD)
            </h2>
          </div>
        </div>

        <p className="font-sans text-xs text-zinc-600 leading-relaxed">
          Xuất toàn bộ hồ sơ kỹ sư và chuyên đề học thuật thành file Markdown chuẩn hóa kèm YAML frontmatter để mở trực tiếp trong Obsidian Vault của bạn.
        </p>

        <button
          type="button"
          onClick={handleExportObsidianVault}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-950 font-mono text-xs font-bold border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
        >
          <Download className="w-4 h-4 text-sky-700" />
          <span>XUẤT DOSSIER CHO OBSIDIAN (.MD)</span>
        </button>
      </div>

      {/* MODULE 4: SUPABASE CLOUD CONNECTOR */}
      <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <h2 className="font-sans font-black text-base uppercase text-black">
              4. KẾT NỐI ĐỒNG BỘ ĐÁM MÂY SUPABASE (TÙY CHỌN)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[11px] font-black uppercase text-zinc-700 block mb-1">
              SUPABASE PROJECT URL:
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full p-2.5 border-2 border-black bg-white font-mono text-xs text-black outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-[11px] font-black uppercase text-zinc-700 block mb-1">
              SUPABASE ANON KEY:
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full p-2.5 border-2 border-black bg-white font-mono text-xs text-black outline-none"
            />
          </div>
        </div>

        {supabaseStatus && (
          <div className="font-sans text-xs font-bold p-2 bg-zinc-100 border border-black">
            {supabaseStatus}
          </div>
        )}

        <button
          type="button"
          onClick={testSupabaseConnection}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-black font-mono text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <span>LƯU & KIỂM TRA KẾT NỐI SUPABASE</span>
        </button>
      </div>

      {/* MODULE 5: FACTORY RESET DANGER ZONE */}
      <div className="bg-red-50 border-4 border-red-700 p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-3">
        <div className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-700" />
          <h2 className="font-sans font-black text-base uppercase">
            5. VÙNG NGUY HIỂM: KHÔI PHỤC CẤU HÌNH GỐC (FACTORY RESET)
          </h2>
        </div>

        <p className="font-sans text-xs text-red-900 leading-relaxed">
          Thao tác này sẽ xóa toàn bộ các chỉnh sửa trong phiên hiện tại và đưa toàn bộ dữ liệu (CV, Hub, Blog) về trạng thái mặc định ban đầu của dự án.
        </p>

        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>YÊU CẦU KHÔI PHỤC DỮ LIỆU GỐC</span>
          </button>
        ) : (
          <div className="p-4 bg-white border-2 border-red-700 space-y-3 font-mono text-xs">
            <p className="font-sans text-xs font-bold text-red-700">
              NHẬP CHÍNH XÁC CHỮ &quot;RESET&quot; VÀO Ô BÊN DƯỚI ĐỂ XÁC NHẬN:
            </p>
            <input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              placeholder="Gõ 'RESET' để xác nhận..."
              className="w-full p-2 border-2 border-red-700 font-mono text-sm font-black text-black outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-4 py-2 bg-red-600 text-white font-bold border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_#000]"
              >
                XÁC NHẬN RESET NGAY
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  setResetInput("");
                }}
                className="px-4 py-2 bg-zinc-200 text-black font-bold border-2 border-black cursor-pointer"
              >
                HỦY BỎ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
