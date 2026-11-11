export type Language = "en" | "vi";

export interface BilingualString {
  en: string;
  vi: string;
}

export interface SubdomainNode {
  id: "blog" | "cv" | "app";
  subdomain: string;
  name: BilingualString;
  status: "ONLINE" | "STANDBY" | "MAINTENANCE";
  badge: BilingualString;
  tech: string;
  category: BilingualString;
  tagline: BilingualString;
  description: BilingualString;
  subHeaderBanner: BilingualString;
  url: string;
  fallbackUrl: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  port: string;
  pingMs: number;
}

export interface ProfileInfo {
  fullName: string;
  displayAlias: string;
  handle: string;
  email: string;
  role: BilingualString;
  subRole: BilingualString;
  faculty: BilingualString;
  location: BilingualString;
  status: BilingualString;
  bio: BilingualString;
  headlinePrefix: BilingualString;
  highlight1: BilingualString;
  headlineMid: BilingualString;
  highlight2: BilingualString;
  headlineSuffix: BilingualString;
  kernelVersion: string;
  buildHash: string;
  securityClearance: string;
  specialties: string[];
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  handle: string;
  icon: string;
  primary?: boolean;
}

export interface TechItem {
  name: string;
  category: "HARDWARE" | "EMBEDDED" | "IOT" | "CIRCUIT" | "DEVOPS" | "BACKEND" | "WEB";
  tag: string;
}

export interface SiteConfig {
  baseDomain: string;
  vercelFallbackDomain: string;
  protocol: string;
  profile: ProfileInfo;
  subdomains: SubdomainNode[];
  techStack: TechItem[];
  socials: SocialLink[];
  systemMetrics: {
    os: string;
    nodeEnv: string;
    protocolVersion: string;
    baudRate: string;
    activeNodesCount: number;
    totalNodesCount: number;
  };
  uiText: {
    sysOnline: BilingualString;
    routingProd: BilingualString;
    routingSandbox: BilingualString;
    exploreSubdomains: BilingualString;
    dossierCv: BilingualString;
    transmitPing: BilingualString;
    ioStream: BilingualString;
    busTitle: BilingualString;
    busSubtitle: BilingualString;
    targetHostname: BilingualString;
    techStackLabel: BilingualString;
    mountNode: BilingualString;
    nodeStandby: BilingualString;
    modalTitle: BilingualString;
    modalHazard: BilingualString;
    modalNoticeTitle: BilingualString;
    modalNoticeDesc: BilingualString;
    modalBuildLogTitle: BilingualString;
    modalAckBtn: BilingualString;
    pagerUnitTitle: BilingualString;
    pagerMsg: BilingualString;
    pagerReadyDeploy: BilingualString;
    copyEmailBtn: BilingualString;
    copiedSuccessBtn: BilingualString;
    openClientBtn: BilingualString;
    returnToRoot: BilingualString;
    directHostJump: BilingualString;
    rightsReserved: BilingualString;
    unconfiguredLinkToast: BilingualString;
  };
}

