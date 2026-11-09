"use client";

import React, { useState, useEffect } from "react";
import initialBlogData from "@/data/blogData.json";
import { BlogData } from "@/types/blog";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogWorkspace } from "@/components/admin/BlogWorkspace";
import { getAdminPasscode } from "@/lib/adminAuth";

export default function AdminBlogPage() {
  const [blogData, setBlogData] = useState<BlogData>(initialBlogData as BlogData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BlogData | null) => {
        if (data && Array.isArray(data.posts)) setBlogData(data);
      })
      .catch((err) => console.warn("Could not fetch /api/blog:", err));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const authCode = getAdminPasscode();
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({ passcode: authCode, data: blogData }),
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
        setSaveStatus(`✔ ĐÃ LƯU CỤC BỘ (src/data/blogData.json) — ${timeStr}`);
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
