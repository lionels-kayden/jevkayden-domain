"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import initialCvData from "@/data/cvData.json";
import initialHubData from "@/data/hubData.json";
import initialBlogData from "@/data/blogData.json";
import { CvData } from "@/types/cv";
import { HubData } from "@/types/hub";
import { BlogData, CategoryTreeNode } from "@/types/blog";
import { AdminShell } from "@/components/admin/AdminShell";
import { LaunchpadView, AdminTenant } from "@/components/admin/LaunchpadView";
import { getAdminPasscode } from "@/lib/adminAuth";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metrics and Subdomain statuses
  const [cvUpdated, setCvUpdated] = useState<string>(initialCvData.lastUpdated);
  const [cvProjectsCount, setCvProjectsCount] = useState<number>(
    initialCvData.projects?.length || 4
  );
  const [blogCount, setBlogCount] = useState<number>(initialBlogData.posts.length);
  const [categoryCount, setCategoryCount] = useState<number>(
    (initialBlogData.categoryTree as unknown as CategoryTreeNode[]).length
  );
  const [subCategoryCount, setSubCategoryCount] = useState<number>(
    (initialBlogData.categoryTree as unknown as CategoryTreeNode[]).reduce(
      (acc: number, cat: CategoryTreeNode) => acc + (cat.subCategories?.length || 0),
      0
    )
  );

  const [siteStatus, setSiteStatus] = useState<string>(
    initialHubData.hero?.status?.vi || "SẴN SÀNG HỢP TÁC R&D"
  );
  const [marqueeCount, setMarqueeCount] = useState<number>(
    initialHubData.techMarquee?.length || 8
  );
  const [pagerChannel, setPagerChannel] = useState<string>(
    initialHubData.pagerContact?.channel || "CH-04"
  );

  const [subdomainStatuses, setSubdomainStatuses] = useState<{
    blog: "ONLINE" | "STANDBY" | "MAINTENANCE";
    cv: "ONLINE" | "STANDBY" | "MAINTENANCE";
    app: "ONLINE" | "STANDBY" | "MAINTENANCE";
  }>({
    blog: (initialHubData.subdomains.find((s) => s.id === "blog")?.status || "ONLINE") as
      | "ONLINE"
      | "STANDBY"
      | "MAINTENANCE",
    cv: (initialHubData.subdomains.find((s) => s.id === "cv")?.status || "ONLINE") as
      | "ONLINE"
      | "STANDBY"
      | "MAINTENANCE",
    app: (initialHubData.subdomains.find((s) => s.id === "app")?.status || "STANDBY") as
      | "ONLINE"
      | "STANDBY"
      | "MAINTENANCE",
  });

  // Backup & Restore states
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [backupMessage, setBackupMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Vercel / Git Publish state
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishStatus, setPublishStatus] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Support legacy query param redirects (e.g. /admin?node=blog -> /admin/blog)
  useEffect(() => {
    const node = searchParams.get("node");
    if (node === "hub") router.replace("/admin/hub");
    else if (node === "cv") router.replace("/admin/cv");
    else if (node === "blog") router.replace("/admin/blog");
    else if (node === "app") router.replace("/admin/app");
    else if (node === "sync") router.replace("/admin/sync");
  }, [searchParams, router]);

  // Fetch live metrics from /api/site, /api/cv, and /api/blog
  const fetchAllMetrics = () => {
    // 1. Fetch CV metrics
    fetch("/api/cv", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CvData | null) => {
        if (data) {
          if (data.lastUpdated) setCvUpdated(data.lastUpdated);
          if (Array.isArray(data.projects)) {
            setCvProjectsCount(data.projects.length);
          }
        }
      })
      .catch((e) => console.warn("Fetch /api/cv metrics error:", e));

    // 2. Fetch Site/Hub metrics
    fetch("/api/site", { cache: "no-store" })
      .catch(() => fetch("/api/hub", { cache: "no-store" }))
      .then((res) => (res && res.ok ? res.json() : null))
      .then((data: HubData | null) => {
        if (data) {
          if (data.hero?.status?.vi) setSiteStatus(data.hero.status.vi);
          if (Array.isArray(data.techMarquee)) setMarqueeCount(data.techMarquee.length);
          if (data.pagerContact?.channel) setPagerChannel(data.pagerContact.channel);
          if (data.subdomains) {
            setSubdomainStatuses({
              blog: (data.subdomains.find((s) => s.id === "blog")?.status || "ONLINE") as
                | "ONLINE"
                | "STANDBY"
                | "MAINTENANCE",
              cv: (data.subdomains.find((s) => s.id === "cv")?.status || "ONLINE") as
                | "ONLINE"
                | "STANDBY"
                | "MAINTENANCE",
              app: (data.subdomains.find((s) => s.id === "app")?.status || "STANDBY") as
                | "ONLINE"
                | "STANDBY"
                | "MAINTENANCE",
            });
          }
        }
      })
      .catch((e) => console.warn("Fetch /api/site metrics error:", e));

    // 3. Fetch Blog metrics
    fetch("/api/blog", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BlogData | null) => {
        if (data) {
          if (Array.isArray(data.posts)) setBlogCount(data.posts.length);
          if (Array.isArray(data.categoryTree)) {
            setCategoryCount(data.categoryTree.length);
            const subCount = data.categoryTree.reduce(
              (acc: number, cat: CategoryTreeNode) => acc + (cat.subCategories?.length || 0),
              0
            );
            setSubCategoryCount(subCount);
          }
        }
      })
      .catch((e) => console.warn("Fetch /api/blog metrics error:", e));
  };

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  // Navigate to dedicated route on card click
  const handleSelectTenant = (tenant: AdminTenant) => {
    if (tenant === "hub") router.push("/admin/hub");
    else if (tenant === "cv") router.push("/admin/cv");
    else if (tenant === "blog") router.push("/admin/blog");
    else if (tenant === "app") router.push("/admin/app");
    else if (tenant === "sync") router.push("/admin/sync");
  };

  // 1-Click System Backup Export
  const handleExportBackup = async () => {
    setIsBackingUp(true);
    setBackupMessage({
      type: "info",
      text: "Đang truy xuất dữ liệu từ /api/site, /api/cv, /api/blog...",
    });

    try {
      const [siteRes, cvRes, blogRes] = await Promise.all([
        fetch("/api/site", { cache: "no-store" }).catch(() =>
          fetch("/api/hub", { cache: "no-store" })
        ),
        fetch("/api/cv", { cache: "no-store" }),
        fetch("/api/blog", { cache: "no-store" }),
      ]);

      const siteData = siteRes && siteRes.ok ? await siteRes.json() : null;
      const cvData = cvRes && cvRes.ok ? await cvRes.json() : null;
      const blogData = blogRes && blogRes.ok ? await blogRes.json() : null;

      if (!siteData && !cvData && !blogData) {
        throw new Error("Không thể kết nối đến máy chủ dữ liệu để tạo bản sao lưu.");
      }

      const backupPayload = {
        version: "1.0",
        system: "jevkayden.tech",
        exportedAt: new Date().toISOString(),
        siteData,
        cvData,
        blogData,
      };

      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `jevkayden-backup-${dateStr}.json`;
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupMessage({
        type: "success",
        text: `✓ Đã xuất thành công gói sao lưu toàn hệ thống: [${filename}] (${(
          blob.size / 1024
        ).toFixed(1)} KB)!`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi không xác định";
      setBackupMessage({
        type: "error",
        text: `Lỗi xuất sao lưu: ${message}`,
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Trigger file input dialog
  const handleRestoreBackupClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 1-Click System Backup Restore
  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input value so user can re-select the same file if needed
    e.target.value = "";

    const userConfirmed = window.confirm(
      `CẢNH BÁO KHÔI PHỤC TOÀN HỆ THỐNG:\n\nBạn có chắc chắn muốn khôi phục từ tệp "${file.name}"?\nToàn bộ dữ liệu hiện tại (Site Hub, CV Dossier, Blog Garden) sẽ được ghi đè bằng nội dung từ tệp sao lưu này.`
    );
    if (!userConfirmed) return;

    setIsRestoring(true);
    setBackupMessage({
      type: "info",
      text: "Đang đọc và phân tích cấu trúc tệp sao lưu JSON...",
    });

    try {
      const fileText = await file.text();
      const backup = JSON.parse(fileText);

      const siteData = backup.siteData || backup.hubData;
      const cvData = backup.cvData;
      const blogData = backup.blogData;

      if (!siteData && !cvData && !blogData) {
        throw new Error(
          "Tệp không hợp lệ: Không tìm thấy trường siteData (hoặc hubData), cvData, hoặc blogData trong tệp JSON."
        );
      }

      const passcode = getAdminPasscode();

      const restoredModules: string[] = [];

      // 1. Restore Site / Hub Data
      if (siteData) {
        setBackupMessage({
          type: "info",
          text: "Đang khôi phục dữ liệu Cổng Chính (/api/site)...",
        });
        const res = await fetch("/api/site", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": passcode,
          },
          body: JSON.stringify({ passcode, data: siteData }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            `Khôi phục Cổng Chính (/api/site) thất bại: ${
              errData.error || res.statusText
            }`
          );
        }
        restoredModules.push("Site Hub");
      }

      // 2. Restore CV Dossier Data
      if (cvData) {
        setBackupMessage({
          type: "info",
          text: "Đang khôi phục dữ liệu Hồ sơ Kỹ sư (/api/cv)...",
        });
        const res = await fetch("/api/cv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": passcode,
          },
          body: JSON.stringify({ passcode, data: cvData }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            `Khôi phục Hồ sơ Kỹ sư (/api/cv) thất bại: ${
              errData.error || res.statusText
            }`
          );
        }
        restoredModules.push("CV Dossier");
      }

      // 3. Restore Blog Garden Data
      if (blogData) {
        setBackupMessage({
          type: "info",
          text: "Đang khôi phục dữ liệu Vườn Tri Thức (/api/blog)...",
        });
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": passcode,
          },
          body: JSON.stringify({ passcode, data: blogData }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            `Khôi phục Vườn Tri Thức (/api/blog) thất bại: ${
              errData.error || res.statusText
            }`
          );
        }
        restoredModules.push("Blog Garden");
      }

      // Re-fetch all metrics so dashboard cards update instantly
      fetchAllMetrics();

      setBackupMessage({
        type: "success",
        text: `✓ Khôi phục thành công ${restoredModules.length} phân hệ (${restoredModules.join(
          ", "
        )}) từ tệp "${file.name}"!`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi không xác định";
      setBackupMessage({
        type: "error",
        text: `Lỗi khôi phục hệ thống: ${message}`,
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // 1-Click Git Commit & Push to Vercel
  const handleGitPublish = async () => {
    const passcode = getAdminPasscode();

    setIsPublishing(true);
    setPublishStatus({
      type: "info",
      text: "Đang chuẩn bị dữ liệu và đẩy commit lên GitHub (Vercel Auto-deploy)...",
    });

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || res.statusText || "Lỗi đồng bộ");
      }
      setPublishStatus({
        type: "success",
        text: data.message || "✓ Đã đồng bộ & đẩy lên GitHub thành công!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setPublishStatus({
        type: "error",
        text: `Lỗi đồng bộ Vercel: ${msg}`,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AdminShell
      activeRoute="launchpad"
      title="STAGE 1 // MULTI-SITE LAUNCHPAD"
      previewHref="/"
      previewLabel="XEM HUB ↗"
    >
      {/* Hidden File Input for 1-Click Restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleRestoreFile}
      />

      <div className="flex-1 overflow-y-auto bg-[#ece7df]">
        <LaunchpadView
          onSelectTenant={handleSelectTenant}
          cvUpdated={cvUpdated}
          cvProjectsCount={cvProjectsCount}
          blogCount={blogCount}
          categoryCount={categoryCount}
          subCategoryCount={subCategoryCount}
          siteStatus={siteStatus}
          marqueeCount={marqueeCount}
          pagerChannel={pagerChannel}
          subdomainStatuses={subdomainStatuses}
          onExportBackup={handleExportBackup}
          onRestoreBackupClick={handleRestoreBackupClick}
          isBackingUp={isBackingUp}
          isRestoring={isRestoring}
          backupMessage={backupMessage}
          onGitPublish={handleGitPublish}
          isPublishing={isPublishing}
          publishStatus={publishStatus}
        />
      </div>
    </AdminShell>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#ece7df] text-black flex items-center justify-center font-mono">
          <div className="p-4 bg-white border-2 border-black font-bold text-xs uppercase shadow-[4px_4px_0px_0px_#000]">
            ĐANG TẢI SẢNH CHÍNH ADMIN...
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
