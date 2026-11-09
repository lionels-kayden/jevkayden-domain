import { NextResponse } from "next/server";
import { isPasscodeValid } from "@/lib/adminAuth";

/**
 * Server-side Admin Passcode Verification Endpoint
 * Validates provided passcode against process.env.ADMIN_PASSCODE.
 * If ADMIN_PASSCODE is set in environment (e.g. Vercel), ONLY that passcode is accepted.
 * Falls back to "2026" / "admin" only when process.env.ADMIN_PASSCODE is undefined (local dev).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const passcode = typeof body?.passcode === "string" ? body.passcode.trim() : "";

    if (!passcode) {
      return NextResponse.json(
        { ok: false, error: "VUI LÒNG NHẬP MẬT MÃ QUẢN TRỊ." },
        { status: 400 }
      );
    }

    if (!isPasscodeValid(passcode)) {
      return NextResponse.json(
        { ok: false, error: "MẬT MÃ TRUY CẬP KHÔNG CHÍNH XÁC." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Xác thực quyền quản trị thành công." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Error";
    return NextResponse.json(
      { ok: false, error: `Lỗi máy chủ xác thực: ${msg}` },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const headerPasscode = request.headers.get("x-admin-passcode") || "";
  if (!isPasscodeValid(headerPasscode)) {
    return NextResponse.json(
      { ok: false, error: "MẬT MÃ TRUY CẬP KHÔNG CHÍNH XÁC." },
      { status: 401 }
    );
  }
  return NextResponse.json(
    { ok: true, message: "Mật mã quản trị hợp lệ." },
    { status: 200 }
  );
}

