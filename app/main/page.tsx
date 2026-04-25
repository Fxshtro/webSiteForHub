"use client";

import Image from "next/image";
import IconStates from "../components/sections/IconStates";
import PieIco from "../components/sections/pie";
import Card from "../components/labs/card";
import Lenta from "../components/sections/slider";
import ManagerCard from "../components/sections/manager";
import ScrollToTop from "../components/ui/tapToTop";
import { getLabBySlug } from "../../DataBase/labs";
import { getLabPeopleBySlug } from "../../DataBase/labs/people";
import { homeAboutContent, homeLabs, homeManagers, homeStats } from "../../DataBase/main/home";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fallbackHomeAboutContent = {
  title: "О ХАБЕ",
  introText: "Описание хаба скоро появится.",
  missionText: "Информация о миссии хаба скоро появится.",
} as const;

const fallbackHomeStats = [
  {
    label: "Статистика скоро появится",
    icon: "/images/ui/icoHumans.svg",
    iconClassName: "absolute -z-3 -top-8.5 -left-12.5",
  },
] as const;

const fallbackHomeLabs = [
  {
    participants: 0,
    project: 0,
    img: "labIT.png",
    slug: "it-lab",
  },
] as const;

const fallbackHomeManagers = [
  {
    name: "Данные обновляются",
    title: "Руководитель",
    degree: "Информация появится позже",
    phone: "+7 (000) 000-00-00",
    email: "placeholder@iubip.ru",
    imageSrc: undefined,
  },
] as const;

const getSafeText = (value: string | undefined, fallback: string): string => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

