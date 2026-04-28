"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import type { LeadershipSlideItem } from "../../../DataBase/types";
import { useMediaQuery } from "../../hooks/use-media-query";
import CardAchievement from "./cardAchievement";

const DESKTOP_STATIC_CARDS_COUNT = 6;
const CARD_MAX_WIDTH = 474;
const CARD_GAP = 32;
const VIEWPORT_HORIZONTAL_PADDING = 48;

interface LabProjectsSliderProps {
  items: LeadershipSlideItem[];
}

export default function LabProjectsSlider({ items }: LabProjectsSliderProps): React.JSX.Element {
  const cardInfo = items;

  const shouldAnimate = cardInfo.length > 6;
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mobilePage, setMobilePage] = useState(1);
  const [maxMobileCardHeight, setMaxMobileCardHeight] = useState(0);
  const mobileSwiperRef = useRef<SwiperType | null>(null);
  const mobileRootRef = useRef<HTMLDivElement | null>(null);
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
  const mobileCardsPerPage = 2;
  const mobilePages = useMemo((): LeadershipSlideItem[][] => {
    const pages: LeadershipSlideItem[][] = [];
    for (let index = 0; index < cardInfo.length; index += mobileCardsPerPage) {
      pages.push(cardInfo.slice(index, index + mobileCardsPerPage));
    }
    return pages;
  }, [cardInfo]);
  const mobileTotalPages = Math.max(1, mobilePages.length);

  const clearResumeTimer = useCallback((): void => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
  }, []);

  const stopAnimation = useCallback((): void => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTimeRef.current = null;
  }, []);

  const applyOffset = useCallback((offset: number): void => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }, []);

  const recalculateBounds = useCallback((): void => {
    const viewport = scrollViewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const cardWidth = Math.min(CARD_MAX_WIDTH, window.innerWidth - VIEWPORT_HORIZONTAL_PADDING);
    const topWidth =
      topRowCards.length * cardWidth +
      Math.max(topRowCards.length - 1, 0) * CARD_GAP +
      cardWidth / 2;
    const bottomWidth =
      bottomRowCards.length * cardWidth + Math.max(bottomRowCards.length - 1, 0) * CARD_GAP;
    const contentWidth = Math.max(topWidth, bottomWidth);
    const rawMaxOffset = Math.max(contentWidth - viewport.clientWidth, 0);

    minOffsetRef.current = 0;
    maxOffsetRef.current = rawMaxOffset;
    offsetRef.current = Math.min(Math.max(offsetRef.current, minOffsetRef.current), maxOffsetRef.current);
    applyOffset(offsetRef.current);
  }, [applyOffset, bottomRowCards.length, topRowCards.length]);

  const clampOffset = useCallback((value: number): number => {
    return Math.min(Math.max(value, minOffsetRef.current), maxOffsetRef.current);
  }, []);

  const startAnimation = useCallback((): void => {
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
  }, [applyOffset, shouldAnimate, stopAnimation]);

  const scheduleAutoResume = useCallback((): void => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      startAnimation();
    }, 15000);
  }, [clearResumeTimer, startAnimation]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>): void => {
    if (!shouldAnimate) return;
    event.preventDefault();
    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    stopAnimation();
    clearResumeTimer();
  }, [clearResumeTimer, shouldAnimate, stopAnimation]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>): void => {
    if (!shouldAnimate || !isDraggingRef.current) return;
    const deltaX = event.clientX - dragStartXRef.current;
    const nextOffset = clampOffset(dragStartOffsetRef.current - deltaX);
    directionRef.current = nextOffset >= offsetRef.current ? 1 : -1;
    offsetRef.current = nextOffset;
    applyOffset(nextOffset);
  }, [applyOffset, clampOffset, shouldAnimate]);

  const handlePointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>): void => {
    if (!shouldAnimate) return;
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    scheduleAutoResume();
  }, [scheduleAutoResume, shouldAnimate]);

  useEffect(() => {
    if (!isMobile) return;
    const rafId = window.requestAnimationFrame(() => {
      setMobilePage(1);
      mobileSwiperRef.current?.slideTo(0, 0);
    });

    return (): void => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  useEffect(() => {
    if (mobilePage <= mobileTotalPages) return;
    const rafId = window.requestAnimationFrame(() => {
      setMobilePage(mobileTotalPages);
    });

    return (): void => {
      window.cancelAnimationFrame(rafId);
    };
  }, [mobilePage, mobileTotalPages]);

  useEffect(() => {
    if (!isMobile) {
      const rafId = window.requestAnimationFrame(() => {
        setMaxMobileCardHeight(0);
      });

      return (): void => {
        window.cancelAnimationFrame(rafId);
      };
    }

    if (typeof window === "undefined") {
      return;
    }

    const recalculateMobileCardHeight = (): void => {
      if (!mobileRootRef.current) return;
      const cards = Array.from(mobileRootRef.current.querySelectorAll<HTMLElement>("[data-leadership-mobile-card]"));
      if (cards.length === 0) {
        setMaxMobileCardHeight(0);
        return;
      }
      cards.forEach((card) => {
        card.style.minHeight = "";
      });
      const nextMaxHeight = cards.reduce((maxHeight, card) => {
        return Math.max(maxHeight, card.getBoundingClientRect().height);
      }, 0);
      setMaxMobileCardHeight(Math.ceil(nextMaxHeight));
    };

    const rafId = window.requestAnimationFrame(recalculateMobileCardHeight);
    window.addEventListener("resize", recalculateMobileCardHeight);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", recalculateMobileCardHeight);
    };
  }, [isMobile, mobilePages, mobileTotalPages]);

  const changeMobilePage = useCallback((nextPage: number): void => {
    if (nextPage === mobilePage) return;
    mobileSwiperRef.current?.slideTo(nextPage - 1);
  }, [mobilePage]);

  const handleMobileSwiper = useCallback((swiper: SwiperType): void => {
    mobileSwiperRef.current = swiper;
  }, []);

  const handleMobileSlideChange = useCallback((swiper: SwiperType): void => {
    setMobilePage(swiper.activeIndex + 1);
  }, []);

  const handlePreviousMobilePage = useCallback((): void => {
    changeMobilePage(Math.max(1, mobilePage - 1));
  }, [changeMobilePage, mobilePage]);

  const handleNextMobilePage = useCallback((): void => {
    changeMobilePage(Math.min(mobileTotalPages, mobilePage + 1));
  }, [changeMobilePage, mobilePage, mobileTotalPages]);

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
  }, [
    applyOffset,
    bottomRowCards.length,
    clearResumeTimer,
    isMobile,
    recalculateBounds,
    shouldAnimate,
    startAnimation,
    stopAnimation,
    topRowCards.length,
  ]);

  if (isMobile) {
    return (
      <div ref={mobileRootRef} className="w-full select-none labProjectsSlider !pt-12 !pb-20">
        {mobileTotalPages > 1 ? (
          <Swiper
            className="lab-projects-mobile-swiper w-full select-none"
            speed={500}
            onSwiper={handleMobileSwiper}
            onSlideChange={handleMobileSlideChange}
          >
            {mobilePages.map((pageCards, pageIndex) => (
              <SwiperSlide key={`mobile-projects-page-${pageIndex}`}>
                <div className="grid grid-cols-1 gap-4 px-4">
                  {pageCards.map((card, index) => (
                    <div
                      key={`${card.date}-mobile-${pageIndex}-${index}`}
                      data-leadership-mobile-card
                      style={maxMobileCardHeight ? { minHeight: `${maxMobileCardHeight}px` } : undefined}
                      className="h-full w-full"
                    >
                      <CardAchievement
                        description={card.description}
                        date={card.date}
                        className="mx-0 h-full w-full max-w-none"
                        imageSizes={`(max-width: 767px) 50vw, ${CARD_MAX_WIDTH}px`}
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
              <div
                key={`${card.date}-mobile-single-${index}`}
                data-leadership-mobile-card
                style={maxMobileCardHeight ? { minHeight: `${maxMobileCardHeight}px` } : undefined}
                className="h-full w-full"
              >
                <CardAchievement
                  description={card.description}
                  date={card.date}
                  className="mx-0 h-full w-full max-w-none"
                  imageSizes={`(max-width: 767px) 50vw, ${CARD_MAX_WIDTH}px`}
                  compact
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex items-center justify-center gap-4 px-4">
          <button
            type="button"
            onClick={handlePreviousMobilePage}
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
            onClick={handleNextMobilePage}
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
      <div className="w-full select-none labProjectsSlider !pt-20 !pb-35">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {topRowCards.map((card, index) => (
              <div
                key={`${card.date}-desktop-static-top-${index}`}
                className="h-full shrink-0"
                style={{ width: `min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px))` }}
              >
                <CardAchievement
                  description={card.description}
                  date={card.date}
                  className="mx-0 h-full w-full max-w-none"
                  imageSizes={`${CARD_MAX_WIDTH}px`}
                  compact
                />
              </div>
            ))}
          </div>
          {bottomRowCards.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {bottomRowCards.map((card, index) => (
                <div
                  key={`${card.date}-desktop-static-bottom-${index}`}
                  className="h-full shrink-0"
                  style={{ width: `min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px))` }}
                >
                  <CardAchievement
                    description={card.description}
                    date={card.date}
                    className="mx-0 h-full w-full max-w-none"
                    imageSizes={`${CARD_MAX_WIDTH}px`}
                    compact
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full select-none labProjectsSlider !pt-20 !pb-35">
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
          <div className="flex flex-col gap-12 pb-2">
            <div
              className="flex gap-8"
              style={
                shouldAnimate
                  ? {
                      marginLeft: `calc((min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px)) / 2) - min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px)) - 2rem)`,
                    }
                  : undefined
              }
            >
              <div
                className="glass h-full shrink-0 rounded-2xl p-[10px]"
                style={{ width: `min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px))` }}
              />
              {topRowCards.map((card, index) => (
                <div
                  key={`${card.date}-top-${index}`}
                  className="h-full shrink-0"
                  style={{ width: `min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px))` }}
                >
                  <CardAchievement
                    description={card.description}
                    date={card.date}
                    className="mx-0 h-full w-full max-w-none"
                    imageSizes={`${CARD_MAX_WIDTH}px`}
                    compact
                  />
                </div>
              ))}
              <div
                className="glass h-full shrink-0 rounded-2xl p-[10px]"
                style={{ width: `min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px))` }}
              />
            </div>
            <div
              className="flex gap-8"
            >
              {bottomRowCards.map((card, index) => (
                <div
                  key={`${card.date}-bottom-${index}`}
                  className="h-full shrink-0"
                  style={{ width: `min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px))` }}
                >
                  <CardAchievement
                    description={card.description}
                    date={card.date}
                    className="mx-0 h-full w-full max-w-none"
                    imageSizes={`${CARD_MAX_WIDTH}px`}
                    compact
                  />
                </div>
              ))}
              <div
                className="glass h-full shrink-0 rounded-2xl p-[10px]"
                style={{ width: `min(${CARD_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_HORIZONTAL_PADDING}px))` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

