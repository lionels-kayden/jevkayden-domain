/**
 * Admin Authentication & Passcode Validation Utility
 * Validates x-admin-passcode header, request body, or cookies against ADMIN_PASSCODE.
 */

export interface AdminAuthResult {
  authorized: boolean;
  error?: string;
}

/**
 * Returns the array of valid passcodes for server validation.
 * If process.env.ADMIN_PASSCODE is configured (e.g. on Vercel), ONLY that passcode is accepted.
 * Falls back to ["2026", "admin"] only when ADMIN_PASSCODE is undefined (local development).
 */
export function getValidServerPasscodes(): string[] {
  const envPasscode = process.env.ADMIN_PASSCODE?.trim();
  if (envPasscode) {
    return [envPasscode];
  }
  return ["2026", "admin"];
}

/**
 * Validates a given passcode against the server's authorized passcodes.
 */
export function isPasscodeValid(passcode: string): boolean {
  if (!passcode) return false;
  const validPasscodes = getValidServerPasscodes();
  return validPasscodes.includes(passcode.trim());
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

  if (!providedPasscode || !isPasscodeValid(providedPasscode)) {
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
  if (typeof window === "undefined") return "";
  try {
    return (
      sessionStorage.getItem("jevkayden_admin_passcode") ||
      localStorage.getItem("jevkayden_admin_passcode") ||
      ""
    );
  } catch {
    return "";
  }
}
