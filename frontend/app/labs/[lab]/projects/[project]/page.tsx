import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LabAchievementsSlider from "../../../../components/labs/labAchievementsSlider";
import LabPeopleDrawer from "../../../../components/labs/labPeopleDrawer";
import ScrollToTop from "../../../../components/ui/tapToTop";
import type { LabAchievement } from "../../../../../DataBase/types";
import {
  fetchLabBySlug,
  fetchLabProjectById,
  fetchLabMembersByLabId,
  fetchProjectAchievementsByProjectId,
} from "../../../../lib/api";
import { getLabBySlug } from "../../../../../DataBase/labs";
import { getLabPeopleBySlug } from "../../../../../DataBase/labs/people";
import { getAllLabProjectParams } from "../../../../../DataBase/labs/projects";

export const dynamic = "force-dynamic";

const LAB_TITLE_PNG_BY_SLUG: Record<string, string> = {
  "legal-tech": "/images/labs/labImageLEGAL.png",
  "it-lab": "/images/labs/labImageIT.png",
  "inno-travel": "/images/labs/labImageTRAVEL.png",
  "finprocess-tech": "/images/labs/labImageFINP.png",
  "psy-tech": "/images/labs/labImagePSY.png",
};

interface ProjectPageProps {
  params: Promise<{ lab: string; project: string }>;
}

interface ProjectInfoCardProps {
  iconClassName: string;
  title: string;
  children: React.ReactNode;
}

export function generateStaticParams(): { lab: string; project: string }[] {
  return getAllLabProjectParams();
}

function getLabTitleImageSrc(slug: string, fallbackSrc: string): string {
  if (!isLabTitleImageSlug(slug)) {
    return fallbackSrc;
  }

  return LAB_TITLE_PNG_BY_SLUG[slug];
}

function isLabTitleImageSlug(slug: string): slug is keyof typeof LAB_TITLE_PNG_BY_SLUG {
  return Object.hasOwn(LAB_TITLE_PNG_BY_SLUG, slug);
}

async function fetchProjectByCompositeId(lab: string, project: string) {
  const numericId = parseInt(project.replace(`${lab}-project-`, ""), 10);
  if (isNaN(numericId)) return null;
  return fetchLabProjectById(numericId);
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { lab, project } = await params;
  const [apiLabData, projectData] = await Promise.all([
    fetchLabBySlug(lab),
    fetchProjectByCompositeId(lab, project),
  ]);
  const labName = apiLabData?.title ?? getLabBySlug(lab)?.name ?? lab;
  const title = projectData
    ? `${projectData.title} | ${labName}`
    : "Проект | Студенческий Цифровой Хаб";
  const description = projectData?.description ?? "Страница проекта студенческой лаборатории.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "ru_RU",
    },
  };
}

