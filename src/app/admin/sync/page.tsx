"use client";

import React, { useState, useEffect } from "react";
import initialCvData from "@/data/cvData.json";
import initialHubData from "@/data/hubData.json";
import initialBlogData from "@/data/blogData.json";
import { CvData } from "@/types/cv";
import { HubData } from "@/types/hub";
import { BlogData } from "@/types/blog";
import { AdminShell } from "@/components/admin/AdminShell";
import { SyncWorkspace } from "@/components/admin/SyncWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";

export default function AdminSyncPage() {
  const [cvData, setCvData] = useState<CvData>(initialCvData as CvData);
  const [hubData, setHubData] = useState<HubData>(initialHubData as HubData);
  const [blogData, setBlogData] = useState<BlogData>(initialBlogData as BlogData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cv", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CvData | null) => {
        if (data && data.personalInfo) setCvData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/cv:", err));

    fetch("/api/hub", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HubData | null) => {
        if (data && data.hero) setHubData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/hub:", err));

    fetch("/api/blog", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BlogData | null) => {
        if (data && Array.isArray(data.posts)) setBlogData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/blog:", err));
  }, []);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const authCode = getAdminPasscode();
      const headers = {
        "Content-Type": "application/json",
        "x-admin-passcode": authCode,
      };
      await Promise.all([
        fetch("/api/cv", {
          method: "POST",
          headers,
          body: JSON.stringify({ passcode: authCode, data: cvData }),
        }),
        fetch("/api/hub", {
          method: "POST",
          headers,
          body: JSON.stringify({ passcode: authCode, data: hubData }),
        }),
        fetch("/api/blog", {
          method: "POST",
          headers,
          body: JSON.stringify({ passcode: authCode, data: blogData }),
        }),
      ]);
      setSaveStatus(`✔ ĐÃ ĐỒNG BỘ TOÀN BỘ 3 PHÂN HỆ — ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setSaveStatus(null), 3500);
    } catch {
      setSaveStatus("✖ LỖI KHI ĐỒNG BỘ TOÀN CỤC");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetFactory = () => {
    setCvData(initialCvData as CvData);
    setHubData(initialHubData as HubData);
    setBlogData(initialBlogData as BlogData);
    setSaveStatus("✔ ĐÃ KHÔI PHỤC DỮ LIỆU GỐC BAN ĐẦU");
    setTimeout(() => setSaveStatus(null), 3500);
  };

  return (
    <AdminShell
      activeRoute="sync"
      title="SYS // MULTI-SYNC CLOUD HUB"
      onSave={handleSaveAll}
      isSaving={isSaving}
      saveStatus={saveStatus}
      previewHref="/"
      previewLabel="XEM HUB ↗"
    >
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#ece7df]">
        <SyncWorkspace
          cvData={cvData}
          hubData={hubData}
          blogData={blogData}
          setCvData={setCvData}
          setHubData={setHubData}
          setBlogData={setBlogData}
          onSaveAll={handleSaveAll}
          onResetFactory={handleResetFactory}
        />
      </div>
    </AdminShell>
  );
}

