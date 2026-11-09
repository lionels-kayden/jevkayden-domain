"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import initialBlogData from "@/data/blogData.json";
import { BlogData, BlogPost, BlogLanguage } from "@/types/blog";
import { MarkdownRenderer, formatIeeeSection, slugifyHeading } from "@/components/blog/MarkdownRenderer";
import {
  readLiveClientCache,
  fetchFreshestData,
  subscribeToLiveSync,
} from "@/lib/liveClientSync";
import {
  ArrowLeft,
  Printer,
  Download,
  BookOpen,
  Share2,
  Check,
  Copy,
  Layers,
  ListCollapse,
  FileText,
} from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleReaderClientProps {
  slug: string;
  initialData?: BlogData;
}

const formatPublishDate = (dateStr: string, currentLang: BlogLanguage) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return currentLang === "vi" ? `${day}/${month}/${year}` : `${year}-${month}-${day}`;
};

export const ArticleReaderClient: React.FC<ArticleReaderClientProps> = ({
  slug,
  initialData,
}) => {
  const [blogData, setBlogData] = useState<BlogData>(
    initialData || (initialBlogData as BlogData)
  );
  const [lang, setLang] = useState<BlogLanguage>("vi");
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Fetch latest dynamic blogData from localStorage + /api/blog on client mount
  useEffect(() => {
    const localSnapshot = readLiveClientCache<BlogData>(
      "jev_live_blog_data",
      initialData || (initialBlogData as BlogData)
    );
    if (localSnapshot?.data && Array.isArray(localSnapshot.data.posts)) {
      setBlogData(localSnapshot.data);
    }

    fetchFreshestData<BlogData>(
      "/api/blog",
      "jev_live_blog_data",
      initialData || (initialBlogData as BlogData)
    ).then((freshest) => {
      if (freshest && Array.isArray(freshest.posts)) {
        setBlogData(freshest);
      }
    });

    return subscribeToLiveSync<BlogData>(
      "jev_live_blog_data",
      "/api/blog",
      initialData || (initialBlogData as BlogData),
      (freshest) => {
        if (freshest && Array.isArray(freshest.posts)) {
          setBlogData(freshest);
        }
      }
    );
  }, [initialData]);

  // Auto trigger print if ?print=true is in URL (wait 500ms for KaTeX & Mermaid, then cleanup query param)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "true") {
      const printTimer = setTimeout(() => {
        window.print();
        try {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("print");
          window.history.replaceState({}, "", newUrl.toString());
        } catch {}
      }, 500);
      return () => clearTimeout(printTimer);
    }
  }, []);

  // Synchronize language state across pages via localStorage and URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = setTimeout(() => {
      const urlLang = new URLSearchParams(window.location.search).get("lang");
      if (urlLang === "vi" || urlLang === "en") {
        setLang(urlLang);
        try {
          localStorage.setItem("jevkayden_blog_lang", urlLang);
        } catch {}
      } else {
        try {
          const saved = localStorage.getItem("jevkayden_blog_lang");
          if (saved === "vi" || saved === "en") {
            setLang(saved);
          }
        } catch {}
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLangChange = (newLang: BlogLanguage) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("jevkayden_blog_lang", newLang);
        const url = new URL(window.location.href);
        url.searchParams.set("lang", newLang);
        window.history.replaceState({}, "", url.toString());
      } catch {}
    }
  };

  // Find post by slug
  const postIndex = useMemo(() => {
    return blogData.posts.findIndex((p) => p.slug === slug);
  }, [blogData.posts, slug]);

  const post: BlogPost | undefined = postIndex !== -1 ? blogData.posts[postIndex] : undefined;
  const prevPost = postIndex > 0 ? blogData.posts[postIndex - 1] : null;
  const nextPost = postIndex < blogData.posts.length - 1 ? blogData.posts[postIndex + 1] : null;

  // Find Category info
  const parentCategory = useMemo(() => {
    if (!post) return null;
    return blogData.categoryTree.find((c) => c.id === post.parentCategory);
  }, [blogData.categoryTree, post]);

  const subCategory = useMemo(() => {
    if (!parentCategory || !post) return null;
    return parentCategory.subCategories.find((s) => s.id === post.subCategory);
  }, [parentCategory, post]);

  // Related posts in same category
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogData.posts
      .filter((p) => p.id !== post.id && (p.subCategory === post.subCategory || p.parentCategory === post.parentCategory))
      .slice(0, 3);
  }, [blogData.posts, post]);

  // Extract Table of Contents with IEEE Roman Numeral Headings and deterministic IDs
  const toc: TocItem[] = useMemo(() => {
    if (!post) return [];
    const content = post.content[lang] || post.content.vi || "";
    const lines = content.split("\n");
    const items: TocItem[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h2Match) {
        const rawText = h2Match[1].trim();
        const formatted = formatIeeeSection(rawText);
        const id = slugifyHeading(rawText);
        items.push({ id, text: formatted, level: 2 });
      } else if (h3Match) {
        const rawText = h3Match[1].trim();
        const id = slugifyHeading(rawText);
        items.push({ id, text: rawText, level: 3 });
      }
    });

    return items;
  }, [post, lang]);

  // Smooth scroll handler for TOC click
  const handleScrollToHeading = (id: string, index: number) => {
    let targetEl = document.getElementById(id);
    if (!targetEl) {
      const allHeadings = document.querySelectorAll<HTMLElement>(
        ".ieee-article-body h2, .ieee-article-body h3"
      );
      targetEl = allHeadings[index] || null;
    }
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${id}`);
      }
    }
  };

  // Handle Export Obsidian Markdown with YAML frontmatter
  const handleExportObsidian = () => {
    if (!post) return;
    const yamlHeader = `---
title: "${(post.title[lang] || post.title.vi).replace(/"/g, '\\"')}"
paperId: "${post.paperId}"
slug: "${post.slug}"
parentCategory: "${post.parentCategory}"
subCategory: "${post.subCategory}"
status: "${post.status}"
publishedAt: "${post.publishedAt}"
readingTime: "${post.readingTime}"
tags:
${post.tags.map((t) => `  - ${t}`).join("\n")}
---

