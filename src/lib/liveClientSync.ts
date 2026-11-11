"use client";

export type LiveCacheKey =
  | "jev_live_cv_data"
  | "jev_live_hub_data"
  | "jev_live_blog_data"
  | "jev_live_apps_data";

export interface LiveCacheEnvelope<T = unknown> {
  updatedAt: number;
  data: T;
}

const BROADCAST_CHANNEL_NAME = "jev_cms_sync";
const CV_COOKIE_NAME = "jev_cv_meta_sync";

export function extractDataTimestamp(data: unknown): number {
  if (!data || typeof data !== "object") return 0;
  const record = data as Record<string, unknown>;
  if (typeof record._updatedAt === "number" && !Number.isNaN(record._updatedAt)) {
    return record._updatedAt;
  }
  if (typeof record.lastUpdated === "string") {
    const parsed = Date.parse(record.lastUpdated);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function setCrossSubdomainCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  try {
    const encoded = encodeURIComponent(value);
    const hostname = window.location.hostname;
    if (hostname.endsWith("jevkayden.tech")) {
      document.cookie = `${name}=${encoded}; domain=.jevkayden.tech; path=/; max-age=2592000; SameSite=Lax`;
    }
    document.cookie = `${name}=${encoded}; path=/; max-age=2592000; SameSite=Lax`;
  } catch {
    // Ignore cookie errors
  }
}

function getCrossSubdomainCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    if (!match) return null;
    return decodeURIComponent(match.substring(name.length + 1));
  } catch {
    return null;
  }
}

/**
 * Saves live CMS data to localStorage, cross-subdomain cookie (.jevkayden.tech),
 * and broadcasts a real-time sync signal across all open tabs.
 */
export function saveLiveClientCache<T>(key: LiveCacheKey, rawData: T): T {
  const now = Date.now();
  const stampedData =
    rawData && typeof rawData === "object"
      ? ({
          ...rawData,
          _updatedAt: now,
          lastUpdated: new Date(now).toISOString(),
        } as T)
      : rawData;

  if (typeof window === "undefined") return stampedData;

  const envelope: LiveCacheEnvelope<T> = {
    updatedAt: now,
    data: stampedData,
  };

  try {
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (err) {
    console.warn(`Could not write ${key} to localStorage:`, err);
  }

  // Set root-domain sync timestamp cookie & compact CV personalInfo override for cv.jevkayden.tech
  setCrossSubdomainCookie(`${key}_ts`, String(now));
  if (
    key === "jev_live_cv_data" &&
    stampedData &&
    typeof stampedData === "object" &&
    "personalInfo" in stampedData
  ) {
    const pInfo = (stampedData as Record<string, unknown>).personalInfo;
    setCrossSubdomainCookie(
      CV_COOKIE_NAME,
      JSON.stringify({ updatedAt: now, personalInfo: pInfo })
    );
  }

  // Broadcast to any other open tabs on the same origin
  try {
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ key, updatedAt: now, data: stampedData });
      bc.close();
    }
  } catch {
    // Ignore BroadcastChannel errors
  }

  return stampedData;
}

/**
 * Reads the locally cached CMS snapshot from localStorage (and cross-subdomain cookie if applicable).
 */
export function readLiveClientCache<T>(
  key: LiveCacheKey,
  baseFallback?: T
): LiveCacheEnvelope<T> | null {
  if (typeof window === "undefined") return null;

  let localEnvelope: LiveCacheEnvelope<T> | null = null;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as LiveCacheEnvelope<T>;
      if (parsed && parsed.data && typeof parsed.updatedAt === "number") {
        localEnvelope = parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }

  // Also check cross-subdomain cookie for cv.jevkayden.tech <-> jevkayden.tech/admin/cv
  if (key === "jev_live_cv_data") {
    const cookieRaw = getCrossSubdomainCookie(CV_COOKIE_NAME);
    if (cookieRaw) {
      try {
        const cookieObj = JSON.parse(cookieRaw) as {
          updatedAt: number;
          personalInfo: Record<string, unknown>;
        };
        if (
          cookieObj &&
          typeof cookieObj.updatedAt === "number" &&
          cookieObj.personalInfo &&
          (!localEnvelope || cookieObj.updatedAt > localEnvelope.updatedAt)
        ) {
          const base = (localEnvelope?.data || baseFallback) as
            | Record<string, unknown>
            | undefined;
          if (base && typeof base === "object") {
            localEnvelope = {
              updatedAt: cookieObj.updatedAt,
              data: {
                ...base,
                personalInfo: {
                  ...(base.personalInfo as Record<string, unknown>),
                  ...cookieObj.personalInfo,
                },
                _updatedAt: cookieObj.updatedAt,
                lastUpdated: new Date(cookieObj.updatedAt).toISOString(),
              } as T,
            };
          }
        }
      } catch {
        // Ignore cookie parse error
      }
    }
  }

  return localEnvelope;
}

/**
 * Compares server response and client live cache by updatedAt timestamp,
 * always returning the freshest version and keeping localStorage in sync.
 */
export function pickFreshestData<T>(
  key: LiveCacheKey,
  serverData: T | null,
  fallbackData: T
): T {
  const localEnvelope = readLiveClientCache<T>(key, serverData || fallbackData);
  const serverTs = extractDataTimestamp(serverData);
  const localTs = localEnvelope
    ? Math.max(localEnvelope.updatedAt, extractDataTimestamp(localEnvelope.data))
    : 0;

  if (localEnvelope && localTs > serverTs) {
    return localEnvelope.data;
  }

  if (serverData) {
    if (serverTs > localTs && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            updatedAt: serverTs || Date.now(),
            data: serverData,
          })
        );
      } catch {}
    }
    return serverData;
  }

  return localEnvelope?.data || fallbackData;
}

/**
 * Fetches cache-busted API data and merges with the freshest local/cookie snapshot.
 */
export async function fetchFreshestData<T>(
  apiEndpoint: "/api/cv" | "/api/site" | "/api/blog" | "/api/apps",
  key: LiveCacheKey,
  fallbackData: T
): Promise<T> {
  try {
    const res = await fetch(`${apiEndpoint}?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        Pragma: "no-cache",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
    const serverData = res.ok ? ((await res.json()) as T) : null;
    return pickFreshestData<T>(key, serverData, fallbackData);
  } catch {
    return pickFreshestData<T>(key, null, fallbackData);
  }
}

/**
 * Subscribes to live updates from BroadcastChannel, storage events, and window focus.
 */
export function subscribeToLiveSync<T>(
  key: LiveCacheKey,
  apiEndpoint: "/api/cv" | "/api/site" | "/api/blog" | "/api/apps",
  fallbackData: T,
  onUpdate: (freshest: T) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const refresh = () => {
    const cached = readLiveClientCache<T>(key, fallbackData);
    if (cached?.data) {
      onUpdate(cached.data);
    }
    fetchFreshestData<T>(apiEndpoint, key, fallbackData).then(onUpdate);
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue) as LiveCacheEnvelope<T>;
        if (parsed?.data) onUpdate(parsed.data);
      } catch {}
    }
  };

  let bc: BroadcastChannel | null = null;
  try {
    if ("BroadcastChannel" in window) {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = (event) => {
        if (event.data?.key === key && event.data?.data) {
          onUpdate(event.data.data as T);
        }
      };
    }
  } catch {}

  window.addEventListener("storage", handleStorage);
  window.addEventListener("focus", refresh);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("focus", refresh);
    if (bc) {
      try {
        bc.close();
      } catch {}
    }
  };
}

