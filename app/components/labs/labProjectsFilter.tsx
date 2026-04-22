"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { LabProject } from "../../labs/constants";
import CardProject from "./cardProject";

interface LabProjectsFilterProps {
  projects: LabProject[];
  labSlug: string;
}

export default function LabProjectsFilter({
  projects,
  labSlug,
}: LabProjectsFilterProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const swiperRef = useRef<SwiperType | null>(null);

  const filtered = useMemo((): LabProject[] => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [projects, query]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => {
      setIsMobile(media.matches);
    };

    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => {
      media.removeEventListener("change", updateViewport);
    };
  }, []);

  const cardsPerPage = isMobile ? 2 : 6;
  const pagedProjects = useMemo((): LabProject[][] => {
    const pages: LabProject[][] = [];
    for (let index = 0; index < filtered.length; index += cardsPerPage) {
      pages.push(filtered.slice(index, index + cardsPerPage));
    }
    return pages;
  }, [cardsPerPage, filtered]);
  const totalPages = Math.max(1, pagedProjects.length);

  useEffect(() => {
    setCurrentPage(1);
    swiperRef.current?.slideTo(0, 0);
  }, [query, cardsPerPage]);

  useEffect(() => {
    if (currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const hasPagination = totalPages > 1;

  const changePage = (nextPage: number): void => {
    if (nextPage === currentPage) return;
    swiperRef.current?.slideTo(nextPage - 1);
  };

  const handleSlideChange = (swiper: SwiperType): void => {
    setCurrentPage(swiper.activeIndex + 1);
  };

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
        <div className="flex min-h-[520px] items-center justify-center px-4 py-10 md:min-h-[650px]">
          <p className="relative z-3 text-center text-lg text-white/60">
            {projects.length === 0
              ? "В этой лаборатории пока нет проектов."
              : "По вашему запросу проекты не найдены. Попробуйте изменить фразу поиска."}
          </p>
        </div>
      ) : (
        <>
          {hasPagination ? (
            <Swiper
              className="lab-projects-filter-swiper w-full select-none"
              speed={500}
              onSwiper={(swiper): void => {
                swiperRef.current = swiper;
              }}
              onSlideChange={handleSlideChange}
            >
              {pagedProjects.map((pageProjects, pageIndex) => {
                const placeholderCount = isMobile
                  ? 0
                  : Math.max(cardsPerPage - pageProjects.length, 0);
                return (
                  <SwiperSlide key={`${labSlug}-projects-page-${pageIndex}`}>
                    <div className="flex flex-wrap justify-center gap-10 px-4 py-10">
                      {pageProjects.map((project, projectIndex) => (
                        <CardProject
                          key={`${labSlug}-${project.title}-${pageIndex}-${projectIndex}`}
                          title={project.title}
                          description={project.description}
                        />
                      ))}
                      {Array.from({ length: placeholderCount }, (_, placeholderIndex) => (
                        <div
                          key={`${labSlug}-placeholder-${pageIndex}-${placeholderIndex}`}
                          className="glass !bg-gradient-to-b from-[#afafaf30] to-[#6f6f6f40] min-h-[274px] w-full max-w-[474px] rounded-[34px] px-5 py-6 opacity-60"
                          aria-hidden
                        />
                      ))}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div className="flex flex-wrap justify-center gap-10 px-4 py-10">
              {pagedProjects[0]?.map((project, index) => (
                <CardProject
                  key={`${labSlug}-${project.title}-${index}`}
                  title={project.title}
                  description={project.description}
                />
              ))}
            </div>
          )}
          {hasPagination ? (
            <div className="mb-10 flex items-center justify-center gap-4 px-4">
              <button
                type="button"
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="lab-projects-filter-prev glass flex h-[48px] w-[48px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Предыдущая страница проектов"
              >
                <i className="fas fa-chevron-left text-[16px]" />
              </button>
              <p className="min-w-[110px] text-center text-[14px] font-semibold text-white/80 md:text-[16px]">
                {currentPage} / {totalPages}
              </p>
              <button
                type="button"
                onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="lab-projects-filter-next glass flex h-[48px] w-[48px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Следующая страница проектов"
              >
                <i className="fas fa-chevron-right text-[16px]" />
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
