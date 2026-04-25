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

export function getLabBySlug(slug: string): LabData | undefined {
  return labsData.find((lab) => lab.slug === slug);
}

export function getAllLabSlugs(): string[] {
  return labsData.map((lab) => lab.slug);
}
