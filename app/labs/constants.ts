export interface LabData {
  slug: string;
  name: string;
}

export const labsData: LabData[] = [
  {
    slug: "legal-tech",
    name: "Legal Tech",
  },
  {
    slug: "it-lab",
    name: "IT-лаборатория",
  },
  {
    slug: "inno-travel",
    name: "Inno Travel",
  },
  {
    slug: "finprocess-tech",
    name: "Finprocess Tech",
  },
  {
    slug: "psy-tech",
    name: "Psy Tech",
  },
];

export function getLabBySlug(slug: string): LabData | undefined {
  return labsData.find((lab) => lab.slug === slug);
}

export function getAllLabSlugs(): string[] {
  return labsData.map((lab) => lab.slug);
}
