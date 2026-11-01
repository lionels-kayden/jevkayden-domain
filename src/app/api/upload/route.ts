import { NextResponse } from "next/server";
import { validateAdminAuth } from "@/lib/adminAuth";
import { persistDataPayload } from "@/lib/serverPersistence";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Upload API is active" });
}

export async function POST(request: Request) {
  try {
    // Validate Admin Authentication
    const auth = validateAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || "Truy cập bị từ chối." },
        { status: 401 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    let buffer: Buffer;
    let originalName = "figure.png";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file || !(file instanceof Blob)) {
        return NextResponse.json(
          { error: "Không tìm thấy file tải lên." },
          { status: 400 }
        );
      }
      originalName = (file as File).name || "figure.png";
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const body = await request.json().catch(() => ({}));
      const { filename, base64Data } = body;
      if (!base64Data) {
        return NextResponse.json(
          { error: "Dữ liệu ảnh base64 không hợp lệ." },
          { status: 400 }
        );
      }
      originalName = filename || "figure.png";
      // Strip base64 header if present (e.g. data:image/png;base64,...)
      const cleanedBase64 = base64Data.replace(
        /^data:image\/[a-zA-Z+]+;base64,/,
        ""
      );
      buffer = Buffer.from(cleanedBase64, "base64");
    }

    // Sanitize extension
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
    let ext = extMatch ? extMatch[1].toLowerCase() : "png";
    if (!["png", "jpg", "jpeg", "webp", "svg", "gif"].includes(ext)) {
      ext = "png";
    }

    const rawBaseName = originalName.replace(/\.[^/.]+$/, "");
    const cleanCaption =
      rawBaseName.replace(/[_-]+/g, " ").trim() || "Figure";

    const safeBaseName =
      rawBaseName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "figure";

    const timestamp = Date.now();
    const safeFilename = `${timestamp}-${safeBaseName}.${ext}`;
    const relativeUploadPath = `public/uploads/blog/${safeFilename}`;

    const persistResult = await persistDataPayload({
      relativePath: relativeUploadPath,
      content: buffer,
      isBinary: true,
    });

    if (!persistResult.ok && persistResult.error) {
      return NextResponse.json(
        { error: persistResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: `/uploads/blog/${safeFilename}`,
      caption: cleanCaption,
      mode: persistResult.mode,
      message: persistResult.message,
      commitUrl: persistResult.commitUrl,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Lỗi tải lên hình ảnh: ${errMsg}` },
      { status: 500 }
    );
  }
}
