export type CvLanguage = "vi" | "en";

export interface CvBilingualString {
  vi: string;
  en: string;
}

export interface CvPersonalInfo {
  fullName: string;
  handle: string;
  title: CvBilingualString;
  email: string;
  phone: string;
  location: CvBilingualString;
  website: string;
  github: string;
  linkedin: string;
  summary: CvBilingualString;
  clearanceLevel?: string;
  dateOfBirth?: string;
}

export interface CvEducationItem {
  id: string;
  institution: CvBilingualString;
  faculty: CvBilingualString;
  degree: CvBilingualString;
  specialization?: CvBilingualString;
  majorDescription?: CvBilingualString;
  period: string;
  location: CvBilingualString;
  gpa: string;
  coursework: {
    vi: string[];
    en: string[];
  };
  honors?: CvBilingualString;
}

export interface CvSkillCategory {
  id: string;
  categoryName: CvBilingualString;
  iconName?: string;
  skills: string[];
}

export interface CvProjectItem {
  id: string;
  title: CvBilingualString;
  tag: string;
  role: CvBilingualString;
  period: string;
  url?: string;
  description: CvBilingualString;
  highlights: {
    vi: string[];
    en: string[];
  };
  technologies: string[];
}

export interface CvExperienceItem {
  id: string;
  title: CvBilingualString;
  organization: CvBilingualString;
  location?: CvBilingualString;
  period: string;
  role: CvBilingualString;
  description: CvBilingualString;
  highlights?: {
    vi: string[];
    en: string[];
  };
  skills?: string[];
}

export interface CvCertificationItem {
  id: string;
  name: CvBilingualString;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface CvMetricsItem {
  label: CvBilingualString;
  value: string;
  subtext: CvBilingualString;
}

export interface CvData {
  personalInfo: CvPersonalInfo;
  education: CvEducationItem[];
  skills: CvSkillCategory[];
  projects: CvProjectItem[];
  experience: CvExperienceItem[];
  certifications: CvCertificationItem[];
  keyMetrics?: CvMetricsItem[];
  lastUpdated: string;
  version: string;
}
