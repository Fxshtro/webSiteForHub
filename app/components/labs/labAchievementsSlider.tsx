"use client";

import "../../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { LabAchievement } from "../../labs/constants";
import CardAchievement from "./cardAchievement";

interface LabAchievementsSliderProps {
  achievements: LabAchievement[];
}

export default function LabAchievementsSlider({
  achievements,
}: LabAchievementsSliderProps): React.JSX.Element | null {
  if (achievements.length === 0) {
    return null;
  }

  const slidesToRender =
    achievements.length <= 4
      ? [...achievements, ...achievements, ...achievements, ...achievements, ...achievements]
      : achievements;

  return (
    <div className="w-full">
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={65}
        loop={true}
        centeredSlides={true}
        className="!pt-35 !pb-35"
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          prevEl: ".lab-achievements-prev",
          nextEl: ".lab-achievements-next",
        }}
      >
        <button
          type="button"
          aria-label="Предыдущий слайд"
          className="lab-achievements-prev !absolute md:left-20 left-5 top-1/2 z-10 h-[60px] w-[60px] -translate-y-1/2 transform px-[12px] pb-[12px] pt-[12px] glass"
        >
          <div className="absolute left-[17.3px] top-[29.4px] h-0 w-0 -translate-y-1/2 rotate-90 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
        </button>

        {slidesToRender.map((item, index) => (
          <SwiperSlide key={`${item.date}-${index}`} className="!w-auto">
            <div className="w-[min(676px,calc(100vw-48px))]">
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
          className="lab-achievements-next !absolute md:right-20 right-5 top-1/2 z-10 h-[60px] w-[60px] -translate-y-1/2 transform px-[12px] pb-[12px] pt-[12px] glass"
        >
          <div className="absolute left-[21.4px] top-[29px] h-0 w-0 -translate-y-1/2 -rotate-90 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-white" />
        </button>
      </Swiper>
    </div>
  );
}
