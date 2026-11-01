"use client";

import React, { useState, useEffect } from "react";
import initialHubData from "@/data/hubData.json";
import { HubData } from "@/types/hub";
import { AdminShell } from "@/components/admin/AdminShell";
import { AppWorkspace } from "@/components/admin/AppWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";

export default function AdminAppPage() {
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
      if (!res.ok) throw new Error("Sync failed");
      setSaveStatus(`✔ ĐÃ ĐỒNG BỘ APP LAB [200 OK] — ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setSaveStatus(null), 3500);
    } catch {
      setSaveStatus("✖ LỖI ĐỒNG BỘ APP LAB");
    } finally {
      setIsSaving(false);
    }
  };

  const appStatus = (hubData.subdomains.find((s) => s.id === "app")?.status || "STANDBY") as
    | "ONLINE"
    | "STANDBY"
    | "MAINTENANCE";

  const handleToggleStatus = () => {
    setHubData((prev) => {
      const updated = prev.subdomains.map((s) => {
        if (s.id === "app") {
          const newStatus = s.status === "ONLINE" ? "STANDBY" : "ONLINE";
          return { ...s, status: newStatus as "ONLINE" | "STANDBY" };
        }
        return s;
      });
      return { ...prev, subdomains: updated };
    });
  };

  return (
    <AdminShell
      activeRoute="app"
      title="NODE 03 // APP LAB (APP.JEVKAYDEN.TECH)"
      onSave={handleSave}
      isSaving={isSaving}
      saveStatus={saveStatus}
      previewHref="/"
      previewLabel="XEM APP ↗"
    >
      <AppWorkspace appStatus={appStatus} onToggleStatus={handleToggleStatus} />
    </AdminShell>
  );
}

