"use client";

import { useEffect, useMemo, useState } from "react";
import "../../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { homeAchievementSlides } from "../../../DataBase/main/home";

const MIN_SLIDES_FOR_LOOP = 20;

export default function Lenta(): React.JSX.Element {
  const cardInfo = homeAchievementSlides;
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
    setCanSlideNext(cardInfo.length > 1);
  }, [cardInfo.length, isMobile]);

  const slidesToRender = useMemo(() => {
    if (isMobile) {
      return cardInfo;
    }
    const merged: typeof cardInfo = [...cardInfo];
    while (merged.length < MIN_SLIDES_FOR_LOOP) {
      merged.push(...cardInfo);
    }
    return merged;
  }, [cardInfo, isMobile]);

  const syncNavigationVisibility = (swiper: SwiperType): void => {
    if (!isMobile) {
      setCanSlidePrev(true);
      setCanSlideNext(true);
      return;
    }
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  if (!isMounted) {
    return <div className="w-full select-none !pt-35 !pb-35" />;
  }

  return (
    <div className="w-full select-none">
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={65}
        loop={!isMobile}
        loopAdditionalSlides={isMobile ? 0 : 2}
        loopPreventsSliding={isMobile}
        watchSlidesProgress={!isMobile}
        observer={!isMobile}
        observeSlideChildren={!isMobile}
        centeredSlides={true}
        grabCursor={true}
        className="!pt-35 !pb-35 select-none"
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        onInit={syncNavigationVisibility}
        onSlideChange={syncNavigationVisibility}
        onResize={syncNavigationVisibility}
      >
        <button
          type="button"
          aria-label="Предыдущий слайд"
          className={`custom-prev !absolute left-2 top-1/2 !z-10 h-[44px] w-[44px] -translate-y-1/2 transform px-[8px] pb-[8px] pt-[8px] transition-opacity glass md:left-20 md:h-[60px] md:w-[60px] md:px-[12px] md:pb-[12px] md:pt-[12px] ${canSlidePrev ? "opacity-100" : "pointer-events-none opacity-0"} md:pointer-events-auto md:opacity-100`}
        >
          <div className="absolute left-[11px] top-[21px] h-0 w-0 -translate-y-1/2 rotate-90 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white md:left-[17.3px] md:top-[29.4px] md:border-l-[10px] md:border-r-[10px] md:border-t-[10px]" />
        </button>

        {slidesToRender.map((card, index) => (
          <SwiperSlide key={index} className="!w-auto select-none">
            <div className="w-[300px] md:w-[627px] h-[220px] md:h-[405px] px-[12px] pt-[12px] pb-[12px] glass hover:![box-shadow:0px_0px_50px_#ffffff1a,_inset_0px_0px_50px_#ffffff1e] duration-200">
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold select-none">{card.test}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <button
          type="button"
          aria-label="Следующий слайд"
          className={`custom-next !absolute right-2 top-1/2 !z-10 h-[44px] w-[44px] -translate-y-1/2 transform px-[8px] pb-[8px] pt-[8px] transition-opacity glass md:right-20 md:h-[60px] md:w-[60px] md:px-[12px] md:pb-[12px] md:pt-[12px] ${canSlideNext ? "opacity-100" : "pointer-events-none opacity-0"} md:pointer-events-auto md:opacity-100`}
        >
          <div className="absolute left-[15px] top-[21px] h-0 w-0 -translate-y-1/2 -rotate-90 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white md:left-[21.4px] md:top-[29px] md:border-l-[10px] md:border-r-[10px] md:border-t-[10px]" />
        </button>
      </Swiper>
    </div>
  );
}
