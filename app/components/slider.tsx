"use client";

import "../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Lenta() {
  const cardInfo = [
    { test: "Hello World!" },
    { test: "Hello World!2" },
    { test: "Hello Worl31421d!3" },
    { test: "Hell1o3123123 World!4" },
  ];

  const slidesToRender =
    cardInfo.length <= 4
      ? [...cardInfo, ...cardInfo, ...cardInfo, ...cardInfo, ...cardInfo]
      : cardInfo;

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
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
      >
        <button
          className="custom-prev !absolute md:left-20 left-5 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] px-[12px] pt-[12px] pb-[12px] !z-10 glass
                "
        >
          <div className="absolute left-[17.3px] top-[29.4px] -translate-y-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white rotate-90"></div>
        </button>
        {slidesToRender.map((card, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <div className="xl:w-[627px] sm:w-[450px] w-[300px] xl:h-[405px] sm:h-[250px] h-[220px] px-[12px] pt-[12px] pb-[12px] glass hover:![box-shadow:0px_0px_50px_#ffffff1a,_inset_0px_0px_50px_#ffffff1e] duration-200">
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold select-none">{card.test}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <button className="custom-next !absolute md:right-20 right-5 top-1/2 transform -translate-y-1/2 w-[60px] h-[60px] px-[12px] pt-[12px] pb-[12px] !z-10 glass">
          <div className="absolute left-[21.4px] top-[29px] -translate-y-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white -rotate-90"></div>
        </button>
      </Swiper>
    </div>
  );
}
