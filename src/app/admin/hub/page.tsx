"use client";

import React, { useState, useEffect } from "react";
import initialHubData from "@/data/hubData.json";
import { HubData } from "@/types/hub";
import { AdminShell } from "@/components/admin/AdminShell";
import { HubWorkspace } from "@/components/admin/HubWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";
import {
  readLiveClientCache,
  fetchFreshestData,
  saveLiveClientCache,
} from "@/lib/liveClientSync";

export default function AdminHubPage() {
  const [hubData, setHubData] = useState<HubData>(initialHubData as HubData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const localSnapshot = readLiveClientCache<HubData>(
      "jev_live_hub_data",
      initialHubData as HubData
    );
    if (localSnapshot?.data?.hero) {
      setHubData(localSnapshot.data);
    }

    fetchFreshestData<HubData>(
      "/api/site",
      "jev_live_hub_data",
      initialHubData as HubData
    )
      .then((data) => {
        if (data && data.hero) setHubData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/site:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // 1. Immediately persist to localStorage + BroadcastChannel (0ms sync)
      const stampedHub = saveLiveClientCache<HubData>(
        "jev_live_hub_data",
        hubData
      );
      setHubData(stampedHub);

      // 2. Persist to server (/tmp + GitHub Cloud API)
      const authCode = getAdminPasscode();
      const res = await fetch(`/api/site?t=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({ passcode: authCode, data: stampedHub }),
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
