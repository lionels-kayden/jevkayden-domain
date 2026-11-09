"use client";

import React, { useState, useEffect } from "react";
import initialHubData from "@/data/hubData.json";
import { HubData } from "@/types/hub";
import { AdminShell } from "@/components/admin/AdminShell";
import { HubWorkspace } from "@/components/admin/HubWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";

export default function AdminHubPage() {
  const [hubData, setHubData] = useState<HubData>(initialHubData as HubData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/site", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HubData | null) => {
        if (data && data.hero) setHubData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/site:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const authCode = getAdminPasscode();
      const res = await fetch("/api/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({ passcode: authCode, data: hubData }),
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
        setSaveStatus(`✔ ĐÃ LƯU CỤC BỘ (src/data/hubData.json) — ${timeStr}`);
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
      activeRoute="hub"
      title="NODE 00 // MAIN HUB (JEVKAYDEN.TECH)"
      onSave={handleSave}
      isSaving={isSaving}
      saveStatus={saveStatus}
      previewHref="/"
      previewLabel="XEM HUB ↗"
    >
      <HubWorkspace hubData={hubData} setHubData={setHubData} />
    </AdminShell>
  );
}
