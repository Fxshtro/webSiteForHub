import type { Metadata } from "next";
import { getAllLabSlugs, getLabBySlug } from "../constants";
import Image from "next/image";
import { notFound } from "next/navigation";
import ScrollToTop from "../../components/ui/tapToTop";
import LabProjectsFilter from "../../components/labs/labProjectsFilter";
import LabAchievementsSlider from "../../components/labs/labAchievementsSlider";
import LabProjectsSlider from "../../components/labs/labProjectsSlider";
import LabPeopleDrawer from "../../components/labs/labPeopleDrawer";
import { getLabPeopleBySlug } from "../../../DataBase/labs/people";

interface PageProps {
  params: Promise<{ lab: string }>;
}

// Генерация метаданных для каждой лаборатории
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lab } = await params;
  const labData = getLabBySlug(lab);

  return {
    title: labData
      ? `${labData.name} | Студенческий Цифровой Хаб`
      : "Лаборатория | Студенческий Цифровой Хаб",
  };
}

// Генерация статических путей для всех лабораторий
export function generateStaticParams() {
  return getAllLabSlugs().map((slug) => ({
    lab: slug,
  }));
}

export default async function LabPage({ params }: PageProps) {
  const { lab } = await params;
  const labData = getLabBySlug(lab);
  if (!labData) notFound();
  const labPeople = getLabPeopleBySlug(labData.slug);

  return (
    <main className="overflow-hidden">
      <ScrollToTop />
      <LabPeopleDrawer people={labPeople} />
      {/* Hero Section */}
      <div className="absolute top-0 left-0 -z-10 h-[1100px] w-full bg-gradient-to-b from-[#1C1261] to-black"></div>
      <div className="absolute top-0 -z-10 w-full h-[700px] overflow-hidden">
        <Image
          src="/images/decor/space.svg"
          alt={lab}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Основной контент */}
      <section className="container !mt-[85px] !px-4 sm:!px-10 overflow-hidden">
        <div className="xl:flex justify-between min-h-[638px]">
          <div className="sm:!pt-[125px] pt-[30px]">
            <h1 className="mt-[38px] sm:mt-0">{labData.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Image src="/icons/person.svg" alt="" role="presentation" width={44} height={44} />
              <p className="sm:text-[24px] text-[16px] font-semibold font-unbounded leading-6">
                УЧАСТНИКОВ: {labPeople.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/icons/layers.svg" alt="" role="presentation" width={44} height={44} />
              <p className="sm:text-[24px] text-[16px] font-semibold font-unbounded">
                ПРОЕКТОВ: {labData.projects.length}
              </p>
            </div>
          </div>
          <div className="xl:relative -z-5 absolute xl:top-0 top-55 right-0">
            <Image src="/images/labs/labImageIT.svg" alt="" role="presentation" 
            width={547} height={364} 
            className="relative max-[440px]:-top-5 -top-20 w-full h-full origin-top-right"/>
          </div>
        </div>
      </section>
      <div className="absolute -z-3 left-1/2 top-[500px] -translate-x-1/2 xl:w-full w-[100vw] h-[250px] xl:h-[300px] overflow-hidden">
        <Image
          src="/images/decor/glists2.svg"
          alt=""
          role="presentation"
          fill
          sizes="100vw"
          className="scale-140"
        />
      </div>
      <section className="mt-7">
        <div className="flex justify-center">
          <div className="">
            <Image
              src="/images/ui/Paper.png"
              width={100}
              height={125}
              alt=""
              role="presentation"
              className="z-1"
              loading="lazy"
              sizes="100px"
            />
          </div>
        </div>
        <div id="projects" className="containerSlider relative">
          <h1 className="relative z-3 text-center">проекты</h1>
          <div className="lineClass"></div>
          <LabProjectsFilter projects={labData.projects} labSlug={labData.slug} />
          <Image
            src="/images/decor/group-206.svg"
            width={2200}
            height={813}
            alt=""
            role="presentation"
            loading="lazy"
            sizes="100vw"
            className="pointer-events-none absolute -z-3 left-1/2 top-[180px] min-w-[600px] -translate-x-1/2 md:max-w-[1000px] xl:max-w-[2000px]"
          />
        </div>
      </section>
      <section className="mt-7">
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
        <h1 className="relative z-3 text-center">достижения</h1>
        <div className="lineClass"></div>

        <div id="lab-achievements" className="containerSlider">
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
            <LabAchievementsSlider achievements={labData.achievements} />
            <Image
              src="/images/decor/Group%20207.svg"
              width={2200}
              height={813}
              alt=""
              role="presentation"
              loading="lazy"
              sizes="100vw"
              className="pointer-events-none absolute -z-3 left-1/2 -top-[100px] min-w-[600px] -translate-x-1/2 md:max-w-[1000px] xl:max-w-[2000px]"
            />
          </div>
        </div>

      </section>
      <section className="mt-7">
      <div className="relative z-3 mt-20 flex w-full justify-center">
        <Image
          src="/images/ui/Arrow.png"
          width={125}
          height={125}
          alt=""
          role="presentation"
          loading="lazy"
          sizes="125px"
        />
      </div>
        <h1 className="relative z-3 text-center">менеджеры и руководство</h1>
        <div className="lineClass"></div>
        <div className="containerSlider">
          <LabProjectsSlider />
        </div>
      </section>
    </main>
  );
}