export default function Home() {
  const aboutContent = {
    title: getSafeText(homeAboutContent?.title, fallbackHomeAboutContent.title),
    introText: getSafeText(homeAboutContent?.introText, fallbackHomeAboutContent.introText),
    missionText: getSafeText(homeAboutContent?.missionText, fallbackHomeAboutContent.missionText),
  };
  const stats = (homeStats.length > 0 ? homeStats : fallbackHomeStats).map((item, index) => ({
    label: getSafeText(item.label, `Статистика ${index + 1}`),
    icon: getSafeText(item.icon, fallbackHomeStats[0].icon),
    iconClassName: getSafeText(item.iconClassName, fallbackHomeStats[0].iconClassName),
  }));
  const labs = (homeLabs.length > 0 ? homeLabs : fallbackHomeLabs).map((lab, index) => ({
    participants: Number.isFinite(lab.participants) ? Math.max(0, lab.participants) : 0,
    project: Number.isFinite(lab.project) ? Math.max(0, lab.project) : 0,
    img: getSafeText(lab.img, fallbackHomeLabs[0].img),
    slug: getSafeText(lab.slug, fallbackHomeLabs[0].slug),
  }));
  const managers = (homeManagers.length > 0 ? homeManagers : fallbackHomeManagers).map((manager, index) => ({
    name: getSafeText(manager.name, `Руководитель ${index + 1}`),
    title: getSafeText(manager.title, fallbackHomeManagers[0].title),
    degree: getSafeText(manager.degree, fallbackHomeManagers[0].degree),
    phone: getSafeText(manager.phone, fallbackHomeManagers[0].phone),
    email: getSafeText(manager.email, `manager${index + 1}@iubip.ru`),
    imageSrc: manager.imageSrc,
  }));

  return (
    <main>
      <ScrollToTop />
      <div className="absolute top-0 left-0 -z-10 h-[1350px] w-full bg-gradient-to-b from-[#5F2FC3] to-black"></div>
      <div className="overflow-x-hidden">
        {/* Hero Section */}
        <div className="container relative flex !mt-[85px] !mb-[90px] md:h-[575px]">
          <div className="w-full xl:w-[59.5%]">
            <h1
              className="w-full text-center pt-[20px] mt-[108px] leading-6 md:leading-11
              bg-gradient-to-r from-[#ffffff] from-40% to-[#9a7bd4] to-90% bg-clip-text text-transparent
              [text-shadow:0px_4px_14px_#00000025]"
            >
              СТУДЕНЧЕСКИЙ
              <br />
              <span className="text-[20px] md:text-[30px] xl:text-[40px] font-bold">
                ЦИФРОВОЙ ХАБ
              </span>
            </h1>
            <div className="mx-auto mt-1.5 h-[3px] w-[200px] md:w-1/2 bg-gradient-to-l from-[#00000000] via-[#ffffffa0] to-[#00000000]"></div>
            <p className="w-full mt-10 text-center text-[17px] md:text-[24px] font-light leading-7">
              Открытая площадка для студенческих лабораторий.
              <br />
              <span className="font-medium">Исследуй, создавай, достигай вместе с нами!</span>
            </p>
            <div className="mt-20 flex w-full flex-row justify-center sm:mt-14 md:mt-7">
              <button
                className="px-[66px] py-[25px] text-[17px] font-medium
                bg-gradient-to-r from-[#31235C] via-[#6347b8] to-[#31235C]
                rounded-2xl [box-shadow:0px_0px_137px_#ffffff44,_inset_0px_0px_27px_#ffffff70]
                backdrop-blur-lg [text-shadow:0px_4px_5px_#00000025]
                duration-200
                hover:[box-shadow:0px_0px_150px_#ffffffa2,_inset_0px_0px_35px_#ffffff95]
                active:[box-shadow:0px_0px_150px_#0000006f,_inset_0px_0px_35px_#00000062]
                sm:px-[42px] sm:text-[24px] sm:py-[25px] sm:rounded-3xl"
              >
                ПРИСОЕДИНИТЬСЯ К ХАБУ
              </button>
            </div>
          </div>
          <Image
            src="/images/decor/figureV4.svg"
            width={1000}
            height={1280}
            alt=""
            role="presentation"
            loading="eager"
            priority
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 35vw"
            className="absolute -z-1 -top-50 md:-top-100 -right-40 sm:-right-70"
          />
        </div>

        {/* О хабе */}
        <div className="container">
          <div className="md:flex items-start">
            <div className="flex md:w-[50%]">
              <div className="glass !bg-[#0F0A1F99] ml-4 mr-4 mb-12 px-[25px] pt-[13px] pb-[22px] md:ml-22.5 md:mr-0 md:mb-22.5 sm:ml-12.5 sm:mr-12.5 md:max-w-[490px]">
                <div className="absolute -z-3 -top-4 -left-4 h-20 w-20 rounded-full bg-gradient-to-br from-[#ffffff] to-75%"></div>
                <p className="relative z-1 mb-3 flex">
                  <span className="xl:ml-10 ml-5 text-[28px] md:text-[30px] xl:text-[48px] font-black font-Unbounded">
                    {aboutContent.title}
                  </span>
                  <Image
                    src="/logos/logo.svg"
                    width={95}
                    height={45}
                    alt="Логотип"
                    className="ml-2 md:ml-4 w-[70px] md:w-[95px]"
                    loading="lazy"
                    sizes="(max-width: 640px) 70px, 95px"
                  />
                </p>
                <p className="relative z-1 text-[20px] md:text-[25px] xl:text-[32px] xl:leading-9">
                  {aboutContent.introText}
                </p>
              </div>
            </div>

            <div className="md:w-[50%]">
              <div className="glass !bg-[#0F0A1F99] ml-4 mr-4 md:mt-[165px] px-[25px] pt-[20px] pb-[20px] sm:ml-12.5 sm:mr-12.5 md:max-w-[520px]">
                <div className="absolute -z-3 -bottom-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-tl from-[#ffffff] to-75%"></div>
                <p className="relative z-1 text-[20px] md:text-[25px] xl:text-[32px] font-light xl:leading-9 md:text-justify [text-shadow:2px_2px_4px_#00000025]">
                  {aboutContent.missionText}
                </p>
              </div>
            </div>
          </div>

          <Image
            src="/images/decor/glists.svg"
            width={2000}
            height={1}
            alt=""
            role="presentation"
            className="absolute -z-3 left-1/2 top-[725px] -translate-x-1/2"
          />

          {/* Статистика */}
          <div className="mt-25 flex justify-center">
            <IconStates />
          </div>
          <h1 className="mt-[30px] text-center">СТАТИСТИКА</h1>
          <div className="mb-20 lineClass"></div>
          <div className="flex flex-wrap justify-center items-start gap-x-10 px-10 gap-y-12 md:gap-y-16 xl:gap-y-23">
            {stats.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className={`glass custom-before !rounded-2xl !bg-[#E9E3E620] px-[55px] py-[11.5px] text-center text-[16px] md:px-[75px] md:text-[26px] ${
                  index === 1 ? "xl:translate-y-13" : ""
                }`}
              >
                <div className="z-1">{item.label}</div>
                <Image
                  src={item.icon}
                  width={95}
                  height={1}
                  alt=""
                  role="presentation"
                  loading="lazy"
                  sizes="95px"
                  className={item.iconClassName}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Лаборатории */}
        <div id="laboratories" className="container relative overflow-visible">
          <div className="mt-20">
            <div className="flex justify-center overflow-visible">
              <PieIco />
            </div>
            <h1 className="w-full mt-[30px] text-center">
              НАШИ ЛАБ<span className="hover:bg-red-500">О</span>РАТОРИИ
            </h1>
            <div className="lineClass mb-10"></div>
            <div className="flex justify-center px-4">
              <div className="glass mb-10 max-w-[570px] px-[25px] pt-[20px] pb-[23px] ![box-shadow:inset_0px_0px_15px_#ffffff96]">
                <div className="absolute -z-3 -top-3 -left-3 h-[40px] w-[44px] rounded-full bg-gradient-to-br from-[#ffffff] to-75%"></div>
                <div className="absolute -z-3 -bottom-3 -right-3 h-[40px] w-[44px] rounded-full bg-gradient-to-tl from-[#ffffff] to-75%"></div>
                <p className="relative z-1 text-[20px] md:text-[25px] xl:text-[32px] font-bold leading-8">
                  Каждая лаборатория — это команда и своя экспертиза. Выбери направление по душе.
                </p>
              </div>
            </div>
            <div className="mx-auto">
              <div className="flex flex-wrap justify-center items-start gap-x-[93px] gap-y-[57px]">
                {labs.map((lab, index) => (
                  (() => {
                    const linkedLabData = getLabBySlug(lab.slug);
                    const participantsCount = getLabPeopleBySlug(lab.slug).length;
                    const projectsCount = linkedLabData?.projects.length ?? lab.project;
                    const labName = linkedLabData?.name ?? `Лаборатория ${index + 1}`;
                    return (
                  <Card
                    key={lab.slug}
                    name={labName}
                    participants={participantsCount}
                    project={projectsCount}
                    img={lab.img}
                    slug={lab.slug}
                  />
                    );
                  })()
                ))}
              </div>
            </div>

            <Image
              src="/images/decor/group-206.svg"
              width={2200}
              height={1}
              alt=""
              role="presentation"
              loading="lazy"
              className="absolute -z-3 left-1/2 top-[460px] min-w-[600px] md:max-w-[1000px] xl:max-w-[2000px] -translate-x-1/2"
            />
          </div>
        </div>

        {/* Достижения */}
        <div id="achievements" className="containerSlider">
          <div className="relative z-3 mt-20 flex w-full justify-center">
            <Image
              src="/images/ui/Star.png"
              width={125}
              height={125}
              alt=""
              role="presentation"
              loading="lazy"
              sizes="125px"
            />
          </div>
          <h1 className="relative z-3 text-center">Наши достижения</h1>
          <div className="lineClass"></div>
          <div className="relative h-full w-full">
            <div>
              <div className="absolute -left-10 -top-20 z-2 h-30 w-100 -rotate-20 bg-gradient-to-b from-[#000000] from-50% to-[#00000000]"></div>
              <div className="absolute left-0 top-0 z-1 h-full w-30 bg-gradient-to-r from-[#ffffff12] to-[#00000000] blur-lg md:w-80"></div>
              <div className="absolute -left-10 top-1/2 z-2 h-[120%] w-10 -translate-y-1/2 bg-black"></div>
              <div className="absolute -left-10 -bottom-20 z-2 h-30 w-100 rotate-20 bg-gradient-to-t from-[#000000] from-50% to-[#00000000]"></div>

              <div className="absolute -right-10 top-1/2 z-2 h-[120%] w-10 -translate-y-1/2 bg-black"></div>
              <div className="absolute -right-10 -top-20 z-2 h-30 w-100 rotate-20 bg-gradient-to-b from-[#000000] from-50% to-[#00000000]"></div>
              <div className="absolute right-0 top-0 z-1 h-full w-30 bg-gradient-to-l from-[#ffffff12] to-[#00000000] blur-lg md:w-80"></div>
              <div className="absolute -right-10 -bottom-20 z-2 h-30 w-100 -rotate-20 bg-gradient-to-t from-[#000000] from-50% to-[#00000000]"></div>
            </div>
            <Lenta />
          </div>
        </div>

        {/* Руководство */}
        <div id="leadership" className="container">
          <div className="relative z-3 flex w-full justify-center">
            <Image
              src="/images/ui/show.png"
              width={100}
              height={125}
              alt=""
              role="presentation"
              className="z-1"
              loading="lazy"
              sizes="100px"
            />
          </div>
          <h1 className="relative z-3 mt-5 text-center">Руководство</h1>
          <div className="lineClass"></div>
          <div className="mt-[70px] flex flex-wrap justify-center gap-x-[128px] gap-y-[60px]">
            {managers.map((manager, index) => (
              <ManagerCard
                key={`${manager.email}-${index}`}
                name={manager.name}
                title={manager.title}
                degree={manager.degree}
                phone={manager.phone}
                email={manager.email}
                imageSrc={manager.imageSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
