"use client";

import { useEffect, useRef } from "react";
import "../../globals.css";
import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

type Card = { test: string };

export default function LabProjectsSlider() {
  const cardInfo: Card[] = [
    { test: "Hello World!" },
    { test: "Hello World!2" },
    { test: "Hello Worl31421d!3" },
    { test: "Hell1o3123123 World!4" },
  ];

  const slidesToRender =
    cardInfo.length <= 4 ? [...cardInfo, ...cardInfo, ...cardInfo, ...cardInfo, ...cardInfo] : cardInfo;

  const slidePairs: Card[][] = [];
  for (let i = 0; i < slidesToRender.length; i += 2) {
    slidePairs.push(slidesToRender.slice(i, i + 2));
  }

  const swiperRef = useRef<any>(null);
  const idleTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const stopAuto = () => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTimeRef.current = null;
  };

  const clearIdle = () => {
    if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = null;
  };

  const startAutoNow = () => {
    if (!swiperRef.current) return;
    stopAuto();
    lastTimeRef.current = null;
    const pxPerSec = 35;

    const step = (now: number) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const currentTranslate = swiper.getTranslate();
      const delta = -(pxPerSec * dt);
      swiper.setTranslate(currentTranslate + delta);
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);
  };

  const scheduleAuto = (delayMs = 10000) => {
    clearIdle();
    if (delayMs === 0) {
      startAutoNow();
      return;
    }

    idleTimeoutRef.current = window.setTimeout(() => {
      startAutoNow();
    }, delayMs);
  };

  useEffect(() => {
    return () => {
      stopAuto();
      clearIdle();
    };
  }, []);

  return (
    <div
      className="w-full labProjectsSlider"
      onPointerDownCapture={() => {
        stopAuto();
        clearIdle();
      }}
      onPointerUpCapture={() => {
        scheduleAuto();
      }}
      onPointerCancelCapture={() => {
        scheduleAuto();
      }}
    >
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={65}
        loop={true}
        centeredSlides={false}
        className="!pt-35 !pb-35 cursor-grab active:cursor-grabbing"
        grabCursor={true}
        simulateTouch={true}
        touchEventsTarget="container"
        freeMode={{ enabled: true, sticky: false, momentum: false }}
        modules={[FreeMode]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          scheduleAuto(0);
        }}
        onTouchStart={() => {
          stopAuto();
          clearIdle();
        }}
        onTouchEnd={() => {
          scheduleAuto();
        }}
      >
        {slidePairs.map((pair, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <div
              className={`flex flex-col items-center gap-12 ${
                index % 2 === 1 ? "translate-y-[40px]" : ""
              }`}
            >
              {pair.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="xl:w-[627px] sm:w-[450px] w-[300px] xl:h-[405px] sm:h-[250px] h-[220px] px-[12px] pt-[12px] pb-[12px] glass hover:![box-shadow:0px_0px_50px_#ffffff1a,_inset_0px_0px_50px_#ffffff1e] duration-200"
                >
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold select-none">{card.test}</h3>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

