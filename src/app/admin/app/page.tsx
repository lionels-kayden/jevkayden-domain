"use client";

import React, { useState, useEffect } from "react";
import initialHubData from "@/data/hubData.json";
import initialAppsData from "@/data/apps.json";
import { HubData } from "@/types/hub";
import { AppsData } from "@/types/apps";
import { AdminShell } from "@/components/admin/AdminShell";
import { AppWorkspace } from "@/components/admin/AppWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";
import {
  readLiveClientCache,
  saveLiveClientCache,
  fetchFreshestData,
} from "@/lib/liveClientSync";

export default function AdminAppPage() {
  const [hubData, setHubData] = useState<HubData>(initialHubData as HubData);
  const [appsData, setAppsData] = useState<AppsData>(
    initialAppsData as unknown as AppsData
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const cachedApps = readLiveClientCache<AppsData>(
      "jev_live_apps_data",
      initialAppsData as unknown as AppsData
    );
    if (cachedApps?.data?.apps) {
      setAppsData(cachedApps.data);
    }

    fetchFreshestData<AppsData>(
      "/api/apps",
      "jev_live_apps_data",
      initialAppsData as unknown as AppsData
    ).then((freshest) => {
      if (freshest && Array.isArray(freshest.apps)) {
        setAppsData(freshest);
      }
    });

    fetchFreshestData<HubData>(
      "/api/site",
      "jev_live_hub_data",
      initialHubData as HubData
    ).then((freshestHub) => {
      if (freshestHub && freshestHub.hero) {
        setHubData(freshestHub);
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const authCode = getAdminPasscode();

      // 1. Save immediately to client live cache & broadcast to open /app tabs
      const stampedApps = saveLiveClientCache<AppsData>(
        "jev_live_apps_data",
        appsData
      );
      const stampedHub = saveLiveClientCache<HubData>(
        "jev_live_hub_data",
        hubData
      );

      // 2. Persist to /api/apps and /api/site on server + GitHub Cloud
      const [appsRes, hubRes] = await Promise.all([
        fetch(`/api/apps?t=${Date.now()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": authCode,
          },
          body: JSON.stringify({ passcode: authCode, data: stampedApps }),
        }),
        fetch(`/api/site?t=${Date.now()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": authCode,
          },
          body: JSON.stringify({ passcode: authCode, data: stampedHub }),
        }),
      ]);

      if (!appsRes.ok || !hubRes.ok) {
        throw new Error("Sync failed");
      }

      const resJson = await appsRes.json().catch(() => ({}));
      const timeStr = new Date().toLocaleTimeString("vi-VN");
      if (resJson.githubCommitted) {
        setSaveStatus(`✓ ĐÃ LƯU & ĐỒNG BỘ APP BLADES LÊN GITHUB — ${timeStr}`);
      } else {
        setSaveStatus(`✓ ĐÃ LƯU APP BLADES [200 OK] — ${timeStr}`);
      }
      setTimeout(() => setSaveStatus(null), 4000);
    } catch {
      setSaveStatus("✖ LỖI ĐỒNG BỘ APP LAB");
    } finally {
      setIsSaving(false);
    }
  };

  const appStatus = (hubData.subdomains.find((s) => s.id === "app")?.status ||
    "ONLINE") as "ONLINE" | "STANDBY" | "MAINTENANCE";

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
      title="NODE 03 // L3 APP BLADES (APP.JEVKAYDEN.TECH)"
      onSave={handleSave}
      isSaving={isSaving}
      saveStatus={saveStatus}
      previewHref="/app"
      previewLabel="XEM /APP ↗"
    >
      <AppWorkspace
        appsData={appsData}
        onChangeAppsData={setAppsData}
        appNodeStatus={appStatus}
        onToggleHubNodeStatus={handleToggleStatus}
      />
    </AdminShell>
  );
}