function ProjectInfoCard({
  iconClassName,
  title,
  children,
}: ProjectInfoCardProps): React.JSX.Element {
  return (
    <section className="glass !bg-gradient-to-b from-[#afafaf30] to-[#6f6f6f40] px-5 py-6">
      <h2 className="font-unbounded flex items-center gap-3 text-[22px] font-black uppercase text-white md:text-[26px]">
        <i className={`fas ${iconClassName} text-[20px] text-white/80`} />
        {title}
      </h2>
      <div className="mt-5 text-[16px] leading-7 text-white/80 md:text-[18px]">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps): Promise<React.JSX.Element> {
  const { lab, project } = await params;
  const [apiLabData, projectData] = await Promise.all([
    fetchLabBySlug(lab),
    fetchProjectByCompositeId(lab, project),
  ]);
  const mockLabData = getLabBySlug(lab);
  const labData = apiLabData ?? mockLabData;

  if (!labData || !projectData) {
    redirect("/main");
  }

  const slug = lab;
  const labName = apiLabData?.title ?? mockLabData?.name ?? slug;
  const labHeroImage = apiLabData?.images?.[0] ?? mockLabData?.heroImageSrc ?? "";

  const [apiMembers, apiProjectAchievements] = apiLabData
    ? await Promise.all([
        fetchLabMembersByLabId(apiLabData.id),
        fetchProjectAchievementsByProjectId(projectData.id),
      ])
    : [ [] as Awaited<ReturnType<typeof fetchLabMembersByLabId>>,
        [] as Awaited<ReturnType<typeof fetchProjectAchievementsByProjectId>> ];

  const labPeople = apiMembers.length > 0
    ? apiMembers.map((s) => {
        const currentRoles = s.projects
          .filter(p => p.id === projectData.id)
          .map(p => p.role)
          .filter(Boolean);
        const roleStr = currentRoles.join(', ') || "Студент";
        return {
        id: `${slug}-student-${s.id}`,
        name: s.full_name,
        role: roleStr,
        directions: s.directions.map(d => d.title),
        projects: s.projects.map(p => ({
          projectId: `${slug}-project-${p.id}`,
          projectIndex: p.id,
          title: p.title,
          roles: [p.role],
        })),
        roles: currentRoles,
        metaverseUrl: s.metaverse_account_link ?? "",
        avatarIcon: "fa-user",
      }})
    : getLabPeopleBySlug(slug);

  const projectMemberIds = new Set(projectData.participants.map(p => p.student_id));
  const projectPeople = labPeople.filter((person) => {
    const idNum = parseInt(person.id.replace(`${slug}-student-`, ""), 10);
    return projectMemberIds.has(idNum);
  });

  const projectAchievements: LabAchievement[] = apiProjectAchievements.length > 0
    ? apiProjectAchievements.map(a => ({
        description: a.description ? `${a.title}\n\n${a.description}` : a.title,
        date: "",
        imageSrc: a.image_url ?? undefined,
        imageAlt: a.title,
      }))
    : [];
  const labTitleImageSrc = getLabTitleImageSrc(slug, labHeroImage);

  return (
    <main className="overflow-hidden pb-24">
      <ScrollToTop />
      <LabPeopleDrawer labSlug={`${slug}:${projectData.id}`} people={projectPeople} />

      <div className="absolute top-0 left-0 -z-10 h-[1100px] w-full bg-gradient-to-b from-[#1C1261] to-black" />
      <div className="absolute top-0 -z-10 h-[700px] w-full overflow-hidden">
        <Image
          src="/images/decor/space.svg"
          alt=""
          role="presentation"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <section className="container !mt-[85px] !px-4 pt-12 sm:!px-10 md:pt-20">
        <Link
          href={`/labs/${slug}#projects`}
          className="glass custom-before mt-4 inline-flex items-center gap-3 !rounded-2xl !bg-[#afafaf30] px-5 py-3 text-[14px] font-bold uppercase text-white/85 duration-200 hover:text-white"
        >
          <i className="fas fa-arrow-left text-[13px]" />
          к проектам
        </Link>

        <div className="mt-10 max-w-[980px]">
          <div className="flex items-center gap-1.5">
            <p className="font-unbounded text-[16px] font-black uppercase text-white/60">
              {labName}
            </p>
            <Image
              src={labTitleImageSrc}
              alt=""
              role="presentation"
              unoptimized
              width={120}
              height={86}
              className="h-[46px] w-auto object-contain md:h-[58px]"
            />
          </div>
          <h1 className="mt-3 text-left">{projectData.title}</h1>
          <p className="mt-6 max-w-[820px] text-[18px] leading-8 text-white/75 md:text-[22px]">
            {projectData.description}
          </p>
        </div>
      </section>

      <section className="container relative !px-4 pt-28 sm:!px-10 md:pt-36">
        <div className="mt-20 grid gap-6 md:mt-28 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="grid gap-6">
            <ProjectInfoCard iconClassName="fa-align-left" title="Описание">
              <p>{projectData.goal}</p>
            </ProjectInfoCard>
          </div>

          <div className="grid gap-6">
            <ProjectInfoCard iconClassName="fa-users" title="Команда">
              <div id="team" className="grid gap-3">
                {projectPeople.length > 0 ? projectPeople.map((person) => (
                  <article key={person.id} className="glass custom-before !rounded-2xl !bg-[#afafaf30] px-4 py-3">
                    <p className="font-bold text-white">{person.name}</p>
                    <p className="mt-1 text-[14px] text-white/65">{person.role}</p>
                  </article>
                )) : (
                  <p className="text-white/60">Участники не назначены.</p>
                )}
              </div>
            </ProjectInfoCard>
          </div>
        </div>

        {projectData.links.length > 0 && (
          <section className="mt-12">
            <h2 className="font-unbounded text-[30px] font-black uppercase text-white md:text-[38px]">
              ссылки
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {projectData.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass custom-before !rounded-2xl !bg-[#afafaf30] px-5 py-4 text-white/85 duration-200 hover:![box-shadow:0px_0px_50px_#ffffff44,_inset_0px_0px_50px_#ffffff56]"
                >
                  <span className="font-bold">{link.title}</span>
                  <span className="ml-2 text-[14px] text-white/50 break-all">{link.url}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {projectAchievements.length > 0 && (
          <section className="mt-16">
            <h2 className="font-unbounded text-center text-[34px] font-black uppercase text-white md:text-[48px]">
              достижения
            </h2>
            <div className="lineClass" />
            <div className="relative left-1/2 w-screen max-w-[1900px] -translate-x-1/2">
              <LabAchievementsSlider achievements={projectAchievements} />
              <Image
                src="/images/decor/group-206.svg"
                width={2200}
                height={813}
                alt=""
                role="presentation"
                loading="lazy"
                sizes="100vw"
                className="pointer-events-none absolute -z-3 left-1/2 top-[0px] min-w-[600px] -translate-x-1/2 md:max-w-[1000px] xl:max-w-[2000px]"
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
