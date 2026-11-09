"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import initialBlogData from "@/data/blogData.json";
import { BlogData, BlogPost, BlogLanguage } from "@/types/blog";
import {
  readLiveClientCache,
  fetchFreshestData,
  subscribeToLiveSync,
} from "@/lib/liveClientSync";
import {
  ArrowLeft,
  Search,
  Tag,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  BookOpen,
  Quote,
  Check,
} from "lucide-react";

const formatPublishDate = (dateStr: string, currentLang: BlogLanguage) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return currentLang === "vi" ? `${day}/${month}/${year}` : `${year}-${month}-${day}`;
};

export default function BlogHomePage() {
  const [blogData, setBlogData] = useState<BlogData>(initialBlogData as BlogData);
  const [lang, setLang] = useState<BlogLanguage>("vi");

  // Instant 0ms live sync from localStorage + cache-busted /api/blog fetch + BroadcastChannel listener
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
    ).then((freshest) => {
      if (freshest && Array.isArray(freshest.posts)) {
        setBlogData(freshest);
      }
    });

    return subscribeToLiveSync<BlogData>(
      "jev_live_blog_data",
      "/api/blog",
      initialBlogData as BlogData,
      (freshest) => {
        if (freshest && Array.isArray(freshest.posts)) {
          setBlogData(freshest);
        }
      }
    );
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

  // State to track copied citation per article card
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  const handleCopyCardCitation = (post: BlogPost) => {
    const titleText = post.title[lang] || post.title.vi;
    const year = new Date(post.publishedAt).getFullYear();
    const citation = `N. Q. Thang, "${titleText}," VNU Journal of Science: Computer Science & Communication Engineering, Paper ID: ${post.paperId}, ${year}. [Online]. Available: https://blog.jevkayden.tech/${post.slug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(citation);
      setCopiedCitationId(post.id);
      setTimeout(() => setCopiedCitationId(null), 2000);
    }
  };

  // Filtering states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedParentCat, setSelectedParentCat] = useState<string | null>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [collapsedParents, setCollapsedParents] = useState<Record<string, boolean>>({});

  // Toggle parent category collapse in tree
  const toggleParentCollapse = (parentId: string) => {
    setCollapsedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogData.posts.forEach((p) => {
      p.tags.forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [blogData.posts]);

  // Tag filter toggle
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filtered posts calculation
  const filteredPosts = useMemo(() => {
    return blogData.posts.filter((post) => {
      // 1. Category Tree Filter
      if (selectedParentCat && post.parentCategory !== selectedParentCat) {
        return false;
      }
      if (selectedSubCat && post.subCategory !== selectedSubCat) {
        return false;
      }

      // 2. Tag Filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((t) => post.tags.includes(t));
        if (!hasAllTags) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch =
          post.title.vi.toLowerCase().includes(q) || post.title.en.toLowerCase().includes(q);
        const excerptMatch =
          post.excerpt.vi.toLowerCase().includes(q) || post.excerpt.en.toLowerCase().includes(q);
        const tagMatch = post.tags.some((t) => t.toLowerCase().includes(q));
        const paperIdMatch = post.paperId.toLowerCase().includes(q);
        if (!titleMatch && !excerptMatch && !tagMatch && !paperIdMatch) {
          return false;
        }
      }

      return true;
    });
  }, [blogData.posts, selectedParentCat, selectedSubCat, selectedTags, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedParentCat(null);
    setSelectedSubCat(null);
    setSelectedTags([]);
  };

  const hasActiveFilter =
    Boolean(searchQuery.trim()) ||
    Boolean(selectedParentCat) ||
    Boolean(selectedSubCat) ||
    selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 font-sans flex flex-col selection:bg-sky-200 selection:text-slate-900">
      {/* ========================================================= */}
      {/* 1. TOP CONTROL DECK: 100% PURE IEEE XPLORE AESTHETIC */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Return to Hub & Portal Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-[#00629B] border border-slate-300 rounded transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === "vi" ? "VỀ HUB CHÍNH" : "RETURN TO HUB"}</span>
          </Link>

          <div className="flex items-center gap-2">
            <BrandLogo variant="ieee" size={30} />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#00629B]">
              BLOG.JEVKAYDEN.TECH
            </span>
            <span className="hidden sm:inline text-[11px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
              TECHNICAL ARCHIVE // VNU-UET
            </span>
          </div>
        </div>

        {/* Right: CV Jump, Language Switcher, Admin Portal */}
        <div className="flex items-center gap-2.5 text-xs">
          <Link
            href="/cv"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-[#00629B] font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === "vi" ? "HỒ SƠ /CV ↗" : "CV DOSSIER ↗"}</span>
          </Link>

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
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN 2-COLUMN LAYOUT: TREE EXPLORER + ARTICLE FEED */}
      {/* ========================================================= */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: COLLAPSIBLE CATEGORY TREE EXPLORER (4 cols) */}
        <aside className="lg:col-span-4 sticky top-16 bg-white border border-slate-200 shadow-sm rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00629B]" />
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900">
                {lang === "vi" ? "DANH MỤC CHUYÊN ĐỀ" : "RESEARCH TOPICS"}
              </h2>
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] font-sans font-medium text-rose-600 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <X className="w-3 h-3" />
                <span>{lang === "vi" ? "Xóa bộ lọc" : "Clear filters"}</span>
              </button>
            )}
          </div>

          {/* Reset All Posts Option */}
          <button
            type="button"
            onClick={() => {
              setSelectedParentCat(null);
              setSelectedSubCat(null);
            }}
            className={`w-full text-left px-3 py-2 mb-2 font-sans text-xs font-medium rounded transition-colors flex items-center justify-between cursor-pointer ${
              !selectedParentCat && !selectedSubCat
                ? "bg-[#00629B] text-white font-semibold shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>{lang === "vi" ? "📁 Tất cả bài viết" : "📁 All Articles"}</span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                !selectedParentCat && !selectedSubCat
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {blogData.posts.length}
            </span>
          </button>

          {/* Hierarchical Tree Nodes (Font-sans, Modern Docs Layout, Clean Guide Lines) */}
          <div className="space-y-1.5 select-none">
            {blogData.categoryTree.length === 0 ? (
              <div className="p-4 text-center border border-dashed border-slate-200 rounded text-slate-400 text-xs">
                {lang === "vi" ? "Chưa có chuyên đề nào được tạo." : "No categories created yet."}
              </div>
            ) : (
              blogData.categoryTree.map((parent) => {
              const isCollapsed = Boolean(collapsedParents[parent.id]);
              const isParentActive = selectedParentCat === parent.id && !selectedSubCat;
              const parentPostCount = blogData.posts.filter(
                (p) => p.parentCategory === parent.id
              ).length;

              return (
                <div key={parent.id} className="space-y-1">
                  {/* Parent Category Header */}
                  <div
                    onClick={() => {
                      setSelectedParentCat(parent.id);
                      setSelectedSubCat(null);
                    }}
                    className={`text-[13px] font-semibold py-2 px-2.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                      isParentActive
                        ? "bg-sky-50 text-[#00629B]"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleParentCollapse(parent.id);
                        }}
                        className="p-0.5 -ml-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                      >
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="leading-snug break-words">
                        {parent.name[lang] || parent.name.vi}
                      </span>
                    </div>

                    <span className="shrink-0 bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                      {parentPostCount}
                    </span>
                  </div>

                  {/* Child Sub-Categories: Clean Vertical Guide Line, Zero ↳, Zero Brackets */}
                  {!isCollapsed && (
                    <div className="ml-3 pl-3 border-l border-slate-200 space-y-1 mt-1">
                      {parent.subCategories.map((sub) => {
                        const isSubActive = selectedSubCat === sub.id;
                        const subPostCount = blogData.posts.filter(
                          (p) => p.subCategory === sub.id
                        ).length;

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              setSelectedParentCat(parent.id);
                              setSelectedSubCat(sub.id);
                            }}
                            className={`w-full text-left py-1.5 px-2.5 text-[13px] rounded transition-colors flex items-center justify-between cursor-pointer gap-2 ${
                              isSubActive
                                ? "border-l-2 border-[#00629B] bg-[#00629B]/8 text-[#00629B] font-semibold -ml-[13px] pl-[23px]"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
                            }`}
                          >
                            <span className="flex-1 break-words whitespace-normal leading-snug">
                              {sub.name[lang] || sub.name.vi}
                            </span>
                            <span className="text-xs text-slate-400 shrink-0 font-medium">
                              {subPostCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }))}
          </div>

          {/* Author Attribution Badge */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-sans space-y-0.5">
            <div className="text-xs font-bold tracking-wide text-slate-900 uppercase">
              NGUYỄN QUANG THẮNG (JEV KAYDEN)
            </div>
            <div className="text-[12px] font-serif italic text-slate-600 mt-0.5">
              {lang === "vi"
                ? "Khoa Điện tử Viễn thông — VNU-UET"
                : "Faculty of Electronics & Telecommunications — VNU-UET"}
            </div>
            <div className="text-[11px] font-mono text-[#00629B] mt-1">
              blog.jevkayden.tech
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: SEARCH, TAG CLOUD & ARTICLES (8 cols) */}
        <main className="lg:col-span-8 space-y-6">
          {/* Search Box + Active Filter Bar */}
          <div className="bg-white border border-slate-200 p-4 sm:p-5 shadow-sm rounded-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "vi"
                    ? "Tìm kiếm theo tiêu đề, nội dung, mã tài liệu hoặc từ khóa..."
                    : "Search by title, abstract, document ID, or keywords..."
                }
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded font-sans text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#00629B] focus:ring-1 focus:ring-[#00629B] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Academic Index Terms Filter */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-slate-700 mr-1">
                <Tag className="w-3.5 h-3.5 text-[#00629B]" />
                <span>{lang === "vi" ? "Từ khóa chuyên đề:" : "Index Terms:"}</span>
              </div>
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 text-xs font-medium border rounded-sm transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#00629B] border-[#00629B] text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 hover:text-[#00629B]"
                    }`}
                  >
                    {tag.replace(/^#+/, "")}
                  </button>
                );
              })}
            </div>

            {/* Active Filter Indicators */}
            {hasActiveFilter && (
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-sans text-slate-600">
                <span>
                  {lang === "vi"
                    ? `Tìm thấy ${filteredPosts.length} bài viết phù hợp`
                    : `Found ${filteredPosts.length} matching articles`}
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-rose-600 hover:underline font-medium"
                >
                  {lang === "vi" ? "Xóa tất cả bộ lọc" : "Reset all filters"}
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* ARTICLE FEED: AUTHENTIC IEEE JOURNAL PREPRINTS */}
          {/* ========================================================= */}
          {blogData.posts.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 p-10 sm:p-12 text-center rounded-sm space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-slate-800 uppercase tracking-wide">
                  {lang === "vi" ? "KHO LƯU TRỮ ĐANG CẬP NHẬT" : "REPOSITORY CURRENTLY EMPTY"}
                </h3>
                <p className="font-serif italic text-xs text-slate-500">
                  IEEE & VNU-UET Research Archive • FET Laboratory
                </p>
              </div>
              <p className="font-sans text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {lang === "vi"
                  ? "Hiện tại kho lưu trữ bài báo và tài liệu kỹ thuật đang được làm mới hoặc chưa có bài viết nào được xuất bản. Vui lòng quay lại sau."
                  : "The technical paper and preprint repository is currently being refreshed or contains no published articles yet. Please check back later."}
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00629B] hover:bg-[#004e7c] text-white font-sans text-xs font-bold rounded shadow-sm transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === "vi" ? "Về trang chủ" : "Return to Home"}</span>
                </Link>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 p-8 text-center rounded-sm">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="font-serif text-base font-bold text-slate-800">
                {lang === "vi" ? "Không tìm thấy bài viết nào" : "No articles found"}
              </h3>
              <p className="font-sans text-xs text-slate-500 mt-1">
                {lang === "vi"
                  ? "Vui lòng thử từ khóa khác hoặc xóa bớt các bộ lọc chuyên mục."
                  : "Please refine your search query or clear category filters."}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-1.5 bg-[#00629B] hover:bg-[#004e7c] text-white font-sans text-xs font-medium rounded transition-colors"
              >
                {lang === "vi" ? "Xem tất cả bài viết" : "View all articles"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => {
                const title = post.title[lang] || post.title.vi;
                const excerpt = post.excerpt[lang] || post.excerpt.vi;

                return (
                  <article
                    key={post.id}
                    className="bg-white border border-slate-200 hover:border-[#00629B] transition-all shadow-sm hover:shadow p-6 sm:p-7 rounded-sm space-y-4"
                  >
                    {/* Top Preprint Metadata Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#00629B] tracking-wider">
                          IEEE / VNU-UET REPOSITORY
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded">
                          {post.paperId}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-sans">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {lang === "vi"
                            ? `Ngày đăng: ${formatPublishDate(post.publishedAt, "vi")}`
                            : `Date: ${formatPublishDate(post.publishedAt, "en")}`}
                        </span>
                      </div>
                    </div>

                    {/* Article Title in Academic Serif */}
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 leading-snug">
                      <Link
                        href={`/blog/${post.slug}?lang=${lang}`}
                        className="hover:text-[#00629B] transition-colors"
                      >
                        {title}
                      </Link>
                    </h2>

                    {/* Author Line (Bilingual) */}
                    <div className="text-xs font-serif italic text-slate-600">
                      {lang === "vi"
                        ? "Nguyễn Quang Thắng — Khoa Điện tử Viễn thông (FET), Trường Đại học Công nghệ – ĐHQGHN"
                        : "Nguyen Quang Thang — Faculty of Electronics & Telecommunications (FET), VNU-UET"}
                    </div>

                    {/* Abstract (Authentic Unboxed IEEE Format) */}
                    <p className="font-serif text-[14.5px] leading-relaxed text-slate-800 text-justify">
                      <span className="font-bold italic mr-1">
                        {lang === "vi" ? "Tóm tắt—" : "Abstract—"}
                      </span>
                      {excerpt}
                    </p>

                    {/* IEEE Index Terms */}
                    <div className="text-[13px] font-serif leading-relaxed text-slate-700">
                      <span className="font-bold italic text-slate-900 mr-1.5">
                        {lang === "vi" ? "Từ khóa (Index Terms)—" : "Index Terms—"}
                      </span>
                      {post.tags.map((t, idx) => (
                        <React.Fragment key={idx}>
                          <button
                            type="button"
                            onClick={() => toggleTag(t)}
                            className="hover:text-[#00629B] hover:underline cursor-pointer font-normal text-slate-700"
                          >
                            {t.replace(/^#+/, "")}
                          </button>
                          {idx < post.tags.length - 1 && <span className="text-slate-400 mr-1.5">;</span>}
                        </React.Fragment>
                      ))}
                      <span className="text-slate-400">.</span>
                    </div>

                    {/* IEEE Xplore Action Bar */}
                    <div className="pt-3 mt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      {/* Left Side Quick Tools */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/blog/${post.slug}?lang=${lang}&print=true`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#00629B] font-sans text-xs font-medium rounded-sm border border-slate-300 transition-colors"
                          title={lang === "vi" ? "Xem & In bản PDF IEEE A4" : "View & Print IEEE A4 PDF"}
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                          <span>PDF</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleCopyCardCitation(post)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#00629B] font-sans text-xs font-medium rounded-sm border border-slate-300 transition-colors cursor-pointer"
                          title={lang === "vi" ? "Sao chép trích dẫn định dạng chuẩn IEEE" : "Copy IEEE Citation format"}
                        >
                          {copiedCitationId === post.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold text-[11px]">
                                {lang === "vi" ? "✓ Đã sao chép trích dẫn IEEE" : "✓ Copied IEEE Citation"}
                              </span>
                            </>
                          ) : (
                            <>
                              <Quote className="w-3.5 h-3.5 text-[#00629B]" />
                              <span>{lang === "vi" ? "Trích dẫn" : "Cite"}</span>
                            </>
                          )}
                        </button>

                        <span className="hidden sm:inline font-mono text-[11px] text-slate-400 pl-1">
                          DOI: 10.1109/VNU-UET.{post.paperId}
                        </span>
                      </div>

                      {/* Right Side Primary Action */}
                      <Link
                        href={`/blog/${post.slug}?lang=${lang}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00629B] hover:bg-[#002855] text-white font-sans text-xs font-semibold rounded-sm shadow-sm transition-colors"
                      >
                        <span>{lang === "vi" ? "ĐỌC TOÀN VĂN →" : "FULL TEXT →"}</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
