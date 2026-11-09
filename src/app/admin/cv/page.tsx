"use client";

import React, { useState, useEffect } from "react";
import initialCvData from "@/data/cvData.json";
import { CvData } from "@/types/cv";
import { AdminShell } from "@/components/admin/AdminShell";
import { CvWorkspace } from "@/components/admin/CvWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";

export default function AdminCvPage() {
  const [cvData, setCvData] = useState<CvData>(initialCvData as CvData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cv", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CvData | null) => {
        if (data && data.personalInfo) setCvData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/cv:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const authCode = getAdminPasscode();
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({ passcode: authCode, data: cvData }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Save failed");

      const timeStr = new Date().toLocaleTimeString();
      if (result.mode === "GITHUB_COMMIT" || result.syncedToGithub) {
        setSaveStatus(`✔ ĐÃ LƯU & COMMIT LÊN GITHUB CLOUD [200 OK] — ${timeStr}`);
      } else if (result.mode === "VERCEL_INSTANT_CACHE") {
        setSaveStatus(
          `⚡ ĐÃ CẬP NHẬT TRỰC TIẾP TRÊN VERCEL (${timeStr}) — Thêm GITHUB_TOKEN vào Vercel Env để lưu vĩnh viễn lên GitHub`
        );
      } else {
        setSaveStatus(`✔ ĐÃ LƯU CỤC BỘ (src/data/cvData.json) — ${timeStr}`);
      }
      setTimeout(() => setSaveStatus(null), 6000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync error";
      setSaveStatus(`✖ LỖI ĐỒNG BỘ: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminShell
      activeRoute="cv"
      title="NODE 01 // CV DOSSIER (CV.JEVKAYDEN.TECH)"
      onSave={handleSave}
      isSaving={isSaving}
      saveStatus={saveStatus}
      previewHref="/cv"
      previewLabel="XEM /CV ↗"
    >
      <CvWorkspace cvData={cvData} setCvData={setCvData} />
    </AdminShell>
  );
}
