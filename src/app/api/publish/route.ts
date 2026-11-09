import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { validateAdminAuth } from "@/lib/adminAuth";
import {
  readJsonData,
  writeJsonData,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_BRANCH,
} from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const [siteData, cvData, blogData] = await Promise.all([
    readJsonData("site.json"),
    readJsonData("cv.json"),
    readJsonData("blog.json"),
  ]);

  return NextResponse.json(
    {
      ok: true,
      hasGithubToken: Boolean(process.env.GITHUB_TOKEN?.trim()),
      isVercel: Boolean(process.env.VERCEL),
      repo: `${GITHUB_OWNER}/${GITHUB_REPO}@${GITHUB_BRANCH}`,
      siteData,
      cvData,
      blogData,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
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

    const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
    const hasGithubToken = Boolean(process.env.GITHUB_TOKEN?.trim());

    // 1. VERCEL PRODUCTION OR GITHUB API CLOUD SYNC
    if (isVercel || hasGithubToken) {
      const siteData = body?.siteData || body?.hubData || (await readJsonData("site.json"));
      const cvData = body?.cvData || (await readJsonData("cv.json"));
      const blogData = body?.blogData || (await readJsonData("blog.json"));

      const timestamp = new Date().toLocaleString("vi-VN");
      const siteRes = await writeJsonData(
        "site.json",
        siteData,
        `chore(cms): sync hubData.json via Admin Studio (${timestamp})`
      );
      const cvRes = await writeJsonData(
        "cv.json",
        cvData,
        `chore(cms): sync cvData.json via Admin Studio (${timestamp})`
      );
      const blogRes = await writeJsonData(
        "blog.json",
        blogData,
        `chore(cms): sync blogData.json via Admin Studio (${timestamp})`
      );

      if (!siteRes.ok || !cvRes.ok || !blogRes.ok) {
        const errText =
          siteRes.error || cvRes.error || blogRes.error || "Lỗi đồng bộ GitHub API.";
        return NextResponse.json(
          {
            ok: false,
            status: "GITHUB_API_ERROR",
            error: errText,
            message: `Lỗi đồng bộ GitHub Cloud: ${errText}`,
          },
          { status: 500 }
        );
      }

      const allCommitted = Boolean(
        siteRes.githubCommitted && cvRes.githubCommitted && blogRes.githubCommitted
      );

      if (allCommitted) {
        return NextResponse.json({
          ok: true,
          status: "PUSHED",
          syncedToGithub: true,
          githubCommitted: true,
          commitUrl: blogRes.commitUrl || cvRes.commitUrl || siteRes.commitUrl,
          message: `✓ Đã đồng bộ & commit toàn bộ dữ liệu (Hub, CV, Blog) trực tiếp lên GitHub Cloud (${GITHUB_OWNER}/${GITHUB_REPO}@${GITHUB_BRANCH})! Vercel đang tự động cập nhật bản triển khai.`,
        });
      }

      return NextResponse.json({
        ok: true,
        status: "VERCEL_INSTANT_CACHE",
        syncedToGithub: false,
        githubCommitted: false,
        githubError:
          siteRes.githubError || cvRes.githubError || blogRes.githubError || "MISSING_GITHUB_TOKEN",
        message:
          "ĐÃ LƯU TRÊN TRÌNH DUYỆT & BỘ ĐỆM! (Thêm GITHUB_TOKEN trên Vercel để commit vĩnh viễn lên GitHub)",
      });
    }

    // 2. LOCALHOST SHELL GIT PUSH
    let isRepo = false;
    try {
      execSync("git rev-parse --is-inside-work-tree", {
        stdio: "pipe",
        encoding: "utf-8",
      });
      isRepo = true;
    } catch {
      isRepo = false;
    }

    if (!isRepo) {
      return NextResponse.json({
        ok: false,
        status: "NO_GIT_REPO",
        message:
          "Thư mục dự án chưa khởi tạo Git repository. Vui lòng chạy 'git init' và cấu hình remote origin.",
      });
    }

    try {
      execSync("git add src/data public/uploads", {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (stageErr) {
      console.warn("Git add warning:", stageErr);
    }

    let statusOutput = "";
    try {
      statusOutput = execSync(
        "git status --porcelain src/data public/uploads",
        {
          encoding: "utf-8",
          stdio: "pipe",
        }
      );
    } catch (statusErr) {
      console.warn("Git status warning:", statusErr);
    }

    if (!statusOutput || statusOutput.trim().length === 0) {
      return NextResponse.json({
        ok: true,
        status: "UP_TO_DATE",
        syncedToGithub: true,
        message:
          "✓ Toàn bộ dữ liệu (src/data và public/uploads) đã ở trạng thái mới nhất trên Git.",
      });
    }

    const timestamp = new Date().toLocaleString("vi-VN");
    const commitMsg = `content: update portfolio & blog data via Admin Studio (${timestamp})`;
    try {
      execSync(`git commit -m "${commitMsg}"`, {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (commitErr: unknown) {
      const msg = commitErr instanceof Error ? commitErr.message : String(commitErr);
      return NextResponse.json(
        {
          ok: false,
          status: "COMMIT_FAILED",
          message: `Lỗi khi thực hiện git commit: ${msg}`,
        },
        { status: 500 }
      );
    }

    let pushOutput = "";
    try {
      pushOutput = execSync("git push origin main", {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (pushErr: unknown) {
      const msg = pushErr instanceof Error ? pushErr.message : String(pushErr);
      return NextResponse.json({
        ok: false,
        status: "PUSH_FAILED",
        message: `Đã commit cục bộ nhưng không thể git push: ${msg}.`,
      });
    }

    return NextResponse.json({
      ok: true,
      status: "PUSHED",
      syncedToGithub: true,
      message:
        "✓ Đã đồng bộ và đẩy toàn bộ dữ liệu lên GitHub thành công! Vercel đang tự động biên dịch phiên bản mới nhất.",
      output: pushOutput,
    });
  } catch (error: unknown) {
    console.error("Publish error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        error: `Lỗi hệ thống khi xuất bản: ${errMsg}`,
      },
      { status: 500 }
    );
  }
}
