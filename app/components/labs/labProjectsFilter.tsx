"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { LabProjectRegistryItem } from "../../labs/constants";
import { useMediaQuery } from "../../hooks/use-media-query";
import CardProject from "./cardProject";

interface LabProjectsFilterProps {
  projects: LabProjectRegistryItem[];
  labSlug: string;
}

export default function LabProjectsFilter({
  projects,
  labSlug,
}: LabProjectsFilterProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxProjectCardHeight, setMaxProjectCardHeight] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const filtered = useMemo((): LabProjectRegistryItem[] => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [projects, query]);

  const cardsPerPage = isMobile ? 2 : 6;
  const pagedProjects = useMemo((): LabProjectRegistryItem[][] => {
    const pages: LabProjectRegistryItem[][] = [];
    for (let index = 0; index < filtered.length; index += cardsPerPage) {
      pages.push(filtered.slice(index, index + cardsPerPage));
    }
    return pages;
  }, [cardsPerPage, filtered]);
  const totalPages = Math.max(1, pagedProjects.length);

  useEffect(() => {
    swiperRef.current?.slideTo(0, 0);
  }, [cardsPerPage]);

  const hasPagination = totalPages > 1;
  const activePage = Math.min(currentPage, totalPages);
  const currentVisibleProjectsCount = hasPagination
    ? (pagedProjects[activePage - 1]?.length ?? 0)
    : (pagedProjects[0]?.length ?? 0);
  const needsExtraBottomSpacing = !isMobile && currentVisibleProjectsCount > 0 && currentVisibleProjectsCount < 3;
  const projectsGridClassName = `flex flex-wrap items-stretch justify-center gap-10 px-4 pt-10 ${
    needsExtraBottomSpacing ? "pb-45" : "pb-10"
  }`;

  const changePage = useCallback((nextPage: number): void => {
    if (nextPage === activePage) return;
    swiperRef.current?.slideTo(nextPage - 1);
  }, [activePage]);

  const handleSwiper = useCallback((swiper: SwiperType): void => {
    swiperRef.current = swiper;
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType): void => {
    setCurrentPage(swiper.activeIndex + 1);
  }, []);

  const handlePreviousPage = useCallback((): void => {
    changePage(Math.max(1, activePage - 1));
  }, [activePage, changePage]);

  const handleNextPage = useCallback((): void => {
    changePage(Math.min(totalPages, activePage + 1));
  }, [activePage, changePage, totalPages]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
    setCurrentPage(1);
    swiperRef.current?.slideTo(0, 0);
  }, []);

  useEffect(() => {
    const recalculateMaxCardHeight = (): void => {
      if (!rootRef.current) return;
      const cards = Array.from(rootRef.current.querySelectorAll<HTMLElement>("[data-project-card]"));
      if (cards.length === 0) {
        setMaxProjectCardHeight(0);
        return;
      }
      const nextMaxHeight = cards.reduce((maxHeight, card) => {
        const previousMinHeight = card.style.minHeight;
        card.style.minHeight = "0px";
        const naturalHeight = card.scrollHeight;
        card.style.minHeight = previousMinHeight;
        return Math.max(maxHeight, naturalHeight);
      }, 0);
      setMaxProjectCardHeight(Math.ceil(nextMaxHeight));
    };

    const rafId = window.requestAnimationFrame(recalculateMaxCardHeight);
    window.addEventListener("resize", recalculateMaxCardHeight);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", recalculateMaxCardHeight);
    };
  }, [cardsPerPage, filtered, currentPage, hasPagination]);

  return (
    <div ref={rootRef}>
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
            onChange={handleSearchChange}
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
              onSwiper={handleSwiper}
              onSlideChange={handleSlideChange}
            >
              {pagedProjects.map((pageProjects, pageIndex) => {
                const placeholderCount = isMobile
                  ? filtered.length % 2 !== 0 && pageIndex === pagedProjects.length - 1
                    ? 1
                    : 0
                  : Math.max(cardsPerPage - pageProjects.length, 0);
                return (
                  <SwiperSlide key={`${labSlug}-projects-page-${pageIndex}`}>
                    <div className={projectsGridClassName}>
                      {pageProjects.map((project, projectIndex) => (
                        <div
                          key={`${labSlug}-${project.id}-${pageIndex}-${projectIndex}`}
                          className="flex w-full max-w-[474px]"
                        >
                          <CardProject
                            title={project.title}
                            description={project.description}
                            minHeight={maxProjectCardHeight}
                            href={`/labs/${labSlug}/projects/${project.id}`}
                          />
                        </div>
                      ))}
                      {Array.from({ length: placeholderCount }, (_, placeholderIndex) => (
                        <div
                          key={`${labSlug}-placeholder-${pageIndex}-${placeholderIndex}`}
                          style={
                            maxProjectCardHeight ? { minHeight: `${maxProjectCardHeight}px` } : undefined
                          }
                          className="glass !bg-gradient-to-b from-[#afafaf30] to-[#6f6f6f40] min-h-[274px] w-full max-w-[474px] rounded-[34px] px-5 py-6 opacity-60 flex"
                          aria-hidden
                        />
                      ))}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <div className={projectsGridClassName}>
              {pagedProjects[0]?.map((project, index) => (
                <div key={`${labSlug}-${project.id}-${index}`} className="flex w-full max-w-[474px]">
                  <CardProject
                    title={project.title}
                    description={project.description}
                    minHeight={maxProjectCardHeight}
                    href={`/labs/${labSlug}/projects/${project.id}`}
                  />
                </div>
              ))}
            </div>
          )}
          {hasPagination ? (
            <div className="mb-10 flex items-center justify-center gap-4 px-4">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={activePage === 1}
                className="lab-projects-filter-prev glass flex h-[48px] w-[48px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Предыдущая страница проектов"
              >
                <i className="fas fa-chevron-left text-[16px]" />
              </button>
              <p className="min-w-[110px] text-center text-[14px] font-semibold text-white/80 md:text-[16px]">
                {activePage} / {totalPages}
              </p>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={activePage === totalPages}
                className="lab-projects-filter-next glass flex h-[48px] w-[48px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Следующая страница проектов"
              >
                <i className="fas fa-chevron-right text-[16px]" />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
