import type { LabProjectLink, LabProjectRegistryItem } from "../types";
import { getLabBySlug } from "./index";

interface LabProjectRegistryRecord {
  id: string;
  labSlug: string;
  projectIndex: number;
  memberIds: string[];
  links?: LabProjectLink[];
}

const projectRegistryRecords = [
  { id: "legal-contract-assistant", labSlug: "legal-tech", projectIndex: 0, memberIds: ["lt-1", "lt-2", "lt-4", "lt-5"] },
  { id: "legal-chat-bot", labSlug: "legal-tech", projectIndex: 1, memberIds: ["lt-2", "lt-3", "lt-6"] },
  { id: "legal-case-registry", labSlug: "legal-tech", projectIndex: 2, memberIds: ["lt-3", "lt-5"] },
  { id: "legal-risk-check", labSlug: "legal-tech", projectIndex: 3, memberIds: ["lt-1", "lt-3", "lt-4"] },
  { id: "legal-claims-builder", labSlug: "legal-tech", projectIndex: 4, memberIds: ["lt-2", "lt-5", "lt-6"] },
  { id: "legal-clinic-office", labSlug: "legal-tech", projectIndex: 5, memberIds: ["lt-1", "lt-2", "lt-6"] },
  { id: "legal-norm-updates", labSlug: "legal-tech", projectIndex: 6, memberIds: ["lt-3", "lt-4"] },
  { id: "legal-consumer-rights", labSlug: "legal-tech", projectIndex: 7, memberIds: ["lt-2", "lt-5"] },
  { id: "legal-doc-approval", labSlug: "legal-tech", projectIndex: 8, memberIds: ["lt-1", "lt-4", "lt-6"] },
  { id: "it-hub-site", labSlug: "it-lab", projectIndex: 0, memberIds: ["it-2", "it-9", "it-20", "it-25"] },
  { id: "it-hub-site-content", labSlug: "it-lab", projectIndex: 1, memberIds: ["it-6", "it-7", "it-14"] },
  { id: "it-hub-site-api", labSlug: "it-lab", projectIndex: 2, memberIds: ["it-3", "it-10", "it-15"] },
  { id: "it-hub-site-infra", labSlug: "it-lab", projectIndex: 3, memberIds: ["it-4", "it-12", "it-17"] },
  { id: "it-hub-site-quality", labSlug: "it-lab", projectIndex: 4, memberIds: ["it-5", "it-11", "it-21"] },
  { id: "it-internal-portal", labSlug: "it-lab", projectIndex: 5, memberIds: ["it-1", "it-6", "it-25"] },
  { id: "it-integrations", labSlug: "it-lab", projectIndex: 6, memberIds: ["it-3", "it-8", "it-16"] },
  { id: "it-hackathon-platform", labSlug: "it-lab", projectIndex: 7, memberIds: ["it-7", "it-18", "it-22", "it-24"] },
  { id: "it-service-monitoring", labSlug: "it-lab", projectIndex: 8, memberIds: ["it-4", "it-12", "it-17"] },
  { id: "it-media-service", labSlug: "it-lab", projectIndex: 9, memberIds: ["it-8", "it-16", "it-23"] },
  { id: "it-lab-landing-builder", labSlug: "it-lab", projectIndex: 10, memberIds: ["it-2", "it-9", "it-20"] },
  { id: "it-role-access", labSlug: "it-lab", projectIndex: 11, memberIds: ["it-1", "it-17", "it-23"] },
  { id: "it-api-gateway", labSlug: "it-lab", projectIndex: 12, memberIds: ["it-3", "it-10", "it-15"] },
  { id: "it-activity-analytics", labSlug: "it-lab", projectIndex: 13, memberIds: ["it-1", "it-8", "it-16"] },
  { id: "travel-route-builder", labSlug: "inno-travel", projectIndex: 0, memberIds: ["tr-1", "tr-2", "tr-6"] },
  { id: "travel-location-guide", labSlug: "inno-travel", projectIndex: 1, memberIds: ["tr-1", "tr-3", "tr-5"] },
  { id: "travel-slot-booking", labSlug: "inno-travel", projectIndex: 2, memberIds: ["tr-2", "tr-4", "tr-5"] },
  { id: "travel-budget-planner", labSlug: "inno-travel", projectIndex: 3, memberIds: ["tr-2", "tr-6"] },
  { id: "travel-event-map", labSlug: "inno-travel", projectIndex: 4, memberIds: ["tr-3", "tr-5", "tr-6"] },
  { id: "travel-ar-guide", labSlug: "inno-travel", projectIndex: 5, memberIds: ["tr-1", "tr-4", "tr-6"] },
  { id: "travel-service-rating", labSlug: "inno-travel", projectIndex: 6, memberIds: ["tr-2", "tr-3", "tr-5"] },
  { id: "travel-route-passport", labSlug: "inno-travel", projectIndex: 7, memberIds: ["tr-1", "tr-2", "tr-4"] },
  { id: "travel-local-guides", labSlug: "inno-travel", projectIndex: 8, memberIds: ["tr-3", "tr-5", "tr-6"] },
  { id: "fin-dashboard", labSlug: "finprocess-tech", projectIndex: 0, memberIds: ["fp-1", "fp-2", "fp-3"] },
  { id: "fin-credit-calculator", labSlug: "finprocess-tech", projectIndex: 1, memberIds: ["fp-2", "fp-4"] },
  { id: "fin-report-templates", labSlug: "finprocess-tech", projectIndex: 2, memberIds: ["fp-1", "fp-3", "fp-5"] },
  { id: "fin-cashflow-forecast", labSlug: "finprocess-tech", projectIndex: 3, memberIds: ["fp-1", "fp-2", "fp-4"] },
  { id: "fin-kpi-control", labSlug: "finprocess-tech", projectIndex: 4, memberIds: ["fp-1", "fp-3", "fp-4"] },
  { id: "fin-startup-models", labSlug: "finprocess-tech", projectIndex: 5, memberIds: ["fp-2", "fp-3", "fp-5"] },
  { id: "fin-expense-scoring", labSlug: "finprocess-tech", projectIndex: 6, memberIds: ["fp-4", "fp-5"] },
  { id: "fin-tax-navigator", labSlug: "finprocess-tech", projectIndex: 7, memberIds: ["fp-1", "fp-2"] },
  { id: "fin-transaction-reconcile", labSlug: "finprocess-tech", projectIndex: 8, memberIds: ["fp-3", "fp-5"] },
  { id: "psy-self-regulation-diary", labSlug: "psy-tech", projectIndex: 0, memberIds: ["ps-1", "ps-3", "ps-4"] },
  { id: "psy-survey-platform", labSlug: "psy-tech", projectIndex: 1, memberIds: ["ps-2", "ps-3", "ps-6"] },
  { id: "psy-mindfulness-timers", labSlug: "psy-tech", projectIndex: 2, memberIds: ["ps-1", "ps-5"] },
  { id: "psy-burnout-tracker", labSlug: "psy-tech", projectIndex: 3, memberIds: ["ps-2", "ps-4", "ps-6"] },
  { id: "psy-psychometric-builder", labSlug: "psy-tech", projectIndex: 4, memberIds: ["ps-2", "ps-3", "ps-6"] },
  { id: "psy-freshman-support", labSlug: "psy-tech", projectIndex: 5, memberIds: ["ps-1", "ps-4", "ps-5"] },
  { id: "psy-safety-map", labSlug: "psy-tech", projectIndex: 6, memberIds: ["ps-2", "ps-3", "ps-6"] },
  { id: "psy-supervision-platform", labSlug: "psy-tech", projectIndex: 7, memberIds: ["ps-1", "ps-5", "ps-6"] },
  { id: "psy-anxiety-assistant", labSlug: "psy-tech", projectIndex: 8, memberIds: ["ps-3", "ps-4", "ps-5"] },
] satisfies LabProjectRegistryRecord[];

