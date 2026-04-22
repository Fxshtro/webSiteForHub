import type { LabData, LeadershipSlideItem } from "../types";
import finprocessTechLabData from "./finprocess-tech";
import innoTravelLabData from "./inno-travel";
import itLabData from "./it-lab";
import legalTechLabData from "./legal-tech";
import psyTechLabData from "./psy-tech";

export const labsData: LabData[] = [
  legalTechLabData,
  itLabData,
  innoTravelLabData,
  finprocessTechLabData,
  psyTechLabData,
];

export const leadershipSliderItems: LeadershipSlideItem[] = [
  {
    description:
      "Руководитель лаборатории: курирование проектных команд, согласование дорожных карт и связь с академией.",
    date: "14.04.2026",
  },
  {
    description:
      "Заместитель: организация воркшопов, менторство по продуктовой разработке и контроль сроков релизов.",
    date: "10.03.2026",
  },
  {
    description:
      "Менеджер проектов: планирование спринтов, коммуникация со стейкхолдерами и ведение документации.",
    date: "02.02.2026",
  },
  {
    description:
      "Координатор: приём заявок участников, распределение нагрузки между командами и поддержка онбординга.",
    date: "18.01.2026",
  },
  {
    description:
      "Технический лидер: архитектура решений, ревью кода и поддержка качества разработки в проектных командах.",
    date: "05.01.2026",
  },
  {
    description:
      "Продуктовый аналитик: формирование метрик, анализ пользовательских сценариев и подготовка гипотез для улучшений.",
    date: "21.12.2025",
  },
  {
    description:
      "UX-исследователь: проведение интервью, синтез обратной связи и формирование рекомендаций для интерфейсов.",
    date: "10.12.2025",
  },
  {
    description:
      "Frontend-наставник: сопровождение стажёров, стандартизация компонентов и развитие дизайн-системы лаборатории.",
    date: "28.11.2025",
  },
  {
    description:
      "Backend-куратор: проектирование API, контроль интеграций и помощь командам в масштабировании сервисов.",
    date: "15.11.2025",
  },
  {
    description:
      "QA-координатор: организация тестовых прогонов, контроль регрессии и повышение стабильности релизов.",
    date: "03.11.2025",
  },
  {
    description:
      "DevOps-инженер: настройка CI/CD, мониторинг инфраструктуры и автоматизация среды разработки команд.",
    date: "22.10.2025",
  },
];

export function getLabBySlug(slug: string): LabData | undefined {
  return labsData.find((lab) => lab.slug === slug);
}

export function getAllLabSlugs(): string[] {
  return labsData.map((lab) => lab.slug);
}
