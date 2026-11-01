import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Archive // Nguyễn Quang Thắng (Jev Kayden)",
  icons: {
    icon: "/blog-icon.svg",
    shortcut: "/blog-icon.svg",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

