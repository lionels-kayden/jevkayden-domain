import { NextResponse } from "next/server";
import defaultBlogData from "@/data/blogData.json";
import { BlogData, CategoryTreeNode } from "@/types/blog";
import { validateAdminAuth } from "@/lib/adminAuth";
import { readJsonData, writeJsonData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readJsonData<BlogData>("blog.json");
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.warn("Failed to read Blog data, falling back to bundled default:", error);
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

    // Read current data to ensure categoryTree is preserved if not supplied
    let currentCategoryTree: CategoryTreeNode[] = (
      defaultBlogData as unknown as BlogData
    ).categoryTree;
    try {
      const existingData = await readJsonData<BlogData>("blog.json");
      if (
        existingData &&
        Array.isArray(existingData.categoryTree) &&
        existingData.categoryTree.length > 0
      ) {
        currentCategoryTree = existingData.categoryTree;
      }
    } catch {
      // Fallback to default
    }

    const updatedData: BlogData = {
      categoryTree: Array.isArray(payload.categoryTree)
        ? payload.categoryTree
        : currentCategoryTree,
      posts: payload.posts,
      lastUpdated: new Date().toISOString(),
    };

    const persistResult = await writeJsonData(
      "blog.json",
      updatedData,
      "chore(cms): update blogData.json via Admin Studio"
    );

    if (!persistResult.ok && persistResult.error) {
      return NextResponse.json(
        { error: persistResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "OK",
        ok: true,
        syncedAt: updatedData.lastUpdated,
        categoryCount: updatedData.categoryTree.length,
        postCount: updatedData.posts.length,
        mode: persistResult.mode,
        syncedToGithub: persistResult.syncedToGithub,
        githubCommitted: persistResult.githubCommitted,
        githubError: persistResult.githubError,
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
