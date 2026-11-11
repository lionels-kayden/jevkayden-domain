export type AppVisualStyle = "s1" | "s2" | "s3" | "s4";

export type AppStatus = "ONLINE" | "PRODUCTION" | "BETA" | "STANDBY";

export interface AppMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface AppBladeItem {
  id: string;
  index: string;
  icon: string;
  code: string;
  category: string;
  name: string;
  domain: string;
  url: string;
  repoUrl: string;
  status: AppStatus;
  isLive: boolean;
  version: string;
  latency: string;
  tagline: string;
  problemSolved: string;
  architecture: string[];
  features: string[];
  techStack: string[];
  metrics: AppMetric[];
}

export interface AppsData {
  portalTitle: string;
  portalSubtitle: string;
  documentCode: string;
  defaultStyle: AppVisualStyle;
  apps: AppBladeItem[];
  lastUpdated: string;
  _updatedAt?: number;
}

