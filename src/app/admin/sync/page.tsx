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
import {
  fetchFreshestData,
  saveLiveClientCache,
} from "@/lib/liveClientSync";

export default function AdminSyncPage() {
  const [cvData, setCvData] = useState<CvData>(initialCvData as CvData);
  const [hubData, setHubData] = useState<HubData>(initialHubData as HubData);
  const [blogData, setBlogData] = useState<BlogData>(initialBlogData as BlogData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchFreshestData<CvData>(
      "/api/cv",
      "jev_live_cv_data",
      initialCvData as CvData
    )
      .then((data) => {
        if (data && data.personalInfo) setCvData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/cv:", err));

    fetchFreshestData<HubData>(
      "/api/site",
      "jev_live_hub_data",
      initialHubData as HubData
    )
      .then((data) => {
        if (data && data.hero) setHubData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/site:", err));

    fetchFreshestData<BlogData>(
      "/api/blog",
      "jev_live_blog_data",
      initialBlogData as BlogData
    )
      .then((data) => {
        if (data && Array.isArray(data.posts)) setBlogData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/blog:", err));
  }, []);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const stampedCv = saveLiveClientCache<CvData>("jev_live_cv_data", cvData);
      const stampedHub = saveLiveClientCache<HubData>(
        "jev_live_hub_data",
        hubData
      );
      const stampedBlog = saveLiveClientCache<BlogData>(
        "jev_live_blog_data",
        blogData
      );
      setCvData(stampedCv);
      setHubData(stampedHub);
      setBlogData(stampedBlog);

      const authCode = getAdminPasscode();
      const headers = {
        "Content-Type": "application/json",
        "x-admin-passcode": authCode,
      };
      const [cvRes, hubRes, blogRes] = await Promise.all([
        fetch(`/api/cv?t=${Date.now()}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ passcode: authCode, data: stampedCv }),
        }).then((r) => r.json().catch(() => ({}))),
        fetch(`/api/site?t=${Date.now()}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ passcode: authCode, data: stampedHub }),
        }).then((r) => r.json().catch(() => ({}))),
        fetch(`/api/blog?t=${Date.now()}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ passcode: authCode, data: stampedBlog }),
        }).then((r) => r.json().catch(() => ({}))),
      ]);

      const timeStr = new Date().toLocaleTimeString();
      if (cvRes.githubCommitted && hubRes.githubCommitted && blogRes.githubCommitted) {
        setSaveStatus(`✔ ĐÃ ĐỒNG BỘ & COMMIT 3 PHÂN HỆ LÊN GITHUB CLOUD — ${timeStr}`);
      } else if (cvRes.mode === "VERCEL_INSTANT_CACHE") {
        setSaveStatus(
          "ĐÃ LƯU TRÊN TRÌNH DUYỆT & BỘ ĐỆM! (Thêm GITHUB_TOKEN trên Vercel để commit vĩnh viễn lên GitHub)"
        );
      } else {
        setSaveStatus(`✔ ĐÃ ĐỒNG BỘ TOÀN BỘ 3 PHÂN HỆ — ${timeStr}`);
      }
      setTimeout(() => setSaveStatus(null), 7000);
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
