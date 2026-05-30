import { getLabBySlug } from "./index";
import { getLabProjectIdByIndex, getLabProjectIndexesByMemberId } from "./projects";

export const labPersonDirections = {
  legalDesign: "Legal Design",
  contractAnalytics: "Договорная аналитика",
  legalRisks: "Правовые риски",
  webPlatforms: "Веб-платформы",
  productDevelopment: "Продуктовая разработка",
  infrastructure: "Инфраструктура",
  digitalTourism: "Цифровой туризм",
  arNavigation: "AR-навигация",
  routeContent: "Контент маршрутов",
  financialAnalytics: "Финансовая аналитика",
  biReporting: "BI-отчётность",
  riskManagement: "Управление рисками",
  psychologicalSupport: "Психологическая поддержка",
  uxResearch: "UX-исследования",
  wellbeingMetrics: "Метрики благополучия",
} as const;

export const labPersonRoles = {
  legalTechCurator: "Куратор Legal Tech",
  legalDesignExpert: "Эксперт по Legal Design",
  projectMentor: "Наставник проектных команд",
  legalConsultant: "Правовой консультант",
  projectLawyer: "Проектный юрист",
  documentAnalyst: "Аналитик документов",
  researchLead: "Research Lead",
  legalRiskAnalyst: "Аналитик правовых рисков",
  courtPracticeResearcher: "Исследователь судебной практики",
  backendDeveloper: "Backend Developer",
  frontendDeveloper: "Frontend Developer",
  uxUiDesigner: "UX/UI Designer",
  productAnalyst: "Product Analyst",
  techLead: "Технический лидер",
  solutionArchitect: "Архитектор решений",
  developmentMentor: "Наставник разработки",
  codeReviewer: "Code Reviewer",
  uiEngineer: "UI Engineer",
  featureDeveloper: "Разработчик фич",
  devOpsEngineer: "DevOps Engineer",
  qaEngineer: "QA Engineer",
  productManager: "Product Manager",
  uiDesigner: "UI Designer",
  dataAnalyst: "Data Analyst",
  qaAutomation: "QA Automation",
  scrumMaster: "Scrum Master",
  systemsAnalyst: "Systems Analyst",
  mobileDeveloper: "Mobile Developer",
  dataEngineer: "Data Engineer",
  securityEngineer: "Security Engineer",
  uxResearcher: "UX Researcher",
  travelLead: "Руководитель направления",
  routeCurator: "Куратор маршрутов",
  partnerStrategist: "Партнёрский стратег",
  productOwner: "Product Owner",
  travelProductManager: "Travel Product Manager",
  routeScenarioWriter: "Сценарист маршрутов",
  productResearcher: "Product Researcher",
  contentEditor: "Контент-редактор",
  partnerManager: "Партнёрский менеджер",
  finprocessCurator: "Куратор Finprocess",
  kpiExpert: "Эксперт по KPI",
  financialMethodologist: "Финансовый методолог",
  riskAdvisor: "Risk Advisor",
  financialAnalyst: "Financial Analyst",
  biEngineer: "BI Engineer",
  riskAnalyst: "Risk Analyst",
  psyTechCurator: "Куратор Psy Tech",
  supportMethodologist: "Методолог поддержки",
  researchMentor: "Наставник исследований",
  contentMethodologist: "Контент-методист",
  psychologyResearcher: "Psychology Researcher",
  methodist: "Методист",
  fullstackDeveloper: "Fullstack Developer",
} as const;

type LabPersonDirectionId = keyof typeof labPersonDirections;
type LabPersonRoleId = keyof typeof labPersonRoles;

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

interface LabPersonProjectInput {
  projectIndex: number;
  roleIds: LabPersonRoleId[];
}

interface LabPersonInput {
  id: string;
  name: string;
  role: string;
  directionIds?: LabPersonDirectionId[];
  projects?: LabPersonProjectInput[];
  avatarIcon?: string;
  isFavorite?: boolean;
}

interface LabProfileDefaults {
  directionIds: LabPersonDirectionId[];
  secondaryRoleIds: [LabPersonRoleId, LabPersonRoleId];
  metaversePath: string;
  avatarIcon: string;
}

