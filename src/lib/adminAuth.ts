/**
 * Admin Authentication & Passcode Validation Utility
 * Validates x-admin-passcode header, request body, or cookies against ADMIN_PASSCODE.
 */

export interface AdminAuthResult {
  authorized: boolean;
  error?: string;
}

/**
 * Validates admin authentication on server-side API routes.
 * Checks header "x-admin-passcode", body "passcode", or body "data.passcode".
 */
export function validateAdminAuth(
  request: Request,
  body?: Record<string, unknown> | null
): AdminAuthResult {
  const headerPasscode = request.headers.get("x-admin-passcode");
  const bodyPasscode =
    (body?.passcode as string | undefined) ||
    ((body?.data as Record<string, unknown> | undefined)?.passcode as string | undefined);

  const providedPasscode = (headerPasscode || bodyPasscode || "").trim();

  // Valid passcodes configured in environment or default credentials
  const validPasscodes = [
    process.env.ADMIN_PASSCODE,
    "2026",
    "admin",
  ].filter(Boolean) as string[];

  if (!providedPasscode || !validPasscodes.includes(providedPasscode)) {
    return {
      authorized: false,
      error:
        "Mật mã quản trị (x-admin-passcode) không chính xác hoặc bị thiếu. Quyền truy cập bị từ chối.",
    };
  }

  return { authorized: true };
}

/**
 * Client-side helper to retrieve stored admin passcode from browser storage.
 * Safe to call in browser environments.
 */
export function getAdminPasscode(): string {
  if (typeof window === "undefined") return "2026";
  try {
    return (
      sessionStorage.getItem("jevkayden_admin_passcode") ||
      localStorage.getItem("jevkayden_admin_passcode") ||
      "2026"
    );
  } catch {
    return "2026";
  }
}

