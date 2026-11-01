import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import defaultCvData from "@/data/cvData.json";
import { CvData } from "@/types/cv";
import { validateAdminAuth } from "@/lib/adminAuth";
import { persistDataPayload } from "@/lib/serverPersistence";

const CV_DATA_PATH = path.join(process.cwd(), "src", "data", "cvData.json");

export async function GET() {
  try {
    const fileContent = (await fs.readFile(CV_DATA_PATH, "utf-8")).normalize("NFC");
    const data: CvData = JSON.parse(fileContent);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.warn("Failed to read cvData.json from disk, falling back to bundled default:", error);
    return NextResponse.json(defaultCvData, {
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

    const payload = body?.data || body?.cvData || body;
    if (!payload || !payload.personalInfo) {
      return NextResponse.json(
        { error: "Dữ liệu CV không hợp lệ: thiếu đối tượng personalInfo." },
        { status: 400 }
      );
    }

    // Attach updated timestamp
    const updatedData: CvData = {
      ...payload,
      lastUpdated: new Date().toISOString(),
    };

    const normalizedJson = JSON.stringify(updatedData, null, 2);
    const persistResult = await persistDataPayload({
      relativePath: "src/data/cvData.json",
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
    console.error("Error updating cvData.json:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Lỗi máy chủ khi cập nhật CV data: ${errMsg}` },
      { status: 500 }
    );
  }
}
