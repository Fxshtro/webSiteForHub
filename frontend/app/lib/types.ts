export interface HomeAchievementSlide {
  description: string;
  date: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface HomeLabCardItem {
  name: string;
  participants: number;
  project: number;
  img: string;
  slug: string;
}

export interface HomeStatItem {
  label: string;
  icon: string;
  iconClassName: string;
}

export interface HomeAboutContent {
  title: string;
  introText: string;
  missionText: string;
}

export type LeadershipSlideItem = HomeAchievementSlide;

export interface LabPersonProject {
  projectId: string;
  projectIndex: number;
  title: string;
  roles: string[];
}

export interface LabPerson {
  id: string;
  name: string;
  role: string;
  directions: string[];
  projects: LabPersonProject[];
  roles: string[];
  metaverseUrl: string;
  avatarIcon: string;
  isFavorite?: boolean;
}

export interface LabAchievement {
  description: string;
  date: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface LabProjectRegistryItem {
  id: string;
  labSlug: string;
  projectIndex: number;
  title: string;
  description: string;
  details: string;
  memberIds: string[];
  links: { url: string; label?: string }[];
}
