"use client";

import { useEffect, useMemo, useState } from "react";
import "../../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import type { LabAchievement } from "../../labs/constants";
import CardAchievement from "./cardAchievement";

const MIN_SLIDES_FOR_LOOP = 24;
const ACHIEVEMENT_CARD_MAX_WIDTH = 440;
const ACHIEVEMENT_MOBILE_VIEWPORT_PADDING = 48;
const ACHIEVEMENT_DESKTOP_VIEWPORT_PADDING = 64;

interface LabAchievementsSliderProps {
  achievements: LabAchievement[];
}

export default function LabAchievementsSlider({
  achievements,
}: LabAchievementsSliderProps): React.JSX.Element | null {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canSlidePrev, setCanSlidePrev] = useState(true);
  const [canSlideNext, setCanSlideNext] = useState(true);

  useEffect((): (() => void) => {
    setIsMounted(true);
    const media = window.matchMedia("(max-width: 767px)");
    const updateViewport = (): void => {
      setIsMobile(media.matches);
    };

    updateViewport();
    media.addEventListener("change", updateViewport);

    return (): void => {
      media.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect((): void => {
    if (!isMobile) {
      setCanSlidePrev(true);
      setCanSlideNext(true);
      return;
    }
    setCanSlidePrev(false);
    setCanSlideNext(achievements.length > 1);
  }, [achievements.length, isMobile]);

  const syncNavigationVisibility = (swiper: SwiperType): void => {
    if (!isMobile) {
      setCanSlidePrev(true);
      setCanSlideNext(true);
      return;
    }
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  const slidesToRender = useMemo((): LabAchievement[] => {
    if (achievements.length === 0) {
      return [];
    }

    if (isMobile) {
      return achievements;
    }

    const merged: LabAchievement[] = [...achievements];
    while (merged.length < MIN_SLIDES_FOR_LOOP) {
      merged.push(...achievements);
    }
    return merged;
  }, [achievements, isMobile]);

  if (achievements.length === 0) {
    return null;
  }

  if (!isMounted) {
    return <div className="w-full select-none !pt-12 md:!pt-20 !pb-35" />;
  }

  return (
    <div className="relative w-full select-none">
      <div className="pointer-events-none absolute left-0 top-0 z-2 hidden h-full w-30 bg-gradient-to-r from-[#ffffff12] to-[#00000000] blur-lg md:block md:w-80" />
      <div className="pointer-events-none absolute right-0 top-0 z-2 hidden h-full w-30 bg-gradient-to-l from-[#ffffff12] to-[#00000000] blur-lg md:block md:w-80" />
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={100}
        loop={!isMobile}
        loopAdditionalSlides={isMobile ? 0 : 2}
        loopPreventsSliding={isMobile}
        centeredSlides={true}
        grabCursor={true}
        className="!pt-12 md:!pt-20 !pb-35 select-none"
        modules={[Navigation]}
        navigation={{
          prevEl: ".lab-achievements-prev",
          nextEl: ".lab-achievements-next",
        }}
        onInit={syncNavigationVisibility}
        onSlideChange={syncNavigationVisibility}
        onResize={syncNavigationVisibility}
      >
        <button
          type="button"
          aria-label="Предыдущий слайд"
          className={`lab-achievements-prev !absolute left-2 top-1/2 z-10 h-[44px] w-[44px] -translate-y-1/2 transform px-[8px] pb-[8px] pt-[8px] transition-opacity glass md:left-20 md:h-[60px] md:w-[60px] md:px-[12px] md:pb-[12px] md:pt-[12px] ${canSlidePrev ? "opacity-100" : "pointer-events-none opacity-0"} md:pointer-events-auto md:opacity-100`}
        >
          <div className="absolute left-[11px] top-[21px] h-0 w-0 -translate-y-1/2 rotate-90 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white md:left-[17.3px] md:top-[29.4px] md:border-l-[10px] md:border-r-[10px] md:border-t-[10px]" />
        </button>

        {slidesToRender.map((item, index) => (
          <SwiperSlide key={`${item.date}-${index}`} className="!w-auto select-none">
            <div
              style={{
                width: `min(${ACHIEVEMENT_CARD_MAX_WIDTH}px, calc(100vw - ${ACHIEVEMENT_MOBILE_VIEWPORT_PADDING}px))`,
              }}
              className="md:[width:min(440px,calc(100vw-64px))]"
            >
              <CardAchievement
                description={item.description}
                date={item.date}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt ?? ""}
                className="max-w-none"
              />
            </div>
          </SwiperSlide>
        ))}

        <button
          type="button"
          aria-label="Следующий слайд"
          className={`lab-achievements-next !absolute right-2 top-1/2 z-10 h-[44px] w-[44px] -translate-y-1/2 transform px-[8px] pb-[8px] pt-[8px] transition-opacity glass md:right-20 md:h-[60px] md:w-[60px] md:px-[12px] md:pb-[12px] md:pt-[12px] ${canSlideNext ? "opacity-100" : "pointer-events-none opacity-0"} md:pointer-events-auto md:opacity-100`}
        >
          <div className="absolute left-[15px] top-[21px] h-0 w-0 -translate-y-1/2 -rotate-90 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white md:left-[21.4px] md:top-[29px] md:border-l-[10px] md:border-r-[10px] md:border-t-[10px]" />
        </button>
      </Swiper>
    </div>
  );
}
