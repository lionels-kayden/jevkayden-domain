"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { BlogPost, BlogData, BlogLanguage, CategoryTreeNode, CategorySubNode } from "@/types/blog";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { getAdminPasscode } from "@/lib/adminAuth";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Code,
  Image as ImageIcon,
  Sigma,
  GitBranch,
  Table,
  Layers,
  X,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Settings,
  Eye,
  BookOpen,
  Menu,
  Loader2,
  FolderPlus,
  FolderTree,
  Folder,
  FileCode,
} from "lucide-react";

interface BlogWorkspaceProps {
  blogData: BlogData;
  setBlogData: React.Dispatch<React.SetStateAction<BlogData>>;
  passcode?: string;
}

export const BlogWorkspace: React.FC<BlogWorkspaceProps> = ({ blogData, setBlogData, passcode = "" }) => {
  const [selectedPostId, setSelectedPostId] = useState<string>(
    blogData.posts[0]?.id || "post-01"
  );
  const [activeEditLang, setActiveEditLang] = useState<BlogLanguage>("vi");

  // Studio 3-Pane UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMetaOpen, setIsMetaOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [codeLang, setCodeLang] = useState<string>("verilog");

  // Left sidebar search & category filter
  const [searchTreeQuery, setSearchTreeQuery] = useState<string>("");
  const [selectedTreeCategory, setSelectedTreeCategory] = useState<string | "ALL">("ALL");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Category modal states (Supporting NEW_PARENT, NEW_CHILD, and MANAGE modes)
  type CategoryModalMode = "NEW_PARENT" | "NEW_CHILD" | "MANAGE";
  const [categoryModalMode, setCategoryModalMode] = useState<CategoryModalMode>("NEW_PARENT");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [isSavingCategory, setIsSavingCategory] = useState<boolean>(false);

  // Parent Category Form
  const [newParentNameVi, setNewParentNameVi] = useState<string>("");
  const [newParentNameEn, setNewParentNameEn] = useState<string>("");
  const [customParentId, setCustomParentId] = useState<string>("");

  // Child Category Form
  const [newCategoryTargetParent, setNewCategoryTargetParent] = useState<string>(
    blogData.categoryTree[0]?.id || "01_ENGINEERING"
  );
  const [newChildNameVi, setNewChildNameVi] = useState<string>("");
  const [newChildNameEn, setNewChildNameEn] = useState<string>("");
  const [customChildId, setCustomChildId] = useState<string>("");

  // Refs for uploads and textarea
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Active post reference (safely returns null when posts array is empty)
  const activePost = useMemo(() => {
    if (!blogData.posts || blogData.posts.length === 0) return null;
    return (
      blogData.posts.find((p) => p.id === selectedPostId) ||
      blogData.posts[0] ||
      null
    );
  }, [blogData.posts, selectedPostId]);

  // Active Category info
  const activeParentCategory = useMemo(() => {
    if (!activePost) return null;
    return blogData.categoryTree.find((c) => c.id === activePost.parentCategory) || null;
  }, [blogData.categoryTree, activePost]);

  const activeSubCategory = useMemo(() => {
    if (!activeParentCategory || !activePost) return null;
    return (
      activeParentCategory.subCategories.find((s) => s.id === activePost.subCategory) || null
    );
  }, [activeParentCategory, activePost]);

  // Toggle parent category in tree explorer
  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Update a direct field of active post
  const updateActivePost = <K extends keyof BlogPost>(field: K, value: BlogPost[K]) => {
    if (!activePost) return;
    setBlogData((prev) => {
      const updatedPosts = prev.posts.map((post) => {
        if (post.id === activePost.id) {
          return {
            ...post,
            [field]: value,
            updatedAt: new Date().toISOString(),
          };
        }
        return post;
      });
      return { ...prev, posts: updatedPosts };
    });
  };

  // Update a bilingual field of active post (title, excerpt, content)
  const updateActivePostBilingual = useCallback(
    (field: "title" | "excerpt" | "content", value: string) => {
      if (!activePost) return;
      setBlogData((prev) => {
        const updatedPosts = prev.posts.map((post) => {
          if (post.id === activePost.id) {
            const currentBilingual = post[field] || { vi: "", en: "" };
            return {
              ...post,
              [field]: {
                ...currentBilingual,
                [activeEditLang]: value,
              },
              updatedAt: new Date().toISOString(),
            };
          }
          return post;
        });
        return { ...prev, posts: updatedPosts };
      });
    },
    [activePost, activeEditLang, setBlogData]
  );

  // Create a new post (works smoothly even when 0 categories exist)
  const handleCreateNewPost = async () => {
    let nextIndex = blogData.posts.length + 1;
    while (
      blogData.posts.some(
        (p) => p.id === `post-${String(nextIndex).padStart(2, "0")}`
      )
    ) {
      nextIndex++;
    }
    const padIndex = String(nextIndex).padStart(2, "0");
    const newId = `post-${padIndex}`;
    const newPost: BlogPost = {
      id: newId,
      slug: `bai-viet-moi-${padIndex}`,
      paperId: `UET-FET-2026-${padIndex}`,
      title: {
        vi: "Tiêu đề bài viết kỹ thuật mới",
        en: "New Technical Research Paper Title",
      },
      excerpt: {
        vi: "Tóm tắt bài viết trình bày giải pháp vi kiến trúc và kết quả thực nghiệm.",
        en: "Abstract summary outlining technical methodology and experimental metrics.",
      },
      content: {
        vi: `> [!NOTE]\n> Nghiên cứu từ Khoa Điện tử Viễn thông, Trường Đại học Công nghệ – ĐHQGHN (VNU-UET).\n\n## I. Cơ sở Lý thuyết\nNội dung phân tích mô hình và công thức kỹ thuật:\n\n$$T_{clk} \\ge T_{cq} + T_{logic} + T_{setup} - T_{skew}$$\n\n## II. Kiến trúc & Sơ đồ Khối\n\n\`\`\`mermaid\ngraph LR\n    A[Đầu vào Tín hiệu] --> B[Bộ xử lý DSP]\n    B --> C[Giao tiếp Ngoại vi]\n\`\`\`\n\n## III. Mã nguồn RTL / C\n\n\`\`\`verilog\nmodule alu_core (\n    input  wire clk,\n    input  wire [31:0] a, b,\n    output reg  [31:0] result\n);\n    always @(posedge clk) begin\n        result <= a + b;\n    end\nendmodule\n\`\`\`\n`,
        en: `> [!NOTE]\n> Study conducted at Faculty of Electronics & Telecommunications, VNU-UET.\n\n## I. Theoretical Analysis\nTiming slack and critical delay parameters:\n\n$$T_{clk} \\ge T_{cq} + T_{logic} + T_{setup} - T_{skew}$$\n\n## II. Architectural Diagram\n\n\`\`\`mermaid\ngraph LR\n    A[Signal Input] --> B[Processing Unit]\n    B --> C[Peripheral Interface]\n\`\`\`\n`,
      },
      parentCategory: blogData.categoryTree[0]?.id || "",
      subCategory: blogData.categoryTree[0]?.subCategories[0]?.id || "",
      tags: ["RISC-V", "Verilog", "VNU-UET"],
      status: "DRAFT",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readingTime: "5 min",
    };

    const updatedData: BlogData = {
      ...blogData,
      posts: [newPost, ...blogData.posts],
      lastUpdated: new Date().toISOString(),
    };

    setBlogData(updatedData);
    setSelectedPostId(newId);
    await persistBlogData(updatedData);
  };

  // Delete active post (allows deleting down to 0 with zero blockers)
  const handleDeletePost = async () => {
    if (!activePost) return;
    const currentTitle = activePost.title.vi || activePost.title.en;
    const confirmed = window.confirm(
      `BẠN CÓ CHẮC CHẮN MUỐN XÓA BÀI VIẾT:\n"${currentTitle}"?\nHành động này không thể hoàn tác.`
    );
    if (confirmed) {
      const remaining = blogData.posts.filter((p) => p.id !== activePost.id);
      const updatedData: BlogData = {
        ...blogData,
        posts: remaining,
        lastUpdated: new Date().toISOString(),
      };
      setBlogData(updatedData);
      setSelectedPostId(remaining[0]?.id || "");
      await persistBlogData(updatedData);
    }
  };

  // Smart cursor-aware syntax insertion helper
  const insertSmartSyntax = (
    prefix: string,
    suffix: string = "",
    defaultSelection: string = ""
  ) => {
    if (!activePost) return;
    const el = contentTextareaRef.current;
    const currentContent = activePost.content[activeEditLang] || "";

    if (!el) {
      const inserted = defaultSelection
        ? `${prefix}${defaultSelection}${suffix}`
        : `${prefix}${suffix}`;
      updateActivePostBilingual("content", currentContent + inserted);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = currentContent.substring(start, end);

    let textToInsert = "";
    let newCursorStart = start;
    let newCursorEnd = start;

    if (selectedText.length > 0) {
      // Wrap highlighted selection
      textToInsert = `${prefix}${selectedText}${suffix}`;
      newCursorStart = start + prefix.length;
      newCursorEnd = newCursorStart + selectedText.length;
    } else if (defaultSelection) {
      // Insert default selection and highlight it ready to be typed over
      textToInsert = `${prefix}${defaultSelection}${suffix}`;
      newCursorStart = start + prefix.length;
      newCursorEnd = newCursorStart + defaultSelection.length;
    } else {
      // Empty wrapper: place cursor right between prefix and suffix
      textToInsert = `${prefix}${suffix}`;
      newCursorStart = start + prefix.length;
      newCursorEnd = newCursorStart;
    }

    const newText =
      currentContent.substring(0, start) + textToInsert + currentContent.substring(end);
    updateActivePostBilingual("content", newText);

    // Focus & position cursor inside block smoothly
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newCursorStart, newCursorEnd);
    }, 15);
  };

  // Automatically purge any massive Base64 image dumps or corrupted mermaid blocks from content
  const activeContent = activePost ? activePost.content[activeEditLang] || "" : "";
  useEffect(() => {
    let cleaned = activeContent;
    if (cleaned.includes("data:image/")) {
      cleaned = cleaned.replace(
        /!\[([^\]]*)\]\(data:image\/[a-zA-Z0-9/+]+;base64,[^)]+\)/g,
        (match, caption) => {
          const safeCaption =
            caption.replace(/^((figure|fig\.?|hình|hinh)\s*[:.]?\s*)+/i, "").trim() ||
            "Hardware Waveform";
          return `![${safeCaption}](/uploads/blog/waveform-sample.png)`;
        }
      );
    }
    if (cleaned.includes("mermaidgraph")) {
      cleaned = cleaned.replace(/```mermaidgraph\s*([a-zA-Z0-9_]+)/g, "```mermaid\ngraph $1");
    }
    if (cleaned !== activeContent) {
      updateActivePostBilingual("content", cleaned);
    }
  }, [activeContent, updateActivePostBilingual]);

  // Real image upload to /api/upload and insert clean Markdown tag
  const uploadAndInsertImage = async (file: File) => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const authCode = getAdminPasscode();
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-passcode": authCode,
        },
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Tải ảnh thất bại.");
      }

      const data = await res.json();
      const rawCaption = data.caption || file.name.replace(/\.[^/.]+$/, "");
      const cleanCaption =
        rawCaption.replace(/^((figure|fig\.?|hình|hinh)\s*[:.]?\s*)+/i, "").trim() ||
        "Hardware Figure";

      const snippet = `\n![${cleanCaption}](${data.url})\n`;
      insertSmartSyntax(snippet, "");
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Không thể tải lên hình ảnh: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Clipboard Image Paste Handler (Ctrl + V with screenshot in clipboard)
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const ext = file.type.split("/")[1] || "png";
        const namedFile = new File([file], `waveform-${Date.now()}.${ext}`, {
          type: file.type,
        });

        await uploadAndInsertImage(namedFile);
        break;
      }
    }
  };

  // File upload for image insertion
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndInsertImage(file);
    if (e.target) e.target.value = "";
  };

  // Helper to format clean uppercase slug ID from Vietnamese text
  const toSlugId = (text: string): string => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  // Immediate persistence to /api/blog (persists directly into src/data/blogData.json)
  const persistBlogData = async (dataToPersist: BlogData): Promise<boolean> => {
    try {
      const authCode = getAdminPasscode() || passcode;
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": authCode,
        },
        body: JSON.stringify({
          passcode: authCode,
          data: dataToPersist,
        }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Không thể đồng bộ dữ liệu vào blogData.json.");
      }
      return true;
    } catch (err) {
      console.error("Lỗi đồng bộ /api/blog:", err);
      alert(err instanceof Error ? err.message : "Lỗi lưu dữ liệu bài viết & chuyên mục.");
      return false;
    }
  };

  // Wipe all posts and categories completely down to zero (Reset 0)
  const handleResetAllToZero = async () => {
    const confirmed = window.confirm(
      "CẢNH BÁO // RESET TOÀN BỘ VỀ 0:\n\n" +
        "Bạn có chắc chắn muốn DỌN SẠCH TOÀN BỘ bài viết và nhánh chuyên mục mẫu trong hệ thống?\n" +
        "Dữ liệu sẽ được đưa về trạng thái 0 bài viết, 0 chuyên mục (trang trắng hoàn toàn)."
    );
    if (!confirmed) return;

    const emptyData: BlogData = {
      categoryTree: [],
      posts: [],
      lastUpdated: new Date().toISOString(),
    };

    setBlogData(emptyData);
    setSelectedPostId("");
    setIsCategoryModalOpen(false);
    await persistBlogData(emptyData);
  };

  // Delete parent or child category without restrictions (allows zero categories)
  const handleDeleteCategory = async (
    type: "PARENT" | "CHILD",
    targetId: string,
    parentId?: string
  ) => {
    if (type === "PARENT") {
      const parentNode = blogData.categoryTree.find((p) => p.id === targetId);
      if (!parentNode) return;

      const remainingParents = blogData.categoryTree.filter((p) => p.id !== targetId);
      const fallbackParent = remainingParents[0] || null;
      const fallbackSub = fallbackParent?.subCategories[0]?.id || "";
      const fallbackSubName = fallbackParent
        ? `${fallbackParent.name.vi} → ${fallbackParent.subCategories[0]?.name.vi || "Tổng quan"}`
        : "Chưa phân loại (Không có chuyên mục)";

      const postsInParent = blogData.posts.filter((p) => p.parentCategory === targetId);
      const confirmMessage =
        postsInParent.length > 0
          ? `BẠN CÓ CHẮC CHẮN MUỐN XÓA CHUYÊN MỤC GỐC:\n"${parentNode.name.vi}" (${parentNode.id})?\n\n` +
            `⚠️ LƯU Ý: Có ${postsInParent.length} bài viết trong chuyên mục này. Tất cả sẽ được chuyển sang:\n` +
            `→ "${fallbackSubName}".`
          : `BẠN CÓ CHẮC CHẮN MUỐN XÓA CHUYÊN MỤC GỐC:\n"${parentNode.name.vi}" (${parentNode.id})?\n(Chuyên mục này hiện có 0 bài viết)`;

      if (!window.confirm(confirmMessage)) return;

      // Reassign all posts in this parent to fallback (or empty if no categories left)
      const updatedPosts = blogData.posts.map((p) => {
        if (p.parentCategory === targetId) {
          return {
            ...p,
            parentCategory: fallbackParent ? fallbackParent.id : "",
            subCategory: fallbackParent ? fallbackSub : "",
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      const updatedTree = remainingParents;

      const updatedData: BlogData = {
        ...blogData,
        categoryTree: updatedTree,
        posts: updatedPosts,
        lastUpdated: new Date().toISOString(),
      };

      setBlogData(updatedData);
      await persistBlogData(updatedData);
    } else {
      // type === "CHILD"
      if (!parentId) return;
      const parentNode = blogData.categoryTree.find((p) => p.id === parentId);
      if (!parentNode) return;

      const subNode = parentNode.subCategories.find((s) => s.id === targetId);
      if (!subNode) return;

      let fallbackParentId = parentId;
      let fallbackSubId = "";
      let fallbackSubName = "";
      let updatedTree = blogData.categoryTree;

      if (parentNode.subCategories.length > 1) {
        // Fallback to sibling sub-category within the same parent
        const remainingSubs = parentNode.subCategories.filter((s) => s.id !== targetId);
        fallbackSubId = remainingSubs[0].id;
        fallbackSubName = remainingSubs[0].name.vi;

        updatedTree = blogData.categoryTree.map((p) => {
          if (p.id === parentId) {
            return {
              ...p,
              subCategories: remainingSubs,
            };
          }
          return p;
        });
      } else {
        // This is the last subcategory of this parent
        const otherParents = blogData.categoryTree.filter((p) => p.id !== parentId);
        if (otherParents.length > 0) {
          const fallbackParent = otherParents[0];
          fallbackParentId = fallbackParent.id;
          fallbackSubId = fallbackParent.subCategories[0]?.id || "";
          fallbackSubName = `${fallbackParent.name.vi} → ${fallbackParent.subCategories[0]?.name.vi || "Tổng quan"}`;
          updatedTree = otherParents;
        } else {
          // Zero categories remain
          fallbackParentId = "";
          fallbackSubId = "";
          fallbackSubName = "Chưa phân loại (Không có chuyên mục)";
          updatedTree = [];
        }
      }

      const postsInSub = blogData.posts.filter(
        (p) => p.parentCategory === parentId && p.subCategory === targetId
      );

      const confirmMessage =
        postsInSub.length > 0
          ? `BẠN CÓ CHẮC CHẮN MUỐN XÓA NHÁNH CON:\n"${subNode.name.vi}" (${subNode.id})?\n\n` +
            `⚠️ LƯU Ý: Có ${postsInSub.length} bài viết trong nhánh con này. Tất cả sẽ được chuyển sang:\n` +
            `→ "${fallbackSubName}".`
          : `BẠN CÓ CHẮC CHẮN MUỐN XÓA NHÁNH CON:\n"${subNode.name.vi}" (${subNode.id})?\n(Nhánh này hiện có 0 bài viết)`;

      if (!window.confirm(confirmMessage)) return;

      // Reassign all posts in this child
      const updatedPosts = blogData.posts.map((p) => {
        if (p.parentCategory === parentId && p.subCategory === targetId) {
          return {
            ...p,
            parentCategory: fallbackParentId,
            subCategory: fallbackSubId,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      const updatedData: BlogData = {
        ...blogData,
        categoryTree: updatedTree,
        posts: updatedPosts,
        lastUpdated: new Date().toISOString(),
      };

      setBlogData(updatedData);
      await persistBlogData(updatedData);
    }
  };

  // Add new Parent or Child Category with immediate persistence to /api/blog
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCategory(true);

    try {
      if (categoryModalMode === "NEW_PARENT") {
        if (!newParentNameVi.trim()) {
          alert("Vui lòng nhập Tên Nhánh Mẹ (Tiếng Việt).");
          setIsSavingCategory(false);
          return;
        }

        const autoNumber = String(blogData.categoryTree.length + 1).padStart(2, "0");
        const autoParentSlug = toSlugId(newParentNameVi);
        const finalParentId = customParentId.trim()
          ? toSlugId(customParentId)
          : `${autoNumber}_${autoParentSlug || "CATEGORY"}`;

        if (blogData.categoryTree.some((c) => c.id === finalParentId)) {
          alert(`Mã định danh chuyên mục gốc "${finalParentId}" đã tồn tại. Vui lòng đổi tên hoặc mã.`);
          setIsSavingCategory(false);
          return;
        }

        // Child sub-category under new parent
        const childVi = newChildNameVi.trim() || "Tổng quan & Chuyên đề";
        const childEn =
          newChildNameEn.trim() ||
          (newChildNameVi.trim() ? newChildNameVi.trim() : "Overview & Topics");
        const autoChildSlug = toSlugId(childVi);
        const finalChildId = customChildId.trim()
          ? toSlugId(customChildId)
          : autoChildSlug || "GENERAL";

        const newParentNode: CategoryTreeNode = {
          id: finalParentId,
          name: {
            vi: newParentNameVi.trim(),
            en: newParentNameEn.trim() || newParentNameVi.trim(),
          },
          subCategories: [
            {
              id: finalChildId,
              name: {
                vi: childVi,
                en: childEn,
              },
              description: {
                vi: `Chuyên mục ${childVi} thuộc ${newParentNameVi.trim()}`,
                en: `Topics under ${newParentNameEn.trim() || newParentNameVi.trim()}`,
              },
            },
          ],
        };

        const updatedTree = [...blogData.categoryTree, newParentNode];

        // Auto-assign active post to the newly created branch
        const updatedPosts = blogData.posts.map((post) => {
          if (activePost && post.id === activePost.id) {
            return {
              ...post,
              parentCategory: finalParentId,
              subCategory: finalChildId,
              updatedAt: new Date().toISOString(),
            };
          }
          return post;
        });

        const updatedData: BlogData = {
          ...blogData,
          categoryTree: updatedTree,
          posts: updatedPosts,
          lastUpdated: new Date().toISOString(),
        };

        setBlogData(updatedData);
        await persistBlogData(updatedData);

        // Reset fields & close
        setNewParentNameVi("");
        setNewParentNameEn("");
        setCustomParentId("");
        setNewChildNameVi("");
        setNewChildNameEn("");
        setCustomChildId("");
        setIsCategoryModalOpen(false);
      } else {
        // NEW_CHILD mode
        if (!newChildNameVi.trim()) {
          alert("Vui lòng nhập Tên Nhánh Con (Tiếng Việt).");
          setIsSavingCategory(false);
          return;
        }

        const targetParentId = newCategoryTargetParent || blogData.categoryTree[0]?.id;
        if (!targetParentId) {
          alert("Vui lòng chọn Nhánh Mẹ hợp lệ.");
          setIsSavingCategory(false);
          return;
        }

        const autoChildSlug = toSlugId(newChildNameVi);
        const finalChildId = customChildId.trim()
          ? toSlugId(customChildId)
          : autoChildSlug || "SUB_CAT";

        const targetParent = blogData.categoryTree.find((p) => p.id === targetParentId);
        if (targetParent?.subCategories.some((s) => s.id === finalChildId)) {
          alert(`Nhánh con với mã "${finalChildId}" đã tồn tại trong nhánh mẹ này.`);
          setIsSavingCategory(false);
          return;
        }

        const newSubNode: CategorySubNode = {
          id: finalChildId,
          name: {
            vi: newChildNameVi.trim(),
            en: newChildNameEn.trim() || newChildNameVi.trim(),
          },
          description: {
            vi: `Chuyên mục ${newChildNameVi.trim()}`,
            en: `Sub-category ${newChildNameEn.trim() || newChildNameVi.trim()}`,
          },
        };

        const updatedTree = blogData.categoryTree.map((p) => {
          if (p.id === targetParentId) {
            return {
              ...p,
              subCategories: [...p.subCategories, newSubNode],
            };
          }
          return p;
        });

        // Auto-assign active post to the new child branch
        const updatedPosts = blogData.posts.map((post) => {
          if (activePost && post.id === activePost.id) {
            return {
              ...post,
              parentCategory: targetParentId,
              subCategory: finalChildId,
              updatedAt: new Date().toISOString(),
            };
          }
          return post;
        });

        const updatedData: BlogData = {
          ...blogData,
          categoryTree: updatedTree,
          posts: updatedPosts,
          lastUpdated: new Date().toISOString(),
        };

        setBlogData(updatedData);
        await persistBlogData(updatedData);

        // Reset fields & close
        setNewChildNameVi("");
        setNewChildNameEn("");
        setCustomChildId("");
        setIsCategoryModalOpen(false);
      }
    } finally {
      setIsSavingCategory(false);
    }
  };

  // Export current post to Obsidian .md with YAML frontmatter
  const handleExportObsidianMd = () => {
    if (!activePost) return;
    const titleStr = (activePost.title[activeEditLang] || activePost.title.vi).replace(/"/g, '\\"');
    const excerptStr = (activePost.excerpt[activeEditLang] || activePost.excerpt.vi).replace(/"/g, '\\"');
    const cleanTags = activePost.tags.map((t) => t.replace(/^#+/, ""));
    const yamlHeader = `---
title: "${titleStr}"
excerpt: "${excerptStr}"
paperId: "${activePost.paperId}"
slug: "${activePost.slug}"
parentCategory: "${activePost.parentCategory}"
subCategory: "${activePost.subCategory}"
status: "${activePost.status}"
tags:
${cleanTags.map((t) => `  - ${t}`).join("\n")}
publishedAt: "${activePost.publishedAt}"
updatedAt: "${activePost.updatedAt || new Date().toISOString()}"
---

`;
    const fullContent = yamlHeader + (activePost.content[activeEditLang] || activePost.content.vi);
    const blob = new Blob([fullContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activePost.slug || "article"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import Obsidian .md with YAML Frontmatter parser
  const handleImportObsidianMd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = (event.target?.result as string) || "";
        let titleVi = file.name.replace(/\.md$/i, "");
        let parentCategory = blogData.categoryTree[0]?.id || "01_ENGINEERING";
        let subCategory = blogData.categoryTree[0]?.subCategories[0]?.id || "IC_DESIGN";
        let tags: string[] = ["Obsidian", "Markdown"];
        let status: "PUBLISHED" | "DRAFT" = "DRAFT";
        let excerptVi = "";
        let markdownBody = raw;
        let paperId = `UET-FET-2026-${Date.now().toString().slice(-4)}`;

        // Match YAML Frontmatter: ^---\n[\s\S]*?\n---\n
        const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (frontmatterMatch) {
          const yamlBlock = frontmatterMatch[1];
          markdownBody = frontmatterMatch[2].trim();

          const lines = yamlBlock.split("\n");
          let parsingTags = false;
          const parsedTags: string[] = [];

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("tags:")) {
              parsingTags = true;
              continue;
            }
            if (parsingTags) {
              if (trimmed.startsWith("- ")) {
                parsedTags.push(trimmed.replace(/^- /, "").replace(/['"]/g, "").replace(/^#+/, "").trim());
                continue;
              } else if (trimmed.includes(":") || trimmed === "") {
                parsingTags = false;
              }
            }

            const titleMatch = trimmed.match(/^title:\s*["']?(.*?)["']?$/);
            if (titleMatch) titleVi = titleMatch[1].trim();

            const paperMatch = trimmed.match(/^paperId:\s*["']?(.*?)["']?$/);
            if (paperMatch) paperId = paperMatch[1].trim();

            const parentMatch = trimmed.match(/^parentCategory:\s*["']?(.*?)["']?$/);
            if (parentMatch) parentCategory = parentMatch[1].trim();

            const subMatch = trimmed.match(/^subCategory:\s*["']?(.*?)["']?$/);
            if (subMatch) subCategory = subMatch[1].trim();

            const statusMatch = trimmed.match(/^status:\s*["']?(PUBLISHED|DRAFT)["']?$/i);
            if (statusMatch) status = statusMatch[1].toUpperCase() as "PUBLISHED" | "DRAFT";

            const excerptMatch = trimmed.match(/^excerpt:\s*["']?(.*?)["']?$/);
            if (excerptMatch) excerptVi = excerptMatch[1].trim();
          }

          if (parsedTags.length > 0) tags = parsedTags;
        }

        // Generate slug from title
        const slug = titleVi
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const importedPost: BlogPost = {
          id: `post-${Date.now().toString().slice(-4)}`,
          slug: slug || `article-${Date.now().toString().slice(-4)}`,
          paperId,
          title: { vi: titleVi, en: titleVi },
          excerpt: { vi: excerptVi || titleVi, en: excerptVi || titleVi },
          content: { vi: markdownBody, en: markdownBody },
          parentCategory,
          subCategory,
          tags,
          status,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readingTime: "5 min",
        };

        setBlogData((prev) => ({
          ...prev,
          posts: [importedPost, ...prev.posts],
        }));
        setSelectedPostId(importedPost.id);
        alert(`Đã nhập bài viết thành công từ Obsidian: "${titleVi}"`);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi đọc file Markdown. Vui lòng kiểm tra lại cấu trúc file.");
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  // Filtered posts for left sidebar
  const filteredTreePosts = useMemo(() => {
    return blogData.posts.filter((post) => {
      if (selectedTreeCategory !== "ALL" && post.parentCategory !== selectedTreeCategory) {
        return false;
      }
      if (searchTreeQuery.trim()) {
        const q = searchTreeQuery.toLowerCase();
        const titleVi = post.title.vi.toLowerCase();
        const titleEn = post.title.en.toLowerCase();
        const paperId = post.paperId.toLowerCase();
        return titleVi.includes(q) || titleEn.includes(q) || paperId.includes(q);
      }
      return true;
    });
  }, [blogData.posts, selectedTreeCategory, searchTreeQuery]);

  return (
    <div className="w-full flex-1 flex flex-row min-h-0 lg:h-[calc(100vh-64px)] lg:overflow-hidden bg-[#F1F5F9] text-slate-800">
      {/* ========================================================= */}
      {/* PANE 1 (LEFT SIDEBAR): COLLAPSIBLE TREE EXPLORER & POST SWITCHER */}
      {/* ========================================================= */}
      <aside
        className={`${
          isSidebarOpen ? "w-72 sm:w-80" : "w-0"
        } shrink-0 border-r border-slate-300 bg-[#F8FAFC] flex flex-col h-full transition-all duration-200 overflow-hidden select-none z-20`}
      >
        {/* Top Header & Search */}
        <div className="p-3 border-b border-slate-200 bg-white shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00629B]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                KHO BÀI VIẾT
              </span>
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 font-mono text-[10px] rounded border border-slate-200">
                {blogData.posts.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer transition-colors"
              title="Ẩn cây thư mục"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTreeQuery}
              onChange={(e) => setSearchTreeQuery(e.target.value)}
              placeholder="Tìm nhanh bài viết..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#00629B] focus:bg-white transition-colors"
            />
            {searchTreeQuery && (
              <button
                type="button"
                onClick={() => setSearchTreeQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Action Row: Tạo bài mới + Thêm nhánh (Single clean icons, zero duplicate + +) */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCreateNewPost}
              className="flex-1 py-1.5 px-2 bg-[#00629B] hover:bg-[#004e7c] text-white text-xs font-semibold rounded flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo bài mới</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="py-1.5 px-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              title="Thêm nhánh chuyên mục mới"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Thêm nhánh</span>
            </button>
          </div>
        </div>

        {/* Tree Body */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3 font-sans">
          {/* Quick "All Posts" Toggle */}
          <button
            type="button"
            onClick={() => setSelectedTreeCategory("ALL")}
            className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between font-medium cursor-pointer transition-colors ${
              selectedTreeCategory === "ALL" && !searchTreeQuery
                ? "bg-slate-200 text-slate-900 font-bold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>Tất cả bài viết</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white rounded border border-slate-200">
              {blogData.posts.length}
            </span>
          </button>

          {/* Tree Hierarchy (with graceful empty state when 0 categories exist) */}
          {blogData.categoryTree.length === 0 ? (
            <div className="p-4 text-center space-y-2 border border-dashed border-slate-300 rounded bg-slate-50 my-2">
              <FolderPlus className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-sans">
                Chưa có nhánh chuyên mục nào.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryModalMode("NEW_PARENT");
                  setIsCategoryModalOpen(true);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-[#00629B] text-white rounded hover:bg-[#004e7c] transition-colors cursor-pointer"
              >
                + Thêm nhánh đầu tiên
              </button>
            </div>
          ) : (
            blogData.categoryTree.map((parent) => {
            const isCollapsed = collapsedCategories[parent.id];
            const parentPosts = blogData.posts.filter((p) => p.parentCategory === parent.id);

            return (
              <div key={parent.id} className="space-y-1">
                {/* Parent Node */}
                <div
                  onClick={() => toggleCategoryCollapse(parent.id)}
                  className="group flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200/70 rounded cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{parent.name[activeEditLang] || parent.name.vi}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory("PARENT", parent.id);
                      }}
                      className="opacity-60 hover:opacity-100 p-0.5 hover:bg-rose-100 text-slate-400 hover:text-red-600 rounded transition-all cursor-pointer"
                      title={`Xóa nhánh mẹ "${parent.name.vi}" (${parentPosts.length} bài)`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">
                      {parentPosts.length}
                    </span>
                  </div>
                </div>

                {/* Sub-Categories & Posts */}
                {!isCollapsed && (
                  <div className="pl-3.5 border-l border-slate-200 space-y-1.5 mt-1">
                    {parent.subCategories.map((sub) => {
                      const totalSubPostsCount = blogData.posts.filter(
                        (p) => p.parentCategory === parent.id && p.subCategory === sub.id
                      ).length;
                      const subPosts = filteredTreePosts.filter(
                        (p) => p.parentCategory === parent.id && p.subCategory === sub.id
                      );
                      if (subPosts.length === 0 && searchTreeQuery) return null;

                      return (
                        <div key={sub.id} className="space-y-1">
                          <div className="group flex items-center justify-between text-[11px] font-semibold text-slate-500 px-2 py-0.5 uppercase tracking-wide">
                            <span className="truncate">{sub.name[activeEditLang] || sub.name.vi}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory("CHILD", sub.id, parent.id);
                                }}
                                className="opacity-60 hover:opacity-100 p-0.5 hover:bg-rose-100 text-slate-400 hover:text-red-600 rounded transition-all cursor-pointer"
                                title={`Xóa nhánh con "${sub.name.vi}" (${totalSubPostsCount} bài)`}
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-[9px] font-mono text-slate-400">
                                {totalSubPostsCount}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            {subPosts.map((post) => {
                              const isSelected = post.id === activePost?.id;
                              const postTitle = post.title[activeEditLang] || post.title.vi;

                              return (
                                <button
                                  key={post.id}
                                  type="button"
                                  onClick={() => setSelectedPostId(post.id)}
                                  className={`w-full text-left p-2 rounded transition-all cursor-pointer flex flex-col gap-0.5 ${
                                    isSelected
                                      ? "bg-[#00629B] text-white shadow-sm"
                                      : "hover:bg-slate-200/60 text-slate-800"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1.5">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          post.status === "PUBLISHED"
                                            ? isSelected
                                              ? "bg-emerald-300"
                                              : "bg-emerald-500"
                                            : isSelected
                                            ? "bg-amber-300"
                                            : "bg-amber-500"
                                        }`}
                                      />
                                      <span
                                        className={`font-mono text-[10px] font-bold truncate ${
                                          isSelected ? "text-sky-100" : "text-slate-500"
                                        }`}
                                      >
                                        {post.paperId}
                                      </span>
                                    </div>
                                    <span
                                      className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded ${
                                        isSelected
                                          ? "bg-white/20 text-white"
                                          : post.status === "PUBLISHED"
                                          ? "bg-emerald-50 text-emerald-700"
                                          : "bg-amber-50 text-amber-700"
                                      }`}
                                    >
                                      {post.status}
                                    </span>
                                  </div>
                                  <div
                                    className={`text-xs font-serif font-medium line-clamp-1 leading-snug ${
                                      isSelected ? "text-white" : "text-slate-800"
                                    }`}
                                  >
                                    {postTitle}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
          )}

          {/* Uncategorized posts (if any exist outside current categoryTree) */}
          {filteredTreePosts.filter((p) => !blogData.categoryTree.some((c) => c.id === p.parentCategory)).length > 0 && (
            <div className="space-y-1 pt-2 border-t border-slate-200">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-500 px-1">
                BÀI VIẾT CHƯA PHÂN LOẠI ({filteredTreePosts.filter((p) => !blogData.categoryTree.some((c) => c.id === p.parentCategory)).length})
              </div>
              <div className="space-y-0.5">
                {filteredTreePosts
                  .filter((p) => !blogData.categoryTree.some((c) => c.id === p.parentCategory))
                  .map((post) => {
                    const isSelected = post.id === activePost?.id;
                    const postTitle = post.title[activeEditLang] || post.title.vi;
                    return (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => setSelectedPostId(post.id)}
                        className={`w-full text-left p-2 rounded transition-all cursor-pointer flex flex-col gap-0.5 ${
                          isSelected
                            ? "bg-[#00629B] text-white shadow-sm"
                            : "hover:bg-slate-200/60 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                post.status === "PUBLISHED"
                                  ? isSelected
                                    ? "bg-emerald-300"
                                    : "bg-emerald-500"
                                  : isSelected
                                  ? "bg-amber-300"
                                  : "bg-amber-500"
                              }`}
                            />
                            <span
                              className={`font-mono text-[10px] font-bold truncate ${
                                isSelected ? "text-sky-100" : "text-slate-500"
                              }`}
                            >
                              {post.paperId}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : post.status === "PUBLISHED"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {post.status}
                          </span>
                        </div>
                        <div
                          className={`text-xs font-serif font-medium line-clamp-1 leading-snug ${
                            isSelected ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {postTitle}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Obsidian Tools & Reset */}
        <div className="p-2 border-t border-slate-200 bg-white shrink-0 space-y-1.5">
          <div className="flex items-center justify-between gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportObsidianMd}
              accept=".md,.markdown"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-1.5 px-2 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded flex items-center justify-center gap-1 font-medium cursor-pointer transition-colors"
              title="Nhập file .md từ Obsidian Vault"
            >
              <Upload className="w-3 h-3 text-slate-500" />
              <span>Nhập .MD</span>
            </button>
            <button
              type="button"
              onClick={handleExportObsidianMd}
              disabled={!activePost}
              className="flex-1 py-1.5 px-2 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded flex items-center justify-center gap-1 font-medium cursor-pointer transition-colors disabled:opacity-50"
              title="Xuất bài viết thành file .md cho Obsidian"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Xuất .MD</span>
            </button>
            <button
              type="button"
              onClick={handleDeletePost}
              disabled={!activePost}
              className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded cursor-pointer transition-colors disabled:opacity-50"
              title="Xóa bài viết đang chọn"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetAllToZero}
            className="w-full py-1 px-2 text-[10px] font-mono text-slate-500 hover:text-red-700 hover:bg-red-50 rounded border border-dashed border-slate-300 hover:border-red-300 flex items-center justify-center gap-1 cursor-pointer transition-all"
            title="Dọn sạch toàn bộ bài viết và chuyên mục mẫu (Reset về 0)"
          >
            <Trash2 className="w-3 h-3 text-slate-400 group-hover:text-red-500" />
            <span>Dọn sạch về 0 (Reset)</span>
          </button>
        </div>
      </aside>

      {!activePost ? (
        <section className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white border-r border-slate-300 min-h-0 min-w-0">
          <div className="max-w-md p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-[#00629B] mb-4">
              <FileCode className="w-6 h-6" />
            </div>
            <h3 className="font-mono text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
              Kho bài viết trống
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed font-sans">
              Chưa có bài viết nào được chọn hoặc kho lưu trữ đang trống. Hãy tạo một bài viết mới để bắt đầu soạn thảo nội dung kỹ thuật chuẩn IEEE.
            </p>
            <button
              type="button"
              onClick={handleCreateNewPost}
              className="px-4 py-2 bg-[#00629B] hover:bg-[#004f7c] text-white text-xs font-bold rounded shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bài viết mới</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* ========================================================= */}
          {/* PANE 2 (CENTER PANE): DISTRACTION-FREE EDITOR + COLLAPSIBLE METADATA DRAWER */}
          {/* ========================================================= */}
          <section className="flex-1 flex flex-col h-full bg-white border-r border-slate-300 min-w-0 min-h-0 overflow-hidden">
        {/* Top Editor Header Bar */}
        <div className="shrink-0 border-b border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between bg-slate-50 gap-2 select-none z-10">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="px-2 py-1 text-xs font-semibold border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                title="Mở cây thư mục bài viết"
              >
                <Menu className="w-3.5 h-3.5 text-[#00629B]" />
                <span className="hidden sm:inline">Cây bài viết</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="inline-flex border border-slate-300 bg-white rounded overflow-hidden shadow-xs font-sans">
              <button
                type="button"
                onClick={() => setActiveEditLang("vi")}
                className={`px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors ${
                  activeEditLang === "vi"
                    ? "bg-[#00629B] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                🇻🇳 Tiếng Việt (VI)
              </button>
              <button
                type="button"
                onClick={() => setActiveEditLang("en")}
                className={`px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors ${
                  activeEditLang === "en"
                    ? "bg-[#00629B] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                🇺🇸 English (EN)
              </button>
            </div>

            {/* Status Toggle Pill */}
            <button
              type="button"
              onClick={() =>
                updateActivePost(
                  "status",
                  activePost.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
                )
              }
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border cursor-pointer transition-colors select-none ${
                activePost.status === "PUBLISHED"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
              }`}
              title="Nhấn để đổi trạng thái Xuất bản / Bản nháp"
            >
              {activePost.status === "PUBLISHED" ? "✓ PUBLISHED" : "✎ DRAFT"}
            </button>
          </div>

          {/* Right Action Tools: Metadata Drawer Toggle & Preview Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMetaOpen(!isMetaOpen)}
              className={`px-2.5 py-1 text-xs font-medium rounded border flex items-center gap-1.5 cursor-pointer transition-colors ${
                isMetaOpen
                  ? "bg-[#00629B] text-white border-[#00629B] shadow-xs"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
              }`}
              title="Đóng / Mở ngăn thông tin tài liệu & Abstract"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>
                {isMetaOpen
                  ? "Đóng thuộc tính ▲"
                  : `Thuộc tính & Abstract (${activePost.paperId}${
                      activeSubCategory
                        ? ` • ${activeSubCategory.name[activeEditLang] || activeSubCategory.name.vi}`
                        : ""
                    }) ▼`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Ẩn / Hiện cột Xem trước IEEE Xplore"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">
                {isPreviewOpen ? "Ẩn Preview" : "Hiện Preview"}
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible Properties & Abstract Drawer */}
        {isMetaOpen && (
          <div className="bg-slate-50/95 border-b border-slate-200 p-4 space-y-3.5 max-h-[42vh] overflow-y-auto shrink-0 shadow-inner">
            {/* Row 1: Paper ID, Slug, Published Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  MÃ TÀI LIỆU (PAPER ID):
                </label>
                <input
                  type="text"
                  value={activePost.paperId || ""}
                  onChange={(e) => updateActivePost("paperId", e.target.value)}
                  placeholder="UET-FET-2026-01"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00629B]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  URL SLUG:
                </label>
                <input
                  type="text"
                  value={activePost.slug}
                  onChange={(e) => updateActivePost("slug", e.target.value)}
                  placeholder="bai-viet-slug"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00629B]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  NGÀY ĐĂNG (DATE):
                </label>
                <input
                  type="date"
                  value={activePost.publishedAt.slice(0, 10)}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateActivePost("publishedAt", new Date(e.target.value).toISOString());
                    }
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00629B]"
                />
              </div>
            </div>

            {/* Row 2: Parent Category, Sub-Category, Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  CHUYÊN MỤC GỐC (PARENT):
                </label>
                <select
                  value={activePost.parentCategory}
                  onChange={(e) => {
                    const newParent = e.target.value;
                    const parentNode = blogData.categoryTree.find((c) => c.id === newParent);
                    const firstSub = parentNode?.subCategories[0]?.id || "IC_DESIGN";
                    updateActivePost("parentCategory", newParent);
                    updateActivePost("subCategory", firstSub);
                  }}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                >
                  {blogData.categoryTree.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[activeEditLang] || c.name.vi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  NHÁNH CON (SUB-CATEGORY):
                </label>
                <select
                  value={activePost.subCategory}
                  onChange={(e) => updateActivePost("subCategory", e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                >
                  {activeParentCategory?.subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name[activeEditLang] || sub.name.vi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  TỪ KHÓA (INDEX TERMS - PHÂN CÁCH BẰNG DẤU PHẨY):
                </label>
                <input
                  type="text"
                  value={activePost.tags.map((t) => t.replace(/^#+/, "")).join(", ")}
                  onChange={(e) =>
                    updateActivePost(
                      "tags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim().replace(/^#+/, ""))
                        .filter(Boolean)
                    )
                  }
                  placeholder="RISC-V, Verilog, FPGA, Vivado"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#00629B]"
                />
              </div>
            </div>

            {/* Row 3: Abstract (Excerpt) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-[10px] font-bold uppercase text-slate-500">
                  TÓM TẮT BÀI BÁO / ABSTRACT [{activeEditLang.toUpperCase()}]:
                </label>
                <span className="font-mono text-[10px] text-slate-400">
                  Hiển thị dưới dạng Abstract chuẩn IEEE
                </span>
              </div>
              <textarea
                rows={3}
                value={activePost.excerpt[activeEditLang] || ""}
                onChange={(e) => updateActivePostBilingual("excerpt", e.target.value)}
                placeholder="Nhập phần tóm tắt (Abstract) bài báo..."
                className="w-full p-2.5 border border-slate-300 rounded bg-white text-xs font-serif leading-relaxed text-slate-900 focus:outline-none focus:border-[#00629B] resize-y"
              />
            </div>
          </div>
        )}

        {/* Pinned Title Input (Clean & Prominent) */}
        <input
          type="text"
          value={activePost.title[activeEditLang] || ""}
          onChange={(e) => updateActivePostBilingual("title", e.target.value)}
          placeholder={
            activeEditLang === "vi"
              ? "Nhập tiêu đề bài báo kỹ thuật..."
              : "Enter formal academic paper title..."
          }
          className="w-full px-4 py-3 border-b border-slate-200 bg-white font-serif text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-amber-50/20 shrink-0 transition-colors"
        />

        {/* Sticky Markdown Formatting Toolbar (Clean single icons, zero duplicate symbols) */}
        <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-1.5 shrink-0 select-none">
          <button
            type="button"
            onClick={() => insertSmartSyntax("\n## ", "\n")}
            className="px-2 py-0.5 text-xs font-bold font-serif bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded cursor-pointer transition-colors"
            title="Thêm đề mục cấp 2 (Section)"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertSmartSyntax("\n### ", "\n")}
            className="px-2 py-0.5 text-xs font-bold font-serif bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded cursor-pointer transition-colors"
            title="Thêm tiểu mục cấp 3 (Subsection)"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertSmartSyntax("**", "**")}
            className="px-2 py-0.5 text-xs font-bold font-serif bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded cursor-pointer transition-colors"
            title="In đậm (Bold)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertSmartSyntax("*", "*")}
            className="px-2 py-0.5 text-xs italic font-serif bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded cursor-pointer transition-colors"
            title="In nghiêng (Italic)"
          >
            I
          </button>

          <span className="w-[1px] h-4 bg-slate-300 mx-0.5"></span>

          {/* Code block with language selector */}
          <div className="inline-flex items-center border border-slate-300 rounded bg-white shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => insertSmartSyntax(`\n\`\`\`${codeLang}\n`, "\n```\n")}
              className="px-2 py-0.5 text-xs font-mono hover:bg-slate-100 text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
              title={`Chèn khối mã nguồn ${codeLang.toUpperCase()} rỗng`}
            >
              <Code className="w-3 h-3 text-[#00629B]" />
              <span>Code</span>
            </button>
            <select
              value={codeLang}
              onChange={(e) => setCodeLang(e.target.value)}
              className="text-[10px] font-mono bg-slate-50 text-slate-600 border-l border-slate-200 py-0.5 px-1 focus:outline-none cursor-pointer"
              title="Chọn ngôn ngữ mã nguồn"
            >
              <option value="verilog">verilog</option>
              <option value="c">c</option>
              <option value="python">python</option>
              <option value="bash">bash</option>
              <option value="cpp">cpp</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = contentTextareaRef.current;
              const hasSelection = el && el.selectionStart !== el.selectionEnd;
              if (hasSelection) {
                insertSmartSyntax("$", "$");
              } else {
                insertSmartSyntax("\n$$\n", "\n$$\n");
              }
            }}
            className="px-2 py-0.5 text-xs font-serif bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded flex items-center gap-1 cursor-pointer transition-colors"
            title="Chèn công thức toán LaTeX ($inline$ khi bôi đen, $$display$$ khi để trống)"
          >
            <Sigma className="w-3 h-3 text-indigo-600" />
            <span>LaTeX</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const el = contentTextareaRef.current;
              const current = activePost.content[activeEditLang] || "";
              let insertPos = el ? el.selectionStart : current.length;

              // Check if cursor is inside an unclosed code/mermaid block (odd number of ``` before cursor)
              const textBefore = current.substring(0, insertPos);
              const fenceMatches = textBefore.match(/```/g) || [];
              const isInsideBlock = fenceMatches.length % 2 === 1;

              let closePrefix = "";
              if (isInsideBlock && el) {
                const textAfter = current.substring(insertPos);
                const nextFenceIdx = textAfter.indexOf("```");
                if (nextFenceIdx !== -1) {
                  // Move cursor after the closing fence
                  insertPos = insertPos + nextFenceIdx + 3;
                  el.selectionStart = insertPos;
                  el.selectionEnd = insertPos;
                } else {
                  // No closing fence found; close the unclosed block
                  closePrefix = "\n```";
                }
              }

              const template = `${closePrefix}\n\n\`\`\`mermaid\ngraph LR\n  A[Tín hiệu vào] --> B[Khối xử lý]\n\`\`\`\n\n`;
              insertSmartSyntax(template, "");
            }}
            className="px-2 py-0.5 text-xs font-mono bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded flex items-center gap-1 cursor-pointer transition-colors"
            title="Chèn sơ đồ kiến trúc Mermaid"
          >
            <GitBranch className="w-3 h-3 text-emerald-600" />
            <span>Mermaid</span>
          </button>

          <span className="w-[1px] h-4 bg-slate-300 mx-0.5"></span>

          {/* Image Insertion via /api/upload */}
          <input
            type="file"
            ref={imageUploadRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => imageUploadRef.current?.click()}
            disabled={isUploadingImage}
            className="px-2 py-0.5 text-xs bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
            title="Chèn hình ảnh hoặc dán ảnh trực tiếp từ clipboard (Ctrl+V) – tự động lưu vào /uploads/blog/"
          >
            {isUploadingImage ? (
              <Loader2 className="w-3 h-3 text-sky-600 animate-spin" />
            ) : (
              <ImageIcon className="w-3 h-3 text-sky-600" />
            )}
            <span>{isUploadingImage ? "Đang tải ảnh..." : "Ảnh / Waveform"}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              insertSmartSyntax("\n| Thông số | Giá trị |\n| :--- | :--- |\n| ", " |  |\n")
            }
            className="px-2 py-0.5 text-xs bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded flex items-center gap-1 cursor-pointer transition-colors"
            title="Chèn khung bảng chuẩn IEEE 2 cột (con trỏ vào ô đầu)"
          >
            <Table className="w-3 h-3 text-amber-600" />
            <span>Bảng IEEE</span>
          </button>

          <button
            type="button"
            onClick={() => insertSmartSyntax("\n> [!NOTE]\n> ", "\n")}
            className="px-2 py-0.5 text-[11px] font-mono bg-white hover:bg-slate-200 text-sky-700 border border-slate-300 rounded cursor-pointer transition-colors"
            title="Chèn hộp ghi chú học thuật [!NOTE]"
          >
            [!NOTE]
          </button>

          <button
            type="button"
            onClick={() => insertSmartSyntax("\n> [!WARNING]\n> ", "\n")}
            className="px-2 py-0.5 text-[11px] font-mono bg-white hover:bg-slate-200 text-amber-700 border border-slate-300 rounded cursor-pointer transition-colors"
            title="Chèn hộp cảnh báo kỹ thuật [!WARNING]"
          >
            [!WARNING]
          </button>
        </div>

        {/* Full-Height Markdown Editor Textarea */}
        <textarea
          ref={contentTextareaRef}
          value={activePost.content[activeEditLang] || ""}
          onChange={(e) => updateActivePostBilingual("content", e.target.value)}
          onPaste={handlePaste}
          placeholder="Viết nội dung bài báo khoa học bằng Markdown, LaTeX ($$...$$), Mermaid... Hỗ trợ phím tắt Ctrl+V để dán trực tiếp ảnh chụp màn hình mạch số hoặc dạng sóng."
          className="flex-1 w-full p-4 font-mono text-[13.5px] leading-relaxed resize-none focus:outline-none overflow-y-auto text-slate-900 bg-white"
        />
      </section>

      {/* ========================================================= */}
      {/* PANE 3 (RIGHT PANE): INDEPENDENT IEEE LIVE PREVIEW */}
      {/* ========================================================= */}
      {isPreviewOpen && (
        <section className="flex-1 min-w-[340px] flex flex-col h-full bg-[#F4F6F9] border-l border-slate-300 min-h-0 overflow-hidden">
          {/* Top Preview Bar */}
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600 shrink-0 select-none">
            <span className="font-bold text-[#00629B] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>IEEE XPLORE PREPRINT PREVIEW</span>
            </span>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="hover:text-slate-900 p-0.5 rounded cursor-pointer"
              title="Ẩn cột Preview để mở rộng khung soạn thảo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-4">
            <div className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 rounded-sm">
              {/* Top Preprint Identifier */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-2 mb-4 border-b border-slate-100">
                <span className="font-bold text-[#00629B]">
                  IEEE / VNU-UET RESEARCH REPOSITORY // PREPRINT
                </span>
                <span className="bg-slate-100 px-2 py-0.5 border border-slate-200 font-bold text-slate-800 rounded">
                  {activePost.paperId}
                </span>
              </div>

              {/* Title in Serif */}
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 text-center leading-snug mb-3">
                {activePost.title[activeEditLang] || activePost.title.vi || "Chưa có tiêu đề bài viết"}
              </h1>

              {/* Author Affiliation */}
              <div className="text-center font-serif py-2 border-t border-b border-slate-100 my-3">
                <div className="text-sm font-bold text-slate-900">
                  Nguyễn Quang Thắng (Jev Kayden)
                </div>
                <div className="text-xs text-slate-600 italic mt-0.5 leading-relaxed">
                  Khoa Điện tử Viễn thông (FET) — Trường Đại học Công nghệ, ĐHQGHN (VNU-UET)
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  nguyenquangthang8827@gmail.com • DOI: 10.1109/VNU-UET.{activePost.paperId}
                </div>
              </div>

              {/* Classic IEEE Double Rule Top */}
              <div className="space-y-0.5 my-4">
                <div className="h-[1.5px] bg-slate-900"></div>
                <div className="h-[0.5px] bg-slate-900"></div>
              </div>

              {/* Abstract & Index Terms (Authentic Unboxed IEEE Format) */}
              {(activePost.excerpt[activeEditLang] || activePost.excerpt.vi) && (
                <div className="my-4 text-xs leading-relaxed text-slate-800 space-y-2 font-serif">
                  <p className="text-justify">
                    <span className="font-bold italic mr-1.5">
                      {activeEditLang === "vi" ? "Tóm tắt—" : "Abstract—"}
                    </span>
                    <span>
                      {activePost.excerpt[activeEditLang] || activePost.excerpt.vi}
                    </span>
                  </p>

                  {activePost.tags.length > 0 && (
                    <p className="text-justify">
                      <span className="font-bold italic mr-1.5">
                        {activeEditLang === "vi" ? "Từ khóa—" : "Index Terms—"}
                      </span>
                      <span className="font-serif italic text-slate-700">
                        {activePost.tags.map((t) => t.replace(/^#+/, "")).join("; ")}.
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Classic IEEE Double Rule Bottom */}
              <div className="space-y-0.5 my-4">
                <div className="h-[0.5px] bg-slate-900"></div>
                <div className="h-[1.5px] bg-slate-900"></div>
              </div>

              {/* Rendered Markdown Content (suppressLeadingH1 prevents duplicate main title) */}
              <div className="mt-5 text-sm leading-relaxed text-justify font-sans">
                <MarkdownRenderer
                  content={
                    activePost.content[activeEditLang] ||
                    activePost.content.vi ||
                    "# Chưa có nội dung"
                  }
                  suppressLeadingH1={true}
                />
              </div>
            </div>
          </div>
        </section>
      )}
        </>
      )}

      {/* ========================================================= */}
      {/* MODAL: THÊM NHÁNH CHUYÊN MỤC MỚI (PARENT & CHILD CREATION) */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-300 p-6 w-full max-w-lg shadow-2xl rounded-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <span className="font-mono text-xs font-bold uppercase text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00629B]" />
                <span>THÊM NHÁNH CHUYÊN MỤC MỚI</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                title="Đóng modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded border border-slate-200 mb-4 font-sans text-xs">
              <button
                type="button"
                onClick={() => setCategoryModalMode("NEW_PARENT")}
                className={`py-2 px-2 rounded font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  categoryModalMode === "NEW_PARENT"
                    ? "bg-white text-[#00629B] shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Tạo Nhánh Mẹ</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoryModalMode("NEW_CHILD")}
                className={`py-2 px-2 rounded font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  categoryModalMode === "NEW_CHILD"
                    ? "bg-white text-[#00629B] shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Thêm Nhánh Con</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoryModalMode("MANAGE")}
                className={`py-2 px-2 rounded font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  categoryModalMode === "MANAGE"
                    ? "bg-white text-rose-600 shadow-2xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                <span className="truncate">Quản lý & Xóa</span>
              </button>
            </div>

            {categoryModalMode === "MANAGE" ? (
              <div className="space-y-3 font-sans">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold">💡 Điều phối an toàn:</span> Khi xóa một nhánh đang chứa bài viết, hệ thống sẽ tự động chuyển bài viết sang chuyên mục còn lại (hoặc không phân loại nếu xóa hết) và lưu ngay vào hệ thống, đảm bảo không bao giờ bị mất bài.
                </div>

                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                  {blogData.categoryTree.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded text-slate-500">
                      <FolderTree className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold">Chưa có chuyên mục nào trong hệ thống.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Chuyển sang tab &quot;Tạo Nhánh Mẹ&quot; để tạo chuyên mục đầu tiên.</p>
                    </div>
                  ) : (
                    blogData.categoryTree.map((parent) => {
                      const parentPosts = blogData.posts.filter(
                        (p) => p.parentCategory === parent.id
                      );

                      return (
                        <div
                          key={parent.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2.5"
                        >
                          {/* Parent Row */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                            <div className="flex items-center gap-2 min-w-0">
                              <Folder className="w-4 h-4 text-[#00629B] shrink-0" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {parent.name.vi}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 truncate">
                                  ID: {parent.id} • {parent.name.en}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                                {parentPosts.length} bài
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory("PARENT", parent.id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors"
                                title={`Xóa chuyên mục gốc "${parent.name.vi}"`}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                <span>Xóa nhánh mẹ</span>
                              </button>
                            </div>
                          </div>

                          {/* Child Sub-Categories List */}
                          <div className="pl-3 border-l-2 border-slate-200 space-y-1.5 pt-0.5">
                            {parent.subCategories.map((sub) => {
                              const subPosts = blogData.posts.filter(
                                (p) =>
                                  p.parentCategory === parent.id &&
                                  p.subCategory === sub.id
                              );

                              return (
                                <div
                                  key={sub.id}
                                  className="flex items-center justify-between gap-2 p-1.5 bg-white border border-slate-200 rounded text-xs"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-slate-400 font-mono">↳</span>
                                    <div className="min-w-0">
                                      <span className="font-semibold text-slate-800 truncate mr-1.5">
                                        {sub.name.vi}
                                      </span>
                                      <span className="text-[10px] font-mono text-slate-400">
                                        ({sub.id})
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] font-mono text-slate-500">
                                      {subPosts.length} bài
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteCategory("CHILD", sub.id, parent.id)
                                      }
                                      className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[11px] font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors"
                                      title={`Xóa nhánh con "${sub.name.vi}"`}
                                    >
                                      <X className="w-3 h-3 text-rose-600" />
                                      <span>Xóa nhánh con</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reset to Zero Action Card */}
                <div className="p-3 bg-rose-50 border border-rose-200 rounded flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-rose-900">Dọn sạch toàn bộ (Reset về 0)</div>
                    <div className="text-[10px] text-rose-700">Xóa vĩnh viễn toàn bộ bài viết và chuyên mục để bắt đầu mới hoàn toàn.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetAllToZero();
                      setIsCategoryModalOpen(false);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shrink-0 cursor-pointer transition-colors"
                  >
                    Xóa sạch về 0
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors"
                  >
                    ĐÓNG
                  </button>
                </div>
              </div>
            ) : (
            <form onSubmit={handleSaveCategory} className="space-y-4">
              {categoryModalMode === "NEW_PARENT" ? (
                <>
                  {/* Section A: Thông tin Nhánh Mẹ */}
                  <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
                      <Folder className="w-3.5 h-3.5 text-[#00629B]" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        PHẦN A — THÔNG TIN NHÁNH MẸ (PARENT CATEGORY)
                      </span>
                    </div>

                    <div>
                      <label className="font-mono text-[10px] font-bold uppercase text-slate-600 block mb-1">
                        TÊN NHÁNH MẸ (TIẾNG VIỆT) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newParentNameVi}
                        onChange={(e) => setNewParentNameVi(e.target.value)}
                        placeholder="VD: Hạ tầng Đám mây & AI"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] font-bold uppercase text-slate-600 block mb-1">
                        TÊN NHÁNH MẸ (TIẾNG ANH):
                      </label>
                      <input
                        type="text"
                        value={newParentNameEn}
                        onChange={(e) => setNewParentNameEn(e.target.value)}
                        placeholder="VD: Cloud Infrastructure & AI (tự động theo TV nếu trống)"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-mono text-[10px] font-bold uppercase text-slate-500">
                          MÃ ĐỊNH DANH (ID NHÁNH MẸ):
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          Tự sinh: {String(blogData.categoryTree.length + 1).padStart(2, "0")}_{toSlugId(newParentNameVi) || "CATEGORY"}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={customParentId}
                        onChange={(e) => setCustomParentId(e.target.value)}
                        placeholder={
                          newParentNameVi.trim()
                            ? `${String(blogData.categoryTree.length + 1).padStart(2, "0")}_${toSlugId(newParentNameVi)}`
                            : "Tự động tạo mã số thứ tự và tên viết hoa..."
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00629B]"
                      />
                    </div>
                  </div>

                  {/* Section B: Nhánh Con đầu tiên */}
                  <div className="space-y-3 p-3.5 bg-sky-50/60 border border-sky-200/80 rounded">
                    <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
                      <div className="flex items-center gap-1.5">
                        <FolderTree className="w-3.5 h-3.5 text-sky-700" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-800">
                          PHẦN B — TẠO KÈM NHÁNH CON ĐẦU TIÊN
                        </span>
                      </div>
                      <span className="text-[10px] font-sans text-sky-600 italic">
                        Khuyên dùng
                      </span>
                    </div>

                    <div>
                      <label className="font-mono text-[10px] font-bold uppercase text-slate-600 block mb-1">
                        TÊN NHÁNH CON (TIẾNG VIỆT):
                      </label>
                      <input
                        type="text"
                        value={newChildNameVi}
                        onChange={(e) => setNewChildNameVi(e.target.value)}
                        placeholder="VD: Kiến trúc Cloud & Bảo mật (mặc định: 'Tổng quan & Chuyên đề')"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] font-bold uppercase text-slate-600 block mb-1">
                        TÊN NHÁNH CON (TIẾNG ANH):
                      </label>
                      <input
                        type="text"
                        value={newChildNameEn}
                        onChange={(e) => setNewChildNameEn(e.target.value)}
                        placeholder="VD: Cloud Architecture & Security"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-mono text-[10px] font-bold uppercase text-slate-500">
                          MÃ NHÁNH CON (ID):
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          Tự sinh: {toSlugId(newChildNameVi) || "GENERAL"}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={customChildId}
                        onChange={(e) => setCustomChildId(e.target.value)}
                        placeholder={
                          newChildNameVi.trim()
                            ? toSlugId(newChildNameVi)
                            : "GENERAL (Mặc định)"
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00629B]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Mode: NEW_CHILD */}
                  {blogData.categoryTree.length === 0 ? (
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded text-center space-y-2.5">
                      <p className="text-xs font-bold text-amber-900">
                        Chưa có Nhánh Mẹ nào trong hệ thống
                      </p>
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        Bạn cần tạo ít nhất 1 Nhánh Mẹ (Parent Category) trước khi có thể gắn nhánh con vào. Vui lòng chuyển sang tab <strong>Tạo Nhánh Mẹ</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCategoryModalMode("NEW_PARENT")}
                        className="px-3.5 py-1.5 bg-[#00629B] text-white text-xs font-bold rounded shadow-xs cursor-pointer hover:bg-[#004e7c] transition-colors"
                      >
                        Chuyển sang Tạo Nhánh Mẹ
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded">
                      <div>
                        <label className="font-mono text-[10px] font-bold uppercase text-slate-600 block mb-1">
                          CHỌN NHÁNH MẸ (PARENT CATEGORY) *
                        </label>
                        <select
                          value={newCategoryTargetParent}
                          onChange={(e) => setNewCategoryTargetParent(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                        >
                          {blogData.categoryTree.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name.vi} ({c.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-mono text-[10px] font-bold uppercase text-slate-600 block mb-1">
                          TÊN NHÁNH CON (TIẾNG VIỆT) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newChildNameVi}
                          onChange={(e) => setNewChildNameVi(e.target.value)}
                          placeholder="VD: Xử lý Tín hiệu Số (DSP)"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] font-bold uppercase text-slate-600 block mb-1">
                          TÊN NHÁNH CON (TIẾNG ANH):
                        </label>
                        <input
                          type="text"
                          value={newChildNameEn}
                          onChange={(e) => setNewChildNameEn(e.target.value)}
                          placeholder="VD: Digital Signal Processing (DSP)"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-sans font-semibold text-slate-900 focus:outline-none focus:border-[#00629B]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-mono text-[10px] font-bold uppercase text-slate-500">
                            MÃ NHÁNH CON (ID):
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            Tự sinh: {toSlugId(newChildNameVi) || "SUB_CATEGORY"}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={customChildId}
                          onChange={(e) => setCustomChildId(e.target.value)}
                          placeholder={
                            newChildNameVi.trim()
                              ? toSlugId(newChildNameVi)
                              : "Tự động tạo mã viết hoa..."
                          }
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00629B]"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-sans text-slate-500">
                  Tự động gán bài viết hiện tại vào nhánh mới
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    disabled={isSavingCategory}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors disabled:opacity-50"
                  >
                    HỦY BỎ
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSavingCategory ||
                      (categoryModalMode === "NEW_CHILD" &&
                        blogData.categoryTree.length === 0)
                    }
                    className="px-4 py-1.5 bg-[#00629B] hover:bg-[#004e7c] text-white text-xs font-bold rounded shadow-sm cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingCategory ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>ĐANG LƯU...</span>
                      </>
                    ) : (
                      <span>XÁC NHẬN THÊM</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
