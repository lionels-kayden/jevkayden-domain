import { promises as fs } from "fs";
import path from "path";

export interface PersistOptions {
  relativePath: string; // e.g. "src/data/hubData.json" or "public/uploads/blog/image.png"
  content: string | Buffer;
  isBinary?: boolean;
}

export interface PersistResult {
  ok: boolean;
  mode: "LOCAL_FS" | "GITHUB_COMMIT" | "VERCEL_READONLY_SNAPSHOT";
  message: string;
  error?: string;
  commitUrl?: string;
}

/**
 * Smart Hybrid Persistence Layer:
 * - Local Development (!process.env.VERCEL): Writes directly to local disk with strict NFC normalization.
 * - Vercel Serverless with GITHUB_TOKEN & GITHUB_REPO: Commits updated files directly to GitHub via REST API.
 * - Vercel Serverless without GITHUB_TOKEN: Returns clean 200 OK with graceful snapshot message (avoids EROFS).
 */
export async function persistDataPayload({
  relativePath,
  content,
  isBinary = false,
}: PersistOptions): Promise<PersistResult> {
  const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;

  // 1. LOCAL DEVELOPMENT: Write directly to disk
  if (!isVercel) {
    try {
      const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath);
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });

      if (isBinary && Buffer.isBuffer(content)) {
        await fs.writeFile(fullPath, content);
      } else {
        const textContent =
          typeof content === "string" ? content : content.toString("utf-8");
        await fs.writeFile(fullPath, textContent.normalize("NFC"), "utf-8");
      }

      return {
        ok: true,
        mode: "LOCAL_FS",
        message: `Đã lưu thành công dữ liệu vào tệp cục bộ [${relativePath}].`,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`Error writing to local file [${relativePath}]:`, err);
      return {
        ok: false,
        mode: "LOCAL_FS",
        error: `Lỗi ghi tệp cục bộ: ${errMsg}`,
        message: `Không thể ghi tệp [${relativePath}] vào ổ đĩa.`,
      };
    }
  }

  // 2. VERCEL SERVERLESS: Check GitHub Auto-Commit credentials
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO; // e.g. "jevkayden/portfolio"
  const githubBranch = process.env.GITHUB_BRANCH || "main";

  if (githubToken && githubRepo) {
    try {
      const base64Content = Buffer.isBuffer(content)
        ? content.toString("base64")
        : Buffer.from(content, "utf-8").toString("base64");

      // Normalize relative path forward slashes for GitHub API
      const normalizedPath = relativePath.replace(/\\/g, "/");
      const apiUrl = `https://api.github.com/repos/${githubRepo}/contents/${normalizedPath}?ref=${githubBranch}`;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "JevKayden-Portfolio-Admin",
      };

      // Query existing file to get blob SHA if updating
      let existingSha: string | undefined = undefined;
      try {
        const getRes = await fetch(apiUrl, { headers, cache: "no-store" });
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          existingSha = fileInfo.sha;
        }
      } catch (getErr) {
        console.warn(`Could not fetch existing SHA for ${normalizedPath}:`, getErr);
      }

      // Execute Commit via GitHub REST API PUT
      const putRes = await fetch(
        `https://api.github.com/repos/${githubRepo}/contents/${normalizedPath}`,
        {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `content: update ${normalizedPath} via Admin Studio [Vercel Commit]`,
            content: base64Content,
            branch: githubBranch,
            ...(existingSha ? { sha: existingSha } : {}),
          }),
        }
      );

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(
          errJson.message || `GitHub API error (HTTP ${putRes.status})`
        );
      }

      const putData = await putRes.json();
      const commitHtmlUrl = putData.commit?.html_url || "";

      return {
        ok: true,
        mode: "GITHUB_COMMIT",
        message: `Đã tự động commit thay đổi vào GitHub repository [${githubRepo}] trên nhánh [${githubBranch}]. Vercel sẽ tự động triển khai bản cập nhật.`,
        commitUrl: commitHtmlUrl,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`GitHub auto-commit failed for [${relativePath}]:`, err);
      return {
        ok: false,
        mode: "GITHUB_COMMIT",
        error: `Lỗi GitHub Auto-Commit: ${errMsg}`,
        message: `Không thể đẩy tệp [${relativePath}] lên GitHub.`,
      };
    }
  }

  // 3. VERCEL SERVERLESS: Read-Only fallback (No GITHUB_TOKEN configured)
  return {
    ok: true,
    mode: "VERCEL_READONLY_SNAPSHOT",
    message:
      "Đang chạy trên Vercel Serverless (Read-only filesystem): Vui lòng soạn thảo ở localhost rồi Git Push hoặc dùng nút Tải bản Backup JSON.",
  };
}

