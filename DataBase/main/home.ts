import type {
  HomeAboutContent,
  HomeAchievementSlide,
  HomeLabCardItem,
  HomeManagerItem,
  HomeStatItem,
} from "../types";

export const homeAchievementSlides: HomeAchievementSlide[] = [
  { test: "Hello World!" },
  { test: "Hello World!2" },
  { test: "Hello Worl31421d!3" },
  { test: "Hell1o3123123 World!4" },
];

export const homeAboutContent: HomeAboutContent = {
  title: "О ХАБЕ",
  introText: "Хаб — это экосистема студенческих лабораторий Южного Университета \"ИУБиП\"",
  missionText:
    "Мы объединяем студентов, интересующихся разработкой, дизайном и другими цифровыми направлениями, чтобы дать им возможность работать над реальными проектами, получать опыт и создавать портфолио.",
};

export const homeStats: HomeStatItem[] = [
  {
    label: "67+ участников",
    icon: "/images/ui/icoHumans.svg",
    iconClassName: "absolute -z-3 -top-8.5 -left-12.5 max-md:-top-4 max-md:-left-6 max-md:w-[48px]",
  },
  {
    label: "20+ направлений",
    icon: "/images/ui/pazzle.svg",
    iconClassName: "absolute -z-3 -top-18 left-1/2 -translate-x-1/2 max-md:-top-9 max-md:w-[48px]",
  },
  {
    label: "... активных проектов",
    icon: "/images/ui/lists.svg",
    iconClassName: "absolute -z-3 -top-15 -right-15 max-md:-top-7 max-md:-right-6 max-md:w-[48px]",
  },
  {
    label: "... партнеров-работодателей",
    icon: "/images/ui/laptop.svg",
    iconClassName: "absolute -z-3 -top-10 -left-12.5 max-md:-top-5 max-md:-left-6 max-md:w-[48px]",
  },
  {
    label: "5 лабораторий",
    icon: "/images/ui/lab.svg",
    iconClassName: "absolute -z-3 -top-13 -right-13 max-md:-top-6 max-md:-right-6 max-md:w-[48px]",
  },
];

export const homeLabs: HomeLabCardItem[] = [
  { participants: 10, project: 12, img: "labLegal.png", slug: "legal-tech" },
  { participants: 24, project: 26, img: "labIT.png", slug: "it-lab" },
  { participants: 13, project: 4, img: "labTravel.png", slug: "inno-travel" },
  { participants: 6, project: 7, img: "labFinprocess.png", slug: "finprocess-tech" },
  { participants: 9, project: 1, img: "labPsy.png", slug: "psy-tech" },
];

export const homeManagers: HomeManagerItem[] = [
  {
    name: "Фамилия Имя Отчество",
    title: "Руководитель академии",
    degree: "к.ф.н, доцент",
    phone: "+7 (988) 892-70-02",
    email: "academy_it@iubip.ru",
  },
  {
    name: "Фамилия Имя Отчество",
    title: "Руководитель академии",
    degree: "к.ф.н, доцент",
    phone: "+7 (988) 892-70-02",
    email: "academy_it@iubip.ru",
  },
  
];