export const siteConfig: SiteConfig = {
  baseDomain: "jevkayden.tech",
  vercelFallbackDomain: "jevkayden-hub.vercel.app",
  protocol: "https://",

  profile: {
    fullName: "Nguyễn Quang Thắng",
    displayAlias: "Nguyễn Quang Thắng // Jev Kayden",
    handle: "jevkayden",
    email: "nguyenquangthang8827@gmail.com",
    role: {
      en: "IC DESIGN // IOT SYSTEMS ENGINEER",
      vi: "KỸ SƯ THIẾT KẾ VI MẠCH // HỆ THỐNG IOT",
    },
    subRole: {
      en: "Electronics & Telecommunications Engineering",
      vi: "Kỹ thuật Điện tử & Viễn thông",
    },
    faculty: {
      en: "Electronics & Telecommunications",
      vi: "Khoa Điện tử Viễn thông",
    },
    location: {
      en: "Hanoi, VN [UTC+7:00]",
      vi: "Hà Nội, VN [UTC+7:00]",
    },
    status: {
      en: "ACTIVE BUILDER",
      vi: "ĐANG HOẠT ĐỘNG",
    },
    headlinePrefix: {
      en: "ARCHITECTING ",
      vi: "THIẾT KẾ ",
    },
    highlight1: {
      en: "SILICON CHIPS",
      vi: "VI MẠCH BÁN DẪN",
    },
    headlineMid: {
      en: " & CONNECTED ",
      vi: " & HỆ THỐNG NHÚNG ",
    },
    highlight2: {
      en: "IOT SYSTEMS",
      vi: "IOT",
    },
    headlineSuffix: {
      en: ".",
      vi: ".",
    },
    bio: {
      en: "Specializing in digital/analog IC design, embedded firmware architecture, and scalable IoT hardware-software ecosystems. Bridging physical electronics, silicon logic, and modern web automation.",
      vi: "Chuyên sâu về thiết kế vi mạch (IC Design), kiến trúc hệ thống nhúng và hệ sinh thái phần cứng - phần mềm IoT. Kết nối mạch điện tử vật lý, logic bán dẫn với các công cụ tự động hóa hiện đại.",
    },
    kernelVersion: "v4.19-RT-TACTILE",
    buildHash: "0x7F2A_SILICON",
    securityClearance: "LEVEL-4 ARCHITECT",
    specialties: [
      "Verilog / VHDL & ASIC Synthesis",
      "Embedded C / C++ & FreeRTOS",
      "ESP32 / STM32 / MQTT Telemetry",
      "Circuit Analysis & High-Speed PCB",
      "Next.js / TypeScript & FastAPI Automation",
    ],
  },

  subdomains: [
    {
      id: "blog",
      subdomain: "blog.jevkayden.tech",
      name: {
        en: "TECHNICAL LOGS & DIGITAL GARDEN",
        vi: "SỔ TAY KỸ THUẬT & VƯỜN TRI THỨC",
      },
      status: "ONLINE",
      badge: {
        en: "ACTIVE // 200 OK",
        vi: "HOẠT ĐỘNG // 200 OK",
      },
      tech: "Obsidian + Quartz // Static Engine",
      category: {
        en: "KNOWLEDGE BASE",
        vi: "KHO TRI THỨC",
      },
      tagline: {
        en: "Deep dives on IC design, electronics, embedded systems, Linux & system architecture.",
        vi: "Ghi chú chuyên sâu về thiết kế vi mạch, điện tử bán dẫn, hệ thống nhúng và Linux.",
      },
      description: {
        en: "Markdown-driven digital garden containing technical post-mortems, Verilog/VHDL schematics, circuit blueprints, and electronics research notes.",
        vi: "Không gian tri thức số cá nhân lưu trữ các bài phân tích kỹ thuật, sơ đồ Verilog/VHDL, kiến trúc mạch điện tử và tài liệu nghiên cứu.",
      },
      subHeaderBanner: {
        en: "STATUS: VERIFIED // PRODUCTION READY",
        vi: "TRẠNG THÁI: ĐÃ KÍCH HOẠT // SẴN SÀNG",
      },
      url: "https://blog.jevkayden.tech",
      fallbackUrl: "/blog",
      accentColor: "#FBBF24", // Neo-Brutalist Amber / Yellow
      borderColor: "#000000",
      badgeBg: "#FEF3C7",
      badgeText: "#92400E",
      iconName: "BookOpen",
      port: "PORT :443 [HTTPS]",
      pingMs: 14,
    },
    {
      id: "cv",
      subdomain: "cv.jevkayden.tech",
      name: {
        en: "CURRICULUM VITAE // DOSSIER",
        vi: "HỒ SƠ NĂNG LỰC & DỰ ÁN",
      },
      status: "ONLINE",
      badge: {
        en: "READY // VERIFIED",
        vi: "SẴN SÀNG // XÁC THỰC",
      },
      tech: "React / Interactive Print Engine",
      category: {
        en: "CAREER & LAB",
        vi: "SỰ NGHIỆP & LAB",
      },
      tagline: {
        en: "Academic milestones in Electronics & Telecommunications, verified engineering skills & lab projects.",
        vi: "Dấu mốc học tập ngành Điện tử Viễn thông, kỹ năng kỹ thuật và các dự án phòng lab.",
      },
      description: {
        en: "An interactive, print-optimized terminal resume. Outlines academic research in IC design, FPGA/MCU implementations, PCB fabrication, and engineering capabilities.",
        vi: "Bản lý lịch tương tác chuẩn in ấn. Tổng hợp các đề tài nghiên cứu vi mạch, thiết kế FPGA/MCU, chế tạo mạch PCB và năng lực chuyên môn.",
      },
      subHeaderBanner: {
        en: "DOSSIER VERIFIED // PUBLIC ACCESS",
        vi: "HỒ SƠ ĐÃ XÁC THỰC // CÔNG KHAI",
      },
      url: "https://cv.jevkayden.tech",
      fallbackUrl: "/cv",
      accentColor: "#34D399", // Neo-Brutalist Emerald / Green
      borderColor: "#000000",
      badgeBg: "#D1FAE5",
      badgeText: "#065F46",
      iconName: "FileText",
      port: "PORT :8080 [PUBLIC]",
      pingMs: 19,
    },
    {
      id: "app",
      subdomain: "app.jevkayden.tech",
      name: {
        en: "L3 ENGINEERING BLADES & APP MATRIX",
        vi: "MA TRẬN ỨNG DỤNG KỸ THUẬT & IOT LAB",
      },
      status: "ONLINE",
      badge: {
        en: "ACTIVE // 6 BLADES",
        vi: "HOẠT ĐỘNG // 6 NODE",
      },
      tech: "Next.js + WebAssembly / L3 Blade Rack",
      category: {
        en: "LABORATORY // APPS",
        vi: "ỨNG DỤNG // LAB",
      },
      tagline: {
        en: "6 specialized engineering web apps: IoT Telemetry, RISC-V ALU, LabOps AI, PCB Calc, VNU-UET & QMK.",
        vi: "6 ứng dụng kỹ thuật chuyên biệt: Viễn trắc IoT, Mô phỏng RISC-V ALU, LabOps AI, Mạch PCB, VNU-UET & QMK.",
      },
      description: {
        en: "L3 Horizontal Server Blade rack hosting 6 child subdomains (iot, alu, bot, pcb, uet, keeb) with IEEE datasheet specifications and 4 switchable themes.",
        vi: "Hệ thống L3 Horizontal Server Blade vận hành 6 ứng dụng tên miền con (iot, alu, bot, pcb, uet, keeb) chuẩn bảng thông số IEEE Datasheet.",
      },
      subHeaderBanner: {
        en: "STATUS: ONLINE // 6 BLADES ACTIVE",
        vi: "TRẠNG THÁI: TRỰC TUYẾN // 6 BLADE HOẠT ĐỘNG",
      },
      url: "https://app.jevkayden.tech",
      fallbackUrl: "/app",
      accentColor: "#A78BFA", // Neo-Brutalist Purple
      borderColor: "#000000",
      badgeBg: "#EDE9FE",
      badgeText: "#5B21B6",
      iconName: "Cpu",
      port: "PORT :3000 [L3-RACK]",
      pingMs: 12,
    },
  ],

  techStack: [
    { name: "Verilog & VHDL", category: "HARDWARE", tag: "IC_DESIGN" },
    { name: "C / C++ & RTOS", category: "EMBEDDED", tag: "FIRMWARE" },
    { name: "ESP32 & STM32", category: "IOT", tag: "HARDWARE_SOC" },
    { name: "MQTT & TCP/IP", category: "IOT", tag: "TELEMETRY" },
    { name: "PCB & Circuit Analysis", category: "CIRCUIT", tag: "HARDWARE_PCB" },
    { name: "Linux & Bash", category: "DEVOPS", tag: "POSIX_KERNEL" },
    { name: "Python & FastAPI", category: "BACKEND", tag: "AUTOMATION" },
    { name: "Next.js & TypeScript", category: "WEB", tag: "TACTILE_HUB" },
  ],

  socials: [
    {
      platform: "GitHub",
      label: "SOURCE_CODE // @jevkayden",
      url: "#",
      handle: "github.com/jevkayden",
      icon: "Github",
      primary: true,
    },
    {
      platform: "LinkedIn",
      label: "NETWORK // Nguyễn Quang Thắng",
      url: "#",
      handle: "in/nguyenquangthang",
      icon: "Linkedin",
      primary: true,
    },
    {
      platform: "Facebook / Zalo",
      label: "COMMUNITY // Thang Nguyen",
      url: "#",
      handle: "fb.com/thangnguyen",
      icon: "MessageCircle",
      primary: true,
    },
  ],

  systemMetrics: {
    os: "RETRO-OS KERNEL v4.19",
    nodeEnv: "PRODUCTION // VERCEL-OPTIMIZED",
    protocolVersion: "TLS 1.3 // HTTP/3",
    baudRate: "115200 BAUD",
    activeNodesCount: 3,
    totalNodesCount: 3,
  },

  uiText: {
    sysOnline: {
      en: "SYS.ONLINE",
      vi: "TRỰC TUYẾN",
    },
    routingProd: {
      en: "PROD [DOMAIN]",
      vi: "CHÍNH THỨC",
    },
    routingSandbox: {
      en: "SANDBOX",
      vi: "THỬ NGHIỆM",
    },
    exploreSubdomains: {
      en: "EXPLORE ECOSYSTEM [3]",
      vi: "KHÁM PHÁ HỆ SINH THÁI [3]",
    },
    dossierCv: {
      en: "DOSSIER // CV",
      vi: "HỒ SƠ // CV",
    },
    transmitPing: {
      en: "TRANSMIT PING ↓",
      vi: "GỬI LIÊN HỆ ↓",
    },
    ioStream: {
      en: "IO_STREAM: TTY0 / DEV / HARDWARE",
      vi: "LUỒNG DỮ LIỆU: TTY0 / PHẦN CỨNG",
    },
    busTitle: {
      en: "ECOSYSTEM & PORTAL NODES",
      vi: "HỆ SINH THÁI & CỔNG TRUY CẬP",
    },
    busSubtitle: {
      en: "MODULE 03 // SYSTEM PORTALS",
      vi: "PHÂN KHU 03 // CỔNG ĐIỀU HƯỚNG HỆ THỐNG",
    },
    targetHostname: {
      en: "TARGET ENDPOINT",
      vi: "ĐỊA CHỈ TRUY CẬP",
    },
    techStackLabel: {
      en: "TECH STACK:",
      vi: "CÔNG NGHỆ:",
    },
    mountNode: {
      en: "LAUNCH PORTAL [ENTER]",
      vi: "TRUY CẬP NGAY [ENTER]",
    },
    nodeStandby: {
      en: "IN DEVELOPMENT [VIEW LOGS]",
      vi: "ĐANG XÂY DỰNG [XEM TIẾN ĐỘ]",
    },
    modalTitle: {
      en: "SYSTEM NOTICE // LAB PORTAL UNDER CONSTRUCTION",
      vi: "THÔNG BÁO HỆ THỐNG // PHÒNG LAB ĐANG THI CÔNG",
    },
    modalHazard: {
      en: "⚠ WORK IN PROGRESS: AUTONOMOUS LAB EXPERIMENTS ⚠",
      vi: "⚠ ĐANG PHÁT TRIỂN: THÍ NGHIỆM TỰ ĐỘNG HÓA PHÒNG LAB ⚠",
    },
    modalNoticeTitle: {
      en: "SYSTEM NOTICE: Lab portal app.jevkayden.tech is currently compiling.",
      vi: "THÔNG BÁO HỆ THỐNG: Cổng thử nghiệm app.jevkayden.tech đang biên dịch dữ liệu.",
    },
    modalNoticeDesc: {
      en: "The automated experimental testbed is compiling its containerized services (FastAPI daemon, Docker compose network, and Streamlit telemetry). Access is temporarily locked to prevent race conditions.",
      vi: "Hệ thống thử nghiệm tự động đang biên dịch các dịch vụ đóng gói (FastAPI daemon, Docker container và telemetry Streamlit). Truy cập tạm thời khóa để đảm bảo an toàn phần cứng.",
    },
    modalBuildLogTitle: {
      en: "// BUILD LOG DAEMON:",
      vi: "// NHẬT KÝ BIÊN DỊCH DAEMON:",
    },
    modalAckBtn: {
      en: "ACKNOWLEDGE & RETURN",
      vi: "XÁC NHẬN & QUAY LẠI",
    },
    pagerUnitTitle: {
      en: "TACTILE TELECOMMUNICATION UNIT // MOTOROLA-9000",
      vi: "MÁY NHẮN TIN VẬT LÝ // MOTOROLA-9000",
    },
    pagerMsg: {
      en: ">> INCOMING TRANSMISSION: Nguyễn Quang Thắng (Jev Kayden) is currently open for IC Design, Embedded/IoT Engineering collaborations, research & internships.",
      vi: ">> TIN NHẮN ĐẾN: Nguyễn Quang Thắng (Jev Kayden) sẵn sàng hợp tác nghiên cứu, thực tập và dự án kỹ thuật Thiết kế Vi mạch / Hệ thống Nhúng IoT.",
    },
    pagerReadyDeploy: {
      en: "STATUS: READY TO DEPLOY // DIRECT FREQUENCY:",
      vi: "TRẠNG THÁI: SẴN SÀNG TRIỂN KHAI // KÊNH TRỰC TIẾP:",
    },
    copyEmailBtn: {
      en: "COPY TRANSMISSION EMAIL",
      vi: "SAO CHÉP EMAIL LIÊN HỆ",
    },
    copiedSuccessBtn: {
      en: "COPIED TO CLIPBOARD! [OK]",
      vi: "ĐÃ SAO CHÉP VÀO BỘ NHỚ TẠM! [OK]",
    },
    openClientBtn: {
      en: "OPEN CLIENT",
      vi: "MỞ ỨNG DỤNG MAIL",
    },
    returnToRoot: {
      en: "[↑ RETURN TO ROOT BUS]",
      vi: "[↑ TRỞ VỀ ĐẦU TRANG]",
    },
    directHostJump: {
      en: ">_ QUICK JUMP:",
      vi: ">_ ĐIỀU HƯỚNG NHANH:",
    },
    rightsReserved: {
      en: "ALL CODES ACTIVE // VERCEL DEPLOYMENT READY",
      vi: "HỆ THỐNG SẴN SÀNG // TỐI ƯU VERCEL",
    },
    unconfiguredLinkToast: {
      en: "LINK PENDING CONFIGURATION IN SITECONFIG.TS",
      vi: "LIÊN KẾT ĐANG CHỜ CẤU HÌNH TRONG SITECONFIG.TS",
    },
  },
};

/**
 * Safely resolves subdomain link target depending on routing mode and status
 */
export function resolveSubdomainUrl(
  subdomain: SubdomainNode,
  useProductionDomain: boolean = true
): string {
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  if (subdomain.id === "cv") {
    return useProductionDomain && !isLocalhost ? "https://cv.jevkayden.tech" : "/cv";
  }
  if (subdomain.id === "blog") {
    return useProductionDomain && !isLocalhost ? "https://blog.jevkayden.tech" : "/blog";
  }
  if (subdomain.id === "app") {
    return useProductionDomain && !isLocalhost ? "https://app.jevkayden.tech" : "/app";
  }
  if (useProductionDomain && !isLocalhost) {
    return subdomain.url;
  }
  return subdomain.fallbackUrl;
}

/**
 * Check if node is ready for navigation
 */
export function isNodeAvailable(subdomain: SubdomainNode): boolean {
  return subdomain.status === "ONLINE";
}
