import { NextResponse } from "next/server";
import defaultHubData from "@/data/hubData.json";
import { HubData } from "@/types/hub";
import { validateAdminAuth } from "@/lib/adminAuth";
import { readJsonData, writeJsonData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readJsonData<HubData>("site.json");
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.warn("Failed to read Hub data, falling back to bundled default:", error);
    return NextResponse.json(defaultHubData, {
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

    const payload = body?.data || body?.siteData || body?.hubData || body;
    if (!payload || !payload.hero) {
      return NextResponse.json(
        { error: "Dữ liệu Hub không hợp lệ: thiếu đối tượng hero." },
        { status: 400 }
      );
    }

    const updatedData: HubData = {
      ...payload,
      lastUpdated: new Date().toISOString(),
    };

    const persistResult = await writeJsonData(
      "site.json",
      updatedData,
      "chore(cms): update hubData.json via Admin Studio"
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
        syncedAt: updatedData.lastUpdated,
        mode: persistResult.mode,
        syncedToGithub: persistResult.syncedToGithub,
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
    console.error("Error updating hubData.json:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Lỗi máy chủ khi cập nhật Hub data: ${errMsg}` },
      { status: 500 }
    );
  }
}
