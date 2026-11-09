"use client";

import React, { useState, useEffect } from "react";
import initialBlogData from "@/data/blogData.json";
import { BlogData } from "@/types/blog";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogWorkspace } from "@/components/admin/BlogWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";
import {
  readLiveClientCache,
  fetchFreshestData,
  saveLiveClientCache,
} from "@/lib/liveClientSync";

export default function AdminBlogPage() {
  const [blogData, setBlogData] = useState<BlogData>(initialBlogData as BlogData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const localSnapshot = readLiveClientCache<BlogData>(
      "jev_live_blog_data",
      initialBlogData as BlogData
    );
    if (localSnapshot?.data && Array.isArray(localSnapshot.data.posts)) {
      setBlogData(localSnapshot.data);
    }

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

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      // 1. Immediately persist to localStorage + BroadcastChannel (0ms sync)
      const stampedBlog = saveLiveClientCache<BlogData>(
        "jev_live_blog_data",
        blogData
      );
      setBlogData(stampedBlog);

      // 2. Persist to server (/tmp + GitHub Cloud API)
      const authCode = getAdminPasscode();
      const res = await fetch(`/api/blog?t=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({ passcode: authCode, data: stampedBlog }),
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
      activeRoute="blog"
      title="NODE 02 // BLOG & DIGITAL GARDEN (BLOG.JEVKAYDEN.TECH)"
      onSave={handleSave}
      isSaving={isSaving}
      saveStatus={saveStatus}
      previewHref="/blog"
      previewLabel="XEM /BLOG ↗"
    >
      <BlogWorkspace
        blogData={blogData}
        setBlogData={setBlogData}
        passcode={getAdminPasscode()}
      />
    </AdminShell>
  );
}