function createDefaultProjectLinks(record: LabProjectRegistryRecord): LabProjectLink[] {
  const linksCount = (record.projectIndex % 3) + 2;
  return Array.from({ length: linksCount }, (_, index) => ({
    url: `https://hub.example/${record.labSlug}/projects/${record.id}/link-${index + 1}`,
  }));
}

function createRegistryProject(record: LabProjectRegistryRecord): LabProjectRegistryItem | null {
  const labData = getLabBySlug(record.labSlug);
  const project = labData?.projects[record.projectIndex];

  if (!project) {
    return null;
  }

  return {
    ...project,
    id: record.id,
    labSlug: record.labSlug,
    projectIndex: record.projectIndex,
    memberIds: record.memberIds,
    links: record.links ?? createDefaultProjectLinks(record),
  };
}

export function getLabProjectsBySlug(slug: string): LabProjectRegistryItem[] {
  return projectRegistryRecords
    .filter((record) => record.labSlug === slug)
    .map(createRegistryProject)
    .filter((project): project is LabProjectRegistryItem => Boolean(project));
}

export function getLabProjectById(labSlug: string, projectId: string): LabProjectRegistryItem | undefined {
  return getLabProjectsBySlug(labSlug).find((project) => project.id === projectId);
}

export function getLabProjectIdByIndex(labSlug: string, projectIndex: number): string | undefined {
  return getLabProjectsBySlug(labSlug).find((project) => project.projectIndex === projectIndex)?.id;
}

export function getAllLabProjectParams(): { lab: string; project: string }[] {
  return projectRegistryRecords.map((record) => ({
    lab: record.labSlug,
    project: record.id,
  }));
}

export function getLabProjectIndexesByMemberId(slug: string, personId: string): number[] {
  return projectRegistryRecords
    .filter((record) => record.labSlug === slug && record.memberIds.includes(personId))
    .map((record) => record.projectIndex);
}
