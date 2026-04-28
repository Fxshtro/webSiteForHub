"use client";

import { useCallback, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import { homeAchievementSlides } from "../../../DataBase/main/home";
import type { HomeAchievementSlide } from "../../../DataBase/types";
import { useMediaQuery } from "../../hooks/use-media-query";
import CardAchievement from "../labs/cardAchievement";

const MIN_SLIDES_FOR_LOOP = 20;
const ACHIEVEMENT_CARD_MAX_WIDTH = 440;
const ACHIEVEMENT_MOBILE_VIEWPORT_PADDING = 48;
const FALLBACK_ACHIEVEMENT_SLIDES: HomeAchievementSlide[] = [
  {
    description: "Достижения скоро появятся.",
    date: "Скоро",
  },
];

export default function Lenta(): React.JSX.Element {
  const cardInfo = useMemo<HomeAchievementSlide[]>(() => {
    return homeAchievementSlides.length > 0 ? homeAchievementSlides : FALLBACK_ACHIEVEMENT_SLIDES;
  }, []);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [canSlidePrev, setCanSlidePrev] = useState(true);
  const [canSlideNext, setCanSlideNext] = useState(true);

  const slidesToRender = useMemo((): HomeAchievementSlide[] => {
    if (isMobile) {
      return cardInfo;
    }
    const merged: HomeAchievementSlide[] = [...cardInfo];
    while (cardInfo.length > 0 && merged.length < MIN_SLIDES_FOR_LOOP) {
      merged.push(...cardInfo);
    }
    return merged;
  }, [cardInfo, isMobile]);

  const syncNavigationVisibility = useCallback(
    (swiper: SwiperType): void => {
      if (!isMobile) {
        setCanSlidePrev(true);
        setCanSlideNext(true);
        return;
      }
      setCanSlidePrev(!swiper.isBeginning);
      setCanSlideNext(!swiper.isEnd);
    },
    [isMobile],
  );

  return (
    <div className="w-full select-none">
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={65}
        loop={!isMobile}
        loopAdditionalSlides={isMobile ? 0 : 2}
        loopPreventsSliding={isMobile}
        centeredSlides={true}
        grabCursor={true}
        className="!pt-12 md:!pt-20 !pb-35 select-none"
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
          <SwiperSlide key={`${card.date}-${index}`} className="!w-auto select-none">
            <div
              style={{
                width: `min(${ACHIEVEMENT_CARD_MAX_WIDTH}px, calc(100vw - ${ACHIEVEMENT_MOBILE_VIEWPORT_PADDING}px))`,
              }}
              className="md:[width:min(440px,calc(100vw-64px))]"
            >
              <CardAchievement
                description={card.description}
                date={card.date}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt ?? ""}
                className="max-w-none"
              />
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