const labProfileDefaults = {
  "legal-tech": {
    directionIds: ["legalDesign", "contractAnalytics", "legalRisks"],
    secondaryRoleIds: ["legalConsultant", "documentAnalyst"],
    metaversePath: "legal-tech",
    avatarIcon: "fa-scale-balanced",
  },
  "it-lab": {
    directionIds: ["webPlatforms", "productDevelopment", "infrastructure"],
    secondaryRoleIds: ["featureDeveloper", "codeReviewer"],
    metaversePath: "it-lab",
    avatarIcon: "fa-code",
  },
  "inno-travel": {
    directionIds: ["digitalTourism", "arNavigation", "routeContent"],
    secondaryRoleIds: ["routeScenarioWriter", "productResearcher"],
    metaversePath: "inno-travel",
    avatarIcon: "fa-route",
  },
  "finprocess-tech": {
    directionIds: ["financialAnalytics", "biReporting", "riskManagement"],
    secondaryRoleIds: ["financialAnalyst", "riskAdvisor"],
    metaversePath: "finprocess-tech",
    avatarIcon: "fa-chart-line",
  },
  "psy-tech": {
    directionIds: ["psychologicalSupport", "uxResearch", "wellbeingMetrics"],
    secondaryRoleIds: ["methodist", "contentMethodologist"],
    metaversePath: "psy-tech",
    avatarIcon: "fa-brain",
  },
} satisfies Record<string, LabProfileDefaults>;

const labPeopleInputBySlug = {
  "legal-tech": [
    {
      id: "lt-1",
      name: "Анна Соколова",
      role: "Куратор Legal Tech",
      projects: [
        { projectIndex: 1, roleIds: ["legalTechCurator", "legalDesignExpert"] },
        { projectIndex: 5, roleIds: ["projectMentor", "legalConsultant"] },
      ],
      isFavorite: true,
    },
    { id: "lt-2", name: "Илья Морозов", role: "Проектный юрист" },
    {
      id: "lt-3",
      name: "Виктория Зорина",
      role: "Research Lead",
      projects: [
        { projectIndex: 3, roleIds: ["researchLead", "legalRiskAnalyst"] },
        { projectIndex: 2, roleIds: ["courtPracticeResearcher"] },
      ],
    },
    { id: "lt-4", name: "Руслан Громов", role: "Backend Developer" },
    { id: "lt-5", name: "Мария Давыдова", role: "UX/UI Designer" },
    { id: "lt-6", name: "Егор Шестаков", role: "Product Analyst" },
  ],
  "it-lab": [
    {
      id: "it-1",
      name: "Кирилл Тарасов",
      role: "Технический лидер",
      projects: [
        { projectIndex: 5, roleIds: ["techLead", "solutionArchitect"] },
        { projectIndex: 12, roleIds: ["developmentMentor", "codeReviewer"] },
      ],
      isFavorite: true,
    },
    {
      id: "it-2",
      name: "Светлана Никифорова",
      role: "Frontend Developer",
      projects: [
        { projectIndex: 0, roleIds: ["frontendDeveloper", "uiEngineer"] },
        { projectIndex: 10, roleIds: ["featureDeveloper"] },
      ],
    },
    { id: "it-3", name: "Никита Фадеев", role: "Backend Developer" },
    { id: "it-4", name: "Алексей Марченко", role: "DevOps Engineer" },
    { id: "it-5", name: "Юлия Кравцова", role: "QA Engineer" },
    { id: "it-6", name: "Олег Фомин", role: "Product Manager" },
    { id: "it-7", name: "Дарья Власова", role: "UI Designer" },
    { id: "it-8", name: "Павел Руденко", role: "Data Analyst" },
    { id: "it-9", name: "Марина Корнеева", role: "Frontend Developer" },
    { id: "it-10", name: "Георгий Виноградов", role: "Backend Developer" },
    { id: "it-11", name: "Ирина Лапшина", role: "QA Engineer" },
    { id: "it-12", name: "Тимур Жданов", role: "DevOps Engineer" },
    { id: "it-13", name: "Валерия Носова", role: "UI Designer" },
    { id: "it-14", name: "Пётр Чистов", role: "Product Analyst" },
    { id: "it-15", name: "Константин Ершов", role: "Fullstack Developer" },
    { id: "it-16", name: "Ольга Широкова", role: "Data Engineer" },
    { id: "it-17", name: "Назар Мельников", role: "Security Engineer" },
    { id: "it-18", name: "Софья Зайцева", role: "UX Researcher" },
    { id: "it-19", name: "Роман Кудряшов", role: "Backend Developer" },
    { id: "it-20", name: "Алина Самойлова", role: "Frontend Developer" },
    { id: "it-21", name: "Михаил Бондарь", role: "QA Automation" },
    { id: "it-22", name: "Елена Устинова", role: "Scrum Master" },
    { id: "it-23", name: "Денис Орлов", role: "Systems Analyst" },
    { id: "it-24", name: "Артемий Силантьев", role: "Mobile Developer" },
    { id: "it-25", name: "Виктория Николаева", role: "Product Manager" },
  ],
  "inno-travel": [
    {
      id: "tr-1",
      name: "Алина Левина",
      role: "Руководитель направления",
      projects: [
        { projectIndex: 0, roleIds: ["travelLead", "routeCurator"] },
        { projectIndex: 1, roleIds: ["partnerStrategist", "productOwner"] },
      ],
      isFavorite: true,
    },
    { id: "tr-2", name: "Максим Орехов", role: "Travel Product Manager" },
    { id: "tr-3", name: "Ирина Бурцева", role: "Контент-редактор" },
    { id: "tr-4", name: "Арсений Климов", role: "Mobile Developer" },
    { id: "tr-5", name: "Наталья Миронова", role: "Партнёрский менеджер" },
    { id: "tr-6", name: "Глеб Пономарёв", role: "UX Researcher" },
  ],
  "finprocess-tech": [
    {
      id: "fp-1",
      name: "Владимир Егоров",
      role: "Куратор Finprocess",
      projects: [
        { projectIndex: 0, roleIds: ["finprocessCurator", "kpiExpert"] },
        { projectIndex: 3, roleIds: ["financialMethodologist", "riskAdvisor"] },
      ],
      isFavorite: true,
    },
    { id: "fp-2", name: "Оксана Филимонова", role: "Financial Analyst" },
    { id: "fp-3", name: "Роман Голубев", role: "BI Engineer" },
    { id: "fp-4", name: "Полина Мельник", role: "Risk Analyst" },
    { id: "fp-5", name: "Артём Ланцов", role: "Data Engineer" },
  ],
  "psy-tech": [
    {
      id: "ps-1",
      name: "Екатерина Логинова",
      role: "Куратор Psy Tech",
      projects: [
        { projectIndex: 0, roleIds: ["psyTechCurator", "supportMethodologist"] },
        { projectIndex: 2, roleIds: ["researchMentor", "contentMethodologist"] },
      ],
      isFavorite: true,
    },
    { id: "ps-2", name: "Дмитрий Белоусов", role: "Psychology Researcher" },
    { id: "ps-3", name: "Лидия Серова", role: "UX Researcher" },
    { id: "ps-4", name: "Владислав Пак", role: "Frontend Developer" },
    { id: "ps-5", name: "Яна Рябова", role: "Методист" },
    { id: "ps-6", name: "Сергей Демидов", role: "Data Analyst" },
  ],
} satisfies Record<string, LabPersonInput[]>;