`;
    const fullMarkdown = yamlHeader + (post.content[lang] || post.content.vi);
    const blob = new Blob([fullMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Print A4 PDF
  const handlePrint = () => {
    window.print();
  };

  // Copy IEEE Citation (Clean URL, no duplicate /blog/blog/)
  const handleCopyCitation = () => {
    if (!post) return;
    const titleText = post.title[lang] || post.title.vi;
    const year = new Date(post.publishedAt).getFullYear();
    const citation = `N. Q. Thang, "${titleText}," VNU Journal of Science: Computer Science & Communication Engineering, Paper ID: ${post.paperId}, ${year}. [Online]. Available: https://blog.jevkayden.tech/${post.slug}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  // Copy share URL
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // 404 Fallback
  if (!post) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 p-8 max-w-lg shadow-sm rounded-sm">
          <span className="font-mono text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 uppercase rounded">
            404 // PAPER NOT FOUND
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-4 mb-2">
            Không tìm thấy ấn phẩm trong kho lưu trữ
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-600 mb-6">
            Mã định danh slug <code className="bg-slate-100 px-1.5 py-0.5 font-mono text-[#00629B] rounded">{slug}</code> không khớp với bất kỳ bài báo nào đã xuất bản.
          </p>
          <Link
            href={`/blog?lang=${lang}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00629B] hover:bg-[#004e7c] text-white font-sans text-xs font-semibold rounded shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "vi" ? "Quay lại danh sách bài viết" : "Back to archive"}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Active strings based on language selection
  const title = post.title[lang] || post.title.vi;
  const excerpt = post.excerpt[lang] || post.excerpt.vi;
  const content = post.content[lang] || post.content.vi;

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans text-slate-900 selection:bg-sky-200 selection:text-slate-900 print:bg-white print:text-black">
      {/* ========================================================= */}
      {/* TOP CONTROL DECK: 100% PURE IEEE XPLORE AESTHETIC (PRINT-HIDDEN) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 py-2.5 print:hidden shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              href={`/blog?lang=${lang}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00629B] hover:bg-[#004e7c] text-white font-sans text-xs font-semibold rounded-sm shadow-sm transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === "vi" ? "DANH SÁCH BÀI VIẾT" : "BACK TO ARCHIVE"}</span>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <BrandLogo variant="ieee" size={30} />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#00629B] hidden sm:inline">
                BLOG.JEVKAYDEN.TECH
              </span>
            </div>

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-xs font-medium rounded border border-slate-300 transition-colors shrink-0"
              title="Về Trang Chủ Cổng Thông Tin"
            >
              <span>{lang === "vi" ? "HUB CHÍNH" : "MAIN HUB"}</span>
            </Link>

            <Link
              href="/cv"
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-xs font-medium rounded border border-slate-300 transition-colors shrink-0"
            >
              <span>{lang === "vi" ? "HỒ SƠ /CV ↗" : "CV DOSSIER ↗"}</span>
            </Link>
          </div>

          {/* Paper ID & Repository Badge (Hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-2 text-xs shrink-0">
            <span className="px-2.5 py-0.5 bg-slate-100 text-[#00629B] font-mono font-bold uppercase tracking-wider border border-slate-200 rounded">
              {post.paperId}
            </span>
            <span className="text-slate-600 font-sans font-medium text-[11px]">
              VNU-UET TECHNICAL ARCHIVE
            </span>
          </div>

          {/* Right Action Group: Language Switcher, Print PDF, Download Markdown */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="inline-flex border border-slate-300 bg-white rounded overflow-hidden shadow-sm font-sans">
              <button
                type="button"
                onClick={() => handleLangChange("vi")}
                className={`px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                  lang === "vi"
                    ? "bg-[#00629B] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                VI_VN
              </button>
              <button
                type="button"
                onClick={() => handleLangChange("en")}
                className={`px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                  lang === "en"
                    ? "bg-[#00629B] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                EN_US
              </button>
            </div>

            {/* Print IEEE A4 PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00629B] hover:bg-[#004e7c] text-white font-sans text-xs font-medium rounded-sm shadow-sm cursor-pointer transition-colors"
              title="Xuất định dạng bài báo IEEE A4 tiêu chuẩn (In hoặc Lưu PDF)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>
                {lang === "vi" ? "XUẤT PDF" : "EXPORT PDF"}
              </span>
            </button>

            {/* Download Obsidian .MD Button */}
            <button
              type="button"
              onClick={handleExportObsidian}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-sans text-xs font-medium rounded-sm shadow-sm cursor-pointer transition-colors"
              title="Tải tệp Markdown có cấu trúc YAML Frontmatter cho Obsidian Vault"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">.MD</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN ACADEMIC PAPER CONTENT LAYOUT */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 print:p-0 print:m-0 print:max-w-none print:w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block print:w-full">
          {/* ========================================================= */}
          {/* LEFT / CENTER: MAIN ARTICLE MANUSCRIPT */}
          {/* ========================================================= */}
          <article className="lg:col-span-8 bg-white border border-slate-200 shadow-sm p-8 sm:p-12 lg:p-14 rounded-sm print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none">
            {/* IEEE / PREPRINT WATERMARK BANNER */}
            <div className="pb-3 mb-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              <span className="font-semibold text-[#00629B]">
                IEEE / VNU-UET RESEARCH REPOSITORY // PREPRINT
              </span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 border border-slate-200 rounded">
                PAPER ID: {post.paperId}
              </span>
            </div>

            {/* FORMAL ACADEMIC TITLE (SERIF) */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-5 font-serif text-center tracking-tight">
              {title}
            </h1>

            {/* AUTHOR AFFILIATION BLOCK (IEEE STANDARD WITH REAL EMAIL) */}
            <div className="my-6 text-center border-t border-b border-slate-200 py-4 font-serif">
              <div className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                Nguyễn Quang Thắng
              </div>
              <div className="text-xs sm:text-sm text-slate-600 italic mt-1 leading-relaxed">
                {lang === "vi"
                  ? "Khoa Điện tử Viễn thông (FET) — Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội (VNU-UET)"
                  : "Faculty of Electronics & Telecommunications (FET) — VNU University of Engineering and Technology (VNU-UET)"}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                nguyenquangthang8827@gmail.com • github.com/jevkayden • Digital Garden Repository
              </div>
            </div>

            {/* CLASSIC IEEE DOUBLE RULE TOP */}
            <div className="space-y-0.5 my-6">
              <div className="h-[1.5px] bg-slate-900"></div>
              <div className="h-[0.5px] bg-slate-900"></div>
            </div>

            {/* ABSTRACT & INDEX TERMS (AUTHENTIC UNBOXED IEEE FORMAT) */}
            <div className="my-6 space-y-3 font-serif text-xs sm:text-sm leading-relaxed text-slate-800">
              <p className="text-justify">
                <span className="font-bold italic mr-1.5">
                  {lang === "vi" ? "Tóm tắt—" : "Abstract—"}
                </span>
                <span>{excerpt}</span>
              </p>

              <p className="text-justify">
                <span className="font-bold italic mr-1.5">
                  {lang === "vi" ? "Từ khóa—" : "Index Terms—"}
                </span>
                <span className="font-serif italic text-slate-700">
                  {post.tags.map((t) => t.replace(/^#+/, "")).join("; ")}.
                </span>
              </p>
            </div>

            {/* CLASSIC IEEE DOUBLE RULE BOTTOM */}
            <div className="space-y-0.5 my-6">
              <div className="h-[0.5px] bg-slate-900"></div>
              <div className="h-[1.5px] bg-slate-900"></div>
            </div>

            {/* ========================================================= */}
            {/* MARKDOWN RENDERER BODY (IEEE ROMAN NUMERAL HEADINGS) */}
            {/* ========================================================= */}
            <div className="mt-8 text-justify font-sans text-sm sm:text-base leading-relaxed">
              <MarkdownRenderer content={content} />
            </div>

            {/* ========================================================= */}
            {/* IEEE CITATION DOSSIER AT FOOTER (CLEAN URL & WORD-BREAK) */}
            {/* ========================================================= */}
            <div className="mt-12 pt-8 border-t border-slate-200 space-y-3 print:mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#00629B]" />
                  <span>
                    {lang === "vi" ? "TRÍCH DẪN TÀI LIỆU (CHUẨN IEEE)" : "IEEE CITATION FORMAT"}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-sans font-medium border border-slate-300 rounded cursor-pointer transition-colors"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>COPY IEEE</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono text-xs leading-relaxed text-slate-800 break-words select-all">
                N. Q. Thang, &quot;{title},&quot;{" "}
                <em>VNU Journal of Science: Comp. Sci. &amp; Comm. Eng.</em>, Paper ID: {post.paperId},{" "}
                {new Date(post.publishedAt).getFullYear()}. [Online]. Available: https://blog.jevkayden.tech/{post.slug}
              </div>
            </div>

            {/* PREV / NEXT NAVIGATION */}
            <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}?lang=${lang}`}
                  className="p-4 border border-slate-200 rounded hover:border-[#00629B] bg-slate-50/50 hover:bg-sky-50/50 text-left transition-colors group block"
                >
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase mb-1">
                    ← {lang === "vi" ? "BÀI VIẾT TRƯỚC" : "PREVIOUS ARTICLE"}
                  </span>
                  <span className="font-serif text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#00629B]">
                    {prevPost.title[lang] || prevPost.title.vi}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block"></div>
              )}

              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}?lang=${lang}`}
                  className="p-4 border border-slate-200 rounded hover:border-[#00629B] bg-slate-50/50 hover:bg-sky-50/50 text-right transition-colors group block"
                >
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase mb-1">
                    {lang === "vi" ? "BÀI VIẾT TIẾP THEO" : "NEXT ARTICLE"} →
                  </span>
                  <span className="font-serif text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#00629B]">
                    {nextPost.title[lang] || nextPost.title.vi}
                  </span>
                </Link>
              )}
            </div>
          </article>

          {/* ========================================================= */}
          {/* RIGHT SIDEBAR: TOC & ACADEMIC DOSSIER (STICKY) */}
          {/* ========================================================= */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 print:hidden">
            {/* Table of Contents Card (Roman Numerals) */}
            {toc.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border border-slate-200 shadow-sm rounded-sm">
                <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-200 font-sans text-xs font-bold uppercase text-slate-900">
                  <ListCollapse className="w-4 h-4 text-[#00629B]" />
                  <span>{lang === "vi" ? "MỤC LỤC BÀI VIẾT" : "TABLE OF CONTENTS"}</span>
                </div>
                <nav className="space-y-1.5 font-sans text-xs max-h-[360px] overflow-y-auto pr-1">
                  {toc.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleScrollToHeading(item.id, idx)}
                      className={`block text-left w-full hover:text-[#00629B] hover:translate-x-0.5 transition-all cursor-pointer ${
                        item.level === 3 ? "pl-4 text-[11px] text-slate-500 font-normal" : "font-semibold text-slate-700"
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Academic Dossier Details */}
            <div className="p-4 sm:p-5 bg-white border border-slate-200 shadow-sm rounded-sm">
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-200 font-sans text-xs font-bold uppercase text-slate-900">
                <BookOpen className="w-4 h-4 text-[#00629B]" />
                <span>{lang === "vi" ? "THÔNG TIN TÀI LIỆU" : "DOCUMENT INFO"}</span>
              </div>

              <div className="space-y-3 text-xs font-sans">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    {lang === "vi" ? "MÃ TÀI LIỆU:" : "DOCUMENT ID:"}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{post.paperId}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    {lang === "vi" ? "CHUYÊN MỤC:" : "CATEGORY:"}
                  </span>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    {parentCategory?.name[lang] || post.parentCategory}
                  </div>
                  {subCategory && (
                    <div className="text-[11px] text-slate-600 pl-2 border-l-2 border-[#00629B] mt-1 font-medium">
                      {subCategory.name[lang] || subCategory.name.vi}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 font-mono">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    {lang === "vi" ? "NGÀY ĐĂNG:" : "DATE POSTED:"}
                  </span>
                  <span className="text-slate-800 font-medium">
                    {formatPublishDate(post.publishedAt, lang)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1.5">
                    {lang === "vi" ? "TỪ KHÓA CHUYÊN ĐỀ:" : "INDEX TERMS:"}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((t, i) => (
                      <Link
                        key={i}
                        href={`/blog?tag=${encodeURIComponent(t)}&lang=${lang}`}
                        className="px-2.5 py-0.5 bg-slate-100 hover:bg-sky-50 hover:text-[#00629B] text-slate-700 font-sans text-[11px] font-medium rounded-sm border border-slate-200 transition-colors"
                      >
                        {t.replace(/^#+/, "")}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-sans text-xs font-medium border border-slate-300 rounded cursor-pointer transition-colors"
                  >
                    {copiedShare ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">LINK COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>SHARE URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Related Papers in same category */}
            {relatedPosts.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border border-slate-200 shadow-sm rounded-sm">
                <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-200 font-sans text-xs font-bold uppercase text-slate-900">
                  <Layers className="w-4 h-4 text-[#00629B]" />
                  <span>{lang === "vi" ? "CÙNG CHUYÊN MỤC" : "RELATED PAPERS"}</span>
                </div>
                <div className="space-y-2.5">
                  {relatedPosts.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}?lang=${lang}`}
                      className="block p-2.5 bg-slate-50 hover:bg-sky-50/60 rounded border border-slate-200 transition-colors group"
                    >
                      <span className="font-mono text-[9px] font-bold text-[#00629B] block uppercase">
                        {rel.paperId}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 group-hover:text-[#00629B]">
                        {rel.title[lang] || rel.title.vi}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};
