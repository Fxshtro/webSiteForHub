"use client";

import { useEffect, useRef } from "react";
import "../../globals.css";
import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import CardAchievement from "./cardAchievement";

interface ManagerCardItem {
  description: string;
  date: string;
}

export default function LabProjectsSlider() {
  const cardInfo: ManagerCardItem[] = [
    {
      description:
        "Руководитель лаборатории: курирование проектных команд, согласование дорожных карт и связь с академией.",
      date: "14.04.2026",
    },
    {
      description:
        "Заместитель: организация воркшопов, менторство по продуктовой разработке и контроль сроков релизов.",
      date: "10.03.2026",
    },
    {
      description:
        "Менеджер проектов: планирование спринтов, коммуникация со стейкхолдерами и ведение документации.",
      date: "02.02.2026",
    },
    {
      description:
        "Координатор: приём заявок участников, распределение нагрузки между командами и поддержка онбординга.",
      date: "18.01.2026",
    },
  ];

  const slidesToRender =
    cardInfo.length <= 4 ? [...cardInfo, ...cardInfo, ...cardInfo, ...cardInfo, ...cardInfo] : cardInfo;

  const slidePairs: ManagerCardItem[][] = [];
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
        spaceBetween={30}
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
                <div key={cardIndex} className="w-[min(474px,calc(100vw-48px))] shrink-0">
                  <CardAchievement
                    description={card.description}
                    date={card.date}
                    className="max-w-none mx-0 w-full"
                    imageSizes="474px"
                    compact
                  />
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