function getPersonVariant(personId: string): number {
  const numericId = Number(personId.replace(/\D/g, ""));
  return Number.isNaN(numericId) ? 1 : numericId % 10;
}

function getRoleIdByLabel(roleLabel: string): LabPersonRoleId {
  const roleEntry = Object.entries(labPersonRoles).find(([, label]) => label === roleLabel);
  return roleEntry ? (roleEntry[0] as LabPersonRoleId) : "featureDeveloper";
}

function getProjectIndex(projectsCount: number, seed: number): number {
  return projectsCount > 0 ? seed % projectsCount : 0;
}

function createDefaultProjects(person: LabPersonInput, defaults: LabProfileDefaults, labProjectsCount: number, personIndex: number): LabPersonProjectInput[] {
  const primaryRoleId = getRoleIdByLabel(person.role);
  const [secondaryRoleId, tertiaryRoleId] = defaults.secondaryRoleIds;
  const variant = getPersonVariant(person.id);
  const primaryProjectIndex = getProjectIndex(labProjectsCount, personIndex * 2);
  const secondaryProjectIndex = getProjectIndex(labProjectsCount, personIndex * 2 + 1);
  const tertiaryProjectIndex = getProjectIndex(labProjectsCount, personIndex * 2 + 2);

  if (variant === 0) {
    return [{ projectIndex: primaryProjectIndex, roleIds: [primaryRoleId, secondaryRoleId, tertiaryRoleId] }];
  }

  if (variant === 1 || variant === 2) {
    return [{ projectIndex: primaryProjectIndex, roleIds: [primaryRoleId] }];
  }

  if (variant === 7) {
    return [
      { projectIndex: primaryProjectIndex, roleIds: [primaryRoleId] },
      { projectIndex: secondaryProjectIndex, roleIds: [secondaryRoleId] },
    ];
  }

  if (variant === 8) {
    return [
      { projectIndex: primaryProjectIndex, roleIds: [primaryRoleId] },
      { projectIndex: secondaryProjectIndex, roleIds: [secondaryRoleId] },
      { projectIndex: tertiaryProjectIndex, roleIds: [tertiaryRoleId] },
    ];
  }

  if (variant === 9) {
    return [{ projectIndex: primaryProjectIndex, roleIds: [primaryRoleId, secondaryRoleId] }];
  }

  if (variant === 6) {
    return [
      { projectIndex: primaryProjectIndex, roleIds: [primaryRoleId] },
      { projectIndex: secondaryProjectIndex, roleIds: [primaryRoleId] },
      { projectIndex: tertiaryProjectIndex, roleIds: [primaryRoleId] },
    ];
  }

  return [
    { projectIndex: primaryProjectIndex, roleIds: [primaryRoleId] },
    { projectIndex: secondaryProjectIndex, roleIds: [primaryRoleId] },
  ];
}

