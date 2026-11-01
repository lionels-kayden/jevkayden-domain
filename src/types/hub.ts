export interface HubData {
  hero: {
    fullName: string;
    alias: string;
    role: { vi: string; en: string };
    subRole: { vi: string; en: string };
    faculty: { vi: string; en: string };
    location: { vi: string; en: string };
    status: { vi: string; en: string };
    bio: { vi: string; en: string };
    headlinePrefix: { vi: string; en: string };
    highlight1: { vi: string; en: string };
    headlineMid: { vi: string; en: string };
    highlight2: { vi: string; en: string };
    headlineSuffix: { vi: string; en: string };
  };
  subdomains: {
    id: "blog" | "cv" | "app";
    name: string;
    status: "ONLINE" | "STANDBY" | "MAINTENANCE";
    subdomain: string;
    description: { vi: string; en: string };
  }[];
  techMarquee: {
    name: string;
    category: string;
    tag: string;
  }[];
  pagerContact: {
    email: string;
    pagerId: string;
    channel: string;
    operatingHours: string;
    statusMessage: { vi: string; en: string };
  };
  lastUpdated: string;
}
