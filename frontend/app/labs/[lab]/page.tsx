import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import ScrollToTop from "../../components/ui/tapToTop";
import LabProjectsFilter from "../../components/labs/labProjectsFilter";
import LabAchievementsSlider from "../../components/labs/labAchievementsSlider";
import LabProjectsSlider from "../../components/labs/labProjectsSlider";
import LabPeopleDrawer from "../../components/labs/labPeopleDrawer";
import { fetchLabBySlug, fetchLabProjectsBySlug, fetchLabMembersByLabId, fetchLabAchievementsByLabId, fetchLabGuidesByLabId } from "../../../app/lib/api";
import type { LabPerson } from "../../../DataBase/labs/people";
import type { LabProjectRegistryItem, LabAchievement } from "../../../DataBase/types";

interface PageProps {
  params: Promise<{ lab: string }>;
}

export const dynamic = "force-dynamic";

function mapApiProjectsToRegistry(
  apiProjects: Awaited<ReturnType<typeof fetchLabProjectsBySlug>>,
  slug: string,
): LabProjectRegistryItem[] {
  return apiProjects.map((p, i) => ({
    id: `${slug}-project-${p.id}`,
    labSlug: slug,
    projectIndex: i,
    title: p.title,
    description: p.description ?? "",
    details: p.goal ?? "",
    memberIds: p.participants.map(pp => String(pp.student_id)),
    links: [],
  }));
}

function mapApiAchievements(
  apiAchievements: Awaited<ReturnType<typeof fetchLabAchievementsByLabId>>,
): LabAchievement[] {
  return apiAchievements.map(a => ({
    description: a.description ? `${a.title}\n\n${a.description}` : a.title,
    date: "",
    imageSrc: a.image_url ?? undefined,
    imageAlt: a.title,
  }));
}

function mapApiStudentsToLabPeople(
  apiStudents: Awaited<ReturnType<typeof fetchLabMembersByLabId>>,
  slug: string,
): LabPerson[] {
  return apiStudents.map((s) => {
    const uniqueRoles = [...new Set(s.projects.map(p => p.role).filter(Boolean))];
    return {
    id: `${slug}-student-${s.id}`,
    name: s.full_name,
    role: uniqueRoles.join(', ') || "Студент",
    directions: s.directions.map(d => d.title),
    projects: s.projects.map(p => ({
      projectId: `${slug}-project-${p.id}`,
      projectIndex: p.id,
      title: p.title,
      roles: [p.role],
    })),
    roles: uniqueRoles,
    metaverseUrl: s.metaverse_account_link ?? "",
    avatarIcon: "fa-user",
  };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lab } = await params;
  const labData = await fetchLabBySlug(lab);
  const title = labData
    ? `${labData.title} | Студенческий Цифровой Хаб`
    : "Лаборатория | Студенческий Цифровой Хаб";
  const description = labData
    ? `Проекты, участники и достижения направления ${labData.title} в Студенческом Цифровом Хабе.`
    : "Проекты, участники и достижения студенческой лаборатории.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ru_RU",
    },
  };
}

export default async function LabPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { lab } = await params;
  const labData = await fetchLabBySlug(lab);
  if (!labData) redirect("/main");
  const slug = labData.slug ?? lab;
  const labId = labData.id;

  const [apiProjects, apiStudents, apiAchievements, apiGuides] = await Promise.all([
    fetchLabProjectsBySlug(slug),
    fetchLabMembersByLabId(labId),
    fetchLabAchievementsByLabId(labId),
    fetchLabGuidesByLabId(labId),
  ]);

  const labPeople: LabPerson[] = mapApiStudentsToLabPeople(apiStudents, slug);
  const labProjects: LabProjectRegistryItem[] = mapApiProjectsToRegistry(apiProjects, slug);
  const peopleCount = labPeople.length;
  const projectsCount = labProjects.length;

  const heroImage = labData.images?.[0] ?? `/images/labs/labDefault.svg`;
  const achievements: LabAchievement[] = mapApiAchievements(apiAchievements);
  const leadership: LabAchievement[] = apiGuides.map(g => {
    const parts = [g.surname, g.name, g.patronymic].filter(Boolean).join(' ');
    const desc = [parts, g.position, g.description].filter(Boolean).join('\n\n');
    return {
      description: desc,
      date: g.laboratory_title,
      imageSrc: g.image_url ?? undefined,
      imageAlt: parts,
    };
  });

  return (
    <main className="overflow-hidden">
      <ScrollToTop />
      <LabPeopleDrawer labSlug={slug} people={labPeople} />
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
            <h1 className="mt-[38px] sm:mt-0">{labData.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Image src="/icons/person.svg" alt="" role="presentation" width={44} height={44} />
              <p className="sm:text-[24px] text-[16px] font-semibold font-unbounded leading-6">
                УЧАСТНИКОВ: {peopleCount}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Image src="/icons/layers.svg" alt="" role="presentation" width={44} height={44} />
              <p className="sm:text-[24px] text-[16px] font-semibold font-unbounded">
                ПРОЕКТОВ: {projectsCount}
              </p>
            </div>
          </div>
          <div className="xl:relative -z-5 absolute xl:top-0 top-55 right-0">
            <Image
              src={heroImage}
              alt=""
              role="presentation"
              width={547}
              height={364}
              sizes="(max-width: 768px) 70vw, 547px"
              className="relative max-[440px]:-top-5 -top-20 w-full h-full origin-top-right"
            />
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
          <LabProjectsFilter projects={labProjects} labSlug={slug} />
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

        {achievements.length > 0 ? (
          <div id="lab-achievements" className="containerSlider">
            <div className="relative h-full w-full">
              <div>
                <div className="absolute -left-10 -top-20 z-2 hidden h-30 w-100 -rotate-20 bg-gradient-to-b from-[#000000] from-50% to-[#00000000] md:block"></div>
                <div className="absolute -left-10 top-1/2 z-2 hidden h-[120%] w-10 -translate-y-1/2 bg-black md:block"></div>
                <div className="absolute -left-10 -bottom-20 z-2 hidden h-30 w-100 rotate-20 bg-gradient-to-t from-[#000000] from-50% to-[#00000000] md:block"></div>

                <div className="absolute -right-10 top-1/2 z-2 hidden h-[120%] w-10 -translate-y-1/2 bg-black md:block"></div>
                <div className="absolute -right-10 -top-20 z-2 hidden h-30 w-100 rotate-20 bg-gradient-to-b from-[#000000] from-50% to-[#00000000] md:block"></div>
                <div className="absolute -right-10 -bottom-20 z-2 hidden h-30 w-100 -rotate-20 bg-gradient-to-t from-[#000000] from-50% to-[#00000000] md:block"></div>
              </div>
              <LabAchievementsSlider achievements={achievements} />
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
        ) : (
          <div className="flex min-h-[200px] items-center justify-center px-4 py-10">
            <p className="relative z-3 text-center text-lg text-white/60">
              В этой лаборатории пока нет достижений.
            </p>
          </div>
        )}

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
        {leadership.length > 0 ? (
          <div className="containerSlider">
            <LabProjectsSlider items={leadership} />
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center px-4 py-10">
            <p className="relative z-3 text-center text-lg text-white/60">
              В этой лаборатории пока нет руководства.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
