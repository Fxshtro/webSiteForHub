"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "../../globals.css";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { LeadershipSlideItem } from "../../../DataBase/types";
import { leadershipSliderItems } from "../../../DataBase/labs";
import CardAchievement from "./cardAchievement";

const DESKTOP_STATIC_CARDS_COUNT = 6;

export default function LabProjectsSlider() {
  const cardInfo = leadershipSliderItems;

  const shouldAnimate = cardInfo.length > 6;
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePage, setMobilePage] = useState(1);
  const mobileSwiperRef = useRef<SwiperType | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1);
  const offsetRef = useRef<number>(0);
  const minOffsetRef = useRef<number>(0);
  const maxOffsetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  const { topRowCards, bottomRowCards } = useMemo((): {
    topRowCards: LeadershipSlideItem[];
    bottomRowCards: LeadershipSlideItem[];
  } => {
    const top: LeadershipSlideItem[] = [];
    const bottom: LeadershipSlideItem[] = [];

    cardInfo.forEach((card, index) => {
      if (index < 6) {
        if (index % 2 === 0) {
          top.push(card);
          return;
        }
        bottom.push(card);
        return;
      }

      if ((index - 6) % 2 === 0) {
        bottom.push(card);
        return;
      }
      top.push(card);
    });

    return { topRowCards: top, bottomRowCards: bottom };
  }, [cardInfo]);
  const mobileCards = useMemo((): LeadershipSlideItem[] => cardInfo, [cardInfo]);
  const mobileCardsPerPage = 2;
  const mobilePages = useMemo((): LeadershipSlideItem[][] => {
    const pages: LeadershipSlideItem[][] = [];
    for (let index = 0; index < mobileCards.length; index += mobileCardsPerPage) {
      pages.push(mobileCards.slice(index, index + mobileCardsPerPage));
    }
    return pages;
  }, [mobileCards]);
  const mobileTotalPages = Math.max(1, mobilePages.length);

  const clearResumeTimer = (): void => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
  };

  const stopAnimation = (): void => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTimeRef.current = null;
  };

  const applyOffset = (offset: number): void => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const recalculateBounds = (): void => {
    const viewport = scrollViewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const cardWidth = Math.min(474, window.innerWidth - 48);
    const cardSlotWidth = cardWidth + 32;
    const topWidth =
      topRowCards.length * cardWidth +
      Math.max(topRowCards.length - 1, 0) * 32 +
      cardWidth / 2;
    const bottomWidth =
      bottomRowCards.length * cardWidth + Math.max(bottomRowCards.length - 1, 0) * 32;
    const contentWidth = Math.max(topWidth, bottomWidth);
    const rawMaxOffset = Math.max(contentWidth - viewport.clientWidth, 0);

    minOffsetRef.current = 0;
    maxOffsetRef.current = rawMaxOffset;
    offsetRef.current = Math.min(Math.max(offsetRef.current, minOffsetRef.current), maxOffsetRef.current);
    applyOffset(offsetRef.current);
  };

  const clampOffset = (value: number): number => {
    return Math.min(Math.max(value, minOffsetRef.current), maxOffsetRef.current);
  };

  const startAnimation = (): void => {
    if (!shouldAnimate) return;
    stopAnimation();
    lastTimeRef.current = null;
    const pxPerSecond = 24;

    const step = (now: number) => {
      if (!trackRef.current) return;

      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const delta = pxPerSecond * dt * directionRef.current;
      let nextOffset = offsetRef.current + delta;

      if (nextOffset >= maxOffsetRef.current) {
        nextOffset = maxOffsetRef.current;
        directionRef.current = -1;
      } else if (nextOffset <= minOffsetRef.current) {
        nextOffset = minOffsetRef.current;
        directionRef.current = 1;
      }

      offsetRef.current = nextOffset;
      applyOffset(nextOffset);

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);
  };

  const scheduleAutoResume = (): void => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      startAnimation();
    }, 15000);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!shouldAnimate) return;
    event.preventDefault();
    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    stopAnimation();
    clearResumeTimer();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!shouldAnimate || !isDraggingRef.current) return;
    const deltaX = event.clientX - dragStartXRef.current;
    const nextOffset = clampOffset(dragStartOffsetRef.current - deltaX);
    directionRef.current = nextOffset >= offsetRef.current ? 1 : -1;
    offsetRef.current = nextOffset;
    applyOffset(nextOffset);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!shouldAnimate) return;
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    scheduleAutoResume();
  };

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

  useEffect(() => {
    if (!isMobile) return;
    setMobilePage(1);
    mobileSwiperRef.current?.slideTo(0, 0);
  }, [isMobile]);

  useEffect(() => {
    if (mobilePage <= mobileTotalPages) return;
    setMobilePage(mobileTotalPages);
  }, [mobilePage, mobileTotalPages]);

  const changeMobilePage = (nextPage: number): void => {
    if (nextPage === mobilePage) return;
    mobileSwiperRef.current?.slideTo(nextPage - 1);
  };

  useEffect(() => {
    if (isMobile) {
      stopAnimation();
      clearResumeTimer();
      applyOffset(0);
      return;
    }

    if (!shouldAnimate) {
      stopAnimation();
      clearResumeTimer();
      applyOffset(0);
      return;
    }

    recalculateBounds();
    startAnimation();

    const observer = new ResizeObserver(() => {
      recalculateBounds();
    });

    if (scrollViewportRef.current) observer.observe(scrollViewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);

    return () => {
      observer.disconnect();
      stopAnimation();
      clearResumeTimer();
    };
  }, [isMobile, shouldAnimate, topRowCards.length, bottomRowCards.length]);

  if (isMobile) {
    return (
      <div className="w-full select-none labProjectsSlider !pt-20 !pb-20">
        {mobileTotalPages > 1 ? (
          <Swiper
            className="lab-projects-mobile-swiper w-full select-none"
            speed={500}
            onSwiper={(swiper): void => {
              mobileSwiperRef.current = swiper;
            }}
            onSlideChange={(swiper): void => {
              setMobilePage(swiper.activeIndex + 1);
            }}
          >
            {mobilePages.map((pageCards, pageIndex) => (
              <SwiperSlide key={`mobile-projects-page-${pageIndex}`}>
                <div className="grid grid-cols-1 gap-4 px-4">
                  {pageCards.map((card, index) => (
                    <div key={`${card.date}-mobile-${pageIndex}-${index}`} className="h-full w-full">
                      <CardAchievement
                        description={card.description}
                        date={card.date}
                        className="mx-0 h-full w-full max-w-none"
                        imageSizes="(max-width: 767px) 50vw, 474px"
                        compact
                      />
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 gap-4 px-4">
            {mobilePages[0]?.map((card, index) => (
              <div key={`${card.date}-mobile-single-${index}`} className="h-full w-full">
                <CardAchievement
                  description={card.description}
                  date={card.date}
                  className="mx-0 h-full w-full max-w-none"
                  imageSizes="(max-width: 767px) 50vw, 474px"
                  compact
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex items-center justify-center gap-4 px-4">
          <button
            type="button"
            onClick={() => changeMobilePage(Math.max(1, mobilePage - 1))}
            disabled={mobilePage === 1}
            className="lab-projects-mobile-prev glass flex h-[48px] w-[48px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Предыдущая страница карточек"
          >
            <i className="fas fa-chevron-left text-[16px]" />
          </button>
          <p className="min-w-[86px] text-center text-[14px] font-semibold text-white/80">
            {mobilePage} / {mobileTotalPages}
          </p>
          <button
            type="button"
            onClick={() => changeMobilePage(Math.min(mobileTotalPages, mobilePage + 1))}
            disabled={mobilePage === mobileTotalPages}
            className="lab-projects-mobile-next glass flex h-[48px] w-[48px] items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Следующая страница карточек"
          >
            <i className="fas fa-chevron-right text-[16px]" />
          </button>
        </div>
      </div>
    );
  }

  if (cardInfo.length <= DESKTOP_STATIC_CARDS_COUNT) {
    return (
      <div className="w-full select-none labProjectsSlider !pt-35 !pb-35">
        <div className="mx-auto grid max-w-[1490px] grid-cols-1 gap-8 px-4 md:grid-cols-2 xl:grid-cols-3">
          {cardInfo.map((card, index) => (
            <div key={`${card.date}-desktop-static-${index}`} className="h-full w-full justify-self-center xl:max-w-[474px]">
              <CardAchievement
                description={card.description}
                date={card.date}
                className="mx-0 h-full w-full max-w-none"
                imageSizes="474px"
                compact
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full select-none labProjectsSlider !pt-35 !pb-35">
      <div
        ref={scrollViewportRef}
        className={
          shouldAnimate
            ? "cursor-grab overflow-hidden select-none active:cursor-grabbing"
            : "overflow-visible select-none"
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={trackRef}
          className={`flex gap-8 ${
            shouldAnimate ? "w-max will-change-transform" : "w-full justify-center"
          }`}
          style={!shouldAnimate ? { transform: "none" } : undefined}
        >
          <div className="flex flex-col gap-12">
            <div
              className="flex gap-8"
              style={
                shouldAnimate
                  ? { marginLeft: "calc((min(474px, calc(100vw - 48px)) / 2) - min(474px, calc(100vw - 48px)) - 2rem)" }
                  : undefined
              }
            >
              <div className="glass h-full w-[min(474px,calc(100vw-48px))] shrink-0 rounded-2xl p-[10px]" />
              {topRowCards.map((card, index) => (
                <div
                  key={`${card.date}-top-${index}`}
                  className="h-full w-[min(474px,calc(100vw-48px))] shrink-0"
                >
                  <CardAchievement
                    description={card.description}
                    date={card.date}
                    className="mx-0 h-full w-full max-w-none"
                    imageSizes="474px"
                    compact
                  />
                </div>
              ))}
              <div className="glass h-full w-[min(474px,calc(100vw-48px))] shrink-0 rounded-2xl p-[10px]" />
            </div>
            <div
              className="flex gap-8"
            >
              {bottomRowCards.map((card, index) => (
                <div
                  key={`${card.date}-bottom-${index}`}
                  className="h-full w-[min(474px,calc(100vw-48px))] shrink-0"
                >
                  <CardAchievement
                    description={card.description}
                    date={card.date}
                    className="mx-0 h-full w-full max-w-none"
                    imageSizes="474px"
                    compact
                  />
                </div>
              ))}
              <div className="glass h-full w-[min(474px,calc(100vw-48px))] shrink-0 rounded-2xl p-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

