import { NextResponse } from "next/server";
import defaultAppsData from "@/data/apps.json";
import { AppsData } from "@/types/apps";
import { validateAdminAuth } from "@/lib/adminAuth";
import { readJsonData, writeJsonData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readJsonData<AppsData>("apps.json");
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.warn("Failed to read apps data, falling back to bundled default:", error);
    return NextResponse.json(defaultAppsData, {
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

    const payload = body?.data || body?.appsData || body;
    if (!payload || !Array.isArray(payload.apps)) {
      return NextResponse.json(
        { error: "Dữ liệu Apps không hợp lệ: thiếu mảng apps." },
        { status: 400 }
      );
    }

    const updatedData: AppsData = {
      ...payload,
      lastUpdated: new Date().toISOString(),
    };

    const persistResult = await writeJsonData(
      "apps.json",
      updatedData,
      "chore(cms): update apps.json via Admin Studio"
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
    console.error("Error updating apps.json:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Lỗi máy chủ khi cập nhật Apps data: ${errMsg}` },
      { status: 500 }
    );
  }
}

