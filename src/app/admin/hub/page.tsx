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
    fetch("/api/hub", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HubData | null) => {
        if (data && data.hero) setHubData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/hub:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const authCode = getAdminPasscode();
      const res = await fetch("/api/hub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({ passcode: authCode, data: hubData }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setSaveStatus(`✔ ĐÃ ĐỒNG BỘ MAIN HUB [200 OK] — ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setSaveStatus(null), 3500);
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

