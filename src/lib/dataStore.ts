import { promises as fs } from "fs";
import path from "path";
import defaultHubData from "@/data/hubData.json";
import defaultCvData from "@/data/cvData.json";
import defaultBlogData from "@/data/blogData.json";

export const GITHUB_OWNER = process.env.GITHUB_OWNER || "lionels-kayden";
export const GITHUB_REPO = (
  process.env.GITHUB_REPO || "jevkayden-domain"
).replace(/^[^/]+\//, "");
export const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

export type DataStoreFilename =
  | "site.json"
  | "cv.json"
  | "blog.json"
  | "hubData.json"
  | "cvData.json"
  | "blogData.json";

export type CanonicalDataFilename =
  | "hubData.json"
  | "cvData.json"
  | "blogData.json";

const FILE_MAP: Record<DataStoreFilename, CanonicalDataFilename> = {
  "site.json": "hubData.json",
  "hubData.json": "hubData.json",
  "cv.json": "cvData.json",
  "cvData.json": "cvData.json",
  "blog.json": "blogData.json",
  "blogData.json": "blogData.json",
};

const BUNDLED_DEFAULTS: Record<CanonicalDataFilename, unknown> = {
  "hubData.json": defaultHubData,
  "cvData.json": defaultCvData,
  "blogData.json": defaultBlogData,
};

export interface CacheEntry {
  data: unknown;
  updatedAt: number;
  sha?: string;
}

declare global {
  var __JEV_DATA_CACHE__: Record<string, CacheEntry> | undefined;
}

function getMemoryCache(): Record<string, CacheEntry> {
  if (!globalThis.__JEV_DATA_CACHE__) {
    globalThis.__JEV_DATA_CACHE__ = {};
  }
  return globalThis.__JEV_DATA_CACHE__;
}

export function resolveCanonicalFilename(
  filename: DataStoreFilename
): CanonicalDataFilename {
  return FILE_MAP[filename] || "hubData.json";
}

function getTimestampFromData(data: unknown): number {
  if (data && typeof data === "object" && "lastUpdated" in data) {
    const raw = (data as { lastUpdated?: unknown }).lastUpdated;
    if (typeof raw === "string") {
      const parsed = Date.parse(raw);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return 0;
}

function getGithubHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "JevKayden-CMS-DataStore",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function readTmpCache(
  canonicalFile: CanonicalDataFilename
): Promise<CacheEntry | null> {
  try {
    const tmpPath = path.join("/tmp", canonicalFile);
    const stat = await fs.stat(tmpPath);
    const content = (await fs.readFile(tmpPath, "utf-8")).normalize("NFC");
    const parsed = JSON.parse(content);
    const dataTs = getTimestampFromData(parsed);
    return {
      data: parsed,
      updatedAt: Math.max(stat.mtimeMs, dataTs),
    };
  } catch {
    return null;
  }
}

async function writeTmpCache(
  canonicalFile: CanonicalDataFilename,
  jsonString: string
): Promise<void> {
  try {
    const tmpPath = path.join("/tmp", canonicalFile);
    await fs.writeFile(tmpPath, jsonString, "utf-8");
  } catch (err) {
    console.warn(`Could not write /tmp/${canonicalFile}:`, err);
  }
}

/**
 * Reads JSON data seamlessly on both Localhost and Vercel Production:
 * - Localhost (!process.env.VERCEL): Reads directly from src/data/{filename}.
 * - Vercel (process.env.VERCEL):
 *   1. Checks in-memory globalThis.__JEV_DATA_CACHE__ and /tmp/{filename} for instant read-after-write consistency.
 *   2. Fetches latest committed file from GitHub REST API if GITHUB_TOKEN is configured (or public repo).
 *   3. Returns whichever state is freshest (comparing timestamps), falling back to bundled src/data/{filename}.
 */
export async function readJsonData<T = unknown>(
  filename: DataStoreFilename
): Promise<T> {
  const canonicalFile = resolveCanonicalFilename(filename);
  const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
  const memCache = getMemoryCache();

  // 1. LOCALHOST: Read directly from local disk
  if (!isVercel) {
    try {
      const localPath = path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        "src",
        "data",
        canonicalFile
      );
      const raw = (await fs.readFile(localPath, "utf-8")).normalize("NFC");
      const parsed = JSON.parse(raw) as T;
      memCache[canonicalFile] = {
        data: parsed,
        updatedAt: Date.now(),
      };
      return parsed;
    } catch (err) {
      console.warn(
        `Failed to read local src/data/${canonicalFile}, using fallback:`,
        err
      );
      if (memCache[canonicalFile]?.data) {
        return memCache[canonicalFile].data as T;
      }
      return BUNDLED_DEFAULTS[canonicalFile] as T;
    }
  }

  // 2. VERCEL PRODUCTION: Check instant cache (memory + /tmp)
  let freshestCache: CacheEntry | null = memCache[canonicalFile] || null;
  const tmpEntry = await readTmpCache(canonicalFile);
  if (
    tmpEntry &&
    (!freshestCache || tmpEntry.updatedAt > freshestCache.updatedAt)
  ) {
    freshestCache = tmpEntry;
    memCache[canonicalFile] = tmpEntry;
  }

  // 3. VERCEL PRODUCTION: Fetch latest from GitHub REST API
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/data/${canonicalFile}?ref=${GITHUB_BRANCH}`;

  try {
    const res = await fetch(apiUrl, {
      headers: getGithubHeaders(githubToken),
      cache: "no-store",
    });

    if (res.ok) {
      const fileJson = await res.json();
      if (fileJson && typeof fileJson.content === "string") {
        const decoded = Buffer.from(fileJson.content, "base64")
          .toString("utf-8")
          .normalize("NFC");
        const githubData = JSON.parse(decoded);
        const githubTs = getTimestampFromData(githubData);
        const cacheTs = freshestCache
          ? Math.max(
              freshestCache.updatedAt,
              getTimestampFromData(freshestCache.data)
            )
          : 0;

        // Prefer instant cache if it was written more recently than the GitHub file
        if (freshestCache && cacheTs > githubTs && Date.now() - freshestCache.updatedAt < 60_000) {
          return freshestCache.data as T;
        }

        const entry: CacheEntry = {
          data: githubData,
          updatedAt: githubTs || Date.now(),
          sha: fileJson.sha,
        };
        memCache[canonicalFile] = entry;
        return githubData as T;
      }
    }
  } catch (err) {
    console.warn(`GitHub API read fallback for ${canonicalFile}:`, err);
  }

  // 4. Prefer instant cache if available when GitHub API is unreachable or token is absent
  if (freshestCache?.data) {
    return freshestCache.data as T;
  }

  // 5. Fallback to bundled src/data/{canonicalFile}
  try {
    const bundledPath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      "src",
      "data",
      canonicalFile
    );
    const content = (await fs.readFile(bundledPath, "utf-8")).normalize("NFC");
    return JSON.parse(content) as T;
  } catch {
    return BUNDLED_DEFAULTS[canonicalFile] as T;
  }
}

export interface WriteDataResult {
  ok: boolean;
  mode: "LOCAL_FS" | "GITHUB_COMMIT" | "VERCEL_INSTANT_CACHE";
  syncedToGithub: boolean;
  message: string;
  error?: string;
  commitUrl?: string;
}

/**
 * Writes JSON data to instant cache (/tmp + globalThis) AND persists to Local Disk or GitHub REST API:
 * 1. Updates globalThis.__JEV_DATA_CACHE__ and /tmp/{filename} (on Vercel) or src/data/{filename} (on Localhost).
 * 2. If GITHUB_TOKEN is configured, commits the updated JSON file directly to GitHub via PUT /repos/{owner}/{repo}/contents/src/data/{filename}.
 */
export async function writeJsonData(
  filename: DataStoreFilename,
  data: unknown,
  commitMessage?: string
): Promise<WriteDataResult> {
  const canonicalFile = resolveCanonicalFilename(filename);
  const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
  const jsonString = JSON.stringify(data, null, 2).normalize("NFC");
  const memCache = getMemoryCache();

  // 1. Update in-memory cache immediately for 0ms read-after-write consistency
  const previousSha = memCache[canonicalFile]?.sha;
  memCache[canonicalFile] = {
    data,
    updatedAt: Date.now(),
    sha: previousSha,
  };

  // 2. Write to /tmp on Vercel or src/data on Localhost
  let localWriteError: string | null = null;
  if (isVercel) {
    await writeTmpCache(canonicalFile, jsonString);
  } else {
    try {
      const localPath = path.join(
        /*turbopackIgnore: true*/ process.cwd(),
        "src",
        "data",
        canonicalFile
      );
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, jsonString, "utf-8");
    } catch (err: unknown) {
      localWriteError = err instanceof Error ? err.message : String(err);
      console.error(`Error writing local src/data/${canonicalFile}:`, err);
    }
  }

  // 3. If GITHUB_TOKEN is configured, commit directly to GitHub via REST API
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  if (githubToken) {
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/data/${canonicalFile}`;
    const headers = getGithubHeaders(githubToken);

    try {
      // Fetch latest SHA from GitHub branch
      let existingSha: string | undefined = previousSha;
      const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, {
        headers,
        cache: "no-store",
      });
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        if (fileInfo?.sha) {
          existingSha = fileInfo.sha;
        }
      }

      const base64Content = Buffer.from(jsonString, "utf-8").toString("base64");
      const finalCommitMsg =
        commitMessage ||
        `chore(cms): update src/data/${canonicalFile} via Admin Portal`;

      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalCommitMsg,
          content: base64Content,
          branch: GITHUB_BRANCH,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(
          errJson.message || `GitHub API HTTP ${putRes.status}`
        );
      }

      const putData = await putRes.json();
      const newSha = putData?.content?.sha;
      const commitHtmlUrl = putData?.commit?.html_url || "";

      if (newSha) {
        memCache[canonicalFile].sha = newSha;
      }

      return {
        ok: true,
        mode: "GITHUB_COMMIT",
        syncedToGithub: true,
        commitUrl: commitHtmlUrl,
        message: `✔ Đã lưu & đồng bộ trực tiếp lên GitHub Cloud (${GITHUB_OWNER}/${GITHUB_REPO}@${GITHUB_BRANCH}).`,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`GitHub commit failed for ${canonicalFile}:`, err);

      if (!isVercel && !localWriteError) {
        return {
          ok: true,
          mode: "LOCAL_FS",
          syncedToGithub: false,
          message: `✔ Đã lưu tệp cục bộ (src/data/${canonicalFile}), nhưng lỗi đẩy GitHub API: ${errMsg}`,
        };
      }

      return {
        ok: false,
        mode: "GITHUB_COMMIT",
        syncedToGithub: false,
        error: `Lỗi đồng bộ GitHub API (${GITHUB_OWNER}/${GITHUB_REPO}): ${errMsg}`,
        message: `Không thể commit src/data/${canonicalFile} lên GitHub: ${errMsg}`,
      };
    }
  }

  // 4. Localhost without GITHUB_TOKEN
  if (!isVercel) {
    if (localWriteError) {
      return {
        ok: false,
        mode: "LOCAL_FS",
        syncedToGithub: false,
        error: `Lỗi ghi tệp cục bộ: ${localWriteError}`,
        message: `Không thể ghi src/data/${canonicalFile}.`,
      };
    }
    return {
      ok: true,
      mode: "LOCAL_FS",
      syncedToGithub: false,
      message: `✔ Đã lưu trực tiếp vào tệp cục bộ [src/data/${canonicalFile}].`,
    };
  }

  // 5. Vercel without GITHUB_TOKEN -> Instant Cache active + instruction to add GITHUB_TOKEN
  return {
    ok: true,
    mode: "VERCEL_INSTANT_CACHE",
    syncedToGithub: false,
    message:
      "⚡ Đã lưu tức thời vào bộ nhớ đệm Vercel (hiển thị ngay lập tức trên web). Để lưu vĩnh viễn lên GitHub sau khi rebuild, hãy thêm biến môi trường GITHUB_TOKEN trên Vercel.",
  };
}
