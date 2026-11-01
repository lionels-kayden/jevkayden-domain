import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import defaultHubData from "@/data/hubData.json";
import { HubData } from "@/types/hub";
import { validateAdminAuth } from "@/lib/adminAuth";
import { persistDataPayload } from "@/lib/serverPersistence";

const HUB_DATA_PATH = path.join(process.cwd(), "src", "data", "hubData.json");

export async function GET() {
  try {
    const fileContent = (await fs.readFile(HUB_DATA_PATH, "utf-8")).normalize("NFC");
    const data: HubData = JSON.parse(fileContent);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.warn("Failed to read hubData.json from disk, falling back to bundled default:", error);
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
        { error: "Dữ liệu Site không hợp lệ: thiếu đối tượng hero." },
        { status: 400 }
      );
    }

    // Attach updated timestamp
    const updatedData: HubData = {
      ...payload,
      lastUpdated: new Date().toISOString(),
    };

    const normalizedJson = JSON.stringify(updatedData, null, 2);
    const persistResult = await persistDataPayload({
      relativePath: "src/data/hubData.json",
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
    console.error("Error updating hubData.json via /api/site:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Lỗi máy chủ khi cập nhật Site data: ${errMsg}` },
      { status: 500 }
    );
  }
}