function createLabPersonProject(project: LabPersonProjectInput, labSlug: string): LabPersonProject {
  const labData = getLabBySlug(labSlug);
  const projectTitle = labData?.projects[project.projectIndex]?.title ?? labData?.projects[0]?.title ?? "Проект лаборатории";
  const projectId = getLabProjectIdByIndex(labSlug, project.projectIndex) ?? `${labSlug}-project-${project.projectIndex}`;

  return {
    projectId,
    projectIndex: project.projectIndex,
    title: projectTitle,
    roles: project.roleIds.map((roleId) => labPersonRoles[roleId]),
  };
}

function createRegistryProjects(person: LabPersonInput, labSlug: string): LabPersonProjectInput[] {
  const primaryRoleId = getRoleIdByLabel(person.role);

  return getLabProjectIndexesByMemberId(labSlug, person.id).map((projectIndex) => ({
    projectIndex,
    roleIds: [primaryRoleId],
  }));
}

function createLabPerson(person: LabPersonInput, defaults: LabProfileDefaults, labSlug: keyof typeof labPeopleInputBySlug, personIndex: number): LabPerson {
  const labProjectsCount = getLabBySlug(labSlug)?.projects.length ?? 0;
  const registryProjects = createRegistryProjects(person, labSlug);
  const projectInputs = registryProjects.length > 0
    ? registryProjects
    : person.projects ?? createDefaultProjects(person, defaults, labProjectsCount, personIndex);
  const projects = projectInputs.map((project) => createLabPersonProject(project, labSlug));

  return {
    ...person,
    directions: (person.directionIds ?? defaults.directionIds).map((directionId) => labPersonDirections[directionId]),
    projects,
    roles: Array.from(new Set(projects.flatMap((project) => project.roles))),
    metaverseUrl: `https://hub-metaverse.example/${defaults.metaversePath}/${person.id}`,
    avatarIcon: person.avatarIcon ?? defaults.avatarIcon,
  };
}

function createLabPeople(slug: keyof typeof labPeopleInputBySlug): LabPerson[] {
  const defaults = labProfileDefaults[slug];
  return labPeopleInputBySlug[slug].map((person, personIndex) => createLabPerson(person, defaults, slug, personIndex));
}

const labPeopleBySlugData = {
  "legal-tech": createLabPeople("legal-tech"),
  "it-lab": createLabPeople("it-lab"),
  "inno-travel": createLabPeople("inno-travel"),
  "finprocess-tech": createLabPeople("finprocess-tech"),
  "psy-tech": createLabPeople("psy-tech"),
} satisfies Record<string, LabPerson[]>;

export const labPeopleBySlug: Record<string, LabPerson[]> = labPeopleBySlugData;

export function getLabPeopleBySlug(slug: string): LabPerson[] {
  return labPeopleBySlug[slug] ?? [];
}
