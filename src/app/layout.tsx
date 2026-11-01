import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jevkayden.tech"),
  title: {
    default: "Nguyễn Quang Thắng (Jev Kayden) | Hardware & IC Design Engineer",
    template: "%s | Nguyễn Quang Thắng (Jev Kayden)",
  },
  description:
    "Kỹ sư Thiết kế Vi mạch & Phần cứng Nhúng (Hardware & IC Design Engineer) tại VNU-UET. Chuyên sâu về kiến trúc RTL, RISC-V RV32I, mô phỏng số FPGA và hệ thống nhúng thời gian thực.",
  authors: [{ name: "Nguyễn Quang Thắng (Jev Kayden)", url: "https://jevkayden.tech" }],
  keywords: [
    "Nguyễn Quang Thắng",
    "Jev Kayden",
    "IC Design",
    "Thiết kế Vi mạch",
    "RISC-V",
    "FPGA",
    "Artix-7",
    "IoT Systems",
    "Embedded Systems",
    "Hệ thống Nhúng",
    "Verilog",
    "VHDL",
    "VNU-UET",
    "Đại học Công nghệ",
    "Neo-Brutalism",
  ],
  openGraph: {
    title: "Nguyễn Quang Thắng (Jev Kayden) // Hardware & IC Design Engineer",
    description:
      "Central command hub & hardware cartridge portal for IC Design, IoT Engineering, Technical Logs, and Dossier CV.",
    url: "https://jevkayden.tech",
    siteName: "Jev Kayden Systems Hub",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyễn Quang Thắng (Jev Kayden) // Systems Hub",
    description:
      "Hardware & IC Design Engineer specializing in RTL Architecture, RISC-V & Embedded Systems at VNU-UET.",
    creator: "@jevkayden",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f0ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${lora.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className={`${beVietnamPro.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased selection:bg-amber-300 selection:text-black min-h-screen flex flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
