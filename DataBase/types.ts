export interface LabProject {
  title: string;
  description: string;
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
  participants: number;
  projects: LabProject[];
  achievements: LabAchievement[];
}

export interface HomeStatItem {
  label: string;
  icon: string;
  iconClassName: string;
}

export interface HomeLabCardItem {
  name: string;
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

export interface LeadershipSlideItem {
  description: string;
  date: string;
}
