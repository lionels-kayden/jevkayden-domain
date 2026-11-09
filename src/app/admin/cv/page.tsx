"use client";

import React, { useState, useEffect } from "react";
import initialCvData from "@/data/cvData.json";
import { CvData } from "@/types/cv";
import { AdminShell } from "@/components/admin/AdminShell";
import { CvWorkspace } from "@/components/admin/CvWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";
import {
  readLiveClientCache,
  fetchFreshestData,
  saveLiveClientCache,
} from "@/lib/liveClientSync";

export default function AdminCvPage() {
  const [cvData, setCvData] = useState<CvData>(initialCvData as CvData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const localSnapshot = readLiveClientCache<CvData>(
      "jev_live_cv_data",
      initialCvData as CvData
    );
    if (localSnapshot?.data?.personalInfo) {
      setCvData(localSnapshot.data);
    }

    fetchFreshestData<CvData>(
      "/api/cv",
      "jev_live_cv_data",
      initialCvData as CvData
    )
      .then((data) => {
        if (data && data.personalInfo) setCvData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/cv:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // 1. Immediately persist to localStorage + .jevkayden.tech cookie + BroadcastChannel (0ms sync)
      const stampedCv = saveLiveClientCache<CvData>("jev_live_cv_data", cvData);
      setCvData(stampedCv);

      // 2. Persist to server (/tmp + GitHub Cloud API)
      const authCode = getAdminPasscode();
      const res = await fetch(`/api/cv?t=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({ passcode: authCode, data: stampedCv }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Save failed");

      const timeStr = new Date().toLocaleTimeString();
      if (result.githubCommitted) {
        setSaveStatus(`✔ ĐÃ LƯU & COMMIT LÊN GITHUB CLOUD [200 OK] — ${timeStr}`);
      } else if (result.mode === "VERCEL_INSTANT_CACHE") {
        setSaveStatus(
          "ĐÃ LƯU TRÊN TRÌNH DUYỆT & BỘ ĐỆM! (Thêm GITHUB_TOKEN trên Vercel để commit vĩnh viễn lên GitHub)"
        );
      } else {
        setSaveStatus(`✔ ĐÃ LƯU CỤC BỘ & ĐỒNG BỘ TRÌNH DUYỆT — ${timeStr}`);
      }
      setTimeout(() => setSaveStatus(null), 7000);
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
