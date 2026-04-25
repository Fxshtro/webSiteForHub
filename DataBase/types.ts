export interface LabProject {
  title: string;
  description: string;
}

export interface LabProjectLink {
  url: string;
  label?: string;
}

export interface LabProjectRegistryItem extends LabProject {
  id: string;
  labSlug: string;
  projectIndex: number;
  memberIds: string[];
  links: LabProjectLink[];
}

export interface LabPersonProjectRef {
  projectId: string;
  projectIndex: number;
  title: string;
  roles: string[];
}

export interface LabAchievement {
  description: string;
  date: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface LabData {
  slug: string;
  name: string;
  heroImageSrc: string;
  participants: number;
  projects: LabProject[];
  achievements: LabAchievement[];
  leadership: LeadershipSlideItem[];
}

export interface HomeStatItem {
  label: string;
  icon: string;
  iconClassName: string;
}

export interface HomeLabCardItem {
  participants: number;
  project: number;
  img: string;
  slug: string;
}

export interface HomeManagerItem {
  name: string;
  title: string;
  degree: string;
  phone: string;
  email: string;
  imageSrc?: string;
}

export interface HomeAchievementSlide {
  test: string;
}

export interface HomeAboutContent {
  title: string;
  introText: string;
  missionText: string;
}

export interface LeadershipSlideItem {
  description: string;
  date: string;
}
