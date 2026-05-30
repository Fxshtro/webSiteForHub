import type { LabData } from "../types";
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

const labsBySlug = new Map<string, LabData>(labsData.map((lab) => [lab.slug, lab]));

export function getLabBySlug(slug: string): LabData | undefined {
  return labsBySlug.get(slug);
}

export function getAllLabSlugs(): string[] {
  return labsData.map((lab) => lab.slug);
}
