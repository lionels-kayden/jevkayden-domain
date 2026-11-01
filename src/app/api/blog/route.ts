import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import defaultBlogData from "@/data/blogData.json";
import { BlogData, CategoryTreeNode } from "@/types/blog";
import { validateAdminAuth } from "@/lib/adminAuth";
import { persistDataPayload } from "@/lib/serverPersistence";

const BLOG_DATA_PATH = path.join(process.cwd(), "src", "data", "blogData.json");

export async function GET() {
  try {
    const fileContent = (await fs.readFile(BLOG_DATA_PATH, "utf-8")).normalize("NFC");
    const data: BlogData = JSON.parse(fileContent);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.warn("Failed to read blogData.json from disk, falling back to bundled default:", error);
    return NextResponse.json(defaultBlogData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    // Validate Admin Authentication
    const auth = validateAdminAuth(request, body);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Truy cập bị từ chối." },
        { status: 401 }
      );
    }

    const payload = body?.data || body?.blogData || body;
    if (!payload || !Array.isArray(payload.posts)) {
      return NextResponse.json(
        { error: "Dữ liệu Blog không hợp lệ: yêu cầu mảng posts." },
        { status: 400 }
      );
    }

    // Read current disk data to ensure categoryTree is preserved if not supplied
    let currentCategoryTree: CategoryTreeNode[] = (defaultBlogData as unknown as BlogData).categoryTree;
    try {
      const diskContent = await fs.readFile(BLOG_DATA_PATH, "utf-8");
      const diskData: BlogData = JSON.parse(diskContent.normalize("NFC"));
      if (Array.isArray(diskData.categoryTree) && diskData.categoryTree.length > 0) {
        currentCategoryTree = diskData.categoryTree;
      }
    } catch {
      // Use bundled default
    }

    // Attach updated timestamp and normalized categoryTree (allow empty array [])
    const updatedData: BlogData = {
      categoryTree: Array.isArray(payload.categoryTree)
        ? payload.categoryTree
        : currentCategoryTree,
      posts: payload.posts,
      lastUpdated: new Date().toISOString(),
    };

    const normalizedJson = JSON.stringify(updatedData, null, 2);
    const persistResult = await persistDataPayload({
      relativePath: "src/data/blogData.json",
      content: normalizedJson,
    });

    if (!persistResult.ok && persistResult.error) {
      return NextResponse.json(
        { error: persistResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "OK",
        syncedAt: updatedData.lastUpdated,
        categoryCount: updatedData.categoryTree.length,
        postCount: updatedData.posts.length,
        mode: persistResult.mode,
        message: persistResult.message,
        commitUrl: persistResult.commitUrl,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error updating blogData.json:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Lỗi máy chủ khi cập nhật Blog data: ${errMsg}` },
      { status: 500 }
    );
  }
}
