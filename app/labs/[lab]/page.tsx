import type { Metadata } from "next";
import { getAllLabSlugs } from "../constants";
import Image from "next/image";

interface PageProps {
  params: Promise<{ lab: string }>;
}

// Генерация метаданных для каждой лаборатории
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lab } = await params;

  return {
    title: `${lab} | Студенческий Цифровой Хаб`,
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

  return (
    <main className="overflow-hidden">
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
      <section className="container !mt-[85px] !px-10 overflow-hidden">
        <div className="xl:flex justify-between min-h-[638px]">
          <div className="sm:!pt-[125px] pt-[30px]">
            <h1>ит-лаборатория</h1>
            <div className="flex items-center gap-4 mt-2">
              <Image src="/icons/person.svg" alt="" role="presentation" width={44} height={44} />
              <p className="sm:text-[24px] text-[16px] font-semibold font-unbounded leading-6">УЧАСТНИКОВ: 19</p>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/icons/layers.svg" alt="" role="presentation" width={44} height={44} />
              <p className="sm:text-[24px] text-[16px] font-semibold font-unbounded">ПРОЕКТОВ: 12</p>
            </div>
          </div>
          <div className="xl:relative -z-5 absolute xl:top-0 top-55 right-0">
            <Image src="/images/labs/labImageIT.svg" alt="" role="presentation" width={547} height={364} className="relative max-[440px]:-top-5 -top-20 w-full h-full origin-top-right"/>
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
      </section>
      <div className="h-500"></div>
    </main>
  );
}
