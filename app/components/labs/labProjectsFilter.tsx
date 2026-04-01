"use client";

import { useMemo, useState } from "react";
import type { LabProject } from "../../labs/constants";
import CardProject from "./cardProject";

interface LabProjectsFilterProps {
  projects: LabProject[];
  labSlug: string;
}

export default function LabProjectsFilter({ projects, labSlug }: LabProjectsFilterProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [projects, query]);

  return (
    <>
      <div className="mx-auto mt-5 w-full max-w-[1000px] px-4">
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/45"
            aria-hidden
          >
            <i className="fas fa-search shrink-0 text-[20px] leading-none" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск проекта"
            aria-label="Поиск проекта по названию или описанию"
            className="h-[50px] w-full rounded-2xl border border-white/40 bg-transparent py-2 pl-12 pr-4 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="relative z-3 px-4 py-12 text-center text-lg text-white/60">
          {projects.length === 0
            ? "В этой лаборатории пока нет проектов."
            : "По вашему запросу проекты не найдены. Попробуйте изменить фразу поиска."}
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 px-4 py-10">
          {filtered.map((project, index) => (
            <CardProject
              key={`${labSlug}-${project.title}-${index}`}
              title={project.title}
              description={project.description}
            />
          ))}
        </div>
      )}
    </>
  );
}
