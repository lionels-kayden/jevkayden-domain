import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { validateAdminAuth } from "@/lib/adminAuth";

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

    // Guard: Only allow local machine to execute shell git commands
    if (process.env.VERCEL === "1" || !!process.env.VERCEL) {
      return NextResponse.json(
        {
          ok: false,
          status: "VERCEL_ENV",
          message:
            "Tính năng Git Publish trực tiếp từ shell chỉ hoạt động khi chạy trên Localhost. Trên Vercel, dữ liệu được tự động commit qua GitHub API.",
        },
        { status: 200 }
      );
    }

    // 1. Check if git repository is initialized
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
      return NextResponse.json(
        {
          ok: false,
          status: "NO_GIT_REPO",
          message:
            "Thư mục dự án chưa khởi tạo Git repository. Vui lòng mở terminal và chạy 'git init' rồi 'git remote add origin <url>' để liên kết với GitHub.",
        },
        { status: 200 }
      );
    }

    // 2. Check if git remote origin is configured
    let hasRemote = false;
    try {
      const remotes = execSync("git remote -v", {
        encoding: "utf-8",
        stdio: "pipe",
      });
      hasRemote = !!remotes && remotes.trim().length > 0;
    } catch {
      hasRemote = false;
    }

    if (!hasRemote) {
      return NextResponse.json(
        {
          ok: false,
          status: "NO_REMOTE",
          message:
            "Chưa cấu hình Git Remote. Vui lòng chạy lệnh: git remote add origin https://github.com/username/repo.git để kích hoạt tính năng tự động đẩy lên GitHub & Vercel.",
        },
        { status: 200 }
      );
    }

    // 3. Stage changes in data and uploads directories
    try {
      execSync("git add src/data public/uploads", {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (stageErr) {
      console.warn("Git add warning:", stageErr);
    }

    // 4. Check if there are staged changes
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
        message:
          "Toàn bộ dữ liệu (src/data và public/uploads) đã ở trạng thái mới nhất trên Git, không có thay đổi cần commit.",
      });
    }

    // 5. Commit changes
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

    // 6. Push to remote repository
    let pushOutput = "";
    try {
      pushOutput = execSync("git push", {
        encoding: "utf-8",
        stdio: "pipe",
      });
    } catch (pushErr: unknown) {
      const msg = pushErr instanceof Error ? pushErr.message : String(pushErr);
      return NextResponse.json(
        {
          ok: false,
          status: "PUSH_FAILED",
          message: `Đã commit thành công nhưng không thể git push: ${msg}. Vui lòng kiểm tra quyền truy cập GitHub (SSH/Personal Access Token).`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ok: true,
      status: "PUSHED",
      message:
        "✓ Đã đồng bộ và đẩy toàn bộ dữ liệu lên GitHub thành công! Vercel đang tự động biên dịch và triển khai phiên bản mới nhất.",
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

