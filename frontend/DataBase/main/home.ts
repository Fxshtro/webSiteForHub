import type {
  HomeAboutContent,
  HomeAchievementSlide,
  HomeLabCardItem,
  HomeManagerItem,
  HomeStatItem,
} from "../types";

export const homeAchievementSlides: HomeAchievementSlide[] = [
  {
    description:
      "Запуск публичной версии сайта Студенческого цифрового хаба на Next.js: адаптивная вёрстка, подготовка к размещению на домене вуза.",
    date: "14.04.2026",
  },
  {
    description:
      "Запущен пилот модуля проверки рисков в договорах: 120+ документов обработаны в тестовом контуре учебной юридической клиники.",
    date: "18.01.2026",
  },
  {
    description:
      "Демо интеграций и автоматизации: выгрузка отчётов и уведомления приняты к внедрению в пилотной группе.",
    date: "05.11.2025",
  },
  {
    description:
      "Команда выиграла университетский грант на развитие правовой базы шаблонов для НКО и малого бизнеса.",
    date: "09.12.2025",
  },
];

export const homeAboutContent: HomeAboutContent = {
  title: "О ХАБЕ",
  introText: "Хаб — это экосистема студенческих лабораторий Южного Университета \"ИУБиП\"",
  missionText:
    "Мы объединяем студентов, интересующихся разработкой, дизайном и другими цифровыми направлениями, чтобы дать им возможность работать над реальными проектами, получать опыт и создавать портфолио.",
};

export const homeStats: HomeStatItem[] = [
  {
    label: "48 участников",
    icon: "/images/ui/icoHumans.svg",
    iconClassName: "absolute -z-3 -top-8.5 -left-12.5 max-md:-top-4 max-md:-left-6 max-md:w-[48px]",
  },
  {
    label: "20+ направлений",
    icon: "/images/ui/pazzle.svg",
    iconClassName: "absolute -z-3 -top-18 left-1/2 -translate-x-1/2 max-md:-top-9 max-md:w-[48px]",
  },
  {
    label: "50 активных проектов",
    icon: "/images/ui/lists.svg",
    iconClassName: "absolute -z-3 -top-15 -right-15 max-md:-top-7 max-md:-right-6 max-md:w-[48px]",
  },
  {
    label: "5 направлений развития",
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
  { name: "Legal Tech", participants: 6, project: 9, img: "labLegal.png", slug: "legal-tech" },
  { name: "ИТ-лаборатория", participants: 25, project: 14, img: "labIT.png", slug: "it-lab" },
  { name: "Inno Travel", participants: 6, project: 9, img: "labTravel.png", slug: "inno-travel" },
  { name: "Finprocess Tech", participants: 5, project: 9, img: "labFinprocess.png", slug: "finprocess-tech" },
  { name: "Psy Tech", participants: 6, project: 9, img: "labPsy.png", slug: "psy-tech" },
];

export const homeManagers: HomeManagerItem[] = [
  {
    name: "Александр Ковалёв",
    title: "Руководитель цифрового хаба",
    degree: "к.ф.н, доцент",
    phone: "+7 (988) 892-70-02",
    email: "academy_it@iubip.ru",
  },
  {
    name: "Мария Лебедева",
    title: "Координатор проектных лабораторий",
    degree: "старший преподаватель",
    phone: "+7 (988) 892-70-03",
    email: "hub_projects@iubip.ru",
  },
];
